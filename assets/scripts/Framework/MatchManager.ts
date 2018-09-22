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

export enum MatchStatus {
    Out,
    Preparing,
    CountingDownForBeginning,
    Playing,
    Over,
    Disconnected,
}

@ccclass
export default class MatchManager extends cc.Component {

    static EVT_PLAYER_JOINED: string = "player joined";
    static EVT_PLAYER_LEFT: string = "player left";

    static EVT_MATCH_STATUS_CHANGED: string = "match status changed";

    matchId: string = "";
    levelId: number = -1;
    maxPlayerCount: number = 0;

    players: MatchPlayer[] = null;

    private _host: string = "";

    private _status:MatchStatus = MatchStatus.Out;

    setMatch(matchInformation: string) {
        this.matchId = "";
        this.levelId = 1;
        this.maxPlayerCount = 3;

        this.players = [];

        this._host = GameManager.instance.playerDataManager.id;
    }

    async createMatch(levelId: number, maxPlayerCount: number): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.matchId = "";
                this.levelId = levelId;
                this.maxPlayerCount = maxPlayerCount;
                this._host = GameManager.instance.playerDataManager.id;
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

                this.status = MatchStatus.Preparing;

                resolve(0);
            }, 200);

        });

        return promise;
    }

    async leaveMatch() {
        let promise: Promise<number> = new Promise<number>(resolve => {
            this.status = MatchStatus.Out;

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
        return GameManager.instance.playerDataManager.id == this._host;
    }

    private get status(): MatchStatus {
        return this._status;
    }

    private set status(status:MatchStatus) {
        if (status != this._status) {
            this._status = status;
            this.node.emit(MatchManager.EVT_MATCH_STATUS_CHANGED, this._status);
        }
    }


}
