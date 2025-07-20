import { SESSION_LENGTH } from '$env/static/private';
import { sql } from '$lib/db';
import { testMailer } from '$lib/email';
import { NodeSqliteProvider } from '$lib/node-sqlite-provider';
// import { notificationServer } from '$lib/notify';
import type { Handle } from '@sveltejs/kit';
import { SessionManager } from 'mega-session';

let sm = new SessionManager(new NodeSqliteProvider(sql.db), {
	cookieName: 'send_help_session_id',
	version: '1',
	timeoutMillis: Number(SESSION_LENGTH),
});
await sm.init();
await testMailer();
// notificationServer.clients

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = await sm.startSession(event.cookies.get(sm.options.cookieName));
	// console.log(event.locals.session);
	const response = await resolve(event);

	response.headers.set('set-cookie', await sm.saveSession(event.locals.session));

	return response;
};
