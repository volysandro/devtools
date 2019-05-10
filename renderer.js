

const fs = require('fs');
const homedir = require('os').homedir();
const remote = require('electron').remote;

const viewProjectsBtn = document.getElementById('viewProjectsBtn');
if (viewProjectsBtn){

    viewProjectsBtn.addEventListener('click', openProjectsPage)
}
var mainWindow = remote.getCurrentWindow();

function openProjectsPage(){
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
    height: 800,
    width: 1200
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

        var window = remote.getCurrentWindow();
        window.close();
        openProjectsPage();
      }
else{
      let newFileData = {
        "projects": [
          
        ]
      }

      fs.writeFile(projectsFileDir, JSON.stringify(newFileData), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
        let rawcontent = fs.readFileSync(projectsFileDir)
        let content = JSON.parse(rawcontent);
        content.projects.push(newProject)
        console.log(content);
        //...
        let writeContent = JSON.stringify(content, null, 2);
        fs.writeFileSync(projectsFileDir, writeContent);

        var window = remote.getCurrentWindow();
        window.close();
        openProjectsPage();

      }); 



    }


    

    
}

}









// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.







