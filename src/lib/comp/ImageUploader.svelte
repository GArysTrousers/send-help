<script lang="ts">
	import { loadFiles, type ImageUploadData } from '$lib/browser-files';
	import { Button, Fileupload, Spinner } from 'flowbite-svelte';

	export let onUploadPressed = async (filesData: ImageUploadData[]) => {};
	export let onUploadFinished = () => {};

	let files: FileList;
	let filesData: ImageUploadData[];
	let loading = false;
	let uploading = false;

	$: {
		load(files);
	}

	async function load(filesList: FileList) {
		loading = true;
		filesData = await loadFiles(filesList);
		loading = false;
	}
</script>

<div class="flex-col gap-2">
	<div class="flex-row gap-2">
		<Fileupload type="file" multiple bind:files />
		{#if loading}
			<Spinner size="10"></Spinner>
		{/if}
		<Button
			class="w-48"
			on:click={async () => {
				uploading = true;
        try {
          await onUploadPressed(filesData);
				  onUploadFinished();
        } catch (e) {
          
        }
				uploading = false;
			}}
		>
			{#if uploading}
				Uploading... <Spinner color="gray" size="4"></Spinner>
			{:else}
				Upload
			{/if}
		</Button>
	</div>

	{#if filesData}
		<div class="flex-wrap gap-2">
			{#each filesData.slice(0, 24) as file}
				<img
					src={file.data}
					alt=""
					class="h-12 w-12 rounded-lg object-cover"
				/>
			{/each}
      {#if filesData.length > 24}
        <div>And {filesData.length - 24} more...</div>
      {/if}
		</div>
	{/if}
</div>

<style>
</style>
