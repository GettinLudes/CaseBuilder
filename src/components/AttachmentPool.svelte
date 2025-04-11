<script>
	export let attachments = [];
  </script>
  
  <div id="attachments" class="flex flex-wrap gap-2 p-4 bg-gray-800 rounded">
	{#each attachments as item (item.id)}
	  <div
		class="p-2 px-3 rounded bg-gray-700 text-white cursor-grab"
		data-attachment-id={item.id}
	  >
		{item.icon} {item.name}
	  </div>
	{/each}
  </div>
