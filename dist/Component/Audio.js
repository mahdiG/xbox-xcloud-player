"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AudioComponent {
    constructor(client) {
        this._client = client;
    }
    create(srcObject) {
        console.log('xCloudPlayer Component/Audio.ts - Create media element');
        const audioHolder = document.getElementById(this._client._elementHolder);
        if (audioHolder !== null) {
            const audioRender = document.createElement('audio');
            audioRender.id = this.getElementId();
            audioRender.srcObject = srcObject;
            // audioRender.play()
            audioRender.autoplay = true;
            this._audioRender = audioRender;
            audioHolder.appendChild(audioRender);
        }
        else {
            console.log('xCloudPlayer Component/Audio.ts - Error fetching audioholder: div#' + this._client._elementHolder);
        }
        console.log('xCloudPlayer Component/Audio.ts - Media element created');
    }
    getElementId() {
        return 'xCloudPlayer_' + this._client._elementHolderRandom + '_audioRender';
    }
    getSource() {
        return this._audioSource;
    }
    createMediaSource() {
        const mediaSource = new MediaSource();
        const audioSourceUrl = window.URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', () => {
            console.log('xCloudPlayer Component/Audio.ts - MediaSource opened. Attaching audioSourceBuffer...');
            // if safari?
            let codec = 'audio/webm;codecs=opus';
            if (this._isSafari()) {
                codec = 'audio/mp4'; // @TODO: Fix audio issues on Safari
            }
            const audioSourceBuffer = mediaSource.addSourceBuffer(codec);
            audioSourceBuffer.mode = 'sequence';
            audioSourceBuffer.addEventListener('error', (event) => {
                console.log('xCloudPlayer Component/Audio.ts - Error audio...', event);
            });
            this._audioSource = audioSourceBuffer;
        });
        this._mediaSource = mediaSource;
        return audioSourceUrl;
    }
    destroy() {
        var _a;
        delete this._mediaSource;
        delete this._audioRender;
        delete this._audioSource;
        (_a = document.getElementById(this.getElementId())) === null || _a === void 0 ? void 0 : _a.remove();
        console.log('xCloudPlayer Component/Audio.ts - Cleaning up audio element');
    }
    _isSafari() {
        return (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0);
    }
}
exports.default = AudioComponent;
//# sourceMappingURL=Audio.js.map