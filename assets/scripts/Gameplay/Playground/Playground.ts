import Tower from "../Tower/Tower";
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import PlaygroundSettingUpState from "./PlaygroundStates/PlaygroundSettingUpState";
import PlaygroundMatchCountingDownForBeginningState from "./PlaygroundStates/PlaygroundMatchCountingDownForBeginningState";
import PlaygroundMatchPlayingState from "./PlaygroundStates/PlaygroundMatchPlayingState";
import PlaygroundMatchOverState from "./PlaygroundStates/PlaygroundMatchOverState";
import Game from "../../Framework/Game";
import Stage from "./Stage/Stage";
import { MatchPlayer } from "../../Framework/MatchManager";
import PlaygroundMatchPreparingState from "./PlaygroundStates/PlaygroundMatchPreparingState";
import PlaygroundMatchDisconnectedState from "./PlaygroundStates/PlaygroundMatchDisconnectedState";
import StageCameraController from "./Stage/StageCameraController";
import MatchView from "../../UI/Match/MatchView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Playground extends cc.Component {

    static EVT_TOWER_CREATED: string = "tower created";
    static EVT_TOERR_DESTROYED: string = "tower destroyed";

    static GRID:number = 32;

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

    gravity: number = 40;

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
        tower.player = player;
        tower.foundationPrefab = this.stage.towerFoundationPrefab;

        this.towers[player.id] = tower;

        this.node.emit(Playground.EVT_TOWER_CREATED, tower);

        return tower;
    }

    destroyTower(playerId: string) {
        let tower:Tower = this.towers[playerId];

        if (null == tower) {
            return;
        }

        let towerIndex:number = tower.index;
        tower.node.destroy();
        this.towers[playerId] = null;

        this.node.emit(Playground.EVT_TOERR_DESTROYED, towerIndex, playerId);
    }

    play() {

    }

    // update (delta) {}
}
