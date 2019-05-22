const fs = require('fs');
const homedir = require('os').homedir();
const remote = require('electron').remote;
const {
  shell
} = require('electron');
var Sugar = require('sugar');
const Swal = require('sweetalert2');





document.getElementById('btnExpandableRunAll').addEventListener('click', e => {
  runEverything()
})

document.getElementById('btnExpandableDelete').addEventListener('click', e => {
  deleteProject()
})

document.getElementById('btnExpandableJson').addEventListener('click', e => {
  openConfig()
})

document.getElementById('btnExpandableFolder').addEventListener('click', e => {
  openDirectory()
})

document.getElementById('btnExpandableColor').addEventListener('click', e => {
  changeColor()
})


document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'bottom'
  });

  if (sessionStorage.getItem('runRightAway')) {
    runEverything()
    sessionStorage.removeItem('runRightAway')
  }
});

console.log(sessionStorage.getItem('project'))
const loadTitle = sessionStorage.getItem('project')

var projectsFileDir
if (process.platform !== 'win32') {
  projectsFileDir = homedir + '/.devtools.json'
  console.log(projectsFileDir)
} else {
  projectsFileDir = homedir + '\\.devtools.json'
  console.log(projectsFileDir)
}


const btnAddCommand = document.getElementById('addCommand')
const btnAddServer = document.getElementById('addServer')
const btnAddProgram = document.getElementById('addProgram')

let rawcontent = fs.readFileSync(projectsFileDir)
let jsonfile = JSON.parse(rawcontent);
let projects = jsonfile.projects;
let newConfig = JSON.stringify({
  tools: [],
  commands: [],
  servers: []
})


let activeColor = jsonfile.colorsets[jsonfile.activeColor];
console.log(activeColor);


for (var i = 0; i < projects.length; i++) {
  if (projects[i]['title'] === loadTitle) {
    activeProject = projects[i]
  }
}

if (fs.existsSync(activeProject.configpath)) {

} else {
  document.getElementById('onAlert').hidden = false;

  Swal.fire({
    title: 'Initialize project?',
    text: "Config file not found, initialize in project directory?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.value) {

      fs.writeFileSync(activeProject.configpath, newConfig)

      Swal.fire(
        'Nice!',
        'Project initialized!',
        'success'
      )

      remote.getCurrentWindow().reload()
    } else {
      remote.getCurrentWindow().loadURL('file://' + __dirname + '/allprojects.html')

    }
  })
}

console.log(activeProject)


const backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', e => {

  remote.getCurrentWindow().loadURL('file://' + __dirname + '/allprojects.html')

})


infocontainer = document.getElementById('infocontainer')
programscontainer = document.getElementById('programscontainer')
servercontainer = document.getElementById('servercontainer')
scriptscontainer = document.getElementById('scriptscontainer')

remote.getCurrentWindow().maximize()

document.getElementById('projectTitle').innerHTML = activeProject.title
if (activeProject.path.length > 43) {
  document.getElementById('projectDescription').innerHTML = activeProject.path.substring(0, 43) + '...'

} else {
  document.getElementById('projectDescription').innerHTML = activeProject.path

}



rawConfig = fs.readFileSync(activeProject.configpath)
projectConfig = JSON.parse(rawConfig)


rawConfig = fs.readFileSync(activeProject.configpath)
projectConfig = JSON.parse(rawConfig)
console.log(projectConfig)



if(projectConfig.websites){

}else{
  var websites = []
  projectConfig.websites = websites
  console.log(projectConfig)
  let writeContent = JSON.stringify(projectConfig, null, 2);
  fs.writeFileSync(activeProject.configpath, writeContent);

}


