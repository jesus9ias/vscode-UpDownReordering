import {
  window,
  Disposable
} from 'vscode';
import OrderingButton from './OrderingButton';

class OrderingButtonController {
    private _disposable: Disposable;
    private _buttonUp: OrderingButton;
    private _buttonDown: OrderingButton;

    constructor() {
        this._buttonUp = new OrderingButton('extension.orderUp', 'Order Up');
        this._buttonDown = new OrderingButton('extension.orderDown', 'Order Down');

        let subscriptions: Disposable[] = [];
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    private showButtons() {
        this._buttonUp.checkForShowing();
        this._buttonDown.checkForShowing();
    }

    private _onEvent() {
        this.showButtons();
    }

    public orderUp() {
        this._buttonUp.orderUp();
    }

    public orderDown() {
        this._buttonDown.orderDown();
    }

    dispose() {
        this._disposable.dispose();
    }
}

export default OrderingButtonController;
