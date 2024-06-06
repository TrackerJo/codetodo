
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';

import { GlobalStorageService } from './storage';

export function activate(context: vscode.ExtensionContext) {

	let storageManager = new GlobalStorageService(context.globalState);

	const sidebarProvider = new SidebarProvider(context.extensionUri, storageManager);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	item.text = "$(checklist) Add Todo";
	item.command = 'codetodo.addTodo';
	item.show();

	checkToDos(storageManager);
	checkGlobalTodos(storageManager, sidebarProvider);

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
		  const projectName = vscode.workspace.name;
		  const currentTodos = storageManager.getValue<Object[]>(projectName + '-todos') || [];
		  currentTodos.push({
			text: userResponse,
			completed: false,
			id: currentTodos.length
		  });
		  storageManager.setValue(projectName + '-todos', currentTodos);
		  
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codetodo.addGlobalTodo', async () => {
		const userResponse = await vscode.window.showInputBox({
			placeHolder: 'Type in your global todo item'
		  });
		  if (!userResponse) {
			return;
		  }
		  sidebarProvider._view?.webview.postMessage({
			type: 'new-global-todo',
			value: userResponse
		  });

		  const currentTodos = storageManager.getValue<Object[]>('global-todos') || [];
		  currentTodos.push({
			text: userResponse,
			completed: false,
			id: currentTodos.length
		  });
		  storageManager.setValue('global-todos', currentTodos);
		  
	}));
}

async function checkToDos(storageManager: GlobalStorageService){
	const projectName = vscode.workspace.name;
	if (!projectName) {
		return;
	}
	const currentTodos = storageManager.getValue<Object[]>(projectName + '-todos') || [];
	if (currentTodos.length === 0) {
		return;
	}
	
	const incompleteTodos = currentTodos.filter((todo) => !todo.completed);
	const taskWord = incompleteTodos.length === 1 ? ' task' : ' tasks';
	const response = await vscode.window.showInformationMessage('You have ' + incompleteTodos.length + taskWord + ' to complete!', 'View');
	if(response === 'View'){
		vscode.commands.executeCommand('workbench.view.extension.codetodo-sidebar-view');
	}
}

async function checkGlobalTodos(storageManager: GlobalStorageService, sidebarProvider: SidebarProvider){
	const currentTodos = storageManager.getValue<Object[]>('global-todos') || [];
	if (currentTodos.length === 0) {
		return;
	}
	
	const incompleteTodos = currentTodos.filter((todo) => !todo.completed);
	const taskWord = incompleteTodos.length === 1 ? ' global task' : ' global tasks';
	const response = await vscode.window.showInformationMessage('You have ' + incompleteTodos.length + taskWord + ' to complete!', 'View');
	if(response === 'View'){
		vscode.commands.executeCommand('workbench.view.extension.codetodo-sidebar-view');

		sidebarProvider._view?.webview.postMessage({
			type: 'view-global-todos'

		});

	}
}


export function deactivate() {}
