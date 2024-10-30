import type { DbTicket } from "$lib/types/db";

export type TicketSorter = (a:DbTicket, b:DbTicket) => number;

export const sortById: TicketSorter = (a, b) => {
  return a.ticketId - b.ticketId;
}

export const sortByPriority: TicketSorter = (a, b) => {
  return b.priority - a.priority;
}

export const sortByRisk: TicketSorter = (a, b) => {
  return b.risk - a.risk;
}