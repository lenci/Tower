import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Tower from "../Tower";

export default class TowerHoldingState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {

    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        switch (message) {
            case Tower.MSG_CONSTRUCT:
                stateMachine.changeState(Tower.UnderConstructionState);
                break;

            case Tower.MSG_COMPLETE:
                stateMachine.changeState(Tower.CompleteState);
                break;

            case Tower.MSG_COLLAPSE:
                stateMachine.changeState(Tower.CollapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
