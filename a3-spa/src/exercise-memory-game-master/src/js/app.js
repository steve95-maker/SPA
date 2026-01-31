const images = [0, 1, 2, 3, 4, 5, 6, 7]
let shuffledImages = []
let firstCard = null
let secondCard = null
let attempts = 0
let gridSize = '4x4'
let timerInterval = null
let elapsedTime = 0

/**
 * Shuffles an array randomly.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffle (array) {
  return array.sort(() => Math.random() - 0.5)
}

/**
 * Starts the timer when the game begins.
 */
function startTimer () {
  elapsedTime = 0 // Reset elapsed time
  const timerElement = document.getElementById('timer')
  timerElement.textContent = `Time: ${elapsedTime}s` // Initialize the timer display

  // Start the timer
  timerInterval = setInterval(() => {
    elapsedTime++ // Increment the time
    timerElement.textContent = `Time: ${elapsedTime}s` // Update the displayed time
  }, 1000)
}

/**
 * Stops the timer when the game ends.
 */
function stopTimer () {
  clearInterval(timerInterval) // Stop the timer
}

/**
 * Initializes the memory game by creating the grid and assigning shuffled images to cards.
 */
function initMemoryGame () {
  // Stop any previous timer before starting a new one
  if (timerInterval) {
    stopTimer()
  }

  // Reset the timer and start a fresh game
  startTimer() // Start the timer when the game begins

  const [rows, cols] = gridSize.split('x').map(Number)
  const totalCards = rows * cols
  shuffledImages = shuffle(images.slice(0, totalCards / 2).concat(images.slice(0, totalCards / 2)))

  const gameContainer = document.getElementById('game-container')
  gameContainer.innerHTML = ''

  // Dynamically set grid layout and card size
  const cardSize = Math.min(400 / Math.max(rows, cols), 120) // Adjust card size dynamically
  gameContainer.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`
  gameContainer.style.gridTemplateRows = `repeat(${rows}, ${cardSize}px)`

  shuffledImages.forEach((img, index) => {
    const card = document.createElement('div')
    card.className = 'card'
    card.dataset.index = index
    card.tabIndex = 0 // Make the card focusable
    card.style.width = `${cardSize}px`
    card.style.height = `${cardSize}px`
    card.style.backgroundImage = `url('./image/${shuffledImages[index]}.png')` // Show the image initially
    gameContainer.appendChild(card)
  })

  // Show all cards for 1.5 seconds, then hide them
  setTimeout(() => {
    const cards = document.querySelectorAll('.card')
    cards.forEach(card => {
      card.style.backgroundImage = ''
    })
  }, 1500)

  // Add event listeners after showing the images
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', flipCard)
  })

  document.querySelector('.card').focus()
}

/**
 * Flips a card and checks for matches if two cards are selected.
 * @param {Event} e - The click event triggered by the card.
 */
function flipCard (e) {
  const clickedCard = e.target
  const cardIndex = clickedCard.dataset.index

  if (clickedCard.classList.contains('flipped') || secondCard) return

  clickedCard.classList.add('flipped')
  clickedCard.style.backgroundImage = `url('./image/${shuffledImages[cardIndex]}.png')`

  if (!firstCard) {
    firstCard = clickedCard
  } else {
    secondCard = clickedCard
    attempts++
    checkForMatch()
  }
}

/**
 * Checks if two flipped cards match and handles resetting or keeping the cards flipped.
 */
function checkForMatch () {
  if (firstCard.style.backgroundImage === secondCard.style.backgroundImage) {
    firstCard = null
    secondCard = null
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped')
      firstCard.style.backgroundImage = ''
      secondCard.classList.remove('flipped')
      secondCard.style.backgroundImage = ''
      firstCard = null
      secondCard = null
    }, 1000)
  }

  if (document.querySelectorAll('.card.flipped').length === shuffledImages.length) {
    stopTimer()
    alert(`Game over! Attempts: ${attempts}, Time: ${elapsedTime}s`)
  }
}

/**
 * Handles keyboard navigation for the game grid, moving focus and flipping cards.
 * @param {Event} e - The keyboard event.
 */
function handleKeyboardNavigation (e) {
  const cards = Array.from(document.querySelectorAll('.card'))
  const currentIndex = cards.findIndex((card) => card === document.activeElement)

  if (e.key === 'ArrowRight') {
    // Move focus to the right
    const nextIndex = (currentIndex + 1) % cards.length
    cards[nextIndex].focus()
  } else if (e.key === 'ArrowLeft') {
    // Move focus to the left
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length
    cards[prevIndex].focus()
  } else if (e.key === 'ArrowUp') {
    // Move focus up
    const cols = parseInt(gridSize.split('x')[1], 10)
    const upIndex = (currentIndex - cols + cards.length) % cards.length
    cards[upIndex].focus()
  } else if (e.key === 'ArrowDown') {
    // Move focus down
    const cols = parseInt(gridSize.split('x')[1], 10)
    const downIndex = (currentIndex + cols) % cards.length
    cards[downIndex].focus()
  } else if (e.key === 'Enter' || e.key === ' ') {
    // Flip the card on Enter or Space key
    e.preventDefault()
    cards[currentIndex].click()
  }
}

// Handle gameboard size selection
document.getElementById('board-size-select').addEventListener('change', (e) => {
  gridSize = e.target.value
  initMemoryGame()
})

// Toggle game options menu visibility
document.getElementById('game-options-btn').addEventListener('click', () => {
  const menu = document.getElementById('game-options-menu')
  menu.classList.toggle('hidden')
})

// Start the game
document.addEventListener('DOMContentLoaded', initMemoryGame)

document.addEventListener('keydown', (e) => {
  handleKeyboardNavigation(e)
})
