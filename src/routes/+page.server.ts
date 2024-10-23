import { permission } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  permission(locals.session);
  return { 
    session: locals.session,
  }
};