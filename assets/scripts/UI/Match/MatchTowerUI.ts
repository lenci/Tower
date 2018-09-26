import Tower from "../../Gameplay/Tower/Tower";
import Brick from "../../Gameplay/Brick/Brick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchTowerUI extends cc.Component {

    @property(cc.Sprite)
    spNextBrick: cc.Sprite = null;

    tower: Tower = null;

    start() {
        this._refreshNextBrick(this.tower.nextBrick);
        this.tower.node.on(Tower.EVT_NEXT_BRICK_CHANGED, this._refreshNextBrick, this);
    }

    private _refreshNextBrick(brick: Brick) {
        if (null != brick) {
            this.spNextBrick.spriteFrame = brick.display.spriteFrame;
        } else {
            this.spNextBrick.spriteFrame = null;
        }
    }

}
