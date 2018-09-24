import Brick, { BrickShape } from "../Brick/Brick"
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import TowerCompleteState from "./TowerStates/TowerCompleteState";
import TowerCollapsedState from "./TowerStates/TowerCollapsedState";
import TowerBricksChanngementsNetReporter from "./TowerBricksChangementsNetReporter";
import NetworkTowerBuilder from "./TowerBuilder/NetworkTowerBuilder";
import TowerBuilder from "./TowerBuilder/TowerBuilder";
import LocalTowerBuilder from "./TowerBuilder/LocalTowerBuilder";
import TowerFoundation from "./TowerFoundation";
import { MatchPlayer } from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";
import TowerFoundationLaidState from "./TowerStates/TowerFoundationLaidState";
import TowerUnderConstructionState from "./TowerStates/TowerUnderConstructionState";
import TowerHoldingState from "./TowerStates/TowerHoldingState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tower extends cc.Component {

    static EVT_CURRENT_BRICK_CHANGED: string = "current brick changed";
    static EVT_NEXT_BRICK_CHANGED: string = "next brick changed";

    foundation: TowerFoundation = null;
    builder: TowerBuilder = null;

    index: number = -1;
    isNetworkClone: boolean = false;

    stateMachine: FiniteStateMachine = null;
    static foundationLaidState: TowerFoundationLaidState = new TowerFoundationLaidState();
    static underConstructionState: TowerUnderConstructionState = new TowerUnderConstructionState();
    static holdingState: TowerHoldingState = new TowerHoldingState();
    static completeState: TowerCompleteState = new TowerCompleteState();
    static collapsedState: TowerCollapsedState = new TowerCollapsedState();
    static MSG_CONSTRUCT: string = "construct";
    static MSG_HOLD: string = "hold";
    static MSG_COMPLETE: string = "complete";
    static MSG_COLLAPSE: string = "collapse";

    bricks: { [key: number]: Brick } = {};
    nextValidBrickId: number = 0;

    currentBrick: Brick = null;
    nextBrick: Brick = null;

    onLoad() {
        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.owner = this;
    }

    set player(player: MatchPlayer) {
        this.index = player.towerIndex;
        this.isNetworkClone = (player.id != Game.instance.playerDataManager.id);

        if (this.isNetworkClone) {
            this.builder = this.addComponent(NetworkTowerBuilder);
            this.builder.player = player;
        } else {
            this.builder = this.addComponent(LocalTowerBuilder);
            this.builder.player = player;
            this.addComponent(TowerBricksChanngementsNetReporter);
        }
    }

    get player(): MatchPlayer {
        return this.builder.player;
    }

    set foundationPrefab(prefab: cc.Prefab) {
        let foundationNode: cc.Node = cc.instantiate(prefab);
        this.node.addChild(foundationNode);
        foundationNode.setPosition(0, 0);
        this.foundation = foundationNode.getComponent(TowerFoundation);
    }

    start() {
        if (this.isNetworkClone) {
            this.stateMachine.changeState(Tower.foundationLaidState);
        } else {
            this.stateMachine.changeState(Tower.foundationLaidState);
        }
    }

    getBrickById(brickId: number): Brick {
        return this.bricks[brickId];
    }

    dropBrick() {
        if (null == this.nextBrick) {
            cc.error("No brick to drop: " + this.index);
            return;
        }

        this.currentBrick = this.nextBrick;
        this.nextBrick = null;

        this.currentBrick.stateMachine.telegram(Brick.MSG_FALL);

        this.node.emit(Tower.EVT_NEXT_BRICK_CHANGED, null);
    }

    generateNextBrick(shape: BrickShape = BrickShape.NONE) {
        if (null != this.nextBrick) {
            cc.error("Failed to generate next brick: " + this.index);
            return;
        }

        if (BrickShape.NONE == shape) {
            shape = Math.floor(Math.random() * Game.instance.playground.brickPrefabs.length);
        }
        let brickPrefab:cc.Prefab = Game.instance.playground.brickPrefabs[shape];
        let brickNode:cc.Node = cc.instantiate(brickPrefab);
        this.node.addChild(brickNode);

        let brick:Brick = brickNode.getComponent(Brick);
        let brickId = this.nextValidBrickId++;
        brick.tower = this;
        brick.id = brickId;

        this.bricks[brickId] = brick;

        this.nextBrick = brick;
        this.nextBrick.stateMachine.telegram(Brick.MSG_QUEUE);

        this.node.emit(Tower.EVT_NEXT_BRICK_CHANGED, this.nextBrick);

        return brick;
    }

    private removeBrick(brickId: number) {
        this.bricks[brickId] = null;
    }
}
