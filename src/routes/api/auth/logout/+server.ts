import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals, url }) => {
  locals.session.logout = true
  return json({})
};