<script>
	import {
		Sidebar,
		SidebarBrand,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
	} from 'flowbite-svelte';
	import '../../app.css';
	import Fa from 'svelte-fa';
	import { faDashboard, faUser, faLaptop, faCog, faTicket } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';

	let site = {
		name: 'SendHelp',
		href: '/',
		img: '/favicon.png'
	};

  let activeClass = "flex items-center text-white p-2 rounded-lg bg-primary-600 hover:bg-primary-700"

	$: activeUrl = $page.url.pathname;
</script>

<svelte:head>
  <title>Techno</title>
</svelte:head>

<div class="flex-row gap-5 p-3">
	<div class="flex-col">
		<Sidebar {activeUrl}>
			<SidebarWrapper class="rounded-xl">
				<SidebarGroup>
					<SidebarBrand {site} />
					<SidebarItem label="Dashboard" href="/" {activeClass}>
						<svelte:fragment slot="icon">
							<Fa icon={faDashboard} />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Tickets" href="/tickets" {activeClass}>
						<svelte:fragment slot="icon">
							<Fa icon={faTicket} />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Users" href="/users" {activeClass}>
						<svelte:fragment slot="icon">
							<Fa icon={faUser} />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Settings" href="/settings" {activeClass}>
						<svelte:fragment slot="icon">
							<Fa icon={faCog} />
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

<style></style>
