// Data for the information content displayed on the screen.
const infoContent = [
  {
    className: "info_container_left",
    text: `Welcome to Serein Neon Snooker! Dive into a mesmerizing solo snooker experience where the calm of a serene evening meets the vibrant energy of neon lights. Play snooker like never before, navigating sleek and stylish tables under the glow of dazzling neon. Whether you're a snooker pro or a curious beginner, Serein Neon Snooker offers a unique and captivating challenge. Perfect your shots, master the angles, and enjoy the tranquility of solo play in this modern twist on a classic game. Get ready to cue up and shine in the neon glow!`,
  },
  {
    className: "info_container_right",
    text: `On the left side of the screen, you'll find buttons to switch between different game modes, or you can simply press the keys 1, 2, 3 or 4.`,
  },
  {
    className: "info_container_left",
    text: `On the right side, you can change the color of the table surface to match your mood and style. Get ready to cue up and shine in the neon glow!`,
  },
  {
    className: "info_container_right",
    text: `When using the cue, you can calibrate the strength of your shot with the up/W and down/S arrow keys on your keyboard. Get ready to cue up and shine in the neon glow!`,
  },
  {
    className: "info_container_left",
    text: `Activate Neon Trails with "t"! 
    Hey there, neon snooker enthusiast! Ready to light up the game? Press the "t" key to unleash dazzling neon trails on the balls. Watch them glow and add a touch of flair to your shots. It's time to play with style and shine bright on the snooker table!`,
  },
  {
    className: "info_container_right",
    text: `Mode "4": Power-boost Excitement! 
    Get ready for an adrenaline rush! Mode "4" introduces Power-boost, where strategic neon spots on the table turbocharge your cue ball's speed. Look out for glowing markers—when your cue ball zips through one, it accelerates for an electrifying advantage! Embrace the speed, aim sharp, and dominate the game with a boost of excitement!`,
  },
];

// Data for the buttons used to change the style of the table surface.
const styleButtons = [
  { id: "style_table_1", className: "game_color_table game_color_table_1" },
  { id: "style_table_2", className: "game_color_table game_color_table_2" },
  { id: "style_table_3", className: "game_color_table game_color_table_3" },
  { id: "style_table_4", className: "game_color_table game_color_table_4" },
];

// Data for the buttons used to switch between different game modes.
const gameModeButtons = [
  { id: "game_mode_1", text: "1" },
  { id: "game_mode_2", text: "2" },
  { id: "game_mode_3", text: "3" },
  { id: "game_mode_4", text: "4" },
];

/**
 * Creates and appends information content to the info container.
 * This function reads from the `infoContent` array and dynamically generates
 * HTML elements to display the information on the screen.
 */
function createInfoContent() {
  const infoContainer = document.getElementById("info");

  infoContent.forEach((item) => {
    const container = document.createElement("div");
    container.className = item.className;

    const infoBox = document.createElement("div");
    infoBox.className = "info_box";
    infoBox.innerText = item.text;

    container.appendChild(infoBox);
    infoContainer.appendChild(container);
  });
}

/**
 * Creates and appends buttons for changing the table style to the appropriate container.
 * This function reads from the `buttonData` array and dynamically generates
 * HTML elements to display the buttons on the screen.
 */
function createButtonsStyleTable() {
  const buttonContainer = document.getElementById("gameStyleTableContainer");

  styleButtons.forEach((item) => {
    const button = document.createElement("button");
    button.id = item.id;
    button.className = "game_mode_button button_style";

    const div = document.createElement("div");
    div.className = item.className;

    button.appendChild(div);
    buttonContainer.appendChild(button);
  });
}

/**
 * Creates and appends buttons for changing the game mode to the appropriate container.
 * This function reads from the `gameModeButtons` array and dynamically generates
 * HTML elements to display the buttons on the screen.
 */
function createGameModeButtons() {
  const gameModeContainer = document.getElementById("gameModeContainer");

  gameModeButtons.forEach((item) => {
    const button = document.createElement("button");
    button.id = item.id;
    button.className = "game_mode_button button_style";
    button.textContent = item.text;

    gameModeContainer.appendChild(button);
  });
}

// Event listeners to run the functions when the DOM content is fully loaded.
document.addEventListener("DOMContentLoaded", createInfoContent);
document.addEventListener("DOMContentLoaded", createButtonsStyleTable);
document.addEventListener("DOMContentLoaded", createGameModeButtons);
