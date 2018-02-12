import {
    window,
    commands,
    Disposable,
    ExtensionContext,
    StatusBarAlignment,
    StatusBarItem,
    TextDocument
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
    private editor;
    private _statusBarItem: StatusBarItem;

    constructor(editor, command, text) {

        if (!this._statusBarItem) {
            this.editor = editor;
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.command = command;
            this._statusBarItem.text = text;
        }

        if (!this.editor) {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.show();
        }
    }

    public getParts() {
        let text = this.editor.document.getText(this.editor.selection);
        return text.split('\n');
    }

    public updateText(newText) {
        this.editor.edit(builder => {
            for (const selection of this.editor.selections) {
                window.showInformationMessage('Lines ordered');
                builder.replace(selection, newText);
            }
        });
    }

    public order() {
        let parts = this.getParts();        

        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts.length; j++) {
                if (parts[i].length < parts[j].length) {
                    let x = parts[i];
                    parts[i] = parts[j];
                    parts[j] = x;
                }
            }
        }

        this.updateText(parts.join('\n'))
    }

    public checkForShowing() {
        if (this.editor.document.getText(this.editor.selection).length > 0) {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class OrderingButtonDown extends OrderingButton {
    public order() {
        let parts = this.getParts();        

        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts.length; j++) {
                if (parts[i].length > parts[j].length) {
                    let x = parts[i];
                    parts[i] = parts[j];
                    parts[j] = x;
                }
            }
        }

        this.updateText(parts.join('\n'))
    }
}

class OrderingButtonController {

    private editor = window.activeTextEditor;
    private _buttonUp: OrderingButton;
    private _buttonDown: OrderingButton;
    private _disposable: Disposable;

    constructor() {
        this._buttonUp = new OrderingButton(this.editor, 'extension.orderUp', 'Order Up');
        this._buttonDown = new OrderingButtonDown(this.editor, 'extension.orderDown', 'Order Down');

        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    public orderUp() {
        this._buttonUp.order();
    }

    public orderDown() {
        this._buttonDown.order();
    }

    showButtons() {
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