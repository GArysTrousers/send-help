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
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { stores } from '$lib/stores.svelte';
	import { sortTicketById, sortByPriority, sortByRisk, type TicketSorter } from './sorting';

	let {
		tickets = $bindable(),
		viewMax = $bindable(30),
		onTicketClicked,
		onNewClicked,
		defaultTeams,
	}: {
		tickets: DbTicket[];
		viewMax: number;
		onTicketClicked: (id: number) => Promise<void>;
		onNewClicked: () => void;
		defaultTeams: number[];
	} = $props();

	let sorter: TicketSorter = $state(sortTicketById);
	const filter = $state({
		show: true,
		search: '',
		teams: defaultTeams,
		viewCompleted: false,
	});
	let searchedTickets: DbTicket[] = $derived(filterTickets(tickets, filter, sorter));

	const riskIcons = [faCheck, faTriangleExclamation, faSkullCrossbones];
	const priorityIcons = [faArrowDown, faMinus, faArrowUp];
  const ticketStatusColors = ['', 'text-green-500', 'text-blue-500', 'text-orange-500', 'text-gray-500']

	function filterTickets(tickets: DbTicket[], filter: any, sorter: TicketSorter) {
		let searchLow = filter.search.toLowerCase();
		return tickets
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
				if (stores.user && stores.user.userId === v.owner) return true;
				return filter.teams.includes(v.teamId);
			})
			.slice(0, viewMax)
			.sort(sorter);
	}

	function toggleTeam(teamId: number) {
		let index = filter.teams.findIndex((v) => v === teamId);
		if (index === -1) filter.teams.push(teamId);
		else filter.teams.splice(index, 1);
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
			<TableHeadCell class="max-w-40">
				<div class="grid min-w-24 max-w-40 grid-cols-3">
					<button class="text-left" onclick={() => (sorter = sortTicketById)}>#</button>
					<button class="text-left" onclick={() => (sorter = sortByPriority)}><Fa icon={faGauge} /></button>
					<button class="text-left" onclick={() => (sorter = sortByRisk)}><Fa icon={faSkullCrossbones} /></button>
				</div>
			</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Team</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Type</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Owner</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each searchedTickets as t}
				<TableBodyRow class="cursor-pointer" onclick={() => onTicketClicked(t.ticketId)}>
					<TableBodyCell class="max-w-40">
						<div class="grid min-w-24 max-w-40 grid-cols-3">
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
					<TableBodyCell class="hidden max-w-0 truncate lg:table-cell">
						{t.owner || 'Unknown'}
					</TableBodyCell>
					<TableBodyCell>{t.subject.substring(0, 50)}</TableBodyCell>
					<TableBodyCell>
						<div class="flex-row gap-1 items-center">
							<Fa icon={faCircle} class={ticketStatusColors[t.statusId]} />
							{stores.ticketStatuses.find((v) => v.ticketStatusId === t.statusId)?.name || 'Unknown'}
						</div>
					</TableBodyCell>
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
	:global(td, th) {
		@apply !px-2 md:!px-4;
	}
</style>
