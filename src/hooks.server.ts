
import type { Handle } from '@sveltejs/kit';
import { InternalProvider, SessionManager } from "mega-session";

let sm = new SessionManager(
  new InternalProvider(), {
  cookieName: "session_id",
  version: "1",
  timeoutMillis: 1000000,
})
await sm.init()

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.session = await sm.startSession(event.cookies.get(sm.options.cookieName));
// console.log(event.locals.session);
  const response = await resolve(event);

  response.headers.set('set-cookie', await sm.saveSession(event.locals.session))

  return response;
};