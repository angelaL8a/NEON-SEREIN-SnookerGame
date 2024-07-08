/**
 * Class representing a snooker cue for managing its appearance and interaction with the cue ball.This class encapsulates properties such as length, width, and color of the cue, and provides a method to render the cue on a canvas with a detailed design.
 */
class Cue {
  /**
   * Initializes a new instance of the Cue class with specified properties.
   * @param {number} length - The length of the cue stick.
   * @param {number} width - The width of the cue stick.
   * @param {string} color - The color of the cue stick.
   * @param {CueBall} cueBall - The cue ball associated with this cue.
   * @param {Object} colors - The colors for the cue handle, shaft, tip, and center of the tip.
   * @example const cue = new Cue(200, 10, cueBall, { handle: "#6f482a", shaft: "#fcf2cd", tip: "#fcf2cd", centerTip: "#505050" });
   */
  constructor(length, width, cueBall, colors) {
    this.cueLength = length; // Length of the cue
    this.cueWidth = width; // Width of the cue

    this.angle = 0; // Initial angle of the cue

    this.handleColor = colors.handle;
    this.shaftColor = colors.shaft;
    this.tipColor = colors.tip;
    this.centerTipColor = colors.centerTip;

    this._setCueBallInstance(cueBall); // Associate cue ball with the cue
  }

  /**
   * Associates a cue ball instance with the cue.
   * @param {CueBall} cueBall - The cue ball instance.
   */
  _setCueBallInstance(cueBall) {
    this.cueBallInstance = cueBall; // Cue ball instance
    this.cueX = cueBall.position.x; // X position of the cue based on the cue ball
    this.cueY = cueBall.position.y; // Y position of the cue based on the cue ball
  }

  /**
   * Updates the position of the cue.
   *
   * @param {number} x - The new x-coordinate of the cue.
   * @param {number} y - The new y-coordinate of the cue.
   */
  updatePosition(x, y) {
    this.cueX = x;
    this.cueY = y;
    this.cueBallInstance.constrainPosition();
  }

  /**
   * Updates the angle of the cue.
   *
   * @param {number} angle - The new angle of the cue.
   */
  updateCueAngle(angle) {
    this.angle = angle;
  }

  /**
   * Renders the cue on the canvas with a detailed design.
   * This method calculates the dimensions and proportions of the cue's parts (shaft, handle, tip) and draws them on the canvas. The cue's position and orientation are adjusted using translation and rotation transformations to align with the cue ball and the desired shooting angle.
   */
  display() {
    push();
    translate(this.cueX, this.cueY); // Position the cue based on the cue ball
    rotate(this.angle); // Rotate the cue based on the shooting angle

    // Calculate lengths and proportions of the cue's parts
    const cueTotalLength = this.cueLength;
    const shaftLength = cueTotalLength / 2;
    const handleLength = cueTotalLength / 2;
    const tipLength = (cueTotalLength * 0.9) / cueTotalLength;

    // Calculate dimensions of the tip and handle
    const tipWidth = this.cueWidth / 2;
    const handleWidth = this.cueWidth;

    // Draw the cue's parts with specific colors
    fill(this.handleColor); // Color for the handle
    rect(shaftLength, -handleWidth / 2, handleLength, handleWidth, 8);

    fill(this.shaftColor); // Color for the shaft
    rect(tipLength, -this.cueWidth / 2, shaftLength, this.cueWidth);

    fill(this.tipColor); // Color for the tip
    rect(tipLength * 0.9, -tipWidth / 2, tipLength, tipWidth, 4);

    fill(this.centerTipColor); // Color for the center of the tip
    rect(tipLength / 4, -tipWidth / 2, tipLength / 2, tipWidth);
    pop();
  }
}

class CueManager {
  constructor(cue) {
    this.cue = cue;
    this.angle = this.cue.angle;
    this.isStriking = false;

    this.force = 0.001;
    this.forceIncrement = 5;
    this.maxForceIncrement = 10;
  }

  //=========================================
  // ¬  Position Management
  //=========================================

