document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-audio]");

  buttons.forEach((button) => {
    const audioFile = button.getAttribute("data-audio");
    if (!audioFile) return;

    const audio = new Audio(audioFile);

    button.addEventListener("click", () => {
      document.querySelectorAll("audio").forEach((other) => {
        if (other !== audio) {
          other.pause();
          other.currentTime = 0;
        }
      });

      if (audio.paused) {
        audio.play();
        button.textContent = "Pause";
      } else {
        audio.pause();
        button.textContent = "Play";
      }
    });

    audio.addEventListener("ended", () => {
      button.textContent = "Play";
    });
  });
});