projectConfig.tools.forEach(element => {

  divcard = document.createElement('div')
  divcard.className = 'card program hoverable'
  programscontainer.appendChild(divcard)
  divcard.id = 'card_' + element.name
  divcard.style.backgroundColor = activeColor.cardscolor;


  divcontent = document.createElement('div')
  divcontent.className = 'card-content white-text'
  divcard.appendChild(divcontent)

  spantitle = document.createElement('span')
  spantitle.className = 'card-title'
  divcontent.appendChild(spantitle)
  spantitle.innerHTML = element.name
  spantitle.style.color = activeColor.mainfont


  abutton = document.createElement('a')
  abutton.className = 'btn-floating halfway-fab waves-effect waves-light buttonweirdblue'
  divcard.appendChild(abutton)
  abutton.id = 'run' + element.name

  iconRunButton = document.createElement('i')
  iconRunButton.className = 'material-icons'
  iconRunButton.innerHTML = 'flight_takeoff'
  abutton.appendChild(iconRunButton)


  removebutton = document.createElement('a')
  removebutton.className = 'btn-floating halfway-fab waves-effect waves-light red'
  divcard.appendChild(removebutton)
  removebutton.style.position = 'absolute'
  removebutton.style.left = '-20px'
  removebutton.style.top = '-20px'
  removebutton.id = 'remove' + element.name
  iconremovebutton = document.createElement('i')
  iconremovebutton.className = 'material-icons'
  iconremovebutton.innerHTML = 'delete'
  removebutton.appendChild(iconremovebutton)
  document.getElementById('remove' + element.name).style.opacity = '0';

  divcard.addEventListener("mouseover", event => {
    document.getElementById('remove' + element.name).style.opacity = '100';
  });

  divcard.addEventListener("mouseout", event => {
    document.getElementById('remove' + element.name).style.opacity = '0';

  });



  abuttonicon = document.createElement('i')
  i.className = 'material-icons'
  abutton.appendChild(abuttonicon)
  i.innerHTML = 'add'


  divcard.style.float = 'left'
  divcard.style.margin = '19px'
  divcard.style.width = '40%'




  removebutton.addEventListener('click', e => {
    rawConfig = fs.readFileSync(activeProject.configpath)
    projectConfig = JSON.parse(rawConfig)

    if (projectConfig.tools.length == 1) {
      projectConfig.tools.pop()
    } else {

      console.log(element.name)
      var filtered = projectConfig.tools.filter(function (el) {
        return el.name != element.name;
      });
      console.log(filtered)
      projectConfig.tools = filtered
      console.log(projectConfig)

    }



    let writeContent = JSON.stringify(projectConfig, null, 2);
    fs.writeFileSync(activeProject.configpath, writeContent);


    remote.getCurrentWindow().reload()
  })

  abutton.addEventListener('click', e => {

    runProgram(element)
    /*if (invokedButton.className.includes('green')){
        
        var replaced = invokedButton.className.replace('green', 'red')
        invokedButton.className = replaced
        runCommand(element);


    }else{
        var replaced = invokedButton.className.replace('red', 'green')
        invokedButton.className = replaced
        stopCommand(element);
    }*/
  })
});




projectConfig.commands.forEach(element => {

  divcard = document.createElement('div')
  divcard.className = 'card  hoverable'
  scriptscontainer.appendChild(divcard)
  divcard.id = 'card_' + element.name
  divcard.style.backgroundColor = activeColor.cardscolor;


  divcontent = document.createElement('div')
  divcontent.className = 'card-content white-text'
  divcard.appendChild(divcontent)

  spantitle = document.createElement('span')
  spantitle.className = 'card-title'
  divcontent.appendChild(spantitle)
  spantitle.innerHTML = element.name
  spantitle.style.color = activeColor.mainfont

  abutton = document.createElement('a')
  abutton.className = 'btn-floating halfway-fab waves-effect waves-light buttonweirdblue'
  divcard.appendChild(abutton)
  abutton.id = 'run' + element.name

  iconRunButton = document.createElement('i')
  iconRunButton.className = 'material-icons'
  iconRunButton.innerHTML = 'flight_takeoff'
  abutton.appendChild(iconRunButton)


  removebutton = document.createElement('a')
  removebutton.className = 'btn-floating halfway-fab waves-effect waves-light red'
  divcard.appendChild(removebutton)
  removebutton.id = 'remove' + element.name
  removebutton.style.position = 'absolute'
  removebutton.style.left = '-20px'
  removebutton.style.top = '-20px'
  iconremovebutton = document.createElement('i')
  iconremovebutton.className = 'material-icons'
  iconremovebutton.innerHTML = 'delete'
  removebutton.appendChild(iconremovebutton)
  document.getElementById('remove' + element.name).style.opacity = '0';

  divcard.addEventListener("mouseover", event => {
    document.getElementById('remove' + element.name).style.opacity = '100';
  });

  divcard.addEventListener("mouseout", event => {
    document.getElementById('remove' + element.name).style.opacity = '0';

  });


  abuttonicon = document.createElement('i')
  i.className = 'material-icons'
  abutton.appendChild(abuttonicon)
  i.innerHTML = 'add'


  divcard.style.float = 'left'
  divcard.style.margin = '19px'
  divcard.style.width = '40%'

  pdescription = document.createElement('p')
  divcontent.appendChild(pdescription)
  pdescription.innerHTML = element.command
  pdescription.style.color = activeColor.mainfont

  removebutton.addEventListener('click', e => {
    rawConfig = fs.readFileSync(activeProject.configpath)
    projectConfig = JSON.parse(rawConfig)
    var path = require('path')
    if (projectConfig.commands.length == 1) {
      projectConfig.commands.pop()

      if (process.platform == 'win32') {
        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))

        }

      } else {
        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))

        }
      }




    } else {

      if (process.platform == 'win32') {
        console.log(element.name)
        var filtered = projectConfig.commands.filter(function (el) {
          return el.name != element.name;
        });
        console.log(filtered)
        projectConfig.commands = filtered
        console.log(projectConfig)
        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))

        }

      } else {
        console.log(element.name)
        var filtered = projectConfig.commands.filter(function (el) {
          return el.name != element.name;
        });
        console.log(filtered)
        projectConfig.commands = filtered
        console.log(projectConfig)

        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))

        }

      }
    }



    let writeContent = JSON.stringify(projectConfig, null, 2);
    fs.writeFileSync(activeProject.configpath, writeContent);


    remote.getCurrentWindow().reload()
  })


  abutton.addEventListener('click', e => {
    const invokedButton = document.getElementById('run' + element.name)
    runCommand(element)

    /*if (invokedButton.className.includes('green')){
        
        var replaced = invokedButton.className.replace('green', 'red')
        invokedButton.className = replaced
        runCommand(element);


    }else{
        var replaced = invokedButton.className.replace('red', 'green')
        invokedButton.className = replaced
        stopCommand(element);
    }*/
  })
});



