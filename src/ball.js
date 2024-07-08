/**
 * Class representing a snooker ball.
 */
class Ball {
  /**
   * Create a ball.
   * @param {string} _color - The color of the ball.
   * @param {Object} position - The initial position of the ball.
   * @param {number} position.x - The x-coordinate of the ball.
   * @param {number} position.y - The y-coordinate of the ball.
   * @param {number} diameter - The diameter of the ball.
   * @param {boolean} [hasPhysics=true] - Whether the ball should have physical properties.
   */
  constructor(
    _color,
    _stroke,
    position,
    diameter,
    hasPhysics = true,
    neonTrail = false,
    label = "ball"
  ) {
    this.color = _color;
    this.stroke = _stroke;
    this.position = position;
    this.diameter = diameter;
    this.radius = this.diameter / 2;
    this.label = label;

    this.neonTrail = neonTrail;

    this.colorP5 = color(this.color);
    this.strokeP5 = color(this.stroke);

    if (hasPhysics) {
      this.body = this._createPhysicalBody();
      World.add(engine.world, this.body);
    }

    this.trail = []; // List to store the positions for the neon trail
  }

  /**
   * Create the physical body of the ball.
   * @private
   * @returns {Body} The Matter.js body for the ball.
   */
  _createPhysicalBody() {
    const ballOptions = {
      restitution: 0.96,
      friction: 0.05,
      frictionAir: 0.01,
      mass: 0.1,
      render: { fillStyle: this.color },
      label: this.label,
    };
    return Bodies.circle(
      this.position.x,
      this.position.y,
      this.radius * 1.05,
      ballOptions
    );
  }

  /**
   * Toggles the neon trail effect for a ball object.
   * Usage: This method can be called on any instance of the ball class to toggle the neon trail effect on or off.
   */
  stateNeonTrail() {
    this.neonTrail = !this.neonTrail;
  }

  /**
   * Draw the ball on the canvas.
   */
  draw() {
    push();
    if (this.neonTrail) {
      this.#drawTrail();
    }
    if (this.body) {
      // If the ball has a physics body
      this.#drawBall(this.body.position.x, this.body.position.y);
    } else {
      // If the ball does not have a physics body
      this.#drawBall(this.position.x, this.position.y);
    }
    pop();
  }

  /**
   * Update the ball's state and trail.
   */
  update() {
    // Update the ball's position
    if (this.body) {
      this.position.x = this.body.position.x;
      this.position.y = this.body.position.y;
    }
    // Add the current position to the trail
    this.trail.push({ x: this.position.x, y: this.position.y });
    // Limit the trail length
    if (this.trail.length > 5) {
      this.trail.shift();
    }
  }

  /**
   * Resets the trail of the ball.
   */
  resetTrail() {
    this.trail = [];
  }

  /**
   * Draws a ball on the canvas.
   * @param {number} x - The x-coordinate of the ball's center.
   * @param {number} y - The y-coordinate of the ball's center.
   */
  #drawBall(x, y) {
    noStroke();
    fill(0, 50);
    ellipse(x + 2, y + 2, this.diameter, this.diameter); // shadow

    fill(this.color);
    strokeWeight(1);
    stroke(this.stroke);
    ellipse(x, y, this.diameter, this.diameter); // base

    // Sombreado
    this.#drawShading(x, y, this.radius);

