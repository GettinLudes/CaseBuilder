<script>
	export let paraId;
	export let attached = [];
	export let allAttachments = [];
  </script>
  
  <div
	class="p-4 border-2 border-dashed border-white rounded-lg text-center paragraph-dropzone mt-2"
	data-para-id={paraId}
  >
	<p class="mb-2">Drop attachments here</p>
	<ul>
	  {#each attached as id}
		{#each allAttachments.filter(a => a.id === id) as item}
		  <li>{item.name}</li>
		{/each}
	  {/each}
	</ul>
  </div>
