<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Heading, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import type { DbTicket } from '$lib/types/db';
	import TicketTable from '$lib/comp/TicketTable.svelte';
	import AdminTicketEditor from '$lib/comp/AdminTicketEditor.svelte';

	let { data } = $props();

	let tickets: DbTicket[] = $state([]);
	let editor = $state({
		open: false,
		data: {
			ticketId: 0
		}
	});
	let creator = $state({
		open: false,
		data: {}
	});
	let viewMax = $state(15);

	onMount(async () => {
		await getData();
		const onLoadViewTicket = Number($page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
	});

	async function getData() {
		tickets = await api('/api/ticket/get_all');
	}

	async function viewTicketDetails(id: number) {
		editor.data.ticketId = id;
		editor.open = true;
		$page.url.searchParams.set('', String(editor.data.ticketId));
		goto($page.url);
	}
</script>

<div class="w-full max-w-5xl flex-col gap-3">
	<div class="hidden sm:block">
		<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
			<div class="flex-row">
				<Heading tag="h3" class="px-2">Tickets</Heading>
			</div>
		</div>
	</div>
	<TicketTable
		bind:tickets
		onNewClicked={() => (creator.open = true)}
		onTicketClicked={viewTicketDetails}
		bind:viewMax
		defaultTeams={data.user.teams}
	/>
</div>

<Modal bind:open={creator.open}>
	<TicketCreator
		onSubmit={() => {
			creator.open = false;
			getData();
		}}
	/>
</Modal>

<Modal
	bind:open={editor.open}
	outsideclose={true}
	on:close={() => {
		$page.url.searchParams.delete('');
		goto($page.url);
	}}
>
	<AdminTicketEditor
		bind:ticketId={editor.data.ticketId}
		refresh={async () => {
			getData();
		}}
	/>
</Modal>
