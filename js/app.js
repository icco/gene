document.addEventListener("DOMContentLoaded", function(event) { 
  var ctx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); 
  // Also known as Beats per Minute.
  var tempo = 96;
  // Basically the number at which we play an audio file.
  var beat = (60 / tempo) / 4;

  var beats = [null, null, null, null];
  var beat_urls = [
    "music/clicks.mp3",
    "music/hat.mp3",
    "music/kick.mp3",
    "music/snare.mp3"];

  for (i in beat_urls) {
    loadSound(ctx, beat_urls[i], beats[i]);
  }

  console.log(beats);
});

function loadSound(context, url, retBuffer) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  var onError = function(e) {
    console.error(e);
  };

  // Asynchronous load
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      retBuffer = buffer;
    }, onError);
  }
  request.send();
}
