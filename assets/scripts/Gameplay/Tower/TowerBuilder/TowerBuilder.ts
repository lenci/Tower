import Tower from "../Tower";
import MatchManager, { MatchPlayer, MatchStatus } from "../../../Framework/MatchManager";
import GameManager from "../../../Framework/GameManager";

const {ccclass, property} = cc._decorator;

export default class TowerBuilder extends cc.Component {

    tower:Tower;
    player:MatchPlayer = null;

    init (player:MatchPlayer) {
        this.player = player;
    }
    
    start () {
        this.tower = this.getComponent(Tower);

        GameManager.instance.matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, this.onMatchStatusChanged, this);
    }

    onMatchStatusChanged(status:MatchStatus) {
        switch (status) {
            case MatchStatus.Playing:
                this.tower.stateMachine.telegram(Tower.MSG_CONSTRUCT);
                break;
                
            case MatchStatus.Over:
                if (true) {
                    this.tower.stateMachine.telegram(Tower.MSG_COMPLETE);
                } else {
                    this.tower.stateMachine.telegram(Tower.MSG_COLLAPSE);
                }
                break;

            default:
        }
    }
}
