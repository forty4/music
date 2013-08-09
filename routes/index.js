
/*
 * GET home page.
 */
var fs = require('fs'),
    path = require('path'),
    albums = require('../albums').albums;

console.dir(albums);

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.getMusicInfo = function(req, res){
  var audioInfo = [];

  albums.forEach(function (album) {
    var songs = [];

    fs.readdir(album.directory, function (err, files) {
      var fileName = null;

      if (err) {
          throw err;
      }

      files.map(function (file) {
        return file;
      }).filter(function (file) {
        var fullPath = path.join(album.directory, file);
        return fs.statSync(fullPath).isFile();
      }).forEach(function (file) {
        console.log("%s (%s)", file, path.extname(file));
        songs.push(file);
      });
    });

    album.songs = songs;
    audioInfo.push(album);    
  });

  setTimeout(function () {
    res.json(audioInfo);
    res.end();
  }, 1000);
};

exports.music = function(req, res){
  var filename = '../../audio_player/mp3/butterfly.mp3';

  fs.readFile(filename, "binary", function(err, file) {
 
    var header = {};
    // add content type to header
 
    //TODO: any more clean solution ?
    if(typeof req.headers.range !== 'undefined')
    {
      // browser wants chunged transmission
      console.log('req.headers.range is defined : ', req);
 
      var range = req.headers.range; 
      var parts = range.replace(/bytes=/, "").split("-"); 
      var partialstart = parts[0]; 
      var partialend = parts[1]; 
 
      var total = file.length; 
 
      var start = parseInt(partialstart, 10); 
      var end = partialend ? parseInt(partialend, 10) : total-1;
 
      header["Content-Range"] = "bytes " + start + "-" + end + "/" + (total);
      header["Accept-Ranges"] = "bytes";
      header["Content-Length"]= (end-start)+1;
      header['Transfer-Encoding'] = 'chunked';
      header["Connection"] = "close";
 
      res.writeHead(206, header); 
      // yeah I dont know why i have to append the '0'
      // but chrome wont work unless i do
      res.write(file.slice(start, end)+'0', "binary");
    }
    else
    {
      console.log('range is not defined : ', req);
      // reply to normal un-chunked req
      res.writeHead(200, header );
      res.write(file, "binary");
    }
 
    res.end();
  });
};

