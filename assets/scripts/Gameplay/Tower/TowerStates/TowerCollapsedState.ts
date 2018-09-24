import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";

export default class TowerCollapsedState extends FiniteStateMachineState {
    
    enter(stateMachine: FiniteStateMachine, ...args) {
        let tower = <Tower>(stateMachine.owner);

        tower.builder.enabled = false;
    }
}
