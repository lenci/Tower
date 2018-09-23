import MatchManager from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchCountingDownForBeginningPanel extends cc.Component {

    @property(cc.Label)
    lblSeconds: cc.Label = null;

    private _matchManager: MatchManager = null;

    onLoad() {
        this._matchManager = Game.instance.matchManager;
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