projectConfig.servers.forEach(element => {

  divcard = document.createElement('div')
  divcard.className = 'card server hoverable'
  servercontainer.appendChild(divcard)
  divcard.id = 'card_' + element.name
  divcard.style.backgroundColor = activeColor.cardscolor;


  divcontent = document.createElement('div')
  divcontent.className = 'card-content white-text'
  divcard.appendChild(divcontent)

  spantitle = document.createElement('span')
  spantitle.className = 'card-title'
  divcontent.appendChild(spantitle)
  spantitle.innerHTML = element.name
  spantitle.style.color = activeColor.mainfont

  abutton = document.createElement('a')
  abutton.className = 'btn-floating halfway-fab waves-effect waves-light buttonweirdblue'
  divcard.appendChild(abutton)
  abutton.id = 'server' + element.name

  iconRunButton = document.createElement('i')
  iconRunButton.className = 'material-icons'
  iconRunButton.innerHTML = 'flight_takeoff'
  abutton.appendChild(iconRunButton)

  removebutton = document.createElement('a')
  removebutton.className = 'btn-floating halfway-fab waves-effect waves-light red'
  divcard.appendChild(removebutton)
  removebutton.id = 'remove' + element.name
  removebutton.style.position = 'absolute'
  removebutton.style.left = '-20px'
  removebutton.style.top = '-20px'
  iconremovebutton = document.createElement('i')
  iconremovebutton.className = 'material-icons'
  iconremovebutton.innerHTML = 'delete'
  removebutton.appendChild(iconremovebutton)
  document.getElementById('remove' + element.name).style.opacity = '0';


  divcard.addEventListener("mouseover", event => {
    document.getElementById('remove' + element.name).style.opacity = '100';
  });

  divcard.addEventListener("mouseout", event => {
    document.getElementById('remove' + element.name).style.opacity = '0';

  });


  abuttonicon = document.createElement('i')
  i.className = 'material-icons'
  abutton.appendChild(abuttonicon)
  i.innerHTML = 'add'


  divcard.style.float = 'left'
  divcard.style.margin = '19px'
  divcard.style.width = '40%'

  pdescription = document.createElement('p')
  divcontent.appendChild(pdescription)
  pdescription.innerHTML = 'Port: ' + element.port
  pdescription.style.color = activeColor.mainfont



  removebutton.addEventListener('click', e => {
    rawConfig = fs.readFileSync(activeProject.configpath)
    projectConfig = JSON.parse(rawConfig)

    if (projectConfig.servers.length == 1) {
      projectConfig.servers.pop()
    } else {

      if (process.platform == 'win32') {
        console.log(element.name)
        var filtered = projectConfig.servers.filter(function (el) {
          return el.name == element.name;
        });
        console.log(filtered)
        projectConfig.servers = filtered
        console.log(projectConfig)

      } else {
        console.log(element.name)
        var filtered = projectConfig.servers.filter(function (el) {
          return el.name != element.name;
        });
        console.log(filtered)
        projectConfig.servers = filtered
        console.log(projectConfig)

      }

    }



    let writeContent = JSON.stringify(projectConfig, null, 2);
    fs.writeFileSync(activeProject.configpath, writeContent);


    remote.getCurrentWindow().reload()
  })


  abutton.addEventListener('click', e => {


    console.log(element)
    runWebServer(element)

    /*if (invokedButton.className.includes('green')){
        
        var replaced = invokedButton.className.replace('green', 'red')
        invokedButton.className = replaced
        runCommand(element);


    }else{
        var replaced = invokedButton.className.replace('red', 'green')
        invokedButton.className = replaced
        stopCommand(element);
    }*/
  })
});

