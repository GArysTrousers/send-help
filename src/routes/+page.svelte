<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	onMount(async () => {
    console.log(data);
    if (data.session.data.user.type === "client") {
      goto('/my');
    } else if (data.session.data.user.type === "admin") {
      goto('/dashboard')
    }
  });
</script>

<style>
</style>
