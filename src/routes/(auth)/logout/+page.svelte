<script lang="ts">
	import { Heading, Card, Spinner, A } from 'flowbite-svelte';
	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	let result: 'waiting' | 'success' | 'failure' = 'waiting';

	onMount(async () => {
		logout();
	});
	async function logout() {
		try {
			let res = await api('/api/auth/logout');
			if (res) result = 'success';
		} catch (e) {
      result = "failure"
    }
	}
</script>

<main class="flex flex-row justify-center items-center mb-5 p-3">
	<Card>
		<div class="flex flex-col">
			<div class="flex flex-col gap-2 text-center">
				{#if result == 'waiting'}
					<div>Logging out <Spinner></Spinner></div>
				{:else if result == 'success'}
					<div>You have been logged out.</div>
					<div><A href="/login">Click here to login</A></div>
				{:else}
					<div>Error</div>
				{/if}
			</div>
		</div>
	</Card>
</main>

<style>
  main {
    height: 80vh;
  }
</style>