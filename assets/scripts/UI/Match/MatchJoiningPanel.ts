import Game from "../../Framework/Game";
import MatchManager, { MatchStatus, MatchPlayer } from "../../Framework/MatchManager";
import View from "../../Framework/UI/View";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchJoiningPanel extends View {

    @property(cc.Button)
    btnJoin: cc.Button = null;

    @property(cc.Button)
    btnRetire: cc.Button = null;

    private _matchManager: MatchManager = null;

    onShow() {
        super.onShow();

        this._matchManager = Game.instance.matchManager;

        this._refreshUI();
        this._matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, this._refreshUI, this);
        this._matchManager.node.on(MatchManager.EVT_PLAYER_RETIRED, this._refreshUI, this);
    }

    onHide() {
        this._matchManager.node.off(MatchManager.EVT_PLAYER_JOINED, this._refreshUI, this);
        this._matchManager.node.off(MatchManager.EVT_PLAYER_RETIRED, this._refreshUI, this);

        super.onHide();
    }

    private _refreshUI() {
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
