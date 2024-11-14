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
		A
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import type { TicketDetails } from '../../routes/api/ticket/get_details/+server';
	import { ticketStatuses } from '$lib/stores';
	import { faPaperclip, faFile } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { loadFile } from '$lib/browser-files';
	import type { CommentWithFile } from '../../routes/api/ticket/get_comments/+server';
	import { priorities, risks } from './info';

	let fileSelector: HTMLInputElement;
	let uploading = false;

	export let ticketId = 0;
	export let mode: 'admin' | 'client' = 'admin';
	export let refresh = async () => {};

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

	async function updateTicket() {
		try {
			if (!ticketDetails) return;
			await api('/api/ticket/update', {
				ticketId,
				statusId: ticketDetails.ticket.statusId,
        priority: ticketDetails.ticket.priority,
        risk: ticketDetails.ticket.risk,
			});
			refresh();
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
						<div class="italic">
							{ticketDetails.user.fn}
							{ticketDetails.user.ln} - {ticketDetails.user.userId}
						</div>
					</div>
					<div>{ticketDetails.ticket.message}</div>
				</div>

				<div class="flex-col gap-2">
					<div class="flex-col">
						{#if mode === 'admin'}
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
						{:else}
							<div class="text-lg font-bold text-white">
								{$ticketStatuses.find((v) => v.ticketStatusId === ticketDetails.ticket.statusId)
									?.name || 'Unknown'}
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="flex-col">
				<Heading tag="h4">History</Heading>
				<Timeline>
					<TimelineItem>
						Created: {dayjs(ticketDetails.ticket.created).format('DD MMM YYYY - hh:mm')}
					</TimelineItem>
					{#each comments as c}
						<TimelineItem date={dayjs(c.created).format('DD MMM YYYY - hh:mm')}>
							<div class="flex-row gap-2 rounded-lg bg-gray-800 p-2 hover:brightness-110">
								<div class="h-10 flex-col items-center">
									<Avatar
										size="md"
										class="aspect-square object-cover"
										src="/content/portrait/ble.webp"
										alt="portrait"
									/>
									<div class="text-xs">{c.userId}</div>
								</div>
								{#if c.fileId === null}
									<div class="w-full flex-col break-all">
										{c.message}
									</div>
								{:else if c.mime === 'image/webp'}
									<a href={`/content/file/${c.filename}`} target="_blank">
										<img src={`/content/image/${c.thumb}`} alt={c.name} class="max-h-60"/>
									</a>
								{:else}
									<A
										class="flex-row items-center gap-3"
										href={`/content/file/${c.fileId}`}
										target="_blank"
									>
										<Fa icon={faFile} size="lg" />
										<div class="">{c.name}</div>
									</A>
								{/if}
							</div>
						</TimelineItem>
					{/each}
				</Timeline>
			</div>
			<div class="flex-row gap-2">
				<input class="hidden" type="file" bind:this={fileSelector} on:change={uploadFile} />
				<Input bind:value={newCommentMessage} placeholder="Add comment" />
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
