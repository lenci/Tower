import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Playground from "../Playground";
import MatchManager, { MatchPlayer, MatchStatus } from "../../../Framework/MatchManager";
import Game from "../../../Framework/GameManager";

export default class PlaygroundCountingDownForBeginningState extends FiniteStateMachineState {
    
    async enter(stateMachine: FiniteStateMachine, ...args) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = Game.instance.matchManager;
        
        playground["_onPlayerJoined"] = (player:MatchPlayer) => {
            playground.createTower(player, player.towerIndex);
        }
        playground["_onPlayerRetired"] = (playerId:string) => {
            playground.destroyTower(playerId);
        }
        playground["_onOnMatchStatusChanged"] = (status:MatchStatus) => {
            if (MatchStatus.Preparing == status) {
                stateMachine.telegram(Playground.MSG_PREPARE_MATCH);
            } else if (MatchStatus.Playing == status) {
                stateMachine.telegram(Playground.MSG_BEGIN_MATCH);
            }
        }

        matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.on(MatchManager.EVT_PLAYER_RETIRED, playground["_onPlayerRetired"]);
        matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, playground["_onOnMatchStatusChanged"]);
    }

    exit(stateMachine: FiniteStateMachine) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = Game.instance.matchManager;

        matchManager.node.off(MatchManager.EVT_PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.off(MatchManager.EVT_PLAYER_RETIRED, playground["_onPlayerRetired"]);
        matchManager.node.off(MatchManager.EVT_MATCH_STATUS_CHANGED, playground["_onOnMatchStatusChanged"]);

        playground["_onPlayerJoined"] = null;
        playground["_onPlayerRetired"] = null;
        playground["_onOnMatchStatusChanged"] = null;
    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        switch (message) {
            case Playground.MSG_PREPARE_MATCH:
                stateMachine.changeState(Playground.matchPreparingState);
                break;

            case Playground.MSG_BEGIN_MATCH:
                stateMachine.changeState(Playground.matchPlayingState);
                break;
        
            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
