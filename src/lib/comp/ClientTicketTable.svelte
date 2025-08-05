<script lang="ts">
	import {
		Button,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		TableBodyRow,
		Checkbox,
	} from 'flowbite-svelte';
	import type { DbTicket } from '$lib/types/db';
	import {
		faPlus,
		faFilter,
		faTriangleExclamation,
		faSkullCrossbones,
		faCheck,
		faArrowUp,
		faArrowDown,
		faMinus,
		faGauge,
		faCircle,
		faCaretLeft,
		faCaretRight,
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { stores } from '$lib/stores.svelte';
	import { sortTicketById, sortByPriority, sortByRisk, type Sorter, type TicketFilter } from './sorting';
	import { ticketStatusTextColors } from './info';
	import type { Ticket } from '$lib/types/db-ext';


	let {
		tickets = $bindable(),
		viewMax = $bindable(30),
		onTicketClicked,
		onNewClicked,
		filter = $bindable(),
	}: {
		tickets: Ticket[];
		viewMax: number;
		onTicketClicked: (id: number) => Promise<void>;
		onNewClicked: () => void;
		filter: TicketFilter;
	} = $props();

	let sorter: Sorter<DbTicket> = $state(sortTicketById);
	let reverse: boolean = $state(true);
	let ticketPage: number = $state(0);

	let searchedTickets = $derived(filterTickets(tickets, filter, sorter, reverse));
	let pagedTickets: Ticket[] = $derived(getPage(searchedTickets, ticketPage, viewMax));

	const riskIcons = [faCheck, faTriangleExclamation, faSkullCrossbones];
	const priorityIcons = [faArrowDown, faMinus, faArrowUp];

	function filterTickets(tickets: Ticket[], filter: TicketFilter, sorter: Sorter<DbTicket>, reverse: boolean) {
		let searchLow = filter.search.toLowerCase();
		let t = tickets
			.filter((v) => {
				if (searchLow === '') return true;
				return (
					v.subject.toLowerCase().includes(searchLow) ||
					v.message.toLowerCase().includes(searchLow) ||
					v.owner.toLowerCase().includes(searchLow)
				);
			})
			.filter((v) => {
				if (filter.teams.length === 0) return true;
				if (stores.user && stores.user.userId === v.owner) return true;
				return filter.teams.includes(v.teamId);
			})
			.sort(sorter);
		if (reverse) {
			t.reverse();
		}
		return t;
	}

	function toggleTeam(teamId: number) {
		let index = filter.teams.findIndex((v) => v === teamId);
		if (index === -1) filter.teams.push(teamId);
		else filter.teams.splice(index, 1);
	}

	function setSorter(newSorter: Sorter<DbTicket>) {
		if (sorter === newSorter) reverse = !reverse;
		else {
			reverse = false;
			sorter = newSorter;
		}
	}

	function getPage(array: any[], curPage: number, pageSize: number) {
		return array.slice(curPage * pageSize, curPage * pageSize + pageSize);
	}

	function changePage(amount: number) {
		if (ticketPage + amount < 0) ticketPage = 0;
		else if (ticketPage + amount < searchedTickets.length / viewMax) ticketPage += amount;
	}
</script>

<div class="flex-col gap-3">
	<div class="flex-row items-center justify-between gap-3">
		<Button color="none" class="px-1" onclick={() => (filter.show = !filter.show)}>
			<Fa icon={faFilter} size="lg" />
		</Button>
		<Search bind:value={filter.search} size="md"></Search>
		<Button class="h-10 w-10" onclick={onNewClicked}><Fa icon={faPlus} size="lg" /></Button>
	</div>

	{#if filter.show}
		<div class="flex-wrap gap-3">
			<div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				{#each stores.teams as team}
					<button
						class="rounded px-2 text-sm font-semibold {filter.teams.includes(team.teamId) ? 'bg-primary-600' : ''}"
						onclick={() => toggleTeam(team.teamId)}
					>
						{team.name}
					</button>
				{/each}
			</div>
			<div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				<Checkbox bind:checked={filter.viewCompleted}>View Completed</Checkbox>
			</div>
		</div>
	{/if}

	<Table shadow hoverable={searchedTickets.length > 0} class="w-full">
		<TableHead>
			<TableHeadCell class="w-40">
				<div class="grid min-w-24 max-w-40 grid-cols-2">
					<button class="text-left" onclick={() => setSorter(sortTicketById)}>#</button>
					<button class="text-left" onclick={() => setSorter(sortByRisk)}><Fa icon={faSkullCrossbones} /></button>
				</div>
			</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Team</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Type</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>
				<div class="flex-row justify-end">
					<div class="flex-row gap-1 rounded-lg border border-gray-500 px-1">
						<button class="text-lg" onclick={() => changePage(-1)}><Fa icon={faCaretLeft} /></button>
						<div class="text-center">{ticketPage + 1}/{Math.ceil(searchedTickets.length / viewMax)}</div>
						<button class="text-lg" onclick={() => changePage(1)}><Fa icon={faCaretRight} /></button>
					</div>
				</div>
			</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each pagedTickets as t}
				<TableBodyRow class="cursor-pointer" onclick={() => onTicketClicked(t.ticketId)}>
					<TableBodyCell class="max-w-0">
						<div class="grid min-w-24 max-w-40 grid-cols-2">
							<div>#{t.ticketId}</div>
								<div>
									<Fa icon={priorityIcons[t.priority - 1]} />
								</div>
							<div>
								{#if t.risk > 1}
									<Fa icon={riskIcons[t.risk - 1]} />
								{/if}
							</div>
						</div>
					</TableBodyCell>
					<TableBodyCell class="hidden max-w-0 truncate lg:table-cell">
						{stores.teams.find((v) => v.teamId === t.teamId)?.name || 'Unknown'}
					</TableBodyCell>
					<TableBodyCell class="hidden max-w-0 truncate lg:table-cell">
						{stores.ticketTypes.find((v) => v.ticketTypeId === t.typeId)?.name || 'Unknown'}
					</TableBodyCell>

					<TableBodyCell>{t.subject.substring(0, 50)}</TableBodyCell>
					<TableBodyCell>
						<div class="flex-row items-center gap-1">
							<Fa icon={faCircle} class={ticketStatusTextColors[t.statusId]} />
							{stores.ticketStatuses.find((v) => v.ticketStatusId === t.statusId)?.name || 'Unknown'}
						</div>
					</TableBodyCell>
					<TableBodyCell></TableBodyCell>
				</TableBodyRow>
			{:else}
				<TableBodyRow>
					<TableBodyCell colspan={7}>
						<div class="flex-row justify-center">
							<Button class="gap-1 text-lg" onclick={onNewClicked}>
								<Fa icon={faPlus} /> New Ticket
							</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<style>
</style>
