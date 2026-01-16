import pointInPolygon from "point-in-polygon";

import { worldPokemon } from "./game/worldState.js";
import { CAMPUS_POLYGON } from "./config/campus.js";

export function initSockets(io) {
    io.on("connection", socket => {
        socket.on("player:move", loc => {
        if(!pointInPolygon([loc.lng, loc.lat], CAMPUS_POLYGON.map(p => [p[1], p[0]]))) {
            socket.emit("outside-boundary")
            return
        }
    })

    socket.on("pokemon:catch", id => {
        const pokemon = worldPokemon.get(id)
        if (!pokemon) return
            socket.emit("pokemon:catch:success", pokemon);
        })
    })
}
