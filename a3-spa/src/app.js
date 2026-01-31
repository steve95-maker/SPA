let zIndexCounter = 1000// Initial z-index
let gridSize = '4x4' // Default grid size

/**
 * Makes an element draggable.
 * @param {HTMLElement} element - The element to make draggable.
 */
function makeDraggable (element) {
  let isDragging = false
  let offsetX, offsetY

  const header = element.querySelector('.window-header')
  header.style.cursor = 'move'

  header.addEventListener('mousedown', (e) => {
    isDragging = true
    offsetX = e.clientX - element.offsetLeft
    offsetY = e.clientY - element.offsetTop
  })

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`
      element.style.top = `${e.clientY - offsetY}px`
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })
}

/**
 * Brings an element to the front by updating its z-index.
 * @param {HTMLElement} element - The element to bring to the front.
 */
function bringToFront (element) {
  zIndexCounter++
  element.style.zIndex = zIndexCounter
}

document.addEventListener('click', (e) => {
  const windowElement = e.target.closest('.window')
  if (windowElement) {
    bringToFront(windowElement)
  }
})

/**
 * Creates a memory game window with dynamic size based on the grid size.
 * @param {string} gridSize - The grid size (e.g., '4x4', '2x2').
 * @returns {HTMLElement} The created memory game window element.
 */
function createMemoryGameWindow (gridSize) {
  const memoryGameWindow = document.createElement('div')
  memoryGameWindow.classList.add('window') // Add class for styling

  // Get the grid size
  const [rows, cols] = gridSize.split('x').map(Number)

  // Dynamically calculate window size
  const cardSize = Math.min(400 / Math.max(rows, cols), 120) // Match the card size logic
  const width = cols * (cardSize + 10) + 40 // Add padding/margin
  const height = rows * (cardSize + 10) + 110 // Add padding and header height

  // Set the size of the window
  memoryGameWindow.style.width = `${width}px`
  memoryGameWindow.style.height = `${height}px`

  // Set the position of the window at the top of the screen
  memoryGameWindow.style.position = 'absolute'
  memoryGameWindow.style.top = '10px' // Near the top of the screen
  memoryGameWindow.style.left = '50%' // Center horizontally
  memoryGameWindow.style.transform = 'translateX(-50%)' // Adjust for centering

  memoryGameWindow.innerHTML = `
    <div class="window-header">
      <span>Memory Game</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./exercise-memory-game-master/src/index.html" class="window-content" ></iframe>
  `

  memoryGameWindow.querySelector('.close-btn').addEventListener('click', () => {
    memoryGameWindow.remove()
  })

  document.body.appendChild(memoryGameWindow)

  // Return the created window
  return memoryGameWindow
}

/**
 * Creates a chat window.
 * @returns {HTMLElement} The created chat window element.
 */
function createChatWindow () {
  const chatWindow = document.createElement('div')
  chatWindow.classList.add('window')

  // Set the position of the window at the top of the screen
  chatWindow.style.position = 'absolute'
  chatWindow.style.top = '10px' // Near the top of the screen
  chatWindow.style.left = '50%' // Center horizontally
  chatWindow.style.transform = 'translateX(-50%)' // Adjust for centering

  chatWindow.innerHTML = `
    <div class="window-header">
      <span>Chat</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./chat-app/src/index.html" class="window-content"></iframe>
  `

  // Add close functionality
  chatWindow.querySelector('.close-btn').addEventListener('click', () => {
    chatWindow.remove()
  })

  document.body.appendChild(chatWindow)

  return chatWindow
}

/**
 * Creates a quiz window.
 * @returns {HTMLElement} The created quiz window element.
 */
function createQuizWindow () {
  const quizWindow = document.createElement('div')
  quizWindow.classList.add('window')

  // Set the size of the window
  quizWindow.style.width = '600px'
  quizWindow.style.height = '600px'

  // Set the position of the window at the top of the screen
  quizWindow.style.position = 'absolute'
  quizWindow.style.top = '10px' // Near the top of the screen
  quizWindow.style.left = '50%' // Center horizontally
  quizWindow.style.transform = 'translateX(-50%)' // Adjust for centering

  quizWindow.innerHTML = `
    <div class="window-header">
      <span>Chat</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./a2-quiz/src/index.html" class="window-content"></iframe>
  `

  // Add close functionality
  quizWindow.querySelector('.close-btn').addEventListener('click', () => {
    quizWindow.remove()
  })

  document.body.appendChild(quizWindow)

  return quizWindow
}

// enable single and double click:
// Select all app icons

const icons = document.querySelectorAll('.app-icon')

let selectedIcon = null

/**
 * Handles selecting an app icon.
 * @param {HTMLElement} icon - The icon to select.
 */
function selectIcon (icon) {
  // Deselect the previously selected icon
  if (selectedIcon) {
    selectedIcon.classList.remove('selected')
  }

  // Select the clicked icon
  selectedIcon = icon
  selectedIcon.classList.add('selected')

  // Show the name of the selected icon
  const iconName = icon.querySelector('p').textContent
  console.log(`Selected: ${iconName}`)
}

// Make icons selectable on single click and open windows on double click
icons.forEach((icon) => {
  icon.addEventListener('click', () => {
    selectIcon(icon)
  })

  icon.addEventListener('dblclick', () => {
    const iconId = icon.id

    // Open the corresponding window based on the icon ID
    if (iconId === 'memory-game-icon') {
      const memoryGameWindow = createMemoryGameWindow(gridSize)
      makeDraggable(memoryGameWindow)
      const iframe = memoryGameWindow.querySelector('iframe')
      iframe.focus()
    } else if (iconId === 'chat-icon') {
      const chatWindow = createChatWindow()
      makeDraggable(chatWindow)
    } else if (iconId === 'quiz-icon') {
      const quizWindow = createQuizWindow()
      makeDraggable(quizWindow)
    }
  })
})

// CSS for the selected icon
const style = document.createElement('style')
style.innerHTML = `
  .app-icon.selected {
    border: 2px solid blue;
    background-color: lightblue;
    border-radius: 5px;
    width: 100px;
  }
`
document.getElementById('board-size-select').addEventListener('change', (e) => {
  gridSize = e.target.value // Update the global gridSize variable
})

document.head.appendChild(style)
