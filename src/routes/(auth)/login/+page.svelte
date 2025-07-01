<script lang="ts">
	import { goto } from '$app/navigation';
	import { Heading, Input, Card, Button } from 'flowbite-svelte';
	import { api } from '$lib/api';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

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

<main class="mb-5 flex flex-row items-center justify-center p-3">
	<Card>
		<div class="flex flex-col py-8">
			<h2 class="mb-2 text-center text-2xl font-bold text-gray-400">
				{data.orgName || 'Send Help'}
			</h2>
			<Heading class="mb-10 text-center">{data.loginTitle || 'Help Desk'}</Heading>
			<div class="flex flex-col gap-2 px-5 pt-3">
				<div class="min-w-2xs flex flex-col gap-3">
					<Input
						class="rounded-full px-5"
						bind:value={username}
						onkeypress={submitIfEnter}
						placeholder="Username"
					/>
					<div class="flex flex-row">
						<Input
							class="rounded-l-full px-5"
							bind:value={password}
							onkeypress={submitIfEnter}
							placeholder="Password"
							type="password"
						/>
						<Button class="rounded-r-full pl-2 pr-3 text-xl" onclick={login}
							><Fa icon={faArrowRight} /></Button
						>
					</div>
				</div>
			</div>
		</div>
	</Card>
</main>

<style>
	main {
		height: 90vh;
	}
</style>
