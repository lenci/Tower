import Tower from "../Tower";
import MatchManager, { MatchPlayer, MatchStatus } from "../../../Framework/MatchManager";
import Game from "../../../Framework/Game";

const { ccclass, property } = cc._decorator;

export default class TowerBuilder extends cc.Component {

    public player:MatchPlayer;

    protected _tower: Tower = null;

    onLoad() {
        this._tower = this.getComponent(Tower);
    }

    onEnable() {
    }

    onDisable() {
        this._tower.clearNextBrick();
    }
}
