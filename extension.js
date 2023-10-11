// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nataligpt" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('nataligpt.chatGPT', async () => {
          const userInput = await vscode.window.showInputBox({
            placeHolder: 'Type your message to ChatGPT',
          });
      
          if (userInput) {
            const response = await sendToChatGPT(userInput);
			// Get the workspace folder for the currently open workspace.
            const workspaceFolder = vscode.workspace.workspaceFolders[0]; // Assumes the first workspace folder.
			// Save response to file
			if (workspaceFolder) {
				const filePath = vscode.Uri.joinPath(workspaceFolder.uri, 'ChatGPT_Response.txt');
				vscode.workspace.fs.writeFile(filePath, Buffer.from(response))
				.then(() => {
					vscode.window.showInformationMessage('File written to the workspace.');
				  })
				  .catch((error) => {
					vscode.window.showErrorMessage('Error writing the file: ' + error.message);
				  });
			} else { 
				vscode.window.showErrorMessage('No workspace folder found.');
			}
		 }
        })
      );
	
	
}

async function sendToChatGPT(text) {
	// const openaiApiKey = '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';
	// Get the API session token from the extension's configuration
	const config = vscode.workspace.getConfiguration('nataligpt');
	const openaiApiKey = config.get('API Key');
	
	if (!openaiApiKey) {
		vscode.window.showErrorMessage('Please set your OpenAI API key in the extension settings.');
	}

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				  'Content-Type': 'application/json',
				  'Authorization': `Bearer ${openaiApiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [{"role": "user", "content": text}]
			})
		})
	
		const data = await response.json()
    	return data.choices[0].message.content

	  } catch (error) {
		console.error('Error sending request to ChatGPT:', error);
		return 'An error occurred while connecting to ChatGPT.';
	  }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
