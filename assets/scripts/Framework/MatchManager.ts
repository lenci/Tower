import GameManager from "./GameManager";
import NetworkManager from "./NetworkManager";

const { ccclass, property } = cc._decorator;

export class MatchPlayer {

    name:string = "";
    avatar:string = "";
    lv:number = 0;

    isConnected: boolean = false;

    constructor(public id: string = "", public towerIndex: number) { }
}

@ccclass
export default class MatchManager extends cc.Component {

    static EVT_PLAYER_JOINED: string = "player joined";
    static EVT_PLAYER_LEFT: string = "player left";

    static EVT_MATCH_PREPARING: string = "match preparing";
    static EVT_MATCH_COUNTING_DOWN_FOR_BEGINNING: string = "match counting down for beginning";
    static EVT_MATCH_BEGAN: string = "match began";
    static EVT_MATCH_ENDED: string = "match ended";
    static EVT_MATCH_DISCONNECTED: string = "match disconnected";

    matchId: string = "";
    levelId: number = -1;
    maxPlayerCount: number = 0;

    players: MatchPlayer[] = null;

    private host: string = "";

    setMatch(matchInformation: string) {
        this.matchId = "";
        this.levelId = 1;
        this.maxPlayerCount = 3;
        this.host = GameManager.instance.playerDataManager.id;

        this.players = [];
    }

    async createMatch(levelId: number, maxPlayerCount: number): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.matchId = "";
                this.levelId = levelId;
                this.maxPlayerCount = maxPlayerCount;
                this.host = GameManager.instance.playerDataManager.id;
            }, 200);

            resolve(0);
        });

        return promise;
    }

    async enterMatch(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.addPushListener()

            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                let player: MatchPlayer = new MatchPlayer("b", 0);
                player.name = "XXX";
                this.addPlayer(player);

                this.node.emit(MatchManager.EVT_MATCH_PREPARING);

                resolve(0);
            }, 200);

        });

        return promise;
    }

    async leaveMatch() {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.removePushListener()

            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                resolve(0);
            }, 200);
        });
    }

    async join(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                let player: MatchPlayer = new MatchPlayer(GameManager.instance.playerDataManager.id, 1);
                player.name = "HELLO";
                this.addPlayer(player);

                resolve(0);
            }, 200);
        });

        return promise;
    }

    async quit(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.removePlayer(GameManager.instance.playerDataManager.id);

                resolve(0);
            });
        });

        return promise;
    }

    private addPlayer(player: MatchPlayer): MatchPlayer {
        this.players.push(player);

        this.node.emit(MatchManager.EVT_PLAYER_JOINED, player);

        return player;
    }

    private removePlayer(playerId: string): MatchPlayer {
        let player: MatchPlayer = null;
        this.players.every((player, index) => {
            if (player.id == playerId) {
                player = this.players.splice(index, 1)[0];

                this.node.emit(MatchManager.EVT_PLAYER_LEFT, player);

                return false;
            }

            return true;
        });

        return player;
    }

    get playerNum(): number {
        return this.players.length;
    }

    get isMyMatch(): boolean {
        return GameManager.instance.playerDataManager.id == this.host;
    }
}
