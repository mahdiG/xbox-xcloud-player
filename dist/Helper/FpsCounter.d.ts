import xCloudPlayer from '../Library';
export default class FpsCounter {
    _name: string;
    _application: xCloudPlayer;
    _counter: number;
    _eventInterval: any;
    constructor(application: xCloudPlayer, name: string);
    start(): void;
    stop(): void;
    count(): void;
}
//# sourceMappingURL=FpsCounter.d.ts.map