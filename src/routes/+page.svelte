<script lang="ts">
    import dishes from '$lib/data/dishes.json'
    type DishEntry = {
        country: string,
        iso_code: string,
        dishes: string[],
        flag: string,
        continent: string,
    }
    const typedDishes = dishes as DishEntry[]
    const randomEntry = (): DishEntry => {
        return typedDishes[Math.floor(Math.random() * typedDishes.length)]
    }

    let entry: DishEntry = $state(randomEntry())

    const reroll = (): void => { entry = randomEntry() }
</script>

<div class="mx-auto max-w-xl p-8 text-center">
    <h1 class="mb-6 text-4xl font-bold">
        Meal Roulette
    </h1>

    <div class="rounded-xl border p-6 shadow">
        <h2 class="text-3xl">
            {entry.flag} {entry.country}
        </h2>

        <p class="mt-2 text-sm opacity-70">
            {entry.continent}
        </p>

        <ul class="mt-6 space-y-2">
            {#each entry.dishes as dish (dish)}
                <li>{dish}</li>
            {/each}
        </ul>

        <button
            class="mt-6 rounded-lg px-4 py-2 font-medium"
            onclick={reroll}
        >
            Random country
        </button>
    </div>
</div>