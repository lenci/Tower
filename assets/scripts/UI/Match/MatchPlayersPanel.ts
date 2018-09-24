import Game from "../../Framework/Game";
import MatchManager, { MatchPlayer } from "../../Framework/MatchManager";
import StageCameraController from "../../Gameplay/Playground/Stage/StageCameraController";
import Stage from "../../Gameplay/Playground/Stage/Stage";
import MatchPlayerUI from "./MatchPlayerUI";
import Playground from "../../Gameplay/Playground/Playground";
import View from "../../Framework/UI/View";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayersPanel extends View {

    @property(cc.Prefab)
    playerUIPrefab: cc.Prefab = null;

    private _playerUIs: { [key: string]: MatchPlayerUI } = {};

    private _stage: Stage = null;
    private _camera: StageCameraController = null;
    private _canvas: cc.Canvas = null;

    onShow() {
        super.onShow();

        this._stage = Game.instance.playground.stage;
        this._camera = Game.instance.playground.camera;
        this._canvas = Game.instance.playground.canvas;

        Game.instance.matchManager.players.forEach(player => {
            this.createPlayerUI(player);
        });
        Game.instance.matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, this.createPlayerUI, this);
        Game.instance.matchManager.node.on(MatchManager.EVT_PLAYER_RETIRED, this.destroyPlayerUI, this);

        this.updatePosition();
        this._camera.node.on(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);
    }

    onHide() {
        for (let playerId in this._playerUIs) {
            this.destroyPlayerUI(playerId);
        }

        Game.instance.matchManager.node.off(MatchManager.EVT_PLAYER_JOINED, this.createPlayerUI, this);
        Game.instance.matchManager.node.off(MatchManager.EVT_PLAYER_RETIRED, this.destroyPlayerUI, this);

        this._camera.node.off(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);

        super.onHide();
    }

    private createPlayerUI(player: MatchPlayer): MatchPlayerUI {
        if (null == this._playerUIs[player.id]) {
            let ui: cc.Node = cc.instantiate(this.playerUIPrefab);
            this.node.addChild(ui);

            let playerItemUI: MatchPlayerUI = ui.getComponent(MatchPlayerUI);
            playerItemUI.player = player;
            this.updatePlayerUIPosition(playerItemUI);

            this._playerUIs[player.id] = playerItemUI;
        }

        return this._playerUIs[player.id];
    }

    private destroyPlayerUI(playerId: string) {
        if (null != this._playerUIs[playerId]) {
            this._playerUIs[playerId].node.destroy();
            this._playerUIs[playerId] = null;
        }
    }

    private updatePosition() {
        let position: cc.Vec2 = new cc.Vec2(0, 0);
        position.y = (1 - this._camera.currentZoomRatio) * this._canvas.designResolution.height / 2;
        position = this.node.getParent().convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position));

        this.node.y = position.y;

        for (let playerId in this._playerUIs) {
            this.updatePlayerUIPosition(this._playerUIs[playerId]);
        }
    }

    private updatePlayerUIPosition(playerItemUI: MatchPlayerUI) {
        let position: cc.Vec2 = new cc.Vec2(0, 0);

        position.x = this._canvas.designResolution.width / 2 + (this._stage.playerStartPositions[playerItemUI.player.towerIndex].x - this._camera.currentLookAtLocation) * this._camera.currentZoomRatio;
        position.y = this._canvas.designResolution.height / 2 * (1 - this._camera.currentZoomRatio);

        playerItemUI.node.setPosition(this.node.convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position)));
    }
}
