console.log('Starting xCloudPlayer...')

var client;
var apiClient;
let ws

var app = {
    startSession(type, serverId) {
        console.log('Start session:', type, serverId)

        return new Promise((resolve, reject) => {

            if(type === 'xhome') {
                apiClient.startSession('home', serverId).then((configuration) => {
                    console.log('xCloudPlayer Client - Stream started. Configuration:', configuration)

                    client.setCodecPreferences('video/H264')
                    client.createOffer().then((offer) => {

                        apiClient.sendSDPOffer(offer).then((sdpResponse) => {
                            var sdpDetails = JSON.parse(sdpResponse.exchangeResponse)
                            client.setRemoteOffer(sdpDetails.sdp)

                            apiClient.sendICECandidates(client.getIceCandidates()).then((iceResponse) => {
                                
                                var iceDetails = JSON.parse(iceResponse.exchangeResponse)
                                console.log('xCloudPlayer Client - ICE Candidates:', iceDetails)
                                client.setIceCandidates(iceDetails)

                                // Listen for connection change
                                client.getEventBus().on('connectionstate', (event) => {
                                    console.log(':: Connection state updated:', event)
                                    const element = document.getElementById('streamStatus')
                                    element.innerHTML = event.state

                                    if(event.state === 'connected'){
                                        // We are connected
                                        console.log(':: We are connected!')

                                        this.setupUI()

                                    } else if(event.state === 'closing'){
                                        // Connection is closing
                                        console.log(':: We are going to disconnect!')

                                    } else if(event.state === 'closed'){
                                        // Connection has been closed. We have to cleanup here
                                        console.log(':: We are disconnected!')
                                    }
                                })
    
                            }).catch((error) => {
                                console.log('xCloudPlayer Client - sendSDPOffer failed:', error)
                            })

                        }).catch((error) => {
                            console.log('xCloudPlayer Client - sendSDPOffer failed:', error)
                        })

                    }).catch((error) => {
                        console.log('xCloudPlayer Client - createOffer failed:', error)
                    })

                }).catch((error) => {
                    console.error('xCloudPlayer Client - Failed to start session')
                })

            } else {
                reject({ error: 'Only xhome is supported as type to start a new session' })
            }
        })
    },

    //
    // Setup UI
    //
    setupUI() {
        client.getEventBus().on('fps_video', (event) => {
            const element = document.getElementById('fpsCounter_video')
            element.innerHTML = event.fps
        })
        client.getEventBus().on('fps_metadata', (event) => {
            const element = document.getElementById('fpsCounter_metadata')
            element.innerHTML = event.fps
        })
        client.getEventBus().on('fps_input', (event) => {
            const element = document.getElementById('fpsCounter_input')
            element.innerHTML = event.fps
        })

        this.setupModal()
        this.setupDisconnect()
    },

    setupDisconnect() {
        client.getEventBus().on('message', (event) => {
            console.log('ModalHelper event', event)

            if(event.target === '/streaming/sessionLifetimeManagement/serverInitiatedDisconnect') {
                // Received disconnect message
                const message = JSON.parse(event.content)
                alert('Disconnected. Reason: ' + message.reason)
            }
        })
    },

    setupModal() {
        client.getEventBus().on('message', (event) => {
            if(event.target === '/streaming/systemUi/messages/ShowMessageDialog') {
                // Show Modal Dialog
                const id = event.id
                const type = event.type
                const modalContent = JSON.parse(event.content)
                console.log('Show Modal:', modalContent)

                document.getElementById('dialogTitle').innerHTML = modalContent.TitleText
                document.getElementById('dialogText').innerHTML = modalContent.ContentText

                if(modalContent.CommandLabel1 !== ''){
                    const button1 = document.getElementById('dialogButton1')
                    button1.innerHTML = modalContent.CommandLabel1
                    button1.onclick = () => {
                        client.getChannelProcessor('message').sendTransaction(id, JSON.stringify({ Result: 0 }))
                        this.resetModal()
                    }
                }
                if(modalContent.CommandLabel2 !== ''){
                    const button2 = document.getElementById('dialogButton2')
                    button2.innerHTML = modalContent.CommandLabel2
                    button2.onclick = () => {
                        client.getChannelProcessor('message').sendTransaction(id, JSON.stringify({ Result: 1 }))
                        this.resetModal()
                    }
                }
                if(modalContent.CommandLabel3 !== ''){
                    const button3 = document.getElementById('dialogButton3')
                    button3.innerHTML = modalContent.CommandLabel3
                    button3.onclick = () => {
                        client.getChannelProcessor('message').sendTransaction(id, JSON.stringify({ Result: 2 }))
                        this.resetModal()
                    }
                }
            } else if(event.type === 'SenderCancel') {
                // Cancel transaction and reset Modal
                this.resetModal()
            }
        })
    },

    resetModal() {
        document.getElementById('dialogTitle').innerHTML = 'No active dialog'
        document.getElementById('dialogText').innerHTML = ''

        const button1 = document.getElementById('dialogButton1')
        button1.innerHTML = ''
        button1.onclick = undefined

        const button2 = document.getElementById('dialogButton2')
        button1.innerHTML = ''
        button2.onclick = undefined

        const button3 = document.getElementById('dialogButton3')
        button1.innerHTML = ''
        button3.onclick = undefined
    }

    
}

