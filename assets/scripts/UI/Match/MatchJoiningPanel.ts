import GameManager from "../../Framework/GameManager";
import MatchManager, { MatchStatus, MatchPlayer } from "../../Framework/MatchManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchJoiningPanel extends cc.Component {

    @property(cc.Button)
    btnJoin: cc.Button = null;

    @property(cc.Button)
    btnRetire: cc.Button = null;

    private _matchManager: MatchManager = null;

    onLoad() {
        this._matchManager = GameManager.instance.matchManager;
    }

    onEnable() {
        this.btnJoin.node.active = !this._matchManager.hasJoined;
        this.btnRetire.node.active = this._matchManager.hasJoined;
        this._matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, this.refreshUI, this);
        this._matchManager.node.on(MatchManager.EVT_PLAYER_RETIRED, this.refreshUI, this);
    }

    onDisable() {
        this._matchManager.node.off(MatchManager.EVT_PLAYER_JOINED, this.refreshUI, this);
        this._matchManager.node.off(MatchManager.EVT_PLAYER_RETIRED, this.refreshUI, this);
    }

    private refreshUI() {
        this.btnJoin.node.active = !this._matchManager.hasJoined && this._matchManager.playerCount < this._matchManager.maxPlayerCount;
        this.btnRetire.node.active = this._matchManager.hasJoined;
    }

    joinMatch() {
        this._matchManager.joinMatch();
    }

    retireFromMatch() {
        this._matchManager.retireFromMatch();
    }
}
