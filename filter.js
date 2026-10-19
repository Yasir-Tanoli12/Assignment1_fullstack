// Search & filter by issue keyword, status and priority
export const filterTickets = (tickets, { keyword, status, priority }) => {
  const word = keyword.trim().toLowerCase();

  return tickets.filter(({ issue, status: s, priority: p }) => {
    const matchesKeyword = word === "" || issue.toLowerCase().includes(word);
    const matchesStatus = status === "All" || s === status;
    const matchesPriority = priority === "All" || p === priority;
    return matchesKeyword && matchesStatus && matchesPriority;
  });
};
