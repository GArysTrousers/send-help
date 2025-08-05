<script lang="ts">
	import { api } from '$lib/api';
	import type { DbTeam, DbUser } from '$lib/types/db';
	import type { TeamMember } from '$lib/types/db-ext';
	import { faUserPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
	import {
		Button,
		Heading,
		Card,
		Modal,
		Input,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Toggle,
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	interface Team extends DbTeam {
		members: TeamMember[];
	}

	interface UserSearch extends DbUser {
		search: string;
	}

	let teams: Team[] = $state([]);
	let users: UserSearch[] = $state([]);

	let creator = $state({
		open: false,
		name: '',
	});

	let userPicker = $state({
		open: false,
		teamId: 0,
		search: '',
	});

	onMount(async () => {
		getAll();
	});

	async function getAll() {
		try {
			teams = await api('/api/team/get_all_with_members');
			users = (await api<DbUser[]>('/api/user/get_all')).map((v) => ({
				...v,
				search: `${v.fn.toLowerCase()}\t${v.ln.toLowerCase()}`,
			}));
		} catch (e) {}
	}

	async function createTeam() {
		try {
			await api('/api/team/create', {
				name: creator.name,
			});
			getAll();
			creator.open = false;
		} catch (e) {}
	}

	async function addUserToTeam(userId: string) {
		try {
			if (userPicker.teamId === 0) throw new Error('No team selected');
			await api('/api/team/add_member', {
				userId,
				teamId: userPicker.teamId,
			});
			getAll();
			userPicker.open = false;
		} catch (e) {}
	}

	async function removeUserFromTeam(userId: string, teamId: number) {
		try {
			await api('/api/team/remove_member', {
				userId,
				teamId,
			});
			getAll();
		} catch (e) {}
	}

	async function toggleNotification(member: TeamMember, type: 'notifyOnNew' | 'notifyOnUpdate' | 'notifyOnAssignment') {
		try {
			await api('/api/team/set_member_notification', {
				userId: member.userId,
				teamId: member.teamId,
				type,
				value: member[type] === 1 ? 0 : 1,
			});
			getAll();
		} catch (e) {}
	}
</script>

<Heading tag="h3">Teams</Heading>
<div class="flex-row justify-between">
	<Button
		on:click={() => {
			creator.name = '';
			creator.open = true;
		}}
	>
		New
	</Button>
</div>
<div class="flex-wrap gap-3">
	{#each teams as team}
		<Card class="mb-auto" size="lg">
			<div class="flex-row justify-between">
				<Heading tag="h4">{team.name}</Heading>
				<Button
					class="!p-3"
					on:click={() => {
						userPicker.open = true;
						userPicker.teamId = team.teamId;
						userPicker.search = '';
					}}
				>
					<Fa icon={faUserPlus} />
				</Button>
			</div>
			<div class="flex-col pt-1">
				<Table>
					<TableHead>
						<TableHeadCell>Name</TableHeadCell>
						<TableHeadCell>New</TableHeadCell>
						<TableHeadCell>Update</TableHeadCell>
						<TableHeadCell>Assign</TableHeadCell>
						<TableHeadCell>Remove</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each team.members as member}
							<TableBodyRow>
								<TableBodyCell>{member.fn} {member.ln}</TableBodyCell>
								<TableBodyCell>
									<Toggle checked={!!member.notifyOnNew} onclick={() => toggleNotification(member, 'notifyOnNew')}></Toggle>
								</TableBodyCell>
								<TableBodyCell><Toggle checked={!!member.notifyOnUpdate}></Toggle></TableBodyCell>
								<TableBodyCell><Toggle checked={!!member.notifyOnAssignment}></Toggle></TableBodyCell>
								<TableBodyCell>
									<Button
										class="!p-2 text-sm"
										color="light"
										on:click={() => removeUserFromTeam(member.userId, team.teamId)}
									>
										<Fa icon={faMinus} />
									</Button>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</Card>
	{/each}
</div>

<Modal bind:open={creator.open} title="Create New Team" size="xs">
	<div class="flex-col gap-3">
		<Input bind:value={creator.name} placeholder="Name" />
		<Button on:click={createTeam}>Create</Button>
	</div>
</Modal>

<Modal bind:open={userPicker.open} title="Add User to Team" size="xs">
	<div class="flex-col gap-3">
		<Input bind:value={userPicker.search} placeholder="Search..." />
		<div class="h-96 flex-col gap-2 overflow-auto">
			{#each users.filter((v) => {
				if (userPicker.search === '') return false;
				return v.search.includes(userPicker.search);
			}) as user}
				<Button color="dark" on:click={() => addUserToTeam(user.userId)}>
					<span class="w-full text-left">{user.fn} {user.ln}</span>
				</Button>
			{/each}
		</div>
	</div>
</Modal>

<style>
	.remove-user-button {
		@apply opacity-0 transition-opacity duration-200;
	}
	.team-user:hover .remove-user-button {
		@apply !opacity-100;
	}
</style>
