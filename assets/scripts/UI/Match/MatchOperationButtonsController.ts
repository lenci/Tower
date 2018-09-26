import Game from "../../Framework/Game";
import InputManager from "../../Framework/InputManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOperationButtonsController extends cc.Component {

    @property(cc.Button)
    btnAccelerate: cc.Button = null;

    private _inputManager: InputManager = null;

    private _isAccelerateButtonPressed: boolean = false;

    onEnable() {
        this._inputManager = Game.instance.inputManager;

        this.btnAccelerate.node.on(cc.Node.EventType.TOUCH_START, this._onAccelerateButtonTouchStart, this);
        this.btnAccelerate.node.on(cc.Node.EventType.TOUCH_END, this._onAccelerateButtonTouchEnd, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);

    }

    onDisable() {
        this._isAccelerateButtonPressed = false;

        this.btnAccelerate.node.off(cc.Node.EventType.TOUCH_START, this._onAccelerateButtonTouchStart, this);
        this.btnAccelerate.node.off(cc.Node.EventType.TOUCH_END, this._onAccelerateButtonTouchEnd, this);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    update(delta: number) {
        if (this._isAccelerateButtonPressed) {
            this.accelerate();
        }
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

    private _onAccelerateButtonTouchStart() {
        this._isAccelerateButtonPressed = true;
    }

    private _onAccelerateButtonTouchEnd() {
        this._isAccelerateButtonPressed = false;
    }

    private _onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                this.translateLeft();
                break;

            case 39:
                this.translateRight();
                break;

            case 38:
                this.rotate();
                break;

            case 40:
                this._isAccelerateButtonPressed = true;
                break;

            default:
        }
    }

    private _onKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 40:
                this._isAccelerateButtonPressed = false;
                break;

            default:
        }
    }
}
