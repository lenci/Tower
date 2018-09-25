import Game from "../../Framework/Game";
import InputManager from "../../Framework/InputManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOperationButtonsController extends cc.Component {

    private _inputManager: InputManager = null;

    onEnable() {
        this._inputManager = Game.instance.inputManager;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
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
        this._inputManager.triggerKey("accelerate");
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 1:
                this.translateLeft();
                break;

            case 2:
                this.translateRight();
                break;

            case 3:
                this.rotate();
                break;

            case 4:
                this.accelerate();
                break;

            default:
        }
    }
}
