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
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import type { TicketDetails } from '../../routes/api/ticket/get_details/+server';
	import { ticketStatuses } from '$lib/stores';
	import { faPaperclip, faPen, faEnvelope } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { loadFile } from '$lib/browser-files';
	import type { CommentWithFile } from '../../routes/api/ticket/get_comments/+server';
	import { priorities, risks } from './info';
	import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
	import UserPicker from './UserPicker.svelte';
	import TicketComment from './TicketComment.svelte';

	let fileSelector: HTMLInputElement;
	let uploading = false;

	export let ticketId = 0;
	export let refresh = async () => {};

	let ticketDetails: TicketDetails | null = null;
	let comments: CommentWithFile[] = [];
	let changeOwnerUserPickerOpen = false;

	let newCommentMessage = '';

	$: {
		if (ticketId === 0) {
		} else {
			getTicket();
			getComments();
		}
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
		try {
			await api('/api/ticket/add_comment', {
				message: newCommentMessage,
				ticketId: ticketId
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
				owner: ticketDetails.ticket.owner
			});
			await refresh();
		} catch (e) {}
	}

	async function uploadFile() {
		if (ticketDetails && fileSelector.files && fileSelector.files.length > 0) {
			uploading = true;
			try {
				const file = await loadFile(fileSelector.files[0]);
				await api('/api/ticket/add_file', {
					...file,
					ticketId: ticketDetails.ticket.ticketId
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
		} catch (e) {}
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
</script>

<div>
	{#if ticketDetails === null}
		<div class="flex-row justify-center">
			<Spinner></Spinner>
		</div>
	{:else}
		<div class="flex-col gap-3">
			<div class="flex-col">
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
									href="mailto:{ticketDetails.user.email}?subject=Ticket: {ticketDetails.ticket
										.subject}"><Fa icon={faEnvelope} /></Button
								>
								<Button
									title="Start Teams Chat"
									class="p-1 text-lg"
									color="none"
									on:click={() => {
										if (ticketDetails) openTeamsChat(ticketDetails.user.email);
									}}><Fa icon={faCommentDots} /></Button
								>
							</div>
						</div>
					</div>
					<div>{ticketDetails.ticket.message}</div>
					<div class="flex-col mt-5">
						<Heading tag="h4">History</Heading>
						<Timeline>
							<TimelineItem>
								Created: {dayjs(ticketDetails.ticket.created).format('DD MMM YYYY - hh:mm')}
							</TimelineItem>
							{#each comments as comment}
								<TicketComment {comment}></TicketComment>
							{/each}
						</Timeline>
					</div>
				</div>

				<div class="flex-col gap-2">
					<div class="flex-col">
						<div class="text-sm">Status</div>
						<Select
							class="w-40"
							items={$ticketStatuses.map((v) => ({ name: v.name, value: v.ticketStatusId }))}
							bind:value={ticketDetails.ticket.statusId}
							on:change={updateTicket}
							size="sm"
						/>
						<div class="text-sm">Priority</div>
						<Select
							class="w-40"
							items={priorities}
							bind:value={ticketDetails.ticket.priority}
							on:change={updateTicket}
							size="sm"
						/>
						<div class="text-sm">Risk</div>
						<Select
							class="w-40"
							items={risks}
							bind:value={ticketDetails.ticket.risk}
							on:change={updateTicket}
							size="sm"
						/>
						<Button class="my-2 gap-1" on:click={sendUpdateNotification}
							><Fa icon={faEnvelope} />Notify</Button
						>
					</div>
				</div>
			</div>

			<div class="flex-row gap-2">
				<input class="hidden" type="file" bind:this={fileSelector} on:change={uploadFile} />
				<Input
					bind:value={newCommentMessage}
					on:keypress={enterPressed}
					placeholder="Add comment"
				/>
				<Button
					class="w-14 p-0"
					color="none"
					disabled={uploading}
					on:click={() => fileSelector.click()}
				>
					{#if uploading}
						<Spinner size="5" />
					{:else}
						<Fa icon={faPaperclip} size="lg" />
					{/if}
				</Button>
				<Button on:click={addComment}>Send</Button>
			</div>
		</div>
	{/if}
</div>

<UserPicker
	title="Change Ticket Owner"
	onUserClicked={changeOwner}
	bind:open={changeOwnerUserPickerOpen}
></UserPicker>

<style>
	:global(ol > li) {
		margin-left: 0.6rem !important;
		margin-bottom: 0rem !important;
	}
</style>
