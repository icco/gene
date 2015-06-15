var paused = false;
var music_map = [
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
]

var button_on = "btn--blue".split(" ");
var highlight = "bg-light-orange b--dark-orange ba bw5".split(" ");

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

  for (var j in music_map) {
    for (var k in music_map[j]) {
      if (music_map[j][k]) {

        for (var c in button_on) {
          var cls = button_on[c];
          var els = document.querySelectorAll(".beat[data-column='"+k+"'][data-row='"+j+"']");

          els[0].classList.toggle(cls);
        }
      }
    }
  }


  var column = 0;
  var startTime = ctx.currentTime;
  var eighthNoteTime = beat;

  var intervalID = window.setInterval(function() {
    var time = startTime * 8 * eighthNoteTime;
    for (var i = 0; i < columns; i++) {
      if (music_map[i][column]) {
        playSound(ctx, beats[i], time);
      }
    }

    for (var i in beats) {
      prev_col = (column + (columns -1)) % columns;

      var el_in_prev_col = document.querySelectorAll(".beat[data-column='"+prev_col+"']");
      var el_in_col = document.querySelectorAll(".beat[data-column='"+column+"']");
      for (var k in highlight) {
        var cls = highlight[k];
        el_in_col.item(i).classList.toggle(cls);
        el_in_prev_col.item(i).classList.toggle(cls);
      }
    }
    column = (column + 1) % columns;
  }, beat * 1000);
});

function playSound(context, buffer, time) {
  if (buffer && !paused) {
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

function toggle_music() {
  paused = !paused;

  var el = document.getElementById("pause");

  if (paused) {
    el.textContent = "Play";
  } else {
    el.textContent = "Pause";
  }
}

function toggle_beat(el) {
  var row = el.dataset.row;
  var column = el.dataset.column;

  for (var k in button_on) {
    var cls = button_on[k];
    el.classList.toggle(cls);
  }

  music_map[row][column] ^= 1;
}
