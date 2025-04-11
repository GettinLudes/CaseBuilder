<script>
	export let paraId;
	export let attached = [];
	export let allAttachments = [];
  </script>
  
  <div class="paragraph-dropzone min-h-[40px] bg-gray-800 p-2 rounded" data-para-id={paraId}>
	{#each attached as id}
	  {#each allAttachments.filter(a => a.id === id) as a}
		<span class="inline-block mr-2 mb-2 px-2 py-1 bg-gray-700 rounded text-sm">
		  {a.icon} {a.name}
		</span>
	  {/each}
	{/each}
  </div>
  