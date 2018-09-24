import Tower from "../Tower";
import MatchManager, { MatchPlayer, MatchStatus } from "../../../Framework/MatchManager";
import Game from "../../../Framework/GameManager";

const { ccclass, property } = cc._decorator;

export default class TowerBuilder extends cc.Component {

    public player:MatchPlayer;

    protected _tower: Tower = null;

    onLoad() {
        this._tower = this.getComponent(Tower);
    }

    start() {
        Game.instance.matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, this.onMatchStatusChanged, this);
    }

    onEnable() {
    }

    onDisable() {
    }

    onMatchStatusChanged(status: MatchStatus) {
        switch (status) {
            case MatchStatus.Playing:
                this._tower.stateMachine.telegram(Tower.MSG_CONSTRUCT);
                break;

            case MatchStatus.Over:
                if (true) {
                    this._tower.stateMachine.telegram(Tower.MSG_COMPLETE);
                } else {
                    this._tower.stateMachine.telegram(Tower.MSG_COLLAPSE);
                }
                break;

            default:
        }
    }
}
