<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Input, Card, Button } from 'flowbite-svelte';
	import { api } from '$lib/api';
	import type { PageData } from './$types';

  export let data:PageData

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
		<div class="flex flex-col py-3">
			<h2 class="text-center mb-2 text-2xl text-gray-400 font-bold">{data.orgName || "Send Help"}</h2>
      <Heading class="text-center mb-8">{data.loginTitle || "Help Desk"}</Heading>
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