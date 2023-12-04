import xCloudPlayer from '../Library'
import { InputFrame } from '../Channel/Input'

export default class GamepadDriver {

    _application: xCloudPlayer | null = null

    _gamepads: Array<any> = []
    _activeGamepadIndex = -1;

    _shadowGamepad = {
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
    }

    // constructor() {
    // }

    setApplication(application: xCloudPlayer) {
        this._application = application
    }

    start() {
        // console.log('xCloudPlayer Driver/Gamepad.ts - Start collecting events:', this._gamepads)
    }

    stop() {
        // console.log('xCloudPlayer Driver/Gamepad.ts - Stop collecting events:', this._gamepads)
    }

    pressButton(index:number, button:string){
        this._shadowGamepad[index][button] = 1
        this._application?.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[index])

        setTimeout(() => {
            this._shadowGamepad[index][button] = 0
            this._application?.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[index])
        }, 60)
    }

    setInput(input){
        this._shadowGamepad[0] = input
        this._application?.getChannelProcessor('input').queueGamepadState(this._shadowGamepad[0])
    }

    run(){
        this._application?.getChannelProcessor('input').queueGamepadState(this.requestState())

        requestAnimationFrame(() => { this.run() })
    }

    requestState() : InputFrame | null {
        const gamepads = navigator.getGamepads()
        let foundActive = false
        for (let gamepad = 0; gamepad < gamepads.length; gamepad++) {
            const gamepadState = gamepads[gamepad]

            if (gamepadState !== null && gamepadState.connected) {
                //We need to find the active gamepad
                if (this._activeGamepadIndex === -1) {
                    //This gamepad has a button pressed, make it the active gamepad
                    if (gamepadState.buttons.some(b => b.value >= .75)) {
                        this._activeGamepadIndex = gamepadState.index
                    }
                }

                //Queue state of the active gamepad
                if (gamepadState.index === this._activeGamepadIndex) {
                    foundActive = true
                    const state = this.mapStateLabels(gamepadState.buttons, gamepadState.axes)
                    state.GamepadIndex = 0 // @TODO: Could we use a second gamepad this way?
                    return state
                    
                    //this._application?.getChannelProcessor('input').queueGamepadState(state)
                    //break;
                }
            }
        }

        //If gamepad is no longer connected, then clear active index
        if (!foundActive) {
            this._activeGamepadIndex = -1
        }
        return null
    }

    mapStateLabels(buttons, axes) {
        return {
            A: buttons[0]?.value || this._shadowGamepad[0].A || 0,
            B: buttons[1]?.value || this._shadowGamepad[0].B || 0,
            X: buttons[2]?.value || this._shadowGamepad[0].X || 0,
            Y: buttons[3]?.value || this._shadowGamepad[0].Y || 0,
            LeftShoulder: buttons[4]?.value || 0,
            RightShoulder: buttons[5]?.value || 0,
            LeftTrigger: buttons[6]?.value || 0,
            RightTrigger: buttons[7]?.value || 0,
            View: buttons[8]?.value || 0,
            Menu: buttons[9]?.value || 0,
            LeftThumb: buttons[10]?.value || 0,
            RightThumb: buttons[11]?.value || 0,
            DPadUp: buttons[12]?.value || 0,
            DPadDown: buttons[13]?.value || 0,
            DPadLeft: buttons[14]?.value || 0,
            DPadRight: buttons[15]?.value || 0,
            Nexus: buttons[16]?.value || (buttons[8]?.value && buttons[9]?.value) || this._shadowGamepad[0].Nexus || 0,
            LeftThumbXAxis: axes[0],
            LeftThumbYAxis: axes[1],
            RightThumbXAxis: axes[2],
            RightThumbYAxis: axes[3],
        } as InputFrame
    }
}