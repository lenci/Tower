import MatchManager from "../../Framework/MatchManager";
import GameManager from "../../Framework/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchStartingPanel extends cc.Component {

    @property(cc.Button)
    btnStart: cc.Button = null;

    private _matchManager: MatchManager = null;

    onLoad() {
        this._matchManager = GameManager.instance.matchManager;
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
