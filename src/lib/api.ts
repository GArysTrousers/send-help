export async function api<T = any>(url: string, body = {}, fetchMethod = fetch): Promise<T> {
	const [res, data] = await fetchMethod(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	}).then(async (t) => [t, await t.json()]);
	if (!res.ok) {
		if ('message' in data) throw Error(data.message);
		throw Error(res.statusText);
	}
	return data as T;
}
