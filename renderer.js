var StaticServer = require('static-server');

let newFileData = {
  "projects": [
    
  ],
  "variables": [
    {
    terminalEmulator: 'x-terminal-emulator -e ',
    quotes: true
    }
  ],

  "colorsets": [
    {
      background: "linear-gradient(to bottom, #C39BE8, #FFFFFF)",
      basecolor: "#FFFFFF",
      cardscolor: "#FFFFFF",
      mainfont: "#6200FF",
      secondaryfont: "#3700B3",
      iconsmain: "#FFFFFF",
      iconssecondary: "#6200FF",
      iconsbgmain: "#FFFFFF",
      iconsbgsecondary: "#6200FF"
    },
    {
      background: "linear-gradient(315deg, #000000 0%, #414141 74%)",
      basecolor: "#212121",
      cardscolor: "#424242",
      mainfont: "#FFFFFF",
      secondaryfont: "#3700B3",
      iconsmain: "#FFFFFF",
      iconssecondary: "#FFFFFF",
      iconsbgmain: "#424242",
      iconsbgsecondary: "#6200FF"
    }
  ],
  activeColor: 0
  
}


const fs = require('fs');
const homedir = require('os').homedir();
const remote = require('electron').remote;

const viewProjectsBtn = document.getElementById('viewProjectsBtn');
if (viewProjectsBtn){

    viewProjectsBtn.addEventListener('click', openProjectsPage)
}
var mainWindow = remote.getCurrentWindow();

function openProjectsPage(){
    updateConfig();
    mainWindow.maximize()
    mainWindow.loadURL('file://' + __dirname + '/allprojects.html')
}


console.log(mainWindow)


console.log(homedir)

const { dialog } = remote;
console.log(dialog)

function selectDirectory() {

    var dir = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    console.log(dir);
    sessionStorage.setItem("path", dir)
    document.getElementById('inppath').value = dir;

    if (process.platform !== 'win32'){
      var dirParts = dir.toString().split('/')

    }else{
      var dirParts = dir.toString().split('\\')

    }


      document.getElementById('inptitle').value = dirParts[dirParts.length-1];



  }

const button = document.getElementById('newProjectBtn');
if(button){
    button.addEventListener('click', () => {
      createBrowserWindow();
    });

}

function createBrowserWindow() {
  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  const win = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true
      },
    height: 600,
    width: 600
  });

  win.loadURL('file://' + __dirname + '/newproject.html');
  


  function closeWindow(){
      win.close()
  }


}


const directoryBtn = document.getElementById('choosepath')
if (directoryBtn){
  directoryBtn.addEventListener('click', selectDirectory)
}

const initProject = document.getElementById('initProject');
if(initProject){
    initProject.addEventListener('click', initializeProject);

}

