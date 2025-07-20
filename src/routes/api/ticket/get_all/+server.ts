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

	//TODO: viewCompleted

	if (body.viewCompleted) {
		return json(sql.get(`SELECT * FROM ticket`));
	} else {
		return json(
			sql.get(
				`SELECT * FROM ticket
        WHERE statusId < 4`,
			),
		);
	}
};
