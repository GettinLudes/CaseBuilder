<script>
	let count = 0;
</script>

<main>
	<h1>Hello, Svelte 4</h1>
	<button on:click={() => count++}>
		Clicked {count} times
	</button>
</main>

<style>
	main {
		text-align: center;
		margin-top: 2rem;
	}
</style>
