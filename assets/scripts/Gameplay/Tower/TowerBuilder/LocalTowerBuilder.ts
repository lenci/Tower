import TowerBuilder from "./TowerBuilder";
import Game from "../../../Framework/Game";
import Brick from "../../Brick/Brick";
import InputManager from "../../../Framework/InputManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalTowerBuilder extends TowerBuilder {

    private _inputManager: InputManager = null;

    onLoad() {
        super.onLoad();
        
        this._inputManager = Game.instance.inputManager;
    }

    onEnable() {
        super.onEnable();

        if (null == this._tower.nextBrick) {
            this._tower.generateNextBrick();
        }

        if (null == this._tower.currentBrick) {
            this.dropBrickAndGenerateNext();
        }
    }

    onDisable() {
        super.onDisable();
    }

    dropBrickAndGenerateNext() {
        this._tower.dropBrick();
        this._tower.generateNextBrick();

        this._tower.currentBrick.node.once(Brick.EVT_PLACED, this.dropBrickAndGenerateNext, this);
        this._tower.currentBrick.node.once(Brick.EVT_LOST, this.dropBrickAndGenerateNext, this);
    }

    update(delta: number) {
        if (null != this._tower.currentBrick) {
            let translateValue: number = this._inputManager.getAxis("translate");
            if (0 != translateValue) {
                this._tower.currentBrick.translate(translateValue);
            }

            if (this._inputManager.getKey("rotate")) {
                this._tower.currentBrick.rotate(1);
            }

            if (this._inputManager.getKey("accelerate")) {
                this._tower.currentBrick.accelerateGravity();
            } else {
                this._tower.currentBrick.normalizeGravity();
            }
        }
    }
}