if (process.platform == 'linux') {
  serverPortMessage = 'Enter port. (For your OS it has to be 1024 or higher)'
} else(serverPortMessage = 'Enter desired port: ')


btnAddServer.addEventListener('click', e => {
  document.getElementById('onAlert').hidden = false;
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3', '4']
  }).queue([{
      title: 'Path to run the webserver in?',
      text: 'Default: ' + activeProject.path,
    },
    serverPortMessage,
    'Name the webserver',
    {
      title: 'Default file? leave empty for "index.html',
      text: 'specify without a "/"'
    }

  ]).then((result) => {

    if (!result.value) {
      remote.getCurrentWindow().reload()

    }

    var doesItExist = false;

    projectConfig.servers.forEach(element => {
      if (element.name == result.value[2]) {
        doesItExist = true;
      }

    });


    if (result.value[1] == '') {
      Swal.fire({
        title: 'You need to provide a port!',
      })

    } else if (result.value[2] == '') {
      Swal.fire({
        title: 'You need to provide a name for the webserver!',
      })

    } else if (doesItExist == true) {
      Swal.fire({
        title: 'A tool with this name already exists!',
      })

    } else if (result.value) {

      console.log(result.value)

      if (result.value[0] == '') {
        result.value[0] = activeProject.path
      }

      if (result.value[3] == '') {
        result.value[3] = 'index.html'
      }


      rawConfig = fs.readFileSync(activeProject.configpath)
      projectConfig = JSON.parse(rawConfig)
      console.log(projectConfig)


      var serverToPush = {

        serverPath: result.value[0],
        port: result.value[1],
        name: result.value[2],
        defFile: result.value[3]

      }
      console.log(serverToPush)

      projectConfig.servers.push(serverToPush)



      let writeContent = JSON.stringify(projectConfig, null, 2);
      fs.writeFileSync(activeProject.configpath, writeContent);



      Swal.fire({
        title: 'All done!',

        confirmButtonText: 'Lovely!'
      })

      remote.getCurrentWindow().reload()
    }
  })


})

