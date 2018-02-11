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

    let upButton = new StatusButton('up');
    let downButton = new StatusButton('down');
    let upController = new StatusButtonController(upButton);
    let downController = new StatusButtonController(downButton);

    var disposable = commands.registerCommand('extension.orderUp', () => {
        upButton.order();
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(upController);
    context.subscriptions.push(upButton);
    context.subscriptions.push(downController);
    context.subscriptions.push(downButton);
}

class StatusButton {
    constructor(type) {
        this.type = type;
    }

    private type = '';
    private editor = window.activeTextEditor;
    private _statusBarItem: StatusBarItem;

    public initialize() {

        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.command = 'extension.orderUp';
            this._statusBarItem.text = this.type == 'up' ? 'Order Up' : 'Order Down';
        }

        if (!this.editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = this.editor.document;

        if (doc.languageId === "markdown") {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public order() {
        var selection = this.editor.selection;
        var text = this.editor.document.getText(selection);

        var parts = text.split('\n');
        parts.map((p, i) => {
            console.log(p, i, p.length);
        });

        for (let i = 0; i < parts.length; i++) {
            for (let j = 0; j < parts.length; j++) {
                let x = parts[i];
                if (parts[i].length < parts[j].length) {
                    parts[i] = parts[j];
                    parts[j] = x;
                }
            }
        }

        const newText = parts.join('\n');

        this.editor.edit(builder => {
            for (const selection of this.editor.selections) {
                window.showInformationMessage('Lines ordered');
                builder.replace(selection, newText);
            }
        });
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class StatusButtonController {

    private _statusButton: StatusButton;
    private _disposable: Disposable;

    constructor(StatusButton: StatusButton) {
        this._statusButton = StatusButton;

        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._statusButton.initialize();

        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._statusButton.initialize();
    }
}