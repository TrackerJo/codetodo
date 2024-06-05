
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	item.text = "$(checklist) Add Todo";
	item.command = 'codetodo.addTodo';
	item.show();

	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider("codetodo-sidebar", sidebarProvider)
	);
  

	context.subscriptions.push( vscode.commands.registerCommand('codetodo.helloWorld', () => {
		
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push( vscode.commands.registerCommand('codetodo.refresh', () => {
		
		HelloWorldPanel.kill();
		HelloWorldPanel.createOrShow(context.extensionUri);
		setTimeout(() => {
			vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
		}, 500);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codetodo.askQuestion', async () => {
		const answer = await vscode.window.showInformationMessage('How was your day?', "Good", "Bad");
		if (answer === "Good") {
			vscode.window.showInformationMessage('Great to hear that!');
		} else if (answer === "Bad") {
			vscode.window.showInformationMessage('That is sad to hear!');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codetodo.addTodo', async () => {
		const userResponse = await vscode.window.showInputBox({
			placeHolder: 'Type in your todo item'
		  });
		  if (!userResponse) {
			return;
		  }
		  sidebarProvider._view?.webview.postMessage({
			type: 'new-todo',
			value: userResponse
		  });
	}));
}


export function deactivate() {}
