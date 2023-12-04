"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class DebugChannel extends Base_1.default {
    onOpen(event) {
        super.onOpen(event);
        // console.log('xCloudPlayer Channel/Debug.ts - ['+this._channelName+'] onOpen:', event)
    }
    onMessage(event) {
        console.log('xCloudPlayer Channel/Debug.ts - [' + this._channelName + '] onMessage:', event);
    }
    onClose(event) {
        super.onClose(event);
        // console.log('xCloudPlayer Channel/Debug.ts - ['+this._channelName+'] onClose:', event)
    }
}
exports.default = DebugChannel;
//# sourceMappingURL=Debug.js.map