    // Resplandor
    this.#drawHighlight(x, y, this.radius);
  }
  /**
   * Draws the neon trail for the ball.
   */
  #drawTrail() {
    for (let i = 0; i < this.trail.length - 1; i++) {
      const pos1 = this.trail[i];
      const pos2 = this.trail[i + 1];
      const alpha = map(i, 0, this.trail.length - 1, 0, 255);
      // Cambios de color dinámicos
      stroke(red(this.colorP5), green(this.colorP5), blue(this.colorP5), alpha);

      // Variación en el grosor de la línea
      const weight = this.radius * 1.2 + sin(i * 0.5) * 2;
      strokeWeight(weight);

      // Efecto de ondulación
      const offsetX = sin(i * 0.3) * 3;
      const offsetY = cos(i * 0.3) * 3;
      line(
        pos1.x + offsetX,
        pos1.y + offsetY,
        pos2.x + offsetX,
        pos2.y + offsetY
      );
      line(
        pos1.x - offsetX,
        pos1.y - offsetY,
        pos2.x - offsetX,
        pos2.y - offsetY
      );
    }
  }

  /**
   * Draw shading on the ball to make it look more 3D.
   * @param {number} x - The x-coordinate of the ball's center.
   * @param {number} y - The y-coordinate of the ball's center.
   * @param {number} radius - The radius of the ball.
   */
  #drawShading(x, y, radius) {
    for (let r = radius; r > 0; --r) {
      const inter = map(r, 0, radius, 0, 1);
      const c = lerpColor(color(this.color), color(0, 0, 0), inter * 0.6);
      fill(c);
      ellipse(x, y, r * 2, r * 2);
    }
  }

  /**
   * Draw a highlight on the ball to simulate light reflection.
   * @param {number} x - The x-coordinate of the ball's center.
   * @param {number} y - The y-coordinate of the ball's center.
   * @param {number} radius - The radius of the ball.
   */
  #drawHighlight(x, y, radius) {
    noStroke();
    const highlightSize = radius * 0.3;
    fill(255, 255, 255, 150);
    ellipse(x - radius / 3, y - radius / 3, highlightSize, highlightSize);
  }
}

/**
 * Class representing the cue ball.
 * Extends the Ball class with specific functionality for the cue ball.
 */
class CueBall extends Ball {
  /**
   * Creates a new CueBall instance.
   * @param {string} color - The color of the cue ball. Defaults to white.
   * @param {Object} position - The position of the cue ball {x, y}.
   * @param {number} diameter - The diameter of the cue ball.
   * @param {boolean} hasPhysics - Whether the cue ball has a physics body. Defaults to true.
   * @param {Object} constrainPos - Object defining the boundaries within which the cue ball can move.
   * @param {number} constrainPos.minX - The minimum x-coordinate for the cue ball.
   * @param {number} constrainPos.maxX - The maximum x-coordinate for the cue ball.
   * @param {number} constrainPos.minY - The minimum y-coordinate for the cue ball.
   * @param {number} constrainPos.maxY - The maximum y-coordinate for the cue ball.
   */
  constructor(
    color,
    _stroke,
    position,
    diameter,
    hasPhysics = true,
    constrainPos,
    neonTrail = false,
    label = "cueBall"
  ) {
    super(color, _stroke, position, diameter, hasPhysics, neonTrail, label);
    this.constrainPos = constrainPos;
    this.radius = diameter / 2;
  }
  /**
   * Constrains the position of the cue ball within the specified boundaries.
   */
  constrainPosition() {
    if (this.body) {
      this.position.x = constrain(
        this.position.x,
        this.constrainPos.minX,
        this.constrainPos.maxX
      );
      this.position.y = constrain(
        this.position.y,
        this.constrainPos.minY,
        this.constrainPos.maxY
      );
    }
  }

  /**
   * Enables physics for the cue ball.
   */
  enablePhysics() {
    this.body = this._createPhysicalBody();
    World.add(engine.world, this.body);
  }
}

/**
 * Class to handle the positioning of snooker balls on the table.
 */
class SnookerBallManager {
  /**
   * Create a BallPositioning instance.
   * @param {Ball[]} balls - Array of ball objects.
   * @param {Table} table - The snooker table instance.
   * @param {Cue} cue - The cue instance representing the snooker cue used for striking the balls.
   */
  constructor(balls, table, cue) {
    this.balls = balls;
    this.table = table;
    this.ballDiameter = this.table.ballDiameter;
    this.cue = cue; //optional
  }

  /**
   * Get the current balls.
   * @returns {Ball[]} The array of ball objects.
   */
  getBalls() {
    return this.balls;
  }

  /**
   * Sets the cue associated with this ball.
   * This method is used to associate a specific cue object with the ball. It updates the ball's  internal reference to the cue, allowing for interactions between the ball and the cue.
   * @param {Cue} cue - The cue object to be associated with the ball. This parameter is expected to be an instance of a Cue class which represents the cue used to strike the ball in a game.
   */
  setCue(cue) {
    this.cue = cue;
    // Stores the cue object in the ball instance for future reference and interaction.
  }

  // ------------------------------------------------------------------------
  // ¬ Mode Methods
  // ------------------------------------------------------------------------