function initializeProject(){
    var pathValue = document.getElementById('inppath').value;
    var nameValue = document.getElementById('inptitle').value;

if (pathValue == 0){
    document.getElementById('pathError').innerHTML = "Enter a path!";
}

if (pathValue != 0){
    document.getElementById('pathError').innerHTML = "";



    if (process.platform !== 'win32'){
        var finalPath = document.getElementById('inppath').value + '/';
        
      }else{
        var finalPath = document.getElementById('inppath').value + '\\';

      }

    

    if (document.getElementById('inptitle').value == 0){
      
      if (process.platform !== 'win32'){
        var pathParts = finalPath.split('/')

      }else{
        var pathParts = finalPath.split("\\")
      }
      var finalTitle = pathParts[pathParts.length-1];
      document.getElementById('inptitle').value = finalTitle;
      
    }




    else{
        var finalTitle = document.getElementById('inptitle').value;
    }

    var projectConfigPath




      projectConfigPath = finalPath + '.devtools-config.json'
      console.log(projectConfigPath)
  






    var newProject = {
        title: finalTitle,
        path: finalPath,
        configpath: projectConfigPath,
        initialized: false
    }

    console.log(newProject);
    var projectsFileDir
    if (process.platform !== 'win32'){
      projectsFileDir = homedir + '/.devtools.json'
      console.log(projectsFileDir)
    }else{
      projectsFileDir = homedir + '\\.devtools.json'
      console.log(projectsFileDir)
    }


      if (fs.existsSync(projectsFileDir)) {
        //file exists
        //einlesen:
        let rawcontent = fs.readFileSync(projectsFileDir)
        let content = JSON.parse(rawcontent);
        content.projects.push(newProject)
        console.log(content);
        //...
        let writeContent = JSON.stringify(content, null, 2);
        fs.writeFileSync(projectsFileDir, writeContent);
        updateConfig()
        var window = remote.getCurrentWindow();
        window.close();
        openProjectsPage();
      }
else{

        fs.writeFile(projectsFileDir, JSON.stringify(newFileData), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
        let rawcontent = fs.readFileSync(projectsFileDir)
        let content = JSON.parse(rawcontent);
        content.projects.push(newProject);
        console.log(content);
        //...
        let writeContent = JSON.stringify(content, null, 2);
        fs.writeFileSync(projectsFileDir, writeContent);

        
      }); 
      
      mainWindow.maximize()
      mainWindow.loadURL('file://' + __dirname + '/allprojects.html')


    }




    
}

}



function updateConfig(){


  var projectsFileDir
  if (process.platform !== 'win32'){
    projectsFileDir = homedir + '/.devtools.json'
    console.log(projectsFileDir)
  }else{
    projectsFileDir = homedir + '\\.devtools.json'
    console.log(projectsFileDir)
  }



    newColors = newFileData.colorsets;

    let rawcontent = fs.readFileSync(projectsFileDir)
    let content = JSON.parse(rawcontent);

    if (content.colorsets != newColors){
      content.colorsets = newColors;
    }

    if (!content.activeColor){
      content.activeColor = newFileData.activeColor;
    }

    let updateContent = JSON.stringify(content, null, 2);
    fs.writeFileSync(projectsFileDir, updateContent);


}


const quickWebserverBtn = document.getElementById('quickWebserverBtn')
const Swal = require('sweetalert2');


if (process.platform == 'linux') {
  serverPortMessage = 'Enter port. (For your OS it has to be 1024 or higher)'
} else(serverPortMessage = 'Enter desired port: ')


quickWebserverBtn.addEventListener('click', e => {

  var serverdir = dialog.showOpenDialog({ properties: ['openDirectory'] })


  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([{
      title: 'Path to run the webserver in?',
      inputPlaceholder: serverdir
    },
    serverPortMessage,
    {
      title: 'Default file? leave empty for "index.html',
      text: 'specify without a "/"'
    }

  ]).then((result) => {

    if (!result.value) {
      remote.getCurrentWindow().reload()

    }

    if (result.value[0] == '') {
      result.value[0] = serverdir[0] + '/';

    }

    if (result.value[1] == '') {
      Swal.fire({
        title: 'You need to provide a port!',
      })

    

    } 
    
    else if (result.value) {

      console.log(result.value)

      if (result.value[0] == '') {
        remote.getCurrentWindow.reload();
      }

      if (result.value[2] == '') {
        result.value[2] = 'index.html'
      }




      var quickServer = {

        serverPath: result.value[0],
        port: result.value[1],
        defFile: result.value[2],
        name: 'really quick devtools server'

      }



      quickWebserver(quickServer);




    }
  })


})



function quickWebserver(server){

  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  const webserver = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 630,
    width: 430
  });

  webserver.setMenuBarVisibility(false)
  webserver.setResizable(false)
  webserver.loadURL('file://' + __dirname + '/runwebserver.html');
  webserver.setAlwaysOnTop(true, 'modal-panel', 1);

  webserver.webContents.on('did-finish-load', () => {


      webserver.webContents.send('server-data', server);



    }

  )


}



