import TowerBuilder from "./TowerBuilder";
import Tower from "../Tower";
import Game from "../../../Framework/GameManager";
import MatchManager, { MatchStatus } from "../../../Framework/MatchManager";
import Brick from "../../Brick/Brick";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalPlayerTowerBuilder extends TowerBuilder {

    onEnable() {
        super.onEnable();
    }

    onDisable() {
        super.onDisable();
    }

    onMatchStatusChanged(status: MatchStatus) {
        super.onMatchStatusChanged(status);

        if (MatchStatus.Playing == status) {
            this._tower.generateNextBrick();
            // this.dropBrickAndGenerateNext();
        }
    }

    dropBrickAndGenerateNext() {
        this._tower.dropBrick();
        this._tower.generateNextBrick();

        // this._tower.currentBrick.node.on()

    }
    
    translateBrick(direction:number) {
    }

    rotateBrick(direction:number) {
        
    }
}
