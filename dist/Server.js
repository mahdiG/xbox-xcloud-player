"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const ws_1 = require("ws");
const node_events_1 = __importDefault(require("node:events"));
class MyEmitter extends node_events_1.default {
}
const myEmitter = new MyEmitter();
const wsPort = process.env.WS_PORT || 3001;
const wsServer = new ws_1.WebSocketServer({ port: wsPort });
let ws;
wsServer.on('connection', (socket) => {
    ws = socket;
    ws.on('error', console.error);
    ws.on('message', (dataString) => {
        const data = JSON.parse(dataString);
        if (data.frame) {
            myEmitter.emit('frame', data.frame);
        }
        console.log('received: %s', data);
    });
    ws.send('something');
});
const app = (0, express_1.default)();
const port = process.env.HTTP_PORT || 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static('www'));
app.use('/dist', express_1.default.static('dist/assets'));
app.listen(port, () => {
    console.log(`Streaming App listening at http://localhost:${port}`);
});
app.get(['/', '/sw.js', '/favicon.ico'], (req, res) => {
    res.send('Server running... <a href="stream.html">Open streaming interface</a>');
});
app.get('/test', (req, res) => {
    res.send('puppetteeerr');
});
app.get('/frame', (req, res) => {
    ws.send('frame');
    myEmitter.on('frame', async (frame64) => {
        // console.log('got frame64: ', frame64)
        // const blob = Buffer.from(frame64, "base64")
        // const blob = atob(frame64)
        // console.log("blob: ", blob);
        // const buffer = Buffer.from(await blob.arrayBuffer())
        // writeFile("out.bmp", frame64, 'base64', function(err) {
        //     console.log(err);
        // });
        res.send(frame64);
    });
});
function getFrame() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject();
        }, 5000);
        ws.send('frame');
        myEmitter.on('frame', frame => {
            console.log('got frame: ', frame);
            resolve(frame);
        });
    });
}
app.use((0, express_http_proxy_1.default)('uks.gssv-play-prodxhome.xboxlive.com', {
    https: true,
    proxyReqOptDecorator: function (proxyReqOpts) {
        //   proxyReqOpts.headers = []
        proxyReqOpts.headers['Authorization'] = 'Bearer ' + process.env.GS_TOKEN;
        proxyReqOpts.headers['Content-Type'] = 'application/json; charset=utf-8';
        return proxyReqOpts;
    },
    proxyErrorHandler: function (err, res, next) {
        switch (err && err.code) {
            case 'ECONNRESET': {
                return res.status(503).send('Proxy error: ECONNRESET');
            }
            case 'ECONNREFUSED': {
                return res.status(503).send('Proxy error: ECONNREFUSED');
            }
            default: {
                next(err);
            }
        }
    },
}));
function startPuppeteer() {
    (async () => {
        const browser = await puppeteer_1.default.launch({
            headless: 'new',
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        page
            .on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
            .on('pageerror', (error => {
            if (error) {
                console.log('error:, ', error);
            }
        }))
            .on('response', response => console.log(`${response.status()} ${response.url()}`))
            .on('requestfailed', request => {
            if (request) {
                const failure = request.failure();
                console.log(`${failure === null || failure === void 0 ? void 0 : failure.errorText} ${request.url()}`);
            }
        });
        await page.goto(`http://localhost:${port}/stream.html`);
        await new Promise(r => setTimeout(r, 20000));
        console.log("taking screenshot");
        await page.screenshot({ path: 'example.png' });
        // await browser.close()
    })();
}
startPuppeteer();
//# sourceMappingURL=Server.js.map