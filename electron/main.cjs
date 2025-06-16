const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, './preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            // sandbox: true,
        },
    });

    const indexPath = path.resolve(__dirname, '../public/index.html');

    if (fs.existsSync(indexPath)) {
        mainWindow.loadFile(indexPath);
        // mainWindow.webContents.openDevTools();
    } else {
        console.error('index.html not found');
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
