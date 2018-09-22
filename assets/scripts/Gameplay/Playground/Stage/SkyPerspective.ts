import Utility from "../../../Utilities/Utility";
import Stage from "./Stage";
import StageCameraController from "./StageCameraController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkyPerspective extends cc.Component {

    @property(Stage)
    stage: Stage = null;

    @property
    distanceFactor: number = 1;

    private originalPosition: cc.Vec2 = null;

    init(stage: Stage) {
        this.stage = stage;
    }

    start() {
        this.updatePerspective();
        this.stage.cameraController.node.on(StageCameraController.CAMERA_MOVING, this.updatePerspective, this)
    }

    private updatePerspective() {
        if (null == this.stage) {
            return;
        }

        let originalAnchor: cc.Vec2 = this.node.getAnchorPoint();

        Utility.setAnchorX(this.node, 0.5, false);
        Utility.setAnchorY(this.node, this.stage.canvas.designResolution.height / this.stage.fullSize.height, false);
        this.node.scale = 1 / this.stage.cameraController.currentZoomRatio;

        this.node.x = this.stage.cameraController.currentLookAtLocation;

        this.node.y = this.stage.canvas.designResolution.height / 2 * (1 + 1 / this.stage.cameraController.currentZoomRatio) + this.stage.cameraController.currentLookAtHeight;
        
        this.node.y += this.stage.canvas.designResolution.height / 2 * (1 - this.stage.cameraController.currentZoomRatio) * this.node.scale * 0.3;

        Utility.setAnchorX(this.node, originalAnchor.x, false);
        Utility.setAnchorY(this.node, originalAnchor.y, false);
    }
}
