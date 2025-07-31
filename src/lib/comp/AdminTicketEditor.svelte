<script lang="ts">
	import { api } from '$lib/api';
	import {
		Avatar,
		Button,
		Heading,
		Spinner,
		Timeline,
		TimelineItem,
		Input,
		Select,
		ButtonGroup,
		MultiSelect,
		Modal,
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import type { TicketDetails } from '../../routes/api/ticket/get_details/+server';
	import { stores } from '$lib/stores.svelte';
	import {
		faPaperclip,
		faPen,
		faEnvelope,
		faCircle,
		faCheck,
		faArrowRight,
		faUserPlus,
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { loadFile } from '$lib/browser-files';
	import type { CommentWithFile } from '../../routes/api/ticket/get_comments/+server';
	import { priorities, risks, ticketStatusTextColors } from './info';
	import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
	import UserPicker from './UserPicker.svelte';
	import TicketComment from './TicketComment.svelte';
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/toast.svelte';
	import AssignTicketModal from './AssignTicketModal.svelte';

	let {
		ticketId = $bindable(),
		refresh = async () => {},
	}: {
		ticketId: number;
		refresh: () => Promise<void>;
	} = $props();

	let fileSelector: HTMLInputElement | undefined = $state();
	let uploading = $state(false);
	let ticketDetails: TicketDetails | null = $state(null);
	let comments: CommentWithFile[] = $state([]);
	let changeOwnerUserPickerOpen = $state(false);
	let newCommentMessage = $state('');

	onDestroy(() => {
		page.url.searchParams.delete('');
		goto(page.url);
	});

	$effect(() => {
		if (ticketId !== 0) {
			getTicket();
			getComments();
		}
	});

	let quickProgress: { [key: number]: any } = {
		1: {
			icon: faArrowRight,
			title: 'Change to In Progress',
			class: ticketStatusTextColors[2],
		},
		2: {
			icon: faCheck,
			title: 'Change to Completed',
			class: ticketStatusTextColors[1],
		},
		3: {
			icon: faCheck,
			title: 'Change to Completed',
			class: ticketStatusTextColors[1],
		},
	};

	async function progressTicket() {
		if (ticketDetails === null) return;
		if (ticketDetails.ticket.statusId === 1) ticketDetails.ticket.statusId = 2;
		else if (ticketDetails.ticket.statusId === 2) ticketDetails.ticket.statusId = 4;
		else if (ticketDetails.ticket.statusId === 3) ticketDetails.ticket.statusId = 4;
		await updateTicket();
	}

	async function getTicket() {
		try {
			ticketDetails = await api('/api/ticket/get_details', { ticketId });
		} catch (e) {}
	}

	async function getComments() {
		try {
			comments = await api('/api/ticket/get_comments', { ticketId });
		} catch (e) {}
	}

	async function addComment() {
		if (newCommentMessage === '') return;
		try {
			await api('/api/ticket/add_comment', {
				message: newCommentMessage,
				ticketId: ticketId,
			});
			newCommentMessage = '';
			getComments();
		} catch (e) {}
	}

	async function updateTicket() {
		try {
			if (!ticketDetails) return;
			await api('/api/ticket/update', {
				ticketId,
				statusId: ticketDetails.ticket.statusId,
				priority: ticketDetails.ticket.priority,
				risk: ticketDetails.ticket.risk,
				owner: ticketDetails.ticket.owner,
			});
			await refresh();
		} catch (e) {}
	}

	async function uploadFile() {
		if (fileSelector && ticketDetails && fileSelector.files && fileSelector.files.length > 0) {
			uploading = true;
			try {
				const file = await loadFile(fileSelector.files[0]);
				await api('/api/ticket/add_file', {
					...file,
					ticketId: ticketDetails.ticket.ticketId,
				});
			} catch (e) {}
			getComments();
			uploading = false;
		}
	}

	function enterPressed(e: KeyboardEvent) {
		if (e.key == 'Enter') addComment();
	}

	function openTeamsChat(email: string) {
		const w = open(`https://teams.microsoft.com/l/chat/0/0?users=${email}`, '_blank', 'popup');
		setInterval(() => {
			w?.close();
		}, 1000);
	}

	async function sendUpdateNotification() {
		try {
			await api('/api/notification/client/ticket_update', { ticketId });
			addToast('success', 'Email sent');
		} catch (e) {
			addToast('error', e);
		}
	}

	async function changeOwner(owner: string) {
		if (ticketDetails) {
			ticketDetails.ticket.owner = owner;
			await updateTicket();
			changeOwnerUserPickerOpen = false;
			await getTicket();
			await refresh();
		}
	}

  function openAssignMenu() {
    
  }
</script>

<div>
	{#if ticketDetails === null}
		<div class="flex-row justify-center">
			<Spinner></Spinner>
		</div>
	{:else}
		<div class="flex-col gap-3">
			<div class="flex-row items-center gap-2">
				<Fa icon={faCircle} class={ticketStatusTextColors[ticketDetails.ticket.statusId]} />
				<Heading tag="h4">{ticketDetails.ticket.subject}</Heading>
			</div>
			<div class="flex-col gap-2 md:flex-row">
				<div class="w-full flex-col gap-2">
					<div class="w-full flex-row items-center gap-3">
						<Avatar
							size="md"
							class="aspect-square object-cover"
							src="/content/portrait/{ticketDetails.ticket.owner.toLowerCase()}.webp"
							alt="portrait"
						/>
						<div class="flex-col justify-start">
							<div class="flex-row items-center gap-1">
								<div class="italic">
									{ticketDetails.user.fn}
									{ticketDetails.user.ln} - {ticketDetails.user.userId}
								</div>
								<Button
									title="Change Owner"
									class="mr-auto p-1 text-lg"
									color="none"
									on:click={() => {
										changeOwnerUserPickerOpen = true;
									}}
								>
									<Fa icon={faPen} />
								</Button>
							</div>
							<div class="flex-row gap-1">
								<Button
									title="Email Owner"
									class="p-1 text-lg"
									color="none"
									href="mailto:{ticketDetails.user.email}?subject=Ticket: {ticketDetails.ticket.subject}"
								>
									<Fa icon={faEnvelope} />
								</Button>
								<Button
									title="Start Teams Chat"
									class="p-1 text-lg"
									color="none"
									on:click={() => {
										if (ticketDetails) openTeamsChat(ticketDetails.user.email);
									}}
								>
									<Fa icon={faCommentDots} />
								</Button>
							</div>
						</div>
					</div>
					<div>{ticketDetails.ticket.message}</div>
					<div class="mt-5 flex-col">
						<Timeline>
							<TimelineItem>
								Created: {dayjs(ticketDetails.ticket.created).format('DD MMM YYYY - hh:mm')}
							</TimelineItem>
							{#each comments as comment}
								<TicketComment {comment}></TicketComment>
							{/each}
						</Timeline>
					</div>
					<div class="mt-auto flex-row gap-2">
						<input class="hidden" type="file" bind:this={fileSelector} onchange={uploadFile} />

						<ButtonGroup class="w-full">
							<Input bind:value={newCommentMessage} on:keypress={enterPressed} placeholder="Add comment" />
							<Button on:click={addComment} color="primary">Send</Button>
						</ButtonGroup>
						<Button
							class="w-14 p-0"
							color="none"
							disabled={uploading}
							on:click={() => {
								if (fileSelector) fileSelector.click();
							}}
						>
							{#if uploading}
								<Spinner size="5" />
							{:else}
								<Fa icon={faPaperclip} size="lg" />
							{/if}
						</Button>
					</div>
				</div>

				<div class="flex-col gap-2">
					<div class="grid grid-cols-2 gap-x-2 sm:grid-cols-3 md:flex md:w-40 md:flex-col md:gap-0">
						<div class="flex-col">
							<div class="text-sm">Status</div>
							<div class="flex-row gap-1">
								<Select
									items={stores.ticketStatuses.map((v) => ({ name: v.name, value: v.ticketStatusId }))}
									bind:value={ticketDetails.ticket.statusId}
									on:change={updateTicket}
									size="sm"
								/>
								{#if ticketDetails.ticket.statusId > 0 && ticketDetails.ticket.statusId < 4}
									<Button
										class="p-2"
										color="light"
										onclick={progressTicket}
										title={quickProgress[ticketDetails.ticket.statusId].title}
									>
										<Fa
											class={quickProgress[ticketDetails.ticket.statusId].class}
											icon={quickProgress[ticketDetails.ticket.statusId].icon}
										/>
									</Button>
								{/if}
							</div>
						</div>

						<div class="flex-col">
							<div class="text-sm">Priority</div>
							<Select
								items={priorities}
								bind:value={ticketDetails.ticket.priority}
								on:change={updateTicket}
								size="sm"
							/>
						</div>

						<div class="flex-col">
							<div class="text-sm">Risk</div>
							<Select items={risks} bind:value={ticketDetails.ticket.risk} on:change={updateTicket} size="sm" />
						</div>
						<div class="flex-col gap-2 mt-2">
							<Button class="w-full gap-1" on:click={sendUpdateNotification}>
								<Fa icon={faEnvelope} />Notify
							</Button>
							<Button color="alternative" class="w-full gap-1" on:click={openAssignMenu}>
								<Fa icon={faUserPlus} />Assign
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<UserPicker title="Change Ticket Owner" onUserClicked={changeOwner} bind:open={changeOwnerUserPickerOpen}></UserPicker>

<AssignTicketModal></AssignTicketModal>

<style>
	:global(ol > li) {
		margin-left: 0.6rem !important;
		margin-bottom: 0rem !important;
	}
</style>
