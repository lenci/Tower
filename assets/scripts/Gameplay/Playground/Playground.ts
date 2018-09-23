import Tower from "../Tower/Tower";
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import PlaygroundSettingUpState from "./PlaygroundStates/PlaygroundSettingUpState";
import PlaygroundMatchCountingDownForBeginningState from "./PlaygroundStates/PlaygroundMatchCountingDownForBeginningState";
import PlaygroundMatchPlayingState from "./PlaygroundStates/PlaygroundMatchPlayingState";
import PlaygroundMatchOverState from "./PlaygroundStates/PlaygroundMatchOverState";
import Game from "../../Framework/GameManager";
import Stage from "./Stage/Stage";
import { MatchPlayer } from "../../Framework/MatchManager";
import PlaygroundMatchPreparingState from "./PlaygroundStates/PlaygroundMatchPreparingState";
import PlaygroundMatchDisconnectedState from "./PlaygroundStates/PlaygroundMatchDisconnectedState";
import StageCameraController from "./Stage/StageCameraController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Playground extends cc.Component {

    @property(Stage)
    stage: Stage = null;

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(StageCameraController)
    camera: StageCameraController = null;

    @property(cc.Prefab)
    towerPrefab: cc.Prefab = null;

    @property({ type: [cc.Prefab] })
    brickPrefabs: cc.Prefab[] = [];

    stateMachine: FiniteStateMachine = null;
    static settingUpState: PlaygroundSettingUpState = new PlaygroundSettingUpState();
    static matchPreparingState: PlaygroundMatchPreparingState = new PlaygroundMatchPreparingState();
    static matchCountingDownForBeginningState: PlaygroundMatchCountingDownForBeginningState = new PlaygroundMatchCountingDownForBeginningState();
    static matchPlayingState: PlaygroundMatchPlayingState = new PlaygroundMatchPlayingState();
    static matchOverState: PlaygroundMatchOverState = new PlaygroundMatchOverState();
    static matchDisconnectedState: PlaygroundMatchDisconnectedState = new PlaygroundMatchDisconnectedState();
    static MSG_PREPARE_MATCH: string = "prepare match";
    static MSG_COUNT_DOWN_FOR_BEGINNING: string = "count down for beginning";
    static MSG_BEGIN_MATCH: string = "begin match";
    static MSG_END_MATCH: string = "end match";
    static MSG_INTERRUPT_MATCH: string = "interrupt match";

    towers: { [key: string]: Tower } = {};

    gravity: number = 10;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.owner = this;

        Game.instance.playground = this;
    }

    start() {
        this.stateMachine.changeState(Playground.settingUpState);
    }

    onDestroy() {
        cc.director.getPhysicsManager().enabled = false;

        Game.instance.playground = null;
    }

    createTower(player: MatchPlayer, towerIndex: number): Tower {
        if (null != this.towers[player.id]) {
            return this.towers[player.id];
        }

        let towerNode: cc.Node = cc.instantiate(this.towerPrefab);
        this.stage.towersContainer.addChild(towerNode);
        towerNode.setPosition(this.stage.playerStartPositions[towerIndex]);

        let tower: Tower = towerNode.getComponent(Tower);
        tower.init(player, player.id != Game.instance.playerDataManager.id, this.stage.towerFoundationPrefab);

        this.towers[player.id] = tower;

        return tower;
    }

    destroyTower(player: MatchPlayer) {
        if (null == this.towers[player.id]) {
            return;
        }

        this.towers[player.id].node.destroy();
        this.towers[player.id] = null;
    }

    play() {

    }

    // update (delta) {}
}
