import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db, auth } from "./firebase";

// Prescribed Firestore Error Types
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standardized Firebase skill error diagnostic wrapper.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Admin Core] Firestore Error Trace:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Record interface from the schema/Admin page
export interface UserProfile {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  role?: "admin" | "premium" | "beta" | "guest" | "developer";
  approved?: boolean;
  allowedDevices?: string[];
  createdAt?: any; // Timestamp or Date
  lastLogin?: any; // Timestamp or Date
}

// Structured SignUp Activity and Node Statistics format
export interface UserSignupActivityStats {
  totalNodes: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  
  // Temporal velocity metrics
  registeredLast24h: number;
  registeredLast7d: number;
  registeredLast30d: number;
  
  // Distribution schemas
  roleDistribution: {
    admin: number;
    developer: number;
    premium: number;
    beta: number;
    guest: number;
    others: number;
  };
  
  authMethodDistribution: {
    emailPassword: number;
    googleSecure: number;
    phoneOtp: number;
    anonymous: number;
  };
  
  // Hardware/Device integration levels
  deviceBindingStats: {
    totalDevicesBound: number;
    nodesWithDevices: number;
    averageDevicesPerNode: number;
  };
  
  // Recent sign-up timeline (sorted newest to oldest)
  recentSignups: {
    uid: string;
    displayName: string;
    email?: string;
    role: string;
    createdAtString: string;
    provider: string;
  }[];
}

/**
 * Retrieves all user credentials documents from Firestore and constructs
 * comprehensive registration velocity, security, role, and auth statistics.
 */
export async function retrieveUserSignupActivityStats(): Promise<UserSignupActivityStats> {
  const path = "users";
  try {
    const usersCollection = collection(db, path);
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const users: UserProfile[] = [];
    snapshot.forEach((docSnap) => {
      users.push({
        uid: docSnap.id,
        ...docSnap.data()
      } as UserProfile);
    });
    
    return compileStatsFromUsers(users);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Compiles rich metrics from a raw list of user profiles.
 * This is split into a utility function to allow computing stats in real-time
 * from onSnapshot data as well as standard getDoc pulls.
 */
export function compileStatsFromUsers(users: UserProfile[]): UserSignupActivityStats {
  const now = new Date();
  
  let approvedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  
  let registeredLast24h = 0;
  let registeredLast7d = 0;
  let registeredLast30d = 0;
  
  const roleDistribution = {
    admin: 0,
    developer: 0,
    premium: 0,
    beta: 0,
    guest: 0,
    others: 0
  };
  
  const authMethodDistribution = {
    emailPassword: 0,
    googleSecure: 0,
    phoneOtp: 0,
    anonymous: 0
  };
  
  let totalDevicesBound = 0;
  let nodesWithDevices = 0;
  
  const recentSignups: UserSignupActivityStats["recentSignups"] = [];
  
  users.forEach(user => {
    // 1. Core Clearance count
    if (user.approved === true) {
      approvedCount++;
    } else if (user.approved === false) {
      rejectedCount++;
    } else {
      pendingCount++;
    }
    
    // 2. Role Distribution
    const role = user.role || "guest";
    if (role === "admin") roleDistribution.admin++;
    else if (role === "developer") roleDistribution.developer++;
    else if (role === "premium") roleDistribution.premium++;
    else if (role === "beta") roleDistribution.beta++;
    else if (role === "guest") roleDistribution.guest++;
    else roleDistribution.others++;
    
    // 3. Temporal calculations
    let createdDate: Date | null = null;
    if (user.createdAt) {
      if (user.createdAt instanceof Timestamp) {
        createdDate = user.createdAt.toDate();
      } else if (user.createdAt.seconds !== undefined) {
        createdDate = new Timestamp(user.createdAt.seconds, user.createdAt.nanoseconds).toDate();
      } else {
        createdDate = new Date(user.createdAt);
      }
    }
    
    if (createdDate && !isNaN(createdDate.getTime())) {
      const diffMs = now.getTime() - createdDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      
      if (diffDays <= 1) registeredLast24h++;
      if (diffDays <= 7) registeredLast7d++;
      if (diffDays <= 30) registeredLast30d++;
    }
    
    // 4. Authenticating Mechanism heuristic detection
    if (user.email && user.email.includes("@")) {
      // Could be Google authentication or normal email
      if (user.displayName && !user.phoneNumber) {
        authMethodDistribution.googleSecure++;
      } else {
        authMethodDistribution.emailPassword++;
      }
    } else if (user.phoneNumber) {
      authMethodDistribution.phoneOtp++;
    } else {
      authMethodDistribution.anonymous++;
    }
    
    // 5. Secure Device hash counters
    const devices = user.allowedDevices || [];
    if (devices.length > 0) {
      totalDevicesBound += devices.length;
      nodesWithDevices++;
    }
    
    // 6. Push to recent timeline if needed (limited to top 5)
    if (recentSignups.length < 5) {
      let createdStr = "Unknown Origin";
      if (createdDate) {
        createdStr = createdDate.toLocaleString();
      }
      
      let provider = "Email Uplink";
      if (user.phoneNumber) {
        provider = "SMS OTP Firewall";
      } else if (user.email && user.displayName && !user.phoneNumber) {
        provider = "Google Secure";
      } else if (!user.email && !user.phoneNumber) {
        provider = "Guest Uplink";
      }
      
      recentSignups.push({
        uid: user.uid,
        displayName: user.displayName || "ANONYMOUS CAPTAIN",
        email: user.email || user.phoneNumber || "No Address Link",
        role: role.toUpperCase(),
        createdAtString: createdStr,
        provider
      });
    }
  });
  
  const averageDevicesPerNode = users.length > 0 
    ? parseFloat((totalDevicesBound / users.length).toFixed(2)) 
    : 0;
    
  return {
    totalNodes: users.length,
    approvedCount,
    pendingCount,
    rejectedCount,
    registeredLast24h,
    registeredLast7d,
    registeredLast30d,
    roleDistribution,
    authMethodDistribution,
    deviceBindingStats: {
      totalDevicesBound,
      nodesWithDevices,
      averageDevicesPerNode
    },
    recentSignups
  };
}
