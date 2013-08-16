var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    _ = require('lodash');

var getAudioInfo = exports.getAudioInfo = function () {
  var artistDirectory = 'public/audio_player/audio/Music/',
      audioSrcRoot = 'public/audio_player/';

  var audioInfo = [];

  var artists = fs.readdirSync(artistDirectory);
  artists.map(function (artist) {
    return artistDirectory + artist;
  }).filter(function (artist) {
    return fs.statSync(artist).isDirectory();
  }).forEach(function (artist) {
    var albums = fs.readdirSync(artist);
    console.log(albums);
    albums.map(function (album) {
      return artist + '/' + album;
    }).filter(function (album) {
      return fs.statSync(album).isDirectory();
    }).forEach(function (album) {
      var record = {};
      record.artist = artist.slice(artistDirectory.length);
      record.name = album.slice(artist.length + 1);
      record.cover = record.artist.replace(/\s+/g, '') + '-' + record.name.replace(/\s+/g, '') + '.jpg';
      record.directory = album;
      record.audioSrc = album.slice(audioSrcRoot.length);

      var songs = fs.readdirSync(album);
      record.songs = songs;
      record.format = songs[0].match(/mp3|m4a|oga/i)[0];
      audioInfo.push(record);
    });  
  });

  var result = _.sortBy(audioInfo, function (record) {
    return record.artist + record.name;
  });

  console.log(result);

  return result;
}

//getAudioInfo();

// , function (err, files) {
//   console.log(files);
//   console.log('1===============================================');


//     fs.readdir(file, function (err, files2) {
//       console.dir(files2);
//       console.log('3===============================================');
//       files2.map(function (album) {
//         return file + '/' + album;
//       }).filter(function (album) {
//         return fs.statSync(album).isDirectory();
//       }).forEach(function (album) {
//         console.log(album);
//         console.log('4===============================================');

//         record.name = album.slice(file.length + 1);
//         record.cover = record.artist.trim() + '-' + record.name.trim() + '.jpg';
//         record.directory = album;
//         record.audioSrc = album.slice(audioSrcRoot.length);

//         fs.readdir(album, function (err, files3) {
//           console.dir(files3);
//           console.log('5===============================================');
          
//           record.songs = files3;
//           audioInfo.push(record);
//         });
//       });
//     });
//   });
// });