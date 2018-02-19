// Restart button
const restart_button = document.querySelector('.restart');

// Deck and cards
const deck = document.querySelector('.deck');
const card_list = document.getElementsByClassName('card');
let cards = [];
for (const card of card_list) {
    cards.push(card);
}
let playing_cards = [];
let coupled_cards = [];

// Stars
const star_ul = document.querySelector('.stars');
const star_list = star_ul.getElementsByTagName('li');
let stars = [];
for (const star of star_list) {
    stars.push(star);
}
let star_count = star_ul.childElementCount;

// Moves
const moves_span = document.querySelector('.moves');
let moves = 0;

// Counter to count moves
let counter = 0;

// Timer
let timer_min = document.querySelector(".timer-min");
let timer_sec = document.querySelector(".timer-sec");
let seconds = 0;
let minutes = 0;
let played_time = 0;

/*
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Helper methods
 */
function addCards() {
    for (let card of cards) {
        card.className = 'card';
        deck.appendChild(card);
    }
}

function addStars() {
    for (let star of stars) {
        star_ul.appendChild(star);
    }
}

function addToCoupledCards() {
    coupled_cards.push(playing_cards[0]);
    coupled_cards.push(playing_cards[1]);
    emptyPlayingCards();
}

function addToPlayingCards(card) {
    playing_cards.push(card);
}

function decrementStars() {
    if (star_count > 0) {
        let current_star = star_ul.firstElementChild;
        star_ul.removeChild(current_star);
        star_count -= 1;
    } else {
        star_count = 0;
    }
}

function displayMoves() {
    moves_span.textContent = moves;
}

function emptyCoupledcards() {
    coupled_cards = [];
}

function emptyPlayingCards() {
    playing_cards = [];
}

function hideCards() {
    playing_cards[0].className = 'shake card';
    playing_cards[1].className = 'shake card';
    emptyPlayingCards();
}

function incrementCounter() {
    counter += 1;
}

function incrementMove() {
    moves += 1;
}

function lockCards() {
    playing_cards[0].className = 'card match';
    playing_cards[1].className = 'card match';
    emptyPlayingCards();
}

function resetCounter() {
    counter = 0;
}

function resetMoves() {
    moves = 0;
}

function resetStars() {
    star_count = star_ul.childElementCount;
}

function resetTimer() {
    seconds = 0;
    minutes = 0;
    timer_sec.textContent = seconds;
    timer_min.textContent = minutes;
}

function startTimer(){
    seconds += 1;

    if (seconds == 60) {
        seconds = 0;
        minutes += 1;
    }

    timer_sec.textContent = seconds;
    timer_min.textContent = minutes;
    played_time = setTimeout(startTimer, 1000);
}

function stopTimer() {
    clearTimeout(played_time);
}

/*
 * Check if two cards match and if they are the last couple
 */
function checkMatch() {
    let first_card = playing_cards[0].querySelector('.fa').className;
    let second_card = playing_cards[1].querySelector('.fa').className;

    if (first_card == second_card) {
        lockCards();
        addToCoupledCards();

        // Check if all cards have been coupled
        if (coupled_cards.length == 16) {
            setTimeout(function() {
                displayModal();
            }, 500);
        stopTimer();
        deck.className = "deck shake";
        }

    } else {
        // Prevent clicking until the cards have disappeared
        deck.removeEventListener('click', play);
        setTimeout(function() {
            hideCards();
            deck.addEventListener('click', play);
        }, 1000);
    }
}

/*
 * Show the card clicked
 */
function showCard(card) {
    card.className = 'card open show';
    incrementCounter();
    if (counter % 2 != 0) {
        incrementMove();
        displayMoves();
    }
}

/*
 * Restart and reset the game
 */
function restart() {
    stopTimer();
    resetTimer();
    shuffle(cards);
    addCards();
    addStars();
    resetStars();
    resetMoves();
    resetCounter();
    emptyPlayingCards();
    emptyCoupledcards();
    displayMoves();
}

/*
 * Display a modal when the player wins
 */
function displayModal() {
    stopTimer();
    const gameover_message = `You won in ${moves} moves!\n` +
        `Your time is ${minutes}.${seconds}!\n` +
        `Your score is ${star_count} stars!\n\n` +
        `Do you want to play again?`;
    if (confirm(gameover_message)) {
        restart();
    }
}

/*
 * Control the player's moves
 */
function play(ev) {
    // Check if click was on a li (if not, do nothing)
    if (ev.target.nodeName == 'LI') {

        if (moves == 0) {
            startTimer();
        }
        showCard(ev.target);
        addToPlayingCards(ev.target);

        if (playing_cards.length == 2) {
            checkMatch();

            if (moves % 10 == 0) {
                decrementStars();
            }
        }
    }
}

// Event listener
deck.addEventListener('click', play);
restart_button.addEventListener('click', restart);

// Restart to avoyd the same combination in the first game
restart();
