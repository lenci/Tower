import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Brick from "../Brick";

export default class BrickInitialState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {
        let brick: Brick = <Brick>(stateMachine.owner);

        brick.node.active = false;
    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        let brick: Brick = <Brick>(stateMachine.owner);

        switch (message) {
            case Brick.MSG_QUEUE:
                stateMachine.changeState(Brick.QueueState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
