import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Playground from "../Playground";
import GameManager from "../../../Framework/GameManager";
import MatchManager from "../../../Framework/MatchManager";
import Tower from "../../Tower/Tower";

export default class PlaygroundMatchPlayingStateStateMachineState extends FiniteStateMachineState {

    enter(stateMachine:FiniteStateMachine, ...args) {
        let playground: Playground = <Playground>(stateMachine.owner);
        
        let matchManager:MatchManager = GameManager.instance.matchManager;

        if (matchManager.hasJoined) {
            playground.stage.cameraController.lookAtLocation(playground.stage.playerStartPositions[matchManager.myTowerIndex].x, 1);
            playground.stage.cameraController.zoom(1, 1);            
        }

        for (let playerId in playground.towers) {
            // playground.towers[playerId].stateMachine.telegram(Tower.MSG_CONSTRUCT);
        }
    }
}
