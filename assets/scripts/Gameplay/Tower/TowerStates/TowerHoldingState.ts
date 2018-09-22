import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Tower from "../Tower";

export default class TowerHoldingState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {

    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        switch (message) {
            case "CONSTRUCT":
                stateMachine.changeState(Tower.UnderConstructionState);
                break;

            case "COMPLETE":
                stateMachine.changeState(Tower.CompleteState);
                break;

            case "COLLAPSE":
                stateMachine.changeState(Tower.CollapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