  /**
   * Updates the cue's position based on the cue ball's position and angle.
   * Preconditions:
   * - `this.cue.cueBallInstance` must be a valid instance representing the cue ball.
   * - `this.isStriking` should be `false` to prevent movement during a strike.
   */
  updateCuePosition() {
    if (this.cue.cueBallInstance && !this.isStriking) {
      const cueBallPos = this.cue.cueBallInstance.body.position;
      const cueBallDiameter = this.cue.cueBallInstance.diameter;
      const positions = {
        x: cueBallPos.x - cueBallDiameter * Math.cos(this.cue.angle),
        y: cueBallPos.y - cueBallDiameter * Math.sin(this.cue.angle),
      };
      this.cue.updatePosition(positions.x, positions.y);
    }
  }
  /**
   * Calculates the angle between the cue and the mouse cursor relative to the cue ball's position.
   * @param {number} mouseX - The X coordinate of the mouse cursor.
   * @param {number} mouseY - The Y coordinate of the mouse cursor.
   * @param {Object} cueBallPosition - An object containing the X and Y coordinates of the cue ball.
   * @returns {number} The angle in radians between the cue and the direction to the mouse cursor from the cue ball.
   */
  calculateAngleRelToCUEBALL(mouseX, mouseY, cueBallPosition) {
    const deltaX = cueBallPosition.x - mouseX;
    const deltaY = cueBallPosition.y - mouseY;
    return atan2(deltaY, deltaX);
  }

  //=========================================
  // ¬ Force Management
  //=========================================

  /**
   * Increases the force increment of the cue.
   */
  increaseCueForce() {
    const forceChange = 0.2;
    if (this.forceIncrement < this.maxForceIncrement) {
      this.forceIncrement += forceChange;
    }
  }

  /**
   * Decreases the force increment of the cue.
   */
  decreaseCueForce() {
    const forceChange = 0.2;
    if (this.forceIncrement > 1) {
      this.forceIncrement -= forceChange;
    }
  }

  //=========================================
  // ¬ Strike Management
  //=========================================
  /**
   * Calculates the force vector based on the cue stick's angle and force settings.
   *
   * @param {number} angle - The angle of the cue stick in radians.
   * @param {number} force - The force magnitude to be applied.
   * @param {number} forceIncrement - The force increment multiplier.
   * @returns {p5.Vector} The calculated force vector.
   */
  calculateForceVector(angle, force, forceIncrement) {
    let forceMagnitude = force * forceIncrement;
    let forceDirection = p5.Vector.fromAngle(angle);
    return forceDirection.mult(forceMagnitude);
  }

  /**
   * Calculates the durations for the cue stick animation phases based on the force increment.
   *
   * @param {number} forceIncrement - The current force increment value.
   * @param {number} maxForceIncrement - The maximum possible force increment value.
   * @returns {Object} An object containing the total duration, pull-back duration, and strike duration.
   */
  calculateAnimationDurations(forceIncrement, maxForceIncrement) {
    const totalDuration = map(forceIncrement, 1, maxForceIncrement, 375, 625);
    const pullBackDuration = (totalDuration * 3) / 4;
    const strikeDuration = totalDuration / 4;
    return { totalDuration, pullBackDuration, strikeDuration };
  }

  /**
   * Calculates the number of animation frames for the pull-back and strike phases.
   *
   * @param {number} totalDuration - The total duration of the animation.
   * @param {number} pullBackDuration - The duration of the pull-back phase.
   * @returns {Object} An object containing the number of frames for the pull-back and strike phases.
   */
  calculateFrameCounts(totalDuration, pullBackDuration) {
    const totalFrames = 60;
    const pullBackFrames = Math.round(
      (totalFrames * pullBackDuration) / totalDuration
    );
    const strikeFrames = totalFrames - pullBackFrames;
    return { pullBackFrames, strikeFrames };
  }

