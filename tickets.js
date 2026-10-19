// Manage tickets: array of objects + array methods
import { Ticket } from "./ticket.js";

let tickets = [];
let nextId = 1;

export const getTickets = () => [...tickets];

export const findTicket = (id) => tickets.find((t) => t.id === id);

export const addTicket = (data) => {
  const ticket = new Ticket({ id: nextId++, ...data });
  tickets = [...tickets, ticket];
  return ticket;
};

export const updateTicket = (id, changes) => {
  tickets = tickets.map((t) => (t.id === id ? new Ticket({ ...t, ...changes }) : t));
};

export const deleteTicket = (id) => {
  tickets = tickets.filter((t) => t.id !== id);
};
