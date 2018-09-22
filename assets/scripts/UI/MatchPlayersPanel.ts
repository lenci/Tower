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

    private _playerItemUIs: { [key: string]: MatchPlayerItemUI } = {};

    private _stage: Stage = null;

    start() {
        GameManager.instance.matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, this.createPlayerUI, this);
        GameManager.instance.matchManager.node.on(MatchManager.EVT_PLAYER_LEFT, this.destroyPlayerUI, this);

        this._stage = GameManager.instance.playground.stage;
        this.updatePosition();
        this._stage.cameraController.node.on(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);
    }

    private createPlayerUI(player: MatchPlayer): MatchPlayerItemUI {
        if (null == this._playerItemUIs[player.id]) {
            let ui: cc.Node = cc.instantiate(this.playerUIPrefab);
            this.node.addChild(ui);

            let playerItemUI: MatchPlayerItemUI = ui.getComponent(MatchPlayerItemUI);
            playerItemUI.init(player);
            this.updatePlayerUIPosition(playerItemUI);

            this._playerItemUIs[player.id] = playerItemUI;
        }

        return this._playerItemUIs[player.id];
    }

    private destroyPlayerUI(player: MatchPlayer) {
        if (null != this._playerItemUIs[player.id]) {
            this._playerItemUIs[player.id].node.destroy();
            this._playerItemUIs[player.id] = null;
        }
    }

    private updatePosition() {
        let position: cc.Vec2 = new cc.Vec2(0, 0);
        position.y = (1 - this._stage.cameraController.currentZoomRatio) * this._stage.canvas.designResolution.height / 2;
        position = this.node.parent.convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position));

        this.node.y = position.y;

        for (let key in this._playerItemUIs) {
            this.updatePlayerUIPosition(this._playerItemUIs[key]);
        }
    }

    private updatePlayerUIPosition(playerItemUI: MatchPlayerItemUI) {
        let position: cc.Vec2 = new cc.Vec2(0, 0);

        position.x = this._stage.canvas.designResolution.width / 2 + (this._stage.playerStartPositions[playerItemUI.player.towerIndex].x - this._stage.cameraController.currentLookAtLocation) * this._stage.cameraController.currentZoomRatio;
        position.y = this._stage.canvas.designResolution.height / 2 * (1 - this._stage.cameraController.currentZoomRatio);

        playerItemUI.node.setPosition(this.node.convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position)));
    }
}
