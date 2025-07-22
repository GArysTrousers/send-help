import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { produce } from 'sveltekit-sse';
import { v4 as uuid } from "uuid";
import { eventEmitters } from '$lib/notify';

export const POST: RequestHandler = async ({ request, url, locals }) => {
	try {
      console.log('new connection');
		return produce(async ({ emit }) => {
      eventEmitters.add(emit)
			return () => {
				eventEmitters.delete(emit)
			};
		});
	} catch (e) {
		console.log(e);
		error(500);
	}
};
