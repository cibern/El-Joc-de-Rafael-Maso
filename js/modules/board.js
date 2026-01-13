// js/modules/board.js
export class Board {
    constructor(containerId, size = 63) {
        this.container = document.getElementById(containerId);
        this.size = size;
        this.casillasMateriales = {
            Forja: [10, 30, 58], // Posicions especials per Forja.
            Vitrall: [12, 35, 55], // Vitrall.
            Ceràmica: [5, 21, 52], // Cerámica.
            Pedra: [20, 42, 54] // Pedra.
        };
        this.generateSpiralBoard();
    }

    createGameMessagesContainer() {
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'gameMessages';
        messagesContainer.style.position = 'absolute';
        messagesContainer.style.top = '50%';
        messagesContainer.style.left = '50%';
        messagesContainer.style.transform = 'translate(-50%, -50%)';
        messagesContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        messagesContainer.style.color = 'white';
        messagesContainer.style.padding = '10px';
        messagesContainer.style.borderRadius = '10px';
        messagesContainer.style.display = 'none'; // Ocultar inicialmente
        messagesContainer.style.zIndex = '100'; // Asegurarse de que se muestre sobre las casillas
        this.container.appendChild(messagesContainer);
        return messagesContainer;
    }

    showGameMessage(message) {
        this.gameMessages.textContent = message;
        this.gameMessages.style.display = 'block'; // Mostrar el contenedor con el mensaje
    
        // Opcional: ocultar después de un tiempo
        setTimeout(() => {
            this.gameMessages.style.display = 'none';
        }, 4000); // Oculta el mensaje después de 4 segundos
    }

