import type { DbTicket, DbUser } from '$lib/types/db';

export interface TicketFilter {
	show: boolean;
	search: string;
	teams: number[];
	viewCompleted: boolean;
}

export type Sorter<T> = (a: T, b: T) => number;

export const sortTicketById: Sorter<DbTicket> = (a, b) => {
	return a.ticketId - b.ticketId;
};

export const sortByPriority: Sorter<DbTicket> = (a, b) => {
	return b.priority - a.priority;
};

export const sortByRisk: Sorter<DbTicket> = (a, b) => {
	return b.risk - a.risk;
};

export const sortUserById: Sorter<DbUser> = (a, b) => {
	return a.userId.localeCompare(b.userId);
};
