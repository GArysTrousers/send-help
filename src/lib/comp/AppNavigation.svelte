<script lang="ts">
	import {
		Sidebar,
		SidebarBrand,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import {
		faDashboard,
		faUser,
		faCog,
		faTicket,
		faDoorOpen,
		faUsers
	} from '@fortawesome/free-solid-svg-icons';
	import type { User } from '$lib/types/session';

	export let orgName: string;
	export let activeUrl: string | undefined;
	export let user: User;

	let site = {
		name: orgName,
		href: '/',
		img: '/favicon.svg'
	};
	let activeClass =
		'flex items-center text-white p-2 rounded-lg bg-primary-600 hover:bg-primary-700';
</script>

<Sidebar {activeUrl}>
	<SidebarWrapper class="rounded-xl">
		<SidebarGroup>
			<SidebarBrand {site} />
			{#if user.type === 'admin'}
				<SidebarItem label="Dashboard" href="/dashboard" {activeClass}>
					<svelte:fragment slot="icon">
						<Fa icon={faDashboard} />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Tickets" href="/tickets" {activeClass}>
					<svelte:fragment slot="icon">
						<Fa icon={faTicket} />
					</svelte:fragment>
				</SidebarItem>
			{/if}

			<SidebarItem label="My Tickets" href="/my" {activeClass}>
				<svelte:fragment slot="icon">
					<Fa icon={faUser} />
				</svelte:fragment>
			</SidebarItem>

			{#if user.type === 'admin'}
				<SidebarItem label="Users" href="/users" {activeClass}>
					<svelte:fragment slot="icon">
						<Fa icon={faUsers} />
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Settings" href="/settings" {activeClass}>
					<svelte:fragment slot="icon">
						<Fa icon={faCog} />
					</svelte:fragment>
				</SidebarItem>
			{/if}

			<SidebarItem label="Logout" href="/logout" {activeClass}>
				<svelte:fragment slot="icon">
					<Fa icon={faDoorOpen} />
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
