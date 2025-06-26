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
	import type { DbTicket, DbUser } from '$lib/types/db';
	import {
		faPlus,
		faFilter,
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { stores } from '$lib/stores.svelte';
	import { sortTicketById, sortByPriority, sortByRisk, type TicketSorter, type UserSorter, sortUserById } from './sorting';

  let {
    users = $bindable(),
    viewMax = $bindable(30),
    onTicketClicked = $bindable(()=>{}),
    onNewClicked = $bindable(()=>{})
  }:{
    users: DbUser[];
    viewMax: number;
    onTicketClicked?: (id: string) => void;
    onNewClicked?: () => void;
  } = $props()

  let sorter: UserSorter = sortUserById;
	// let searchedUsers: DbUser[] = [];
	const filter = {
		show: false,
		search: '',
		teams: [0],
		viewCompleted: false
	};

  let searchedUsers = $derived(users.slice(0, viewMax).sort(sorter));



	// $: {
	// 	let searchLow = filter.search.toLowerCase();
	// 	searchedTickets = tickets
	// 		.filter((v) => {
	// 			if (searchLow === '') return true;
	// 			return (
	// 				v.subject.toLowerCase().includes(searchLow) ||
	// 				v.message.toLowerCase().includes(searchLow) ||
	// 				v.owner.toLowerCase().includes(searchLow)
	// 			);
	// 		})
	// 		.filter((v) => {
	// 			if (filter.viewCompleted) return true;
	// 			return v.statusId !== 4;
	// 		})
	// 		.filter((v) => {
	// 			if (filter.teams.length === 0) return true;
  //       if (stores.user && stores.user.userId === v.owner) return true;
	// 			return filter.teams.includes(v.teamId);
	// 		})
	// 		.slice(0, viewMax)
  //     .sort(sorter);
	// }
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
			<!-- <div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				{#each stores.teams as team, i}
					<Checkbox
						bind:checked={teamState[i].state}
						>{team.name}</Checkbox
					>
				{/each}
			</div>
			<div class="flex-wrap gap-2 rounded-md bg-gray-800 p-2">
				<Checkbox bind:checked={filter.viewCompleted}>View Completed</Checkbox>
			</div> -->
		</div>
	{/if}

	<Table shadow hoverable={searchedUsers.length > 0} class="w-full">
		<TableHead>
      <TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>Id</TableHeadCell>
			<TableHeadCell>Source</TableHeadCell>
		</TableHead>
		<TableBody>
				{#each searchedUsers as u}
					<TableBodyRow class="cursor-pointer" on:click={() => onTicketClicked(u.userId)}>
            <TableBodyCell>{u.fn}</TableBodyCell>
						<TableBodyCell>{u.ln}</TableBodyCell>
						<TableBodyCell>{u.userId}</TableBodyCell>
						<TableBodyCell>{u.src}</TableBodyCell>
					</TableBodyRow>
          {:else}
          <TableBodyRow>
						<TableBodyCell colspan={3} ><div class="text-gray-400 text-center w-full">None</div></TableBodyCell>
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
