import xCloudPlayer from '../Library';
export default class BitrateCounter {
    _name: string;
    _application: xCloudPlayer;
    _bitratePackets: Array<number>;
    _bitrateData: Array<number>;
    _eventInterval: any;
    constructor(application: xCloudPlayer, name: string);
    start(): void;
    stop(): void;
    count(packetLength: any, dataLength: any): void;
    countPacket(packetLength: any): void;
    countData(dataLength: any): void;
}
//# sourceMappingURL=BitrateCounter.d.ts.map