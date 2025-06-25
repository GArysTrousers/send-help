<script lang="ts">
	import { api } from '$lib/api';
	import { Input, Button, Textarea, Select, Range, Hr } from 'flowbite-svelte';
	import { teams, ticketTypes } from '$lib/stores';
	import { priorities, risks } from './info';

	let ticket = {
		teamId: 1,
		typeId: 1,
		subject: '',
		message: '',
		priority: 1,
		risk: 1
	};

	$: availableTypes = $ticketTypes
		.filter((v) => v.teamId === ticket.teamId)
		.map((v) => ({ name: v.name, value: v.ticketTypeId }));

	export let onSubmit = () => {};

	async function create() {
		try {
			await api('/api/ticket/create', ticket);
			onSubmit();
		} catch (e) {}
	}

	function onTeamChanged() {
		ticket.typeId = availableTypes[0].value;
	}
</script>

<div class="grid grid-cols-2 gap-1">
	<div class="col-span-2 sm:col-span-1">
		<div>Team</div>
		<Select
			bind:value={ticket.teamId}
			items={$teams.map((v) => ({ name: v.name, value: v.teamId }))}
			on:change={onTeamChanged}
		/>
	</div>
	<div class="col-span-2 sm:col-span-1">
		<div>Type</div>
		<Select bind:value={ticket.typeId} items={availableTypes} />
	</div>
	<div class="col-span-2 my-3">
		<hr class="h-px border-0 bg-gray-200 dark:bg-gray-700" />
	</div>
	<div class="col-span-2 sm:col-span-1">
		<div>Priority</div>
		<Select bind:value={ticket.priority} items={priorities} />
	</div>
	<div class="col-span-2 sm:col-span-1">
		<div>Risk</div>
		<Select bind:value={ticket.risk} items={risks} />
	</div>
	<div class="col-span-2">
		<div>Subject</div>
		<Input bind:value={ticket.subject} />
	</div>
	<div class="col-span-2">
		<div>Message</div>
		<Textarea bind:value={ticket.message} rows={4} />
	</div>
	<Button class="col-span-2" on:click={create}>Submit</Button>
</div>

<style>
</style>
