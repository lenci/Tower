import Tower from "../Tower/Tower"
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickQueueingState from "./BrickStates/BrickQueueingState";
import BrickFallingState from "./BrickStates/BrickFallingState";
import BrickPlacedState from "./BrickStates/BrickPlacedState";
import BrickLostState from "./BrickStates/BrickLostState";
import BrickInitialState from "./BrickStates/BrickInitialState";
import BrickGravity from "./BrickGravity";
import Playground from "../Playground/Playground";

const { ccclass, property } = cc._decorator;

export enum BrickShape {
    NONE = -2,
    TetrominoI = 0,
    TetrominoJ,
    TetrominoL,
    TetrominoO,
    TetrominoS,
    TetrominoT,
    TetrominoZ
};

@ccclass
export default class Brick extends cc.Component {

    static EVT_QUEUEING_STARTED: string = "queueing started";
    static EVT_FALLING_STARTED: string = "falling started";
    static EVT_PLACED: string = "placed";
    static EVT_LOST: string = "lost";

    @property({
        type: cc.Enum(BrickShape)
    })
    shape: BrickShape = BrickShape.NONE;

    @property(cc.Sprite)
    display: cc.Sprite = null;

    id: number = -1;
    tower: Tower = null;

    gravity: BrickGravity = null;

    collider: cc.PhysicsPolygonCollider = null;
    rigidbody: cc.RigidBody = null;

    stateMachine: FiniteStateMachine = null;
    static InitialState: BrickInitialState = new BrickInitialState();
    static QueueState: BrickQueueingState = new BrickQueueingState();
    static FallingState: BrickFallingState = new BrickFallingState();
    static PlacedState: BrickPlacedState = new BrickPlacedState();
    static LostState: BrickLostState = new BrickLostState();
    static MSG_QUEUE: string = "queue";
    static MSG_FALL: string = "fall";
    static MSG_PLACE: string = "place";
    static MSG_LOSE: string = "lose";

    onLoad() {
        this.gravity = this.getComponent(BrickGravity);

        this.collider = this.getComponent(cc.PhysicsPolygonCollider);
        this.rigidbody = this.getComponent(cc.RigidBody);

        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.owner = this;

        this.collider.points.forEach(point => {
            if (Math.abs(point.x) > 1) {
                point.x = point.x - 1 * point.x / Math.abs(point.x);
            }
            if (Math.abs(point.y) > 1) {
                point.y = point.y - 1 * point.y / Math.abs(point.y);
            }
        });
        this.collider.apply();

        this.stateMachine.changeState(Brick.InitialState);
    }

    translate(direction: number) {
        this.node.stopActionByTag(1);

        let x: number = Math.round(this.node.x / Playground.GRID + direction / Math.abs(direction)) * Playground.GRID;
        let mover: cc.ActionInterval = cc.moveBy(0.1, new cc.Vec2(x - this.node.x, 0));
        mover.easing(cc.easeCubicActionInOut());
        mover.setTag(1);
        this.node.runAction(mover);
    }

    rotate(direction: number) {
        this.node.stopActionByTag(2);

        let ratation: number = Math.round(this.node.rotation / 90 + direction / Math.abs(direction)) * 90;
        let rotater: cc.ActionInterval = cc.rotateBy(0.1, ratation - this.node.rotation);
        rotater.easing(cc.easeCubicActionInOut());
        rotater.setTag(2);
        this.node.runAction(rotater);
    }

    accelerateGravity() {
        this.gravity.gravityScale = 3;
    }

    normalizeGravity() {
        this.gravity.gravityScale = 1;
    }

    get isAlignedToGrid(): boolean {
        let f: number = this.node.x / Playground.GRID;
        if (Math.abs(f - Math.round(f)) > 1 / Playground.GRID) {
            return false;
        }

        f = (this.node.y - this.tower.foundation.height) / Playground.GRID;
        if (Math.abs(f - Math.round(f)) > 1 / Playground.GRID) {
            return false;
        }

        f = this.node.rotation / 90;
        if (Math.abs(f - Math.round(f)) > 0.5 / 90) {
            return false;
        }

        return true;
    }

    setTransformToAlignToGrid(): boolean {
        if (!this.isAlignedToGrid) {
            return false;
        }

        this.node.x = Math.round(this.node.x / Playground.GRID) * Playground.GRID;
        this.node.y = Math.round((this.node.y - this.tower.foundation.height) / Playground.GRID) * Playground.GRID + this.tower.foundation.height;
        this.node.rotation = Math.round(this.node.rotation / 90) * 90;
    }

    magic() {
    }

    syncPosition(position: cc.Vec2) {
        this.node.setPosition(position);
    }

    syncRotation(rotation: number) {
        this.node.setRotation(rotation);
    }
}
