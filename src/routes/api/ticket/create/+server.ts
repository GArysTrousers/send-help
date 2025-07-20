import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { sql } from '$lib/db';
import { permission } from '$lib/auth.js';
import { notifyTeamTicketCreated } from '$lib/notify';

const schema = {
	body: z.object({
		teamId: z.number(),
		typeId: z.number(),
		subject: z.string(),
		message: z.string(),
		priority: z.number(),
		risk: z.number(),
	}),
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session);
	let body = schema.body.parse(await request.json());
	try {
		const res = sql.set(
			`INSERT INTO ticket (teamId, typeId, subject, message, priority, risk, statusId, owner, created) 
      VALUES (:teamId, :typeId, :subject, :message, :priority, :risk, 1, :owner, :created)`,
			{
				...body,
				owner: locals.session.data.user.userId,
				created: Date.now(),
			},
		);
		notifyTeamTicketCreated(Number(res.lastInsertRowid));
	} catch (e) {
		console.log(e);
		error(500, 'Error creating ticket');
	}

	return json({});
};
