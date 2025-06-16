<script lang="ts">
	import { api } from '$lib/api';
	import type { DbUser } from '$lib/types/db';
	import { Button, Input, Modal } from 'flowbite-svelte';

	export let title: string | undefined;
	export let open: boolean;
	export let onUserClicked: (userId: string) => void;

	let searchText = '';
	let users: DbUser[] = [];

	async function search() {
		users = await api('/api/user/search', { searchText });
	}
</script>

<Modal bind:open {title} size="xs">
	<div class="flex-col gap-3">
		<Input bind:value={searchText} on:input={search} placeholder="Search..." />
		<div class="h-96 flex-col gap-2 overflow-auto">
			{#each users as user}
				<Button color="dark" on:click={() => onUserClicked(user.userId)}>
					<span class="w-full text-left">{user.fn} {user.ln}</span>
				</Button>
			{/each}
		</div>
	</div>
</Modal>

<style>
</style>
