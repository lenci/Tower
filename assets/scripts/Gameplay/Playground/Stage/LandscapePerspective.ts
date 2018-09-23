import Utility from "../../../Utilities/Utility";
import Stage from "./Stage";
import StageCameraController from "./StageCameraController";
import Game from "../../../Framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LandscapePerspective extends cc.Component {

    @property
    distanceFactor: number = 1;

    private _stage: Stage = null;
    private _camera: StageCameraController = null;

    start() {
        this._stage = Game.instance.playground.stage;
        this._camera = Game.instance.playground.camera;

        this.updatePerspective();
        this._camera.node.on(StageCameraController.EVT_CAMERA_MOVING, this.updatePerspective, this)
    }

    private updatePerspective() {
        let originalAnchor: cc.Vec2 = this.node.getAnchorPoint();

        let stage

        Utility.setAnchorX(this.node, 0.5, false);
        Utility.setAnchorY(this.node, this._stage.horizon / this._stage.fullSize.height, false);
        this.node.scale = 1 + (1 / this._camera.currentZoomRatio - 1) * (1 - 1 / this.distanceFactor);
        this.node.x = this._camera.currentLookAtLocation + (this._stage.fullSize.width / 2 - this._camera.currentLookAtLocation) * (1 / this.distanceFactor);
        Utility.setAnchorY(this.node, 0, false);
        this.node.y = this._camera.currentLookAtHeight * (1 - 1 / this.distanceFactor);

        Utility.setAnchorX(this.node, originalAnchor.x, false);
        Utility.setAnchorY(this.node, originalAnchor.y, false);
    }
}
