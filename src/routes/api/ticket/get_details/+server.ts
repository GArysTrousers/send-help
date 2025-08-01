import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { sql } from '$lib/db';
import { permission } from '$lib/auth.js';
import type { DbTicket, DbUser } from '$lib/types/db';
import type { Ticket } from '$lib/types/db-ext';

const schema = {
	body: z.object({
		ticketId: z.number(),
	}),
};

export async function POST({ request, locals }) {
	permission(locals.session);
	let body = schema.body.parse(await request.json());
	try {
		const ticket = sql.getOne(
			`SELECT * FROM ticket
      WHERE ticketId = :ticketId`,
			body,
		);
		const assigned = sql.get(
			`SELECT userId FROM user_assigned
      WHERE ticketId = :ticketId`, body
		);
		const user = sql.getOne(
			`SELECT * FROM user
      WHERE userId = :userId`,
			{ userId: ticket.owner },
		);

		if (ticket.owner === locals.session.data.user.userId || locals.session.data.user.type === 'admin') {
			return json({ ticket: { ...ticket, assigned: assigned.map((v) => v.userId) }, user });
		}
		throw error(401, "You don't have permission to view this ticket");
	} catch (e) {
		console.log(e);
		throw error(500);
	}
}

export type TicketDetails = {
	ticket: Ticket;
	user: DbUser;
};
