// ######  PREPARACIÓ JOC ##############################################
import { Board } from './modules/board.js';

document.addEventListener('DOMContentLoaded', () => {
    new Board('gameBoard'); // ID conenidor del taulell de joc  es 'gameBoard'
    crearYPosicionarFichas();
    agregarEventListenersCasillas(); // Es crida la funció que permet saber la informació de la casella sense haver de caure-hi.
    actualizarMarcador(); // Llama aquí a tu función para inicializar el marcador
    cambiarColorCasillas();
    cambiarColorCasillasNegativas();
    cambiarColorCasillasEstandard();
    cambiarColorCasillasBuenas();
    cambiarColorCasillasMuyBuenas();
});

function checkZoomLevel() {
    // Obtenir el nivell de zoom actual
    const zoomLevel = Math.round(window.devicePixelRatio * 100);
    const warningMessage = document.getElementById('warningMessage');
    const gameContainer = document.getElementById('gameContainer');

    if (zoomLevel < 80 || zoomLevel > 100) {
        warningMessage.style.display = 'flex';
        gameContainer.style.display = 'none';
    } else {
        // Aquí només amaguem el missatge si la mida de la pantalla és més gran que 1910px
        if (window.innerWidth > 1910) {
            warningMessage.style.display = 'none';
            gameContainer.style.display = 'flex';
        } else {
            warningMessage.style.display = 'none';
            gameContainer.style.display = 'none';
        }
    }
}

// Comprova el nivell de zoom quan es carrega la pàgina
window.addEventListener('load', checkZoomLevel);

// Comprova el nivell de zoom i la mida de la pantalla quan la finestra es redimensiona
window.addEventListener('resize', checkZoomLevel);



// Representació bàsica dels equips i la seva posició inicial
let equipos = [
    { id: 1, nombre: "Forja", tipo: "Forja", posicion: 0, posicionAnterior: 0, puntuacion: 0, ficha: null },
    { id: 2, nombre: "Vitrall", tipo: "Vitrall", posicion: 0, posicionAnterior: 0, puntuacion: 0, ficha: null },
    { id: 3, nombre: "Ceràmica", tipo: "Ceràmica", posicion: 0, posicionAnterior: 0, puntuacion: 0, ficha: null },
    { id: 4, nombre: "Pedra", tipo: "Pedra", posicion: 0, posicionAnterior: 0, puntuacion: 0, ficha: null }
];
const coloresEquipos = ['ff4757', '#1e90ff', '#2ed573', '#ffa502'];  // Codis de colors

const casillasMateriales = {
    Forja: [10, 30, 58], // Posicions especials per Forja.
    Vitrall: [12, 35, 55], // Vitrall.
    Ceràmica: [5, 21, 52], // Cerámica.
    Pedra: [20, 42, 54] // Pedra.
};

const casillasnegativas = [25, 29, 32, 34, 39, 43, 46, 49, 50, 57, 60];
const casillasestandard = [1,3,6,8,11,13,15,16,17,19,28,38,41,47,48,53,62];
const casillasBuenas    = [2,4,9,18,22,23,24,26,27,31,33,37,40,44,45,51,56,61];
const casillasMuyBuenas = [7,14,36,59];

let equipoEnTurno = -1; //Index de l'equip que té el torn actual.
let casillasLeidas = [];

// ######  MODIFICAR LES EL COLOR DEL TEXT DE LES CASELLES ##############################################

function cambiarColorCasillas() {
    // Recorrer cada categoría de materiales
    for (const casillas of Object.values(casillasMateriales)) {
        //Recòrrer cada número de casella
        casillas.forEach(numCasilla => {
            //Seleccionar totes les caselles que coincideixin amb el  número actual
            document.querySelectorAll(`.gameSquare[data-casilla="${numCasilla}"]`).forEach(elementoCasilla => {
                // Canviar el color del text a taronja
                elementoCasilla.style.color = 'ORANGE';
            });
        });
    }
}

function cambiarColorCasillasNegativas() {
    //Recòrrer cada número de caselles negatives
    casillasnegativas.forEach(numCasilla => {
        //Seleccionar totes les caselles que coincideixin amb el  número actual
        document.querySelectorAll(`.gameSquare[data-casilla="${numCasilla}"]`).forEach(elementoCasilla => {
            // Canviar el color del text a vermell
            elementoCasilla.style.color = 'red';
        });
    });
}

function cambiarColorCasillasEstandard() {
    //Recòrrer cada número de caselles estàndard
    casillasestandard.forEach(numCasilla => {
        //Seleccionar totes les caselles que coincideixin amb el  número actual
        document.querySelectorAll(`.gameSquare[data-casilla="${numCasilla}"]`).forEach(elementoCasilla => {
            // Canviar el color a verd
            elementoCasilla.style.color = '#98fb98';
        });
    });
}

function cambiarColorCasillasBuenas() {
    //Recòrrer cada número de caselles bones
    casillasBuenas.forEach(numCasilla => {
        //Seleccionar totes les caselles que coincideixin amb el  número actual
        document.querySelectorAll(`.gameSquare[data-casilla="${numCasilla}"]`).forEach(elementoCasilla => {
            // Canviar el color a verd més fosc
            elementoCasilla.style.color = '#adff2f';
        });
    });
}

function cambiarColorCasillasMuyBuenas() {
    //Recòrrer cada número de caselles molt bones
    casillasMuyBuenas.forEach(numCasilla => {
        //Seleccionar totes les caselles que coincideixin amb el  número actual
        document.querySelectorAll(`.gameSquare[data-casilla="${numCasilla}"]`).forEach(elementoCasilla => {
            // Canviar el color a verd fosc
            elementoCasilla.style.color = '#006400';
        });
    });
}

// ######  TIRAR DAU ##############################################

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}

const maxContador = 10; //Defineix el màxim iteracions per l'animació.
const intervalo = 100; // Defineix  intèrval en milisegons.

document.getElementById('rollDice').addEventListener('click', () => {
    var audioPlayerDice = document.getElementById('audioPlayerDice'); // Obtén el elemento de audio de los dados

    if (!audioPlayerDice.paused) {
        audioPlayerDice.pause(); // Pausa el audio si está reproduciéndose
        audioPlayerDice.currentTime = 0; // Restablece el tiempo del audio a 0
    }

    audioPlayerDice.play(); // Reproduce el audio de los dados nuevamente si es necesario
    var audioPlayer = document.getElementById('audioPlayer'); // Obtén el elemento de audio.
    //console.log("Estat de l'àudio: ", audioPlayer.paused ? "En pausa" : "Repoduint-se");
    
    // Intenta pausar y reiniciar l'àudio  només s'està reproduint.
    if (!audioPlayer.paused) {
        audioPlayer.pause(); // Pausa l'àudio si s'està reproduint.
        audioPlayer.currentTime = 0; //Reestableix el temps de l'àudio a 0.
        //console.log("Audio pausado y reiniciado.");
    }
    // S'afefeix un petit retard abans de reproduir l'àudio novament per assegurar que està en pausa.
    setTimeout(() => {
        // Reprodueix l'àudio de nou si és necessari.
        //console.log("Audio en reproducción.");
    }, 1000);
    
    let contador = 0;
    const resultadoFinal = tirarDado(); //Utilitza la funció tirarDado() per obtenir el resultat final
    
    const intervalId = setInterval(() => {
        // Simula  animació mostrant números aleatoris
        const numeroAleatorio = Math.floor(Math.random() * 6) + 1;
        document.getElementById('numeroDado').textContent = numeroAleatorio;
        contador++;

        if (contador >= maxContador) {
            clearInterval(intervalId); // Atura l'animació.
            document.getElementById('numeroDado').textContent = resultadoFinal; // Mostra el resultat final del dau
            //Retrasa el moviment de la fitxa perquè ocorri desp´res de mostrar el resultat final
            setTimeout(() => {
                moverFicha(resultadoFinal); //  //Crida a moverFicha() amb el resultat final.
            }, 50); //Retràs per començar el moviment de la fitxa.
        }
    }, intervalo);
});

// ######  POSICIONAR FITXES INICIALS ##############################################

function crearYPosicionarFichas() {
    const posicionFichas = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    equipos.forEach((equipo, index) => {
        const ficha = document.createElement('div');
        ficha.classList.add('ficha', `equipo${equipo.id}`, posicionFichas[index % posicionFichas.length]);
        ficha.textContent = equipo.nombre[0]; // Utilitza la primera lletra del nom de l'equip com a identificador de la fitxa.

        const casillaSalida = document.querySelector('#gameBoard .gameSquare[data-casilla="0"]');
        if (casillaSalida) {
            casillaSalida.appendChild(ficha);
        } else {
            console.error('Casella de sortida no trobada...');
        }

        equipo.ficha = ficha; 
    });
}

