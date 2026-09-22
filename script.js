/* =========================================
   JUANJIS — BEAT STORE
   MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   AUDIO PLAYER
   ========================================= */

const audio = new Audio();

let currentButton = null;


/* ELEMENTOS */

const playButtons =
  document.querySelectorAll(".play-button");

const mainPlay =
  document.getElementById("main-play");

const progress =
  document.getElementById("progress");

const volume =
  document.getElementById("volume");

const currentTime =
  document.getElementById("current-time");

const duration =
  document.getElementById("duration");

const playerTitle =
  document.getElementById("player-title");

const backward =
  document.getElementById("backward");

const forward =
  document.getElementById("forward");


/* VOLUMEN */

audio.volume = 0.8;


/* =========================================
   TIME FORMAT
   ========================================= */

function formatTime(seconds) {

  if (!isFinite(seconds)) {

    return "0:00";

  }


  const minutes =
    Math.floor(seconds / 60);


  const secs =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");


  return `${minutes}:${secs}`;

}


/* =========================================
   PLAY BUTTONS
   ========================================= */

playButtons.forEach(button => {


  button.addEventListener("click", () => {


    const audioFile =
      button.dataset.audio;


    /* MISMO BEAT */

    if (currentButton === button) {


      if (audio.paused) {

        audio.play();

      } else {

        audio.pause();

      }


      return;

    }


    /* NUEVO BEAT */

    audio.src = audioFile;

    audio.load();


    currentButton = button;


    const row =
      button.closest(".track-row");


    const title =
      row.querySelector("h3").textContent.trim();


    playerTitle.textContent =
      title;


    playButtons.forEach(btn => {

      btn.classList.remove("playing");

      btn.querySelector("span").textContent =
        "▶";

    });


    button.classList.add("playing");


    button.querySelector("span").textContent =
      "❚❚";


    mainPlay.textContent =
      "❚❚";


    audio.play().catch(() => {});


  });


});


/* =========================================
   MAIN PLAY / PAUSE
   ========================================= */

mainPlay.addEventListener("click", () => {


  if (!audio.src) {

    return;

  }


  if (audio.paused) {

    audio.play();

  } else {

    audio.pause();

  }


});


/* =========================================
   PLAY EVENT
   ========================================= */

audio.addEventListener("play", () => {


  mainPlay.textContent =
    "❚❚";


  if (currentButton) {

    currentButton.classList.add("playing");

    currentButton.querySelector("span").textContent =
      "❚❚";

  }


});


/* =========================================
   PAUSE EVENT
   ========================================= */

audio.addEventListener("pause", () => {


  mainPlay.textContent =
    "▶";


  if (currentButton) {

    currentButton.classList.remove("playing");

    currentButton.querySelector("span").textContent =
      "▶";

  }


});


/* =========================================
   AUDIO METADATA
   ========================================= */

audio.addEventListener("loadedmetadata", () => {


  duration.textContent =
    formatTime(audio.duration);


  progress.value =
    0;


});


/* =========================================
   AUDIO PROGRESS
   ========================================= */

audio.addEventListener("timeupdate", () => {


  if (!audio.duration) {

    return;

  }


  const percentage =
    (audio.currentTime / audio.duration) * 100;


  progress.value =
    percentage;


  currentTime.textContent =
    formatTime(audio.currentTime);


});


/* =========================================
   PROGRESS BAR
   ========================================= */

progress.addEventListener("input", () => {


  if (!audio.duration) {

    return;

  }


  audio.currentTime =
    (progress.value / 100) * audio.duration;


});


/* =========================================
   BACKWARD
   ========================================= */

backward.addEventListener("click", () => {


  if (!audio.src) {

    return;

  }


  audio.currentTime =
    Math.max(
      0,
      audio.currentTime - 5
    );


});


/* =========================================
   FORWARD
   ========================================= */

forward.addEventListener("click", () => {


  if (!audio.src) {

    return;

  }


  audio.currentTime =
    Math.min(
      audio.duration,
      audio.currentTime + 5
    );


});


/* =========================================
   VOLUME
   ========================================= */

volume.addEventListener("input", () => {


  audio.volume =
    volume.value;


});


/* =========================================
   AUDIO ENDED
   ========================================= */

audio.addEventListener("ended", () => {


  mainPlay.textContent =
    "▶";


  if (currentButton) {

    currentButton.classList.remove("playing");

    currentButton.querySelector("span").textContent =
      "▶";

  }


  progress.value =
    0;


  currentTime.textContent =
    "0:00";


});


/* =========================================
   SEARCH + FILTERS
   ========================================= */

const genreFilter =
  document.getElementById("genre-filter");

const bpmFilter =
  document.getElementById("bpm-filter");

const searchInput =
  document.getElementById("track-search");

const trackRows =
  document.querySelectorAll(".track-row");

const catalogCount =
  document.getElementById("catalog-count");


