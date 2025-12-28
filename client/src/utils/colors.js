export const getPokemonColor = (color, isDiscovered = true, deletedFromFavourites = false) => {
    const colors = {
        red: '#FFE0E0',
        blue: '#E0F0FF',
        yellow: '#FFF8E0',
        green: '#E0FFE0',
        purple: '#F0E0FF',
        pink: '#FFE0F0',
        brown: '#F0E8E0',
        gray: '#F0F0F0',
        white: '#FFFFFF',
        black: '#E8E8E8'
    };
    
    if(!isDiscovered || deletedFromFavourites) {
        return '#AAAAAA';
    }

    return colors[color?.toLowerCase()] || '#AAAAAA';
};

export const getTypeBadgeColor = (color, isDiscovered = true) => {
    const colors = {
        water: '#6890F0',
        fire: '#F08030',
        grass: '#78C850',
        electric: '#F8D030',
        psychic: '#F85888',
        ice: '#98D8D8',
        dragon: '#7038F8',
        dark: '#705848',
        fairy: '#EE99AC',
        normal: '#A8A878',
        fighting: '#C03028',
        flying: '#A890F0',
        poison: '#A040A0',
        ground: '#E0C068',
        rock: '#B8A038',
        bug: '#A8B820',
        ghost: '#705898',
        steel: '#B8B8D0'
    };

    if(!isDiscovered) {
        return '#777777';
    }

    return colors[color?.toLowerCase()] || '#777777';
}

export const getSearchTypeColor = (color) => {
    const colors = {
        bug: '#91C12F',
        dark: '#5A5465',
        dragon: '#0B6DC3',
        electric: '#F4D23C',
        fairy: '#EC8FE6',
        fighting: '#CE416B',
        fire: '#FF9D55',
        flying: '#89AAE3',
        ghost: '#5269AD',
        grass: '#63BC5A',
        ground: '#D97845',
        ice: '#73CEC0',
        normal: '#919AA2',
        poison: '#B567CE',
        psychic: '#FA7179',
        rock: '#C5B78C',
        steel: '#5A8EA2',
        water: '#5090D6'
    };

    return colors[color?.toLowerCase()] || '#777777';
}