// ######  MOURE FITXA ##############################################

function moverFicha() {
    const resultadoDado = tirarDado();
    equipoEnTurno = (equipoEnTurno + 1) % equipos.length;
    actualizarTurnoVisual();
    //console.log(`Resultat del dau: ${resultadoDado}`);
    document.getElementById('numeroDado').textContent = resultadoDado;
    //Retrassa l'actualització de la posició i el moviment de la ficha 1 segon.
    
    setTimeout(() => {
        // Actualitza la posició de l'equip actual
        let equipoActual = equipos[equipoEnTurno];
        equipoActual.posicionAnterior = equipoActual.posicion;
        equipoActual.posicion += resultadoDado;
        //Comprova si la casella actual té una puntuació assignada i sumar-la a la puntuació de l'equip.
        const casillaActual = informacionCasillas[equipoActual.posicion];

        if (casillaActual && casillaActual.puntuacion) {
            equipoActual.puntuacion += casillaActual.puntuacion;
            mostrarMensajeEnUI(`<strong>${equipoActual.nombre}</strong> guanya <strong>${casillaActual.puntuacion} ${casillaActual.puntuacion === 1 ? 'punt' : 'punts' }</strong>. \n\nPuntuació total: <strong>${equipoActual.puntuacion}</strong>`);
            //console.log(`${equipoActual.nombre} obté ${casillaActual.puntuacion} punts. Puntuació total: ${equipoActual.puntuacion}`);
        }
        let casillaEspecialParaOtroEquipo = false;
        let casillaPropia = false;
        //Itera sobre les caselles de materials (casillasMateriales) per trobar si la posició actual és especial.
        Object.entries(casillasMateriales).forEach(([material, posiciones]) => {
            if (posiciones.includes(equipoActual.posicion)) {
                //Comprova si la casella actual NO correspon al material de l'equip.
                if (equipoActual.tipo !== material) {
                    casillaEspecialParaOtroEquipo = true;
                }else{
                    casillaPropia = true; // La casella correspon al material de l'equip.
                }
            }
        });

        // Si la casella és especial per un altre equip:
        if (casillaEspecialParaOtroEquipo) {
            // Esta 6 punts a l'equip actual
            equipoActual.puntuacion -= 6;
            mostrarMensajeEnUI(`<strong>${equipoActual.nombre}</strong> cau en un material que no és el seu i perd 6 punts...La resta d'equips en guanyen 2!\n\nPuntuación total: <strong>${equipoActual.puntuacion}</strong>`);
            // Suma 2 punta a la resta d'equips
            equipos.forEach(equipo => {
                if (equipo.id !== equipoActual.id) {
                    equipo.puntuacion += 2;
                }
            });
        } else if (casillaPropia) { // Si l'equip actual cau sobre el seu propi material:
            equipoActual.puntuacion += 3; // Suma 3 punts
            mostrarMensajeEnUI(`<strong>${equipoActual.nombre}</strong> cau en una casella del seu propi material i aconsegueix 3 punts! \n\nPuntuació total: <strong>${equipoActual.puntuacion}</strong>`);
        }
        // Comprova si la casella ja ha estat llegida
        if (!casillasLeidas.includes(equipoActual.posicion)) {
            mostrarInformacionCasilla(equipoActual.posicion);
            casillasLeidas.push(equipoActual.posicion); // Marca la casella com llegida
            console.log(casillasLeidas);

            // Llegeix el text de la casella
            setTimeout(() => {
                var descripciones = document.getElementsByClassName('descripcion-casilla');
                if (descripciones.length > 0) {
                    var texto = descripciones[0].textContent; // Usa el primer element de la col·lecció
                    hablarTexto(texto);
                } else {
                    console.log("No s'han trobat elements amb la classe 'descripcion-casilla'");
                }
            }, 1000); // Espera 1 segon per assegurar que el DOM s'hagi actualitzat
        }

        moverVisualmenteFicha(equipoActual);
        mostrarInformacionCasilla(equipoActual.posicion);
        actualizarMarcador();
        actualitzarColorBoton();  // Actualitza el color del botó amb el nou torn
        if (equipoActual.posicion >= 63) {
            setTimeout(() => {
                moverFichaAlCentro(equipoActual);
                setTimeout(() => {
                    mostrarModalGanador(`¡Felicitats, ${equipoActual.nombre} has sigut el primer en acabar el joc!`);
                    equipoActual.posicion = 63; // Asegurar que la posición no excede 63
                    // Reproduir el so del final
                    const audioFinal = document.getElementById('final');
                    audioFinal.play();

                }, 500); // Este timeout espera a que la animación de mover al centro se complete.
            }, 500); // Este timeout asegura que el movimiento de la ficha al destino se ha completado.
        }
    }, 1000);
}
// Afegir esdeveniments al botó per a dispositius amb clic i tàctil

document.getElementById('rollDice').addEventListener('touchstart', function(event) {
    event.preventDefault(); // Evitar el doble esdeveniment clic/tàctil
    moverFicha();
});

// ######  PODER VEURE INFORMACIÓ CASELLA CLICADA ##############################################

function agregarEventListenersCasillas() {
    const casillas = document.querySelectorAll('.gameSquare');
    casillas.forEach(casilla => {
        casilla.addEventListener('click', () => {
            const numeroCasilla = casilla.dataset.casilla; 
            mostrarInformacionCasilla(numeroCasilla); 
        });
    });
}

// ######  LLISCAR FITXA

function moverVisualmenteFicha(equipoActual) {
    const casillaInicial = document.querySelector(`.gameSquare[data-casilla="${equipoActual.posicionAnterior}"]`);
    const casillaDestino = document.querySelector(`.gameSquare[data-casilla="${equipoActual.posicion}"]`);

    if (casillaInicial && casillaDestino) {
        const ficha = document.querySelector(`.ficha.equipo${equipoActual.id}`);
        if (ficha) {
            //S'assegura que la ficha comenci a la posició correcta abans de moure-la
            casillaInicial.appendChild(ficha);  
            ficha.style.transition = 'none';  // S'elimina qualsevol transició existent per calcular la posició.
            ficha.style.transform = 'translate(0, 0)';  // Reseteja la transformació per evitar efectes residuals.
            //Calcula la diferència de posició absoluta per moure la ficha.
            const rectInicial = casillaInicial.getBoundingClientRect();
            const rectDestino = casillaDestino.getBoundingClientRect();
            const deltaX = rectDestino.left - rectInicial.left;
            const deltaY = rectDestino.top - rectInicial.top;
            moveSound.play();

            // Moure la fitxa a la casella destí amb una transició
            setTimeout(() => {
                ficha.style.transition = 'transform 0.5s ease-in-out';  // Estableix transició pel moviment.
                ficha.style.transform = `translate(${deltaX}px, ${deltaY}px)`;  // Moure a casella destí.
                //Mou la fitxa físicament a la casella destí
                setTimeout(() => {
                    casillaDestino.appendChild(ficha);
                    ficha.style.transition = '';
                    ficha.style.transform = '';
                }, 500); // Espera 0.5 s a que acabi l'animació abans de finalitzar.
            }, 50); // Temps que el navegador reconeix l'estat inicial.
        }
    } else {
        console.error('Error movent la fictxa: Casella destí no trobada.');
    }
}

// ######  MARCADOR ##############################################

function actualizarTurnoVisual() {
    //Treure l'estil de torn actual de tots els jugadors
    const filasJugadores = document.querySelectorAll('.fila-jugador');
    filasJugadores.forEach(fila => {
        fila.style.backgroundColor = ''; // Reestableix el fons.
    });
    const jugadorEnTurno = equipos[equipoEnTurno].nombre;
    const filaJugadorActual = document.getElementById(`fila-${jugadorEnTurno}`);
    if (filaJugadorActual) {
        filaJugadorActual.style.backgroundColor = 'red'; // Canvia el color de fons a vermell
    }
}

// ######  MOSTRAR INFORMACIÓ CASELLA ##############################################

