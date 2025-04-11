<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Sortable from 'sortablejs';
  
	let paragraphs = [
	  { id: 1, title: 'Case Summary', content: '' },
	];
  
	const addParagraph = () => {
	  const id = paragraphs.length + 1;
	  paragraphs = [...paragraphs, { id, title: `Paragraph #${id}`, content: '' }];
	};
  
	onMount(() => {
	  const el = document.getElementById('paragraphs');
	  Sortable.create(el, {
		animation: 150,
		onEnd: (evt) => {
		  const moved = paragraphs.splice(evt.oldIndex, 1)[0];
		  paragraphs.splice(evt.newIndex, 0, moved);
		}
	  });
	});
  </script>
  
  <main class="p-6 text-white bg-gray-900 min-h-screen">
	<h1 class="text-3xl mb-4">Case Report Builder</h1>
	<div id="paragraphs" class="space-y-4">
	  {#each paragraphs as p (p.id)}
		<div class="bg-gray-800 p-4 rounded shadow">
		  <h2 class="font-semibold mb-2">{p.title}</h2>
		  <textarea class="w-full p-2 bg-gray-700 text-white rounded resize-none" rows="5" bind:value={p.content}></textarea>
		</div>
	  {/each}
	</div>
  
	<button class="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded" on:click={addParagraph}>
	  ➕ Add Paragraph
	</button>
  </main>
  
  <style>
	html, body {
	  margin: 0;
	  padding: 0;
	}
  </style>
  