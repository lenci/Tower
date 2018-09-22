import GameManager from "./GameManager";
import NetworkManager from "./NetworkManager";

const { ccclass, property } = cc._decorator;

export class MatchPlayer {

    isConnected:boolean = false;

    constructor(public playerId: string = "", public towerIndex: number) { }
}

@ccclass
export default class MatchManager extends cc.Component {

    static PLAYER_JOINED:string = "player joined";
    static PLAYER_LEFT:string = "player left";
    
    static MATCH_READY:string = "match ready";
    static MATCH_BEGAN:string = "match began";
    static MATCH_ENDED:string = "match ended";

    matchId: string = "";
    levelId: number = -1;
    maxPlayerCount:number = 0;

    players: MatchPlayer[] = null;

    private host:string = "";

    setMatch(matchInformation:string) {
        this.matchId = "";
        this.levelId = 1;
        this.maxPlayerCount = 3;
        this.host = GameManager.instance.playerDataManager.playerId;

        this.players = [];
    }

    async createMatch(levelId:number, maxPlayerCount:number):Promise<number> {
        let promise:Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.matchId = "";
                this.levelId = levelId;
                this.maxPlayerCount = maxPlayerCount;
                this.host = GameManager.instance.playerDataManager.playerId;
            }, 200);

            resolve(0);
        });

        return promise;
    }

    async enterMatch():Promise<number> {
        let promise:Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.addPushListener()

            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.addPlayer("b", 0);
                resolve(0);
            }, 200);

        });

        return promise;
    }

    async leaveMatch() {
        let promise:Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.removePushListener()

            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                resolve(0);
            }, 200);
        });
    }

    async join():Promise<number> {
        let promise:Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.addPlayer(GameManager.instance.playerDataManager.playerId, 1);

                resolve(0);
            }, 200);
        });

        return promise;
    }

    async quit():Promise<number> {
        let promise:Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.removePlayer(GameManager.instance.playerDataManager.playerId);

                resolve(0);
            }
        });

        return promise;
    }

    private addPlayer(playerId: string, towerIndex:number):MatchPlayer {
        let player: MatchPlayer = new MatchPlayer(playerId, towerIndex);
        this.players.push(player);

        this.node.emit(MatchManager.PLAYER_JOINED, player);

        return player;
    }

    private removePlayer(playerId: string):MatchPlayer {
        let player:MatchPlayer = null;
        this.players.every((player, index) => {
            if (player.playerId == playerId) {
                player = this.players.splice(index, 1)[0];

                this.node.emit(MatchManager.PLAYER_LEFT, player);

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
        return GameManager.instance.playerDataManager.playerId == this.host;
    }
}
