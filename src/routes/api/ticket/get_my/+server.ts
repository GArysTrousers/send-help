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
	permission(locals.session);
	let body = schema.body.parse(await request.json());

	if (body.viewCompleted) {
		return json(
			sql.get(
				`SELECT * FROM ticket
        WHERE owner = :userId`,
				{ userId: locals.session.data.user.userId },
			),
		);
	} else {
		return json(
			sql.get(
				`SELECT * FROM ticket
        WHERE statusId < 4 
        AND owner = :userId`,
				{ userId: locals.session.data.user.userId },
			),
		);
	}
};
