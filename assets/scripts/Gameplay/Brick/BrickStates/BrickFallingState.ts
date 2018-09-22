import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import BrickGravity from "../BrickGravity";

export default class BrickFallingState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...args) {
        stateMachine.node.on(BrickGravity.MSG_TOUCHING_TOWER, (event:cc.Event) => {
            
        });
        stateMachine.node.on(BrickGravity.MSG_TOUCHING_OTHER, (event:cc.Event) => {

        });
        stateMachine.node.getComponent(BrickGravity).enabled = true;
        cc.find
    }

    exit(stateMachine:FiniteStateMachine) {
        stateMachine.node.getComponent(BrickGravity).enabled = false;
    }
}