/* =========================================
   FILTER FUNCTION
   ========================================= */

function filterTracks() {


  const selectedGenre =
    genreFilter.value.toLowerCase();


  const selectedBpm =
    bpmFilter.value;


  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  let visibleTracks = 0;


  trackRows.forEach(row => {


    const title =
      row.dataset.title
        .toLowerCase();


    const genre =
      row.dataset.genre
        .toLowerCase();


    const bpm =
      Number(row.dataset.bpm);


    /* =====================================
       GENRE
    ===================================== */

    let genreMatch = true;


    if (selectedGenre !== "all") {

      genreMatch =
        genre.includes(selectedGenre);

    }


    /* =====================================
       BPM
    ===================================== */

    let bpmMatch = true;


    if (selectedBpm === "120-130") {

      bpmMatch =
        bpm >= 120 &&
        bpm <= 130;

    }


    if (selectedBpm === "130-140") {

      bpmMatch =
        bpm > 130 &&
        bpm <= 140;

    }


    if (selectedBpm === "140+") {

      bpmMatch =
        bpm >= 140;

    }


    /* =====================================
       SEARCH
    ===================================== */

    const searchMatch =
      search === "" ||
      title.includes(search) ||
      genre.includes(search) ||
      String(bpm).includes(search);


    /* =====================================
       FINAL RESULT
    ===================================== */

    const shouldShow =
      genreMatch &&
      bpmMatch &&
      searchMatch;


    if (shouldShow) {

      row.classList.remove("hidden");

      visibleTracks++;

    } else {

      row.classList.add("hidden");

    }


  });


  /* =====================================
     UPDATE COUNTER
  ===================================== */

  catalogCount.textContent =
    `${String(visibleTracks).padStart(2, "0")} TRACKS`;


}


/* =========================================
   FILTER EVENTS
   ========================================= */

genreFilter.addEventListener(
  "change",
  filterTracks
);


bpmFilter.addEventListener(
  "change",
  filterTracks
);


searchInput.addEventListener(
  "input",
  filterTracks
);


/* =========================================
   LICENSE MODAL
   ========================================= */

const licenseModal =
  document.getElementById("license-modal");

const closeLicense =
  document.getElementById("close-license");

const modalBeat =
  document.getElementById("modal-beat");


/* BEAT SELECCIONADO */

let selectedBeat =
  "VOID";

let selectedGenre =
  "Dark Trap / Rage";

let selectedBpm =
  "128";


/* =========================================
   BUY BUTTONS
   ========================================= */

const buyButtons =
  document.querySelectorAll(".buy-button");


buyButtons.forEach(button => {


  button.addEventListener("click", () => {


    selectedBeat =
      button.dataset.beat;


    selectedGenre =
      button.dataset.genre;


    selectedBpm =
      button.dataset.bpm;


    /* ACTUALIZAR MODAL */

    modalBeat.textContent =
      `${selectedBeat} · ${selectedGenre} · ${selectedBpm} BPM`;


    /* ABRIR */

    licenseModal.classList.add("active");


    document.body.style.overflow =
      "hidden";


  });


});


/* =========================================
   CLOSE MODAL
   ========================================= */

function closeModal() {


  licenseModal.classList.remove("active");

  document.body.style.overflow =
    "";

}


closeLicense.addEventListener(
  "click",
  closeModal
);


/* =========================================
   CLICK OUTSIDE MODAL
   ========================================= */

licenseModal.addEventListener(
  "click",
  event => {


    if (
      event.target === licenseModal
    ) {

      closeModal();

    }


  }
);


/* =========================================
   ESC KEY
   ========================================= */

document.addEventListener(
  "keydown",
  event => {


    if (event.key === "Escape") {

      closeModal();

    }


  }
);


/* =========================================
   LICENSE → WHATSAPP
   ========================================= */

const licenseButtons =
  document.querySelectorAll(
    ".select-license"
  );


/*
   Número de WhatsApp
   573233971540 = +57 323 397 1540
*/

const whatsappNumber =
  "573233971540";


licenseButtons.forEach(button => {


  button.addEventListener(
    "click",
    () => {


      const licenseCard =
        button.closest(".license-card");


      const licenseName =
        licenseCard
          .querySelector("h3")
          .textContent
          .trim();


      const price =
        licenseCard
          .querySelector("strong")
          .textContent
          .trim();


      const message =
        `Hola, quiero comprar el beat ${selectedBeat}.\n\n` +
        `Licencia: ${licenseName}\n` +
        `Precio: ${price}\n` +
        `Género: ${selectedGenre}\n` +
        `BPM: ${selectedBpm}\n\n` +
        `¿Cómo puedo realizar el pago?`;


      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


      window.open(
        whatsappURL,
        "_blank"
      );


    }
  );


});


/* =========================================
   INITIAL FILTER
   ========================================= */

filterTracks();
