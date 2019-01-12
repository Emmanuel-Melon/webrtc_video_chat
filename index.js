const express = require('express')
const socket = require('socket.io')

const app = express()

/**
 * node middleware
 */
app.use(express.static(__dirname))
socket.on('message', messsage => {
  console.log(message)
})

const PORT = 3000 || process.env.PORT 

app.listen(PORT, () => {
  console.log(`started server on ${PORT}`)
})
