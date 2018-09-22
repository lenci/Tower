import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import NetworkPlayerController from "../../Builder/NetworkBuilderController";
import { BrickChangement, BrickState } from "../../Brick/BrickChangementFetcher";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";

export default class TowerCollapsedState extends FiniteStateMachineState {
    
    enter(stateMachine: FiniteStateMachine, ...args) {
        let tower = (stateMachine.owner as Tower);

        tower.currentBrick = null;
        tower.nextBrick = null;
    }
}
