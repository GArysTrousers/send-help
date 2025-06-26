<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Heading, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { DbUser } from '$lib/types/db';
	import UserTable from '$lib/comp/UserTable.svelte';

	let users: DbUser[] = $state([]);
	let profile = $state({
		open: false,
		data: {
			userId: 0
		}
	});
	let viewMax = $state(15);

	onMount(async () => {
		await getData();
		const onLoadViewTicket = Number($page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewUserDetails(onLoadViewTicket);
		}
	});

	async function getData() {
		users = await api('/api/user/get_all');
	}

	async function viewUserDetails(id: number) {
		profile.data.userId = id;
		profile.open = true;
		$page.url.searchParams.set('', String(profile.data.userId));
		goto($page.url);
	}
</script>

<div class="w-full max-w-5xl flex-col gap-3">
	<div class="hidden sm:block">
		<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
			<div class="flex-row">
				<Heading tag="h3" class="px-2">Users</Heading>
			</div>
		</div>
	</div>
	<UserTable bind:users bind:viewMax />
</div>

<Modal
	bind:open={profile.open}
	outsideclose={true}
	on:close={() => {
		$page.url.searchParams.delete('');
		goto($page.url);
	}}
></Modal>
