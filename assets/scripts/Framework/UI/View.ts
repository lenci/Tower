const {ccclass, property} = cc._decorator;

@ccclass
export default class View extends cc.Component {

    private isVisible:boolean = false;

    start() {
        this.show()
    }

    show() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.onShow();
        }
    }

    hide() {
        if (this.isVisible) {
            this.isVisible = false;
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
