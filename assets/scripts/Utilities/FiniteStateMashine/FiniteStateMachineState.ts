import FiniteStateMachine from "./FiniteStateMachine";

const { ccclass, property } = cc._decorator;

export default class FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {

    }

    exit(stateMachine: FiniteStateMachine) {

    }

    update(stateMachine: FiniteStateMachine, delta: number) {

    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        cc.warn("telegram is not handled: " + message + " current state is " + typeof(this));
    }
}