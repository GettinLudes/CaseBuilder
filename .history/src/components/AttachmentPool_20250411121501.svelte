<script>
	export let attachments = [];
  </script>
  
  <div id="attachments" class="flex gap-4 flex-wrap bg-gray-800 p-4 rounded-xl min-h-[80px]">
	{#each attachments as a (a.id)}
	  <div
		class="draggable cursor-move px-3 py-2 bg-gray-700 rounded-lg text-sm mb-2"
		data-attachment-id={a.id}
		title={a.name}>
		{a.icon} {a.name}
	  </div>
	{/each}
  </div>
  