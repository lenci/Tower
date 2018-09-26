const { ccclass, property } = cc._decorator;

@ccclass
export default class View extends cc.Component {

    private _isVisible: boolean = false;

    start() {
        this.show()
    }

    show() {
        if (!this._isVisible) {
            this._isVisible = true;
            this.onShow();
        }
    }

    hide() {
        if (this._isVisible) {
            this._isVisible = false;
            this.onHide();
        }
    }

    protected onShow() {
        this.node.active = true;
    }

    protected onHide() {
        this.node.active = false;
    }
}
