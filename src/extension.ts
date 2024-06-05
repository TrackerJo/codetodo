
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "codetodo" is now active!');

	context.subscriptions.push( vscode.commands.registerCommand('codetodo.helloWorld', () => {
		
		vscode.window.showInformationMessage('Hello World from CodeToDo!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codetodo.askQuestion', () => {
		vscode.window.showInformationMessage('How was your day?', "Good", "Bad");
	}));
}


export function deactivate() {}
