import {
    commands,
    ExtensionContext,
} from 'vscode';
import OrderingButtonController from './OrderingButtonController';

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