btnAddCommand.addEventListener('click', e => {

  document.getElementById('onAlert').hidden = false;

  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([{
      title: 'Path to run the command in?',
      text: 'Default: ' + activeProject.path,
    },
    'Enter your command WITH parameters: ',
    'Name the command'
  ]).then((result) => {
    var doesItExist = false;

    if (!result.value) {
      remote.getCurrentWindow().reload()

    }


    projectConfig.commands.forEach(element => {
      if (element.name == result.value[2]) {
        doesItExist = true;
      }

    });

    if (result.value[1] == '') {
      Swal.fire({
        title: 'You need to provide a command!',
      })

    } else if (result.value[2] == '') {
      Swal.fire({
        title: 'You need to provide a name for the command!',
      })

    } else if (doesItExist == true) {
      Swal.fire({
        title: 'A command with this name already exists!',
      })

    } else if (result.value) {

      console.log(result.value)

      if (result.value[0] == '') {
        result.value[0] = activeProject.path
      }


      rawConfig = fs.readFileSync(activeProject.configpath)
      projectConfig = JSON.parse(rawConfig)
      console.log(projectConfig)

      if (process.platform == 'linux') {

        if (jsonfile.variables[0].quotes == true) {
          var commandToPush = {

            rawCommandWithPath: 'cd ' + result.value[0] + ' && ' + jsonfile.variables[0].terminalEmulator + '"' + result.value[1] + '"',
            command: result.value[1],
            name: result.value[2],
            path: result.value[0]

          }

        } else {
          var commandToPush = {

            rawCommandWithPath: 'cd ' + result.value[0] + ' && ' + jsonfile.variables[0].terminalEmulator + result.value[1],
            command: result.value[1],
            name: result.value[2],
            path: result.value[0]

          }

        }


      } else {

        var commandToPush = {

          rawCommandWithPath: 'cd ' + result.value[0] + ' && ' + result.value[1],
          command: result.value[1],
          name: result.value[2],
          path: result.value[0]

        }
      }

      console.log(commandToPush)

      projectConfig.commands.push(commandToPush)

      var path = require('path');


      let writeContent = JSON.stringify(projectConfig, null, 2);
      fs.writeFileSync(activeProject.configpath, writeContent);

      if (process.platform == 'win32') {
        fs.writeFileSync(activeProject.path + '.devtools_' + commandToPush.name + '.bat', commandToPush.rawCommandWithPath)
      } else {
        fs.writeFileSync(activeProject.path + '.devtools_' + commandToPush.name + '.sh', commandToPush.rawCommandWithPath)

      }

      if (process.platform == 'linux' || process.platform == 'darwin') {
        Swal.fire({
          title: 'Almost set! Run the following in your terminal this one time:',
          text: 'sudo chmod +x "' + path.normalize(activeProject.path + '.devtools_' + commandToPush.name + '.sh"'),
          confirmButtonText: 'Lovely!'
        }).then(function () {
          remote.getCurrentWindow().reload()

        })

      } else {
        Swal.fire({
          title: 'All done!',
          confirmButtonText: 'Lovely!'
        }).then(function () {
          remote.getCurrentWindow().reload()

        })

      }


    }
  })



})

if(projectConfig.websites){
  projectConfig.websites.forEach(element => {

    divcard = document.createElement('div')
    divcard.className = 'card server hoverable'
    servercontainer.appendChild(divcard)
    divcard.id = 'card_' + element.name
    divcard.style.backgroundColor = activeColor.cardscolor;
  
  
    divcontent = document.createElement('div')
    divcontent.className = 'card-content white-text'
    divcard.appendChild(divcontent)
  
    spantitle = document.createElement('span')
    spantitle.className = 'card-title'
    divcontent.appendChild(spantitle)
    spantitle.innerHTML = element.name
    spantitle.style.color = activeColor.mainfont
  
    abutton = document.createElement('a')
    abutton.className = 'btn-floating halfway-fab waves-effect waves-light buttonweirdblue'
    divcard.appendChild(abutton)
    abutton.id = 'server' + element.name
  
    iconRunButton = document.createElement('i')
    iconRunButton.className = 'material-icons'
    iconRunButton.innerHTML = 'flight_takeoff'
    abutton.appendChild(iconRunButton)
  
    removebutton = document.createElement('a')
    removebutton.className = 'btn-floating halfway-fab waves-effect waves-light red'
    divcard.appendChild(removebutton)
    removebutton.id = 'remove' + element.name
    removebutton.style.position = 'absolute'
    removebutton.style.left = '-20px'
    removebutton.style.top = '-20px'
    iconremovebutton = document.createElement('i')
    iconremovebutton.className = 'material-icons'
    iconremovebutton.innerHTML = 'delete'
    removebutton.appendChild(iconremovebutton)
    document.getElementById('remove' + element.name).style.opacity = '0';
  
  
    divcard.addEventListener("mouseover", event => {
      document.getElementById('remove' + element.name).style.opacity = '100';
    });
  
    divcard.addEventListener("mouseout", event => {
      document.getElementById('remove' + element.name).style.opacity = '0';
  
    });
  
  
    abuttonicon = document.createElement('i')
    i.className = 'material-icons'
    abutton.appendChild(abuttonicon)
    i.innerHTML = 'add'
  
  
    divcard.style.float = 'left'
    divcard.style.margin = '19px'
    divcard.style.width = '40%'
  
  
  
    removebutton.addEventListener('click', e => {
      rawConfig = fs.readFileSync(activeProject.configpath)
      projectConfig = JSON.parse(rawConfig)
  
      if (projectConfig.websites.length == 1) {
        projectConfig.websites.pop()
      } else {
  
        if (process.platform == 'win32') {
          console.log(element.name)
          var filtered = projectConfig.websites.filter(function (el) {
            return el.name == element.name;
          });
          console.log(filtered)
          projectConfig.websites = filtered
          console.log(projectConfig)
  
        } else {
          console.log(element.name)
          var filtered = projectConfig.websites.filter(function (el) {
            return el.name != element.name;
          });
          console.log(filtered)
          projectConfig.websites = filtered
          console.log(projectConfig)
  
        }
  
      }
  
  
  
      let writeContent = JSON.stringify(projectConfig, null, 2);
      fs.writeFileSync(activeProject.configpath, writeContent);
  
  
      remote.getCurrentWindow().reload()
    })
  
  
    abutton.addEventListener('click', e => {
  
  
      console.log(element)
      openWebsite(element)
  
      /*if (invokedButton.className.includes('green')){
          
          var replaced = invokedButton.className.replace('green', 'red')
          invokedButton.className = replaced
          runCommand(element);
  
  
      }else{
          var replaced = invokedButton.className.replace('red', 'green')
          invokedButton.className = replaced
          stopCommand(element);
      }*/
    })
  
  
  })
  
}





