import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Brick from "../Brick";

export default class BrickPlacedState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...agrs) {
        stateMachine.node.emit(Brick.MSG_PLACED);
    }
}
