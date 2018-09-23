import Tower from "../Tower/Tower"
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickQueueingState from "./BrickStates/BrickQueueingState";
import BrickFallingState from "./BrickStates/BrickFallingState";
import BrickPlacedState from "./BrickStates/BrickPlacedState";
import BrickLostState from "./BrickStates/BrickLostState";
import BrickInitialState from "./BrickStates/BrickInitialState";

const { ccclass, property } = cc._decorator;

export enum BrickShape {
    NONE,
    TetrominoI,
    TetrominoJ,
    TetrominoL,
    TetrominoO,
    TetrominoS,
    TetrominoT,
    TetrominoZ
};

@ccclass
export default class Brick extends cc.Component {

    static EVT_QUEUEING_STARTED:string = "queueing started";
    static EVT_FALLING_STARTED:string = "falling started";
    static EVT_PLACED:string = "placed";
    static EVT_LOST:string = "lost";

    @property({
        type: cc.Enum(BrickShape)
    })
    shape: BrickShape = BrickShape.NONE;

    id: number = -1;
    tower: Tower = null;

    private _collider: cc.PhysicsPolygonCollider = null;
    private _rigidbody: cc.RigidBody = null;

    stateMachine: FiniteStateMachine = null;
    static InitialState:BrickInitialState = new BrickInitialState();
    static QueueState:BrickQueueingState = new BrickQueueingState();
    static FallingState:BrickFallingState = new BrickFallingState();
    static PlacedState:BrickPlacedState = new BrickPlacedState();
    static LostState:BrickLostState = new BrickLostState();
    static MSG_TRANSLATE:string = "translate";
    static MSG_ROTATE:string = "rotate";
    static MSG_QUEUE:string = "queue";
    static MSG_FALL:string = "fall";
    static MSG_PLACE:string = "place";
    static MSG_LOSE:string = "lose";

    onLoad() {
        this._collider = this.getComponent(cc.PhysicsPolygonCollider);
        this._rigidbody = this.getComponent(cc.RigidBody);

        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.owner = this;

        this.stateMachine.changeState(Brick.InitialState);
    }

    init(tower: Tower, id: number) {
        this.tower = tower;
        this.id = id;
    }

    queue() {
        this.node.emit(Brick.EVT_QUEUEING_STARTED);
    }

    fall() {
        this.node.emit(Brick.EVT_FALLING_STARTED);
    }

    place() {
        this.node.emit(Brick.EVT_PLACED);
    }

    lose() {
        this.node.emit(Brick.EVT_LOST);
    }

    magic () {
    }

    syncPosition(position: cc.Vec2) {
        this.node.setPosition(position);
    }

    syncRotation(rotation: number) {
        this.node.setRotation(rotation);
    }
}
