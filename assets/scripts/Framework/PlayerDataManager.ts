const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerDataManager extends cc.Component {

    id:string = "";
    name:string = "";

    start() {
        this.id = "a";
        this.name = "XXX";
    }

    async login() {

    }
}
