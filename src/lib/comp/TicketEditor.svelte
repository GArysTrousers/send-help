<script lang="ts">
	import { api } from '$lib/api';
	import { Avatar, Button, Heading, Modal, Spinner, Timeline, TimelineItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	export let ticketId = 0;

	let ticket: any;
	let comments = []

	$: {
		if (ticketId === 0) {
		} else {
			getTicket(ticketId);
		}
	}

	async function getTicket(id: number) {
		try {
			ticket = await api('/api/ticket/get_one', { ticketId: id });
		} catch (e) {}
	}
</script>

<div>
	{#if ticket === null}
		<div class="flex-row justify-center">
			<Spinner></Spinner>
		</div>
	{:else}
		<div class="flex-col gap-3">
			<div class="flex-row gap-3">
				<Avatar size="xl" class="object-cover" src="/content/portrait/ble.jpg" alt="portrait" />
				<div class="flex-col">
					<Heading tag="h3">Ben Lee</Heading>
					<div class="">ble</div>
				</div>
			</div>
			<div class="flex-row gap-2">
				<!-- <Button on:click={() => (modalAssignDevice.open = true)}>Assign Device</Button>
				<Button on:click={newNote}>Add Note</Button> -->
			</div>
			<div class="flex-col">
				<Heading tag="h4">History</Heading>
				<Timeline>
					{#each comments as i}
						<TimelineItem date={dayjs(i.date).format('DD MMM YYYY')}>
							<div class="flex-row rounded-lg bg-gray-800 hover:brightness-110">
								<div class="w-full flex-col px-2">
									{i.text}
								</div>
							</div>
						</TimelineItem>
					{:else}
						<TimelineItem>None</TimelineItem>
					{/each}
				</Timeline>
			</div>
		</div>
	{/if}
</div>

<style>
</style>
