<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Heading, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import ClientTicketEditor from '$lib/comp/ClientTicketEditor.svelte';
	import type { DbTicket } from '$lib/types/db';
	import TicketTable from '$lib/comp/TicketTable.svelte';
	import type { TicketFilter } from '$lib/comp/sorting';

	let tickets: DbTicket[] = $state([]);
	let editor = $state({
		open: false,
		data: {
			ticketId: 0,
		},
	});
	let creator = $state({
		open: false,
		data: {},
	});
	let viewMax = $state(15);

	let filter: TicketFilter = $state({
		search: '',
		show: false,
		teams: [],
		viewCompleted: false,
	});
  $effect(() => {
    filter.viewCompleted
    getData()
  })

	onMount(async () => {
		// await getData();
		const onLoadViewTicket = Number($page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
	});

	async function getData() {
		tickets = await api('/api/ticket/get_my', { viewCompleted: filter.viewCompleted });
	}

	async function viewTicketDetails(id: number) {
		editor.data.ticketId = id;
		editor.open = true;
		$page.url.searchParams.set('', String(editor.data.ticketId));
		goto($page.url);
	}
</script>

<div class="w-full max-w-5xl flex-col gap-3">
	<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
		<div class="flex-row">
			<Heading tag="h3" class="px-2">My Tickets</Heading>
		</div>
	</div>
	<TicketTable
		bind:tickets
		onNewClicked={() => (creator.open = true)}
		onTicketClicked={viewTicketDetails}
		bind:viewMax
		bind:filter
		showColumns={{
			ticketId: true,
			priority: false,
			risk: true,
			team: true,
			type: true,
			owner: false,
			subject: true,
			status: true,
		}}
	/>
</div>

<Modal title="New Ticket" bind:open={creator.open}>
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
	onclose={() => {
		$page.url.searchParams.delete('');
		goto($page.url);
	}}
>
	<ClientTicketEditor bind:ticketId={editor.data.ticketId} />
</Modal>