btnAddProgram.addEventListener('click', e => {


  const {
    dialog
  } = require('electron').remote

  if (process.platform == 'win32') {

    var exePath = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [

        {
          name: 'executable',
          extensions: ['exe']
        },
        {
          name: 'vmware',
          extensions: ['vmx']
        }

      ]
    })
  } else if (process.platform == 'darwin') {
    var exePath = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [

        {
          name: 'app',
          extensions: ['app']
        }

      ]
    })

  } else {
    var exePath = dialog.showOpenDialog({
      properties: ['openFile']
    })

  }
  document.getElementById('onAlert').hidden = false;


  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2']
  }).queue([{
      title: 'Choose executable',
      text: 'Tip: Some programs support command line arguments, if you wish to use them add it as a command instead',
      inputPlaceholder: exePath
    },
    'Name the program'
  ]).then((result) => {

    var doesItExist = false;

    if (!result.value) {
      remote.getCurrentWindow().reload()

    }


    projectConfig.tools.forEach(element => {
      if (element.name == result.value[2]) {
        doesItExist = true;
      }

    });




    if (!exePath && result.value[0] == '') {
      Swal.fire({
        title: 'You need to provide a program to run!',
      })

    } else if (result.value[1] == '') {
      Swal.fire({
        title: 'You need to provide a name for the program!',
      })

    } else if (doesItExist == true) {
      Swal.fire({
        title: 'A tool with this name already exists!',
      })

    } else if (result.value) {




      console.log(result.value)

      if (result.value[0] == '') {
        result.value[0] = exePath[0]
      }


      rawConfig = fs.readFileSync(activeProject.configpath)
      projectConfig = JSON.parse(rawConfig)
      console.log(projectConfig)


      var programToPush = {

        executable: result.value[0],
        name: result.value[1]

      }
      console.log(programToPush)

      projectConfig.tools.push(programToPush)



      let writeContent = JSON.stringify(projectConfig, null, 2);
      fs.writeFileSync(activeProject.configpath, writeContent);


      Swal.fire({
        title: 'All done!',

        confirmButtonText: 'Lovely!'
      })

      remote.getCurrentWindow().reload()
    }
  })



})











function runEverything() {
  rawConfig = fs.readFileSync(activeProject.configpath)
  projectConfig = JSON.parse(rawConfig)

  
  projectConfig.commands.forEach(element => {
    runCommand(element)
  });
  
  
  
  projectConfig.servers.forEach(element => {
    runWebServer(element)
  });
  
  projectConfig.tools.forEach(element => {
    runProgram(element)
  });



  projectConfig.websites.forEach(element => {

    if(element.websiteUrl.includes('localhost') || element.websiteUrl.includes('172.0.0.1')){
      
      var timeToWait = element.timer; // in miliseconds.
      setTimeout(function(){ openWebsite(element); }, timeToWait);

    }else{
      openWebsite(element)
    }


  })

  
  
}

const runAll = document.getElementById('runAll')
runAll.addEventListener('click', e => {


  runEverything()



})


