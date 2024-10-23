<script lang="ts">
	import { Button, Card, Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faTicket } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
	<Card size="none" href="/tickets">
		<div class="flex-row gap-5">
			<div class="flex-row items-center gap-3">
				<Heading tag="h4" class="flex-row items-center gap-3">
					<Fa icon={faTicket} />Tickets
				</Heading>
			</div>
      <div class="border-r-2"></div>
			<div class="">
				<div class="">Open: {data.tickets.filter((v) => v.statusId === 1).length}</div>
				<div class="">In Progress: {data.tickets.filter((v) => v.statusId === 2).length}</div>
				<div class="">On Hold: {data.tickets.filter((v) => v.statusId === 3).length}</div>
			</div>
		</div>
	</Card>
</div>
