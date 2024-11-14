<script lang="ts">
	import { api } from '$lib/api';
	import { faArrowsRotate, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
	import { Button, Card, Heading, Modal, Spinner } from 'flowbite-svelte';
	import Fa from 'svelte-fa';

	let modalSync = {
		open: false,
		result: ""
	};
  
  async function syncUsers() {
    try {
      modalSync.open = true;
      modalSync.result = "";
      let res = await api('/api/ldap/sync_users');
      modalSync.result = `Number of users: ${res}`;
    } catch (e) {
      modalSync.result = "Error"
    }
	}

  
</script>

<Card>
  <Heading tag="h3">LDAP</Heading>
  <div class="pt-5">
    <Button class="btn-icon" on:click={syncUsers}><Fa icon={faArrowsRotate}/>Sync Users</Button>
  </div>
</Card>

<Modal title="LDAP Sync" bind:open={modalSync.open} size="xs">
	{#if modalSync.result === ""}
		<div class="flex-col items-center">
			<Spinner />
		</div>
	{:else}
		<div class="flex-col items-center gap-3">
      <div class="flex-row justify-center items-center gap-2 text-green-500 text-2xl font-bold">
        <Fa icon={faCheckCircle}/>Success
      </div>
      <div>{modalSync.result}</div>
      <Button on:click={() => modalSync.open = false}>OK</Button>
    </div>
	{/if}
</Modal>

<style>

</style>