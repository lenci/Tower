import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Playground from "../Playground";
import GameManager from "../../../Framework/GameManager";
import MatchManager, { MatchPlayer } from "../../../Framework/MatchManager";

export default class PlaygroundSettingUpState extends FiniteStateMachineState {

    async enter(stateMachine: FiniteStateMachine, ...args) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = GameManager.instance.matchManager;
        
        if (1 == matchManager.maxPlayerCount) {
            playground.stage.cameraController.lookAtLocation(playground.stage.playerStartPositions[0].x);
            playground.stage.cameraController.zoom(1);
        } else if (2 == matchManager.maxPlayerCount) {
            playground.stage.cameraController.lookAtLocation((playground.stage.playerStartPositions[0].x + playground.stage.playerStartPositions[1].x) / 2);
            playground.stage.cameraController.zoom(0.5);
        } else if (3 == matchManager.maxPlayerCount) {
            playground.stage.cameraController.lookAtLocation((playground.stage.playerStartPositions[0].x + playground.stage.playerStartPositions[1].x + playground.stage.playerStartPositions[2].x) / 3);
            playground.stage.cameraController.zoom(0.3);
        }

        if (0 != await matchManager.enterMatch()) {
            return;
        }
        
        matchManager.players.forEach(player => {
            playground.createTower(player, player.towerIndex);
        });

        stateMachine.telegram(Playground.MSG_PREPARE_MATCH);
    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        switch (message) {
            case Playground.MSG_PREPARE_MATCH:
                stateMachine.changeState(Playground.matchPreparingState);
                break;
        
            default:
                break;
        }
    }
}