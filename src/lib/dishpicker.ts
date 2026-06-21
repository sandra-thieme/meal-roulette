import dishes from '$lib/data/dishes.json';

export type DishEntry = {
	country: string;
	iso_code: string;
	dishes: string[];
	flag: string;
	continent: string;
};

const typedDishes = dishes as DishEntry[];

export const randomEntry = (): DishEntry => {
	return typedDishes[Math.floor(Math.random() * typedDishes.length)];
};

export const getDishImage = async (query: string): Promise<string> => {
	const url =
		`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
		`&prop=pageimages&piprop=thumbnail&pithumbsize=400&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1`;

	const res = await fetch(url);
	const data = await res.json();

	const pages = data.query?.pages;
	if (!pages) return '';

	const first = Object.values(pages)[0] as any;
	return first?.thumbnail?.source ?? '';
};
