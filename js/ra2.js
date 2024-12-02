const wordInput = document.getElementById('word');
const submitButton = document.getElementById('submit');
const wordGuess = document.getElementById('word_guess');
const letraButtons = document.querySelectorAll('.letra');
const puntosSpan = document.getElementById('puntos');
const totalSpan = document.getElementById('total');
const wonSpan = document.getElementById('won');
const porcentajeSpan = document.getElementById('porcentaje');
const imgElement = document.getElementById('img');
const bestGameSpan = document.getElementById('best');
let wordValue = '';
let points = 0;
let correctGuess = 0;
let fails = 0;
let totalGames = 0;
let wonGames = 0;

// Mostrar/Ocultar la palabra
document.getElementById('toggle-psswd').addEventListener('change', function(){
    if (this.checked){
        wordInput.type = 'text';
    } else{
        wordInput.type = 'password';
    }
});

//Inicializa si existe en localStorage
let bestGame = localStorage.getItem('bestGame');
if(bestGame){
    bestGameSpan.textContent = bestGame;
} else{
    bestGame = '';
}

// Validar que la palabra cumpla los requisitos
submitButton.addEventListener('click', function(){
    wordValue = wordInput.value;
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    if(wordValue === ""){
        alert("Has d'afegir una paraula per poder començar a jugar")
    } else if(wordValue.length <= 3){
        alert("La paraula ha de contenir més de 3 caràcters.")
    } else if (!regex.test(wordValue)){
        alert("La paraula no pot contenir números.");
    } else{
        // Desabilitar botón
        wordInput.disabled = true;
        submitButton.disabled = true;

        // Escribir '_' por numero de letras de la palabra
        const guionbajo_word = '_ '.repeat(wordValue.length).trim();
        wordGuess.textContent = guionbajo_word;

        // Habilitar botones letras
        letraButtons.forEach(button => {
            button.disabled = false;
            button.classList.add('enabled');
        });
    }
});

letraButtons.forEach(button => {
    button.addEventListener('click', function() {
        const letter = button.textContent;
        let wordArray = wordGuess.textContent.split(' ');
        let letraGuess = false;
        let countRepeat = 0;

        // Comprobra si la letra existe en la palabra
        for(let i = 0; i < wordValue.length; i++){
            if(wordValue[i].toUpperCase() === letter){
                wordArray[i] = letter;
                letraGuess = true;
                countRepeat++;
            }
        }
        wordGuess.textContent = wordArray.join(' ');

        // Sumar puntos si acierta
        if(letraGuess){
            correctGuess++;
            points += correctGuess;
            // Multiplicar puntos por numero de repeticiones
            if(countRepeat > 1  ){
                points *= countRepeat;
            }

            if(!wordArray.includes('_')){
                alert("Has guanyat la partida! :D");
                letraButtons.forEach(button => {
                    button.disabled = true;
                    button.classList.remove('enabled');
                });

                // Contador de partidas totales
                totalGames++;
                totalSpan.textContent = totalGames;
                // Contador de partidas ganadas
                wonGames++;
                wonSpan.textContent = wonGames;
                // Porcentaje de partidas totales ganadas
                const porcentaje = ((wonGames/totalGames)*100).toFixed(2);
                porcentajeSpan.textContent = `${porcentaje}%`;
                // Guardar mejor puntuación
                saveBestGame(points);
                // Reiniciar imagen, fallos, puntos y rehabilitar input y botón
                wordInput.disabled = false;
                submitButton.disabled = false;
                imgElement.src = 'img/img_0.jpg'
                fails = 0;
                points = 0;
            }

        } else {
            correctGuess = 0;
            points -= 1;
            if(points < 0){
                points = 0; // Evitar que la puntuación sea 0
            }

            // Contar fallos y cambiar imagen
            fails++;
            imgElement.src = `img/img_${fails}.jpg`;

            if(fails >= 10){
                alert("Has perdut la partida :(")
                letraButtons.forEach(button => {
                    button.disabled = true;
                    button.classList.remove('enabled');
                });

                totalGames++;
                totalSpan.textContent = totalGames;

                const porcentaje = ((wonGames/totalGames)*100).toFixed(2);
                porcentajeSpan.textContent = `${porcentaje}%`;

                // Rehabilitar el input de palabra y su botón
                wordInput.disabled = false;
                submitButton.disabled = false;
                // Guardar mejor puntuación
                saveBestGame(points);
                // Reiniciar imagen, fallos y puntos
                imgElement.src = 'img/img_10.jpg';
                fails = 0;
                points = 0;
            }
        }

        puntosSpan.textContent = points; // Asignar puntos
        // Deshabilitar botones
        button.disabled = true;
        button.classList.remove('enabled');
    });
});

function saveBestGame(points){
    const bestGame = localStorage.getItem('bestGame') || 0;
    if(points > bestGame){
        const now = new Date();
        const dia = now.toLocaleDateString();
        const hora = now.toLocaleTimeString();
        const bestGameText = `${dia} ${hora} - ${points} puntos`;
        localStorage.setItem('bestGame', points);
        localStorage.setItem('bestPartida', bestGameText);
        bestGameSpan.textContent = bestGameText;
    }
}

