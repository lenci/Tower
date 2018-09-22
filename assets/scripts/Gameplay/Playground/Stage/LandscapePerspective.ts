import Utility from "../../../Utilities/Utility";
import Stage from "./Stage";
import StageCameraController from "./StageCameraController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LandscapePerspective extends cc.Component {

    @property(Stage)
    stage: Stage = null;

    @property
    distanceFactor: number = 1;

    init(stage: Stage, distanceFactor: number) {
        this.stage = stage;
        this.distanceFactor = distanceFactor;
    }

    start() {
        this.updatePerspective();
        this.stage.cameraController.node.on(StageCameraController.CAMERA_MOVING, this.updatePerspective, this)
    }

    private updatePerspective() {
        let originalAnchor: cc.Vec2 = this.node.getAnchorPoint();

        Utility.setAnchorX(this.node, 0.5, false);
        Utility.setAnchorY(this.node, this.stage.horizon / this.stage.fullSize.height, false);
        this.node.scale = 1 + (1 / this.stage.cameraController.currentZoomRatio - 1) * (1 - 1 / this.distanceFactor);
        this.node.x = this.stage.cameraController.currentLookAtLocation + (this.stage.fullSize.width / 2 - this.stage.cameraController.currentLookAtLocation) * (1 / this.distanceFactor);
        Utility.setAnchorY(this.node, 0, false);
        this.node.y = this.stage.cameraController.currentLookAtHeight * (1 - 1 / this.distanceFactor);

        Utility.setAnchorX(this.node, originalAnchor.x, false);
        Utility.setAnchorY(this.node, originalAnchor.y, false);
    }
}
