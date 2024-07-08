/**
 * This document defines the `speedBoostPowerUp` and `speedBoostPowerUpManager` classes used to create and manage a speed boost power-up in a Snooker game. The power-up is drawn as a circle with a gradient and wave visual effect and provides a speed boost to the ball that enters its area of influence.
 *
 * The `speedBoostPowerUp` class manages the appearance and position of the power-up, while the `speedBoostPowerUpManager` class handles the logic for checking if a ball is within the power-up area and for updating the power-up's position and size.
 */

let SPEED_BOOST_COLOR = getCushionColors().blue;

/**
 * Class representing the speed boost power-up.
 */
class speedBoostPowerUp {
  /**
   * Creates an instance of speedBoostPowerUp.
   * @param {string} _color - The color of the power-up, defaulting to a blue tone obtained from `getCushionColors().blue`.
   */
  constructor(_color = SPEED_BOOST_COLOR) {
    this.color = _color;
  }

  /**
   * Sets the position of the power-up.
   * @param {number} x - The x-coordinate of the new position.
   * @param {number} y - The y-coordinate of the new position.
   */
  setPosition(x, y) {
    this.position = createVector(x, y);
  }

  /**
   * Sets the size of the power-up.
   * @param {number} _size - The size of the power-up.
   */
  setSize(_size) {
    this.size = _size;
  }

  /**
   * Draws the power-up on the screen with gradient, wave, and shadow effects.
   */
  draw() {
    push();
    noStroke();

    // Gradient for the main circle
    let gradient = drawingContext.createRadialGradient(
      this.position.x,
      this.position.y,
      this.size / 4,
      this.position.x,
      this.position.y,
      this.size / 2
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "#000000");

    drawingContext.fillStyle = gradient;
    ellipse(this.position.x, this.position.y, this.size, this.size);

    // Set properties for the wavy lines
    const waveAmplitude = this.size * 0.1; // Amplitude of the waves
    const waveFrequency = 10; // Frequency of the waves
    const waveCount = 16; // Number of waves around the circle

    // Draw the wavy lines around the circle
    stroke(this.color);
    strokeWeight(2);
    for (let i = 0; i < waveCount; i++) {
      const angle = (TWO_PI / waveCount) * i;
      const x1 = this.position.x + (this.size / 2) * cos(angle);
      const y1 = this.position.y + (this.size / 2) * sin(angle);
      const x2 =
        this.position.x +
        (this.size / 2 + waveAmplitude * sin(waveFrequency * angle)) *
          cos(angle);
      const y2 =
        this.position.y +
        (this.size / 2 + waveAmplitude * sin(waveFrequency * angle)) *
          sin(angle);

      line(x1, y1, x2, y2);
    }

    // Shadow for the main circle
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "#00FFFF";
    ellipse(this.position.x, this.position.y, this.size, this.size);

    // Restore drawing context to avoid affecting other elements
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = "transparent";
    pop();
  }
}

/**
 * Class for managing the logic of the speed boost power-up.
 */
class speedBoostPowerUpManager {
  /**
   * Creates an instance of speedBoostPowerUpManager.
   * @param {speedBoostPowerUp} speedBPU - The speed boost power-up instance to manage.
   */
  constructor(speedBPU) {
    this.speedBPU = speedBPU;
  }

  /**
   * Resets the position of the power-up.
   * @param {number} x - The new x-coordinate of the power-up.
   * @param {number} y - The new y-coordinate of the power-up.
   */
  resetPositionSpeedBPU(x, y) {
    this.speedBPU.setPosition(x, y);
  }

  /**
   * Resets the size of the power-up.
   * @param {number} size - The new size of the power-up.
   */
  resetSizeSpeedBPU(size) {
    this.speedBPU.setSize(size);
  }

  /**
   * Updates the color of the power-up.
   * @param {string} color - The new color of the power-up.
   */
  updateColorSpeedBPU(color) {
    this.speedBPU.color = color;
  }

  /**
   * Checks if an object is within the area of influence of the power-up.
   * @param {Object} obj1 - The object to check, which must have a `body.position` property with coordinates.
   * @returns {boolean} - `true` if the object is within the area of influence of the power-up, `false` otherwise.
   */
  isWithinSpeedBoostPowerUp(obj1) {
    const pos1 = this.speedBPU.position;
    const pos2 = obj1.body.position;

    // Calculate the distance between pos1 and pos2
    const distance = dist(pos1.x, pos1.y, pos2.x, pos2.y);

    // Compare the distance with the size of the power-up (this.speedBPU.size)
    return distance < this.speedBPU.size / 2;
  }
}
