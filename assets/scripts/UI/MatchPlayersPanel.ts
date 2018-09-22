import GameManager from "../Framework/GameManager";
import MatchManager, { MatchPlayer } from "../Framework/MatchManager";
import StageCameraController from "../Gameplay/Playground/Stage/StageCameraController";
import Stage from "../Gameplay/Playground/Stage/Stage";
import MatchPlayerItemUI from "./MatchPlayerItemUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayersPanel extends cc.Component {

    @property(cc.Prefab)
    playerUIPrefab: cc.Prefab = null;

    private playerItemUIs: { [key: string]: MatchPlayerItemUI } = {};

    private stage: Stage = null;

    start() {
        GameManager.instance.matchManager.node.on(MatchManager.PLAYER_JOINED, this.createPlayerUI, this);
        GameManager.instance.matchManager.node.on(MatchManager.PLAYER_LEFT, this.destroyPlayerUI, this);

        this.stage = GameManager.instance.playground.stage;
        this.updatePosition();
        this.stage.cameraController.node.on(StageCameraController.CAMERA_MOVING, this.updatePosition, this);
    }

    private createPlayerUI(player: MatchPlayer): MatchPlayerItemUI {
        if (null == this.playerItemUIs[player.playerId]) {
            let ui: cc.Node = cc.instantiate(this.playerUIPrefab);
            this.node.addChild(ui);

            let playerItemUI: MatchPlayerItemUI = ui.getComponent(MatchPlayerItemUI);
            playerItemUI.init(player);
            this.updatePlayerUIPosition(playerItemUI);

            this.playerItemUIs[player.playerId] = playerItemUI;
        }

        return this.playerItemUIs[player.playerId];
    }

    private destroyPlayerUI(player: MatchPlayer) {
        if (null != this.playerItemUIs[player.playerId]) {
            this.playerItemUIs[player.playerId].node.destroy();
            this.playerItemUIs[player.playerId] = null;
        }
    }

    private updatePosition() {
        let position: cc.Vec2 = new cc.Vec2(0, 0);
        position.y = (1 - this.stage.cameraController.currentZoomRatio) * this.stage.canvas.designResolution.height / 2;
        position = this.node.parent.convertToNodeSpaceAR(this.stage.node.convertToWorldSpaceAR(position));

        this.node.y = position.y;

        for (let key in this.playerItemUIs) {
            this.updatePlayerUIPosition(this.playerItemUIs[key]);
        }
    }

    private updatePlayerUIPosition(playerItemUI: MatchPlayerItemUI) {
        let position: cc.Vec2 = new cc.Vec2(0, 0);

        position.x = this.stage.canvas.designResolution.width / 2 + (this.stage.playerStartPositions[playerItemUI.player.towerIndex].x - this.stage.cameraController.currentLookAtLocation) * this.stage.cameraController.currentZoomRatio;
        position.y = this.stage.canvas.designResolution.height / 2 * (1 - this.stage.cameraController.currentZoomRatio);

        playerItemUI.node.setPosition(this.node.convertToNodeSpaceAR(this.stage.node.convertToWorldSpaceAR(position)));
    }
}
