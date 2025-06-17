import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ZodError, z } from "zod";
import { authenticate } from "$lib/auth";
import { sql } from "$lib/db";
import bcrypt from "bcryptjs";

const schema = {
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, url, locals }) => {
  try {
    let body = schema.body.parse(await request.json());

    const user = await authenticate(locals.session.data.user.userId, body.oldPassword);

    if (user === null) {
      throw error(401, "Password incorrect")
    }
    if (user.src !== 'local') {
      throw error(400, "User is not a local user")
    }
    sql.set(`UPDATE user SET passhash = :passhash WHERE userId = :userId`, {
      passhash: await bcrypt.hash(body.newPassword, 8),
      userId: locals.session.data.user.userId
    })
    return json({})

  } catch (e) {
    if (e instanceof ZodError) {
      console.log("Zod Error @", url.pathname, ...e.errors);
      throw error(400);
    }
    console.log(e);
    throw e;
  }
};