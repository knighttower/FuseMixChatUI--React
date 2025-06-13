// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            // preload: path.join(__dirname, 'preload.js'), // Optional: only if you're using preload
        },
    });

    // Load your custom-built index.html from the Webpack build
    win.loadFile(path.join(__dirname, 'public/index.html'));

    // Optional: Open DevTools during development
    // win.webContents.openDevTools();
}

// App lifecycle events
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS, recreate window when dock icon is clicked and no windows are open
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    // On macOS, apps generally stay open unless explicitly quit
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
