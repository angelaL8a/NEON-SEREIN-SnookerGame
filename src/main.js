//============================================================================//
// ¬ App Design
/**Neon Serein Snooker is a snooker game inspired by futuristic and revolutionary
 themes, characterized by its neon glassmorphism aesthetic and emphasis on user 
 customization. It features multiple gameplay modes switchable via keys (1, 2, 3, 4)
  or corresponding buttons, along with diverse billiard table styles for user 
  preference. The visual design of the table and its components (balls, cue, cushions,
  etc.) incorporates futuristic and realistic textures, achieved through advanced 
  p5.js functionalities. Each component operates independently and modularly, with
  dedicated classes for the table, balls, and cue, ensuring efficient and organized
  functionality.

  Player control of the cue leverages intuitive mouse and keyboard (UP/w, DOWN/s)
  inputs for precise strike force and positioning. Leveraging Matter.js, every 
  component is equipped with a physical body for accurate collision detection and 
  realistic physics simulation. The game enhances immersion with a variety of sound 
  effects, complementing its visual appeal. Clear alerts and detailed instructions 
  facilitate user understanding and gameplay comfort, particularly beneficial for 
  newcomers to the game. */
//============================================================================//

//============================================================================//
// ¬ Game Extension
/**My game extension introduces three phases:

Aesthetics: I implemented a futuristic aesthetic allowing users to interact directly with buttons to switch between modes and change table styles.

Functionality: I added a cue force bar for adjusting strike strength, real-time alerts for game status visibility, and realistic sounds for immersive gameplay. Pressing the "t" key toggles neon trails on the balls, adding a playful aesthetic touch.

Game Type (Power Mode): The fourth game type introduces a Power-boost mode, where the cueball can increase its speed by passing through designated neon boost spots on the table. Boost spots, represented by small neon marks (implemented using advanced p5.js drawing functions), enhance the cueball's speed for added excitement. */
//============================================================================//

//============================================================================//
// ¬ Game Features
/**1. Customizable Table Textures: Choose from a selection of futuristic table textures
  to suit your visual preference.
2. Multiple Game Modes: Switch between different game modes, including Power Mode,
  Time Trial, and Classic, to experience diverse gameplay.
3. Speed Boost Power-Up: Activate the Speed Boost Power-Up to temporarily increase the
  speed of the cue ball.
4. Realistic Physics Simulation: Enjoy accurate physics simulation for realistic
  gameplay experience.
5. Neon Glassmorphism Aesthetic: Experience a visually stunning neon glassmorphism
  design throughout the game.
6. User-Friendly Controls: Utilize intuitive mouse and keyboard controls for precise
  cue positioning and striking.
7. Sound Effects: Immerse yourself in the game with dynamic sound effects for
  collisions and interactions.
8. Clear Alerts and Instructions: Receive clear alerts and detailed instructions to
  enhance your understanding and enjoyment of the game. */
//============================================================================//

// Matter.js Aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

let engine; // Physics engine for the game

let frameX, frameY, frameWidth, frameHeight; // Frame dimensions and position

let snookerTable; // Snooker table object
let bgImage; // Background image
let tableTexBlue, tableTexOrange, tableTexPurple; // Table textures

let BallManager; // Manager for snooker balls
let TableManager; // Manager for the snooker table
let cueManager; // Manager for the cue
let balls = []; // Array of snooker balls
let ballsToRespawn = []; // Array of balls to respawn

let cue; // Cue object
let cueLength; // Length of the cue
let cueWidth; // Width of the cue
let cueColor; // Color of the cue

let cueForceBarX; // X position of the cue force bar
let cueForceBarY; // Y position of the cue force bar
let cueForceBarWidth; // Width of the cue force bar
let cueForceBarHeight; // Height of the cue force bar

let BALL_MODE = 1; // Current mode of the balls
let POWER_MODE = false; // Indicates if power mode is active

let IS_CUEBALL_REPOSITIONING = true; // Indicates if the cue ball is being repositioned
let IS_CUEBALL_INITIALPOS = true; // Indicates if the cue ball is in its initial position in the D zone

