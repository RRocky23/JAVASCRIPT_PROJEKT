import { getSearchTypeColor } from './colors.js';

export const getPokemonTypes = () => {
    const typeNames = [
        'Normal',
        'Fire',
        'Water',
        'Electric',
        'Grass',
        'Ice',
        'Fighting',
        'Poison',
        'Ground',
        'Flying',
        'Psychic',
        'Bug',
        'Rock',
        'Ghost',
        'Dragon',
        'Dark',
        'Steel',
        'Fairy'
    ];

    return typeNames.map(typeName => ({
        name: typeName,
        color: getSearchTypeColor(typeName, true),
        image: `/types/${typeName.toLowerCase()}.png`
    }));
};