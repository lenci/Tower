import MatchManager from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchStartingPanel extends cc.Component {

    @property(cc.Button)
    btnStart: cc.Button = null;

    private _matchManager: MatchManager = null;

    onLoad() {
        this._matchManager = Game.instance.matchManager;
    }

    onEnable() {
        if (!this._matchManager.hasJoined) {
            this._matchManager.joinMatch();
        }
    }

    startMatch() {
        this._matchManager.startMatch();
    }
}
