import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db, onAuthStateChanged, isBypassActive } from "../lib/firebase";

export interface UserRoleProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "admin" | "premium" | "beta" | "guest" | "developer";
  approved: boolean;
  allowedDevices?: string[];
  createdAt?: string;
  lastLogin?: string;
  permissions?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("guest");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserRoleProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Map role to clear visual descriptions and permission settings
  const getPermissionLevels = useCallback((userRole: string, approved: boolean) => {
    const isOwner = user?.email === "guptarudra852@gmail.com";
    const resolvedRole = isOwner ? "admin" : userRole;
    
    const permissionsMap: { [key: string]: { clearance: string; capabilities: string[] } } = {
      admin: {
        clearance: "LEVEL-5 OMNI ACCESS [OWNER/ADMIN]",
        capabilities: [
          "MANAGE_USERS",
          "SYSTEM_OVERCLOCK",
          "VAULTSHIELD_BYPASS",
          "AI_MODEL_ROUTING",
          "EDIT_INTEGRATIONS",
          "MODIFY_PERSISTENT_MEMORY"
        ]
      },
      developer: {
        clearance: "LEVEL-4 DEV clearance [DEVELOPER]",
        capabilities: [
          "SYSTEM_DEBUG",
          "AI_MODEL_ROUTING",
          "EDIT_INTEGRATIONS",
          "VIEW_REALTIME_METRICS"
        ]
      },
      premium: {
        clearance: "LEVEL-3 ULTRA clearance [PREMIUM AGENT]",
        capabilities: [
          "AI_MODEL_ROUTING",
          "VIEW_REALTIME_METRICS",
          "UNRESTRICTED_VOICE_SPEECH"
        ]
      },
      beta: {
        clearance: "LEVEL-2 COGNITIVE ACCESS [BETA TESTER]",
        capabilities: [
          "VIEW_REALTIME_METRICS",
          "ACCELERATED_DIALOG_CACHE"
        ]
      },
      guest: {
        clearance: "LEVEL-1 MINIMAL clearance [FIELD AGENT]",
        capabilities: [
          "VIEW_REALTIME_METRICS"
        ]
      }
    };

    const roleData = permissionsMap[resolvedRole] || permissionsMap["guest"];
    
    // If not approved, strip all advanced capabilities and limit to Level-1 Read Only
    if (!approved && resolvedRole !== "admin") {
      return {
        clearance: "LEVEL-0 UNAPPROVED [SECURED SUSPENSION]",
        capabilities: ["VIEW_PUBLIC_METRICS"]
      };
    }

    return roleData;
  }, [user]);

  // Function to refresh the profile info manually
  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setRole("guest");
      setIsApproved(false);
      setProfile(null);
      setLoading(false);
      return;
    }

    setRefreshing(true);
    setError(null);
    try {
      const isSimulated = isBypassActive();
      if (isSimulated) {
        const isOwner = currentUser.email === "guptarudra852@gmail.com";
        const finalRole = isOwner ? "admin" : "developer";
        const finalApproved = true;
        const perms = getPermissionLevels(finalRole, finalApproved);
        const mappedProfile: UserRoleProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: finalRole,
          approved: finalApproved,
          allowedDevices: ["device_bypass_vector_0"],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: perms.capabilities
        };
        setProfile(mappedProfile);
        setRole(finalRole);
        setIsApproved(finalApproved);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const finalRole = data.role || "guest";
        const finalApproved = data.approved ?? false;
        const perms = getPermissionLevels(finalRole, finalApproved);

        const mappedProfile: UserRoleProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: finalRole,
          approved: finalApproved,
          allowedDevices: data.allowedDevices || [],
          createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : String(data.createdAt)) : undefined,
          lastLogin: data.lastLogin ? (data.lastLogin.seconds ? new Date(data.lastLogin.seconds * 1000).toISOString() : String(data.lastLogin)) : undefined,
          permissions: perms.capabilities
        };
        
        setProfile(mappedProfile);
        setRole(finalRole);
        setIsApproved(finalApproved);
      } else {
        const perms = getPermissionLevels("guest", false);
        const fallbackProfile: UserRoleProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: "guest",
          approved: false,
          permissions: perms.capabilities
        };
        setProfile(fallbackProfile);
        setRole("guest");
        setIsApproved(false);
      }
    } catch (err: any) {
      console.error("Error refreshing user profile roles & permissions via useAuth hook:", err);
      setError(err?.message || "Failed to fetch roles.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [getPermissionLevels]);

  useEffect(() => {
    setLoading(true);
    let unsubscribeSnap: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Automatically fetch role/profile
        await refreshProfile();
        
        // Live subscribe to active clearance state changes
        const isSimulated = isBypassActive();
        if (isSimulated) {
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeSnap = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const finalRole = data.role || "guest";
            const finalApproved = data.approved ?? false;
            const perms = getPermissionLevels(finalRole, finalApproved);

            setRole(finalRole);
            setIsApproved(finalApproved);
            setProfile(prev => {
              const base = prev || {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
              };
              return {
                ...base,
                role: finalRole,
                approved: finalApproved,
                allowedDevices: data.allowedDevices || [],
                permissions: perms.capabilities
              } as UserRoleProfile;
            });
          }
        }, (err) => {
          console.error("useAuth Profile Subscription error: ", err);
        });
      } else {
        setUser(null);
        setRole("guest");
        setIsApproved(false);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnap();
    };
  }, [refreshProfile, getPermissionLevels]);

  return {
    user,
    role,
    isApproved,
    profile,
    loading,
    refreshing,
    error,
    refreshProfile,
    clearanceLabel: getPermissionLevels(role, isApproved).clearance,
    capabilities: getPermissionLevels(role, isApproved).capabilities
  };
}
