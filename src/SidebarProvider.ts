import * as vscode from "vscode";

import { getNonce } from "./getNonce";
import { GlobalStorageService } from "./storage";


export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  _storage: GlobalStorageService;

  constructor(private readonly _extensionUri: vscode.Uri, storage: GlobalStorageService) {
    this._storage = storage;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }

        case "get-project": {
          const project = vscode.workspace.name;
          const todos = this._storage.getValue<Object[]>(project + "-todos") || [];
          const globalTodos = this._storage.getValue<Object[]>("global-todos") || [];
          webviewView.webview.postMessage({
            type: "project",
            name: project,
            value: todos,
            globalTodos: globalTodos
          });
          break;
        }

        case "save-todos": {
          const project = data.name;
          
          this._storage.setValue(project + "-todos", data.value);
          
          break;
        }

        case "save-global-todos": {

          
          this._storage.setValue("global-todos", data.value);
          
          break;
        }
        
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
      );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const styleCodeToDoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "codetodo.css")
    );

    const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));

    

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
			
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
      webview.cspSource
    }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${codiconsUri}" rel="stylesheet">
        <link href="${styleCodeToDoUri}" rel="stylesheet">

       
			</head>
      <body>
      <div class="main-window">
      <div class="todo-window">
          <form id="todo-form">
              <input type="text" id="todo-input"> 
          </form>
  
          <div id="todo-list">
  
          </div>
      </div>
      <div class="more-options">
      <div class="pane vertical completed-tasks-pane">
      <div class="pane-header">
          <div class="codicon codicon-chevron-right indicator"></div>
          <h3 class="title">Completed Tasks</h3>
      </div>
  </div>
  
  <div class="content completed-todo-list-content">
      <div id="completed-todo-list">

      </div>
  </div>
  <div class="pane vertical global-tasks-pane">
  <div class="pane-header">
      <div class="codicon codicon-chevron-right indicator"></div>
      <h3 class="title">Global Tasks</h3>
  </div>
</div>

<div class="content global-tasks-content">
<form id="global-todo-form">
<input type="text" id="global-todo-input"> 
</form>
  <div id="global-tasks-list">
     
  </div>
</div>
<div class="pane vertical completed-global-tasks-pane">
<div class="pane-header">
    <div class="codicon codicon-chevron-right indicator"></div>
    <h3 class="title">Completed Global Tasks</h3>
</div>
</div>

<div class="content completed-global-tasks-content">

<div id="completed-global-tasks-list">
   
</div>
</div>
      </div>
  </div>

        <script src="${scriptUri}" nonce="${nonce}"></script>
			
			</body>
			</html>`;
  }
}