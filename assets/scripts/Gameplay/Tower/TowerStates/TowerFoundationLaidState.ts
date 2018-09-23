import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";

export default class TowerFoundationLaidState extends FiniteStateMachineState {

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        switch (message) {
            case Tower.MSG_CONSTRUCT:
                stateMachine.changeState(Tower.underConstructionState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