function mostrarInformacionCasilla(numeroCasilla) {
    const casilla = informacionCasillas[numeroCasilla];

    const contenedor = document.getElementById('casillaInfo');
    contenedor.innerHTML = ''; // Neteja el contingut actual.
    contenedor.style.opacity = '0';
    contenedor.style.visibility = 'hidden';

    if (equipoEnTurno < 0 || equipoEnTurno >= equipos.length) {
        console.error('Índice de equipoEnTurno fuera de rango:', equipoEnTurno);
        return; // Surt de la funció si l'equip no està definito o fora de rang.
    }
    const equipoActual = equipos[equipoEnTurno]; //Obté l'equip actual basat en l'equipoTurno
    
    if (casilla) {
        //TÍTOL
        const titulo = document.createElement('h2');
        titulo.textContent = casilla.titulo;
        contenedor.appendChild(titulo);
        //PUNTUACIÓ
        const puntuacion = document.createElement('h3');
        let textoPuntuacion = `Puntuació: ${casilla.puntuacion} `;
        textoPuntuacion += casilla.puntuacion === 1 ? "punt" : "punts"; // Determina si s'ha d'utilitzar "punt" o "punts".
        puntuacion.textContent = textoPuntuacion;
        //TEXT
        const descripcion = document.createElement('p');
        descripcion.classList.add('descripcion-casilla');
        descripcion.innerHTML = casilla.descripcion;
        //IMATGE
        const foto = document.createElement('img');
        foto.src = casilla.foto;
        foto.alt = `Imagen de ${casilla.titulo}`;
        foto.style.maxWidth = '100%'; // Assegura que la imatge no excedeix la mida del seu contenidor.
        //IMATGE
        
        // Verifica si la casella actual és una de las casellas especials de materials y si coincideix amb el tipus de l'equipo.
        let esCasillaMaterial = false;
        let materialCasilla = '';

        // Encuentra el material de la casilla si existe
        Object.entries(casillasMateriales).forEach(([material, posiciones]) => {
            if (posiciones.includes(parseInt(numeroCasilla))) {
                esCasillaMaterial = true;
                materialCasilla = material;
            }
        });
        
        if (esCasillaMaterial) {
            /*
            let mensajeRecuperado = materialCasilla === "Vitrall" ? "RECUPERAT" : "RECUPERADA";
            let mensajePerdido = materialCasilla === "Vitrall" ? "PERDUT" : "PERDUDA";

            if (equipoActual.tipo === materialCasilla) {
                descripcion.textContent = `Molt bé! ${materialCasilla.toUpperCase()} ${mensajeRecuperado.toString()}!!`;
                console.log(`Texto a enviar: ${descripcion.textContent}`);
            }else{
                descripcion.textContent = ` ${materialCasilla.toUpperCase()} ${mensajePerdido.toString()}`;
                console.log(`Texto a enviar: ${descripcion.textContent}`);
            }
            */
        }else{
            // Per les casilles no especiales, mostrar la descripció com sempre...
            descripcion.innerHTML = casilla.descripcion;
            // Només mostrar puntuació si no és casella especial de material
            const puntuacion = document.createElement('h3');
            let textoPuntuacion = `Puntuació: ${casilla.puntuacion} `;
            textoPuntuacion += casilla.puntuacion === 1 ? "punt" : "punts";
            puntuacion.textContent = textoPuntuacion;
            contenedor.appendChild(puntuacion);
        }
        contenedor.appendChild(descripcion);
        contenedor.appendChild(foto);
        setTimeout(() => {
            contenedor.style.visibility = 'visible';
            contenedor.style.opacity = '1';
        }, 10); // Pdetit retraàs per permietre que el DOM s'actualitzi amb el nou contingut abans de la transició.
    }else{
        contenedor.textContent = "";
    }    
}

// ######  ACTUALITZAR TAULA MARCADOR ##############################################

function actualizarMarcador() {
    const tbody = document.getElementById('scoreBoardBody');
    tbody.innerHTML = ''; // Neteja el contingut previ.
    equipos.forEach((equipo, index) => {
        //Crea una nova fila i caselles per les dades de cada equip.
        const fila = document.createElement('tr');
        //Verifica si l'equip en iteració és l'equip en torn i resalta la fila.

        if(index === equipoEnTurno) {
            fila.style.backgroundColor = 'red'; // Canvia el color de fons a vermell
        }

        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = equipo.nombre;
        const celdaPuntuacion = document.createElement('td');
        celdaPuntuacion.textContent = equipo.puntuacion;
        celdaPuntuacion.classList.add('puntuacion-grande');
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaPuntuacion);
        // Añade la fila al cuerpo de la tabla
        tbody.appendChild(fila);
    });
}

// ######  ACTUALITZAR COLOR BOTÓ ##############################################

function actualitzarColorBoton(){
    //console.log(`Torn actual: ${equipoEnTurno}, Color: ${coloresEquipos[equipoEnTurno % coloresEquipos.length]}`);
    const boton = document.getElementById('rollDice');
    if (boton && equipos.length > equipoEnTurno) {
        let proximoTurno = (equipoEnTurno + 1) % equipos.length;
        boton.textContent = `Torn de ${equipos[proximoTurno].nombre}`;
        // Cambiar el color de fons utilizant l'índex actualizat
        boton.style.backgroundColor = coloresEquipos[proximoTurno % coloresEquipos.length];
        if (boton.textContent === `Torn de Forja`) {
            boton.style.backgroundColor = '#ff4757'; // Color vermell brillant per Forja.
        } else if (boton.textContent === `Torn de Vitrall`) {
            boton.style.backgroundColor = '#1e90ff'; // Color blau brillant per Vitrall.
        } else if (boton.textContent === `Torn de Ceràmica`) {
            boton.style.backgroundColor = '#2ed573'; // Color verd brillant per Pedra.
        } else if (boton.textContent === `Torn de Pedra`) {
            boton.style.backgroundColor = '#ffa502'; // Color groc brillant per Fusta.
        }
    }
}

// ######  MOSTRAR INFORMACIÓ DEL JOC ##############################################

function mostrarMensajeEnUI(mensaje) {
    const gameInfo = document.getElementById('gameInfo');
    gameInfo.innerHTML = ''; // Neteja el contingut existent en el div.
    mensaje.split('\n').forEach(parte => {
        if(parte) { 
            const parrafo = document.createElement('p');
            parrafo.innerHTML = parte; 
            gameInfo.appendChild(parrafo);
        } else { 
        }
    });
}

// ######  MOURE LA FICHA GUANYADORA AL CENTRE ##############################################

function moverFichaAlCentro(equipoActual) {
    const ficha = document.querySelector(`.ficha.equipo${equipoActual.id}`);
    const centro = document.getElementById('centerDiv');
    if (centro && ficha) {
        // Llegir el número del dau que ha sortit en pantalla
        const resultadoDado = parseInt(document.getElementById('numeroDado').textContent, 10);
        
        equipoActual.posicion=equipoActual.posicion - resultadoDado;

        // Calcular les coordenades del centre del div central per centrar la fitxa
        const rect = centro.getBoundingClientRect();
        
        
        const xCentro = window.scrollX + rect.left + (rect.width / 2)-rect;
        const yCentro = window.scrollY + rect.top + (rect.height / 2)-rect;
       
        let transformX = '-50%';
        let transformY = '-50%';

        // Ajustar les transformacions en funció de la casella actual
        

        if (equipoActual.posicion === 58) {
            transformX = '-200%'; // Ajustar moviment en -x
            transformY = '-100%';
        } else if (equipoActual.posicion === 59) {
            transformX = '-200%'; // Ajustar moviment en -x
            transformY = '-200%';
        } else if (equipoActual.posicion === 60) {
            transformX = '-50%'; // Ajustar moviment en -x
            transformY = '-200%';
        } else if (equipoActual.posicion === 61) {
            transformX = '0%';
            transformY = '-200%'; // Ajustar moviment en -y
        } else if (equipoActual.posicion === 62) {
            transformX = '50%';
            transformY = '-200%'; // Ajustar moviment en -y
        } 

        // Actualitzar la posició de la fitxa per centrar-la al div central
        ficha.style.position = 'absolute';
        ficha.style.left = `${xCentro}px`;
        ficha.style.top = `${yCentro}px`;
        ficha.style.transform = `translate(${transformX}, ${transformY})`; // Ajustar transformació
        ficha.style.zIndex = '100'; // Assegurar que la fitxa està sobre altres elements
    }
}

// ######  MOSTRAR MODAL GUANYADOR ##############################################

function mostrarModalGanador(mensaje) {
    document.getElementById('textoGanador').innerHTML = mensaje;
    document.getElementById('modalGanador').style.display = 'block';
}


// AIzaSyDyTzb70U1sD8Ijbca1qcFg8MqsQZJ_twA

