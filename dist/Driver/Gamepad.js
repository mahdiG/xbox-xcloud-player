"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GamepadDriver {
    constructor() {
        this._application = null;
        this._gamepads = [];
        this._activeGamepadIndex = -1;
        this._shadowGamepad = {
            0: {
                A: 0,
                B: 0,
                X: 0,
                Y: 0,
                LeftShoulder: 0,
                RightShoulder: 0,
                LeftTrigger: 0,
                RightTrigger: 0,
                View: 0,
                Menu: 0,
                LeftThumb: 0,
                RightThumb: 0,
                DPadUp: 0,
                DPadDown: 0,
                DPadLeft: 0,
                DPadRight: 0,
                Nexus: 0,
                LeftThumbXAxis: 0.0,
                LeftThumbYAxis: 0.0,
                RightThumbXAxis: 0.0,
                RightThumbYAxis: 0.0,
            },
        };
    }
    // constructor() {
    // }
    setApplication(application) {
        this._application = application;
    }
    start() {
        // console.log('xCloudPlayer Driver/Gamepad.ts - Start collecting events:', this._gamepads)
    }
    stop() {
        // console.log('xCloudPlayer Driver/Gamepad.ts - Stop collecting events:', this._gamepads)
    }
    pressButton(index, button) {
        var _a;
        this._shadowGamepad[index][button] = 1;
        (_a = this._application) === null || _a === void 0 ? void 0 : _a.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[index]);
        setTimeout(() => {
            var _a;
            this._shadowGamepad[index][button] = 0;
            (_a = this._application) === null || _a === void 0 ? void 0 : _a.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[index]);
        }, 60);
    }
    setInput(input) {
        var _a;
        this._shadowGamepad[0] = input;
        (_a = this._application) === null || _a === void 0 ? void 0 : _a.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[0]);
    }
    run() {
        var _a;
        (_a = this._application) === null || _a === void 0 ? void 0 : _a.getChannelProcessor('input').queueGamepadState(this.requestState());
        requestAnimationFrame(() => { this.run(); });
    }
    requestState() {
        const gamepads = navigator.getGamepads();
        let foundActive = false;
        for (let gamepad = 0; gamepad < gamepads.length; gamepad++) {
            const gamepadState = gamepads[gamepad];
            if (gamepadState !== null && gamepadState.connected) {
                //We need to find the active gamepad
                if (this._activeGamepadIndex === -1) {
                    //This gamepad has a button pressed, make it the active gamepad
                    if (gamepadState.buttons.some(b => b.value >= .75)) {
                        this._activeGamepadIndex = gamepadState.index;
                    }
                }
                //Queue state of the active gamepad
                if (gamepadState.index === this._activeGamepadIndex) {
                    foundActive = true;
                    const state = this.mapStateLabels(gamepadState.buttons, gamepadState.axes);
                    state.GamepadIndex = 0; // @TODO: Could we use a second gamepad this way?
                    return state;
                    //this._application?.getChannelProcessor('input').queueGamepadState(state)
                    //break;
                }
            }
        }
        //If gamepad is no longer connected, then clear active index
        if (!foundActive) {
            this._activeGamepadIndex = -1;
        }
        return null;
    }
    mapStateLabels(buttons, axes) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return {
            A: ((_a = buttons[0]) === null || _a === void 0 ? void 0 : _a.value) || this._shadowGamepad[0].A || 0,
            B: ((_b = buttons[1]) === null || _b === void 0 ? void 0 : _b.value) || this._shadowGamepad[0].B || 0,
            X: ((_c = buttons[2]) === null || _c === void 0 ? void 0 : _c.value) || this._shadowGamepad[0].X || 0,
            Y: ((_d = buttons[3]) === null || _d === void 0 ? void 0 : _d.value) || this._shadowGamepad[0].Y || 0,
            LeftShoulder: ((_e = buttons[4]) === null || _e === void 0 ? void 0 : _e.value) || 0,
            RightShoulder: ((_f = buttons[5]) === null || _f === void 0 ? void 0 : _f.value) || 0,
            LeftTrigger: ((_g = buttons[6]) === null || _g === void 0 ? void 0 : _g.value) || 0,
            RightTrigger: ((_h = buttons[7]) === null || _h === void 0 ? void 0 : _h.value) || 0,
            View: ((_j = buttons[8]) === null || _j === void 0 ? void 0 : _j.value) || 0,
            Menu: ((_k = buttons[9]) === null || _k === void 0 ? void 0 : _k.value) || 0,
            LeftThumb: ((_l = buttons[10]) === null || _l === void 0 ? void 0 : _l.value) || 0,
            RightThumb: ((_m = buttons[11]) === null || _m === void 0 ? void 0 : _m.value) || 0,
            DPadUp: ((_o = buttons[12]) === null || _o === void 0 ? void 0 : _o.value) || 0,
            DPadDown: ((_p = buttons[13]) === null || _p === void 0 ? void 0 : _p.value) || 0,
            DPadLeft: ((_q = buttons[14]) === null || _q === void 0 ? void 0 : _q.value) || 0,
            DPadRight: ((_r = buttons[15]) === null || _r === void 0 ? void 0 : _r.value) || 0,
            Nexus: ((_s = buttons[16]) === null || _s === void 0 ? void 0 : _s.value) || (((_t = buttons[8]) === null || _t === void 0 ? void 0 : _t.value) && ((_u = buttons[9]) === null || _u === void 0 ? void 0 : _u.value)) || this._shadowGamepad[0].Nexus || 0,
            LeftThumbXAxis: axes[0],
            LeftThumbYAxis: axes[1],
            RightThumbXAxis: axes[2],
            RightThumbYAxis: axes[3],
        };
    }
}
exports.default = GamepadDriver;
//# sourceMappingURL=Gamepad.js.map