    generateSpiralBoard() {
        let directionChanges = 0; // Contador de cambios de dirección
        let steps = Math.ceil(Math.sqrt(this.size)); // Pasos máximos en una dirección
        let stepCounter = 0; // Pasos tomados en la dirección actual
        let direction = 0; // 0: derecha, 1: abajo, 2: izquierda, 3: arriba
        let position = { x: -1, y: 0 }; // Iniciamos fuera del tablero para la primera casilla
        const stepSize = 80; // Tamaño de cada paso/casilla

        // Ajustes iniciales para el tamaño del contenedor
        this.container.style.width = `640px`;
        this.container.style.height = `720px`;

        for (let i = 0; i < this.size; i++) {
            // Moverse en la dirección actual
            if (direction === 0) position.x++;
            else if (direction === 1) position.y++;
            else if (direction === 2) position.x--;
            else if (direction === 3) position.y--;

            // Crear y posicionar la casilla
            const square = document.createElement('div');
            square.className = 'gameSquare';
            square.textContent = i;
            square.setAttribute('data-casilla', i);
            square.style.left = `${position.x * stepSize}px`;
            square.style.top = `${position.y * stepSize}px`;

            // Asignar imagen de fondo a la casilla
            square.style.backgroundImage = `url('assets/images/img${i}.jpg')`;
            square.style.backgroundSize = 'cover'; // Ajusta la imagen para cubrir la casilla

            // Asignar clase adicional para casillas rodonas
            if (this.isRoundSquare(i)) {
                square.classList.add('roundSquare');
                this.assignMaterialClass(square, i);
            }

            this.container.appendChild(square);

            stepCounter++;

            // Cambiar de dirección si es necesario
            if (stepCounter === steps) {
                direction = (direction + 1) % 4;
                stepCounter = 0;
                directionChanges++;
                
                // Cada 2 cambios de dirección, reducimos los pasos disponibles
                if (directionChanges % 2 === 0) steps--;
            }
        }

        const centerDiv = document.createElement('div');
        centerDiv.id = 'centerDiv';
        centerDiv.style.position = 'absolute';
        centerDiv.style.width = '220px'; // Tamaño de una casilla
        centerDiv.style.height = '220px'; // Tamaño de una casilla
        centerDiv.style.left = '170px'; // Centrado en el ancho ajustado con margen
        centerDiv.style.top = '250px'; // Centrado en el alto ajustado con margen
        centerDiv.style.zIndex = '10';
        centerDiv.style.display = 'flex';
        centerDiv.style.alignItems = 'center';
        centerDiv.style.justifyContent = 'center';
        centerDiv.style.backgroundColor = '#FFF';
        centerDiv.textContent = 'El joc de Rafael Masó.';
        centerDiv.setAttribute('data-casilla', '63');
        this.container.appendChild(centerDiv);

        function abrirVentanaEmergente() {
            ventanaEmergente.style.display = 'flex';
        }
        
        centerDiv.addEventListener('click', abrirVentanaEmergente);

        const ventanaEmergente = document.createElement('div');
        ventanaEmergente.id = 'ventanaEmergente';
        ventanaEmergente.style.position = 'fixed';
        ventanaEmergente.style.width = '50%';
        ventanaEmergente.style.height = '50%';
        ventanaEmergente.style.left = '25%';
        ventanaEmergente.style.top = '25%';
        ventanaEmergente.style.display = 'none';
        ventanaEmergente.style.alignItems = 'center';
        ventanaEmergente.style.justifyContent = 'center';
        ventanaEmergente.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        ventanaEmergente.style.borderRadius = '20px';
        ventanaEmergente.style.zIndex = '100';
        ventanaEmergente.textContent = '';
        ventanaEmergente.style.boxShadow = '0 0 0 10px rgba(0, 0, 0, 0.1)';
        ventanaEmergente.style.padding = '1%';
        document.body.appendChild(ventanaEmergente);

        const normasJuego = document.createElement('div');
        normasJuego.innerHTML = `
    <p><strong>Normes del joc:</strong></p>
    <ul>
            <li><b><u>Participació i equips:</u></b> Els jugadors s'agrupen en equips, cadascun representant un dels materials característics utilitzats per Masó: <b><u>Vitralls, Forja, Ceràmica i Pedra</u></b>. L'objectiu és recórrer el tauler, caient en caselles que revelen aspectes rellevants de la vida o el treball de l'arquitecte.</li><br>
            <li><b><u>Puntuació i estratègia:</u></b>  En caure en una casella, l'equip rep una puntuació que pot ser positiva o negativa, reflectint el valor atribuït a aquesta casella específica. Si un equip cau en una casella corresponent al seu material, rep una bonoficació de 3 punts. D'altra banda, si es cau en una casella d'un material diferent al que representa representa una pèrdua de 6 punts, que es reparteixen a parts iguals a la resta d'equips com a compensació.</li><br>
            <li><b><u>Objectiu del joc:</u></b> Més enllà d'acumular punts, el veritable propòsit del joc és promoure el coneixement sobre Rafael Masó. L'equip guanyador, per tant, no es determina únicament per la quantitat de punts obtinguts al final del joc, sinó també pel nivell d'aprenentatge assolit sobre la figura de Masó, avaluat a través d'un mètode complementari al sistema de puntuació.</li>
        </ul>
`;
        ventanaEmergente.appendChild(normasJuego);

        const cerrarVentana = document.createElement('button');
        cerrarVentana.textContent = 'X';
        cerrarVentana.style.position = 'absolute';
        cerrarVentana.style.top = '10px';
        cerrarVentana.style.right = '10px';
        cerrarVentana.style.cursor = 'pointer';

        cerrarVentana.addEventListener('click', function() {
            ventanaEmergente.style.display = 'none';
        });
        ventanaEmergente.appendChild(cerrarVentana);
    }

    isRoundSquare(index) {
        return Object.values(this.casillasMateriales).some(positions => positions.includes(index));
    }

    assignMaterialClass(square, index) {
        if (this.casillasMateriales.Forja.includes(index)) {
            square.classList.add('forja');
        } else if (this.casillasMateriales.Vitrall.includes(index)) {
            square.classList.add('vitrall');
        } else if (this.casillasMateriales.Ceràmica.includes(index)) {
            square.classList.add('ceramica');
        } else if (this.casillasMateriales.Pedra.includes(index)) {
            square.classList.add('pedra');
        }
    }
}

