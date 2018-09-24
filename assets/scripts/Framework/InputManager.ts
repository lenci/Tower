const { ccclass, property } = cc._decorator;

@ccclass
export default class InputManager extends cc.Component {

    private _keys: { [key: string]: boolean } = {};
    private _axes: { [key: string]: number } = {};

    registerKey(name: string) {
        this._keys[name] = false;
    }

    registerAxis(name: string) {
        this._axes[name] = 0;
    }

    getKey(name: string): boolean {
        return this._keys[name];
    }

    getAxis(name: string): number {
        return this._axes[name];
    }

    triggerKey(name: string) {
        if (null == this._keys[name]) {
            cc.error("key is not exist: " + name);
            return;
        }

        this._keys[name] = true;
    }

    addAxis(name: string, value: number) {
        if (null == this._axes[name]) {
            cc.error("axis is not exist: " + name);
            return;
        }

        this._axes[name] = this._axes[name] + value;
    }

    lateUpdate() {
        for (let name in this._keys) {
            this._keys[name] = false;
        }
        for (let name in this._axes) {
            this._axes[name] = 0;
        }
    }
}
