import NetworkManager from "./NetworkManager";
import GameLoader from "./GameLoader";
import MatchManager from "./MatchManager";
import Playground from "../Gameplay/Playground/Playground";
import PlayerDataManager from "./PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
   
    static instance:Game = null;

    @property(GameLoader)
    gameLoader:GameLoader = null;

    networkManager:NetworkManager = null;
    
    playerDataManager:PlayerDataManager = null;
    matchManager:MatchManager = null;

    playground:Playground = null;

    onLoad() {
        Game.instance = this;
        cc.game.addPersistRootNode(this.node);

        this.networkManager = this.getComponent(NetworkManager);
        this.playerDataManager = this.getComponent(PlayerDataManager);
        this.matchManager = this.getComponent(MatchManager);
    }

    async start() {
        await this.gameLoader.load();
        await this.networkManager.connect();
        await this.playerDataManager.login();

        cc.director.loadScene("MainScene")
    }

    play () {
        this.matchManager.setMatch("");
        
        cc.director.loadScene("IslandsScene");
    }
}
