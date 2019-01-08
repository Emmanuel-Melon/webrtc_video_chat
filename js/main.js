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

/**
 * peer connection elements
 */
var localVideo = document.querySelector('#localVideo')
var remoteVideo = document.querySelector('#remoteVideo')

/**
 * media streams
 */
var localStream
var remoteStream

/**
 * @description
 * @param
 */
function receivedLocalStream (mediaStream) {
  localStream = mediaStream
  localVideo.srcObject = mediaStream
}

/**
 * @description
 * @param
 */
function localMediaStreamError (error) {
  console.log('navigator.getUserMedia error: ', error)
}

/**
 * remote stream config
 */
function receivedRemoteStream (event) {
  let mediaStream = event.stream
  /**
   * ? Does order matter in this case?
   */
  remoteStream = mediaStream
  remoteVideo.srcObject = mediaStream
}

/**
 * init media stream
 */
navigator.mediaDevices.getUserMedia(constraints)
  .then(receivedLocalStream)
  .catch(localMediaStreamError)

/**
 * connection config
 */
var offerOptions = {
  offerToReceiveVideo: 1
}

var connectionStartTime = null

/**
 * peer connections
 */
var localPeerConnection
var remotePeerConnection

/**
 * handle connection
 */
function handleConnecton (event) {
  let peerConnection = event.target
  let iceCandidate = event.candidate

  if (iceCandidate) {
    let newIceCandidate = new RTCIceCandidate(iceCandidate)
    let otherPeer = getOtherPeer(peerConnection)

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection)
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error)
      })
  }
}

function handleConnectionSuccess () {
  console.log('connection successful')
}

function handleConnectionFailure () {
  console.log('connection failed')
}

/**
 * @description
 * @param
 */
function createdOffer (description) {
  /**
   * set local peer descriptions
   */
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(localPeerConnection)
    }).catch(setSessionDescriptionError)
  /**
   * set remote peer descriptions
   */
  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection)
    }).catch(setSessionDescriptionError)

  /**
   * create corrosponding answer
   */
  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError)
}

/**
 * @description
 * @param
 */
function createdAnswer (description) {
  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(remotePeerConnection)
    }).catch(setSessionDescriptionError)

  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(localPeerConnection)
    }).catch(setSessionDescriptionError)
}

/**
 * @description
 * @param
 */
function setLocalDescriptionSuccess (peerConnection) {
  console.log(peerConnection)
}
/**
 * @description
 * @param
 */
function setRemoteDescriptionSuccess (peerConnection) {
  console.log(peerConnection)
}

/**
 * session decription errors
 */
function setSessionDescriptionError () {
  console.log('you fucked up my G')
}
