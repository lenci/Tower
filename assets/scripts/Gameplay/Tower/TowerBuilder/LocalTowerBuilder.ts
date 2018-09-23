import TowerBuilder from "./TowerBuilder";
import Tower from "../Tower";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalPlayerTowerBuilder extends TowerBuilder {

    start() {
        super.start();
    }

    translateBrick(direction:number) {
        this.tower.stateMachine.telegram(Tower.MSG_TRANSLATE_BRICK, direction);
    }

    rotateBrick(direction:number) {
        this.tower.stateMachine.telegram(Tower.MSG_ROTATE_BRICK, direction);
    }
}