const informacionCasillas = {
    1: {
        titulo: "La casa natal de Rafael Masó (1)",
        descripcion: "La Casa Masó és un edifici situat al <b>número 29 de carrer Ballesteries de Girona</b> i fou la casa natal de l'arquitecte Rafael Masó i Valentí. Guarda la memòria de diverses generacions familiars i és un símbol del desplegament del Noucentisme a Girona. <br><br>Des del 2006 és la seu de la <a href=\"https://rafaelmaso.girona.cat/cat/index.php\" target=\"_blank\">Fundació Rafael Masó.</a>",
        foto: "../assets/images/casella1.jpg",
        puntuacion: 1
    },
    2: {
        titulo: "Naixement de Rafael Masó (2)",
        descripcion: "Rafael Masó va néixer a la Casa Masó de Girona, on s'havien instal·lat els seus pares, Rafael Masó i Pagès i Paula Valentí i Fuster després de casar-se el 1877. La finca era propietat de la família Valentí. <b>Rafael Masó era el segon d'onze germans</b><br><br>Els Masó Valentí van créixer en una família conservadora, catòlica, catalanista i il·lustrada, dins d'un ambient culte, propiciat pels interessos literaris i artístics del seu pare, fundador del Diario de Gerona.",
        foto: "../assets/images/casella2.jpg",
        puntuacion: 2
    },
    3: {
        titulo: "Literatura (3)",
        descripcion: "Senyera! ¡Oh Senyera!<br> Que ardoras nostres cants<br>En tu ¡ Oh dolça Senyera!<br>Veiem tots els encants:<br>Ets bella i magestuosa<br>Amb tos moviments sumptuosos<br>I tos colors, brillants.<br>Tens aires de Regina<br>I dexos sobirans.<br>En tu ¡ oh dolça Senyera<br>ceiem tots els encants.",
        foto: "../assets/images/casella3.jpg",
        puntuacion: 1
    },
    4: {
        titulo: "Esperança Bru Oller (4)",
        descripcion: "Esperança Bru Oller (Girona, 24 d'octubre del 1888 - Girona, 27 d'octubre del 1972) va ser una activista cultural que <b>va promoure l'accés de les dones a l'educació</b>, a través de múltiples iniciatives. <br><br>Va ser cofundadora, juntament amb altres representants de la burgesia gironina, de la Biblioteca Popular de la Dona de Girona i de la Casa de Família per a noies estudiants. <br><br><b>Va ser esposa de l'arquitecte Rafael Masó Valentí.</b>",
        foto: "../assets/images/casella4.jpg",
        puntuacion: 2
    },
    5: {
        titulo: "BONUS! CASA VINYES-MIRALPEIX (5)",
        descripcion: "Un dels primers projectes de nova planta fou la casa <a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=64\" target=\"_blank\">Vinyes-Miralpeix d’Anglès</a>, construïda entre 1907 i 1908, d’estil clarament modernista. És una casa aïllada amb façanes planes estucades i elements ornamentals, com la porta del carrer, on hi ha el símbol d’un peix que al·ludeix al cognom i emblema dels propietaris. Aquesta casa va ser dissenyada com un habitatge unifamiliar, on van tenir nou fills, i també disposava de diverses dependències per a un consultori mèdic. Cal destacar la forja, la ceràmica blava amb motius florals i l’escut català de l’escala.",
        foto: "../assets/images/casella5.jpg",
        puntuacion: 0
    },
    6: {
        titulo: "Estudis a Barcelona (6)",
        descripcion: "Rafael Masó va iniciar els estudis d'arquitectura a Barcelona l'any 1900. El 1906 va tornar a la seva Girona natal amb el títol d'arquitecte, en la mateixa promoció que els seus col·legues i amics Josep Maria Periques i Josep Maria Jujol. Amb aquests compartia, a més, l'admiració per Antoni Gaudí, amb qui havia coincidit al Cercle Artístic de Sant Lluc, a Barcelona. Rafael Masó, juntament amb altres artistes, escriptors i intel·lectuals barcelonins, va protagonitzar l'evolució del Modernisme cap al Noucentisme. ",
        foto: "../assets/images/casella6.jpg",
        puntuacion: 1
    },
    7: {
        titulo: "La farinera Teixidor (7)",
        descripcion: "<a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=41\" target=\"_blank\">La Farinera Teixidor </a>va ser projectada per Rafael Masó l'any 1910 al carrer Santa Eugènia, 42. És una de les obres més representatives de l'arquitecte i està inclosa a l'inventari del Patrimoni Arquitectònic de Catalunya. Només feia quatre anys que havia acabat la carrera d'arquitectura, i el jove Masó, juntament amb les peces de majòlica blanca del taller d'Antoni Serra, les escates dels germans Coromina, la forja de Cadenas i els vitralls de Rigalt, Granell i Cia, va aconseguir materialitzar un edifici que revela la seva funció des de l'exterior. ",
        foto: "../assets/images/casella7.jpg",
        puntuacion: 3
    },
    8: {
        titulo: "El Noucentisme (8)",
        descripcion: "El Noucentisme, un moviment cultural i artístic predominant a Catalunya durant les primeres dècades del segle XX, va sorgir com a resposta al Modernisme, buscant restaurar l'ordre, la disciplina i el classicisme en la creació artística. Caracteritzat per l'ideal de bellesa clàssica, harmonia i perfecció, el Noucentisme va promoure valors com l'equilibri i la claredat en les arts plàstiques, la literatura i l'arquitectura. Aquest moviment va influir no només en l'estètica, sinó també en la política cultural de Catalunya, cercant la modernització de la societat mitjançant l'art i la cultura.",
        foto: "../assets/images/casella8.jpg",
        puntuacion: 1
    },
    9: {
        titulo: "Casa Masó (9)",
        descripcion: "<a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=7 \" target=\"_blank\">La Casa Masó </a>, situada al carrer Ballesteries de Girona, es va formar per la unió de quatre cases menestrals al costat del riu Onyar. Ha estat la residència familiar dels Masó i els seus ancestres durant més de 150 anys. Des de 1910, Rafael Masó, titulat arquitecte des del 1906, va començar a intervenir en l'immoble, creant diversos objectes i mobles per agradar als seus pares. A partir del 1911, va rebre l'encàrrec de reformar-la completament per adaptar-la a una família nombrosa, integrant elements de la tradició catalana amb innovacions i influències del noucentisme.",
        foto: "../assets/images/casella9.jpg",
        puntuacion: 2
    },
    10: {
        titulo: "BONUS! LÀMPADA DEL MENJADOR (10)",
        descripcion: "La làmpada penjant del menjador familiar a la casa Masó és una peça de la primera fase d'obres realitzades el 1910 per Rafael Masó per a la família. Aquest llum està fet de ferro forjat pel ferrer Cadenas, i compta amb dos farbalans de seda natural teixits per les dones de la família. Els dissenys, també creats per Masó, consisteixen en flors de campaneta estilitzades de color lila i fulles verdes, símbols de naturalesa, simplicitat, delicadesa, puresa i esperança, elements que evoquen la seva dona. Durant celebracions especials com Nadal, Setmana Santa o les festes de Sant Narcís, es canviaven els teixits per altres amb motius religiosos.",
        foto: "../assets/images/casella10.jpg",
        puntuacion: 0
    },
    11: {
        titulo: "Els mussols de la casa Batlle (11)",
        descripcion: "Al carrer Fontanilles, 2 cantonada carrer Nou, 15 i avinguda Sant Francesc de Girona Rafael Masó va reformar aquest bloc de pisos per al promotor Lluís Batlle entre els anys 1908 i 1909.<br><br>L'element més conegut de la <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=31\" target=\"_blank\">Casa Batlle</a> són <b>els mussols</b> del coronament de les façanes.",
        foto: "../assets/images/casella11.jpg",
        puntuacion: 1
    },
    12: {
        titulo: "BONUS VITRALL! (12)",
        descripcion: "La casa Masó, tenia molta llum pel la façana que dona al riu, i molt poca pel carrer Ballesteries. Rafael Masó , en les dues reformes que va fer a la casa, va dissenyar vitralls per tal de dur llum cap a l’espai central a través de la galeria cap la menjador, distribuïdor, cuina, habitacions i bany de la planta superior.",
        foto: "../assets/images/casella12.jpg",
        puntuacion: 0
    },
    13: {
        titulo: "Activisme cultural (13)",
        descripcion: "El desembre de 1912, es va fundar <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=14 \" target=\"_blank\">la Sala Athenea </a> a Girona, inspirada en la deïtat i amb un manifest signat per figures com Masó, Xavier Montsalvatge i altres. Proclamava la urgència de crear un centre cultural en resposta a la tragèdia d'una ciutat pobre i miserable. L'objectiu era oferir un refugi on venerar les ciències i les arts, llargament oprimides. Athenea va ser legalment establerta al febrer de 1913, organitzant exposicions d'art, lectures, conferències, concerts i festivals de gimnàstica rítmica per a nens. Tot i els seus esforços culturals, va tancar el 1917 per problemes econòmics.",
        foto: "../assets/images/casella13.jpg",
        
        puntuacion: 1
    },
    14: {
        titulo: "La Punxa (14)",
        descripcion: "<a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=43\" target=\"_blank\">La Punxa </a>, també coneguda com a Casa Teixidor, és un dels edificis més emblemàtics de Girona i obra de Rafael Masó. La seva construcció va començar el 1918, després de la pandèmia de la grip espanyola, quan Alfons Teixidor necessitava magatzems i una oficina per a la seva empresa farinera ubicada davant. L'obra es va aturar fins que Girona es va recuperar, moment en què es va continuar amb la construcció de quatre vivendes a la torre. El disseny de l'edifici inclou una torrassa cilíndrica i una coberta acabada en punta, atorgant-li un aspecte més medievalista que modernista.",
        foto: "../assets/images/casella14.jpg",
        puntuacion: 4
    },
    15: {
        titulo: "Influències internacionals (15)",
        descripcion: "El 1912, després de casar-se amb Esperança Bru, la jove parella va emprendre un viatge de dos mesos per França, Suïssa i Itàlia. Durant aquest recorregut, van descobrir l'Art Nouveau francès i el secessionisme centreeuropeu, influències clau per al desenvolupament del seu propi estil i la seva evolució cap al Noucentisme.",
        foto: "../assets/images/casella15.jpg",
        puntuacion: 1
    },
    16: {
        titulo: "Publicacions (16)",
        descripcion: "Rafael Masó Pagès, pare de Rafael Masó Valentí, va néixer a Santiago de Cuba, fill d\'un indià. Va ser impressor, pintor, polític i procurador. L'any 1889, va fundar el <b>Diario de Gerona de Avisos y Noticias</b> i la Impremta Masó, situada als baixos de la casa familiar al carrer de les Ballesteries de Girona. Malgrat la dedicació al diari, Masó Pagès no va deixar mai la seva carrera judicial com a procurador dels tribunals. Va ocupar el càrrec de degà del Col·legi de Procuradors, regidor de l'Ajuntament de Girona i diputat de la Corporació Provincial.",
        foto: "../assets/images/casella16.jpg",
        puntuacion: 1
    },
    17: {
        titulo: "Façana del cementiri de Girona (17)",
        descripcion: "L'any 1917, Masó guanya el concurs convocat per l'Ajuntament de Girona per a la <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=60\" target=\"_blank\">nova façana del cementiri</a>. El seu projecte preveu una paret de tanca paral·lela a la carretera de Sant Feliu amb un pavelló a cada extrem (la casa del guarda i la capella) i una nova portalada a la part central. El mur de tancament, construït amb pedra de Girona i coronat per un fris ceràmic, inclou diversos elements escultòrics simbòlics. Els pavellons dels extrems combinen argerates grises de Quart, realitzades a Can Marcó, pedra de Girona i ceràmica vidriada de La Gabarra, de la Bisbal.",
        foto: "../assets/images/casella17.jpg",
        puntuacion: 1
    },
    18: {
        titulo: "Casa Cots. Plànols (18)",
        descripcion: "Es tracta d’un bloc dissenyat de nova planta on a la planta baixa hi havia <b>un magatzem de vins</b> i les 5 plantes superiors es destinen a habitatge. <a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=16 \" target=\"_blank\">L’edifici</a> es va executar en dues fases 1924 el magatzem i el 1928 els habitatges. La façana té un esgrafiat central amb <b>un cep carregat de raïms</b>, i a les cantonades hi ha plafons ceràmics. Els balcons també forja i el principal és de pedra.",
        foto: "../assets/images/casella18.jpg",
        puntuacion: 1
    },
    19: {
        titulo: "Col·laboradors: vitralls (19)",
        descripcion: "Els vitralls dissenyats per Masó destaquen per la seva geometria, combinant diversos tipus de vidres i colors. Els models més ornamentats inclouen motius florals, com campanetes o roses. Aquests vitralls van ser realitzats pel taller Rigalt & Granell, considerat el màxim exponent del vitrall d'estètica noucentista.",
        foto: "../assets/images/casella19.jpg",
        puntuacion: 2
    },
    20: {
        titulo: "BONUS PEDRA! (20)",
        descripcion: "Al primer terç del segle XX, es va construir el nou cementiri de Girona, ja que fins llavors la ciutat disposava únicament del cementiri de Sant Daniel i un altre al poble veí de Santa Eugènia. No va ser fins a l'any 1917 que Rafael Masó va guanyar el concurs per dissenyar la tanca del cementiri. Aquesta destaca per un robust basament de pedra ciclòpia, coronat amb ceràmica groga estrigilada. La pedra presenta escultures d'animals que juguen un paper important en la litúrgia cristiana.",
        foto: "../assets/images/casella20.jpg",
        puntuacion: 0
    },
    21: {
        titulo: "BONUS CERÀMICA (21)",
        descripcion: "Un aspecte formal remarcable de la casa Batlle és la coronació de l'edifici, amb una balustrada ondulada amb figures geomètriques i mussols, decoració típicament modernista, de caràcter simbòlic escollida per l'arquitecte com a referència a la saviesa i la paciència. Els murs són d'obra estucada, mentre els acabats foren realitzats amb ceràmica.",
        foto: "../assets/images/casella21.jpg",
        puntuacion: 0
    },
    22: {
        titulo: "Casa Gispert-Saüch (22)",
        descripcion: "Aquest <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=37\" target=\"_blank\">habitatge unifamiliar</a>, situat en una cantonada de la Gran Via de Girona l'any 1921, es caracteritza per incloure locals comercials i un garatge. L'emplaçament va ser valorat després de l'enderroc de les muralles de la ciutat. La composició arquitectònica es defineix per la talla de la cantonada, aportant una planeitat a les façanes. Aquestes estan acabades amb un revestiment de pedra i un coronament de la coberta que alleugereix l'estructura, conferint-li un estilisme vienès distintiu.",
        foto: "../assets/images/casella22.jpg",
        puntuacion: 2
    },
    23: {
        titulo: "Estil propi (23)",
        descripcion: "Rafael Masó és reconegut per un estil propi que fusiona tradició amb innovació estètica. La seva obra es caracteritza per l'ús de forja, vitralls, ceràmica i pedra, definint així el seu enfocament arquitectònic. A través de la forja, incorpora ferro forjat en detalls estructurals i decoratius, mentre que els vitralls afegeixen color i tenen un paper crucial en la il·luminació dels espais. Utilitza ceràmica amb dissenys vibrants i pedra per la seva robustesa i estètica. El seu llegat no només embelleix, sinó que també enriqueix el paisatge cultural de Catalunya amb materials naturals i artesanals.",
        foto: "../assets/images/casella23.jpg",
        puntuacion: 2
    },
    24: {
        titulo: "Treballs urbanístics (24)",
        descripcion: "Rafael Masó s’integrà a la candidatura de la Lliga Regionalista de 1920, per l’Ajuntament de Girona. Sortiren elegits i entrarà a l'ajuntament com a regidor, amb el doble objectiu de racionalitzar l'urbanisme de la ciutat i millorar la dotació d'equipaments educatius i culturals. Masó creia en el poder públic com a creador de institucions culturals. Aquesta etapa va durar fins a la dictadura de Primo de Rivera 1923.",
        foto: "../assets/images/casella24.jpg",
        puntuacion: 2
    },
    25: {
        titulo: "Enderroc casa Omedes (25)",
        descripcion: "La <a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=47 \" target=\"_blank\">Casa Omedes <\a>, de Rafael Masó (1924) situada al carrer Pare Claret, 72, de Girona i que va ser enderrocada l'any 1970.",
        foto: "../assets/images/casella25.jpg",
        puntuacion: -3
    },
    26: {
        titulo: "Disseny de mobiliari i decoració (26)",
        descripcion: "Els interiors dels projectes de Rafael Masó estaven totalment dissenyats, textures, fusta, rajoles, encanyissats, làmpades, mobiliari i teixits. <br><br>Els mobles que va dissenyar per la família o per clients, eren més clàssics i amb motius religiosos, inspirats en la persona que els empraria, en canvi els mobles que va dissenyar pels seus fills eren molt moderns per l’època.",
        foto: "../assets/images/casella26.jpg",
        puntuacion: 2
    },
    27: {
        titulo: "Projectes de vivenda social (27)",
        descripcion: "Rafael Masó va ser un dels primers arquitectes catalans a impulsar l’habitatge social a inicis del segle XX. Influït pels corrents europeus d’urbanisme social i pel moviment higienista, defensava un habitatge obrer digne, saludable i funcional. Va projectar conjunts senzills però de qualitat, com la Urbanització Ensesa (Girona, 1927–1938), pensada per millorar la vida de les famílies treballadores. La seva obra el consolida com una figura clau en la introducció de l’habitatge social a Catalunya.",
        foto: "../assets/images/casella27.jpg",
        puntuacion: 2
    },
    28: {
        titulo: "Participació en el disseny d'exposicions (28)",
        descripcion: "Rafael Masó coma a dibuixant, també va participar en el disseny d'il·lustracions per a publicacions d'exposicions. En aquesta fotografia podem veure un programa de concerts a Athenea dissenyat per Masó",
        foto: "../assets/images/casella28.jpg",
        puntuacion: 1
    },
    29: {
        titulo: "Grafiti (29)",
        descripcion: "El grafitis poden degradar monuments històrics i disminuir el seu valor estètic i patrimonial. Aquest tipus de vandalisme pot conduir a costoses restauracions i afectar la percepció cultural i turística del lloc.",
        foto: "../assets/images/casella29.jpg",
        puntuacion: -2
    },
    30: {
        titulo: "BONUS FORJA! (30)",
        descripcion: "<a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=10 \" target=\"_blank\">La farmàcia Masó<\a>, ubicada al final de la Rambla, va ser un projecte integral de façana i interiorisme dissenyat per Rafael Masó per als farmacèutics Joan Masó, el seu germà petit, i Lluís Puig. <br><br>Actualment, es conserven els interiors, que estan totalment enrajolats amb ceràmica groga de La Bisbal, i compten amb taulells de marbre, forja i vidre. També es preserven els armaris de fusta amb flascons de medicaments, tots dissenyats per Masó i realitzats pel ceramista Antoni Serra d’Olot.<br><br> La façana va ser reformada el 1935 per l’arquitecte Josep Claret, qui va adoptar un estil racionalista.",
        foto: "../assets/images/casella30.jpg",
        puntuacion: 2
    },
    31: {
        titulo: "Col·laboradors: Ceràmica (31)",
        descripcion: "Situat al municipi de Quart, al peu del massís de les Gavarres, aquest obrador artesà és un dels més antics de la Mediterrània, datant de 1473. Representant la 25a generació d'una nissaga familiar, ha mantingut una passió per l'art i l'artesania. El 1900, l'obrador es trasllada al nucli de Quart, consolidant un compromís social enfocat a compartir tradició i coneixement mitjançant experiències interactives. Aquest espai ha atraït a molts artistes i professionals, incloent els màxims exponents del noucentisme gironí, Fidel Aguilar i Rafael Masó. Els seus treballs han enriquit el fons Marcó, que ofereix una panoràmica de l'art català des de principis del segle XX fins a l'actualitat.",
        foto: "../assets/images/casella31.jpg",
        puntuacion: 2
    },
    32: {
        titulo: "PRESÓ - 1923 (32)",
        descripcion: "Amb el cop d'estat del general Primo de Rivera el setembre de 1923, es va instaurar una dictadura que va imposar nous ajuntaments i va exercir repressió sobre el catalanisme. La nit de Nadal d'aquest mateix any, vuit regidors i alcaldes de Girona van ser empresonats, entre ells Rafael Masó. Segons Carles Rahola, Masó va suportar aquells dies de captiveri <i>amb elegància i un somriure als llavis</i>",
        foto: "../assets/images/casella32.jpg",
        puntuacion: -3
    },
    33: {
        titulo: "Col·laboradors: Pedra (33)",
        descripcion: "Rafael Masó, destacat arquitecte del noucentisme català, va donar gran importància a la qualitat i l'origen dels materials en les seves obres. En aquest context, va optar per utilitzar picapedrers locals per a la construcció dels seus projectes arquitectònics. Aquests professionals, altament qualificats i amb un profund coneixement de les tècniques tradicionals de treball de la pedra, procedien de la zona on Masó realitzava les seves obres. Aquesta elecció no només garantia la màxima qualitat en els acabats i detalls, sinó que també fomentava l'economia local i reforçava el vincle entre l'arquitectura i el territori. ",
        foto: "../assets/images/casella33.jpg",
        puntuacion: 1
    },
    34: {
        titulo: "Mal estat de conservació exterior Habitatge Joan Casas (34)",
        descripcion: "La <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=104\" target=\"_blank\">Casa Casas<\a>, construïda per a l’industrial Joan Casas en una gran finca situada damunt la platja de Sant Pol, un indret profundament transformat pel creixement urbanístic de la Costa Brava. Tot i el mal estat de conservació actual, encara s’hi percep la rellevància que Masó atorgà a la ceràmica vidriada, present en plafons, arrambadors, columnes i baranes, totes procedents de l’obrador La Gabarra de la Bisbal.",
        foto: "../assets/images/casella34.jpg",
        puntuacion: -3
    },
    35: {
        titulo: "BONUS VITRALL! (35)",
        descripcion: "Els vitralls són un element distintiu de l’obra de Rafael Masó, amb motius florals com campanetes o roses, inspirats en els dissenys de Mackintosh. Tot i no conèixer personalment la seva obra, Masó s’hi va inspirar a través de publicacions. Un exemple destacat es troba a la casa Masó, al carrer de les Ballesteries.",
        foto: "../assets/images/casella35.jpg",
        puntuacion: 0
    },
    36: {
        titulo: "Rehabilitació \"La Punxa\"(36)",
        descripcion: "El 15 de juliol de 1979 comencen les obres de rehabilitació de la casa de \"La Punxa\", seu del Col·legi d'Aparelladors i Arquitectes Tècnics de Girona.",
        foto: "../assets/images/casella36.jpg",
        puntuacion: 3
    },
    37: {
        titulo: "Obres residencials: Senya Blanca (37)",
        descripcion: "Entre les residències construïdes a s'Agaró destaca la de la família Ensesa, promotoria de la urbanització, coneguda com <a href=\" https://es.wikipedia.org/wiki/Senya_Blanca\" target=\"_blank\">'La Senya Blanca'<\a>, però també les cases Gorina, Cruz i Comadira, o el resturant dels Banys, que tot i que es va inagurar l'any 1929 l'any 1935 es va incendiar i Masó va projectar un edifici nou. ",
        foto: "../assets/images/casella37.jpg",
        puntuacion: 2
    },
    38: {
        titulo: "El disseny de la Punxa (38)",
        descripcion: "El disseny de l'edifici inclou una torrassa cilíndrica atorgant-li un gir a la façana i una monumentalitat que ressalta ja dins l’estil clarament noucentista, a excepció de la torre amb coberta d’escates de ceràmica vidriada verda d’estil modernista. La façana, ja integra la relació de materials i proporcions pròpies del secessionisme vienès, amb una composició de línies verticals i finestres horitzontals, amb emmarcats esgrafiats ressaltant el conjunt. El treball delicat de la pedra, amb l’estucat de façana, la fusteria i la forja, dona una modernitat superior al primer disseny de façana on figurava diferents panys de paret amb pedra.",
        foto: "../assets/images/casella38.jpg",
        puntuacion: 1
    },
    39: {
        titulo: "Enderroc xalets Teixidor (39)",
        descripcion: "En un episodi considerat «dolorós i grotesc», a primeres hores de la matinada del dia 27 d'agost de 1973, sense permís municipal, amb discreció i amb premeditació, es van enderrocar els cinc xalets de la Urbanització Teixidor de Rafel Masó.",
        foto: "../assets/images/casella39.jpg",
        puntuacion: -3
    },
    40: {
        titulo: "Col·laboradors: Forja Cadenas (40)",
        descripcion: "Nonito Cadenas i Caballer fou el ferrer de confiança de Rafael Masó amb qui va col·laborar en la majoria de projectes. Nonito va néixer el 23 de novembre de 1875 i va morir el 19 d’abril de 1935, amb ell comença una nissaga de ferrers amb 5 generacions, que encara avui en dia amb en Cesc Cadenas segueixen treballant el metall i tenen obert el taller al carrer Sant Francesc de Girona.",
        foto: "../assets/images/casella40.jpg",
        puntuacion: 1
    },
    41: {
        titulo: "Casa Masramon (41)",
        descripcion: "La <a href=\" https://rafaelmaso.girona.cat/esp/maso_obres_fitxa.php?id=91\" target=\"_blank\">casa Masramon<\a> d'Olot, és una de les obres més emblemàtiques  i probablement la més ben acabada de Rafael Masó. Fou construïda entre 1913 i 1916, ja d’estil clarament noucentista. A la planta semisoterrada s’hi ubiquen els serveis i l’habitatge del porter, a planta baixa i planta primera formaven part de l’habitatge principal i una segona planta que era un habitatge independent amb  l’objectiu de poder llogar-lo que s’hi accedia a través del jardí per una escala exterior. Medeix 750 m2 i està rodejat per un jardí amb arbres fruiters i una zona d’hort.  <br>Es conserva tota la documentació de projectes, cartes, factures dels industrials. El cost de l’obra pujà 93.540,85 pessetes  i els honoraris que l’arquitecte en va cobrar van ser 7100  pessetes. Sumats la xifra va pujar 100055,85 pessetes, uns 600 Euros d’avui dia.",
        foto: "../assets/images/casella41.jpg",
        puntuacion: 1
    },
    42: {
        titulo: "BONUS PEDRA! (42)",
        descripcion: "El 1927 es van iniciar les obres de rehabilitació dels banys àrabs. Les antigues sales d’aigües i el temple que sobresurt <i>l’apodyterium</i> havia estat ocupat per les monges caputxines. L’any 1929 la diputació de Girona va adquirir l’edifici i van encarregar la restauració a Rafael Masó, Jeroni Martorell i Emili Blanch. Es va fer una primera intervenció de neteja de parets i voltes i eliminació de cossos afegits.<br> <br><i style='font-size:12px'>Foto cedida per Joan Masó i Valentí.</i>",
        foto: "../assets/images/casella42.jpg",
        puntuacion: 0
    },
    43: {
        titulo: "Edifici Correus (43)",
        descripcion: "Masó es presentà al concurs de les <a href=\" https://www.pedresdegirona.com/centenari_correus.htm\" target=\"_blank\">oficines de correus de Girona<\a>, però el jurat va escollir un altre projecte dels arquitectes Eusebi Bona i Enric Catà, del projecte de Masó, van escollir el coronament amb Cúpula.<br><br> Aquest edifici, amb un lateral a la plaça Sant Agustí no s’integra dins de l’estil neoclàssic, té el seu propi llenguatge amb un arc triomfal i altres recursos del monumentalisme.",
        foto: "../assets/images/casella43.jpg",
        puntuacion: -1
    },
    44: {
        titulo: "Casa seva a s'Agaró. Xalet 28 (44)",
        descripcion: "Habitatge de dues plantes amb composició asimètrica. La façana principal té un porxo lateral amb arcades i teulada. Hi ha obertures de formes i mides diverses, amb marcs de pedra i reixes de ferro decorades. La part posterior, orientada al mar, destaca pel seu disseny amb balconades, finestres, galeries i terrasses, creant un joc harmoniós de volums, formes i colors, especialment amb el contrast de les parets blanques i les reixes.",
        foto: "../assets/images/casella44.jpg",
        puntuacion: 2
    },
    45: {
        titulo: "Escoles de sant Gregori (45)",
        descripcion: "Encàrrec dels disseny i casa de la Vila de Sant Gregori, ve donat per la família Bru de Domeny, l’any 1909 i 1917. La realitat només es va construir <a href=\" https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=107\" target=\"_blank\">els dos cossos laterals destinats a aulari<\a>. La part central, va ser edificada l’any 1977 amb un nou cos, que va donar unitat al conjunt. Les estructures d’arcs diafragmàtics, van quedar amagades pel fals sostre  per una reforma del 1967, del conjunt destaca l’alçada dels cossos d’accés a les aules. ",
        foto: "../assets/images/casella45.jpg",
        puntuacion: 2
    },
    46: {
        titulo: "30 anys d'edifici en estat ruïnós finalment rehabilitat (46)",
        descripcion: "La cooperativa Canatense, va ser una cooperativa agrícola, fundada 1876 i l’any 1920 van encarregar el projecte a Rafael Masó de  construir un edifici, on en la planta baixa hi havia la botiga de productes agrícoles  i el magatzem, i la planta primera hi havia un cafè,  teatre i casa del conserge. L’edifici sempre va ser el centre cultural de Canet de mar, amb les primeres actuacions d’electrica Dharma o Comediants. Però a partir dels anys 80, va quedar en estat ruïnós, i fins l’any 2002 que l’Ajuntament el va comprar a Eroski",
        foto: "../assets/images/casella46.jpg",
        puntuacion: -3
    },
    47: {
        titulo: "Façana casa Cots",
        descripcion: "La <a href=\"https://rafaelmaso.girona.cat/cat/maso_obres_fitxa.php?id=16 \" target=\"_blank\">casa Cots<\a> és un bloc de pisos dissenyat de nova planta on a la planta baixa hi havia un magatzem de vins i les 5 plantes superiors es destinen a habitatge. L’edifici es va executar en dues fases 1924 el magatzem i el 1928 els habitatges. <br>La façana té un esgrafiat central amb un cep carregat de raïms, com a símbol del que es venia a la planta baixa.  i a les cantonades hi ha plafons ceràmics. Els balcons de pedra a la primera planta i la resta de forja, també destaquen com elements propis de l’arquitectura tradicional de l’obra de Masó.",
        foto: "../assets/images/casella47.jpg",
        puntuacion: 1
    },
    48: {
        titulo: "Nous usos de la farinera (48)",
        descripcion: "La farinera Teixidor, construida l'any 1910 era una fábrica de farina unida per un pont amb la casa del propietari va quedar en desús molt anys, fins que els anys 90 Joan Bosch, antic editor del punt, la va adquirir per ser la seu del Punt diari. <br>Les obres de rehabilitació integrals es van dur a terme per l’arquitecte Arcadi Pla fins  l’any 1999.  I l'ús de seu del Punt Diari serà des d’aquest moment fins al 2015. Un cop més l'edifici va quedar sense ús, fins el novembre de 2022 que es reobrir, per ser la seu de Girona Hub, un projecte de detecció i retenció de talent impulsat pel ‘coworking’ CoEspai.",
        foto: "../assets/images/casella48.jpg",
        puntuacion: 1
    },
    49: {
        titulo: "Casa incendiada i enderrocada (49)",
        descripcion: "La reforma i ampliació que Masó va fer al garatge Adroher, el 1927, va consistir a introduir una altra construcció dins de la nau de planta baixa i pis, per ubicar-hi una botiga de material elèctric, oficines i dos habitatges, aprofitant la coberta original del garatge construït per Joan Roca Pinet, reculada respecte de la nova façana principal. El resultat és un cos d'uns vint metres (el de la façana principal) de planta baixa i pis i un altre, que és una gran nau d'uns quinze metres d'amplada. L'edifici fou destruït per un incendi l'any 1939. L'edifici va ser enderrocat l'any 1970.",
        foto: "../assets/images/casella49.jpg",
        puntuacion: -2
    },
    50: {
        titulo: "Esquerda per fuita d’aigua. (50)",
        descripcion: "L’any 2019 es va descobrir una obra insòlita de Masó, l'antiga presó de Torroella de Montgrí. Va ser Laia de Quintana qui va trobar els plànols a l’arxiu municipal. L'encàrrec a Masó, el 1930, li venia del comte Joaquim de Robert, que volia ampliar el seu jardí i va proposar a l’Ajuntament l’enderroc de l'antiga presó a canvi de construir-ne una de nova. També val a dir l’anècdota que l’arquitectura presidiària no era el fort de Masó, perquè el primer pres es va escapar fent un forat a la paret. Aquest edifici tenia unes esquerdes que ja s’han arreglat.",
        foto: "../assets/images/casella50.jpg",
        puntuacion: -2
    },
    51: {
        titulo: "Interiors – la Caixa de sant Feliu de Guixols (51)",
        descripcion: "Rafael Masó va reformar algunes plantes baixes per a entitats bancàries en diferents pobles de la província. També va construir edificis de nova planta, entre els quals destaca l’oficina de la Caixa de Sant Feliu de Guíxols, on, l’any 1923, va dissenyar l’oficina a la planta baixa i la biblioteca a la primera planta. Està situada al centre històric, amb un basament de pedra rugosa, porxada i arcs rodons sobre columnes botxes. L’edifici està coronat amb una barbacana de bigues de fusta i rajoles verdes a les obertures horitzontals superiors. Destaca una torre d’agulla a la mitgera amb el carrer Major, que dona monumentalitat a l’edifici.",
        foto: "../assets/images/casella51.jpg",
        puntuacion: 2
    },
    52: {
        titulo: "BONUS CERÀMICA! (52)",
        descripcion: "Antoni Serra i Fiter fou el ceramista, amic i col·laborador de Masó. Tant en el propi taller que va fundar a Poble Nou, Barcelona, com a La Carmelitana a Olot, a partir de 1908 fins al 1914, va portar l’art al món de la ceràmica industrial i amb usos mèdics, fent uns dissenys clarament modernistes. Amb ell, Masó va aconseguir que li fabriqués <b>els pots de ceràmica per a la farmàcia</b> del seu germà, Joan Masó, al carrer de l’Argenteria.",
        foto: "../assets/images/casella52.jpg",
        puntuacion: 0
    },
    53: {
        titulo: "Urbanització de s'Agaró per la família Ensesa. (53)",
        descripcion: "Josep Ensesa Pujadas va adquirir els terrenys situats entre la platja de Sant Pol i Platja d'Aro l'any 1917. Posteriorment, l’any 1923, Rafael Masó va dissenyar tots els espais públics, incloent-hi carrers, places, escales i pistes de tennis, així com diversos edificis de serveis, com l'hotel i els banys. També va projectar moltes cases en aquesta àrea, però la gran majoria d'aquestes han experimentat nombrosos canvis al llarg del temps.",
        foto: "../assets/images/casella53.jpg",
        puntuacion: 2
    },
    54: {
        titulo: "BONUS PEDRA! (54)",
        descripcion: "El castell de Raïmat és un edifici medieval amb modificacions d’èpoques diverses, entre elles la remodelació i decoració de la planta baixa que va fer Rafael Masó entre els anys 1932 i 1935. Masó va intervenir al vestíbul, la sala de pas i el menjador, dissenyant les llars de foc, l’escó del menjador, les fusteries, els rentamans, mobles i les rajoles blanques i blaves que contenen l’escriptura jeroglífica de la paraula Raïmat. També va reformar els paviments, la vorera que circumda el castell, algunes obertures interiors i exteriors protegides amb reixes de forja historicistes. Actualment, el castell s’utilitza com a lloc de trobada dels accionistes dels cellers Raïmat.",
        foto: "../assets/images/casella54.jpg",
        puntuacion: 0
    },
    55: {
        titulo: "BONUS VITRALL! (55)",
        descripcion: "De tota l’obra en vitrall projectada per Masó, la que destaca per la seva riquesa i singularitat iconogràfica és la casa Masramon d’Olot. A la planta baixa, té murs de vidre que funcionen com a separadors d’espais connectats, entre el vestidor, la sala, el menjador i la sala de confiança. Per a la sala de la mainada, Masó va dissenyar vitralls de temàtica infantil, amb galls, ocells i el gegantàs amb les seves filles, inspirat en el conte d'en Polzet de Perrault, quan el protagonista roba les botes de set llegües a l’ogre.",
        foto: "../assets/images/casella55.jpg",
        puntuacion: 0
    },
    56: {
        titulo: "Biblioteca de Palafrugell (56)",
        descripcion: "Aquest edifici va ser projectat en dues seccions: una destinada a despatxos i l'altra, molt més àmplia, per a botiga i magatzems. La coberta de l'edifici, de quatre aigües, té al centre una llanterna que actua com a claraboia de la sala gran. Les façanes destaquen per l'ús de ceràmica vidriada i relleus d'argerates que representen oficis de Quart. L'any 2000, aquest edifici va ser convertit en la biblioteca pública de Palafrugell.",
        foto: "../assets/images/casella56.jpg",
        puntuacion: 2
    },
    57: {
        titulo: "Obres no realitzades-No firmades (57)",
        descripcion: "El 1917, Rafael Masó i el seu amic d'estudis, Josep Maria Pericas de Vic, van guanyar un concurs per construir una clínica mental a Santa Coloma de Gramanet. No obstant això, la burocràcia va retardar l'inici de les obres, i no va ser fins al 1923 que es van començar els moviments de terra, i finalment el 1926 es va iniciar la construcció dels pavellons. Durant els anys de la dictadura de Primo de Rivera, Masó va ser obligat a renunciar a la construcció del projecte en favor del seu company, ja que havia estat empresonat i era contrari al règim.",
        foto: "../assets/images/casella57.jpg",
        puntuacion: -2
    },
    58: {
        titulo: "BONUS FORJA! (58)",
        descripcion: "Les escoles de Sarrià de Ter van ser el primer projecte que Rafael Masó va fer per a Alfons Teixidor, entre els anys 1909 i 1910. L'edifici, que va ser cedit a la població, era una reforma de tres cases entre mitgeres, de planta baixa i pis, amb un cos lateral sobrealçat per convertir-les en escola. Cal destacar el disseny de grans finestrals emmarcats amb pedra motllurada i les reixes artístiques als baixos. La façana també està decorada amb garlandes, plafons, mènsules i una balustrada de ceràmica al terrat.",
        foto: "../assets/images/casella58.jpg",
        puntuacion: 0
    },
    59: {
        titulo: "Can Cendra (59)",
        descripcion: "L’Ajuntament d’Anglès és un dels edificis que Masó va reformar i ampliar en dues etapes: la primera, entre 1913 i 1915, i la segona l’any 1930. Era la casa de Tomàs Cendra, un terratinent parent llunyà d’Esperança Bru, per a qui Masó també va reformar el Mas Soler just després d’acabar la carrera. La intervenció de Masó a la planta baixa va incloure el vestíbul, la sala amb llar de foc, el corredor del jardí i l’escala. A la part posterior, va edificar diversos volums i terrasses que baixaven fins al jardí. ",
        foto: "../assets/images/casella59.jpg",
        puntuacion: 3
    },
    60: {
        titulo: "Mort de Rafael Masó (60)",
        descripcion: "La seva mort, el 13 de juliol de 1935, fou sobtada i inesperada. Va morir a causa d'una infecció intestinal, segons sembla, provocada per una història molt senzilla i típica de l’època i de la seva professió (i aquí és on comença la llegenda). En aquells temps, no hi havia arquitecte que no inventés la seva pròpia fossa sèptica. Masó també en va dissenyar una, i segons ell, era tan perfecta que n'estava molt orgullós i assegurava que l’aigua que en sortia era puríssima. Per demostrar-ho, en va beure, i va agafar la infecció que el va portar a la tomba. Aquesta història està relatada en el llibre de Dolors Oller i recollida per Joan Tarrús d’un dels paletes, Fita, que va treballar amb Masó els últims anys.",
        foto: "../assets/images/casella60.jpg",
        puntuacion: -3
    },
    61: {
        titulo: "Llegat arquitectònic (61)",
        descripcion: "Rafael Masó, en termes d’arquitectura, introdueix a Girona i posa en pràctica conceptes de ciutats jardí, com les de Hellerau i Darmstadt. A més, introdueix el corrent Arts and Crafts, fent de pont entre Barcelona i Girona, i, juntament amb altres arquitectes, porta el modernisme a Girona. Amb l’Atenea i la creació d’una escola d’arts i oficis, Masó va tenir una funció doblement didàctica: va educar estèticament la societat gironina i va formar artísticament els artesans que col·laboraven en les obres de l'arquitecte.",
        foto: "../assets/images/casella61.jpg",
        puntuacion: 2
    },
    62: {
        titulo: "Homenatge i memòria (62)",
        descripcion: "L’any 2006, diverses institucions públiques i entitats privades van unir esforços per celebrar l’Any Masó, coincidint amb el centenari de l’obtenció del títol d’arquitecte de Masó. L’Any Masó va suposar un impuls decisiu per donar a conèixer la seva obra més enllà de Girona i va ser el detonant de la creació de la <a href =\" https://rafaelmaso.girona.cat/cat/index.php \" target=\"_blank\">Fundació Rafael Masó, <\a> a partir de la donació de la Casa Masó a la ciutat de Girona. Des d’aleshores, la Fundació promou la recerca i l’estudi de l’obra de Masó a tots els nivells d’ensenyament, des de l’escola fins a la universitat, treballa en la difusió de la seva obra arreu de Catalunya i també a l’estranger, amb la celebració d’exposicions i simposis, i amb la seva participació en associacions com Cases Icòniques de Catalunya i la xarxa internacional Iconic Houses.",
        foto: "../assets/images/casella62.jpg",
        puntuacion: 1
    },

};

