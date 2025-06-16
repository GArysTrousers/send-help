<script lang="ts">
	import { faFile } from '@fortawesome/free-solid-svg-icons';
	import dayjs from 'dayjs';
	import { A, Avatar, TimelineItem } from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import type { CommentWithFile } from '../../routes/api/ticket/get_comments/+server';

	export let comment: CommentWithFile;
</script>

<TimelineItem>
	<div class="parent-hover-target flex-row gap-2 rounded-lg bg-gray-800 p-2 hover:brightness-110">
		<div class="min-h-10 w-16 flex-col items-center">
			<Avatar
				size="md"
				class="aspect-square object-cover"
				src="/content/portrait/ble.webp"
				alt="portrait"
			/>
			<div class="text-xs">{comment.userId}</div>
		</div>
		<div class="w-full flex-col">
			{#if comment.fileId === null}
				<div class="w-full flex-col break-all">
					{comment.message}
				</div>
			{:else if comment.mime === 'image/webp'}
				<a href={`/content/file/${comment.fileId}`} target="_blank">
					<img src={`/content/image/${comment.thumb}`} alt={comment.name} class="max-h-60" />
				</a>
			{:else}
				<A
					class="flex-row items-center gap-3"
					href={`/content/file/${comment.fileId}`}
					target="_blank"
				>
					<Fa icon={faFile} size="lg" />
					<div class="">{comment.name}</div>
				</A>
			{/if}
			<div class="show-on-parent-hover mt-auto self-end whitespace-nowrap text-xs">
				{dayjs(comment.created).format('DD MMM YYYY - hh:mm')}
			</div>
		</div>
	</div>
</TimelineItem>

<style>
	.parent-hover-target .show-on-parent-hover {
		opacity: 0%;
	}

	.parent-hover-target:hover .show-on-parent-hover {
		opacity: 100%;
	}
</style>
