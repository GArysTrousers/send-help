import type { DbTicket } from './db';

export interface Ticket extends DbTicket {
	assigned: string[];
}
