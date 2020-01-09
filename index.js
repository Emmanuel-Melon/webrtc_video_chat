const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

/**
 * node middleware
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

let activeUsers = []

/**
 * init socket.io
 */
io.on('connection', socket => {
  socket.on('register-socket', data => {
    const { conversationId, token, uid, receiver, sender } = data
    socket.id = uid
    activeUsers[uid] = socket
  })

  // create an offer
  socket.on('create-offer', data => {
    const { sdp, receipient, sender } = data
    const callInfo = {
      sdp,
      caller: {
        userId: sender
      },
      callee: {
        userId: receipient
      },
      metadata: {
        started: Date.now(),
        answered: false,
        duration: 0,
        type: 'video',
        rating: 0,
        ended: 0
      }
    }

    let receipientSocket = null
    if (activeUsers[receipient]) {
      console.log('true!!!')
      receipientSocket = activeUsers[receipient]
      console.log(receipient)
      receipientSocket.emit('create-offer', { sender, sdp })
      receipientSocket.emit('hello', "man what's up?")
    } else {
      socket.emit('close-connection')
      console.log('false')
    }
  })

  socket.on('create-answer', data => {
    const { sdp, receipient, sender } = data
    console.log('answer is here!!!!!!!!!')
    let receipientSocket = null
    if (activeUsers[receipient]) {
      receipientSocket = activeUsers[receipient]
      receipientSocket.emit('create-answer', { sender, sdp })
    } else {
      socket.emit('close-connection')
    }
  })

  socket.on('new-icecandidate', data => {
    const { icecandidate, sender, receipient } = data
    let receipientSocket = null
    if (activeUsers[receipient]) {
      receipientSocket = activeUsers[receipient]
      receipientSocket.emit('new-icecandidate', { sender, icecandidate })
    } else {
      socket.emit('close-connection')
    }
  })

  socket.on('close-connection', data => {})
})

const PORT = 3000 || process.env.PORT

app.listen(PORT, () => {
  console.log(`started server on ${PORT}`)
})
