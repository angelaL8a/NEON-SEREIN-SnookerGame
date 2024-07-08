/**
 * Sets the colors for the snooker balls.
 *
 * This function allows you to customize the colors of the snooker balls used in the game.
 * If no arguments are provided, it defaults to the standard snooker ball colors.
 *
 * @param {string} [_red='red'] - The color for the red ball.
 * @param {string} [_yellow='yellow'] - The color for the yellow ball.
 * @param {string} [_green='green'] - The color for the green ball.
 * @param {string} [_brown='brown'] - The color for the brown ball.
 * @param {string} [_blue='blue'] - The color for the blue ball.
 * @param {string} [_pink='pink'] - The color for the pink ball.
 * @param {string} [_black='black'] - The color for the black ball.
 * @param {string} [_white='white'] - The color for the white (cue) ball.
 * @returns {Object} An object containing the colors for each ball.
 *
 * @example
 * const customColors = setBallColors('maroon', 'gold', 'lime', 'chocolate', 'navy', 'hotpink', 'black', 'ivory');
 * console.log(customColors);
 * * Output: { red: 'maroon', yellow: 'gold', green: 'lime', brown: 'chocolate', blue: 'navy', pink: 'hotpink', black: 'black', white: 'ivory' }
 */
function setBallColors(
  _red = { fill: "#f00001", stroke: "#a30000" },
  _yellow = { fill: "#feff00", stroke: "#b1b200" },
  _green = { fill: "#9ef01a", stroke: "#003600" },
  _brown = { fill: "#9d5d1f", stroke: "#502f0f" },
  _blue = { fill: "blue", stroke: "#001430" },
  _pink = { fill: "pink", stroke: "#b2868e" },
  _black = { fill: "black", stroke: "black" },
  _white = { fill: "white", stroke: "#ede7e3" }
) {
  const ballColors = {
    red: _red,
    yellow: _yellow,
    green: _green,
    brown: _brown,
    blue: _blue,
    pink: _pink,
    black: _black,
    white: _white,
  };

  return ballColors;
}

/**
 * Sets the colors for a snooker cue.
 *
 * @param {string} [_handle="#6f482a"] - The color of the handle.
 * @param {string} [_shaft="#fcf2cd"] - The color of the shaft.
 * @param {string} [_tip="#fcf2cd"] - The color of the tip.
 * @param {string} [_centerTip="#505050"] - The color of the center tip.
 * @returns {Object} - An object containing the cue colors.
 * @example
 * const customCueColors = setCueColors('brown', 'beige', 'beige', 'gray');
 */
function setCueColors(
  _handle = "#6f482a",
  _shaft = "#fcf2cd",
  _tip = "#fcf2cd",
  _centerTip = "#505050"
) {
  const cueColors = {
    handle: _handle,
    shaft: _shaft,
    tip: _tip,
    centerTip: _centerTip,
  };

  return cueColors;
}

/**
 * Customizes and returns the color scheme for the force bar in a game.
 *
 * This function allows for the customization of the force bar's appearance by setting the colors for the bar's background and the fill that indicates the current level of force.
 * @param {string} [_bar="#04151f"]  - The color for the bar's background.
 * @param {string} [_fill="#6fffe9"]  - The color code for the fill (force level).
 * @returns {Object} An object containing the color codes for the bar and its fill, allowing for easy access and use in game rendering.
 */
function setForceBarColors(
  _bar = "rgba(202, 242, 230, 0.65)", //CAF2E6
  _fill = "#c88b22"
) {
  const forceBarColors = {
    bar: _bar, // Color for the bar's background
    fill: _fill, // Color for the fill indicating force level
  };

  return forceBarColors;
}

/**
 * Returns an object containing the colors of the snooker cushion.
 *
 * @returns {Object} An object with cushion colors.
 * @property {string} blue - The color code for the blue cushion.
 * @property {string} orange - The color code for the orange cushion.
 * @property {string} purple - The color code for the purple cushion.
 * @property {string} green - The color code for the green cushion.
 */
function getCushionColors(
  _blue = "#0a635c",
  _orange = "#bd632f",
  _purple = "#8e008b",
  _green = "#2aae80"
) {
  return {
    blue: _blue,
    orange: _orange,
    purple: _purple,
    green: _green,
  };
}

