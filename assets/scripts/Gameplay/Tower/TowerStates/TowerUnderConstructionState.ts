import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import Brick from "../../Brick/Brick";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import TowerHeightRuler from "../TowerHeightRuler";

export default class TowerUnderConstructionState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine) {
        let tower = <Tower>(stateMachine.owner);

        
    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        let tower = <Tower>(stateMachine.owner);

        switch (message) {
            case Tower.MSG_HOLD:
                stateMachine.changeState(Tower.holdingState);
                break;

            case Tower.MSG_COLLAPSE:
                stateMachine.changeState(Tower.collapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
