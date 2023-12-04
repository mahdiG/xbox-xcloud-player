import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import proxy from 'express-http-proxy'
import puppeteer from 'puppeteer'
import { WebSocketServer } from 'ws'

import EventEmitter from 'node:events'

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()


const wsPort = process.env.WS_PORT || 3001
const wsServer = new WebSocketServer({ port: wsPort })
let ws

wsServer.on('connection', (socket) => {
    ws = socket
    ws.on('error', console.error)

    ws.on('message', (dataString) => {
        const data = JSON.parse(dataString)
        if (data.frame) {
            myEmitter.emit('frame', data.frame)
        }
        console.log('received: %s', data)
    })

    ws.send('something')
})



const app = express()
const port = process.env.HTTP_PORT || 3000

app.use(bodyParser.json())

app.use(express.static('www'))
app.use('/dist', express.static('dist/assets'))

app.listen(port, () => {
    console.log(`Streaming App listening at http://localhost:${port}`)
})

app.get(['/', '/sw.js', '/favicon.ico'], (req, res) => {
    res.send('Server running... <a href="stream.html">Open streaming interface</a>')
})


app.get('/test', (req, res) => {
    res.send('puppetteeerr')

    
})

app.get('/frame', (req, res) => {
    ws.send('frame')
    myEmitter.on('frame', async frame64 => {
        // console.log('got frame64: ', frame64)
        // const blob = Buffer.from(frame64, "base64")
        // const blob = atob(frame64)
        // console.log("blob: ", blob);
        // const buffer = Buffer.from(await blob.arrayBuffer())
        
        // writeFile("out.bmp", frame64, 'base64', function(err) {
        //     console.log(err);
        // });
        res.send(frame64)
    })
})


app.use(proxy('uks.gssv-play-prodxhome.xboxlive.com', {
    https: true,
    proxyReqOptDecorator: function(proxyReqOpts) {
        //   proxyReqOpts.headers = []

        proxyReqOpts.headers['Authorization'] = 'Bearer '+process.env.GS_TOKEN
        proxyReqOpts.headers['Content-Type'] = 'application/json; charset=utf-8'

        return proxyReqOpts
    },
    proxyErrorHandler: function(err, res, next) {
        switch (err && err.code) {
            case 'ECONNRESET': { return res.status(503).send('Proxy error: ECONNRESET') }
            case 'ECONNREFUSED': { return res.status(503).send('Proxy error: ECONNREFUSED') }
            default: { next(err) }
        }
    },
}))



function startPuppeteer(){
    (async () => {
        const browser = await puppeteer.launch({
            headless: 'new',
        })
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        
        page
            .on('console', message =>
                console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
            .on('pageerror', (error => {
                if (error) {
                    console.log('error:, ', error)
                }
            }))
            .on('response', response =>
                console.log(`${response.status()} ${response.url()}`))
            .on('requestfailed', request => {
                if (request) {
                    const failure = request.failure() 
                    console.log(`${failure?.errorText} ${request.url()}`)
                }
            })

        await page.goto(`http://localhost:${port}/stream.html`)
    
        // await browser.close()
    })()
}

startPuppeteer()
