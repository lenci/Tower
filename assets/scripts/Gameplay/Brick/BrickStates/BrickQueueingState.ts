import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Brick from "../Brick";

export default class BrickQueueingState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...agrs) {
        let brick:Brick = <Brick>(stateMachine.owner);

        brick.node.active = false;

        brick.node.emit(Brick.EVT_QUEUEING_STARTED);
    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        let brick:Brick = <Brick>(stateMachine.owner);

        switch (message) {
            case Brick.MSG_FALL:
                stateMachine.changeState(Brick.FallingState);
                break;
        
            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
