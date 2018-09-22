import Tower from "../Tower";
import { MatchPlayer } from "../../../Framework/MatchManager";

const {ccclass, property} = cc._decorator;

export default class TowerBuilder extends cc.Component {

    tower:Tower;
    player:MatchPlayer = null;

    init (player:MatchPlayer) {
        this.player = player;
    }
    
    start () {
        this.tower = this.getComponent(Tower);
    }
}
