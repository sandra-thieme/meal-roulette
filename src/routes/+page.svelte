<script lang="ts">
	import { type DishEntry, randomEntry, getDishImage } from '$lib/dishpicker';

	const reroll = (): void => {
		entry = randomEntry();
		loadImages(() => entry);
	};

	let requestId = 0;
	const loadImages = async (forEntry: () => DishEntry) => {
		const id = ++requestId;
		loading = true;
		const results = await Promise.all(
			forEntry().dishes.map((dish: string) => getDishImage(`${forEntry().country} dish ${dish}`))
		);
		if (id === requestId) images = results;
		loading = false;
	};

	let loading = $state(false);
	let images: string[] = $state([]);
	let entry: DishEntry = $state(randomEntry());
	loadImages(() => entry);
</script>

<div class="mx-auto max-w-xl p-8 text-center">
	<h1 class="mb-6 text-4xl font-bold">Meal Roulette</h1>

	<div class="rounded-xl border p-6 shadow">
		<h2 class="text-3xl">
			{entry.flag}
			{entry.country}
		</h2>

		<p class="mt-2 text-sm opacity-70">
			{entry.continent}
		</p>

		<ul class="mt-6 space-y-2">
			{#each entry.dishes as dish, i (dish)}
				<li class="rounded-lg border p-3">
					<p class="font-medium">{dish}</p>

					{#if loading}
						<div class="mt-2 h-40 w-full flex items-center justify-center">
							<div
								class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"
							></div>
						</div>
					{:else if images[i]}
						<!-- <img class="mt-2 h-40 w-full rounded-md object-cover" src={images[i]} alt={dish} /> -->
						<img class="mt-2 w-full rounded-md h-auto" src={images[i]} alt={dish} />
					{/if}
				</li>
			{/each}
		</ul>

		<button disabled={loading} class="mt-6 rounded-lg px-4 py-2 font-medium" onclick={reroll}>
			Random country
		</button>
	</div>
</div>
