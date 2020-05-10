const { app } = require('electron');
app.commandLine.appendSwitch ("disable-http-cache");
const fileUrl = require('file-url');
const BrowserLikeWindow = require('../index');
const {PythonShell} = require('python-shell');
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exec = require('child_process').exec

let browser;

function createWindow() {
  browser = new BrowserLikeWindow({
    controlHeight: 99,
    controlPanel: fileUrl(`${__dirname}/renderer/control.html`),
    startPage: 'http://localhost:50000',
    blankTitle: 'New tab',
    //debug: true // will open controlPanel's devtools
  });

  browser.on('closed', () => {
    browser = null;
  });
}

app.on('ready', async () => {
  PythonShell.run(`${__dirname}/Ellpedia/jp/webapp.py`, null, function (err, result) {
    if (err) throw err;
    console.log(result)});
  PythonShell.run(`${__dirname}/Ellpedia/en/webapp.py`, null, function (err, result) {
    console.log(result)});
  PythonShell.run(`${__dirname}/Ellpedia/academic/webapp.py`, null, function (err, result) {
    if (err) throw err;
    console.log(result)});
  PythonShell.run(`${__dirname}/Ellpedia/ellza/webapp.py`, null, function (err, result) {
    if (err) throw err;
    console.log(result)});
    await _sleep(1000);
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
    exec('pkill -KILL -f "webapp.py"');
    app.quit();
  //}
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (browser === null) {
    createWindow();
  }
});
