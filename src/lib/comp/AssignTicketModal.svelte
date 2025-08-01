<script lang="ts">
	import { api } from '$lib/api';
	import { Button, Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { ResponseType } from '../../routes/api/team/get_all_with_members/+server';
	import Fa from 'svelte-fa';
	import { faSave } from '@fortawesome/free-solid-svg-icons';
	import type { Ticket } from '$lib/types/db-ext';
	import { addToast } from '$lib/toast.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { open = $bindable(), ticket, refresh }: { open: boolean; ticket: Ticket; refresh: () => Promise<void>; } = $props();

	let teamMembers: ResponseType = $state([]);
	let selectableMember = $derived(teamMembers.find((v) => v.teamId === ticket?.teamId)?.members);
	let selected: SvelteSet<string> = $state(new SvelteSet(ticket.assigned));

	onMount(async () => {
		teamMembers = await api('/api/team/get_all_with_members');
	});

	function toggleAssigned(userId: string) {
		if (selected.has(userId)) selected.delete(userId);
		else selected.add(userId);
	}

	async function submit() {
		try {
			await api('/api/ticket/set_assigned', { ticketId: ticket?.ticketId, assigned: [...selected.values()] });
			open = false;
      refresh()
		} catch (e) {
			addToast('error', e);
		}
	}
</script>

<Modal title="Assign Member to Ticket" bind:open size="xs">
	{#if selectableMember}
		<div class="flex-wrap gap-2 text-white">
			{#each selectableMember as user}
				<button
					class="rounded px-3 py-1 text-left {selected.has(user.userId) ? 'bg-emerald-600' : 'bg-gray-600'}"
					onclick={() => toggleAssigned(user.userId)}
				>
					{user.fn}
					{user.ln}
				</button>
			{/each}
		</div>
		<div class="flex-row justify-end">
			<Button class="gap-1" onclick={submit}><Fa icon={faSave} />Save</Button>
		</div>
	{/if}
</Modal>

<style>
</style>
