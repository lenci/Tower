import MatchManager from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";
import View from "../../Framework/UI/View";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchStartingPanel extends View {

    @property(cc.Button)
    btnStart: cc.Button = null;

    private _matchManager: MatchManager = null;

    onShow() {
        this._matchManager = Game.instance.matchManager;

        if (!this._matchManager.hasJoined) {
            this._matchManager.joinMatch();
        }

        super.onShow();
    }

    startMatch() {
        this._matchManager.startMatch();
    }
}