let colorBallInPocketCount = 0; // Counter for colored balls in pockets

let audioContext; // Audio context for managing sounds
let collisionSound, cueballRespawn, fallPocket; // Sound effects
let playCollisionSound = false; // Flag to play collision sound

let alertMessages = []; // Array of alert messages
const MAX_ALERT_MESSAGES = 1; // Maximum number of alert messages

let speedBManager; // Manager for the speed boost power-up
let speedBPU; // Speed boost power-up object

/**
 * Preloads assets such as images and sounds.
 */
function preload() {
  bgImage = loadImage("Images/main/backgroundBlur.png");

  tableTexBlue = loadImage("Images/textures/table-tex-blue.png");
  tableTexOrange = loadImage("Images/textures/table-tex-orange.png");
  tableTexPurple = loadImage("Images/textures/table-tex-purple.png");
  tableTexGreen = loadImage("Images/textures/table-tex-green.png");

  soundFormats("wav");
  collisionSound = loadSound("sound/shot-collide.wav");
  cueballRespawn = loadSound("sound/cueball-respawn.wav");
  fallPocket = loadSound("sound/fall-pocket.wav");
}

/**
 * Initializes the game setup, including the canvas, audio context, and game objects.
 */
function setup() {
  let canvas = createCanvas(900, 500);
  canvas.parent("canvas_container");
  // Create canvas (x, y) preferably x-100 = 2(y-100) to use these variables for the frame dimensions.

  audioContext = getAudioContext();
  canvas.mousePressed(startAudio);

  engine = Engine.create();

  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;

  frameX = 50; // X position of the frame
  frameY = 50; // Y position of the frame
  frameWidth = width - 100; // Width of the frame
  frameHeight = height - 100; // Height of the frame
  // Maintain ratio 12 ft × 6 ft. ==> frameWidth = frameHeight * 2

  cueLength = -frameWidth / 4;
  cueWidth = frameWidth / 120;

  cueForceBarX = 0;
  cueForceBarY = 0;
  cueForceBarWidth = 25;
  cueForceBarHeight = 100;

  speedBPUSize = frameWidth / 30;

  //=========================================
  // ¬ Initialize Game
  //=========================================

  snookerTable = new SnookerTable(frameWidth, frameHeight, tableTexBlue);

  BallManager = new SnookerBallManager(balls, snookerTable);

  cue = new Cue(cueLength, cueWidth, initializeCueBall(false), setCueColors());

  BallManager.setCue(cue);
  BallManager.setModeInit(BALL_MODE);

  cueManager = new CueManager(cue);
  TableManager = new SnookerTableManager(snookerTable);

  speedBPU = new speedBoostPowerUp();
  setUpSpeedBoostRandom();
  speedBManager = new speedBoostPowerUpManager(speedBPU);

  //============================================================================//
  // ¬ Cueball Collision Context
  //============================================================================//
  Matter.Events.on(engine, "collisionStart", handleCollisionCueBall);
}

/**
 * Main draw loop for the game. Updates and renders all game elements.
 */
