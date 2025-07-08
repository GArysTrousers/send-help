<script>
	import ToastManager from '$lib/comp/toasts/ToastManager.svelte';
	import '../app.css';
</script>

<svelte:head>
  <title>Help Desk</title>
</svelte:head>

<slot></slot>

<ToastManager></ToastManager>