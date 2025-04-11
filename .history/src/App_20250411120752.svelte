<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';
  
	let attachments = [
	  { id: 1, name: 'Incident Report', icon: '📄' },
	  { id: 2, name: 'Living Unit History', icon: '🏠' },
	  { id: 3, name: 'Photos & Video', icon: '📷' }
	];
  
	let paragraphs = [];
  
	function addParagraph() {
	  const newId = paragraphs.length + 1;
	  paragraphs = [...paragraphs, { id: newId, text: '', attachmentIds: [] }];
	  setTimeout(() => animateIn(newId), 0);
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
		  onAdd: function (evt) {
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
  
  <style>
	.box {
	  background-color: #1a1a1a;
	  padding: 1rem;
	  border-radius: 1rem;
	  box-shadow: 0 0 10px rgba(0,0,0,0.5);
	  margin-bottom: 1rem;
	}
	.draggable {
	  cursor: move;
	  padding: 0.5rem 1rem;
	  background-color: #333;
	  border-radius: 0.5rem;
	  font-size: 0.875rem;
	  margin-bottom: 0.5rem;
	}
  </style>
  
  <main class="min-h-screen p-6 bg-[#111] text-white">
	<h1 class="text-3xl font-bold mb-6">Case Builder</h1>
  
	<section>
	  <h2 class="text-xl mb-2">Attachments Pool</h2>
	  <div id="attachments" class="flex gap-4 flex-wrap bg-gray-800 p-4 rounded-xl min-h-[80px]">
		{#each attachments as a (a.id)}
		  <div class="draggable" data-attachment-id={a.id} title={a.name}>
			{a.icon} {a.name}
		  </div>
		{/each}
	  </div>
	</section>
  
	<section class="mt-8">
	  <div class="flex justify-between items-center mb-4">
		<h2 class="text-xl">Paragraphs</h2>
		<button on:click={addParagraph} class="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-500">+ Add Paragraph</button>
	  </div>
  
	  {#each paragraphs as para (para.id)}
		<div id={"para-" + para.id} class="box transition-all">
		  <textarea bind:value={para.text} rows="4" class="w-full bg-gray-900 p-2 rounded text-white mb-3" placeholder="Enter paragraph text..."></textarea>
		  <div class="paragraph-dropzone min-h-[40px] bg-gray-800 p-2 rounded" data-para-id={para.id}>
			{#each para.attachmentIds as id}
			  {#each attachments.filter(a => a.id === id) as a}
				<span class="inline-block mr-2 mb-2 px-2 py-1 bg-gray-700 rounded text-sm">{a.icon} {a.name}</span>
			  {/each}
			{/each}
		  </div>
		</div>
	  {/each}
	</section>
  </main>
