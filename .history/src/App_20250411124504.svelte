<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';
  
	import AttachmentPool from './components/AttachmentPool.svelte';
	import AttachmentDropzone from './components/AttachmentDropzone.svelte';
  
	let attachments = [
	  { id: 1, name: 'Incident Report', icon: '📄' },
	  { id: 2, name: 'Living Unit History', icon: '🏠' },
	  { id: 3, name: 'Photos & Video', icon: '📷' },
	];
  
	let paragraphs = [
	  { id: 1, title: 'Case Summary', content: '', attachmentIds: [] }
	];
  
	function addParagraph() {
	  const id = paragraphs.length + 1;
	  paragraphs = [...paragraphs, { id, title: `Paragraph #${id}`, content: '', attachmentIds: [] }];
	  setTimeout(() => animateIn(id), 0);
	}
  
	function animateIn(id) {
	  const el = document.querySelector(`#para-${id}`);
	  if (el) {
		gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
	  }
	}
  
	onMount(() => {
	  Sortable.create(document.getElementById('attachments'), {
		group: 'shared',
		animation: 150,
		ghostClass: 'opacity-30'
	  });
  
	  document.querySelectorAll('.paragraph-dropzone').forEach((el) => {
		Sortable.create(el, {
		  group: 'shared',
		  animation: 150,
		  ghostClass: 'opacity-30',
		  onAdd: (evt) => {
			const paraId = parseInt(evt.to.dataset.paraId);
			const attachmentId = parseInt(evt.item.dataset.attachmentId);
  
			paragraphs = paragraphs.map(p => {
			  if (p.id === paraId && !p.attachmentIds.includes(attachmentId)) {
				p.attachmentIds.push(attachmentId);
			  }
			  return p;
			});
		  }
		});
	  });
	});
  </script>
  
  <main class="p-6 text-white bg-gray-900 min-h-screen">
	<h1 class="text-3xl mb-4">Case Report Builder</h1>
  
	<h2 class="text-xl mb-2">Attachments Pool</h2>
	<AttachmentPool {attachments} />
  
	<div id="paragraphs" class="space-y-4 mt-6">
	  {#each paragraphs as p (p.id)}
		<div id={"para-" + p.id} class="bg-gray-800 p-4 rounded shadow transition-all">
		  <h2 class="font-semibold mb-2">{p.title}</h2>
		  <textarea bind:value={p.content} class="w-full p-2 bg-gray-700 text-white rounded resize-none mb-2" rows="5"></textarea>
		  <AttachmentDropzone paraId={p.id} attached={p.attachmentIds} allAttachments={attachments} />
		</div>
	  {/each}
	</div>
  
	<button on:click={addParagraph} class="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
	  ➕ Add Paragraph
	</button>
  </main>
