export class RiskEngine {
  calculateRiskScore(task: string): { score: number; reason: string; requiresUserApproval: boolean } {
    const query = task.toLowerCase();
    
    if (query.includes("delete") || query.includes("remove") || query.includes("rm -rf") || query.includes("drop table") || query.includes("wipe") || query.includes("destroy")) {
      return {
        score: 95,
        reason: "Critical destructive pattern: Requests deletion of database rows or terminal system directories.",
        requiresUserApproval: true
      };
    }
    
    if (query.includes("terminal") || query.includes("bash") || query.includes("sudo") || query.includes("execute command") || query.includes("ssh")) {
      return {
        score: 85,
        reason: "High risk system access: Terminal execution requested, bypassing direct sandbox.",
        requiresUserApproval: true
      };
    }

    if (query.includes("send mail") || query.includes("email") || query.includes("transmit payload")) {
      return {
        score: 60,
        reason: "Medium risk communications: Direct message propagation outwards.",
        requiresUserApproval: true
      };
    }

    if (query.includes("open") || query.includes("search") || query.includes("read page") || query.includes("summarize")) {
      return {
        score: 25,
        reason: "Low risk navigation: Operates inside secure sandboxed client viewport.",
        requiresUserApproval: false
      };
    }

    return {
      score: 40,
      reason: "Standard operational heuristic score.",
      requiresUserApproval: false
    };
  }
}
