import MatchManager from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";
import View from "../../Framework/UI/View";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchCountingDownForBeginningPanel extends View {

    @property(cc.Label)
    lblSeconds: cc.Label = null;

    private _matchManager: MatchManager = null;

    onShow() {
        this._matchManager = Game.instance.matchManager;

        super.onShow();
    }

    update(delta: number) {
        let seconds: number = Math.ceil((this._matchManager.startTimestamp - new Date().valueOf()) / 1000);
        if (seconds > 0) {
            this.lblSeconds.string = seconds.toString();
        } else {
            this.lblSeconds.string = "";
        }
    }
}