const addWebsite = document.getElementById('addWebsite')
addWebsite.addEventListener('click', e => {

  document.getElementById('onAlert').hidden = false;



  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([
     'Enter the website url:',
    'Enter the website name', 
    {
      title: 'Time to wait in milliseconds:',
      text: 'Default: 10000ms. Only for localhost.'
    }
  ]).then((result) => {
    var doesItExist = false;

    if (!result.value) {
      remote.getCurrentWindow().reload()

    }
    
    
    projectConfig.websites.forEach(element => {
      if (element.name == result.value[2]) {
        doesItExist = true;
      }
      
    });
    
    if(result.value[2] == ''){
      result.value[2] = '10000'
    }
    
    
    if (result.value[0] == '') {
      Swal.fire({
        title: 'You need to provide a website!',
      })
      
    } else if (result.value[1] == '') {
      Swal.fire({
        title: 'You need to provide a name for the website!',
      })
      
    } else if (doesItExist == true) {
      Swal.fire({
        title: 'A command with this name already exists!',
      })

    }
      


     else if (result.value) {

      console.log(result.value)


      rawConfig = fs.readFileSync(activeProject.configpath)
      projectConfig = JSON.parse(rawConfig)
      console.log(projectConfig)

      if(result.value[0].includes('www.')){

        if(result.value[0].includes('http://') || result.value[0].includes('https://')){
          var websiteToPush = {
    
            websiteUrl: result.value[0],
            name: result.value[1]
    
          }

        }else{
          var websiteToPush = {
    
            websiteUrl: 'http://' + result.value[0],
            name: result.value[1]
    
          }

        }

      }else if(result.value[0].includes('localhost') || element.websiteUrl.includes('172.0.0.1')){

            
            
            var websiteToPush = {
      
              websiteUrl: 'http://' + result.value[0],
              name: result.value[1],
              timer: result.value[2]
              
      
            }


      }

      
      else{
        var websiteToPush = {
  
          websiteUrl: 'http://www.' + result.value[0],
          name: result.value[1]
  
        }

      }

      

      console.log(websiteToPush)

      projectConfig.websites.push(websiteToPush)



      let writeContent = JSON.stringify(projectConfig, null, 2);
      fs.writeFileSync(activeProject.configpath, writeContent);
    
    


        Swal.fire({
          title: 'All done!',
          confirmButtonText: 'Lovely!'
        }).then(function () {
          remote.getCurrentWindow().reload()

        })

      


    }
  })


  

})



function runCommand(command) {


  console.log('starting ' + command.name + '...')


  if (process.platform == 'win32') {
    shell.openItem(activeProject.path + '.devtools_' + command.name + '.bat'); //createCmdWindow()

  } else if (process.platform == 'darwin') {
    var exec = require('child_process').exec;
    exec('open -a Terminal "' + activeProject.path + '.devtools_' + command.name + '.sh' + '"', function (err, stdout, stderr) {
      if (err) {
        throw err;
      }
    })


  } else {



    var exec = require('child_process').execFile;
    console.log(activeProject.path + '.devtools_' + command.name + '.sh')
    exec(activeProject.path + '.devtools_' + command.name + '.sh', function (err, data) {
      console.log(err)
      console.log(data.toString());
    });

  }
}






function createCmdWindow() {
  const remote = require('electron').remote;
  const BrowserWindow = remote.BrowserWindow;
  const cmdwindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 800,
    width: 1200
  });

  cmdwindow.loadURL('file://' + __dirname + '/runcommand.html');



  function closeWindow() {
    cmdwindow.close()
  }


}


function runWebServer(server) {

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
  webserver.setTitle(server.name)
  webserver.loadURL('file://' + __dirname + '/runwebserver.html');
  webserver.setAlwaysOnTop(true, 'modal-panel', 1);

  webserver.webContents.on('did-finish-load', () => {


      webserver.webContents.send('server-data', server);



    }

  )


}


