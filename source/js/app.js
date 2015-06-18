
// Global for pausing music
var paused = false;

// TODO(icco): Turn this into an object with properties.
var music_map = "0:1000000000000000,1:1000100010001000,2:0010001000100010,3:0000000000000000";

function twod_to_map(twod) {
  return twod.map(function(val, idx) {
    return idx + ":" + val.join("")
  }).join(",");
}

function map_to_twod(map) {
  var rows = map.split(",");
  var ret = [];

  for (var r in rows) {
    var data = rows[r].split(":");
    var id = parseInt(data[0], 10);
    ret[data[0]] = data[1].split("").map(function(num) {
      return parseInt(num, 10);
    });
  }

  return ret;
}

var button_on = "btn--blue".split(" ");
var highlight = "bg-light-orange b--dark-orange ba bw5".split(" ");

document.addEventListener("DOMContentLoaded", function(event) {
  var ctx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();

  var columns = 16;
  var measure = 4;
  var rows = music_map.split(",").length;

  // Also known as Beats per Minute.
  var tempo = 96;
  // Basically the number at which we play an audio file.
  var beat = (60 / tempo) / measure;
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

  var twod = map_to_twod(music_map);
  for (var j in twod) {
    for (var k in twod[j]) {
      if (twod[j][k]) {
        for (var c in button_on) {
          var cls = button_on[c];
          var els = document.querySelectorAll(".beat[data-column='"+k+"'][data-row='"+j+"']");

          // Make sure element is on screen
          if (els.length > 0) {
            els[0].classList.toggle(cls);
          }
        }
      }
    }
  }

  var column = 0;
  var startTime = ctx.currentTime;
  var eighthNoteTime = beat;

  var intervalID = window.setInterval(function() {
    var twod = map_to_twod(music_map);
    var time = startTime * 8 * eighthNoteTime;
    for (var i = 0; i < rows; i++) {
      if (twod[i][column]) {
        playSound(ctx, beats[i], time);
      }
    }

    for (var i = 0; i < rows; i++) {
      prev_col = (column + (columns -1)) % columns;

      var el_in_prev_col = document.querySelectorAll(".beat[data-column='"+prev_col+"']");
      var el_in_col = document.querySelectorAll(".beat[data-column='"+column+"']");
      for (var k in highlight) {
        var cls = highlight[k];
        if (el_in_prev_col.length) {
          el_in_prev_col.item(i).classList.remove(cls);
        }

        if (el_in_col.length) {
          el_in_col.item(i).classList.add(cls);
        }
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

function next() {
  var els = document.querySelectorAll(".beat");
  console.log(els);
}

function prev() {

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

  var twod = map_to_twod(music_map);
  twod[row][column] ^= 1;
  music_map = twod_to_map(twod)
}
