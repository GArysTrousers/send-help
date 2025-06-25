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
		Checkbox
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
    faGauge
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { stores } from '$lib/stores.svelte';
	import { sortById, sortByPriority, sortByRisk, type TicketSorter } from './sorting';

	export let tickets: DbTicket[] = [];
	export let viewMax = 30;
	export let onTicketClicked = async (id: number) => {};
	export let onNewClicked = () => {};
	export let defaultTeams: number[] = [];

  let sorter: TicketSorter = sortById
	let searchedTickets: DbTicket[] = [];
	const filter = {
		show: false,
		search: '',
		teams: [0],
		viewCompleted: false
	};


	const riskIcons = [faCheck, faTriangleExclamation, faSkullCrossbones];
	const priorityIcons = [faArrowDown, faMinus, faArrowUp];

	const teamState = stores.teams.map((v) => ({
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
        if (stores.user && stores.user.userId === v.owner) return true;
				return filter.teams.includes(v.teamId);
			})
			.slice(0, viewMax)
      .sort(sorter);
	}
</script>

<div class="flex-col gap-3">
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
				{#each stores.teams as team, i}
					<Checkbox
						bind:checked={teamState[i].state}
						>{team.name}</Checkbox
					>
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
        <div class="grid grid-cols-3 min-w-24 max-w-40">
          <button class="text-left" on:click={() => sorter = sortById}>#</button>
          <button class="text-left" on:click={() => sorter = sortByPriority}><Fa icon={faGauge}/></button>
          <button class="text-left" on:click={() => sorter = sortByRisk}><Fa icon={faSkullCrossbones}/></button>
        </div>
      </TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Team</TableHeadCell>
			<TableHeadCell class="hidden lg:table-cell">Type</TableHeadCell>
			<TableHeadCell>Subject</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
		</TableHead>
		<TableBody>
				{#each searchedTickets as t}
					<TableBodyRow class="cursor-pointer" on:click={() => onTicketClicked(t.ticketId)}>
						<TableBodyCell class="max-w-40">
							<div class="grid grid-cols-3 min-w-24 max-w-40">
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
						<TableBodyCell
							>{stores.ticketStatuses.find((v) => v.ticketStatusId === t.statusId)?.name ||
								'Unknown'}</TableBodyCell
						>
					</TableBodyRow>
          {:else}
          <TableBodyRow>
            <TableBodyCell colspan={6}>
              <div class="flex-row justify-center">
                <Button class="gap-1 text-lg" on:click={onNewClicked}>
                  <Fa icon={faPlus}/> New Ticket
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
