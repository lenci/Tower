import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import Playground from "../Playground";
import MatchManager, { MatchPlayer } from "../../../Framework/MatchManager";
import GameManager from "../../../Framework/GameManager";

export default class PlaygroundMatchPreparingState extends FiniteStateMachineState {

    async enter(stateMachine: FiniteStateMachine, ...args) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = GameManager.instance.matchManager;
        
        playground["_onPlayerJoined"] =  (player:MatchPlayer) => {
            playground.createTower(player, player.towerIndex);
        }
        playground["_onPlayerLeft"] =  (player:MatchPlayer) => {
            playground.destroyTower(player);
        }
        playground["_onOnMatchReady"] =  (player:MatchPlayer) => {
            stateMachine.telegram(Playground.MSG_MATCH_READY);
        }

        matchManager.node.on(MatchManager.EVT_PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.on(MatchManager.EVT_PLAYER_LEFT, playground["_onPlayerLeft"]);
        matchManager.node.on(MatchManager.EVT_MATCH_READY, playground["_onOnMatchReady"]);

        if (0 != await matchManager.join()) {
            return;
        }
    }

    exit(stateMachine: FiniteStateMachine) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = GameManager.instance.matchManager;

        matchManager.node.off(MatchManager.EVT_PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.off(MatchManager.EVT_PLAYER_LEFT, playground["_onPlayerLeft"]);
        matchManager.node.off(MatchManager.EVT_PLAYER_LEFT, playground["_onOnMatchReady"]);

        playground["_onPlayerJoined"] = null;
        playground["_onPlayerLeft"] = null;
        playground["_onOnMatchReady"] = null;
    }

    onTelegram(stateMachine: FiniteStateMachine, message:string, ...args) {
        switch (message) {
            case Playground.MSG_MATCH_READY:
                stateMachine.changeState(Playground.matchReadyState);
                break;
        
            default:
                break;
        }
    }
}
