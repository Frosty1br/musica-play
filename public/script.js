const controls = document.querySelector("#controls");
const btnPlay = document.querySelector("#play-control");
const nodeList = document.body.childNodes;
let controlsBlock = false;
let volume = 1;

let index = 0;
let currentMusic;
let isPlaying = false;

controls.addEventListener("click", function (event) {
  const audios = [];
  let music = {};

  if (event.target.id != "controls") {
    const musics = 
     nodeList[3].childNodes[5].childNodes[1].childNodes[3]
    .childNodes;

    musics.forEach(function (item) {
      if (item.nodeName != "#text") {
        music.name = item.childNodes[3].childNodes[0].data;
        music.artist = item.childNodes[5].childNodes[0].data;
        music.image = item.childNodes[1].childNodes[0].currentSrc;
        music.audio = item.childNodes[7].childNodes[1];
        audios.push(music);
        music = {};
      }
    });
  }

  function updateDataMusic() {
    controlsBlock = true
    currentMusic = audios[index];
    document.querySelector("#currentImg").src = currentMusic.image;
    document.querySelector("#currentName").innerText = currentMusic.name;
    document.querySelector("#currentArtist").innerText = currentMusic.artist;
    document.querySelector("#volume").value = volume * 100;


    const progressbar = document.querySelector("#progressbar");
    const textCurrentDuration = document.querySelector("#current-duration");
    const textTotalDuration = document.querySelector("#total-duration");

    progressbar.max = currentMusic.audio.duration;
    textTotalDuration.innerText = secondsToMinutes(currentMusic.audio.duration);

    currentMusic.audio.ontimeupdate = function () {
      textCurrentDuration.innerText = secondsToMinutes(
        currentMusic.audio.currentTime
      );
      // console.log(currentMusic.audio.currentTime)
      progressbar.valueAsNumber = currentMusic.audio.currentTime;
    };
  }

  if (event.target.id == "play-control") {
    updateDataMusic();

    if (!isPlaying) {
      btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
      playmusic()
      isPlaying = true;
    } else {
      btnPlay.classList.replace("bi-pause-fill", "bi-play-fill");
      pausemusic()
      isPlaying = false;
    }
  }

  if (event.target.id == "vol-icon" && controlsBlock) {
    currentMusic.audio.muted = !currentMusic.audio.muted;
    if (currentMusic.audio.muted) {
      event.target.classList.replace(
        "bi-volume-up-fill",
        "bi-volume-mute-fill"
      );
      
      for (let i in audios) {
        audios[i].audio.muted = true
        console.log("Mutado", audios[i].audio.muted)
      }
     
    } else {
      event.target.classList.replace(
        "bi-volume-mute-fill",
        "bi-volume-up-fill"
      );

      for (let i in audios) {
        audios[i].audio.muted = false
        console.log("Desmutado",audios[i].audio.muted)
      }
    }

  }

  if (event.target.id == "volume" && controlsBlock) {
    volume = event.target.valueAsNumber / 100

    for (let i in audios) {
      audios[i].audio.volume  = volume;
    }
  }

  if (event.target.id == "progressbar" && controlsBlock) {
    currentMusic.audio.currentTime = event.target.valueAsNumber;
  }

  if (event.target.id == "next-control" && controlsBlock) {
    index++;

    if (index == audios.length) {
      index = 0;
    }

    pausemusic()
    updateDataMusic();
    playmusic()
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
  }

  if (event.target.id == "prev-control" && controlsBlock) {
    index--;

    if (index == -1) {
      index = audios.length - 1;
    }

    pausemusic()
    updateDataMusic();
    playmusic()
    btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
  }

  var t;

  function musicEnded() {
    //console.log("musicEnded Recebendo ", currentMusic.audio.ended)
    if (currentMusic.audio.ended) {
      console.log("Música acabou :)", currentMusic.audio.ended)
          index++;
    
          if (index == audios.length) {
            index = 0;
          }
    
          pausemusic()
          updateDataMusic();
          playmusic()
          btnPlay.classList.replace("bi-play-fill", "bi-pause-fill");
        };
      }

  function playmusic() {
    t = setInterval(musicEnded, 1000);

    setTimeout(function () {      
      currentMusic.audio.play();
   }, 150);
  }
  
  function pausemusic() {
    clearInterval(t);
    currentMusic.audio.pause();
  }
});

function secondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}

