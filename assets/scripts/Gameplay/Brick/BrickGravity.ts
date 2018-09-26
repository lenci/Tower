import Brick from "./Brick";
import TowerFoundation from "../Tower/TowerFoundation";
import Game from "../../Framework/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickGravity extends cc.Component {

    @property
    gravityScale: number = 1;

    private _brick: Brick = null;

    private _hasContacted: boolean = false;

    onLoad() {
        // this._brick = this.getComponent(Brick);
    }

    onEnable() {
        // this._brick.rigidbody.gravityScale = 0;
        this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, -100);

    }

    onDisable() {
        // this._brick.rigidbody.gravityScale = 1;
    }

    update() {
        // this._brick.rigidbody.linearVelocity = new cc.Vec2(0, -Game.instance.playground.gravity * this.gravityScale);
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