function draw() {
  push();
  translate(frameX, frameY); // Move the origin of the canvas to the frame's position

  background(bgImage); // Draw the background image

  // Translate mouse coordinates to be relative to the frame
  const translatedMouseX = mouseX - frameX;
  const translatedMouseY = mouseY - frameY;

  // Check if the cue ball is being repositioned and no other balls are moving
  if (IS_CUEBALL_REPOSITIONING && !anyBallMoving()) {
    // Constrain the new position of the cue ball within the D zone
    let newPosition = BallManager.confinePointToZoneD(
      translatedMouseX,
      translatedMouseY
    );
    Matter.Body.setPosition(window.cueBall, newPosition);
  } else {
    Engine.update(engine); // Update the physics engine
  }

  snookerTable.drawTable(); // Draw the snooker table

  // If power mode is active, draw the speed boost power-up and handle its effects
  if (POWER_MODE) {
    speedBPU.draw();
    cueBallInSpeedBoostHandle();
  }

  // Update and draw all snooker balls
  BallManager.getBalls().forEach((ball) => {
    if (!IS_CUEBALL_REPOSITIONING) ball.update();
    ball.draw();
  });

  // Update and draw the cue if applicable
  if (shouldUpdateCue()) {
    cueManager.updateCuePosition();
    cue.display();
    cueManager.drawForceBar(
      cueForceBarX,
      cueForceBarY,
      cueForceBarWidth,
      cueForceBarHeight,
      setForceBarColors().bar,
      setForceBarColors().fill
    );
    cueManager.drawDirectioner(frameWidth);
  }

  handleBallPocketCollisions(); // Handle collisions between balls and pockets
  respawnQueuedBalls(); // Respawn any balls that have been pocketed
  handleSoundPlayback(); // Handle playback of sound effects

  pop();

  increaseCueForce(); // Increase the force of the cue if applicable
  decreaseCueForce(); // Decrease the force of the cue if applicable
}

/**
 * Initializes the cue ball.
 * @param {boolean} [physics=true] - Enable or not physics for the cue ball.
 * @returns {Object} - The initialized cue ball object.
 */
function initializeCueBall(physics = true) {
  let initialCueBall = BallManager._createCueBall(physics);
  return initialCueBall;
}

/**
 * Determines if the cue should be updated based on its current state.
 * @returns {boolean} - True if the cue should be updated, false otherwise.
 */
function shouldUpdateCue() {
  return (
    !IS_CUEBALL_REPOSITIONING && (!anyBallMoving() || cueManager.isStriking)
  );
}

//=========================================//
// ¬ Ball & Pockets
//=========================================//

/**
 * Handles collisions between balls and pockets.
 * Checks if any ball is in a pocket and processes it accordingly.
 */
function handleBallPocketCollisions() {
  const balls = BallManager.getBalls();
  balls.forEach((ball) => {
    if (TableManager.isBallInPocket(ball)) {
      cueballRespawn.play();
      processPocketedBall(ball);
    }
  });
}

/**
 * Processes a ball that has been pocketed.
 *
 * This function handles the removal of the pocketed ball from the game and
 * determines the appropriate action based on the type of ball.
 * If the ball is a CueBall, it is queued for respawn.
 * If the ball is a coloured ball (neither white nor red), it is queued for respawn
 * and the count of consecutive coloured balls pocketed is incremented.
 * Otherwise, the count of consecutive coloured balls is reset.
 *
 * @param {Object} ball - The ball object that has been pocketed.
 */
function processPocketedBall(ball) {
  BallManager.removeBall(ball); // Remove the pocketed ball from the game

  if (ball instanceof CueBall) {
    ballsToRespawn.push(ball); // Queue the CueBall for respawn
    displayAlert(getMessagesGame().cueBallPocketed);
  } else if (isColouredBall(ball)) {
    ballsToRespawn.push(ball);
    displayAlert(getMessagesGame().coloredBallPocketed);

    // Increment the count of consecutive coloured balls pocketed
    incrementColouredCount();
  } else {
    displayAlert(getMessagesGame().redBallPocketed);
    // Reset the count of consecutive coloured balls pocketed
    resetColouredCount();
  }
}

/**
 * Checks if the given ball is a coloured ball (not white or red).
 *
 * @param {Object} ball - The ball object to check.
 * @returns {boolean} - True if the ball is coloured, false otherwise.
 */
function isColouredBall(ball) {
  const { white, red } = setBallColors();
  return ball.color !== white.fill && ball.color !== red.fill;
}

/**
 * Increments the count of consecutive coloured balls pocketed.
 * If two consecutive coloured balls are pocketed, a message is displayed.
 */
function incrementColouredCount() {
  colorBallInPocketCount++;
  if (colorBallInPocketCount === 2) {
    displayMessage(
      "Two consecutive coloured balls pocketed!",
      frameWidth / 2,
      frameHeight / 2
    );
    displayAlert(getMessagesGame().twoColouredBalls);
  }
}

