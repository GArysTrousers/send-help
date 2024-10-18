<script lang="ts">
	import { api } from '$lib/api';
	import { Input, Button, Textarea, Select } from 'flowbite-svelte';

	let ticket = {
		teamId: 1,
		typeId: 1,
		subject: '',
		message: ''
	};

  export let onSubmit = () => {}

  async function create() {
    try {
      await api('/api/ticket/create', ticket)
      onSubmit()
    } catch (e) {
      
    }
  }
</script>

<div class="flex-col gap-1">
	<div>
		<div>Team</div>
		<Select
			bind:value={ticket.teamId}
			items={[
				{ name: 'Maintenance', value: 1 },
				{ name: 'ICT', value: 2 }
			]}
		/>
	</div>
	<div>
		<div>Type</div>
		<Select
			bind:value={ticket.typeId}
			items={[
				{ name: 'Issue', value: 1 },
				{ name: 'Task', value: 2 }
			]}
		/>
	</div>
	<div>
		<div>Subject</div>
		<Input bind:value={ticket.subject} />
	</div>
	<div>
		<div>Message</div>
		<Textarea bind:value={ticket.message} rows={4} />
	</div>
	<Button on:click={create}>Submit</Button>
</div>

<style>
</style>