  /**
   * Initialize the balls based on the specified mode.
   * @param {number} mode - The mode to set the balls (1: Standard, 2: Random Red Balls, 3: Random All Balls).
   */
  setModeInit(mode) {
    this.#clearBalls();

    let cueBall = this._createCueBall(true);
    this.balls.push(cueBall);
    window.cueBall = cueBall.body;
    // this.cue.cueBallInstance = cueBall;
    this.cue._setCueBallInstance(cueBall);

    if (mode === 1) {
      this.#setStandardPositions();
    } else if (mode === 2) {
      this.#setRandomRedBalls();
    } else if (mode === 3) {
      this.#setRandomAllBalls();
    }
  }

  /**
   * Creates and adds the cue ball to the ball manager.
   * @private
   */
  _createCueBall(physics = true) {
    const cueBallData = this.table.getInitBallsCoordinates().whiteBall;

    let cueBall = new CueBall(
      setBallColors()["white"].fill,
      setBallColors()["white"].stroke,
      { x: cueBallData.initX, y: cueBallData.initY },
      cueBallData.diameter,
      physics,
      {
        minX: cueBallData.minX,
        maxX: cueBallData.maxX,
        minY: cueBallData.minY,
        maxY: cueBallData.maxY,
      }
    );
    return cueBall;
  }

