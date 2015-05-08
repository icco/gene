document.addEventListener("DOMContentLoaded", function(event) { 
  var ctx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); 
  var columns = 4;
  // Also known as Beats per Minute.
  var tempo = 96;
  // Basically the number at which we play an audio file.
  var beat = (60 / tempo) / columns;
  var beat_urls = [
    "music/clicks.mp3",
    "music/hat.mp3",
    "music/kick.mp3",
    "music/snare.mp3",
  ];
  var beats = [];

  var buffers = new BufferLoader(ctx, beat_urls, function(bufferList) {
    beats = bufferList;
  });
  buffers.load();

  var column = 0;
  var startTime = ctx.currentTime;
  var eighthNoteTime = beat;

  var intervalID = window.setInterval(function() {
    var time = startTime * 8 * eighthNoteTime;
    if (column == 0) {
      for (var i = 0; i < columns; i++) {
        playSound(ctx, beats[i], time);
      }
    }
    column = (column + 1) % columns;
  }, beat * 1000);
});

function playSound(context, buffer, time) {
  if (buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }
}

// From http://www.html5rocks.com/en/tutorials/webaudio/intro/
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
