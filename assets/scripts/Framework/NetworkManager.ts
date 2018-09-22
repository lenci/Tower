const { ccclass, property } = cc._decorator;

@ccclass
export default class NetworkManager extends cc.Component {

    @property()
    serverIP: string = "127.0.0.1";

    @property({ type: cc.Integer })
    serverPort: number = 9584;

    async connect() {

    }

    async send(message:string) {

    }

    addPushListener(listener:any, push:string, handler:Function) {

    }

    removePushListener(listener:any, push:string) {

    }
}
