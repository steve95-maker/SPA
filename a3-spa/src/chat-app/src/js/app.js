const websocketUrl = 'wss://courselab.lnu.se/message-app/socket'
const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

let socket = null

/**
 * Connects to the WebSocket server and sets up event listeners.
 * @param {Function} onMessageReceived - Callback function to handle incoming messages.
 */
function connectWebSocket (onMessageReceived) {
  socket = new WebSocket(websocketUrl)

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established.')
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)

    // Ignore heartbeat messages
    if (message.type === 'heartbeat') { return }

    onMessageReceived(message)
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed. Reconnecting...')
    setTimeout(() => connectWebSocket(onMessageReceived), 3000)// Reconnect after 3 seconds
  })
}

/**
 * Sends a message to the WebSocket server.
 * @param {string} channel - The channel name.
 * @param {string} message - The message content.
 */
function sendMessage (channel, message) {
  const username = getUsername()
  if (socket && socket.readyState === WebSocket.OPEN) {
    const payload = {
      type: 'message',
      data: message,
      username,
      channel,
      key: apiKey
    }

    socket.send(JSON.stringify(payload))
  } else {
    console.log('WebSocket is not connected.')
  }
}

/**
 * Retrieves the username from localStorage or prompts the user to input one.
 * @returns {string} The username.
 */
function getUsername () {
  let username = localStorage.getItem('username')
  if (!username) {
    username = prompt('Enter your username:')
    localStorage.setItem('username', username)
  }
  return username
}

/**
 * Retrieves the channel name from localStorage or prompts the user to input one.
 * @returns {string} The channel name.
 */
function getChannel () {
  let channel = localStorage.getItem('channel')
  if (!channel) {
    channel = prompt('Enter a channel name:')
    localStorage.setItem('channel', channel)
  }
  return channel
}

/**
 * Updates the chat log with incoming messages.
 * @param {HTMLElement} chatLogElement - The chat log container element.
 * @param {object} message - The incoming message object.
 * @param {string} message.username - The username of the sender.
 * @param {string} message.data - The message content.
 */
function updateChatLog (chatLogElement, message) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('chat-message')
  messageElement.textContent = `${message.username}: ${message.data}`
  chatLogElement.appendChild(messageElement)

  // Keep only the last 20 messages
  const messages = chatLogElement.querySelectorAll('.chat-message')
  if (messages.length > 20) {
    messages[0].remove()
  }

  chatLogElement.scrollTop = chatLogElement.scrollHeight // Scroll to the bottom
}

/**
 * Updates the username by prompting the user and saving it to localStorage.
 */
function changeUsername () {
  const newUsername = prompt('Enter your new username:')
  if (newUsername && newUsername.trim()) {
    localStorage.setItem('username', newUsername.trim())
    alert(`Username updated to: ${newUsername}`)
  }
}

/**
 * Updates the channel name by prompting the user and saving it to localStorage.
 */
function changeChannel () {
  const newChannel = prompt('Enter the new channel name:')
  if (newChannel && newChannel.trim()) {
    localStorage.setItem('channel', newChannel.trim())
    alert(`Channel updated to: ${newChannel}`)

    // Clear the chat log to reflect messages only from the new channel
    const chatLog = document.getElementById('chat-log')
    chatLog.innerHTML = ''

    // Notify about the channel change
    const username = localStorage.getItem('username')
    sendMessage(newChannel, `${username} has joined the channel.`)
  }
}

/**
 * Initializes the chat application.
 * Sets up WebSocket connection, message sending, and event listeners.
 */
function initializeChat () {
  const channel = getChannel()
  const chatLog = document.getElementById('chat-log')
  const chatInput = document.getElementById('chat-input')
  const sendButton = document.getElementById('send-btn')
  const changeUsernameButton = document.getElementById('change-username-btn')
  const changeChannelButton = document.getElementById('change-channel-btn')

  // Connect WebSocket and handle incoming messages
  connectWebSocket((message) => {
    updateChatLog(chatLog, message)
  })

  // Send messages when the Send button is clicked
  sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim()
    if (message) {
      sendMessage(channel, message)
      chatInput.value = ''// Clear the input field
    }
  })

  // Send messages on Enter key
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      sendButton.click()
    }
  })
  // Handle username change
  changeUsernameButton.addEventListener('click', changeUsername)
  // Handle channel change
  changeChannelButton.addEventListener('click', () => { changeChannel() })
}

/**
 * Toggles the visibility of the emoji grid.
 */
function initializeEmojiToggle () {
  const toggleEmojiBtn = document.getElementById('toggle-emoji-btn')
  const emojiGrid = document.getElementById('emoji-grid')
  const chatInput = document.getElementById('chat-input')

  toggleEmojiBtn.addEventListener('click', () => {
    if (emojiGrid.style.display === 'none') {
      emojiGrid.style.display = 'grid'
      toggleEmojiBtn.style.display = 'none'
    } else {
      emojiGrid.style.display = 'none'
    }
  })

  emojiGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('emoji')) {
      const selectedEmoji = event.target.textContent
      chatInput.value += selectedEmoji // Append emoji to the input
      emojiGrid.style.display = 'none' // Hide the emoji grid
      toggleEmojiBtn.style.display = 'inline-block'
    }
  })
}

// Start the chat logic when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeChat()
  initializeEmojiToggle()
})
