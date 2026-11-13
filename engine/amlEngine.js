// Basic demo helper: identify a closed loop in a list of transfers.
// A detected loop is a lead for review, not proof of money laundering.
function findCircularFlows(transactions) {
  const edges = transactions.map(t => ({ from: t.from, to: t.to, id: t.id, amount: t.amount }));
  const loops = [];
  for (const first of edges) {
    const second = edges.find(e => e.from === first.to && e.to !== first.from);
    if (!second) continue;
    const third = edges.find(e => e.from === second.to && e.to === first.from);
    if (third) loops.push([first, second, third]);
  }
  return loops;
}

module.exports = { findCircularFlows };
