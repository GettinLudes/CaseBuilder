<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';
  
	let caseNumber = '';
	let incidentDate = '';
	let incidentTime = '';
	let caseType = '';
	let reportableEmail = 'no';
	let bulkAttachmentInput = '';
  
	let allAttachments = [];
	let paragraphs = [{ content: '', attachments: [] }];
  
	function resizeTextarea(e) {
	  e.target.style.height = 'auto';
	  e.target.style.height = e.target.scrollHeight + 'px';
	}
  
	function processBulkAttachments() {
	  const lines = bulkAttachmentInput.split('\n').map(line => line.trim()).filter(Boolean);
	  allAttachments = lines.map((raw, i) => {
		const [type, name, date] = raw.split(',').map(part => part.trim());
		return {
		  id: crypto.randomUUID(),
		  index: i,
		  raw,
		  type: type || 'Unknown',
		  name: name || 'UNKNOWN',
		  date: date || 'UNKNOWN DATE'
		};
	  });
	  initDragDrop();
	}
  
	function addParagraph() {
	  paragraphs = [...paragraphs, { content: '', attachments: [] }];
	  $nextTick(() => {
		const last = document.querySelectorAll('.paragraph-block');
		const el = last[last.length - 1];
		gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });
	  });
	}
  
	function deleteParagraph(index) {
	  if (index === 0) return;
	  paragraphs.splice(index, 1);
	}
  
	function removeAttachment(pIndex, attId) {
	  paragraphs[pIndex].attachments = paragraphs[pIndex].attachments.filter(a => a.id !== attId);
	}
  
	function dropAttachment(index, id) {
	  const att = allAttachments.find(a => a.id === id);
	  if (!att) return;
	  paragraphs.forEach(p => p.attachments = p.attachments.filter(a => a.id !== id));
	  paragraphs[index].attachments.push(att);
	}
  
	function initDragDrop() {
	  setTimeout(() => {
		document.querySelectorAll('[data-paragraph-index]').forEach((el, idx) => {
		  Sortable.create(el, {
			group: 'attachments',
			animation: 150,
			onAdd: evt => {
			  const id = evt.item.dataset.id;
			  dropAttachment(idx, id);
			}
		  });
		});
  
		const pool = document.getElementById('attachmentPool');
		if (pool) {
		  Sortable.create(pool, {
			group: 'attachments',
			animation: 150,
			sort: false,
		  });
		}
	  }, 0);
	}
  
	onMount(initDragDrop);
  </script>
  
  <main class="p-6 text-white bg-gray-900 min-h-screen max-w-6xl mx-auto">
	<h1 class="text-4xl font-bold mb-6 text-center">Case Builder</h1>
  
	<div class="mb-6 grid grid-cols-2 gap-6">
	  <div>
		<label class="block mb-1">Case Number:</label>
		<input bind:value={caseNumber} class="input-field" />
	  </div>
	  <div>
		<label class="block mb-1">Date of Incident:</label>
		<input type="date" bind:value={incidentDate} class="input-field" />
	  </div>
	  <div>
		<label class="block mb-1">Time of Incident:</label>
		<input type="time" bind:value={incidentTime} class="input-field" />
	  </div>
	  <div>
		<label class="block mb-1">Case Type:</label>
		<div class="flex gap-4">
		  <label><input type="radio" bind:group={caseType} value="Investigation" /> Investigation</label>
		  <label><input type="radio" bind:group={caseType} value="Investigative Inquiry" /> Investigative Inquiry</label>
		</div>
	  </div>
	</div>
  
	<div class="mb-6">
	  <label class="block mb-1">Bulk Attachment Entry:</label>
	  <textarea bind:value={bulkAttachmentInput} on:input={resizeTextarea} class="input-field h-32"></textarea>
	  <button class="button mt-2" on:click={processBulkAttachments}>Process Attachments</button>
	</div>
  
	<div class="fixed top-6 right-6 w-72 p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-md">
	  <h2 class="text-lg font-semibold mb-2">Attachment Pool</h2>
	  <ul id="attachmentPool" class="drag-and-drop__items">
		{#each allAttachments as att (att.id)}
		  <li class="drag-and-drop__item" data-id={att.id}>{att.text || att.raw}</li>
		{/each}
	  </ul>
	</div>
  
	<div class="space-y-6 mt-8">
	  {#each paragraphs as para, index (index)}
		<div class="paragraph-block bg-gray-800 p-4 rounded-lg border border-gray-600">
		  <h2 class="font-semibold mb-2">Paragraph #{index + 1}</h2>
		  <ul class="drag-and-drop__items" data-paragraph-index>
			{#each para.attachments as att (att.id)}
			  <li class="drag-and-drop__item bg-gray-700">
				📎 {att.text || att.raw}
				<button class="ml-2 text-red-400 hover:text-red-600" on:click={() => removeAttachment(index, att.id)}>Remove</button>
			  </li>
			{/each}
		  </ul>
		  <textarea bind:value={para.content} class="input-field mt-3 h-28"></textarea>
		  {#if index !== 0}
			<button class="text-sm text-red-400 hover:text-red-600 mt-2" on:click={() => deleteParagraph(index)}>🗑️ Delete</button>
		  {/if}
		</div>
	  {/each}
	</div>
  
	<button class="button mt-6" on:click={addParagraph}>Add Another Paragraph</button>
  </main>
  
  <style lang="postcss">

	.input-field {
	  @apply w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded;
	}
	.button {
	  @apply px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white;
	}
	.drag-and-drop__items {
	  @apply flex flex-col gap-2 min-h-[3rem];
	}
	.drag-and-drop__item {
	  @apply px-3 py-1 bg-gray-700 border border-gray-500 rounded text-sm cursor-move;
	}
  </style>
  