  /**
   * Clear all balls from the world and reset the array.
   * @private
   */
  #clearBalls() {
    this.balls.forEach((ball) => World.remove(engine.world, ball.body));
    this.balls = [];
  }

  /**
   * Set balls to standard positions.
   * MODE 1
   * @private
   */
  #setStandardPositions() {
    const positionsColorBalls = this.table.getInitBallsCoordinates();

    this.#addBallsFromPositions(positionsColorBalls["redBalls"], "red");
    this.#addBallsFromCoordinates([
      positionsColorBalls.greenBall,
      positionsColorBalls.brownBall,
      positionsColorBalls.yellowBall,
      positionsColorBalls.blueBall,
      positionsColorBalls.pinkBall,
      positionsColorBalls.blackBall,
    ]);
  }

  /**
   * Set red balls to random positions and place colored balls in standard positions.
   * MODE 2
   * @private
   */
  #setRandomRedBalls() {
    const positionsColorBalls = this.table.getInitBallsCoordinates();
    this.#addBallsFromCoordinates([
      positionsColorBalls.greenBall,
      positionsColorBalls.brownBall,
      positionsColorBalls.yellowBall,
      positionsColorBalls.blackBall,
    ]);
    this.#addRandomBalls("red", 15);
  }

  /**
   * Set all balls to random positions.
   * MODE 3
   * @private
   */
  #setRandomAllBalls() {
    //other colors
    const ballColors = setBallColors(); // Retrieve default ball colors
    // Iterate over ball colors and add balls to the game
    Object.keys(ballColors)
      .filter((color) => color !== "red" && color !== "white")
      .forEach((color) => {
        const { fill, stroke } = ballColors[color];
        this.balls.push(
          new Ball(
            fill,
            stroke,
            this.#createRandomPosition(),
            this.ballDiameter
          )
        );
      });

    this.#addRandomBalls("red", 15);
  }

  // ------------------------------------------------------------------------
  // ¬ Ball Addition Methods
  // ------------------------------------------------------------------------

  /**
   * Removes the specified ball from the game.
   *
   * @param {Object} ball - The ball object to remove.
   */
  removeBall(ball) {
    const index = this.balls.indexOf(ball);
    if (index > -1) {
      this.balls.splice(index, 1);
      World.remove(engine.world, ball.body);
    }
  }

  /**
   * Respawns the specified ball at its initial position.
   *
   * @param {Object} ball - The ball object to respawn.
   */
  respawnBall(ball) {
    if (ball instanceof CueBall) {
      this.#respawnCueBall();
    } else {
      this.#respawnColoredBall(ball);
    }
  }

  /**
   * Respawns the cue ball and enables its physics.
   */
  #respawnCueBall() {
    IS_CUEBALL_REPOSITIONING = true;
    this.initializeRespawnCueBall();
  }

  /**
   * Respawns a colored ball at its initial position based on its color.
   *
   * @param {Object} ball - The ball object to respawn.
   */
  #respawnColoredBall(ball) {
    const ballColors = setBallColors();
    const initCoords = this.table.getInitBallsCoordinates();
    const colorToCoordinateMap = {
      [ballColors.yellow.fill]: initCoords.yellowBall,
      [ballColors.green.fill]: initCoords.greenBall,
      [ballColors.brown.fill]: initCoords.brownBall,
      [ballColors.blue.fill]: initCoords.blueBall,
      [ballColors.pink.fill]: initCoords.pinkBall,
      [ballColors.black.fill]: initCoords.blackBall,
    };

    const coordinates = colorToCoordinateMap[ball.color];
    if (coordinates) {
      this.#addBallsFromCoordinates([coordinates]);
    }
  }

  /**
   * Add balls from predefined positions.
   * @private
   * @param {Object[]} positions - Array of position objects.
   * @param {string} color - Color of the balls to add.
   * @param {number} positions[].x - The x-coordinate of the ball.
   * @param {number} positions[].y - The y-coordinate of the ball.
   * @param {number} positions[].diameter - The diameter of the ball.
   * @example
   * const positions = [
   *   { x: 100, y: 200, diameter: 10 },
   *   { x: 120, y: 220, diameter: 10 },
   * ];
   * const color = "red";
   * this.#addBallsFromPositions(positions, color);
   */
  #addBallsFromPositions(positions, color) {
    positions.forEach(({ x, y, diameter }) => {
      this.balls.push(
        new Ball(
          setBallColors()[color].fill,
          setBallColors()[color].stroke,
          { x, y },
          diameter
        )
      );
    });
  }

  /**
   * Add balls from predefined coordinates.
   * @private
   * @param {Object[]} coordinates - Array of coordinate objects.
   * @param {string} coordinates[].color - Color of the ball.
   * @param {number} coordinates[].x - The x-coordinate of the ball.
   * @param {number} coordinates[].y - The y-coordinate of the ball.
   * @param {number} coordinates[].diameter - The diameter of the ball.
   * @example
   * const coordinates = [
   *   { color: "green", x: 150, y: 250, diameter: 10 },
   *   { color: "blue", x: 170, y: 270, diameter: 10 },
   * ];
   * this.#addBallsFromCoordinates(coordinates);
   */
  #addBallsFromCoordinates(coordinates) {
    coordinates.forEach(({ color, strokeColor, x, y, diameter }) => {
      this.balls.push(new Ball(color, strokeColor, { x, y }, diameter));
    });
  }

  /**
   * Add random balls of a specified color.
   * @private
   * @param {string} color - Color of the balls to add.
   * @param {number} count - Number of balls to add.
   */
  #addRandomBalls(color, count) {
    for (let i = 0; i < count; i++) {
      const position = this.#createRandomPosition();
      this.balls.push(
        new Ball(
          setBallColors()[color].fill,
          setBallColors()[color].stroke,
          position,
          this.ballDiameter
        )
      );
    }
  }

  // ------------------------------------------------------------------------
  // ¬ Random Position Creation Methods
  // ------------------------------------------------------------------------

  /**
   * Create a random position on the table that does not collide with other balls.
   * @private
   * @returns {Object} The random position with x and y coordinates.
   */
  #createRandomPosition() {
    let safeSpot = false;
    let randomPosBall;
    do {
      randomPosBall = this.table.getRandomPosition();
      safeSpot = this.#isSafeSpot(
        randomPosBall.x,
        randomPosBall.y,
        this.balls,
        this.ballDiameter * 2
      );
    } while (!safeSpot);

    return randomPosBall;
  }

  /**
   * Check if a position is safe for a new ball.
   * @private
   * @param {number} x - The x-coordinate of the position.
   * @param {number} y - The y-coordinate of the position.
   * @returns {boolean} True if the position is safe, otherwise false.
   */
  #isSafeSpot(x, y, balls, minDist) {
    if (balls.length > 1) {
      return balls.every((ball) => {
        const dx = ball.body.position.x - x;
        const dy = ball.body.position.y - y;
        return Math.sqrt(dx * dx + dy * dy) >= minDist;
      });
    }
    return true;
  }

  // ------------------------------------------------------------------------
  // ¬ Tools Methods
  // ------------------------------------------------------------------------

  /**
   * Initializes and respawns the cue ball on the snooker table.
   */
  initializeRespawnCueBall() {
    const cueBallData = this.table.getInitBallsCoordinates()["whiteBall"];
    const cueBallPosition = this.confinePointToZoneD(
      cueBallData.initX,
      cueBallData.initY
    );
    let cueBall = new CueBall(
      cueBallData.color,
      cueBallData.strokeColor,
      cueBallPosition,
      cueBallData.diameter,
      true,
      {
        minX: cueBallData.minX,
        maxX: cueBallData.maxX,
        minY: cueBallData.minY,
        maxY: cueBallData.maxY,
      }
    );
    this.balls.push(cueBall);
    window.cueBall = cueBall.body;
    this.cue.cueBallInstance = cueBall;
  }

  /**
   * Resets and repositions the cue ball to its initial position.
   */
  resetCueBallPosition() {
    const initPCueBall = this.table.getInitBallsCoordinates()["whiteBall"];
    const cueBallPosition = this.confinePointToZoneD(
      initPCueBall.initX,
      initPCueBall.initY
    );
    if (window.cueBall) {
      Matter.Body.setPosition(window.cueBall, cueBallPosition);
      Matter.Body.setVelocity(window.cueBall, { x: 0, y: 0 });
    }
  }

  /**
   * Confines a point (x, y) to the D-zone area of the snooker table.
   * Ensures that the point stays within the D-zone radius and does not exceed the D-zone center on the x-axis.
   *
   * @param {number} x - The x-coordinate of the point to confine.
   * @param {number} y - The y-coordinate of the point to confine.
   * @returns {Object} The confined point with x and y coordinates.
   */
  confinePointToZoneD(x, y) {
    // Retrieve D-zone data from the table
    const dZoneData = this.table._createDZonCoords(this.table.tableWidth);

    const dZoneRadius = dZoneData.dZoneRadius; // Radius of the D-zone
    const dZoneCenterX = dZoneData.dZoneCenter.x; // Center x-coordinate of the D-zone
    const dZoneCenterY = dZoneData.dZoneCenter.y; // Center y-coordinate of the D-zone

    let angle = atan2(y - dZoneCenterY, x - dZoneCenterX);
    // Angle from D-zone center to the point
    let distance = dist(x, y, dZoneCenterX, dZoneCenterY);
    // Distance from D-zone center to the point

    let dx = dZoneCenterX + dZoneRadius * cos(angle);
    let dy = dZoneCenterY + dZoneRadius * sin(angle);

    // Constrain the point to the D-zone perimeter if it exceeds the radius
    if (distance > dZoneRadius) {
      x = dx;
      y = dy;
    }

    // Ensure the x-coordinate does not exceed the D-zone center
    if (x > dZoneCenterX) {
      x = dZoneCenterX;
    }

    return { x: x, y: y };
  }

  /**
   * Toggles the neon trail state for each ball in the collection.
   * Usage: This method is useful in scenarios where a global effect needs to be applied or removed from all balls in the game, such as turning on or off neon trails for all balls simultaneously.
   */
  stateNeonTrail() {
    this.balls.forEach((ball) => ball.stateNeonTrail());
  }
}

