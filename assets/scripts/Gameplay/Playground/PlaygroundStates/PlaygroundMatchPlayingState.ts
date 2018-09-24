import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Playground from "../Playground";
import Game from "../../../Framework/Game";
import MatchManager from "../../../Framework/MatchManager";
import Tower from "../../Tower/Tower";

export default class PlaygroundMatchPlayingStateStateMachineState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager: MatchManager = Game.instance.matchManager;

        if (matchManager.hasJoined) {
            playground.camera.lookAtLocation(playground.stage.playerStartPositions[matchManager.myTowerIndex].x, 1);
            playground.camera.zoom(1, 1);
        }

        for (let playerId in playground.towers) {
            playground.towers[playerId].stateMachine.telegram(Tower.MSG_CONSTRUCT);
        }
    }
}
