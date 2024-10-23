import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ZodError, z } from "zod";
import { authenticate } from "$lib/auth";

const schema = {
  body: z.object({
    username: z.string(),
    password: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, url, locals }) => {
  try {
    let body = schema.body.parse(await request.json());

    const user = await authenticate(body.username, body.password);
    
    if (user) {
      locals.session.data = {
        user
      }
      return json({})
    }
    throw error(401, "Username or password incorrect")
  } catch (e) {
    if (e instanceof ZodError) {
      console.log("Zod Error @", url.pathname, ...e.errors);
      throw error(400);
    }
    console.log(e);
    
    throw error(500)
  }
};