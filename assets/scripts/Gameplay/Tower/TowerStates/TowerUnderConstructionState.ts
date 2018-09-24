import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";

export default class TowerUnderConstructionState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine) {
        let tower = <Tower>(stateMachine.owner);

        tower.builder.enabled = true;
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
