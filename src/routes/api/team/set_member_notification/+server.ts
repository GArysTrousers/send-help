import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { sql } from '$lib/db';
import { permission } from '$lib/auth.js';

const schema = {
	body: z.object({
		userId: z.string(),
		teamId: z.number(),
		type: z.enum(['notifyOnNew', 'notifyOnUpdate', 'notifyOnAssignment']),
		value: z.number(),
	}),
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());
	try {
		sql.set(
			`UPDATE user_team 
      SET ${body.type} = :value
      WHERE userId = :userId 
      AND teamId = :teamId`,
			{
				value: body.value,
				userId: body.userId,
				teamId: body.teamId,
			},
		);
	} catch (e) {
		console.log(e);
	}

	return json({});
};
