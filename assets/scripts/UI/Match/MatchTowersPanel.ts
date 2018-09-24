import MatchTowerUI from "./MatchTowerUI";
import Stage from "../../Gameplay/Playground/Stage/Stage";
import StageCameraController from "../../Gameplay/Playground/Stage/StageCameraController";
import Game from "../../Framework/GameManager";
import Tower from "../../Gameplay/Tower/Tower";
import Playground from "../../Gameplay/Playground/Playground";
import View from "../../Framework/UI/View";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchTowersPanel extends View {

    @property(cc.Prefab)
    towerUIPrefab: cc.Prefab = null;

    private _towerUIs: { [key: number]: MatchTowerUI } = {};

    private _stage: Stage = null;
    private _camera: StageCameraController = null;
    private _canvas: cc.Canvas = null;

    onShow() {
        super.onShow();

        this._stage = Game.instance.playground.stage;
        this._camera = Game.instance.playground.camera;
        this._canvas = Game.instance.playground.canvas;

        for (let playerId in Game.instance.playground.towers) {
            this.createTowerUI(Game.instance.playground.towers[playerId]);

        };
        Game.instance.playground.node.on(Playground.EVT_TOWER_CREATED, this.createTowerUI, this);
        Game.instance.playground.node.on(Playground.EVT_TOERR_DESTROYED, this.destroyTowerUI, this);

        this.updatePosition();
        this._camera.node.on(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);
    }

    onHide() {
        for (let towerIndex in this._towerUIs) {
            this.destroyTowerUI(Number(towerIndex));
        }

        Game.instance.playground.node.off(Playground.EVT_TOWER_CREATED, this.createTowerUI, this);
        Game.instance.playground.node.off(Playground.EVT_TOERR_DESTROYED, this.destroyTowerUI, this);

        this._camera.node.off(StageCameraController.EVT_CAMERA_MOVING, this.updatePosition, this);

        super.onHide();
    }

    private createTowerUI(tower: Tower): MatchTowerUI {
        if (null == this._towerUIs[tower.index]) {
            let ui: cc.Node = cc.instantiate(this.towerUIPrefab);
            this.node.addChild(ui);
            let towerItemUI: MatchTowerUI = ui.getComponent(MatchTowerUI);
            towerItemUI.tower = tower;
            this.updatePlayerUIPosition(towerItemUI);

            this._towerUIs[tower.index] = towerItemUI;
        }

        return this._towerUIs[tower.index];
    }

    private destroyTowerUI(towerIndex:number) {
        if (null != this._towerUIs[towerIndex]) {
            this._towerUIs[towerIndex].node.destroy();
            this._towerUIs[towerIndex] = null;
        }
    }

    private updatePosition() {
        for (let towerIndex in this._towerUIs) {
            this.updatePlayerUIPosition(this._towerUIs[towerIndex]);
        }
    }

    private updatePlayerUIPosition(towerItemUI: MatchTowerUI) {
        let position: cc.Vec2 = new cc.Vec2(0, 0);

        position.x = this._canvas.designResolution.width / 2 + (this._stage.playerStartPositions[towerItemUI.tower.index].x - this._camera.currentLookAtLocation) * this._camera.currentZoomRatio;
        position.y = this._canvas.designResolution.height;

        towerItemUI.node.setPosition(this.node.convertToNodeSpaceAR(this._stage.node.convertToWorldSpaceAR(position)));
    }
}