window.addEventListener('load', (event) => {
    connectToWS()
    // console.log(xCloudPlayer)
    client = new xCloudPlayer.default('videoHolder', {
        ui_systemui: [],
        ui_touchenabled: true,
        input_legacykeyboard: false
    })

    apiClient = new xCloudPlayer.xCloudPlayerBackend()
    apiClient.getConsoles().then((consoles) => {
        var consoleDiv = document.getElementById('consolesList')
        var consolesHtml = '';

        
        for(var device in consoles.results) {
            consolesHtml += consoles.results[device].deviceName+' ('+consoles.results[device].consoleType+') - '+consoles.results[device].serverId+' isSameNetwork:'+!consoles.results[device].outOfHomeWarning+' <button>'+consoles.results[device].powerState+'</button> <button onclick="app.startSession(\'xhome\', \''+consoles.results[device].serverId+'\')">Start session</button> <br />'
        }
        consoleDiv.innerHTML = consolesHtml

        const serverId = consoles.results[0].serverId
        app.startSession("xhome", serverId)


    }).catch((error) => {
        var consoleDiv = document.getElementById('consolesList')
        consoleDiv.innerHTML = JSON.stringify(error)
    })

    client.setSdpHandler((client, offer) => {
        console.log('handle sdp negotiation:', client, offer)

        apiClient.sendSDPChatOffer(offer).then((sdpResponse) => {
            var sdpDetails = JSON.parse(sdpResponse.exchangeResponse)
            client.setRemoteOffer(sdpDetails.sdp)
        }).catch((error) => {
            console.log('SDP Error:', error)
        })
    })

})

async function connectToWS() {
    console.log("connect to ws");
    // ws = new WebSocket("ws://localhost:8000");
    // ws = new WebSocket("ws://0.0.0.0:8080");
    // const { host, hostname, port } = window.location;


    // ws port is 3000 but in dev server, location port is 8000
    // this is only for dev env purposes
    // const isDev = port !== "3000";
    // if (isDev) {
    //     // wsUrl = `wss://${hostname}:3000`;
    //     wsUrl = `ws://${hostname}:8080`;
    // }

    const wsUrl = `ws://localhost:3001`
    ws = new WebSocket(wsUrl);

    // ws.onopen = () => {
    // };
    console.log("ws:", ws);
    // ws.onmessage = function (event) {
    //   console.log("ws message:", event.data);
    // };
    ws.onmessage = async event => {
        console.log("ws event: ", event);

        switch (event.data) {
            case "frame":
                console.log("give frame");
                console.log("client.imageCapture: ", client.imageCapture);
                if (client.imageCapture) {
                    const frame = await client.imageCapture.grabFrame()
                    const base64Img = btoa(frame)
                    // console.log("frame in js: ", frame);
                    ws.send(JSON.stringify({
                        frame: base64Img
                    }))
                }
                break;

            case "input":
                console.log("set input");
                break;
        
            default:
                console.log("ws event is unhandled: ", event.data);
                break;
        }
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }