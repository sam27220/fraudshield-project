// Demo heuristic only. These thresholds are illustrative, not validated banking rules.
function calculateRisk(transaction) {
  let score = 0;
  const reasons = [];
  if (Number(transaction.amount) >= 20000) {
    score += 25;
    reasons.push("High-value transaction");
  }
  if (transaction.newBeneficiary) {
    score += 15;
    reasons.push("First-time beneficiary");
  }
  if (transaction.rapidActivity) {
    score += 20;
    reasons.push("Rapid transaction activity");
  }
  if (transaction.unusualHour) {
    score += 10;
    reasons.push("Unusual transaction hour");
  }
  if (transaction.possibleCircularFlow) {
    score += 25;
    reasons.push("Possible circular fund movement");
  }
  score = Math.min(score, 100);
  return {
    score,
    level: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
    reasons
  };
}

module.exports = { calculateRisk };
