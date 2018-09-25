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
        this._brick = this.getComponent(Brick);
    }

    onEnable() {
        this._brick.rigidbody.gravityScale = 0;
    }

    onDisable() {
        this._brick.rigidbody.gravityScale = 1;
    }

    update() {
        this._brick.rigidbody.linearVelocity = new cc.Vec2(0, -Game.instance.playground.gravity * this.gravityScale);
        // this._brick.rigidbody.an
    }

    onPreSolve(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.enabled && !this._hasContacted) {
            cc.log(contact.getWorldManifold().normal);
            cc.log(contact.getWorldManifold().normal.cross(this._brick.rigidbody.linearVelocity.normalize()));

            if (0 == contact.getWorldManifold().normal.cross(this._brick.rigidbody.linearVelocity.normalize())) {
                contact.disabledOnce = true;
            } else {
                this.scheduleOnce(() => {
                    if (null != otherCollider.node.getComponent(Brick) || null != otherCollider.node.getComponent(TowerFoundation)) {
                        this.node.emit(Brick.EVT_PLACED);
                    } else {
                        this.node.emit(Brick.EVT_LOST);
                    }
                });

                this._hasContacted = true;
            }
        }
    }
}
