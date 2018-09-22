import NetworkManager from "./NetworkManager";
import GameLoader from "./GameLoader";
import MatchManager from "./MatchManager";
import Playground from "../Gameplay/Playground/Playground";
import PlayerDataManager from "./PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
   
    static instance:GameManager = null;

    @property(GameLoader)
    gameLoader:GameLoader = null;

    networkManager:NetworkManager = null;
    
    playerDataManager:PlayerDataManager = null;
    matchManager:MatchManager = null;

    playground:Playground = null;

    onLoad() {
        GameManager.instance = this;
        cc.game.addPersistRootNode(this.node);
    }

    start() {
        this.networkManager = this.getComponent(NetworkManager);
        this.playerDataManager = this.getComponent(PlayerDataManager);
        this.matchManager = this.getComponent(MatchManager);

        this.gameLoader.node.on(GameLoader.MSG_LOADING_SUCCESS, this.login, this);
        this.gameLoader.load();
    }

    login () {
        this.playerDataManager.playerId = "a";

        cc.director.loadScene("MainScene")
    }

    play () {
        this.matchManager.setMatch("");
        
        cc.director.loadScene("IslandsScene");
    }
}
