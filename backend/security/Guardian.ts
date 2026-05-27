export interface BiometricMesh {
  faceMatchScore: number;
  voiceVerifyScore: number;
  typingPatternAccuracy: number;
  overallBiometricConfidence: number;
}

export interface AdaptiveTrustScore {
  deviceScore: number;
  behaviorScore: number;
  locationScore: number;
  biometricScore: number;
  cumulativeTrust: number;
}

export class Guardian {
  private laws = [
    "No file deletion outside active sandboxes",
    "No raw host terminal execution",
    "No financial billing/payments",
    "No background packages installations"
  ];

  private trustState: AdaptiveTrustScore = {
    deviceScore: 98,
    behaviorScore: 95,
    locationScore: 85,
    biometricScore: 100,
    cumulativeTrust: 96
  };

  private biometricMesh: BiometricMesh = {
    faceMatchScore: 97,
    voiceVerifyScore: 94,
    typingPatternAccuracy: 91,
    overallBiometricConfidence: 96
  };

  getLaws(): string[] {
    return this.laws;
  }

  getTrustState(): AdaptiveTrustScore {
    return this.trustState;
  }

  getBiometricMesh(): BiometricMesh {
    return this.biometricMesh;
  }

  mutateBiometricScores(updates: Partial<BiometricMesh>) {
    this.biometricMesh = {
      ...this.biometricMesh,
      ...updates
    };
    // Recompute overall biometric confidence average
    this.biometricMesh.overallBiometricConfidence = Math.round(
      (this.biometricMesh.faceMatchScore + 
       this.biometricMesh.voiceVerifyScore + 
       this.biometricMesh.typingPatternAccuracy) / 3
    );
    this.trustState.biometricScore = this.biometricMesh.overallBiometricConfidence;
    this.recomputeCumulativeTrust();
  }

  mutateTrustScores(updates: Partial<AdaptiveTrustScore>) {
    this.trustState = {
      ...this.trustState,
      ...updates
    };
    this.recomputeCumulativeTrust();
  }

  private recomputeCumulativeTrust() {
    this.trustState.cumulativeTrust = Math.round(
      (this.trustState.deviceScore * 0.3) +
      (this.trustState.behaviorScore * 0.3) +
      (this.trustState.locationScore * 0.1) +
      (this.trustState.biometricScore * 0.3)
    );
  }

  // Evaluate action safety against Constitution laws
  check(action: string): { allowed: boolean; lawViolation: string | null } {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("delete") || actionLower.includes("wipe") || actionLower.includes("destroy") || actionLower.includes("rm ")) {
      return {
        allowed: false,
        lawViolation: "Rule 1 Violation: Raw files delete instructions are blocked outside sandbox environments."
      };
    }

    if (actionLower.includes("sudo") || actionLower.includes("terminal") || actionLower.includes("exec") || actionLower.includes("sh ")) {
      return {
        allowed: false,
        lawViolation: "Rule 2 Violation: Raw host terminal script executions are prohibited."
      };
    }

    if (actionLower.includes("pay") || actionLower.includes("stripe") || actionLower.includes("buy")) {
      return {
        allowed: false,
        lawViolation: "Rule 3 Violation: Automated capitals/payments dispatching is disabled."
      };
    }

    if (actionLower.includes("install") || actionLower.includes("npm i") || actionLower.includes("pip install")) {
      return {
        allowed: false,
        lawViolation: "Rule 4 Violation: Background setup of third-party network modules is blocked."
      };
    }

    return {
      allowed: true,
      lawViolation: null
    };
  }

  // Direct allowance verification with Adaptive Risk levels
  verify(action: string, estimatedRisk: number): { authorized: boolean; requireBiometricClearance: boolean; reason: string } {
    const constitutionCheck = this.check(action);
    
    // Strict constitutional block
    if (!constitutionCheck.allowed) {
      return {
        authorized: false,
        requireBiometricClearance: true, // Let them clear via biometric handshake if sandbox override is possible!
        reason: constitutionCheck.lawViolation || "Action blocked by AI Constitution."
      };
    }

    // Risk threshold checks combined with adaptive trust scoring
    if (estimatedRisk > 80 && this.trustState.cumulativeTrust < 95) {
      return {
        authorized: false,
        requireBiometricClearance: true,
        reason: `HIGH RISK [${estimatedRisk}%]: Action risk rating exceeds direct execution threshold given cumulative trust rating of ${this.trustState.cumulativeTrust}%.`
      };
    }

    if (estimatedRisk > 50 && this.trustState.cumulativeTrust < 85) {
      return {
        authorized: false,
        requireBiometricClearance: true,
        reason: `MODERATE RISK [${estimatedRisk}%]: Low cumulative trust rating requires additional identity clearance.`
      };
    }

    return {
      authorized: true,
      requireBiometricClearance: false,
      reason: "Safe check approved. Cumulative parameters fall within safe tolerance boundaries."
    };
  }
}

const guardian = new Guardian();
export default guardian;