  /**
   * Applies the calculated force vector to the cue ball.
   *
   * @param {CueBall} cueBall - The cue ball instance to apply the force to.
   * @param {p5.Vector} forceVector - The force vector to be applied to the cue ball.
   */
  applyForceToCueBall(cueBall, forceVector) {
    if (!cueBall || !forceVector) {
      console.error("Invalid cueBall or forceVector.");
      return;
    }
    Body.applyForce(cueBall, cueBall.position, forceVector);
  }
  /**
   * Animates the cue stick striking the cue ball.
   * The animation consists of a pull-back phase followed by a strike phase.
   *
   * @param {CueBall} cueBall - The cue ball being struck.
   * @param {function} callback - A callback function to be executed after the strike animation completes.
   */
  animateCueStrike(cueBall, callback) {
    const { totalDuration, pullBackDuration, strikeDuration } =
      this.calculateAnimationDurations(
        this.forceIncrement,
        this.maxForceIncrement
      );
    const { pullBackFrames, strikeFrames } = this.calculateFrameCounts(
      totalDuration,
      pullBackDuration
    );

    const originalPosition = { x: this.cue.cueX, y: this.cue.cueY };
    const maxPullBack = this.cue.cueLength / 2;
    const pullBackDistance = map(
      this.forceIncrement,
      1,
      this.maxForceIncrement,
      0,
      maxPullBack
    );

    // Animate pull back phase.
    for (let frame = 0; frame < pullBackFrames; frame++) {
      setTimeout(() => {
        const lerpFactor = frame / pullBackFrames;
        this.cue.cueX = lerp(
          originalPosition.x,
          originalPosition.x + pullBackDistance * cos(this.cue.angle),
          lerpFactor
        );
        this.cue.cueY = lerp(
          originalPosition.y,
          originalPosition.y + pullBackDistance * sin(this.cue.angle),
          lerpFactor
        );
      }, (pullBackDuration / pullBackFrames) * frame);
    }

    // Animate strike phase.
    for (let frame = 0; frame < strikeFrames; frame++) {
      setTimeout(() => {
        const lerpFactor = frame / strikeFrames;
        this.cue.cueX = lerp(
          originalPosition.x + pullBackDistance * cos(this.cue.angle),
          originalPosition.x,
          lerpFactor
        );
        this.cue.cueY = lerp(
          originalPosition.y + pullBackDistance * sin(this.cue.angle),
          originalPosition.y,
          lerpFactor
        );

        if (frame === strikeFrames - 1 && callback) {
          callback();
        }
      }, pullBackDuration + (strikeDuration / strikeFrames) * frame);
    }
  }

  /**
   * Executes a strike on the cue ball with the cue stick.
   * This method animates the cue stick striking motion, calculates the force vector,
   * and applies the force to the cue ball. The striking state is managed to ensure
   * the cue stick can only strike once at a time.
   *
   * @param {CueBall} cueBall - The cue ball instance to be struck.
   */
  strike(cueBall) {
    if (!this.isStriking && cueBall) {
      this.isStriking = true;
      this.animateCueStrike(cueBall, () => {
        let forceVector = this.calculateForceVector(
          this.cue.angle,
          this.force,
          this.forceIncrement
        );
        this.applyForceToCueBall(cueBall, forceVector);
        setTimeout(() => {
          this.isStriking = false;
        }, 500);
      });
    } else if (!cueBall) {
      console.error("Invalid cueBall provided to strike.");
    }
  }

  //=========================================
  // ¬ Force bar Management
  //=========================================
  /**
   * Draws a force bar on the canvas to represent the current force increment of the cue.
   * @param {number} x - The x-coordinate of the top-left corner of the force bar.
   * @param {number} y - The y-coordinate of the top-left corner of the force bar.
   * @param {number} wForceBar - The width of the force bar.
   * @param {number} hForceBar - The height of the force bar.
   * @param {string} barColor - The color of the force bar background.
   * @param {string} fillColor - The color of the filled portion of the force bar.
   * @example drawForceBar(10, 10, 20, 100, "#ccc", "#f00");
   */
  drawForceBar(x, y, wForceBar, hForceBar, barColor, fillColor) {
    // Draw shadow
    push();
    noStroke();
    fill(0, 0, 0, 20);
    rect(x + 2, y + 2, wForceBar, hForceBar, 4);

    // Draw border
    stroke("#495057");
    strokeWeight(0.2);
    fill(barColor);
    rect(x, y, wForceBar, hForceBar, 4);

    // Draw filled portion
    fill(fillColor);
    const barForceHeight = map(
      this.forceIncrement,
      1,
      this.maxForceIncrement,
      0,
      98
    );
    rect(x, hForceBar - barForceHeight, wForceBar, barForceHeight, 0, 0, 2, 2);
    pop();
  }

  //=========================================
  // ¬ States Management
  //=========================================

  /**
   * Resets the state of the cue to ensure it is not striking.
   */
  resetCueState() {
    cueManager.isStriking = false;
  }

  //=========================================//
  // ¬  Directioner
  //=========================================//
  /**
   * Draws the direction line for the cue.
   *
   * @param {number} lengthDirectioner - The length of the direction line.
   */
  drawDirectioner(lengthDirectioner) {
    if (this.isStriking) return;
    push();
    translate(this.cue.cueX, this.cue.cueY);
    rotate(this.cue.angle);

    stroke(255, 255, 255, 50);
    strokeWeight(2);

    const directionLineLength = lengthDirectioner;
    line(10, 0, directionLineLength, 0);

    pop();
  }
}
