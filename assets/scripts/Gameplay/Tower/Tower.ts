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
import Game from "../../Framework/Game";
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

    private _currentBrick: Brick = null;
    private _nextBrick: Brick = null;

    onLoad() {
        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.owner = this;
    }

    set player(player: MatchPlayer) {
        this.index = player.towerIndex;
        this.isNetworkClone = (player.id != Game.instance.playerDataManager.id);

        if (this.isNetworkClone) {
            this.builder = this.getComponent(NetworkTowerBuilder);
        } else {
            this.builder = this.getComponent(LocalTowerBuilder);
        }
        this.builder.player = player;

        if (!this.isNetworkClone) {
            this.addComponent(TowerBricksChanngementsNetReporter);
        }

        this.node.group = "player " + (player.towerIndex + 1);
        if (null != this.foundation) {
            this.foundation.node.group = this.node.group;
            this.foundation.getComponent(cc.PhysicsCollider).apply();
        }
    }

    get player(): MatchPlayer {
        return this.builder.player;
    }

    set foundationPrefab(prefab: cc.Prefab) {
        let foundationNode: cc.Node = cc.instantiate(prefab);
        this.node.addChild(foundationNode);
        foundationNode.setPosition(0, 0);
        foundationNode.group = this.node.group;
        foundationNode.getComponent(cc.PhysicsCollider).apply();

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
    }

    generateNextBrick(shape: BrickShape = BrickShape.NONE) {
        if (null != this.nextBrick) {
            cc.error("Failed to generate next brick: " + this.index);
            return;
        }

        if (BrickShape.NONE == shape) {
            shape = Math.floor(Math.random() * Game.instance.playground.brickPrefabs.length);
            shape = BrickShape.TetrominoI;
        }
        let brickPrefab: cc.Prefab = Game.instance.playground.brickPrefabs[shape];
        let brickNode: cc.Node = cc.instantiate(brickPrefab);
        this.node.addChild(brickNode);
        brickNode.group = this.node.group;
        brickNode.getComponent(cc.PhysicsCollider).apply();


        let brick: Brick = brickNode.getComponent(Brick);
        let brickId = this.nextValidBrickId++;
        brick.tower = this;
        brick.id = brickId;

        this.bricks[brickId] = brick;

        this.nextBrick = brick;
        this.nextBrick.stateMachine.telegram(Brick.MSG_QUEUE);

        return brick;
    }

    clearNextBrick() {
        if (null != this.nextBrick) {
            this._removeBrick(this.nextBrick);
            this.nextBrick = null;
        }
    }

    private _removeBrick(brick: Brick) {
        this.bricks[brick.id] = null;
        brick.node.destroy();
    }

    get currentBrick(): Brick {
        return this._currentBrick;
    }

    set currentBrick(brick: Brick) {
        if (brick != this._currentBrick) {
            this._currentBrick = brick;
            this.node.emit(Tower.EVT_CURRENT_BRICK_CHANGED, this._currentBrick);
        }
    }

    get nextBrick(): Brick {
        return this._nextBrick;
    }

    set nextBrick(brick: Brick) {
        if (brick != this._nextBrick) {
            this._nextBrick = brick;
            this.node.emit(Tower.EVT_NEXT_BRICK_CHANGED, this._nextBrick);
        }
    }
}
