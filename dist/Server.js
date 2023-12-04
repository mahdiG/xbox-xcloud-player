"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static('www'));
app.use('/dist', express_1.default.static('dist/assets'));
app.listen(port, () => {
    console.log(`Streaming App listening at http://localhost:${port}`);
});
app.get(['/', '/sw.js', '/favicon.ico'], (req, res) => {
    res.send('Server running... <a href="stream.html">Open streaming interface</a>');
});
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
//# sourceMappingURL=Server.js.map