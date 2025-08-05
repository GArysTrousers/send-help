<script lang="ts">
	import { api } from '$lib/api';
	import { onDestroy, onMount } from 'svelte';
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import TicketTable from '$lib/comp/AdminTicketTable.svelte';
	import AdminTicketEditor from '$lib/comp/AdminTicketEditor.svelte';
	import Fa from 'svelte-fa';
	import { faRefresh } from '@fortawesome/free-solid-svg-icons';
	import type { TicketFilter } from '$lib/comp/sorting.js';
	import { source } from 'sveltekit-sse';
	import { addToast, removeToast } from '$lib/toast.svelte.js';
	import type { Unsubscriber } from 'svelte/store';
	import { stores } from '$lib/stores.svelte.js';
	import type { Ticket } from '$lib/types/db-ext.js';

	let { data } = $props();

	let notificationAudio: HTMLAudioElement | undefined;

	let tickets: Ticket[] = $state([]);
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
		filter.viewCompleted;
		getData();
	});

	let eventUnsub: Unsubscriber | undefined;

	onMount(async () => {
		notificationAudio = new Audio('/audio/notification01.mp3');
		const onLoadViewTicket = Number(page.url.searchParams.get(''));
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
		eventUnsub = source('/api/events')
			.select('ticket-update')
			.subscribe((v) => {
				try {
					let data = JSON.parse(v);
					if (stores.user?.userId === data.updater) return;
					let ticket = tickets.find((v) => v.ticketId === data.ticketId);
					if (ticket) {
						if (stores.user && stores.user.teams.includes(ticket.teamId)) {
							addToast('info', `Ticket #${ticket.ticketId} Updated`, {
								duration: 60000,
								onClick: (id) => {
									viewTicketDetails(ticket.ticketId);
									removeToast(id);
								},
							});
							if (notificationAudio) notificationAudio.play();
              getData();
						}
					}
				} catch (e) {}
			});
	});
	onDestroy(() => {
		if (eventUnsub) eventUnsub();
	});

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

<div class="w-full max-w-7xl flex-col gap-3">
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
