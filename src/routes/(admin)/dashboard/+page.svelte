<script lang="ts">
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import { Button, Card, Heading } from 'flowbite-svelte';
	import { TableBodyRow } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
	<Card size="none">
		<Heading tag="h4">Tickets</Heading>
		<div>
			With Devices: {50}/{100} ({(
				(50) *
				100
			).toFixed(2)}%)
		</div>
		<div class="h-5 overflow-hidden rounded-full bg-gray-400">
			<div
				class="relative left-0 top-0 h-5 bg-green-500"
				style="width: {(50 / 100) * 100}%;"
			></div>
		</div>
	</Card>

	<Card size="none">
		<Heading tag="h4">Devices</Heading>
		<div>Without Users: {50}/{100}</div>
		<div class="h-5 overflow-hidden rounded-full bg-gray-400">
			<div
				class="relative left-0 top-0 h-5 bg-blue-500"
				style="width: {(50 / 100) * 100}%;"
			></div>
		</div>
	</Card>
</div>
