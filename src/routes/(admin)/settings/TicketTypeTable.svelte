<script lang="ts">
	import { api } from '$lib/api';
	import { stores } from '$lib/stores.svelte';
	import { addToast } from '$lib/toast.svelte';
	import type { DbTeam } from '$lib/types/db';
	import { faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
	import {
		Button,
		Input,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import Fa from 'svelte-fa';

	let { team }: { team: DbTeam } = $props();

	let editor = $state({
		ticketTypeId: 0,
		open: false,
		name: '',
	});

	async function deleteTicketType(ticketTypeId: number) {
		if (confirm('Are you sure?\nThis will delete all tickets associated with this ticket type.')) {
			try {
				await api('/api/ticketType/delete', { ticketTypeId });
				addToast('success', 'Team Deleted');
				location.reload();
			} catch (e) {
				addToast('error', e);
			}
		}
	}

	async function saveTicketType() {
		try {
			if (editor.ticketTypeId === 0) {
				await api('/api/ticketType/create', { name: editor.name, teamId: team.teamId });
			} else {
				await api('/api/ticketType/update', { name: editor.name, ticketTypeId: editor.ticketTypeId });
			}
			addToast('success', 'Ticket Type Saved');
			location.reload();
		} catch (e) {
			addToast('error', e);
		}
	}
</script>

<Table>
	<TableHead>
		<TableHeadCell>Ticket Type</TableHeadCell>
		<TableHeadCell class="p-0">
			<div class="flex-row justify-end">
				<Button
					class="rounded-md px-2 py-1"
					onclick={() => {
						editor.name = '';
						editor.ticketTypeId = 0;
						editor.open = true;
					}}
				>
					<Fa icon={faPlus} />
				</Button>
			</div>
		</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each stores.ticketTypes.filter((v) => v.teamId === team.teamId) as tt}
			<TableBodyRow>
				<TableBodyCell>{tt.name}</TableBodyCell>
				<TableBodyCell class="p-0">
					<div class="flex-row justify-end gap-1">
						<Button
							class="!p-2 text-sm"
							color="alternative"
							onclick={() => {
								editor.name = tt.name;
								editor.ticketTypeId = tt.ticketTypeId;
								editor.open = true;
							}}
						>
							<Fa icon={faPen} />
						</Button>
						<Button class="!p-2 text-sm" color="alternative" onclick={() => deleteTicketType(tt.ticketTypeId)}>
							<Fa icon={faMinus} />
						</Button>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title="Ticket Type Name" bind:open={editor.open} size="xs">
	<div class="flex-row gap-3">
		<Input bind:value={editor.name} />
		<Button onclick={saveTicketType}>Save</Button>
	</div>
</Modal>

<style>
</style>
