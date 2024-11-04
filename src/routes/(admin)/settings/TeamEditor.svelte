<script lang="ts">
	import { api } from '$lib/api';
	import { user } from '$lib/stores';
	import type { DbTeam, DbUser } from '$lib/types/db';
	import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import { Button, Heading, Card, Modal, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	interface Team extends DbTeam {
		members: DbUser[];
	}

  interface UserSearch extends DbUser {
    search: string;
  }

	let teams: Team[] = [];
	let users: UserSearch[] = [];

	let userPicker = {
		open: false,
    teamId: 0,
		search: ''
	};

	onMount(async () => {
		getAll();
	});

	async function getAll() {
		try {
			teams = await api('/api/team/get_all_with_members');
			users = (await api<DbUser[]>('/api/user/get_all')).map((v)=> ({
        ...v,
        search: `${v.fn.toLowerCase()}|${v.ln.toLowerCase()}`
      }));
		} catch (e) {}
	}
</script>

<Heading tag="h3">Teams</Heading>
<div class="flex-row justify-between">
	<Button>New</Button>
</div>
<div class="flex-wrap gap-3">
	{#each teams as team}
		<Card>
			<div class="flex-row justify-between">
				<Heading tag="h4">{team.name}</Heading>
				<Button
					class="!p-3"
					on:click={() => {
						userPicker.open = true;
            userPicker.teamId = team.teamId;
					}}><Fa icon={faUserPlus} /></Button
				>
			</div>
			<div class="">
				{#each team.members as member}
					<div>{member.fn} {member.ln}</div>
				{/each}
			</div>
		</Card>
	{/each}
</div>

<Modal bind:open={userPicker.open} title="Add User to Team">
	<div class="flex-col gap-3">
		<Input bind:value={userPicker.search} />
		<div class="flex-col gap-2">
			{#each users.filter((v) => {
        if (userPicker.search === '') return false;
        return v.search.includes(userPicker.search)
      }) as user}
				<Button>{user.fn} {user.ln}</Button>
			{/each}
		</div>
	</div>
</Modal>

<style>
</style>
