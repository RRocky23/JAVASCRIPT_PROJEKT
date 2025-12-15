export const TYPE_COLORS = {
    normal: "#919AA2",
    fire: "#FF9D55",
    water: "#5090D6",
    electric: "#F4D23C",
    grass: "#63BC5A",
    ice: "#73CEC0",
    fighting: "#CE416B",
    poison: "#B567CE",
    ground: "#D97845",
    flying: "#89AAE3",
    psychic: "#FA7179",
    bug: "#91C12F",
    rock: "#C5B78C",
    ghost: "#5269AD",
    dragon: "#0B6DC3",
    dark: "#5A5465",
    steel: "#5A8EA2",
    fairy: "#EC8FE6"
};

export function lightenColor(hex, percent = 70) {
    if(!hex) {
        return "rgb(200,200,200)";
    }

    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);

    const r = Math.min(255, (num >> 16) + amt);
    const g = Math.min(255, ((num >> 8) & 0xff) + amt);
    const b = Math.min(255, (num & 0xff) + amt);

    return `rgb(${r}, ${g}, ${b})`;
}