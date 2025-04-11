<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';

	let caseNumber = '';
	let incidentDate = '';
	let incidentTime = '';
	let caseType = '';
	let reportableEmail = 'no';
	let bulkAttachmentInput = '';

	let allAttachments = [];
	let paragraphs = [{ content: '', attachments: [], typeOptions: [] }];
	let showDrawer = true;

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
				date: date || 'UNKNOWN DATE',
				text: raw
			};
		});
		initDragDrop();
	}

	async function addParagraph() {
		paragraphs = [...paragraphs, { content: '', attachments: [], typeOptions: [] }];
		await tick();
		const last = document.querySelectorAll('.paragraph-block');
		const el = last[last.length - 1];
		gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });
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
		if (!att || index === 0) return;
		paragraphs[index].attachments.push(att);
		triggerDynamicOptions(index, att);
	}

	function triggerDynamicOptions(index, att) {
		if (!paragraphs[index].typeOptions) paragraphs[index].typeOptions = [];
		const options = [];

		if (att.text.toLowerCase().includes('incident report')) {
			options.push('incidentType');
		} else if (att.text.toLowerCase().includes('living unit history')) {
			options.push('livingUnit');
		} else if (att.text.toLowerCase().includes('dvd')) {
			const photo = allAttachments.find(a => a.text.toLowerCase().includes('photographs'));
			if (photo) paragraphs[index].attachments.push(photo);
			options.push('dvd');
		} else if (att.text.toLowerCase().includes('outpatient progress')) {
			options.push('oopn');
		}
		paragraphs[index].typeOptions.push(...options);
	}

	function initDragDrop() {
		setTimeout(() => {
			document.querySelectorAll('[data-paragraph-index]').forEach((el, idx) => {
				Sortable.create(el, {
					group: 'attachments',
					animation: 150,
					onAdd: evt => {
  const id = evt.item.dataset.id;
  const toPara = evt.to.closest('.paragraph-block');
  const paraIndex = Array.from(document.querySelectorAll('.paragraph-block')).indexOf(toPara);

  if (paraIndex === 0) {
    evt.from.appendChild(evt.item);
    evt.item.title = 'Chill out Becky';
    return;
  }

  dropAttachment(paraIndex, id);
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

	<!-- Form Inputs -->
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

	<!-- Bulk Attachment Input -->
	<div class="mb-6">
		<label class="block mb-1">Bulk Attachment Entry:</label>
		<textarea bind:value={bulkAttachmentInput} on:input={resizeTextarea} class="input-field h-32"></textarea>
		<button class="button mt-2" on:click={processBulkAttachments}>Process Attachments</button>
	</div>

	<!-- Toggle Drawer -->
	<button class="fixed right-4 top-4 z-50 bg-blue-200 text-white p-2 rounded" on:click={() => showDrawer = !showDrawer}>
		{showDrawer ? 'Hide' : 'Show'} Attachments
	</button>

	<!-- Drawer for Attachment Pool -->
	<div class={`fixed top-0 right-0 h-full bg-gray-800/80 backdrop-blur-md p-4 shadow-lg transition-transform transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'} w-80 overflow-y-auto z-40`}>

		<h2 class="text-lg font-semibold mb-2">Attachment Pool</h2>
		<ul id="attachmentPool" class="drag-and-drop__items text-xs">
			{#each allAttachments as att, i (att.id)}
				<li class="drag-and-drop__item" data-id={att.id}>{i + 1}. {att.text || att.raw}</li>
			{/each}
		</ul>
	</div>

	<!-- Paragraphs -->
	<div class="space-y-6 mt-8">
		{#each paragraphs as para, index (index)}
			<div class="paragraph-block bg-gray-800 p-4 rounded-lg border border-gray-600">
				<h2 class="font-semibold mb-2">Paragraph #{index + 1}</h2>
				<ul class="drag-and-drop__items" data-paragraph-index>
					{#each para.attachments as att, aIndex (att.id + '-' + aIndex)}
						<li class="drag-and-drop__item bg-gray-700">
							📎 {att.text || att.raw}
							<button class="ml-2 text-red-400 hover:text-red-600" on:click={() => removeAttachment(index, att.id)}>Remove</button>
						</li>
					{/each}
				</ul>

				{#each para.typeOptions as opt}
					{#if opt === 'incidentType'}
						<select class="input-field mt-3">
							<option>Select Incident Report Type</option>
							<option value="full">Full transcribed email</option>
							<option value="consistent">Consistent Statement 434</option>
							<option value="refusal">Interview Refusal 434</option>
							<option value="grouped">Grouped Incident Reports</option>
						</select>
					{/if}
					{#if opt === 'livingUnit'}
						<input class="input-field mt-3" placeholder="Enter Cell" />
					{/if}
					{#if opt === 'oopn'}
						<p class="text-xs mt-2">OOPN placeholder auto-text</p>
					{/if}
					{#if opt === 'dvd'}
						<p class="text-xs mt-2">DVD & Photo placeholder auto-text</p>
					{/if}
				{/each}

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
