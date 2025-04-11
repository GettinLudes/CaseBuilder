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

	function removeAttachment(pIndex, attIndex) {
		paragraphs[pIndex].attachments.splice(attIndex, 1);
	}

	function dropAttachment(index, id) {
		const att = allAttachments.find(a => a.id === id);
		if (!att) return;
		paragraphs[index].attachments.push({ ...att });
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
			if (photo) paragraphs[index].attachments.push({ ...photo });
			options.push('dvd');
		} else if (att.text.toLowerCase().includes('outpatient progress')) {
			options.push('oopn');
		}
		paragraphs[index].typeOptions.push(...options);
	}

	function initDragDrop() {
		setTimeout(() => {
			document.querySelectorAll('[data-paragraph-index]').forEach((el) => {
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
