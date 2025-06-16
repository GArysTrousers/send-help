<script lang="ts">
	import { Drawer, Button } from 'flowbite-svelte';
	import '../../app.css';
	import Fa from 'svelte-fa';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import { sineIn } from 'svelte/easing';
	import AppNavigation from '$lib/comp/AppNavigation.svelte';

	export let data: LayoutData;

	let mobileNav = {
		hidden: true,
		transition: {
			x: -320,
			duration: 200,
			easing: sineIn
		}
	};

	$: activeUrl = $page.url.pathname;

  $: {
    if (activeUrl) mobileNav.hidden = true;
  }
</script>

<div class="flex-row items-center gap-3 px-2 pt-2 md:hidden">
	<Button
		class="p-2 text-2xl"
		color="none"
		on:click={() => {
			mobileNav.hidden = false;
		}}><Fa icon={faBars} /></Button
	>
	<div class="text-xl font-bold">Send Help</div>
</div>

<Drawer bind:hidden={mobileNav.hidden} transitionParams={mobileNav.transition}>
	<AppNavigation orgName={data.orgName} activeUrl={activeUrl} user={data.user}></AppNavigation>
</Drawer>
<div class="flex-row gap-5 p-3">
	<div class="hidden md:flex md:flex-col">
		<AppNavigation orgName={data.orgName} activeUrl={activeUrl} user={data.user}></AppNavigation>
	</div>
	<div class="w-full">
		<slot></slot>
	</div>
</div>

<style></style>
