import View from "../../Framework/UI/View";
import Game from "../../Framework/Game";
import InputManager from "../../Framework/InputManager";
import MatchOperationButtonsController from "./MatchOperationButtonsController";
import MatchOperationTrackpadController from "./MatchOperationTrackpadController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchOperationPanel extends View {

    @property(MatchOperationButtonsController)
    buttonsController: MatchOperationButtonsController = null;

    @property(MatchOperationTrackpadController)
    trackpadController: MatchOperationTrackpadController = null;

    private _inputManager: InputManager = null;

    onShow() {
        super.onShow();

        this.buttonsController.enabled = false;
        this.buttonsController.node.active = false;
        this.trackpadController.enabled = false;
        this.trackpadController.node.active = false;

        let controllingMethod:number = Game.instance.settingManager.getSetting("gameControllingMethod");
        if (1 == controllingMethod) {
            this.buttonsController.node.active = true;
            this.buttonsController.enabled = true;
        } else if (2 == controllingMethod) {
            this.trackpadController.node.active = true;
            this.trackpadController.enabled = true;
        }
    }

    onHide() {
        this.buttonsController.enabled = false;
        this.buttonsController.node.active = false;
        this.trackpadController.enabled = false;
        this.trackpadController.node.active = false;

        super.onHide();
    }
}
