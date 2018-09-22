import Tower from "../Tower/Tower"
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickQueueingState from "./BrickStates/BrickQueneingState";
import BrickFallingState from "./BrickStates/BrickFallingState";
import BrickPlacedState from "./BrickStates/BrickPlacedState";
import BrickLostState from "./BrickStates/BrickLostState";

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

    static MSG_PLACED:string = "placed";
    static MSG_LOST:string = "lost";

    @property({
        type: cc.Enum(BrickShape)
    })
    shape: BrickShape = BrickShape.NONE;

    id: number = -1;
    tower: Tower = null;

    private collider: cc.PhysicsPolygonCollider = null;
    private rigidbody: cc.RigidBody = null;

    private stateMachine: FiniteStateMachine = null;
    static QueueState:BrickQueueingState = new BrickQueueingState();
    static FallingState:BrickFallingState = new BrickFallingState();
    static PlacedState:BrickPlacedState = new BrickPlacedState();
    static LostState:BrickLostState = new BrickLostState();

    start() {
        this.collider = this.getComponent(cc.PhysicsPolygonCollider);
        this.rigidbody = this.getComponent(cc.RigidBody);

        this.stateMachine = this.getComponent(FiniteStateMachine);
    }

    init(tower: Tower, id: number, rotation: number, scale: number) {
        this.tower = tower;
        this.id = id;

        if (tower.isNetworkClone) {
            this.node.removeComponent(this.collider);
            this.collider = null;
            this.node.removeComponent(this.rigidbody);
            this.rigidbody = null;
        }
    }

    queue() {
        this.stateMachine.telegram("QUEUE");
    }

    fall() {
        this.stateMachine.telegram("FALL");
    }

    place() {
        this.stateMachine.telegram("PLACE");
    }

    ground() {

    }

    magic () {
    }

    translate(direction: number) {
        this.stateMachine.telegram("TRANSLATE", direction);
        // this.node.setPosition(this.node.position.add(new cc.Vec2(100 * direction, 0)));
    }

    rotate(direction: number) {
        this.stateMachine.telegram("ROTATE", direction);
        // this.node.setRotation(this.node.rotation + 90 * direction);
    }

    syncPosition(position: cc.Vec2) {
        this.node.setPosition(position);
    }

    syncRotation(rotation: number) {
        this.node.setRotation(rotation);
    }
}
