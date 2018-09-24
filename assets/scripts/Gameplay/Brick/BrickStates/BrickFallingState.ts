import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickGravity from "../BrickGravity";
import Brick from "../Brick";

export default class BrickFallingState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {
        let brick: Brick = <Brick>(stateMachine.owner);

        brick.node.active = true;

        brick.node.setPosition(0, 800);
        brick.gravity.enabled = true;

        brick.node.emit(Brick.EVT_FALLING_STARTED);

        brick["onPlaced"] = () => {
            stateMachine.telegram(Brick.MSG_PLACE);
        }
        brick["onLost"] = () => {
            stateMachine.telegram(Brick.MSG_LOSE);
        }

        brick.node.on(Brick.EVT_PLACED, brick["onPlaced"]);
        brick.node.on(Brick.EVT_LOST, brick["onLost"]);
    }

    exit(stateMachine: FiniteStateMachine) {
        let brick: Brick = <Brick>(stateMachine.owner);

        brick.gravity.enabled = false;

        brick.node.off(Brick.EVT_PLACED, brick["onPlaced"]);
        brick.node.off(Brick.EVT_LOST, brick["onLost"]);

        brick["onPlaced"] = null;
        brick["onLost"] = null;
    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        let brick: Brick = <Brick>(stateMachine.owner);

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
