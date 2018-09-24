import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Tower from "../Tower";

export default class TowerHoldingState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine) {
        let tower = <Tower>(stateMachine.owner);

    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        switch (message) {
            case Tower.MSG_CONSTRUCT:
                stateMachine.changeState(Tower.underConstructionState);
                break;

            case Tower.MSG_COMPLETE:
                stateMachine.changeState(Tower.completeState);
                break;

            case Tower.MSG_COLLAPSE:
                stateMachine.changeState(Tower.collapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
