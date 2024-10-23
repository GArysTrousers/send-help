<script lang="ts">
	import { api } from '$lib/api';
	import {
		Avatar,
		Button,
		Heading,
		Modal,
		Spinner,
		Timeline,
		TimelineItem,
		Input,
		Select
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import type { DbComment } from '$lib/types/db';
	import type { TicketDetails } from '../../routes/api/ticket/get_details/+server';
	import { ticketStatuses } from '$lib/stores';

	export let ticketId = 0;
	export let mode: 'admin' | 'client' = 'admin';
	export let refresh = async () => {};

	let ticketDetails: TicketDetails | null = null;
	let comments: DbComment[] = [];

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

	async function updateTicketStatus() {
		try {
			if (!ticketDetails) return;
			await api('/api/ticket/set_status', { ticketId, statusId: ticketDetails.ticket.statusId });
			refresh();
		} catch (e) {}
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
				<div class="italic">
					{ticketDetails.user.fn}
					{ticketDetails.user.ln} - {ticketDetails.user.userId}
				</div>
			</div>
			<div class="flex-col gap-2 md:flex-row">
				<div class="w-full flex-row items-center gap-3">
					<Avatar size="md" class="object-cover" src="/content/portrait/ble.jpg" alt="portrait" />
					<div>{ticketDetails.ticket.message}</div>
				</div>

				<div class="flex-col gap-2">
					<div class="flex-col">
						<div class="text-sm">Status</div>
						{#if mode === 'admin'}
							<Select
								class="w-40"
								items={$ticketStatuses.map((v) => ({ name: v.name, value: v.ticketStatusId }))}
								bind:value={ticketDetails.ticket.statusId}
								on:change={updateTicketStatus}
							/>
						{:else}
							<div class="text-lg font-bold text-white">
								{$ticketStatuses.find((v) => v.ticketStatusId === ticketDetails.ticket.statusId)?.name || 'Unknown'}
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
								<Avatar
									size="md"
									class="object-cover"
									src="/content/portrait/ble.jpg"
									alt="portrait"
								/>
								<div class="w-full flex-col break-all">
									{c.message}
								</div>
							</div>
						</TimelineItem>
					{/each}
				</Timeline>
			</div>
			<div class="flex-row gap-2">
				<Input bind:value={newCommentMessage} placeholder="Add comment" />
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
