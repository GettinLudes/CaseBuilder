<script>
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';

	let caseNumber = '';
	let incidentDate = '';
	let incidentTime = '';
	let caseType = '';
	let bulkAttachmentInput = '';
	let showDrawer = true;

	let allAttachments = [];
	let paragraphs = [{ content: '', attachments: [], typeOptions: [] }];
	let usedAttachmentIds = new Set();

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
		const nextAvailable = allAttachments.find(a => !usedAttachmentIds.has(a.id));
		const para = { content: '', attachments: [], typeOptions: [] };
		paragraphs = [...paragraphs, para];
		await tick();

		const el = document.querySelectorAll('.paragraph-block')[paragraphs.length - 1];
		gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 });

		if (nextAvailable) {
			para.attachments.push({ ...nextAvailable });
			usedAttachmentIds.add(nextAvailable.id);
			triggerDynamicOptions(paragraphs.length - 1, nextAvailable);
		}
	}

	function deleteParagraph(index) {
		if (index === 0) return;
		const para = paragraphs[index];
		para.attachments.forEach(a => usedAttachmentIds.delete(a.id));
		paragraphs.splice(index, 1);
	}

	function removeAttachment(pIndex, aIndex) {
		const att = paragraphs[pIndex].attachments[aIndex];
		if (att?.id) usedAttachmentIds.delete(att.id);
		paragraphs[pIndex].attachments.splice(aIndex, 1);
	}

	function dropAttachment(index, id) {
		if (index === 0) return; // Paragraph 1 is protected

		const att = allAttachments.find(a => a.id === id);
		if (!att) return;

		paragraphs[index].attachments.push({ ...att });
		usedAttachmentIds.add(att.id);
		triggerDynamicOptions(index, att);
	}

	function triggerDynamicOptions(index, att) {
		if (!paragraphs[index].typeOptions) paragraphs[index].typeOptions = [];
		const options = [];

		if (att.text.toLowerCase().includes('incident report')) options.push('incidentType');
		else if (att.text.toLowerCase().includes('living unit history')) options.push('livingUnit');
		else if (att.text.toLowerCase().includes('dvd')) {
			const photo = allAttachments.find(a => a.text.toLowerCase().includes('photographs'));
			if (photo && !paragraphs[index].attachments.find(x => x.id === photo.id)) {
				paragraphs[index].attachments.push({ ...photo });
				usedAttachmentIds.add(photo.id);
			}
			options.push('dvd');
		}
		else if (att.text.toLowerCase().includes('outpatient progress')) options.push('oopn');

		paragraphs[index].typeOptions.push(...options);
	}

	function initDragDrop() {
		setTimeout(() => {
			document.querySelectorAll('.dropzone-para').forEach((el) => {
				Sortable.create(el, {
					group: 'attachments',
					animation: 150,
					onAdd: evt => {
						const id = evt.item.dataset.id;
						const target = evt.to.closest('.paragraph-block');
						const paraIndex = Array.from(document.querySelectorAll('.paragraph-block')).indexOf(target);

						if (paraIndex === 0) {
							evt.from.appendChild(evt.item);
							evt.item.title = 'Chill out Becky';
							return;
						}

						dropAttachment(paraIndex, id);
						evt.item.remove(); // Clean up duplicate DOM node
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
		<div><label class="block mb-1">Case Number:</label><input bind:value={caseNumber} class="input-field" /></div>
		<div><label class="block mb-1">Date of Incident:</label><input type="date" bind:value={incidentDate} class="input-field" /></div>
		<div><label class="block mb-1">Time of Incident:</label><input type="time" bind:value={incidentTime} class="input-field" /></div>
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
	<button class="fixed right-4 top-4 z-50 bg-blue-600 text-white p-2 rounded" on:click={() => showDrawer = !showDrawer}>
		{showDrawer ? 'Hide' : 'Show'} Attachments
	</button>

	<!-- Drawer for Attachment Pool -->
	<div class={`fixed top-0 right-0 h-full bg-gray-800/80 backdrop-blur-md p-4 shadow-lg transition-transform transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'} w-80 overflow-y-auto z-40`}>
		<h2 class="text-lg font-semibold mb-2">Attachment Pool</h2>
		<ul id="attachmentPool" class="drag-and-drop__items text-xs">
			{#each allAttachments.filter(a => !usedAttachmentIds.has(a.id)) as att, i (att.id)}
				<li class="drag-and-drop__item" data-id={att.id}>{i + 1}. {att.text || att.raw}</li>
			{/each}
		</ul>
	</div>

	<!-- Paragraphs -->
	<div class="space-y-6 mt-8">
		{#each paragraphs as para, index (index)}
			<div class="paragraph-block bg-gray-800 p-4 rounded-lg border border-gray-600">
				<h2 class="font-semibold mb-2">
					Paragraph #{index + 1} {index === 0 ? '— Reason the case was opened — Never has attachments...' : ''}
				</h2>

				<ul class="drag-and-drop__items dropzone-para" data-paragraph-index>
					{#each para.attachments as att, aIndex (att.id + '-' + aIndex)}
						<li class="drag-and-drop__item bg-gray-700">
							📎 {att.text || att.raw}
							<button class="ml-2 text-red-400 hover:text-red-600" on:click={() => removeAttachment(index, aIndex)}>Remove</button>
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
