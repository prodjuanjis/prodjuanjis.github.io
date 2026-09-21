const audio = new Audio();

let currentButton = null;

const playButtons = document.querySelectorAll(".play-button");
const mainPlay = document.getElementById("main-play");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const playerTitle = document.getElementById("player-title");

const backward = document.getElementById("backward");
const forward = document.getElementById("forward");


// =========================
// AUDIO
// =========================

audio.volume = 0.8;


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


// =========================
// PLAY DE CADA BEAT
// =========================

playButtons.forEach(button => {

  button.addEventListener("click", () => {

    const audioFile = button.dataset.audio;

    if (currentButton === button) {

      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      return;
    }


    audio.src = audioFile;

    audio.load();

    audio.play();

    currentButton = button;

    playerTitle.textContent =
      button.closest(".beat-row")
        .querySelector("h3")
        .textContent;

    playButtons.forEach(btn => {
      btn.textContent = "▶";
    });

    button.textContent = "❚❚";

    mainPlay.textContent = "❚❚";

  });

});


// =========================
// PLAY / PAUSA PRINCIPAL
// =========================

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


audio.addEventListener("play", () => {

  mainPlay.textContent = "❚❚";

  if (currentButton) {
    currentButton.textContent = "❚❚";
  }

});


audio.addEventListener("pause", () => {

  mainPlay.textContent = "▶";

  if (currentButton) {
    currentButton.textContent = "▶";
  }

});


// =========================
// DURACIÓN
// =========================

audio.addEventListener("loadedmetadata", () => {

  duration.textContent =
    formatTime(audio.duration);

  progress.value = 0;

});


audio.addEventListener("timeupdate", () => {

  if (!audio.duration) {
    return;
  }

  const percentage =
    (audio.currentTime / audio.duration) * 100;

  progress.value = percentage;

  currentTime.textContent =
    formatTime(audio.currentTime);

});


// =========================
// BARRA DE PROGRESO
// =========================

progress.addEventListener("input", () => {

  if (!audio.duration) {
    return;
  }

  audio.currentTime =
    (progress.value / 100) * audio.duration;

});


// =========================
// -5 SEGUNDOS
// =========================

backward.addEventListener("click", () => {

  if (!audio.src) {
    return;
  }

  audio.currentTime =
    Math.max(0, audio.currentTime - 5);

});


// =========================
// +5 SEGUNDOS
// =========================

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


// =========================
// VOLUMEN
// =========================

volume.addEventListener("input", () => {

  audio.volume = volume.value;

});


// =========================
// CUANDO TERMINA
// =========================

audio.addEventListener("ended", () => {

  mainPlay.textContent = "▶";

  if (currentButton) {
    currentButton.textContent = "▶";
  }

  progress.value = 0;

  currentTime.textContent = "0:00";

});


// ==================================================
// LICENCIAS
// ==================================================

const licenseModal =
  document.getElementById("license-modal");

const closeLicense =
  document.getElementById("close-license");

const modalBeat =
  document.getElementById("modal-beat");


// BEAT SELECCIONADO

let selectedBeat = "VOID";
let selectedGenre = "Dark Trap / Rage";
let selectedBpm = "128";


// =========================
// BOTONES BUY
// =========================

const buyButtons =
  document.querySelectorAll(".buy-button");


buyButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Obtener información del beat
    selectedBeat =
      button.dataset.beat;

    selectedGenre =
      button.dataset.genre;

    selectedBpm =
      button.dataset.bpm;


    // Cambiar información dentro del modal
    modalBeat.textContent =
      `${selectedBeat} · ${selectedGenre} · ${selectedBpm} BPM`;


    // Abrir modal
    licenseModal.classList.add("active");

    document.body.style.overflow = "hidden";

  });

});


// =========================
// CERRAR MODAL
// =========================

closeLicense.addEventListener("click", () => {

  licenseModal.classList.remove("active");

  document.body.style.overflow = "";

});


// CLIC FUERA DEL MODAL

licenseModal.addEventListener("click", (event) => {

  if (event.target === licenseModal) {

    licenseModal.classList.remove("active");

    document.body.style.overflow = "";

  }

});


// ESC

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    licenseModal.classList.remove("active");

    document.body.style.overflow = "";

  }

});


// ==================================================
// WHATSAPP
// ==================================================

const licenseButtons =
  document.querySelectorAll(".select-license");

const whatsappNumber =
  "573233971540";


licenseButtons.forEach(button => {

  button.addEventListener("click", () => {

    const license =
      button.closest(".license-card");


    const name =
      license
        .querySelector("h3")
        .textContent
        .trim();


    const price =
      license
        .querySelector("strong")
        .textContent
        .trim();


    const message =
      `Hola, quiero comprar el beat ${selectedBeat}.%0A%0A` +
      `Licencia: ${encodeURIComponent(name)}%0A` +
      `Precio: ${encodeURIComponent(price)}%0A` +
      `Género: ${encodeURIComponent(selectedGenre)}%0A` +
      `BPM: ${encodeURIComponent(selectedBpm)}%0A%0A` +
      `¿Cómo puedo realizar el pago?`;


    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank"
    );

  });

});
