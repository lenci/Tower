import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickGravity from "../BrickGravity";
import Brick from "../Brick";

export default class BrickFallingState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...args) {
        let brick:Brick = <Brick>(stateMachine.owner);
        cc.log("falling");

        // brick.node.once(BrickGravity.MSG_TOUCHING_TOWER, (event:cc.Event) => {
            
        // });
        // brick.node.once(BrickGravity.MSG_TOUCHING_OTHER, (event:cc.Event) => {

        // });
        brick.getComponent(BrickGravity).enabled = true;
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
                break;
        }
    }
}
