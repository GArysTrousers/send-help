<script lang="ts">
	import {
		Sidebar,
		SidebarBrand,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		BottomNav,
		BottomNavItem
	} from 'flowbite-svelte';
	import '../../app.css';
	import Fa from 'svelte-fa';
	import {
		faDashboard,
		faUser,
		faCog,
		faTicket,
		faDoorOpen
	} from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let site = {
		name: 'SendHelp',
		href: '/',
		img: '/favicon.png'
	};

	let activeClass =
		'flex items-center text-white p-2 rounded-lg bg-primary-600 hover:bg-primary-700';

	$: activeUrl = $page.url.pathname;
</script>

<div class="flex-row gap-5 p-3">
	<div class="hidden md:flex md:flex-col">
		<Sidebar {activeUrl}>
			<SidebarWrapper class="rounded-xl">
				<SidebarGroup>
					<SidebarBrand {site} />
					{#if data.user.type === 'admin'}
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

					{#if data.user.type === 'admin'}
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
	</div>
	<div class="w-full">
		<slot></slot>
	</div>
</div>

<div class="flex-row md:hidden">
	<BottomNav
		{activeUrl}
		position="absolute"
		classInner={data.user.type === 'admin' ? 'grid-cols-4' : 'grid-cols-2'}
	>
		{#if data.user.type === 'admin'}
			<!-- <BottomNavItem btnName="Home" href="/dashboard">
				<Fa icon={faDashboard} />
			</BottomNavItem> -->
			<BottomNavItem btnName="Tickets" href="/tickets">
				<Fa icon={faTicket} />
			</BottomNavItem>
			<BottomNavItem btnName="Mine" href="/my">
				<Fa icon={faUser} />
			</BottomNavItem>
			<BottomNavItem btnName="Settings" href="/settings">
				<Fa icon={faCog} />
			</BottomNavItem>
		{:else}
			<BottomNavItem btnName="My Tickets" href="/my">
				<Fa icon={faUser} />
			</BottomNavItem>
		{/if}
		<!-- <BottomNavItem btnName="Users" href="/users">
      <Fa icon={faUser} />
    </BottomNavItem> -->
		<BottomNavItem btnName="Logout" href="/logout">
			<Fa icon={faDoorOpen} />
		</BottomNavItem>
	</BottomNav>
</div>

<style></style>
