import Utility from "../../../Utilities/Utility";
import Stage from "./Stage";
import StageCameraController from "./StageCameraController";
import Game from "../../../Framework/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkyPerspective extends cc.Component {

    @property
    distanceFactor: number = 1;

    private _stage: Stage = null;
    private _camera: StageCameraController = null;
    private _canvas: cc.Canvas = null;

    start() {
        this._stage = Game.instance.playground.stage;
        this._camera = Game.instance.playground.camera;
        this._canvas = Game.instance.playground.canvas;
        
        this._updatePerspective();
        this._camera.node.on(StageCameraController.EVT_CAMERA_MOVING, this._updatePerspective, this)
    }

    private _updatePerspective() {
        let originalAnchor: cc.Vec2 = this.node.getAnchorPoint();

        Utility.setAnchorX(this.node, 0.5, false);
        Utility.setAnchorY(this.node, this._canvas.designResolution.height / this._stage.fullSize.height, false);
        this.node.scale = 1 / this._camera.currentZoomRatio;

        this.node.x = this._camera.currentLookAtLocation;

        this.node.y = this._canvas.designResolution.height / 2 * (1 + 1 / this._camera.currentZoomRatio) + this._camera.currentLookAtHeight;
        
        this.node.y += this._canvas.designResolution.height / 2 * (1 - this._camera.currentZoomRatio) * this.node.scale * 0.3;

        Utility.setAnchorX(this.node, originalAnchor.x, false);
        Utility.setAnchorY(this.node, originalAnchor.y, false);
    }
}
