<script lang="ts">
	import { geoNaturalEarth1, geoPath, geoMercator } from 'd3-geo';
	import { feature } from 'topojson-client';
	import { base } from '$app/paths';
	import type { Topology, GeometryCollection } from 'topojson-specification';
	import type { Feature, FeatureCollection, Geometry } from 'geojson';

	interface Props {
		isoCode: string;
		continent: string;
	}

	let { isoCode, continent }: Props = $props();

	// Viewport
	const WIDTH = 500;
	const HEIGHT = 320;
	const PADDING = 20;

	type GeoFeature = Feature<Geometry, { iso_code: string; continent: string }>;

	let allFeatures: GeoFeature[] = $state([]);
	let loaded = $state(false);

	$effect(() => {
		fetch(`${base}/countries-topo.json`)
			.then((r) => r.json())
			.then((topo: Topology) => {
				allFeatures = ((feature(topo, (topo.objects as Record<string, GeometryCollection>).countries) as FeatureCollection).features) as GeoFeature[];
				loaded = true;
			});
	});

	// Recompute whenever isoCode or allFeatures changes
	let paths = $derived.by(() => {
		if (!loaded || allFeatures.length === 0) return [];

		const continentFeatures = allFeatures.filter((f) => f.properties.continent === continent);

		if (continentFeatures.length === 0) return [];

		// Pick projection based on continent
		const proj =
			continent === 'Europe' || continent === 'Asia' ? geoNaturalEarth1() : geoMercator();

		// Fit projection to the continent's bounding box
		const continentBounds: Record<string, [[number, number], [number, number]]> = {
			'Europe':        [[-25, 34], [45, 72]],
			'Asia':          [[25, -12], [150, 55]],
			'Africa':        [[-20, -38], [55, 38]],
			'North America': [[-170, 5], [-50, 75]],
			'South America': [[-85, -58], [-30, 15]],
			'Oceania':       [[110, -50], [180, 5]],
		};

		const bounds = continentBounds[continent];
		if (bounds) {
			const [sw, ne] = bounds;
			proj.fitExtent(
				[[PADDING, PADDING], [WIDTH - PADDING, HEIGHT - PADDING]],
				{
					type: 'Feature',
					geometry: { type: 'LineString', coordinates: [sw, ne] },
					properties: {}
				} as Feature<Geometry>
			);
		} else {
			proj.fitExtent(
				[[PADDING, PADDING], [WIDTH - PADDING, HEIGHT - PADDING]],
				{ type: 'FeatureCollection', features: continentFeatures } as FeatureCollection
			);
		}

		const pathGen = geoPath(proj);

		return continentFeatures.map((f) => ({
			d: pathGen(f) ?? '',
			iso: f.properties.iso_code,
			highlighted: f.properties.iso_code === isoCode
		}));
	});

	let hasShape = $derived(loaded && paths.some((p) => p.iso === isoCode));
</script>

<div class="w-full">
	{#if !loaded}
		<div class="flex h-48 items-center justify-center text-sm opacity-40">Loading map…</div>
	{:else if !hasShape}
		<div class="flex h-16 items-center justify-center text-sm opacity-40">No map available</div>
	{:else}
		<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="w-full">
			{#each paths as p, i (i)}
				<path
					d={p.d}
					fill={p.highlighted ? '#e85d26' : '#d1d5db'}
					stroke="white"
					stroke-width={p.highlighted ? 1.5 : 0.7}
					opacity={p.highlighted ? 1 : 0.7}
				/>
			{/each}
		</svg>
	{/if}
</div>
