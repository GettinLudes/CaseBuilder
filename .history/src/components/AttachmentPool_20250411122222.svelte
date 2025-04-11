<script>
	export let attachments = [];
  </script>
  
  <div class="p-4 bg-accent rounded-lg shadow">
	<h2 class="text-lg font-bold mb-2">Attachments</h2>
	<ul>
	  {#each attachments as item}
		<li>{item.name}</li>
	  {/each}
	</ul>
  </div>
  