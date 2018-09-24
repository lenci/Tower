import View from "../../Framework/UI/View";
import Tower from "../../Gameplay/Tower/Tower";
import Game from "../../Framework/Game";
import LocalTowerBuilder from "../../Gameplay/Tower/TowerBuilder/LocalTowerBuilder";
import InputManager from "../../Framework/InputManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchOperationPanel extends View {

    @property(cc.Button)
    btnTranslateLeft: cc.Button = null;

    @property(cc.Button)
    btnRight: cc.Button = null;

    @property(cc.Button)
    btnRotate: cc.Button = null;

    @property(cc.Button)
    btnAccelerate: cc.Button = null;

    private _inputManager:InputManager = null;

    onShow() {
        super.onShow();

        this._inputManager = Game.instance.inputManager;
    }

    translateLeft() {
        this._inputManager.addAxis("translate", -1);
    }

    translateRight() {
        this._inputManager.addAxis("translate", 1);
    }

    rotate() {
        this._inputManager.triggerKey("rotate");
    }

    accelerate() {
        his._inputManager.triggerKey("accelerate");
    }
}
