import NetworkManager from "./NetworkManager";
import GameLoader from "./GameLoader";
import MatchManager from "./MatchManager";
import Playground from "../Gameplay/Playground/Playground";
import PlayerDataManager from "./PlayerDataManager";
import InputManager from "./InputManager";
import SettingManager from "./SettingManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    static instance: Game = null;

    @property(GameLoader)
    gameLoader: GameLoader = null;

    networkManager: NetworkManager = null;
    inputManager: InputManager = null;

    playerDataManager: PlayerDataManager = null;
    matchManager: MatchManager = null;

    settingManager: SettingManager = null;

    playground: Playground = null;

    onLoad() {
        Game.instance = this;
        cc.game.addPersistRootNode(this.node);

        this.networkManager = this.getComponent(NetworkManager);
        this.inputManager = this.getComponent(InputManager);
        this.playerDataManager = this.getComponent(PlayerDataManager);
        this.matchManager = this.getComponent(MatchManager);
        this.settingManager = this.getComponent(SettingManager);
    }

    async start() {
        await this.gameLoader.load();
        await this.networkManager.connect();
        await this.playerDataManager.login();

        this.inputManager.registerAxis("translate");
        this.inputManager.registerKey("rotate");
        this.inputManager.registerKey("accelerate");

        this.settingManager.addSetting("gameControllingMethod", 1);

        cc.director.loadScene("MainScene")
    }

    play() {
        this.matchManager.setMatch("");

        cc.director.loadScene("IslandsScene");
    }
}
