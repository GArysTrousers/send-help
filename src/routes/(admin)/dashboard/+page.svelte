<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faTicket,faCircle } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

  $: myTickets = data.tickets.filter((t)=> data.user.teams.includes(t.teamId))

	$: stats = {
		numTotal: myTickets.length,
		numOpen: myTickets.filter((v) => v.statusId === 1).length,
		numInProgress: myTickets.filter((v) => v.statusId === 2).length,
		numOnHold: myTickets.filter((v) => v.statusId === 3).length
	};
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
	<Card size="none" href="/tickets">
		<div class="flex-col gap-3">
			<Heading tag="h4" class="flex-row items-center justify-center gap-3">
				<Fa icon={faTicket} />Tickets
			</Heading>
			<div class="">
				<div class="flex-row items-center gap-1">
          <Fa icon={faCircle} class="text-green-500 text-sm"/>
          <div>Open: {stats.numOpen}</div>
        </div>
        <div class="flex-row items-center gap-1">
          <Fa icon={faCircle} class="text-blue-500 text-sm"/>
          <div>In Progress: {stats.numInProgress}</div>
        </div>
        <div class="flex-row items-center gap-1">
          <Fa icon={faCircle} class="text-orange-500 text-sm"/>
          <div>On Hold: {stats.numOnHold}</div>
        </div>
			</div>
			{#if stats.numTotal > 0}
				<div class="h-5 flex-row overflow-hidden rounded-full bg-gray-400">
					<div
						class="h-5 bg-green-500"
						style="width: {(stats.numOpen / stats.numTotal) * 100}%;"
					></div>
					<div
						class="h-5 bg-blue-500"
						style="width: {(stats.numInProgress / stats.numTotal) * 100}%;"
					></div>
					<div
						class="h-5 bg-orange-500"
						style="width: {(stats.numOnHold / stats.numTotal) * 100}%;"
					></div>
				</div>
			{/if}
		</div>
	</Card>
</div>
