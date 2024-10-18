import { permission } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  permission(locals.session);
  return { session: locals.session }
};