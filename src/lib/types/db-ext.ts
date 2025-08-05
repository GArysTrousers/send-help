import type { DbTicket, DbUser, DbUserTeam } from './db';

export interface Ticket extends DbTicket {
	assigned: string[];
}

export interface TeamMember extends DbUser, DbUserTeam {

}
