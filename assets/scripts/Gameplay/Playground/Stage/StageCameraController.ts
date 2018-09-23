import Stage from "./Stage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageCameraController extends cc.Component {

    static EVT_CAMERA_MOVING: string = "camera moving";

    @property(Stage)
    stage: Stage = null;

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    camera: cc.Camera = null;

    private _targetLookAtLocation: number = 0;
    private _targetLookAtHeight: number = 0;
    private _targetZoomRatio: number = 1;

    private _previousLookAtLocation: number = 0;
    private _previousLookAtHeight: number = 0;
    private _previousZoomRatio: number = 1;

    start() {
        this.camera = this.getComponent(cc.Camera);

        this._targetLookAtLocation = this.currentLookAtLocation;
        this._targetLookAtHeight = this.currentLookAtHeight;
        this._targetZoomRatio = this.currentZoomRatio;

        this._previousLookAtLocation = this.currentLookAtLocation;
        this._previousLookAtHeight = this.currentLookAtHeight;
        this._previousZoomRatio = this.currentZoomRatio;
    }

    lookAtLocation(location: number, duration: number = 0, ease = null) {
        if (null == ease) {
            ease = cc.easeCubicActionInOut();
        }

        this.camera.node.stopActionByTag(1);

        if (duration > 0) {
            let cameraHorizontalMover: cc.ActionInterval = cc.moveTo(duration, new cc.Vec2(location - this.canvas.designResolution.width / 2, this.camera.node.y));
            cameraHorizontalMover.easing(ease);
            cameraHorizontalMover.setTag(1);
            this.camera.node.runAction(cameraHorizontalMover);
        } else {
            this.camera.node.x = location - this.canvas.designResolution.width / 2;
        }


        this._targetLookAtLocation = location;
    }

    get currentLookAtLocation(): number {
        return this.camera.node.x + this.canvas.designResolution.width / 2;
    }

    lookAtHeight(height: number, duration: number = 0, ease = null) {
        if (height < 0) {
            height = 0;
        }

        if (null == ease) {
            ease = cc.easeCubicActionInOut();
        }

        this.camera.node.stopActionByTag(2);

        if (duration > 0) {
            let cameraVerticalMover: cc.ActionInterval = cc.moveTo(duration, new cc.Vec2(this.camera.node.x, height));
            cameraVerticalMover.easing(ease);
            cameraVerticalMover.setTag(2);
            this.camera.node.runAction(cameraVerticalMover);
        } else {
            this.camera.node.y = height;
        }

        this._targetLookAtHeight = height;
    }

    get currentLookAtHeight(): number {
        return this.camera.node.y;
    }

    zoom(zoomRatio: number, duration: number = 0, ease = null) {
        if (null == ease) {
            ease = cc.easeCubicActionInOut();
        }

        this.camera.node.stopActionByTag(3);

        if (duration > 0) {
            let cameraZoomer: cc.ActionInterval = cc.scaleTo(duration, zoomRatio, this.camera.node.scaleX);
            cameraZoomer.easing(ease);
            cameraZoomer.setTag(3);
            this.camera.node.runAction(cameraZoomer);
        } else {
            this.camera.node.scaleX = zoomRatio;
        }

        this._targetZoomRatio = zoomRatio;
    }

    get currentZoomRatio(): number {
        return this.camera.node.scaleX;
    }

    update(delta: number) {
        this.camera.zoomRatio = this.camera.node.scaleX;

        if (Math.abs(this._previousLookAtLocation - this.currentLookAtLocation) > 1e-5 ||
            Math.abs(this._previousLookAtHeight - this.currentLookAtHeight) > 1e-5 ||
            Math.abs(this._previousZoomRatio - this.currentZoomRatio) > 1e-5) {

            this.node.emit(StageCameraController.EVT_CAMERA_MOVING);

            this._previousLookAtLocation = this.currentLookAtLocation;
            this._previousLookAtHeight = this.currentLookAtHeight;
            this._previousZoomRatio = this.currentZoomRatio;
        }
    }
}
