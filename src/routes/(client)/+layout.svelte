<script lang="ts">
	import { faCog, faDoorOpen, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';
	import {
		Sidebar,
		SidebarBrand,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		BottomNav,
		BottomNavItem
	} from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import { page } from '$app/stores';

	let site = {
		name: 'SendHelp',
		href: '/',
		img: '/favicon.png'
	};

  let activeClass = "flex items-center text-white p-2 rounded-lg bg-primary-600 hover:bg-primary-700"

	$: activeUrl = $page.url.pathname;
</script>

<div class="flex-row gap-5 p-3">
	<div class="hidden md:flex md:flex-col">
		<Sidebar {activeUrl}>
			<SidebarWrapper class="rounded-xl">
				<SidebarGroup>
					<SidebarBrand {site} />
					<SidebarItem label="Tickets" href="/my" {activeClass}>
						<svelte:fragment slot="icon">
							<Fa icon={faTicket} />
						</svelte:fragment>
					</SidebarItem>
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
	<BottomNav {activeUrl} position="absolute" classInner="grid-cols-2">
		<BottomNavItem btnName="Tickets" href="/my">
			<Fa icon={faTicket} />
		</BottomNavItem>
		<BottomNavItem btnName="Logout" href="/logout">
			<Fa icon={faDoorOpen} />
		</BottomNavItem>
	</BottomNav>
</div>

<style>
</style>
