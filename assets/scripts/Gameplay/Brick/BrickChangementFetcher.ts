import Brick from "./Brick";
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Tower from "../Tower/Tower";
import TowerBricksChanngementsNetReporter from "../Tower/TowerBricksChangementsNetReporter";

export enum BrickState {
    NONE,
    QUEUEING,
    FALLING,
    PLACED,
    LOST,
};

export class BrickChangement {

    brickId: number;

    hasPositionChanged = false;
    newPosition = new cc.Vec2(0, 0);
    hasRotationChanged = false;
    newRotation = 0;
    
    hasStateChanged = false;
    newState = BrickState.NONE;
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class BrickChangementFecther extends cc.Component {

    private _brick:Brick = null;
    private _reporter:TowerBricksChanngementsNetReporter = null;

    private _previousPosition: cc.Vec2 = new cc.Vec2(0, 0);
    private _previousRotation: number = 0;

    onLoad() {
        this._brick = this.getComponent(Brick);
        this._reporter = this._brick.tower.getComponent(TowerBricksChanngementsNetReporter);
    }

    start () {
        this._previousPosition = this.node.position;
        this._previousRotation = this.node.rotation;
    }

    fetchBrickChangements (changement:BrickChangement) {
        changement.hasPositionChanged = this._previousPosition.sub(this.node.position).magSqr() > 1e-5;
        if (changement.hasPositionChanged) {
            this._previousPosition = changement.newPosition = this.node.position;
        }

        changement.hasRotationChanged = Math.abs(this._previousRotation - this.node.rotation) > 1e-5;
        if (changement.hasRotationChanged) {
            this._previousRotation = changement.newRotation = this.node.rotation;
        }
    }
}
