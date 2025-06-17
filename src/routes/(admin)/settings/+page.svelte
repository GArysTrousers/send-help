<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import TeamEditor from './TeamEditor.svelte';
	import LdapSync from './LdapSync.svelte';
	import Portraits from './Portraits.svelte';
	import User from './User.svelte';
</script>

<div class="flex-col gap-5">
	<Heading class="mb-5">Settings</Heading>

	<div class="flex-wrap gap-3">
    <User></User>
		<LdapSync></LdapSync>
    <Portraits></Portraits>
	</div>
	<TeamEditor></TeamEditor>
</div>

<style>
</style>
