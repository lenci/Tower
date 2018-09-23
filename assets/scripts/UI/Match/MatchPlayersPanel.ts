import Game from "../../Framework/GameManager";
import MatchManager, { MatchPlayer } from "../../Framework/MatchManager";
import StageCameraController from "../../Gameplay/Playground/Stage/StageCameraController";
import Stage from "../../Gameplay/Playground/Stage/Stage";
import MatchPlayerItemUI from "./MatchPlayerItemUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayersPanel extends cc.Component {

    @property(cc.Prefab)
    playerUIPrefab: cc.Prefab = null;

    private _playerItemUIs: { [key: string]: MatchPlayerItemUI } = {};

    private _stage: Stage = null;
    private _camera: StageCameraController = null;
    private _canvas: cc.Canvas = null;

    start() {
        Game.instance.matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, this.createPlayerUI, this);
        Game.instance.matchManager.node.on(MatchManager.EVT_PLAYER_RETIRED, this.destroyPlayerUI, this);

        this._stage = Game.instance.playground.stage;
        this._camera = Game.instance.playground.camera;
        this._canvas = Game.instance.playground.canvas;
        this.updatePosition();
        this._camera.node.on(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);
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
        position.y = (1 - this._camera.currentZoomRatio) * this._canvas.designResolution.height / 2;
        position = this.node.getParent().convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position));

        this.node.y = position.y;

        for (let playerId in this._playerItemUIs) {
            this.updatePlayerUIPosition(this._playerItemUIs[playerId]);
        }
    }

    private updatePlayerUIPosition(playerItemUI: MatchPlayerItemUI) {
        let position: cc.Vec2 = new cc.Vec2(0, 0);

        position.x = this._canvas.designResolution.width / 2 + (this._stage.playerStartPositions[playerItemUI.player.towerIndex].x - this._camera.currentLookAtLocation) * this._camera.currentZoomRatio;
        position.y = this._canvas.designResolution.height / 2 * (1 - this._camera.currentZoomRatio);

        playerItemUI.node.setPosition(this.node.convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position)));
    }
}
