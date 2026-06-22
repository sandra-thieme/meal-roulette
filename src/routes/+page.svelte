<script lang="ts">
	import { type DishEntry, randomEntry, getDishImage } from '$lib/dishpicker';
	import ContinentMap from '$lib/ContinentMap.svelte';

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

<div class="min-h-screen bg-stone-50 px-4 py-8">
	<div class="mx-auto max-w-2xl">

		<!-- Header -->
		<h1 class="mb-8 text-center text-4xl font-bold tracking-tight">🍽️ Meal Roulette</h1>

		<!-- Card -->
		<div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-md">

			<!-- Country header row: name/continent left, map right -->
			<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
				<div class="flex-1 text-center sm:text-left">
					<h2 class="text-3xl font-semibold">
						{entry.flag} {entry.country}
					</h2>
					<p class="mt-1 text-sm text-stone-400 uppercase tracking-widest">
						{entry.continent}
					</p>
				</div>
				<div class="w-full sm:w-56 shrink-0">
					<ContinentMap isoCode={entry.iso_code} continent={entry.continent} />
				</div>
			</div>

			<!-- Divider -->
			<div class="my-5 border-t border-stone-100"></div>

			<!-- Dishes grid -->
			<ul class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{#each entry.dishes as dish, i (dish)}
					<li class="rounded-xl border border-stone-200 bg-stone-50 p-3">
						<p class="text-center font-semibold text-stone-700">{dish}</p>
						{#if loading}
							<div class="mt-3 flex h-36 w-full items-center justify-center">
								<div class="h-7 w-7 animate-spin rounded-full border-4 border-stone-200 border-t-stone-600"></div>
							</div>
						{:else if images[i]}
							<img
								class="mt-3 w-full rounded-lg h-auto"
								src={images[i]}
								alt="{dish}, a dish from {entry.country}"
							/>
						{/if}
					</li>
				{/each}
			</ul>

			<!-- Button -->
			<div class="mt-6 text-center">
				<button
					disabled={loading}
					onclick={reroll}
					class="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					🎲 Random country
				</button>
			</div>
		</div>
	</div>
</div>