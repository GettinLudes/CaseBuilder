<script>
	export let paragraph;
  </script>
  
  <div id={"para-" + paragraph.id} class="bg-gray-800 p-4 rounded shadow transition-all">
	<h2 class="font-semibold mb-2">{paragraph.title}</h2>
	<textarea
	  bind:value={paragraph.content}
	  class="w-full p-2 bg-gray-700 text-white rounded resize-none mb-2"
	  rows="5"
	></textarea>
  </div>
