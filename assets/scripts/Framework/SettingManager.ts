const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingManager extends cc.Component {

    private _settings: { [key: string]: any } = {};

    public addSetting(name:string, value:any) {
        this._settings[name] = value;
    }

    public getSetting(name:string):any {
        if (null == this._settings[name]) {
            cc.error("Setting is not exist: " + name);
            return;
        }

        return this._settings[name];
    }

    public setSetting(name:string, value:any) {
        if (null == this._settings[name]) {
            cc.error("Setting is not exist: " + name);
            return;
        }

        this._settings[name] = value;
    }
}
