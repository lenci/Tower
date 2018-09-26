import Brick from "./Brick";
import Game from "../../Framework/Game";
import PlaygroundCollider from "../Playground/PlaygroundCollider";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickGravity extends cc.Component {

    @property
    gravityScaleFactor: number = 1;

    private _brick: Brick = null;
    private _rigidbody: cc.RigidBody = null;
    private _collider: PlaygroundCollider = null;

    private _gravityScale: number = 0;

    onLoad() {
        this._brick = this.getComponent(Brick);
        this._rigidbody = this.getComponent(cc.RigidBody);
        this._collider = this.getComponent(PlaygroundCollider);
    }

    onEnable() {
        this._gravityScale = this._rigidbody.gravityScale;
        this._rigidbody.gravityScale = 0;

        this._collider.disableBodyCollider();
    }

    onDisable() {
        this._collider.disableVertexSensors();
        this._collider.disableEdgeSensors(new cc.Vec2(1, 0));
        this._collider.disableEdgeSensors(new cc.Vec2(-1, 0));
        this._collider.disableEdgeSensors(new cc.Vec2(0, 1));
        this._collider.disableEdgeSensors(new cc.Vec2(0, -1));
        this._collider.enableBodyCollider();

        this._rigidbody.gravityScale = this._gravityScale;
    }

    start() {
        this._setSensorsEnabledByFallingTransform();
    }

    update(delta: number) {
        this.node.y -= Game.instance.playground.gravity * this._gravityScale * this.gravityScaleFactor * delta;
    }

    private _setSensorsEnabledByFallingTransform() {

    }

    // onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
    //     if (this.enabled && !this._hasContacted) {
    //         let towerFoundation: TowerFoundation = otherCollider.node.getComponent(TowerFoundation);
    //         let anotherBrick: Brick = otherCollider.node.getComponent(Brick);

    //         if (null != towerFoundation || null != anotherBrick) {

    //             if (null != towerFoundation || (null != anotherBrick && anotherBrick.isAlignedToGrid)) {

    //                 cc.log(contact.getWorldManifold().normal.cross(this._brick.rigidbody.linearVelocity.normalize()));
    //                 if (0 == contact.getWorldManifold().normal.cross(this._brick.rigidbody.linearVelocity.normalize())) {
    //                     contact.disabledOnce = true;

    //                 } else {
    //                     if (this._brick.isAlignedToGrid) {
    //                         this._brick.setTransformToAlignToGrid();
    //                         contact.disabledOnce = true;
    //                     }

    //                     this.scheduleOnce(() => {
    //                         this.node.emit(Brick.EVT_PLACED);
    //                     });
    //                     this._hasContacted = true;
    //                 }

    //             } else {
    //                 this.scheduleOnce(() => {
    //                     this.node.emit(Brick.EVT_PLACED);
    //                 });
    //                 this._hasContacted = true;
    //             }

    //         } else {
    //             this.scheduleOnce(() => {
    //                 this.node.emit(Brick.EVT_LOST);
    //             });
    //             this._hasContacted = true;
    //         }
    //     }
    // }
}
