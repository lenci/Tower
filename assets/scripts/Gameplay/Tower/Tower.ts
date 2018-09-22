import Brick, { BrickShape } from "../Brick/Brick"
import FiniteStateMachine from "../../Utilities/FiniteStateMashine/FiniteStateMachine";
import TowerFoundationLaidState from "./TowerStates/TowerFoundationLaidState";
import TowerUnderConstructionState from "./TowerStates/TowerUnderConstructionState";
import TowerCompleteState from "./TowerStates/TowerCompleteState";
import TowerCollapsedState from "./TowerStates/TowerCollapsedState";
import TowerHoldingState from "./TowerStates/TowerHoldingState";
import TowerBricksChanngementsNetReporter from "./TowerBricksChangementsNetReporter";
import NetworkTowerBuilder from "./TowerBuilder/NetworkTowerBuilder";
import TowerBuilder from "./TowerBuilder/TowerBuilder";
import LocalTowerBuilder from "./TowerBuilder/LocalPlayerTowerBuilder";
import TowerFoundation from "./TowerFoundation";
import MatchManager, { MatchPlayer } from "../../Framework/MatchManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tower extends cc.Component {

    foundation: TowerFoundation = null;
    builder: TowerBuilder = null;

    isNetworkClone: boolean = false;

    stateMachine: FiniteStateMachine = null;
    static foundationLaidState: TowerFoundationLaidState = new TowerFoundationLaidState();
    static underConstructionState: TowerUnderConstructionState = new TowerUnderConstructionState();
    static holdingState: TowerHoldingState = new TowerHoldingState();
    static completeState: TowerCompleteState = new TowerCompleteState();
    static collapsedState: TowerCollapsedState = new TowerCollapsedState();
    static MSG_CONSTRUCT:string = "construct";
    static MSG_HOLD:string = "hold";
    static MSG_COMPLETE:string = "complete";
    static MSG_COLLAPSE:string = "collapse";
    static MSG_DROP_BRICK:string = "drop brick";
    static MSG_TRANSLATE_BRICK:string = "translate brick";
    static MSG_ROTATE_BRICK:string = "rotate brick";
    static MSG_CLONE_BRICK_FROM_NET:string = "clone brick from net";
    static MSG_SYNC_BRICK_FROM_NET:string = "sync brick from net";
    static MSG_MAGIC_TO_BRICK:string = "magic to brick";

    bricks: { [key: number]: Brick } = {};
    nextValidBrickId:number = 0;

    currentBrick: Brick = null;
    nextBrick: Brick = null;

    init(player: MatchPlayer, isNetworkClone: boolean, foundationPrefab:cc.Prefab) {
        this.isNetworkClone = isNetworkClone;

        if (this.isNetworkClone) {
            this.builder = this.addComponent(NetworkTowerBuilder);            
        } else {
            this.builder = this.addComponent(LocalTowerBuilder);
            this.addComponent(TowerBricksChanngementsNetReporter);
        }
        this.builder.init(player);

        let foundationNode:cc.Node = cc.instantiate(foundationPrefab);
        this.node.addChild(foundationNode);
        foundationNode.setPosition(0, 0);
        this.foundation = foundationNode.getComponent(TowerFoundation);
    }

    start() {
        this.stateMachine = this.addComponent(FiniteStateMachine);
        this.stateMachine.init(this);
        
        this.stateMachine.changeState(Tower.foundationLaidState);
    }

    getBrickById(brickId: number): Brick {
        return this.bricks[brickId];
    }

    generateRandomBrick(): Brick {
        let brick = new Brick();

        let brickId = this.nextValidBrickId++;
        this.bricks[brickId] = brick;

        return brick;
    }

    generateSpecificBrick(brickId: number, shape: BrickShape): Brick {
        let brick = new Brick();

        this.bricks[brickId] = brick;

        return brick;
    }

    removeBrick(brickId: number) {
        this.bricks[brickId] = null;
    }
}
