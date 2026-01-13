// js/modules/player.js

export class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
    }

    move(steps, boardSize) {
        this.position = Math.min(this.position + steps, boardSize - 1);
    }
}