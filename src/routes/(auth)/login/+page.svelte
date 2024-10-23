<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Input, Card, Button } from 'flowbite-svelte';
	import { api } from '$lib/api';

	let username = '';
	let password = '';
	async function login() {
		try {
			let res = await api('/api/auth/login', { username, password });
			if (res) goto('/');
		} catch (e) {}
	}

	function submitIfEnter(event: KeyboardEvent) {
		if (event.key === 'Enter') login();
	}
</script>

<main class="flex flex-row justify-center items-center mb-5 p-3">
	<Card>
		<div class="flex flex-col">
			<Heading class="text-center mb-8">Send Help</Heading>
			<div class="flex flex-col gap-2">
				<Input bind:value={username} on:keypress={submitIfEnter} placeholder="Username" />
				<Input
					bind:value={password}
					on:keypress={submitIfEnter}
					placeholder="Password"
					type="password"
				/>
				<Button on:click={login}>Login</Button>
			</div>
		</div>
	</Card>
</main>

<style>
	main {
		height: 80vh;
	}
</style>