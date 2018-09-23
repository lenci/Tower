import FiniteStateMachineState from "./FiniteStateMachineState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FiniteStateMachine extends cc.Component {
    @property(cc.Component)
    owner: cc.Component = null;

    currentState: FiniteStateMachineState = null;
    previousState: FiniteStateMachineState = null;

    changeState(state: FiniteStateMachineState, ...args) {
        let exitTimes: number = 0;

        while (null != this.currentState) {
            ++exitTimes;

            this.previousState = this.currentState;
            this.currentState = null;

            this.previousState.exit(this);
        }

        this.currentState = state;

        if (null != this.currentState) {
            this.currentState.enter(this, args);
        }
    }

    revertState() {
        this.changeState(this.previousState)
    }

    update(delta: number) {
        if (null != this.currentState) {
            this.currentState.update(this, delta);
        }
    }

    telegram(message:string, ...args) {
        if (null != this.currentState) {
            this.currentState.onTelegram(this, message, args);
        }
    }
}
