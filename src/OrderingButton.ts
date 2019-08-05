import {
  window,
  TextEditor,
  StatusBarItem,
  TextEditorEdit,
  StatusBarAlignment
} from 'vscode';

class OrderingButton {
    private _editor: TextEditor;
    private _statusBarItem: StatusBarItem;

    constructor(command: string, text: string) {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
            this._statusBarItem.text = text;
            this._statusBarItem.command = command;
        }
        this._setEditor();
        this._switchStatusBarItem(this._getEditorSelection().length > 0);
    }

    private _setEditor() {
        this._editor = window.activeTextEditor;
    }

    private _getEditorSelection() {
        return this._editor.document.getText(this._editor.selection) || '';
    }

    private _switchStatusBarItem(value: boolean) {
        if (value) {
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    private _getParts() {
        let text = this._getEditorSelection();
        return text.split('\n');
    }

    private _updateText(newText: string) {
        this._editor.edit((builder: TextEditorEdit) => {
            for (const selection of this._editor.selections) {
                builder.replace(selection, newText);
            }
        });
    }

    public orderUp() {
        this._setEditor();
        let parts = this._getParts().map((p: string) => p.trim());        

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
        this._setEditor();
        let parts = this._getParts().map((p: string) => p.trim());        

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
        this._setEditor();
        this._switchStatusBarItem(this._getEditorSelection().length > 0);
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

export default OrderingButton;
