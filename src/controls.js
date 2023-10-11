
export const controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
};

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      controls.moveForward = true;
      break;
    case "KeyS":
      controls.moveBackward = true;
      break;
    case "KeyA":
      controls.moveLeft = true;
      break;
    case "KeyD":
      controls.moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      controls.moveForward = false;
      break;
    case "KeyS":
      controls.moveBackward = false;
      break;
    case "KeyA":
      controls.moveLeft = false;
      break;
    case "KeyD":
      controls.moveRight = false;
      break;
  }
});
