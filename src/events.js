const KEY_1 = "1";
const KEY_2 = "2";
const KEY_3 = "3";
const KEY_R = "r";
const KEY_4 = "4";
const KEY_T = "t";

//============================================================================//
// ¬ Handles key press events for ball mode selection and cue ball repositioning
//============================================================================//
function keyPressed() {
  if (key === KEY_1 || key === KEY_2 || key === KEY_3) {
    POWER_MODE = false;
    setBallMode(parseInt(key));
    performCommonActions();
  } else if (key === KEY_R && IS_CUEBALL_INITIALPOS) {
    cue.cueBallInstance.resetTrail();
    performCommonActions();
  } else if (key === KEY_4) {
    POWER_MODE = true;
  } else if (key === KEY_T) {
    BallManager.stateNeonTrail(); // Toggle neon trail state for all balls
  }
}

/**
 * Performs common actions for the Snooker game.
 * Resets the cue ball position, sets the cue ball repositioning flag to true,
 * and resets the cue state.
 */
function performCommonActions() {
  BallManager.resetCueBallPosition();
  IS_CUEBALL_REPOSITIONING = true;
  cueManager.resetCueState();
}

/**
 * Sets the ball mode and initializes the balls accordingly.
 * @param {number} mode - The ball mode index.
 */
function setBallMode(mode) {
  BALL_MODE = mode;
  BallManager.setModeInit(BALL_MODE);
}

/**
 * Increases the cue force in response to the UP_ARROW key press.
 */
function increaseCueForce() {
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) cueManager.increaseCueForce();
}

/**
 * Decreases the cue force in response to the DOWN_ARROW key press.
 */
function decreaseCueForce() {
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) cueManager.decreaseCueForce();
}

//============================================================================//
// ¬ Handles mouse movement events to update the cue's angle and position
//============================================================================//

function mouseMoved() {
  // Check if the mouse is within the bounds of the canvas
  if (withinCanvas()) {
    // Transform mouse coordinates based on frame translation
    const translatedMouseX = mouseX - frameX;
    const translatedMouseY = mouseY - frameY;

    // Update the angle and position of the cue when the mouse moves
    if (cue && !cueManager.isStriking && !IS_CUEBALL_REPOSITIONING) {
      let cueBallPos = cue.cueBallInstance.body.position;
      updateCueAngleRelativeToCueBall(
        translatedMouseX,
        translatedMouseY,
        cueBallPos
      );
    }
  }
}

/**
 * Updates the angle of the cue based on the mouse position.
 * @param {number} mouseX - The x-coordinate of the mouse.
 * @param {number} mouseY - The y-coordinate of the mouse.
 * @param {Object} cueBallPosition - The position of the cue ball {x, y}.
 */
function updateCueAngleRelativeToCueBall(mouseX, mouseY, cueBallPosition) {
  cue.updateCueAngle(
    cueManager.calculateAngleRelToCUEBALL(mouseX, mouseY, cueBallPosition)
  );
}

//============================================================================//
// ¬ Handles mouse clicked events
//============================================================================//
function mouseClicked() {
  if (withinCanvas()) {
    // Transform mouse coordinates based on frame translation
    const translatedMouseX = mouseX - frameX;
    const translatedMouseY = mouseY - frameY;
    if (!IS_CUEBALL_REPOSITIONING) {
      if (!isCueBallMoving(window.cueBall) && !cueManager.isStriking) {
        cueManager.strike(window.cueBall);
        IS_CUEBALL_INITIALPOS = false;
      }
    } else {
      if (
        mouseButton === LEFT &&
        TableManager.isWithinDZone(translatedMouseX, translatedMouseY)
      ) {
        IS_CUEBALL_REPOSITIONING = false;
        IS_CUEBALL_INITIALPOS = true;
        Matter.Body.setVelocity(window.cueBall, { x: 0, y: 0 });
      }
    }
  }
}

/**
 * Checks if the mouse pointer is within the canvas boundaries.
 *
 * @returns {boolean} Returns true if the mouse pointer is within the canvas boundaries, otherwise false.
 */
function withinCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}
