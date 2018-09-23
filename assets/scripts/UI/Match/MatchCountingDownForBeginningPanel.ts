import MatchManager from "../../Framework/MatchManager";
import GameManager from "../../Framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchCountingDownForBeginningPanel extends cc.Component {

    @property(cc.Label)
    lblSeconds: cc.Label = null;

    private _matchManager: MatchManager = null;

    onLoad() {
        this._matchManager = GameManager.instance.matchManager;
    }

    update(delta: number) {
        this.lblSeconds.string = Math.ceil((this._matchManager.startTimestamp - new Date().valueOf()) / 1000).toString();
    }
}