// ------------------------------------------------------------------------
// ¬ Movement Check Functions
// ------------------------------------------------------------------------

/**
 * Checks if the given ball is moving.
 * @param {Object} ball - The ball object with velocity properties.
 * @returns {boolean} True if the ball is moving, otherwise false.
 */
function isBallMoving(ball) {
  const velocityThreshold = 0.03;
  return (
    Math.abs(ball.body.velocity.x) > velocityThreshold ||
    Math.abs(ball.body.velocity.y) > velocityThreshold
  );
}

/**
 * Checks if any ball in the game is currently moving.
 * @returns {boolean} True if any ball is moving, otherwise false.
 */
function anyBallMoving() {
  for (let ball of BallManager.getBalls()) {
    if (isBallMoving(ball)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if the cue ball is currently moving.
 * @returns {boolean} True if the cue ball is moving, otherwise false.
 */
function isCueBallMoving(cueBall) {
  if (cueBall) {
    return isBallMoving({ body: cueBall });
  }
  return false;
}

/**
 * Increases the speed of a ball by a given factor.
 *
 * @param {object} ball - The ball object.
 * @param {number} factor - The factor by which to increase the speed.
 */
function increaseSpeedToBall(ball, factor) {
  Matter.Body.setVelocity(
    ball.body,
    Matter.Vector.mult(ball.body.velocity, factor)
  );
}
