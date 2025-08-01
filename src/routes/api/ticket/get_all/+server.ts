import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '$lib/db';
import { permission } from '$lib/auth';
import z from 'zod';

const schema = {
	body: z.object({
		viewCompleted: z.boolean().default(false),
	}),
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());

	let tickets = [];
	let assigned = sql.get(`SELECT * FROM user_assigned`);

	if (body.viewCompleted) {
		tickets = sql.get(`SELECT * FROM ticket`);
	} else {
		tickets = sql.get(
			`SELECT * FROM ticket
        WHERE statusId < 4`,
		);
	}

	return json(
		tickets.map((t) => ({ ...t, assigned: assigned.filter((a) => a.ticketId === t.ticketId).map((a) => a.userId) })),
	);
};
