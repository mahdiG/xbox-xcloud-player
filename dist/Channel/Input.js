"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FpsCounter_1 = __importDefault(require("../Helper/FpsCounter"));
//import LatencyCounter from '../Helper/LatencyCounter'
const Base_1 = __importDefault(require("./Base"));
const Packet_1 = __importDefault(require("./Input/Packet"));
class InputChannel extends Base_1.default {
    constructor(channelName, client) {
        super(channelName, client);
        this._inputSequenceNum = 0;
        this._reportTypes = {
            None: 0,
            Metadata: 1,
            Gamepad: 2,
            Pointer: 4,
            ClientMetadata: 8,
            ServerMetadata: 16,
            Mouse: 32,
            Keyboard: 64,
            Vibration: 128,
            Sendor: 256,
        };
        this._frameMetadataQueue = [];
        this._gamepadFrames = [];
        this._pointerFrames = [];
        this._pointerCounter = 1;
        this._mouseFrames = [];
        this._keyboardFrames = [];
        this._keyboardEvents = [];
        this._rumbleEnabled = true;
        this._touchEvents = {};
        this._touchLastPointerId = 0;
        this._mouseActive = false;
        this._mouseLocked = false;
        this._touchActive = false;
        this._mouseStateButtons = 0;
        this._mouseStateX = 0;
        this._mouseStateY = 0;
        this._keyboardButtonsState = {};
        this._metadataFps = new FpsCounter_1.default(this.getClient(), 'metadata');
        // this._metadataLatency = new LatencyCounter(this.getClient(), 'metadata')
        this._inputFps = new FpsCounter_1.default(this.getClient(), 'input');
        // this._inputLatency = new LatencyCounter(this.getClient(), 'input')
    }
    onOpen(event) {
        super.onOpen(event);
        this._metadataFps.start();
        this._inputFps.start();
        // console.log('xCloudPlayer Channel/Input.ts - ['+this._channelName+'] onOpen:', event)
    }
    start() {
        const Packet = new Packet_1.default(this._inputSequenceNum);
        Packet.setMetadata(2);
        this.send(Packet.toBuffer());
        if (this._client._config.input_legacykeyboard === false) {
            this.getClient()._inputDriver.run();
        }
        this._inputInterval = setInterval(() => {
            // Keyboard mask
            if (this._client._config.input_legacykeyboard === true && this.getGamepadQueueLength() === 0) {
                const gpState = this.getClient()._inputDriver.requestState();
                const kbState = this.getClient()._keyboardDriver.requestState();
                const mergedState = this.mergeState(gpState, kbState, this._adhocState);
                this._adhocState = null;
                this.queueGamepadState(mergedState);
            }
            if (this._client._config.input_touch === true && Object.keys(this._touchEvents).length > 0) {
                for (const pointerEvent in this._touchEvents) {
                    this._pointerFrames.push({
                        events: this._touchEvents[pointerEvent].events,
                    });
                }
                this._touchEvents = {};
            }
            const metadataQueue = this.getMetadataQueue();
            const gamepadQueue = this.getGamepadQueue();
            const pointerQueue = this.getPointerQueue();
            const mouseQueue = this.getMouseQueue();
            const keyboardQueue = this.getKeyboardQueue();
            if (metadataQueue.length !== 0 || gamepadQueue.length !== 0 || pointerQueue.length !== 0) {
                this._inputSequenceNum++;
                const packet = new Packet_1.default(this._inputSequenceNum);
                packet.setData(metadataQueue, gamepadQueue, pointerQueue, mouseQueue, keyboardQueue);
                // console.log('Sending new format:', packet)
                this.send(packet.toBuffer());
            }
        }, 16); // 16 ms = 1 frame (1000/60)
    }
    mergeState(gpState, kbState, adHoc) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        return {
            GamepadIndex: (_a = gpState === null || gpState === void 0 ? void 0 : gpState.GamepadIndex) !== null && _a !== void 0 ? _a : kbState.GamepadIndex,
            A: Math.max((_b = gpState === null || gpState === void 0 ? void 0 : gpState.A) !== null && _b !== void 0 ? _b : 0, kbState.A, (_c = adHoc === null || adHoc === void 0 ? void 0 : adHoc.A) !== null && _c !== void 0 ? _c : 0),
            B: Math.max((_d = gpState === null || gpState === void 0 ? void 0 : gpState.B) !== null && _d !== void 0 ? _d : 0, kbState.B, (_e = adHoc === null || adHoc === void 0 ? void 0 : adHoc.B) !== null && _e !== void 0 ? _e : 0),
            X: Math.max((_f = gpState === null || gpState === void 0 ? void 0 : gpState.X) !== null && _f !== void 0 ? _f : 0, kbState.X, (_g = adHoc === null || adHoc === void 0 ? void 0 : adHoc.X) !== null && _g !== void 0 ? _g : 0),
            Y: Math.max((_h = gpState === null || gpState === void 0 ? void 0 : gpState.Y) !== null && _h !== void 0 ? _h : 0, kbState.Y, (_j = adHoc === null || adHoc === void 0 ? void 0 : adHoc.Y) !== null && _j !== void 0 ? _j : 0),
            LeftShoulder: Math.max((_k = gpState === null || gpState === void 0 ? void 0 : gpState.LeftShoulder) !== null && _k !== void 0 ? _k : 0, kbState.LeftShoulder, (_l = adHoc === null || adHoc === void 0 ? void 0 : adHoc.LeftShoulder) !== null && _l !== void 0 ? _l : 0),
            RightShoulder: Math.max((_m = gpState === null || gpState === void 0 ? void 0 : gpState.RightShoulder) !== null && _m !== void 0 ? _m : 0, kbState.RightShoulder, (_o = adHoc === null || adHoc === void 0 ? void 0 : adHoc.RightShoulder) !== null && _o !== void 0 ? _o : 0),
            LeftTrigger: Math.max((_p = gpState === null || gpState === void 0 ? void 0 : gpState.LeftTrigger) !== null && _p !== void 0 ? _p : 0, kbState.LeftTrigger, (_q = adHoc === null || adHoc === void 0 ? void 0 : adHoc.LeftTrigger) !== null && _q !== void 0 ? _q : 0),
            RightTrigger: Math.max((_r = gpState === null || gpState === void 0 ? void 0 : gpState.RightTrigger) !== null && _r !== void 0 ? _r : 0, kbState.RightTrigger, (_s = adHoc === null || adHoc === void 0 ? void 0 : adHoc.RightTrigger) !== null && _s !== void 0 ? _s : 0),
            View: Math.max((_t = gpState === null || gpState === void 0 ? void 0 : gpState.View) !== null && _t !== void 0 ? _t : 0, kbState.View, (_u = adHoc === null || adHoc === void 0 ? void 0 : adHoc.View) !== null && _u !== void 0 ? _u : 0),
            Menu: Math.max((_v = gpState === null || gpState === void 0 ? void 0 : gpState.Menu) !== null && _v !== void 0 ? _v : 0, kbState.Menu, (_w = adHoc === null || adHoc === void 0 ? void 0 : adHoc.Menu) !== null && _w !== void 0 ? _w : 0),
            LeftThumb: Math.max((_x = gpState === null || gpState === void 0 ? void 0 : gpState.LeftThumb) !== null && _x !== void 0 ? _x : 0, kbState.LeftThumb, (_y = adHoc === null || adHoc === void 0 ? void 0 : adHoc.LeftThumb) !== null && _y !== void 0 ? _y : 0),
            RightThumb: Math.max((_z = gpState === null || gpState === void 0 ? void 0 : gpState.RightThumb) !== null && _z !== void 0 ? _z : 0, kbState.RightThumb, (_0 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.RightThumb) !== null && _0 !== void 0 ? _0 : 0),
            DPadUp: Math.max((_1 = gpState === null || gpState === void 0 ? void 0 : gpState.DPadUp) !== null && _1 !== void 0 ? _1 : 0, kbState.DPadUp, (_2 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.DPadUp) !== null && _2 !== void 0 ? _2 : 0),
            DPadDown: Math.max((_3 = gpState === null || gpState === void 0 ? void 0 : gpState.DPadDown) !== null && _3 !== void 0 ? _3 : 0, kbState.DPadDown, (_4 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.DPadDown) !== null && _4 !== void 0 ? _4 : 0),
            DPadLeft: Math.max((_5 = gpState === null || gpState === void 0 ? void 0 : gpState.DPadLeft) !== null && _5 !== void 0 ? _5 : 0, kbState.DPadLeft, (_6 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.DPadLeft) !== null && _6 !== void 0 ? _6 : 0),
            DPadRight: Math.max((_7 = gpState === null || gpState === void 0 ? void 0 : gpState.DPadRight) !== null && _7 !== void 0 ? _7 : 0, kbState.DPadRight, (_8 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.DPadRight) !== null && _8 !== void 0 ? _8 : 0),
            Nexus: Math.max((_9 = gpState === null || gpState === void 0 ? void 0 : gpState.Nexus) !== null && _9 !== void 0 ? _9 : 0, kbState.Nexus, (_10 = adHoc === null || adHoc === void 0 ? void 0 : adHoc.Nexus) !== null && _10 !== void 0 ? _10 : 0),
            LeftThumbXAxis: this.mergeAxix((_11 = gpState === null || gpState === void 0 ? void 0 : gpState.LeftThumbXAxis) !== null && _11 !== void 0 ? _11 : 0, kbState.LeftThumbXAxis),
            LeftThumbYAxis: this.mergeAxix((_12 = gpState === null || gpState === void 0 ? void 0 : gpState.LeftThumbYAxis) !== null && _12 !== void 0 ? _12 : 0, kbState.LeftThumbYAxis),
            RightThumbXAxis: this.mergeAxix((_13 = gpState === null || gpState === void 0 ? void 0 : gpState.RightThumbXAxis) !== null && _13 !== void 0 ? _13 : 0, kbState.RightThumbXAxis),
            RightThumbYAxis: this.mergeAxix((_14 = gpState === null || gpState === void 0 ? void 0 : gpState.RightThumbYAxis) !== null && _14 !== void 0 ? _14 : 0, kbState.RightThumbYAxis),
        };
    }
    mergeAxix(axis1, axis2) {
        if (Math.abs(axis1) > Math.abs(axis2)) {
            return axis1;
        }
        else {
            return axis2;
        }
    }
    onMessage(event) {
        // console.log('xCloudPlayer Channel/Input.ts - ['+this._channelName+'] onMessage:', event)
        var _a;
        const dataView = new DataView(event.data);
        let i = 0;
        const reportType = dataView.getUint8(i);
        const unk1 = dataView.getUint8(i + 1);
        i += 2;
        if (reportType === this._reportTypes.Vibration) {
            dataView.getUint8(i); // rumbleType: 0 = FourMotorRumble
            const gamepadIndex = dataView.getUint8(i + 1); // Gamepadindex?
            // console.log('gamepad: ', gamepadIndex, unk1)
            i += 2; // Read one unknown byte extra
            const leftMotorPercent = dataView.getUint8(i) / 100;
            const rightMotorPercent = dataView.getUint8(i + 1) / 100;
            const leftTriggerMotorPercent = dataView.getUint8(i + 2) / 100;
            const rightTriggerMotorPercent = dataView.getUint8(i + 3) / 100;
            const durationMs = dataView.getUint16(i + 4, true);
            const delayMs = dataView.getUint16(i + 6, true);
            const repeat = dataView.getUint8(i + 8);
            i += 9;
            // Check if we have an active gamepad and rumble enabled
            const gamepad = navigator.getGamepads()[0];
            if (gamepad !== null && this._rumbleEnabled === true) {
                const rumbleData = {
                    startDelay: 0,
                    duration: durationMs,
                    weakMagnitude: rightMotorPercent,
                    strongMagnitude: leftMotorPercent,
                    leftTrigger: leftTriggerMotorPercent,
                    rightTrigger: rightTriggerMotorPercent,
                };
                if (this._rumbleInterval !== undefined) {
                    clearInterval(this._rumbleInterval);
                }
                if (gamepad.vibrationActuator !== undefined) {
                    if (gamepad.vibrationActuator.type === 'dual-rumble') {
                        const intensityRumble = rightMotorPercent < .6 ? (.6 - rightMotorPercent) / 2 : 0;
                        const intensityRumbleTriggers = (leftTriggerMotorPercent + rightTriggerMotorPercent) / 4;
                        const endIntensity = Math.min(intensityRumble, intensityRumbleTriggers);
                        rumbleData.weakMagnitude = Math.min(1, rightMotorPercent + endIntensity);
                        // Set triggers as we have changed the motor rumble already
                        rumbleData.leftTrigger = 0;
                        rumbleData.rightTrigger = 0;
                    }
                    (_a = gamepad.vibrationActuator) === null || _a === void 0 ? void 0 : _a.playEffect(gamepad.vibrationActuator.type, rumbleData);
                    if (repeat > 0) {
                        let repeatCount = repeat;
                        this._rumbleInterval = setInterval(() => {
                            var _a;
                            if (repeatCount <= 0) {
                                clearInterval(this._rumbleInterval);
                            }
                            if (gamepad.vibrationActuator !== undefined) {
                                (_a = gamepad.vibrationActuator) === null || _a === void 0 ? void 0 : _a.playEffect(gamepad.vibrationActuator.type, rumbleData);
                            }
                            repeatCount--;
                        }, delayMs + durationMs);
                    }
                }
            }
        }
    }
    onClose(event) {
        clearInterval(this._inputInterval);
        super.onClose(event);
        // console.log('xCloudPlayer Channel/Input.ts - ['+this._channelName+'] onClose:', event)
    }
    _createInputPacket(reportType, metadataQueue, gamepadQueue, pointerQueue, mouseQueue, keyboardQueue) {
        this._inputSequenceNum++;
        const Packet = new Packet_1.default(this._inputSequenceNum);
        Packet.setData(metadataQueue, gamepadQueue, pointerQueue, mouseQueue, keyboardQueue);
        return Packet.toBuffer();
    }
    getGamepadQueue(size = 30) {
        return this._gamepadFrames.splice(0, (size - 1));
    }
    getGamepadQueueLength() {
        return this._gamepadFrames.length;
    }
    queueGamepadState(input) {
        if (input !== null) {
            return this._gamepadFrames.push(input);
        }
    }
    getPointerQueue(size = 2) {
        return this._pointerFrames.splice(0, (size - 1));
    }
    getPointerQueueLength() {
        return this._pointerFrames.length;
    }
    getMouseQueue(size = 30) {
        return this._mouseFrames.splice(0, (size - 1));
    }
    getMouseQueueLength() {
        return this._mouseFrames.length;
    }
    getKeyboardQueue(size = 2) {
        return this._keyboardFrames.splice(0, (size - 1));
    }
    getKeyboardQueueLength() {
        return this._keyboardFrames.length;
    }
    onPointerMove(e) {
        e.preventDefault();
        if (this._mouseActive === true && this._mouseLocked === true) {
            this._mouseStateX = e.movementX;
            this._mouseStateY = e.movementY;
            this._mouseStateButtons = e.buttons;
            this._mouseFrames.push({
                X: this._mouseStateX * 10,
                Y: this._mouseStateY * 10,
                WheelX: 0,
                WheelY: 0,
                Buttons: this._mouseStateButtons,
                Relative: 0, // 0 = Relative, 1 = Absolute
            });
        }
        if (this._touchActive === true) {
            this._touchLastPointerId = e.pointerId;
            if (this._touchEvents[e.pointerId] === undefined) {
                this._touchEvents[e.pointerId] = {
                    events: [],
                };
            }
            this._touchEvents[e.pointerId].events.push(e);
        }
    }
    requestPointerLockWithUnadjustedMovement(element) {
        const promise = element.requestPointerLock({
            unadjustedMovement: true,
        });
        if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
            document.body.requestFullscreen().then(() => {
                navigator.keyboard.lock();
            });
        }
        return promise.then(() => {
            console.log('pointer is locked');
            this._mouseLocked = true;
        }).catch((error) => {
            if (error.name === 'NotSupportedError') {
                this._mouseLocked = true;
                return element.requestPointerLock();
            }
        });
    }
    onPointerClick(e) {
        e.preventDefault();
        if (e.pointerType === 'touch') {
            this._mouseActive = false;
            this._touchActive = true;
        }
        else if (e.pointerType === 'mouse') {
            this._mouseActive = true;
            this._touchActive = false;
        }
        if (this._client._config.input_mousekeyboard === true && this._mouseActive === true && this._mouseLocked === false) {
            this.requestPointerLockWithUnadjustedMovement(e.target);
            document.addEventListener('pointerlockchange', () => {
                if (document.pointerLockElement !== null) {
                    this._mouseLocked = true;
                }
                else {
                    this._mouseLocked = false;
                }
            }, false);
            document.addEventListener('systemkeyboardlockchanged', event => {
                console.log(event);
                // // if (event.systemKeyboardLockEnabled) {
                // //   console.log('System keyboard lock enabled.')
                // // } else {
                // //   console.log('System keyboard lock disabled.')
                // // }
            }, false);
        }
        else if (this._mouseActive === true && this._mouseLocked === true) {
            this._mouseStateX = e.movementX;
            this._mouseStateY = e.movementY;
            this._mouseStateButtons = e.buttons;
            this._mouseFrames.push({
                X: this._mouseStateX * 10,
                Y: this._mouseStateY * 10,
                WheelX: 0,
                WheelY: 0,
                Buttons: this._mouseStateButtons,
                Relative: 0, // 0 = Relative, 1 = Absolute
            });
        }
        if (this._touchActive === true) {
            this._touchLastPointerId = e.pointerId;
            if (this._touchEvents[e.pointerId] === undefined) {
                this._touchEvents[e.pointerId] = {
                    events: [],
                };
            }
            this._touchEvents[e.pointerId].events.push(e);
        }
    }
    onPointerScroll(e) {
        e.preventDefault();
        // console.log('got onpointerscroll', e)
    }
    onKeyDown(event) {
        if (this._mouseActive === true && this._mouseLocked === true) {
            if (this._keyboardButtonsState[event.keyCode] !== true) {
                this._keyboardButtonsState[event.keyCode] = true;
                // console.log('keyDown', event.keyCode)
                this._keyboardFrames.push({
                    pressed: true,
                    key: event.key,
                    keyCode: event.keyCode,
                });
                setTimeout(() => {
                    this._keyboardFrames.push({
                        pressed: true,
                        key: event.key,
                        keyCode: event.keyCode,
                    });
                }, 16);
            }
        }
    }
    onKeyUp(event) {
        if (this._mouseActive === true && this._mouseLocked === true) {
            this._keyboardButtonsState[event.keyCode] = false;
            // console.log('keyUp', event.keyCode)
            this._keyboardFrames.push({
                pressed: false,
                key: event.key,
                keyCode: event.keyCode,
            });
            setTimeout(() => {
                this._keyboardFrames.push({
                    pressed: false,
                    key: event.key,
                    keyCode: event.keyCode,
                });
            }, 16);
        }
    }
    convertAbsoluteMousePositionImpl(e, t, i, n) {
        let s = i;
        let a = n;
        const o = 1920 / 1080;
        if (o > i / n) {
            a = s / o;
            t -= (n - a) / 2;
        }
        else {
            s = a * o;
            e -= (i - s) / 2;
        }
        e *= 65535 / s;
        t *= 65535 / a;
        return [e = Math.min(Math.max(Math.round(e), 0), 65535), t = Math.min(Math.max(Math.round(t), 0), 65535)];
    }
    _convertToInt16(e) {
        const int = new Int16Array(1);
        return int[0] = e, int[0];
    }
    _convertToUInt16(e) {
        const int = new Uint16Array(1);
        return int[0] = e, int[0];
    }
    normalizeTriggerValue(e) {
        if (e < 0) {
            return this._convertToUInt16(0);
        }
        const t = 65535 * e, a = t > 65535 ? 65535 : t;
        return this._convertToUInt16(a);
    }
    normalizeAxisValue(e) {
        const t = this._convertToInt16(32767), a = this._convertToInt16(-32767), n = e * t;
        return n > t ? t : n < a ? a : this._convertToInt16(n);
    }
    pressButton(index, button) {
        if (this._client._config.input_legacykeyboard === true) {
            this._client._keyboardDriver.pressButton(button);
        }
        else {
            this._client._inputDriver.pressButton(index, button);
        }
    }
    destroy() {
        this._metadataFps.stop();
        this._inputFps.stop();
        clearInterval(this._inputInterval);
        super.destroy();
    }
    addProcessedFrame(frame) {
        frame.frameRenderedTimeMs = performance.now();
        this._frameMetadataQueue.push(frame);
    }
    getMetadataQueue(size = 30) {
        return this._frameMetadataQueue.splice(0, (size - 1));
    }
    getMetadataQueueLength() {
        return this._frameMetadataQueue.length;
    }
}
exports.default = InputChannel;
//# sourceMappingURL=Input.js.map