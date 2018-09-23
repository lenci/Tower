import StageCameraController from "./StageCameraController";
import LandscapePerspective from "./LandscapePerspective";
import SkyPerspective from "./SkyPerspective";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Stage extends cc.Component {
    @property([cc.Node])
    landscapes: cc.Node[] = [];

    @property({ type: [cc.Float], range: [1, 128] })
    landscapeDistanceFactors: number[] = [];

    @property([cc.Node])
    skys: cc.Node[] = [];

    @property(cc.Node)
    towersContainer: cc.Node = null;

    @property(cc.TiledObjectGroup)
    playerStarts: cc.TiledObjectGroup = null;

    @property({ type: cc.Integer })
    horizon: number = 0;

    @property(cc.Prefab)
    towerFoundationPrefab: cc.Prefab = null;

    playerStartPositions: cc.Vec2[] = [];

    start() {
        if (!this.checkPlayerStartsValid()) {
            cc.error("StageError");
            return;
        }

        for (let i = 0; i < this.landscapes.length; i++) {
            const landscape = this.landscapes[i];
            let landscapePerspective: LandscapePerspective = landscape.addComponent(LandscapePerspective);
            landscapePerspective.distanceFactor = this.landscapeDistanceFactors[i];
        }

        this.skys.forEach(sky => {
            let skyscapePerspective: SkyPerspective = sky.addComponent(SkyPerspective);
        });
    }

    private checkPlayerStartsValid(): boolean {
        let player1Start = this.playerStarts.getObject("Player1");
        let player2Start = this.playerStarts.getObject("Player2");
        let player3Start = this.playerStarts.getObject("Player3");

        this.playerStartPositions[0] = new cc.Vec2(player1Start.offset.x, this.fullSize.height - player1Start.offset.y);
        this.playerStartPositions[1] = new cc.Vec2(player2Start.offset.x, this.fullSize.height - player2Start.offset.y);
        this.playerStartPositions[2] = new cc.Vec2(player3Start.offset.x, this.fullSize.height - player3Start.offset.y);

        if (!(this.playerStartPositions[0].y == this.playerStartPositions[1].y &&
            this.playerStartPositions[0].y == this.playerStartPositions[2].y)) {
            return false;
        }

        if (!(this.playerStartPositions[0].x < this.playerStartPositions[1].x &&
            this.playerStartPositions[1].x < this.playerStartPositions[2].x)) {
            return false;
        }

        if (this.playerStartPositions[1].x - this.playerStartPositions[0].x != this.playerStartPositions[2].x - this.playerStartPositions[1].x) {
            return false;
        }

        let distanceBetweens: number = this.playerStartPositions[1].x - this.playerStartPositions[0].x
        if (!(this.playerStartPositions[0].x >= distanceBetweens / 2 &&
            this.fullSize.width - this.playerStartPositions[2].x >= distanceBetweens / 2)) {
            return false;
        }

        return true;
    }

    get fullSize(): cc.Size {
        return this.landscapes[this.landscapes.length - 1].getContentSize();
    }
}
