import InputManager from "../../Framework/InputManager";
import Game from "../../Framework/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOperationTrackpadController extends cc.Component {

    private _inputManager: InputManager = null;

    onEnable() {
        this._inputManager = Game.instance.inputManager;
    }

    onDisable() {

    }
}
