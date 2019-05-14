const http = require('http')
const remote = require('electron').remote;
var currentWindow = remote.getCurrentWindow();



var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('server-data', function (event,server) {
    console.log(server);
    runServer(server)
    remote.getCurrentWindow().setTitle('DEVTOOLS SERVER: ' + server.name)
});

function runServer(webserver){


  var fs = require('fs');
  var path = require('path');
  
  http.createServer(function (request, response) {
      console.log('request starting...');
  
      var filePath = path.normalize(webserver.serverPath + request.url);
      console.log(filePath)
      console.log(request.url)
      if (filePath == webserver.serverPath)
          filePath = webserver.serverPath + webserver.defFile;

      console.log(path.normalize(filePath))

      filePath = path.normalize(filePath)
  
      var extname = path.extname(filePath);
      var contentType = 'text/html';
      switch (extname) {
          case '.js':
              contentType = 'text/javascript';
              break;
          case '.css':
              contentType = 'text/css';
              break;
          case '.json':
              contentType = 'application/json';
              break;
          case '.png':
              contentType = 'image/png';
              break;      
          case '.jpg':
              contentType = 'image/jpg';
              break;
          case '.wav':
              contentType = 'audio/wav';
              break;
      }
  
      fs.readFile(filePath, function(error, content) {
          if (error) {
              if(error.code == 'ENOENT'){
                  fs.readFile('./404.html', function(error, content) {
                      response.writeHead(200, { 'Content-Type': contentType });
                      response.end(content, 'utf-8');
                  });
              }
              else {
                  response.writeHead(500);
                  response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                  response.end(); 
              }
          }
          else {
              response.writeHead(200, { 'Content-Type': contentType });
              response.end(content, 'utf-8');
          }
      });


  




      
    
  
  }).listen(webserver.port);
  console.log('Server running at http://127.0.0.1:' + webserver.port + '/');
  document.getElementById('defFile').innerHTML += webserver.defFile;
  document.getElementById('serverPort').innerHTML += webserver.port;
  document.getElementById('serverName').innerHTML += webserver.name;

  


}