/**
 * Retrieves messages for different game states and ball-related events.
 * Messages include notifications for consecutive colored balls pocketed,
 * fouls such as pocketing the cue ball, successful pocketing of a red ball,
 * and fouls for not pocketing the correct ball.
 *
 * @returns {Object} An object containing messages for game events:
 * - twoColouredBalls: Message for two consecutive colored balls pocketed.
 * - cueBallPocketed: Message for fouling by pocketing the cue ball.
 * - redBallPocketed: Message for successfully pocketing a red ball.
 * - coloredBallPocketed: Message for fouling by not pocketing the correct ball.
 */
function getMessagesGame() {
  return {
    twoColouredBalls: "Two consecutive coloured balls pocketed! 🌸🎱",
    cueBallPocketed: "❌ Foul: 🤦🏾‍♂️ Uh-oh! Cue ball's pocketed, pal.",
    redBallPocketed: "🎱 Nice shot! A red ball's pocketed!",
    coloredBallPocketed:
      "❌ Foul: 🤦🏽‍♂️ Oi, blimey! Ya should've sunk the red ball, ya muppet!",
  };
}

/**
 * Displays a message on the screen at the specified position.
 *
 * @param {string} text - The text to be displayed.
 * @param {number} x - The x-coordinate of the message position.
 * @param {number} y - The y-coordinate of the message position.
 * @param {number} [color=255] - The color of the text (default is white).
 * @param {number} [size=32] - The size of the text (default is 32).
 * @param {number} [timeout=5000] - The duration in milliseconds for which the message will be displayed (default is 5000).
 * @example
 * Display a message "Game Over" at position (200, 300)
 * with red color and larger size for 3 seconds.
 * displayMessage("Game Over", 200, 300, "red", 48, 3000);
 */
function displayMessage(
  _text,
  x,
  y,
  _strokeWeight = 4,
  _stroke = 50,
  color = "#caf0f8",
  size = 32,
  timeout = 5000
) {
  push();
  fill(color);
  strokeWeight(_strokeWeight);
  stroke(_stroke);
  textAlign(CENTER, CENTER);
  textSize(size);
  textStyle(ITALIC);
  text(_text, x, y);
  pop();

  // Remove the message after N seconds
  setTimeout(() => {
    clear();
  }, timeout);
}

/**
 * Displays an alert message with the current timestamp.
 * @param {string} message - The alert message to display.
 */
function displayAlert(message) {
  const timestamp = new Date().toLocaleTimeString();
  const formattedMessage = `<strong>${timestamp}</strong>: ${message}`;

  // Push the formatted message to the alertMessages array
  alertMessages.push(formattedMessage);

  // If exceeding the maximum number of messages, remove the oldest one
  if (alertMessages.length > MAX_ALERT_MESSAGES) {
    alertMessages.shift();
  }

  updateAlertsDisplay(); // Update the display of alert messages in the interface

  // Remove the message after 30 seconds
  setTimeout(() => {
    alertMessages = alertMessages.filter((msg) => msg !== formattedMessage);
    updateAlertsDisplay();
  }, 30000);
}

/**
 * Generates a safe spot on the snooker table, ensuring it is at least a minimum distance away from balls.
 *
 * @param {Array} balls - The array of existing balls on the table.
 * @param {number} minDist - The minimum distance required between the new object and existing balls.
 * @returns {Object} - The randomly generated safe spot on the table.
 */
function getSafeSpotInTable(balls, minDist) {
  let safeSpot = false;
  let randomPos;
  do {
    randomPos = snookerTable.getRandomPosition();
    safeSpot = isSafeSpot(randomPos.x, randomPos.y, balls, minDist);
  } while (!safeSpot);

  return randomPos;
}

/**
 * Checks if a given spot is safe by ensuring it is at least a minimum distance away from all balls.
 *
 * @param {number} x - The x-coordinate of the spot to check.
 * @param {number} y - The y-coordinate of the spot to check.
 * @param {Array} balls - An array of balls to compare the spot against.
 * @param {number} minDist - The minimum distance required between the spot and each ball.
 * @returns {boolean} - Returns true if the spot is safe, false otherwise.
 */
function isSafeSpot(x, y, balls, minDist) {
  if (balls.length > 1) {
    return balls.every((ball) => {
      const dx = ball.body.position.x - x;
      const dy = ball.body.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) >= minDist;
    });
  }
  return true;
}
