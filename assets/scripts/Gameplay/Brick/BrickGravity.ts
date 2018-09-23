import Playground from "../Playground/Playground";
import Brick from "./Brick";
import TowerFoundation from "../Tower/TowerFoundation";
import Game from "../../Framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickGravity extends cc.Component {

    static MSG_TOUCHING_TOWER:string = "touchinng tower";
    static MSG_TOUCHING_OTHER:string = "touching other"

    @property
    gravityScale: number = 1;

    onEnable() {
        this.getComponent(cc.RigidBody).gravityScale = 0;
    }

    onDisable() {
        this.getComponent(cc.RigidBody).gravityScale = this.gravityScale;
    }

    update(delta) {
        this.node.y -= delta * Game.instance.playground.gravity * this.gravityScale;
    }

    onBeginContact(contact:cc.PhysicsContact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider) {
        if (null != otherCollider.node.getComponent(Brick) || null != otherCollider.node.getComponent(TowerFoundation)) {
            this.node.emit(BrickGravity.MSG_TOUCHING_TOWER);
        } else {
            this.node.emit(BrickGravity.MSG_TOUCHING_OTHER);
        }
    }
    
}
