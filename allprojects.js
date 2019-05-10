const fs = require('fs');
const homedir = require('os').homedir();
const remote = require('electron').remote;


var projectsFileDir
if (process.platform !== 'win32'){
  projectsFileDir = homedir + '/.devtools.json'
  console.log(projectsFileDir)
}else{
  projectsFileDir = homedir + '\\.devtools.json'
  console.log(projectsFileDir)
}

let rawcontent = fs.readFileSync(projectsFileDir)
let jsonfile = JSON.parse(rawcontent);


console.log(jsonfile)

const backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', e => {

    remote.getCurrentWindow().loadURL('file://' + __dirname + '/index.html')

})

jsonfile.projects.forEach(element => {
    if (fs.existsSync(element.configpath)) {

        element.initialized = true;

    }


    console.log(element.title + '\n' + element.path + '\n' + element.initialized + '\n' + element.configpath)








    var container = document.getElementById('mainContainer'),





    divcard = document.createElement('div')
    divcard.className = 'card blue-grey darken-1'
    container.appendChild(divcard)

    divcontent = document.createElement('div')
    divcontent.className = 'card-content white-text'
    divcard.appendChild(divcontent)

    spantitle = document.createElement('span')
    spantitle.className = 'card-title'
    divcontent.appendChild(spantitle)
    spantitle.innerHTML = element.title

    divcard.style.float = 'left'
    divcard.style.margin = '19px'
    divcard.style.width = '350px'

    pdescription = document.createElement('p')
    divcontent.appendChild(pdescription)

    if(element.initialized == false){
        pdescription.innerHTML = ' Project has not been initialized yet, open overview to get started!'
    }else{
        pdescription.innerHTML = ' Project ready to go!'
    }

    divbuttons = document.createElement('div')
    divbuttons.className = 'card-action'
    divcard.appendChild(divbuttons)


    //Ovewview button
    btnov = document.createElement('button')
    btnov.style.border = 'none'
    btnov.style.background = 'transparent'


    link1 = document.createElement('a')
    link1.className = '#'
    link1.innerHTML = 'Project Overview'
    btnov.id = 'overview_project'
    btnov.appendChild(link1)

    divbuttons.appendChild(btnov)

    btnov.addEventListener('click', e => {


        chosenProject = findObjectByKey(jsonfile.projects, 'title', element.title)

        console.log(chosenProject)

        sessionStorage.setItem('project', element.title)

        remote.getCurrentWindow().loadURL('file://' + __dirname + '/projectov.html')

    })



    //Run button
    btnrun = document.createElement('button')
    btnrun.style.border = 'none'
    btnrun.style.background = 'transparent'

    btnlink = document.createElement('a')
    link1.className = '#'
    btnrun.appendChild(btnlink)
    btnlink.innerHTML = 'Quick run'
    btnlink.id = 'run_project'

    
    divbuttons.appendChild(btnrun)

    btnrun.addEventListener('click', e => {


        chosenProject = findObjectByKey(jsonfile.projects, 'title', element.title)

        console.log(chosenProject)

    })
    
    
    
    
    
    
    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                chosenProject = array[i]
                return array[i];
            }
        }
        return null;
    }


});
