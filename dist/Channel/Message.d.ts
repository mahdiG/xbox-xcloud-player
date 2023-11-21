import BaseChannel from './Base';
export default class MessageChannel extends BaseChannel {
    onOpen(event: any): void;
    onMessage(event: any): void;
    onClose(event: any): void;
    generateMessage(path: any, data: any): {
        type: string;
        content: string;
        id: string;
        target: any;
        cv: string;
    };
    sendTransaction(id: any, data: any): void;
}
//# sourceMappingURL=Message.d.ts.map