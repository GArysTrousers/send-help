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
	import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import TicketCreator from '$lib/comp/TicketCreator.svelte';
	import TicketEditor from '$lib/comp/TicketEditor.svelte';
	import type { DbTicket } from '$lib/types/db';
	import { ticketStatuses } from '$lib/stores';

	let tickets: DbTicket[] = [];
	let searchedTickets: DbTicket[] = [];
	let search = '';
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

	$: {
		let searchLow = search.toLowerCase();
		searchedTickets = tickets
			.filter((v) => {
				if (search === '') return true;
				return (
					v.subject.toLowerCase().includes(searchLow) ||
					v.message.toLowerCase().includes(searchLow) ||
					v.owner.toLowerCase().includes(searchLow)
				);
			})
			.filter((v) => {
				return v.statusId !== 4;
			})
			.slice(0, viewMax);
	}

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

<div class="flex-col gap-3">
	<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
		<div class="flex-row">
			<Heading tag="h3" class="px-2">Tickets</Heading>
		</div>
		<div class="flex-row"></div>
	</div>
	<div class="flex-row items-center justify-between gap-3">
		<Button color="none" class="px-1" on:click={() => {}}><Fa icon={faFilter} size="lg" /></Button>
		<Search bind:value={search} size="md"></Search>
		<Button
			class="h-10 w-10"
			on:click={() => {
				creator.open = true;
			}}><Fa icon={faPlus} size="lg" /></Button
		>
	</div>
	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell class="hidden sm:table-cell">#</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell class="hidden sm:table-cell">Message</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody>
			{#if tickets.length > 0}
				{#each searchedTickets as t}
					<TableBodyRow class="cursor-pointer" on:click={() => viewTicketDetails(t.ticketId)}>
						<TableBodyCell class="hidden sm:table-cell">{t.ticketId}</TableBodyCell>
						<TableBodyCell>{t.subject}</TableBodyCell>
						<TableBodyCell class="hidden sm:table-cell">{t.message}</TableBodyCell>
						<TableBodyCell
							>{$ticketStatuses.find((v) => v.ticketStatusId === t.statusId)?.name ||
								'Unknown'}</TableBodyCell
						>
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
	<TicketEditor
		bind:ticketId={editor.data.ticketId}
		refresh={async () => {
			getData();
		}}
	/>
</Modal>
