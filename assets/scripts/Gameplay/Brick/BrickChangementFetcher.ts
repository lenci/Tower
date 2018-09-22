import Brick from "./Brick";
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";

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

    stateMachine:FiniteStateMachine = null;

    private _previousPosition: cc.Vec2 = new cc.Vec2(0, 0);
    private _previousRotation: number = 0;
    private _previousState:BrickState = BrickState.NONE;

    start () {
        this.stateMachine = this.getComponent(FiniteStateMachine);
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

        changement.hasStateChanged = this._previousState != this.getBrickState();
        if (changement.hasStateChanged) {
            this._previousState = changement.newState = this.getBrickState();
        }
    }

    private getBrickState(): BrickState {
        if (Brick.QueueState == this.stateMachine.currentState) {
            return BrickState.QUEUEING;
        }
        if (Brick.FallingState == this.stateMachine.currentState) {
            return BrickState.FALLING;
        }
        if (Brick.PlacedState == this.stateMachine.currentState) {
            return BrickState.PLACED;
        }
        if (Brick.LostState == this.stateMachine.currentState) {
            return BrickState.LOST;
        }

        return BrickState.NONE;
    }
}
