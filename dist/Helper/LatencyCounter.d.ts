import xCloudPlayer from '../Library';
export default class LatencyCounter {
    _name: string;
    _application: xCloudPlayer;
    _latency: Array<number>;
    _eventInterval: any;
    constructor(application: xCloudPlayer, name: string);
    start(): void;
    stop(): void;
    count(time: any): void;
}
//# sourceMappingURL=LatencyCounter.d.ts.map