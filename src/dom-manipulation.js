/**
 * Initializes event listeners for game mode and table color selection.
 *
 * This script is designed to enhance the interactivity of a billiards game interface by allowing users to select different game modes and table styles.
 *
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Sets up event listeners for game mode buttons.
   * When a game mode button is clicked, it changes the game mode and resets relevant game state.
   */
  function setupGameModeListeners() {
    const gameModeButtons = document.querySelectorAll("[id^='game_mode']");
    gameModeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const mode = parseInt(button.id.split("_")[2]);
        if (mode === 4) {
          POWER_MODE = true;
        } else {
          POWER_MODE = false;
          changeGameMode(mode);
        }
      });
    });
  }

  /**
   * Sets up event listeners for table style buttons.
   * When a style button is clicked, it changes the table texture and cushion color based on the button's ID.
   */
  function setupTableStyleListeners() {
    const styleTableButtons = document.querySelectorAll("[id^='style_table']");
    styleTableButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const colorId = parseInt(button.id.split("_")[2]);
        switch (colorId) {
          case 1:
            changeTableStyle(tableTexBlue, getCushionColors().blue);
            speedBManager.updateColorSpeedBPU(getCushionColors().blue);
            break;
          case 2:
            changeTableStyle(tableTexPurple, getCushionColors().purple);
            speedBManager.updateColorSpeedBPU(getCushionColors().purple);
            break;
          case 3:
            changeTableStyle(tableTexOrange, getCushionColors().orange);
            speedBManager.updateColorSpeedBPU(getCushionColors().orange);
            break;
          case 4:
            changeTableStyle(tableTexGreen, getCushionColors().green);
            speedBManager.updateColorSpeedBPU(getCushionColors().green);
            break;
          default:
            break;
        }
      });
    });
  }

  // Initialize listeners when DOM content is fully loaded
  setupGameModeListeners();
  setupTableStyleListeners();
});

/**
 * Changes the game mode and resets relevant game state.
 * @param {number} mode - The game mode identifier.
 */
function changeGameMode(mode) {
  setBallMode(mode); // Sets the ball mode (e.g., different game rules)
  BallManager.resetCueBallPosition(); // Resets cue ball position on mode change
  IS_CUEBALL_REPOSITIONING = true; // Flags cue ball repositioning state
  cueManager.resetCueState(); // Resets the cue stick state
}

/**
 * Changes the table style by updating its texture and cushion color.
 * @param {Texture} texture - The new texture to apply to the table surface.
 * @param {Color} color - The new color to apply to the table's cushions.
 */
function changeTableStyle(texture, color) {
  console.log(`Changing table color to: ${color}`);
  TableManager.updateSurfaceTexture(texture); // Updates table surface texture
  TableManager.updateCushionColor(color); // Updates cushion color
}

/**
 * Updates the display of alert messages in the interface.
 */
function updateAlertsDisplay() {
  const alertsDiv = document.getElementById("alerts");
  const messagesToDisplay = alertMessages.slice(-MAX_ALERT_MESSAGES);
  alertsDiv.innerHTML = messagesToDisplay.join("<br>");
}
