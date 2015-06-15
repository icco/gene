function playSound(t,e,o){if(e&&!paused){var n=t.createBufferSource();n.buffer=e,n.connect(t.destination),n.start(o)}}function BufferLoader(t,e,o){this.context=t,this.urlList=e,this.onload=o,this.bufferList=new Array,this.loadCount=0}function toggle_music(){paused=!paused;var t=document.getElementById("pause");t.textContent=paused?"Play":"Pause"}function toggle_beat(t){var e=t.dataset.row,o=t.dataset.column;for(var n in button_on){var r=button_on[n];t.classList.toggle(r)}music_map[e][o]^=1}var paused=!1,music_map=[[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],button_on="btn--blue".split(" "),highlight="bg-light-orange b--dark-orange ba bw5".split(" ");document.addEventListener("DOMContentLoaded",function(){var t=new(window.AudioContext||window.webkitAudioContext||window.mozAudioContext),e=4,o=96,n=60/o/e,r=["music/clicks.mp3","music/hat.mp3","music/kick.mp3","music/snare.mp3"],a=[],i=new BufferLoader(t,r,function(t){a=t});i.load();for(var u in music_map)for(var s in music_map[u])if(music_map[u][s])for(var d in button_on){var l=button_on[d],c=document.querySelectorAll(".beat[data-column='"+s+"'][data-row='"+u+"']");c[0].classList.toggle(l)}{var f=0,m=t.currentTime,p=n;window.setInterval(function(){for(var o=8*m*p,n=0;e>n;n++)music_map[n][f]&&playSound(t,a[n],o);for(var n in a){prev_col=(f+(e-1))%e;var r=document.querySelectorAll(".beat[data-column='"+prev_col+"']"),i=document.querySelectorAll(".beat[data-column='"+f+"']");for(var u in highlight){var s=highlight[u];i.item(n).classList.toggle(s),r.item(n).classList.toggle(s)}}f=(f+1)%e},1e3*n)}}),BufferLoader.prototype.loadBuffer=function(t,e){var o=new XMLHttpRequest;o.open("GET",t,!0),o.responseType="arraybuffer";var n=this;o.onload=function(){n.context.decodeAudioData(o.response,function(o){return o?(n.bufferList[e]=o,void(++n.loadCount==n.urlList.length&&n.onload(n.bufferList))):void alert("error decoding file data: "+t)},function(t){console.error("decodeAudioData error",t)})},o.onerror=function(){alert("BufferLoader: XHR error")},o.send()},BufferLoader.prototype.load=function(){for(var t=0;t<this.urlList.length;++t)this.loadBuffer(this.urlList[t],t)};