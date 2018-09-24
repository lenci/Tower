import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickGravity from "../BrickGravity";
import Brick from "../Brick";

export default class BrickFallingState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...args) {
        let brick:Brick = <Brick>(stateMachine.owner);

        brick.node.setPosition(0, 800);
        brick.gravity.gravityScale = 1;

        brick.node.emit(Brick.EVT_FALLING_STARTED);
    }

    exit(stateMachine:FiniteStateMachine) {
        let brick:Brick = <Brick>(stateMachine.owner);

        brick.getComponent(BrickGravity).enabled = false;
    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        let brick:Brick = <Brick>(stateMachine.owner);

        switch (message) {
            case Brick.MSG_PLACE:
                stateMachine.changeState(Brick.PlacedState);
                break;

            case Brick.MSG_LOSE:
                stateMachine.changeState(Brick.LostState);
                break;
        
            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
