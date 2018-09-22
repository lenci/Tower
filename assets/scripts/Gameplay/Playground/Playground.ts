import Tower from "../Tower/Tower";
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import PlaygroundSettingUpState from "./PlaygroundStates/PlaygroundSettingUpState";
import PlaygroundMatchReadyState from "./PlaygroundStates/PlaygroundMatchReadyState";
import PlaygroundMatchInState from "./PlaygroundStates/PlaygroundMatchInState";
import PlaygroundMatchOverState from "./PlaygroundStates/PlaygroundMatchOverState";
import GameManager from "../../Framework/GameManager";
import Stage from "./Stage/Stage";
import { MatchPlayer } from "../../Framework/MatchManager";
import PlaygroundMatchPreparingState from "./PlaygroundStates/PlaygroundMatchPreparingState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Playground extends cc.Component {

    @property(Stage)
    stage: Stage = null;

    @property(cc.Prefab)
    towerPrefab: cc.Prefab = null;

    private stateMachine: FiniteStateMachine = null;
    static settingUpState: PlaygroundSettingUpState = new PlaygroundSettingUpState();
    static matchPreparingState: PlaygroundMatchPreparingState = new PlaygroundMatchPreparingState();
    static matchReadyState: PlaygroundMatchReadyState = new PlaygroundMatchReadyState();
    static matchInState: PlaygroundMatchInState = new PlaygroundMatchInState();
    static matchOverState: PlaygroundMatchOverState = new PlaygroundMatchOverState();
    static MSG_SETTING_UP_COMPLETED:string = "setting up completed";
    static MSG_MATCH_READY:string = "match ready";

    towers: { [key: string]: Tower } = {};

    gravity: number = 10;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

        GameManager.instance.playground = this;
    }

    start() {
        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.init(this);

        this.stateMachine.changeState(Playground.settingUpState, GameManager.instance.matchManager);
    }

    onDestroy() {
        cc.director.getPhysicsManager().enabled = false;

        GameManager.instance.playground = null;
    }

    createTower(player: MatchPlayer, towerIndex:number): Tower {
        if (null != this.towers[player.playerId]) {
            return this.towers[player.playerId];
        }

        let towerNode: cc.Node = cc.instantiate(this.towerPrefab);
        this.stage.towersContainer.addChild(towerNode);
        towerNode.setPosition(this.stage.playerStartPositions[towerIndex]);

        let tower: Tower = towerNode.getComponent(Tower);
        tower.init(player, player.playerId != GameManager.instance.playerDataManager.playerId, this.stage.towerFoundationPrefab);

        this.towers[player.playerId] = tower;

        return tower;
    }

    destroyTower(player: MatchPlayer) {
        if (null == this.towers[player.playerId]) {
            return;
        }

        this.towers[player.playerId].node.destroy();
    }

    play() {

    }

    // update (delta) {}
}
