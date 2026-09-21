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


// VOLUMEN INICIAL
audio.volume = 0.8;


// CONVERTIR SEGUNDOS A 0:00
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


// PLAY DE CADA BEAT
playButtons.forEach(button => {

  button.addEventListener("click", () => {

    const audioFile = button.dataset.audio;

    // Si es el mismo beat
    if (currentButton === button) {

      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }

      return;
    }


    // Nuevo beat
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


// BOTÓN PRINCIPAL PLAY / PAUSA
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


// ACTUALIZAR BOTONES CUANDO PLAY / PAUSA
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


// CUANDO CARGA EL AUDIO
audio.addEventListener("loadedmetadata", () => {

  duration.textContent =
    formatTime(audio.duration);

  progress.value = 0;

});


// ACTUALIZAR BARRA
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


// ADELANTAR / ATRASAR
progress.addEventListener("input", () => {

  if (!audio.duration) {
    return;
  }

  audio.currentTime =
    (progress.value / 100) * audio.duration;

});


// −5 SEGUNDOS
backward.addEventListener("click", () => {

  if (!audio.src) {
    return;
  }

  audio.currentTime =
    Math.max(0, audio.currentTime - 5);

});


// +5 SEGUNDOS
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


// VOLUMEN
volume.addEventListener("input", () => {

  audio.volume = volume.value;

});


// CUANDO TERMINA EL BEAT
audio.addEventListener("ended", () => {

  mainPlay.textContent = "▶";

  if (currentButton) {
    currentButton.textContent = "▶";
  }

  progress.value = 0;

  currentTime.textContent = "0:00";

});
/* =========================
   LICENSE MODAL
========================= */

const licenseModal = document.getElementById("license-modal");
const closeLicense = document.getElementById("close-license");


// FIND BUY BUTTONS
const buyButtons = document.querySelectorAll("button, a");

buyButtons.forEach(button => {

  if (button.textContent.trim().toUpperCase() === "BUY") {

    button.addEventListener("click", (event) => {

      event.preventDefault();

      licenseModal.classList.add("active");

      document.body.style.overflow = "hidden";

    });

  }

});


// CLOSE BUTTON
closeLicense.addEventListener("click", () => {

  licenseModal.classList.remove("active");

  document.body.style.overflow = "";

});


// CLICK OUTSIDE
licenseModal.addEventListener("click", (event) => {

  if (event.target === licenseModal) {

    licenseModal.classList.remove("active");

    document.body.style.overflow = "";

  }

});


// ESC KEY
document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    licenseModal.classList.remove("active");

    document.body.style.overflow = "";

  }

});


// LICENSE SELECTION → WHATSAPP

const licenseButtons =
  document.querySelectorAll(".select-license");

const whatsappNumber = "573233971540";

licenseButtons.forEach(button => {

  button.addEventListener("click", () => {

    const license =
      button.closest(".license-card");

    const name =
      license.querySelector("h3").textContent.trim();

    const price =
      license.querySelector("strong").textContent.trim();

    const message =
      `Hola, quiero comprar el beat VOID.%0A%0A` +
      `Licencia: ${encodeURIComponent(name)}%0A` +
      `Precio: ${encodeURIComponent(price)}%0A%0A` +
      `¿Cómo puedo realizar el pago?`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank"
    );

  });

});
