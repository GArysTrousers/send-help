<script lang="ts">
	import {
		Button,
		Heading,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		TableBodyRow,
		Checkbox
	} from 'flowbite-svelte';
	import type { DbTicket } from '$lib/types/db';
	import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { ticketStatuses, teams } from '$lib/stores';

	export let tickets: DbTicket[] = [];
	export let viewMax = 30;
	export let onTicketClicked = async (id: number) => {};
	export let onNewClicked = () => {};
	export let defaultTeams: number[] = [];

	let searchedTickets: DbTicket[] = [];
	const filter = {
		show: false,
		search: '',
		teams: [0],
		viewCompleted: false
	};

	const teamState = $teams.map((v) => ({
		id: v.teamId,
		state: defaultTeams.includes(v.teamId)
	}));

	$: {
		filter.teams = teamState.filter((v) => v.state).map((v) => v.id);
	}

	$: {
		let searchLow = filter.search.toLowerCase();
		searchedTickets = tickets
			.filter((v) => {
				if (searchLow === '') return true;
				return (
					v.subject.toLowerCase().includes(searchLow) ||
					v.message.toLowerCase().includes(searchLow) ||
					v.owner.toLowerCase().includes(searchLow)
				);
			})
			.filter((v) => {
				if (filter.viewCompleted) return true;
				return v.statusId !== 4;
			})
			.filter((v) => {
				if (filter.teams.length === 0) return true;
				return filter.teams.includes(v.teamId);
			})
			.slice(0, viewMax);
	}
</script>

<div class="flex-col gap-3">
	<div class="flex-row items-center justify-between rounded-xl bg-gray-800 p-2">
		<div class="flex-row">
			<Heading tag="h3" class="px-2">Tickets</Heading>
		</div>
	</div>
	<div class="flex-row items-center justify-between gap-3">
		<Button
			color="none"
			class="px-1"
			on:click={() => {
				filter.show = !filter.show;
			}}><Fa icon={faFilter} size="lg" /></Button
		>
		<Search bind:value={filter.search} size="md"></Search>
		<Button class="h-10 w-10" on:click={onNewClicked}><Fa icon={faPlus} size="lg" /></Button>
	</div>

	{#if filter.show}
		<div class="flex-wrap gap-3">
			<div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				{#each $teams as team, i}
					<Checkbox checked={teamState[i].state} on:change={(e) => teamState[i].state = e.target.checked}>{team.name}</Checkbox>
				{/each}
			</div>
			<div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				<Checkbox bind:checked={filter.viewCompleted}>View Completed</Checkbox>
			</div>
		</div>
	{/if}

	<Table shadow hoverable={true} class="w-full">
		<TableHead>
			<TableHeadCell class="hidden sm:table-cell">#</TableHeadCell>
			<TableHeadCell class="hidden sm:table-cell">Team</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell class="hidden sm:table-cell">Message</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody>
			{#if tickets.length > 0}
				{#each searchedTickets as t}
					<TableBodyRow class="cursor-pointer" on:click={() => onTicketClicked(t.ticketId)}>
						<TableBodyCell class="hidden sm:table-cell">#{t.ticketId}</TableBodyCell>
						<TableBodyCell class="hidden max-w-0 truncate sm:table-cell">
							{$teams.find((v) => v.teamId === t.teamId)?.name || 'Unknown'}
						</TableBodyCell>
						<TableBodyCell>{t.subject}</TableBodyCell>
						<TableBodyCell class="hidden max-w-0 truncate sm:table-cell">{t.message}</TableBodyCell>
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
