<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import {
		Button,
		Heading,
		Modal,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { TableBodyRow } from 'flowbite-svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import TicketEditor from '$lib/comp/TicketEditor.svelte';

	let tickets: any[] = [];
	let searchedTickets: any[] = [];
	let search = '';
	let editor = {
		open: false,
		ticketId: ''
	};
	let creator = {
		open: false,
		data: {}
	};
	let viewMax = 15;

	$: {
		let searchLow = search.toLowerCase();
		searchedTickets =
			search === ''
				? tickets.slice(0, viewMax)
				: tickets
						.filter((v) => {
							return (
								v.user_id.toLowerCase().includes(searchLow) ||
								v.dn.toLowerCase().includes(searchLow) ||
								v.groups.toLowerCase().includes(searchLow)
							);
						})
						.slice(0, viewMax);
	}

	onMount(async () => {
		await getData();
		const onLoadViewTicket = $page.url.searchParams.get('');
		if (onLoadViewTicket) {
			viewTicketDetails(onLoadViewTicket);
		}
	});

	async function getData() {
		tickets = await api('/api/ticket/get_all');
	}

	async function viewTicketDetails(id: string) {
		editor.ticketId = id;
		editor.open = true;
		$page.url.searchParams.set('', editor.ticketId);
		goto($page.url);
	}
</script>

<div class="flex-col gap-3">
	<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
		<div class="flex-row">
			<Heading tag="h3" class="px-2">Tickets</Heading>
		</div>
		<div class="flex-row"></div>
	</div>
	<div class="flex-row items-center justify-between gap-3">
		<Search bind:value={search}></Search>
		<Button
			class="!p-3"
			on:click={() => {
				creator.open = true;
			}}><Fa icon={faPlus} size="lg" /></Button
		>
	</div>
	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>#</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Message</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody>
			{#if tickets.length > 0}
				{#each searchedTickets as t}
					<TableBodyRow class="cursor-pointer" on:click={() => viewTicketDetails(t.user_id)}>
						<TableBodyCell>{t.ticketId}</TableBodyCell>
						<TableBodyCell>{t.subject}</TableBodyCell>
						<TableBodyCell>{t.message}</TableBodyCell>
						<TableBodyCell>{t.statusId}</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</TableBody>
	</Table>
</div>

<div class=""></div>

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
<TicketEditor/>
</Modal>
