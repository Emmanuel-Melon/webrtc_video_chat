/**
 * WebRTC Video Chat App
 * Written by: Emmanuel Gatwech
 */

/**
 * user media config
 */

var constraints = {
  video: true
}

var localVideo = document.querySelector('#localVideo')
console.log(localVideo)

var localStream
function receivedLocalStream (mediaStream) {
  localStream = mediaStream
  localVideo.srcObject = mediaStream
}

function localMediaStreamError (error) {
  console.log('navigator.getUserMedia error: ', error)
}

/**
 * init media stream
 */
navigator.mediaDevices.getUserMedia(constraints)
  .then(receivedLocalStream)
  .catch(localMediaStreamError)