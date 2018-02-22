import {
    window,
    commands,
    Disposable,
    TextDocument,
    StatusBarItem,
    ExtensionContext,
    StatusBarAlignment
} from 'vscode';

export function activate(context: ExtensionContext) {

    const OrderingButtons = new OrderingButtonController();

    const dispUp = commands.registerCommand('extension.orderUp', () => {
        OrderingButtons.orderUp();
    });

    const dispDown = commands.registerCommand('extension.orderDown', () => {
        OrderingButtons.orderDown();
    });

    context.subscriptions.push(dispUp);
    context.subscriptions.push(dispDown);
    context.subscriptions.push(OrderingButtons);
}

class OrderingButton {
    private _editor;
    private _statusBarItem: StatusBarItem;

    constructor(command, text) {

        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.command = command;
            this._statusBarItem.text = text;
        }

        this._switchStatusBarItem(this._getEditor());
    }

    private _getEditor() {
        return this._editor = window.activeTextEditor;
    }

    private _switchStatusBarItem(value) {
        if (value) {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    private _getParts() {
        let text = this._editor.document.getText(this._editor.selection);
        return text.split('\n');
    }

    private _updateText(newText) {
        this._editor.edit(builder => {
            for (const selection of this._editor.selections) {
                builder.replace(selection, newText);
            }
        });
    }

    public orderUp() {
        this._getEditor();
        let parts = this._getParts();        

        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts.length; j++) {
                if (parts[i].length < parts[j].length) {
                    let x = parts[i];
                    parts[i] = parts[j];
                    parts[j] = x;
                }
            }
        }

        this._updateText(parts.join('\n'));
    }

    public orderDown() {
        this._getEditor();
        let parts = this._getParts();        

        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts.length; j++) {
                if (parts[i].length > parts[j].length) {
                    let x = parts[i];
                    parts[i] = parts[j];
                    parts[j] = x;
                }
            }
        }

        this._updateText(parts.join('\n'));
    }

    public checkForShowing() {
        const editor = this._getEditor();
        this._switchStatusBarItem(editor.document.getText(editor.selection).length > 0);
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class OrderingButtonController {
    private _buttonUp: OrderingButton;
    private _buttonDown: OrderingButton;
    private _disposable: Disposable;

    constructor() {
        this._buttonUp = new OrderingButton('extension.orderUp', 'Order Up');
        this._buttonDown = new OrderingButton('extension.orderDown', 'Order Down');

        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    public orderUp() {
        this._buttonUp.orderUp();
    }

    public orderDown() {
        this._buttonDown.orderDown();
    }

    private showButtons() {
        this._buttonUp.checkForShowing();
        this._buttonDown.checkForShowing();
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this.showButtons();
    }
}