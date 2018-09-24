import TowerBuilder from "./TowerBuilder";
import Tower from "../Tower";
import Game from "../../../Framework/Game";
import MatchManager, { MatchStatus } from "../../../Framework/MatchManager";
import Brick from "../../Brick/Brick";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalPlayerTowerBuilder extends TowerBuilder {

    onEnable() {
        super.onEnable();

        if (null == this._tower.nextBrick) {
            this._tower.generateNextBrick();
        }

        if (null == this._tower.currentBrick) {
            this.dropBrickAndGenerateNext();
        }
    }

    onDisable() {
        super.onDisable();
    }

    dropBrickAndGenerateNext() {
        this._tower.dropBrick();
        this._tower.generateNextBrick();

        this._tower.currentBrick.node.once(Brick.EVT_PLACED, this.dropBrickAndGenerateNext, this);
        this._tower.currentBrick.node.once(Brick.EVT_LOST, this.dropBrickAndGenerateNext, this);
    }
    
    translateBrick(direction:number) {
    }

    rotateBrick(direction:number) {
        
    }
}
