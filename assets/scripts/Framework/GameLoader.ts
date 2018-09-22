import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLoader extends cc.Component {

    static MSG_LOADING_SUCCESS:string = "loading success"

    start () {
        
    }

    load () {
        this.node.emit(GameLoader.MSG_LOADING_SUCCESS);
    }
}
