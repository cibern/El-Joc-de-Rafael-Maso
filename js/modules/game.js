// js/modules/game.js
import { Board } from './board.js';
import { Player } from './player.js';

export class Game {
    constructor(boardSize) {
        this.board = new Board('gameBoard', boardSize); // Asegúrate de que el ID coincide con tu contenedor en HTML
        this.players = [new Player('Jugador 1'), new Player('Jugador 2')];
        this.currentPlayerIndex = 0;
    }
}
