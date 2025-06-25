<script lang="ts">
	import { api } from '$lib/api';
	import { stores } from '$lib/stores.svelte';
	import { faKey } from '@fortawesome/free-solid-svg-icons';
	import { Button, Card, Heading, Input, Modal } from 'flowbite-svelte';
	import Fa from 'svelte-fa';

	let modalChangePassword = {
		open: false,
		old: '',
		new: ''
	};

	function openUploader() {
		modalChangePassword.old = '';
		modalChangePassword.new = '';
		modalChangePassword.open = true;
	}

	async function changePassword() {
		try {
			await api('/api/auth/change_password', {
				oldPassword: modalChangePassword.old,
				newPassword: modalChangePassword.new
			});
      modalChangePassword.open = false;
		} catch (e) {}
	}
</script>

<Card>
	<Heading tag="h3">User</Heading>
	<div class="flex-col gap-3 pt-3">
		<div class="text-lg font-bold">{stores.user?.fn} {stores.user?.ln} ({stores.user?.userId})</div>
		<div class="flex-row gap-2">
			{#if stores.user?.src === 'local'}
				<Button class="btn-icon" on:click={openUploader}><Fa icon={faKey} />Change Password</Button>
			{/if}
		</div>
	</div>
</Card>

<Modal title="Change Password" bind:open={modalChangePassword.open} size="xs">
	<div class="flex-col gap-2">
		<div>Current Password</div>
		<Input type="password" bind:value={modalChangePassword.old} />
		<div>New Password</div>
		<Input type="password" bind:value={modalChangePassword.new} />
		<Button on:click={changePassword}>Submit</Button>
	</div>
</Modal>

<style>
</style>
