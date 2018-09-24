import Game from "./GameManager";
import NetworkManager from "./NetworkManager";

const { ccclass, property } = cc._decorator;

export class MatchPlayer {

    name: string = "";
    avatar: string = "";
    lv: number = 0;

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
    static EVT_PLAYER_RETIRED: string = "player left";

    static EVT_MATCH_STATUS_CHANGED: string = "match status changed";

    matchId: string = "";
    levelId: number = -1;
    maxPlayerCount: number = 0;

    players: MatchPlayer[] = null;

    startTimestamp: number = 0;

    private _host: string = "";

    private _status: MatchStatus = MatchStatus.Out;

    setMatch(matchInformation: string) {
        this.matchId = "";
        this.levelId = 1;
        this.maxPlayerCount = 3;

        this.players = [];

        this._host = "b";
    }

    async createMatch(levelId: number, maxPlayerCount: number): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.matchId = "";
                this.levelId = levelId;
                this.maxPlayerCount = maxPlayerCount;
                this._host = Game.instance.playerDataManager.id;
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
                player.name = "Joe DiMeowgio";
                this.addPlayer(player);
                player = new MatchPlayer("c", 1);
                player.name = "Senor Don Gato";
                this.addPlayer(player);

                this.status = MatchStatus.Preparing;

                resolve(0);
            }, 200);

        });

        return promise;
    }

    async quitMatch() {
        let promise: Promise<number> = new Promise<number>(resolve => {
            this.status = MatchStatus.Out;

            // GameManager.instance.networkManager.removePushListener()

            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                resolve(0);
            }, 200);
        });
    }

    async joinMatch(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                let player: MatchPlayer = new MatchPlayer(Game.instance.playerDataManager.id, 2);
                player.name = Game.instance.playerDataManager.name;
                this.addPlayer(player);

                // listen to push
                if (this.playerCount == this.maxPlayerCount) {
                    let currentTime: Date = new Date();
                    currentTime.setSeconds(currentTime.getSeconds() + 3);
                    this.startTimestamp = currentTime.valueOf();
                    this.status = MatchStatus.CountingDownForBeginning;
                }

                resolve(0);
            }, 200);
        });

        return promise;
    }

    async retireFromMatch(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                this.removePlayer(Game.instance.playerDataManager.id);

                // listen to push
                if (MatchStatus.CountingDownForBeginning == this.status) {
                    this.startTimestamp = 0;
                    this.status = MatchStatus.Preparing;
                }

                resolve(0);
            }, 200);
        });

        return promise;
    }

    async startMatch(): Promise<number> {
        let promise: Promise<number> = new Promise<number>(resolve => {
            // GameManager.instance.networkManager.send()
            setTimeout(() => {
                let currentTime: Date = new Date();
                currentTime.setSeconds(currentTime.getSeconds() + 3);
                this.startTimestamp = currentTime.valueOf();
                this.status = MatchStatus.CountingDownForBeginning;

                resolve(0);
            }, 200);
        });

        return promise;
    }

    update(delta: number) {
        if (MatchStatus.CountingDownForBeginning == this.status && new Date().valueOf() > this.startTimestamp) {
            this.status = MatchStatus.Playing;
        }
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

                this.node.emit(MatchManager.EVT_PLAYER_RETIRED, player.id);

                return false;
            }

            return true;
        });

        return player;
    }

    get playerCount(): number {
        return this.players.length;
    }

    get isMyMatch(): boolean {
        return Game.instance.playerDataManager.id == this._host;
    }

    get hasJoined(): boolean {
        for (const player of this.players) {
            if (player.id == Game.instance.playerDataManager.id) {
                return true;
            }
        }

        return false;
    }

    get myTowerIndex(): number {
        for (const player of this.players) {
            if (player.id == Game.instance.playerDataManager.id) {
                return player.towerIndex;
            }
        }

        return -1;
    }

    get status(): MatchStatus {
        return this._status;
    }

    set status(status: MatchStatus) {
        if (status != this._status) {
            this._status = status;
            this.node.emit(MatchManager.EVT_MATCH_STATUS_CHANGED, this._status);
        }
    }


}
