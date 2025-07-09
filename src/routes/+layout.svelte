<script lang="ts">
	import ToastManager from '$lib/comp/toasts/ToastManager.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Help Desk</title>
</svelte:head>

{@render children()}

<ToastManager></ToastManager>
