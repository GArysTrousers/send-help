<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import ClientTicketEditor from '$lib/comp/ClientTicketEditor.svelte';
	import type { DbTicket } from '$lib/types/db';
	import TicketTable from '$lib/comp/TicketTable.svelte';

	let tickets: DbTicket[] = [];
	let editor = {
		open: false,
		data: {
			ticketId: 0
		}
	};
	let creator = {
		open: false,
		data: {}
	};
	let viewMax = 15;

	onMount(async () => {
		await getData();
		const onLoadViewTicket = Number($page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
	});

	async function getData() {
		tickets = await api('/api/ticket/get_my');
	}

	async function viewTicketDetails(id: number) {
		editor.data.ticketId = id;
		editor.open = true;
		$page.url.searchParams.set('', String(editor.data.ticketId));
		goto($page.url);
	}
</script>

<div class="w-full max-w-5xl">
	<TicketTable
		bind:tickets
		onNewClicked={() => (creator.open = true)}
		onTicketClicked={viewTicketDetails}
		bind:viewMax
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
	on:close={() => {
		$page.url.searchParams.delete('');
		goto($page.url);
	}}
>
	<ClientTicketEditor
		bind:ticketId={editor.data.ticketId}
		refresh={async () => {
			getData();
		}}
	/>
</Modal>
