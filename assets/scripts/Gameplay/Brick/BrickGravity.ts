import Brick from "./Brick";
import Game from "../../Framework/Game";
import PlaygroundCollider from "../Playground/PlaygroundCollider";
import TowerFoundation from "../Tower/TowerFoundation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickGravity extends cc.Component {

    @property
    gravityScaleFactor: number = 1;

    private _brick: Brick = null;
    private _rigidbody: cc.RigidBody = null;
    private _collider: PlaygroundCollider = null;

    private _gravityScale: number = 0;

    private _translationDirection: number = 0;
    private _rotationDuration: number = 0;

    private _hasContacted: boolean = false;

    onLoad() {
        this._brick = this.getComponent(Brick);
        this._rigidbody = this.getComponent(cc.RigidBody);
        this._collider = this.getComponent(PlaygroundCollider);
    }

    onEnable() {
        this._gravityScale = this._rigidbody.gravityScale;
        this._rigidbody.gravityScale = 0;

        this._collider.disableBodyCollider();

        this.node.on(Brick.EVT_TRANSLATION_STARTED, this._onTranslationStarted, this);
        this.node.on(Brick.EVT_TRANSLATION_FINISHED, this._onTranslationFinished, this);
        this.node.on(Brick.EVT_ROTATION_STARTED, this._onRotationStarted, this);
        this.node.on(Brick.EVT_ROTATION_FINISHED, this._onRotationFinished, this);
    }

    onDisable() {
        this.node.off(Brick.EVT_TRANSLATION_STARTED, this._onTranslationStarted, this);
        this.node.off(Brick.EVT_TRANSLATION_FINISHED, this._onTranslationFinished, this);
        this.node.off(Brick.EVT_ROTATION_STARTED, this._onRotationStarted, this);
        this.node.off(Brick.EVT_ROTATION_FINISHED, this._onRotationFinished, this);

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

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (this.enabled && !this._hasContacted) {
            this._hasContacted = true;

            let towerFoundation: TowerFoundation = otherCollider.node.getComponent(TowerFoundation);
            let anotherBrick: Brick = otherCollider.node.getComponent(Brick);

            if (null != towerFoundation || null != anotherBrick) {
                this.scheduleOnce(() => {
                    this.node.emit(Brick.EVT_PLACED);
                });
            } else {
                this.scheduleOnce(() => {
                    this.node.emit(Brick.EVT_LOST);
                });
            }
        }
    }

    private _setSensorsEnabledByFallingTransform() {
        if (0 != this._rotationDuration || 0 != (this.node.rotation % 90)) {
            this._collider.enableVertexSensors();
            this._collider.enableEdgeSensors(new cc.Vec2(1, 0));
            this._collider.enableEdgeSensors(new cc.Vec2(-1, 0));
            this._collider.enableEdgeSensors(new cc.Vec2(0, 1));
            this._collider.enableEdgeSensors(new cc.Vec2(0, -1));

        } else {
            this._collider.disableVertexSensors();
            this._collider.disableEdgeSensors(new cc.Vec2(1, 0));
            this._collider.disableEdgeSensors(new cc.Vec2(-1, 0));
            this._collider.disableEdgeSensors(new cc.Vec2(0, 1));
            this._collider.disableEdgeSensors(new cc.Vec2(0, -1));
            let radian: number = this.node.rotation / 180 * Math.PI;
            let fallingDirection: cc.Vec2 = new cc.Vec2(0, -1);
            fallingDirection.x = Math.sin(radian);
            fallingDirection.y = - Math.cos(radian);
            this._collider.enableEdgeSensors(fallingDirection);
            if (0 != this._translationDirection) {
                let translatingDirection: cc.Vec2 = new cc.Vec2(this._translationDirection, 0);
                translatingDirection.x = Math.cos(radian) * this._translationDirection;
                translatingDirection.y = Math.sin(radian) * this._translationDirection;
                this._collider.enableEdgeSensors(translatingDirection);
            }
        }
    }

    private _onTranslationStarted(direction: number) {
        this._translationDirection = direction;
        this._setSensorsEnabledByFallingTransform();
    }

    private _onTranslationFinished() {
        this._translationDirection = 0;
        this._setSensorsEnabledByFallingTransform();
    }

    private _onRotationStarted(direction: number) {
        this._rotationDuration = direction;
        this._setSensorsEnabledByFallingTransform();
    }

    private _onRotationFinished() {
        this._rotationDuration = 0;
        this._setSensorsEnabledByFallingTransform();
    }
}