/**
 * Resets the count of consecutive coloured balls pocketed to zero.
 */
function resetColouredCount() {
  colorBallInPocketCount = 0;
}

/**
 * Respawns balls that have been queued for respawn if no balls are currently moving.
 * Clears the queue after respawning the balls.
 */
function respawnQueuedBalls() {
  if (!anyBallMoving() && ballsToRespawn.length > 0) {
    ballsToRespawn.forEach((ball) => {
      BallManager.respawnBall(ball);
    });
    ballsToRespawn = [];
  }
}

/**
 * Handles the event when the cue ball collides with another ball.
 * @param {Object} event - The collision event object.
 */
function handleCollisionCueBall(event) {
  let pairs = event.pairs;
  pairs.forEach((pair) => {
    // console.log(pair.bodyA.label, pair.bodyB.label);
    if (isCueBallCollision(pair.bodyA, pair.bodyB)) {
      playCollisionSound = true;
    }
  });
}

/**
 * Checks if a collision involves the cue ball and another ball.
 * @param {Object} bodyA - The first body in the collision.
 * @param {Object} bodyB - The second body in the collision.
 * @returns {boolean} - True if the collision involves the cue ball and another ball, false otherwise.
 */
function isCueBallCollision(bodyA, bodyB) {
  return (
    (bodyA.label === "cueBall" && bodyB.label === "ball") ||
    (bodyB.label === "cueBall" && bodyA.label === "ball")
  );
}

//=========================================//
// ¬ Sound
//=========================================//
/**
 * Starts the audio context if it is not already running.
 */
function startAudio() {
  if (audioContext.state !== "running") {
    audioContext.resume().then(() => {
      console.log("AudioContext is now running");
    });
  }
}

/**
 * Handles the playback of collision sound effects.
 */
function handleSoundPlayback() {
  if (playCollisionSound && audioContext.state === "running") {
    collisionSound.play();
    playCollisionSound = false;
  }
}

//===========================================//
// ¬ POWER mode (Speed Boost Power-Up) key - 4
//This section of the code handles the "POWER MODE" functionality in the snooker game. When the player presses the '4' key, the game enters POWER MODE, where a speed boost power-up is activated on the table. The speed boost power-up provides a temporary speed increase to the cue ball that comes into contact with it. The following functions are responsible for setting up, handling, and managing it.
//===========================================//

/**
 * Sets up the speed boost power-up at a random safe position on the table.
 * Ensures that the position is not overlapping with any existing balls.
 */
function setUpSpeedBoostRandom() {
  let speedBPUPos = getSafeSpotInTable(BallManager.getBalls(), speedBPUSize);
  speedBPU.setPosition(speedBPUPos.x, speedBPUPos.y);
  speedBPU.setSize(speedBPUSize);
}

/**
 * Handles the interaction between the cue ball and the speed boost power-up.
 * If the cue ball is within the speed boost area, increases its speed and resets
 * the position of the speed boost power-up.
 */
function cueBallInSpeedBoostHandle() {
  if (ballInSpeedBoost(cue.cueBallInstance)) {
    increaseSpeedToBall(cue.cueBallInstance, 1.5);
    resetSpeedBoostPosition();
  }
}

/**
 * Resets the position of the speed boost power-up to a new random safe spot on the table.Ensures that the new position is not overlapping with any existing balls.
 */
function resetSpeedBoostPosition() {
  let newSpeedBPUPos = getSafeSpotInTable(BallManager.getBalls(), speedBPUSize);
  speedBManager.resetPositionSpeedBPU(newSpeedBPUPos.x, newSpeedBPUPos.y);
}

/**
 * Checks if a ball is within the area of the speed boost power-up.
 * @param {Ball} ball - The ball to check for collision with the speed boost power-up.
 * @returns {boolean} True if the ball is within the speed boost area, false otherwise.
 */
function ballInSpeedBoost(ball) {
  return speedBManager.isWithinSpeedBoostPowerUp(ball);
}
