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

        matchManager.node.on(MatchManager.PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.on(MatchManager.PLAYER_LEFT, playground["_onPlayerLeft"]);

        if (0 != await matchManager.join()) {
            return;
        }
    }

    exit(stateMachine: FiniteStateMachine) {
        let playground: Playground = <Playground>(stateMachine.owner);

        let matchManager:MatchManager = GameManager.instance.matchManager;

        matchManager.node.off(MatchManager.PLAYER_JOINED, playground["_onPlayerJoined"]);
        matchManager.node.off(MatchManager.PLAYER_LEFT, playground["_onPlayerLeft"]);

        playground["_onPlayerJoined"] = null;
        playground["_onPlayerLeft"] = null;
    }
}
