// Note that a dynamic `import` statement here is required due to
// webpack/webpack#6615, but in theory `import { greet } from './pkg';`
// will work here one day as well!
const rust = import("./pkg");

const canvas = document.getElementById("rustCanvas");
const gl = canvas.getContext("webgl", { antialias: true });

rust.then((m) => {
  if (!gl) {
    alert("Failed to initialize WebGL");
    return;
  }

  const FPS_THROTTLE = 1000.0 / 60.0; // ms / frames
  let lastDrawTime = -1;
  const client = new m.Client();
  const initialTime = Date.now();

  function render() {
    window.requestAnimationFrame(render);
    const currTime = Date.now();

    if (currTime >= lastDrawTime + FPS_THROTTLE) {
      lastDrawTime = currTime;

      if (
        window.innerHeight != canvas.height ||
        window.innerWidth != canvas.width
      ) {
        canvas.height = window.innerHeight;
        canvas.clientHeight = window.innerHeight;
        canvas.style.height = window.innerHeight;

        canvas.width = window.innerWidth;
        canvas.clientWidth = window.innerWidth;
        canvas.style.width = window.innerWidth;

        gl.viewport(0, 0, window.innerHeight, window.innerWidth);
      }
      //Rust Stuff
      let elapsedTime = currTime - initialTime;
      client.update(elapsedTime, window.innerHeight, window.innerWidth);
      client.render();
    }
  }

  render();
});
