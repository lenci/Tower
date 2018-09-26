import Playground from "../Playground/Playground";
import Brick from "./Brick";
import BrickGravity from "./BrickGravity";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickOperator extends cc.Component {

    private _brick: Brick = null;

    private _translator: cc.ActionInterval = null;
    private _rotator: cc.ActionInterval = null;

    onLoad() {
        this._brick = this.getComponent(Brick);
    }

    onDisable() {
        if (null != this._translator) {
            this.node.stopAction(this._translator);
            this._translator = null;
        }
        if (null != this._rotator) {
            this.node.stopAction(this._rotator);
            this._rotator = null;
        }
    }

    translate(direction: number) {
        if (null != this._translator) {
            this.node.stopAction(this._translator);
            this._translator = null;
        }

        let x: number = Math.round(this.node.x / (Playground.GRID / 2) + direction / Math.abs(direction)) * (Playground.GRID / 2);
        this._translator = cc.moveBy(0.1, new cc.Vec2(x - this.node.x, 0));
        this._translator.easing(cc.easeCubicActionInOut());
        this._translator = cc.sequence([this._translator, cc.callFunc((() => {
            this._translator = null;
            this._brick.node.emit(Brick.EVT_TRANSLATION_FINISHED);
        }))]);
        this.node.runAction(this._translator);

        this._brick.node.emit(Brick.EVT_TRANSLATION_STARTED, direction);
    }

    rotate(direction: number) {
        if (null != this._rotator) {
            this.node.stopAction(this._rotator);
            this._rotator = null;
        }

        let ratation: number = Math.round(this.node.rotation / 90 + direction / Math.abs(direction)) * 90;
        this._rotator = cc.rotateBy(0.1, ratation - this.node.rotation);
        this._rotator.easing(cc.easeCubicActionInOut());
        this._rotator = cc.sequence([this._rotator, cc.callFunc(() => {
            this._rotator = null;
            this._brick.node.emit(Brick.EVT_ROTATION_FINISHED);
        })]);
        this.node.runAction(this._rotator);

        this._brick.node.emit(Brick.EVT_ROTATION_STARTED, direction);
    }

    accelerateGravity() {
        let gravity: BrickGravity = this.getComponent(BrickGravity);
        if (null != gravity) {
            gravity.gravityScaleFactor = 6;
        }
    }

    normalizeGravity() {
        let gravity: BrickGravity = this.getComponent(BrickGravity);
        if (null != gravity) {
            gravity.gravityScaleFactor = 1;
        }
    }
}
