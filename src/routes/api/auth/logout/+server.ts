import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  locals.session.logout = true
  return json({})
};