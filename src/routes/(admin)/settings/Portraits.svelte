<script lang="ts">
	import { api } from '$lib/api';
	import type { ImageUploadData } from '$lib/browser-files';
	import ImageUploader from '$lib/comp/ImageUploader.svelte';
	import { faUpload } from '@fortawesome/free-solid-svg-icons';
	import { Button, Card, Heading, Modal } from 'flowbite-svelte';
	import Fa from 'svelte-fa';

	let modalUpload = {
		open: false,
		result: ""
	};

  function openUploader() {
    modalUpload.result = ""
    modalUpload.open = true;
  }
  
  async function uploadImages(images: ImageUploadData[]) {
    let errors: string[] = []
    for (const image of images) {
      try {
        await api('/api/portrait/upload', image)
      } catch (e) {
        errors.push(`Couldn't upload ${image.name}`)
      }
    }
    modalUpload.result = errors.join('\n')
	}

  
</script>

<Card>
  <Heading tag="h3">Portraits</Heading>
  <div class="pt-5">
    <Button class="btn-icon" on:click={openUploader}><Fa icon={faUpload}/>Upload</Button>
  </div>
</Card>

<Modal title="Upload Portraits" bind:open={modalUpload.open} size="xs">
	<ImageUploader onUploadPressed={uploadImages} onUploadFinished={()=> {
    modalUpload.open = false;
    if (modalUpload.result === '') console.log("Upload done");
    else console.log(modalUpload.result)
  }}/>
</Modal>

<style>

</style>