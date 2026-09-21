let currentAudio = null;
let currentButton = null;


/* CONVERTIR SEGUNDOS A MINUTOS */

function formatTime(seconds) {

  if (!isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}


/* TODOS LOS BOTONES PLAY */

document.querySelectorAll(".play-btn").forEach(button => {

  const audioFile = button.dataset.audio;

  const audio = new Audio(audioFile);


  /* PLAY / PAUSE */

  button.addEventListener("click", () => {

    /* Si es otro beat */
    if (currentAudio && currentAudio !== audio) {

      currentAudio.pause();

      if (currentButton) {
        currentButton.textContent = "▶";
      }

    }


    /* PAUSAR */

    if (!audio.paused) {

      audio.pause();

      button.textContent = "▶";

      return;
    }


    /* REPRODUCIR */

    audio.play();

    button.textContent = "❚❚";

    currentAudio = audio;
    currentButton = button;

  });


  /* CUANDO TERMINA */

  audio.addEventListener("ended", () => {

    button.textContent = "▶";

    const card = button.closest(".beat-card");

    if (card) {

      const progress = card.querySelector(".progress");

      progress.value = 0;

    }

  });


  /* DURACIÓN */

  audio.addEventListener("loadedmetadata", () => {

    const card = button.closest(".beat-card");

    if (!card) return;

    const duration = card.querySelector(".duration");

    duration.textContent = formatTime(audio.duration);

  });


  /* PROGRESO */

  audio.addEventListener("timeupdate", () => {

    const card = button.closest(".beat-card");

    if (!card) return;

    const progress = card.querySelector(".progress");

    const currentTime = card.querySelector(".current-time");


    if (audio.duration) {

      progress.value =
        (audio.currentTime / audio.duration) * 100;

    }

    currentTime.textContent =
      formatTime(audio.currentTime);

  });


  /* MOVERSE POR LA BARRA */

  const card = button.closest(".beat-card");

  const progress = card.querySelector(".progress");

  progress.addEventListener("input", () => {

    if (!audio.duration) return;

    audio.currentTime =
      (progress.value / 100) * audio.duration;

  });


  /* ATRÁS 5 SEGUNDOS */

  card.querySelector('[data-action="back"]')
    .addEventListener("click", () => {

      audio.currentTime =
        Math.max(0, audio.currentTime - 5);

    });


  /* ADELANTE 5 SEGUNDOS */

  card.querySelector('[data-action="forward"]')
    .addEventListener("click", () => {

      audio.currentTime =
        Math.min(
          audio.duration || Infinity,
          audio.currentTime + 5
        );

    });


  /* VOLUMEN */

  const volume =
    card.querySelector(".volume-slider");

  volume.addEventListener("input", () => {

    audio.volume = volume.value;

  });

});
