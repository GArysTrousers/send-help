import { CUSTOM_LOGIN_TITLE, CUSTOM_ORG_NAME } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ }) => {
	return {
    loginTitle: CUSTOM_LOGIN_TITLE,
		orgName: CUSTOM_ORG_NAME
	};
};