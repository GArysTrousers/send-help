import type { DbTicket, DbUser } from "$lib/types/db";

export type TicketSorter = (a:DbTicket, b:DbTicket) => number;
export type UserSorter = (a:DbUser, b:DbUser) => number;

export const sortTicketById: TicketSorter = (a, b) => {
  return a.ticketId - b.ticketId;
}

export const sortByPriority: TicketSorter = (a, b) => {
  return b.priority - a.priority;
}

export const sortByRisk: TicketSorter = (a, b) => {
  return b.risk - a.risk;
}

export const sortUserById: UserSorter = (a, b) => {
  return a.userId.localeCompare(b.userId);
}