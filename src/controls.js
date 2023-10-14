export const controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  jump: false,
  dejump: false,
};

document.addEventListener("keydown", (event) => {
  console.log(event.code);
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
    case "Space":
      controls.jump = true;
      break;
    case "ShiftLeft":
      controls.dejump = true;
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
    case "Space":
      controls.jump = false;
      break;
    case "ShiftLeft":
      controls.dejump = false;
      break;
  }
});