function runProgram(program) {

  if (process.platform == 'win32') {
    console.log(program.executable)

    var exec = require('child_process').exec;
    exec('"' + program.executable + '"', function (err, stdout, stderr) {
      if (err) {
        throw err;
      }
    })


  } else if (process.platform == 'darwin') {
    var exec = require('child_process').exec;
    exec('open -a "' + program.executable + '"', function (err, stdout, stderr) {
      if (err) {
        throw err;
      }
    })

  } else {

    if(program.executable.includes('.vmx')){
      var exec = require('child_process').execSync;
      console.log(jsonfile)
      if(jsonfile.variables[0].quotes == true){
        
        exec(jsonfile.variables[0].terminalEmulator + '"vmrun start ' + program.executable + '"', function (err, stdout, stderr) {
          if (err) {
            throw err;
          }
        })
    
      }else{
        exec(jsonfile.variables[0].terminalEmulator + 'vmrun start ' + program.executable, function (err, stdout, stderr) {
          if (err) {
            throw err;
          }
        })

      }
    }else{
      
      
          console.log(program.executable)
      
          var exec = require('child_process').execFile;
          exec(program.executable, function (err, data) {
            console.log(err)
            console.log(data.toString());
          });
    }
  }

}

function deleteProject() {
  const path = require('path')
  rawConfig = fs.readFileSync(activeProject.configpath)
  projectConfig = JSON.parse(rawConfig)

  console.log(projectConfig)

  projectConfig.commands.forEach(element => {

    if (projectConfig.commands.length == 1) {
      // projectConfig.commands.pop()

      if (process.platform == 'win32') {
        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.bat'))

        }

      } else {
        if (fs.existsSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))) {
          fs.unlinkSync(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))
          console.log(path.normalize(activeProject.path + '.devtools_' + element.name + '.sh'))

        }
      }
    }

  });




  fs.unlinkSync(activeProject.configpath)

  let rawcontent = fs.readFileSync(projectsFileDir)
  let jsonfile = JSON.parse(rawcontent);
  console.log(jsonfile)

  if (jsonfile.projects.length == 1) {
    jsonfile.projects.pop()
  } else {

    if (process.platform == 'win32') {
      var filtered = jsonfile.projects.filter(function (el) {
        return el.title != activeProject.title;
      });
      jsonfile.projects = filtered

    } else {
      var filtered = jsonfile.projects.filter(function (el) {
        return el.title != activeProject.title;
      });
      jsonfile.projects = filtered

    }

  }

  console.log(jsonfile)

  let writeContent = JSON.stringify(jsonfile, null, 2);
  fs.writeFileSync(projectsFileDir, writeContent);


  remote.getCurrentWindow().loadURL('file://' + __dirname + '/allprojects.html')



}

function openDirectory() {
  const openExplorer = require('open-file-explorer');
  openExplorer(activeProject.path, err => {
    if (err) {
      console.log(err);
    } else {
      //Do Something
    }
  });
}

function openConfig() {
  shell.openItem(activeProject.configpath); //createCmdWindow()
}


function changeColor() {
  var currentlyActive = jsonfile.activeColor

  currentlyActive = currentlyActive + 1;
  if ((currentlyActive + 1) > jsonfile.colorsets.length) {
    currentlyActive = 0
  }

  jsonfile.activeColor = currentlyActive;
  writejson = JSON.stringify(jsonfile, null, 2)
  fs.writeFileSync(projectsFileDir, writejson)
  remote.getCurrentWindow().reload();
}


remote.getCurrentWindow().on('unmaximize',(e) =>{
  console.log('electron unmaximize');
  remote.getCurrentWindow().setSize(400, 600)
  remote.getCurrentWindow().isResizable(false)
  document.getElementById('minimalModeOverlay').hidden = false;
  console.log(remote.getCurrentWindow().getBounds().height)
  console.log(remote.getCurrentWindow().getBounds().width)

  document.getElementById('minimalModeOverlay').style.height = remote.getCurrentWindow().getBounds().height + 'px'
  document.getElementById('minimalModeOverlay').style.width = remote.getCurrentWindow().getBounds().width + 'px'

  document.getElementById('minimalTitleCard').style.height = '95%'
  document.getElementById('minimalTitleCard').style.width = '95%'

});



remote.getCurrentWindow().on('maximize',(e) =>{
  console.log('electron maximize');
  remote.getCurrentWindow().isResizable(false)
  document.getElementById('minimalModeOverlay').hidden = true;

});




function openWebsite(website){

  
  console.log(website.websiteUrl)
  shell.openExternal(website.websiteUrl)

}

// function toggleMinimalMode(){
//   remote.getCurrentWindow().setSize(1000, 600);
//   remote.getCurrentWindow().isResizable(false)
  
// }

function toggleFullMode(){

}