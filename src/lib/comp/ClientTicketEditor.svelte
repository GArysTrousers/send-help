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
		A
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import type { TicketDetails } from '../../routes/api/ticket/get_details/+server';
	import { stores } from '$lib/stores.svelte';
	import { faPaperclip, faFile } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { loadFile } from '$lib/browser-files';
	import type { CommentWithFile } from '../../routes/api/ticket/get_comments/+server';
	import TicketComment from './TicketComment.svelte';

	let fileSelector: HTMLInputElement;
	let uploading = false;

	export let ticketId = 0;

	let ticketDetails: TicketDetails | null = null;
	let comments: CommentWithFile[] = [];

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
							</div>
						</div>
					</div>
					<div>{ticketDetails.ticket.message}</div>
				</div>

				<div class="flex-col gap-2">
					<div class="flex-col">
						<div class="text-lg font-bold text-white">
							{stores.ticketStatuses.find((v) => v.ticketStatusId === ticketDetails?.ticket.statusId)
								?.name || 'Unknown'}
						</div>
					</div>
				</div>
			</div>
			<div class="flex-col">
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

<style>
	:global(ol > li) {
		margin-left: 0.6rem !important;
		margin-bottom: 0rem !important;
	}
</style>
