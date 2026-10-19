// Ticket summary: totals for open, in-progress and closed
export const getSummary = (tickets) => {
  const summary = { Open: 0, "In Progress": 0, Closed: 0 };

  for (const { status } of tickets) {
    summary[status]++;
  }

  return summary;
};
