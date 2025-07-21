<script lang="ts">
	import { api } from '$lib/api';
	import { onDestroy, onMount } from 'svelte';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import type { DbTicket } from '$lib/types/db';
	import TicketTable from '$lib/comp/TicketTable.svelte';
	import AdminTicketEditor from '$lib/comp/AdminTicketEditor.svelte';
	import Fa from 'svelte-fa';
	import { faRefresh } from '@fortawesome/free-solid-svg-icons';
	import type { TicketFilter } from '$lib/comp/sorting.js';
	// import { RpcClient } from 'mega-rpc';

	let { data } = $props();

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
		teams: data.user.teams,
		viewCompleted: false,
	});
  $effect(() => {
    filter.viewCompleted
    getData()
  })
	// let notificationClient: RpcClient;

	onMount(async () => {
		const onLoadViewTicket = Number(page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
		// notificationClient = new RpcClient(new WS('ws://localhost:8080'), [
		// 	[
		// 		'update',
		// 		async (data) => {
		// 			console.log(data);
		// 		},
		// 	],
		// ]);
		// await new Promise((resolve) => {
		// 	notificationClient.ws.onopen = async () => {
		// 		resolve(true);
		// 	};
		// });
		// console.log(notificationClient.call('ping', {}));
	});

	// onDestroy(() => {
	// 	// remove rpc
	// });

	async function getData() {
		tickets = await api('/api/ticket/get_all', { viewCompleted: filter.viewCompleted });
	}

	async function viewTicketDetails(id: number) {
		editor.data.ticketId = id;
		editor.open = true;
		page.url.searchParams.set('', String(editor.data.ticketId));
		goto(page.url);
	}
</script>

<div class="w-full max-w-5xl flex-col gap-3">
	<div class="hidden sm:block">
		<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
			<div class="w-full flex-row justify-between">
				<Heading tag="h3" class="px-2">Tickets</Heading>
				<div class="mr-2 flex-row">
					<Button class="aspect-square p-1 text-xl" color="none" onclick={getData}><Fa icon={faRefresh} /></Button>
				</div>
			</div>
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
			priority: true,
			risk: true,
			team: true,
			type: true,
			owner: true,
			subject: true,
			status: true,
		}}
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
	onclose={() => {
		console.log('she closin');
		page.url.searchParams.delete('');
		goto(page.url);
	}}
>
	<AdminTicketEditor
		bind:ticketId={editor.data.ticketId}
		refresh={async () => {
			getData();
		}}
	/>
</Modal>
