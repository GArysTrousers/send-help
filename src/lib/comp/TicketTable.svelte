<script lang="ts">
	import {
		Button,
		Heading,
		Modal,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell,
    TableBodyRow
	} from 'flowbite-svelte';
	import type { DbTicket } from '$lib/types/db';
	import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { ticketStatuses } from '$lib/stores';

  
	export let tickets: DbTicket[] = [];
	export let viewMax = 15;
  export let onTicketClicked = async (id: number) => {}
  export let onNewClicked = () => {}

	let searchedTickets: DbTicket[] = [];
	let search = '';

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
			on:click={onNewClicked}><Fa icon={faPlus} size="lg" /></Button
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
					<TableBodyRow class="cursor-pointer" on:click={() => onTicketClicked(t.ticketId)}>
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

<style>

</style>