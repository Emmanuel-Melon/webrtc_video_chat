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

/**
 * init socket.io
 */
io.on('connection', socket => {
  console.log('user connected')
  socket.on('message', message => {
    console.log(`received ${message}`)
  })
})

const PORT = 3000 || process.env.PORT

app.listen(PORT, () => {
  console.log(`started server on ${PORT}`)
})
