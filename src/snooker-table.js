// Constants for the table dimensions, colors, and ball diameter
const TABLE_COLOR = "#a7c957"; // Green color for the table
const POCKET_COLOR = "#251814"; // Black color for the pockets
const BORDERS_COLOR = "#53250b";
const CUSHION_COLOR = getCushionColors().blue;
const POCKET_BORDER_COLOR = "#c88b22";

///////////////////////////////////////////////////////////////////////////////
// ¬ Snooker Table Configuration and Initialization
///////////////////////////////////////////////////////////////////////////////
/**
 * A class representing a snooker table.
 */
class SnookerTable {
  /**
   * Constructs a new SnookerTable object.
   *
   * @param {number} frameWidth - The width of the space available for the table.
   * @param {number} frameHeight - The height of the space available for the table.
   * @param {string} tableColor - The color of the table surface.
   * @param {string} pocketColor - The color of the pockets.
   * @param {string} borderColor - The color of the borders.
   * @param {string} cushionColor - The color of the cushions.
   * @param {string} pocketBorderColor - The color of the pocket borders.
   */
  constructor(
    frameWidth,
    frameHeight,
    textureSurface = null,
    tableColor = TABLE_COLOR,
    pocketColor = POCKET_COLOR,
    borderColor = BORDERS_COLOR,
    cushionColor = CUSHION_COLOR,
    pocketBorderColor = POCKET_BORDER_COLOR
  ) {
    this.width = frameWidth;
    this.height = frameHeight;

    this.tableWidth = this.width * 0.8;
    this.tableHeight = this.tableWidth / 2;

    this.tableColor = tableColor;
    this.pocketColor = pocketColor;
    this.borderColor = borderColor;
    this.cushionColor = cushionColor;
    this.pocketBorderColor = pocketBorderColor;

    this.textureSurface = textureSurface;

    // Calculate dimensions based on table width
    this.ballDiameter = this.tableWidth / 36;
    this.pocketDiameter = this.ballDiameter * 1.5;
    this.pocketRadius = this.pocketDiameter / 2;

    this.#initTable();
  }

  /**
   * Initializes the table by the borders and cushions.
   * @private
   */
  #initTable() {
    this.#createBorders();
    this.#createCushions();
  }

  /////////////////////////////////////////////////////////////////////////////
  // ¬ Table Bodies Creation Methods
  /////////////////////////////////////////////////////////////////////////////
  /**
   * Creates the borders of the table using the Matter.js physics engine.
   * This method defines the physical boundaries for the snooker table
   * @private
   */
  #createBorders() {
    const borderOptions = {
      isStatic: true,
      restitution: 0.96,
    };

    const borderThickness = this.ballDiameter * 1.5;

    const borders = [
      // Top border
      Bodies.rectangle(
        this.width / 2,
        (this.height - this.tableHeight) / 2 - borderThickness,
        this.tableWidth + borderThickness * 2,
        borderThickness,
        borderOptions
      ),
      // Bottom border
      Bodies.rectangle(
        this.width / 2,
        (this.height + this.tableHeight) / 2 + borderThickness,
        this.tableWidth + borderThickness * 2,
        borderThickness,
        borderOptions
      ),
      // Left border
      Bodies.rectangle(
        (this.width - this.tableWidth) / 2 - borderThickness,
        this.height / 2,
        borderThickness,
        this.tableHeight + borderThickness * 2,
        borderOptions
      ),
      // Right border
      Bodies.rectangle(
        (this.width + this.tableWidth) / 2 + borderThickness,
        this.height / 2,
        borderThickness,
        this.tableHeight + borderThickness * 2,
        borderOptions
      ),
    ];

    World.add(engine.world, borders);
  }

  /**
   * Creates the cushions of the table using the Matter.js physics engine.
   * This method defines the physical cushions for the snooker table
   * @private
   */
  #createCushions() {
    const cushionOptions = {
      isStatic: true,
      restitution: 0.8,
    };

    const cushionsData = this.#getCushionData();

    cushionsData.forEach((cushion) => {
      const cushionBody = this.#createCushionBody(
        cushion,
        cushionOptions,
        cushion.length
      );
    });
  }

  /**
   * Creates a cushion body.
   * @private
   */
  #createCushionBody(cushion, options, cushionLength) {
    const cushionWidth = this.ballDiameter * 1.5;

    const vertices = [
      { x: -cushionLength / 2, y: -cushionWidth / 2 },
      { x: cushionLength / 2, y: -cushionWidth / 2 },
      { x: cushionLength / 2 - cushionWidth, y: cushionWidth / 2 },
      { x: -cushionLength / 2 + cushionWidth, y: cushionWidth / 2 },
    ];

    const cushionBody = Matter.Bodies.fromVertices(
      cushion.x,
      cushion.y,
      vertices,
      options,
      true
    );
    Matter.Body.setAngle(cushionBody, radians(cushion.rotation));
    World.add(engine.world, cushionBody);
  }

  /////////////////////////////////////////////////////////////////////////////
  // ¬ Table Coordinates Calculation Methods
  /////////////////////////////////////////////////////////////////////////////
  /**
   * Calculates and sets the center and radius of the D-Zone.
   * The D-Zone is the area in the middle of the table where the balls are placed at the start of a game.
   * @protected
   * @param {number} tableWidth - The width of the table.
   * @returns {Object} An object containing the coordinates for the center and the radius of the D-Zone.
   */
  _createDZonCoords(tableWidth) {
    return {
      /**
       * The radius of the D-Zone. It is calculated as a fraction of the table width.
       * @type {number}
       */
      dZoneRadius: tableWidth / 12,
      /**
       * The center coordinates of the D-Zone.
       * @type {{x: number, y: number}}
       */
      dZoneCenter: {
        x: this.width / 4 + this.ballDiameter * 1.2,
        y: this.height / 2,
      },
    };
  }

  /**
   * Creates the coordinates for the table surface.
   * @private
   * @param {number} tableWidth - The width of the table.
   * @param {number} tableHeight - The height of the table.
   * @returns {Object} An object containing the x, y, width, and height coordinates for the table surface.
   */
  #createCoordsTableSurface(tableWidth, tableHeight) {
    return {
      x: tableWidth * 0.103 - this.pocketDiameter,
      y: (this.height - tableHeight) / 3,
      width: tableWidth * 1.085 + this.pocketDiameter,
      height: tableWidth * 0.5 + this.pocketDiameter,
    };
  }

  /**
   * Calculates the coordinates for the borders around the table surface.
   * @private
   * @param {Object} _coordsSurface - The coordinates of the table surface.
   * @returns {Array<Object>} An array of objects containing the coordinates and dimensions for each border.
   */
  #getBordersCoordinates(_coordsSurfacer) {
    const coordsSurface = _coordsSurfacer;
    return [
      {
        //top border
        x: coordsSurface.x,
        y: 0,
        width: coordsSurface.width,
        height: coordsSurface.y,
        roundedArray: [100, 100, 0, 0],
      },
      {
        //bottom border
        x: coordsSurface.x,
        y: coordsSurface.height + coordsSurface.y,
        width: coordsSurface.width,
        height: coordsSurface.y,
        roundedArray: [0, 0, 100, 100],
      },
      {
        //left border
        x: coordsSurface.x,
        y: coordsSurface.y,
        width: coordsSurface.y,
        height: coordsSurface.height,
        roundedArray: [0],
      },
      {
        //right border
        x: coordsSurface.width + coordsSurface.x - coordsSurface.y,
        y: coordsSurface.y,
        width: coordsSurface.y,
        height: coordsSurface.height,
        roundedArray: [0],
      },
    ];
  }

  /**
   * Calculates the data for the cushions on the table.
   * @private
   * @returns {Array<Object>} An array of objects containing the coordinates and dimensions for each cushion.
   */
  #getCushionData() {
    const lengthHorizontal = (this.tableWidth - 2 * this.pocketDiameter) / 2;
    const lengthVertical = this.tableHeight - this.pocketDiameter;
    const cushionWidth = this.ballDiameter * 1.5;
    return [
      // Horizontal cushions
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.pocketDiameter / 2 +
          lengthHorizontal / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.pocketRadius -
          cushionWidth / 2,
        rotation: 0,
        length: lengthHorizontal,
        width: cushionWidth,
      },
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.tableWidth -
          this.pocketDiameter / 2 -
          lengthHorizontal / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.pocketRadius -
          cushionWidth / 2,
        rotation: 0,
        length: lengthHorizontal,
        width: cushionWidth,
      },
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.pocketDiameter / 2 +
          lengthHorizontal / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.tableHeight -
          this.pocketRadius +
          cushionWidth / 2,
        rotation: 180,
        length: lengthHorizontal,
        width: cushionWidth,
      },
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.tableWidth -
          this.pocketDiameter / 2 -
          lengthHorizontal / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.tableHeight -
          this.pocketRadius +
          cushionWidth / 2,
        rotation: 180,
        length: lengthHorizontal,
        width: cushionWidth,
      },
      // Vertical cushions
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.pocketRadius -
          cushionWidth / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.pocketDiameter / 2 +
          lengthVertical / 2,
        rotation: 270,
        length: lengthVertical,
        width: cushionWidth,
      },
      {
        x:
          (this.width - this.tableWidth) / 2 +
          this.tableWidth -
          this.pocketRadius +
          cushionWidth / 2,
        y:
          (this.height - this.tableHeight) / 2 +
          this.pocketDiameter / 2 +
          lengthVertical / 2,
        rotation: 90,
        length: lengthVertical,
        width: cushionWidth,
      },
    ];
  }

  /**
   * Retrieves the data for the pockets on the snooker table.
   * @returns {Array<Object>} An array of objects containing the coordinates and dimensions for each pocket.
   *
   */
  getPocketsData() {
    const pockets = [];
    for (let x of [0, this.tableWidth / 2, this.tableWidth]) {
      for (let y of [0, this.tableHeight]) {
        const pocket = {
          x: (this.width - this.tableWidth) / 2 + x,
          y: (this.height - this.tableHeight) / 2 + y,
          diameter: this.pocketDiameter * 1.3 + 5,
        };
        pockets.push(pocket);
      }
    }
    return pockets;
  }

  /**
   * Method to get the initial coordinates of all the balls on the snooker table.
   * This includes the positions of colored balls and red balls in a triangular formation.
   * @returns {Object} An object containing the coordinates of each ball.
   *
   * @example
   * const ballPositions = table.getInitBallsCoordinates();
   * console.log(ballPositions.greenBall);
   * * Output: { x: 200, y: 150, diameter: 22.22, color: 'green' }
   */
  getInitBallsCoordinates() {
    const ballColors = setBallColors();
    // Calculate the coordinates of the table surface.
    const coordsSurface = this.#createCoordsTableSurface(
      this.tableWidth,
      this.tableHeight
    );
    // Calculate the coordinates of the D-Zone.
    const coordsDZone = this._createDZonCoords(this.tableWidth);

    // Initialize an empty object to store the coordinates of the balls.
    let dictCoords = new Object();

    dictCoords["greenBall"] = {
      x: coordsDZone.dZoneCenter.x,
      y: coordsDZone.dZoneCenter.y - coordsDZone.dZoneRadius,
      diameter: this.ballDiameter,
      color: ballColors.green.fill,
      strokeColor: ballColors.green.stroke,
    };
    dictCoords["brownBall"] = {
      x: coordsDZone.dZoneCenter.x,
      y: coordsDZone.dZoneCenter.y,
      diameter: this.ballDiameter,
      color: ballColors.brown.fill,
      strokeColor: ballColors.brown.stroke,
    };
    dictCoords["yellowBall"] = {
      x: coordsDZone.dZoneCenter.x,
      y: coordsDZone.dZoneCenter.y + coordsDZone.dZoneRadius,
      diameter: this.ballDiameter,
      color: ballColors.yellow.fill,
      strokeColor: ballColors.yellow.stroke,
    };
    dictCoords["blueBall"] = {
      x: coordsSurface.x + coordsSurface.width / 2,
      y: coordsSurface.y + coordsSurface.height / 2,
      diameter: this.ballDiameter,
      color: ballColors.blue.fill,
      strokeColor: ballColors.blue.stroke,
    };
    dictCoords["pinkBall"] = {
      x: coordsSurface.x + coordsSurface.width / 2 + coordsSurface.width / 5,
      y: coordsSurface.y + coordsSurface.height / 2,
      diameter: this.ballDiameter,
      color: ballColors.pink.fill,
      strokeColor: ballColors.pink.stroke,
    };
    dictCoords["blackBall"] = {
      x: dictCoords["pinkBall"].x + 7 * this.ballDiameter,
      y: coordsSurface.y + coordsSurface.height / 2,
      diameter: this.ballDiameter,
      color: ballColors.black.fill,
      strokeColor: ballColors.black.stroke,
    };

    ///Red Balls///
    // Calculate and assign the coordinates of the red balls.
    dictCoords["redBalls"] = [];
    const pos1RedBall = {
      x: dictCoords["pinkBall"].x + dictCoords["pinkBall"].diameter,
      y: coordsSurface.y + coordsSurface.height / 2,
    };
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        dictCoords["redBalls"].push({
          x: pos1RedBall.x + (row * this.ballDiameter * Math.sqrt(3)) / 2,
          y:
            pos1RedBall.y -
            (row * this.ballDiameter) / 2 +
            col * this.ballDiameter,
          diameter: this.ballDiameter,
          color: ballColors.red.fill,
          strokeColor: ballColors.red.stroke,
        });
      }
    }
    //white ball//
    dictCoords["whiteBall"] = {
      initX: coordsDZone.dZoneCenter.x - coordsDZone.dZoneRadius / 2,
      initY: coordsDZone.dZoneCenter.y,
      minX: (this.width - this.tableWidth) / 2 + this.ballDiameter / 2,
      maxX: (this.width + this.tableWidth) / 2 - this.ballDiameter / 2,
      minY: (this.height - this.tableHeight) / 2 + this.ballDiameter / 2,
      maxY: (this.height + this.tableHeight) / 2 - this.ballDiameter / 2,
      diameter: this.ballDiameter,
      color: ballColors.white.fill,
      strokeColor: ballColors.white.stroke,
    };

    return dictCoords;
  }

  /**
   * Method to get a random position within the playable surface of the snooker table.
   * Ensures the position is within the boundaries, avoiding the table borders and cushions.
   * @returns {Object} An object containing random x and y coordinates.
   * @example
   * const randomPos = table.getRandomPosition();
   * console.log(randomPos);
   * * Output: { x: 350, y: 250 }
   */
  getRandomPosition() {
    const coordsSurface = this.#createCoordsTableSurface(
      this.tableWidth,
      this.tableHeight
    );
    const coorsBorders = this.#getBordersCoordinates(coordsSurface);
    const padding = 20;
    const minX = coorsBorders[2].x + coorsBorders[2].width * 2 + padding;
    const maxX = coorsBorders[3].x - coorsBorders[3].width - padding;
    const minY = coorsBorders[0].y + coorsBorders[0].height * 2 + padding;
    const maxY = coorsBorders[1].y - coorsBorders[1].height - padding;

    return {
      x: random(minX, maxX),
      y: random(minY, maxY),
    };
  }

  /////////////////////////////////////////////////////////////////////////////
  // ¬ Table Drawing Methods
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Draws the table surface with the specified color.
   * @private
   * @param {number} tableWidth - The width of the table.
   * @param {number} tableHeight - The height of the table.
   * @param {string} tableColor - The color of the table surface.
   */
  #drawTableSurface(tableWidth, tableHeight, textureSurface, tableColor) {
    const coordsSurface = this.#createCoordsTableSurface(
      tableWidth,
      tableHeight
    );
    if (this.textureSurface) {
      image(
        this.textureSurface,
        coordsSurface.x,
        coordsSurface.y,
        coordsSurface.width,
        coordsSurface.height
      );
    } else {
      fill(this.tableColor);
      rect(
        coordsSurface.x,
        coordsSurface.y,
        coordsSurface.width,
        coordsSurface.height
      );
    }
  }

  /**
   * Draws the D-Zone on the canvas.
   * The D-Zone is the area in the middle of the table where the balls are placed at the start of a game.
   * @private
   * @param {number} tableWidth - The width of the table.
   * @param {number} tableHeight - The height of the table.
   */
  #drawDZone(tableWidth, tableHeight) {
    // Calculate the coordinates and radius for the D-Zone.
    const coordsDZone = this._createDZonCoords(tableWidth, tableHeight);
    push();

    // Translate the origin to the center of the D-Zone.
    translate(coordsDZone.dZoneCenter.x, coordsDZone.dZoneCenter.y);
    // Rotate the coordinate system by -90 degrees.
    rotate(-HALF_PI);

    // Draw an arc representing the D-Zone.
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(0, 0, coordsDZone.dZoneRadius * 2, coordsDZone.dZoneRadius * 2, -PI, 0);
    // Draw a line representing the long axis of the D-Zone.
    line(tableWidth / 3.5, 0, -tableWidth / 3.5, 0);

    pop();
  }

  /**
   * Draws the borders of the table.
   * @private
   * @param {Object} _coordsSurface - The coordinates of the table surface.
   * @param {string} borderColor - The color of the borders.
   */
  #drawBorders(_coordsSurface, borderColor) {
    const coordsSurface = _coordsSurface;
    fill(borderColor);
    stroke(2);
    // Draw the borders of the table using the coordinates provided.
    // The borders are drawn around the table surface to give it a finished look.
    this.#getBordersCoordinates(coordsSurface).forEach((border) => {
      this.#drawRectWithRoundedCorners(
        border.x,
        border.y,
        border.width,
        border.height,
        border.roundedArray
      );
    });
  }

  /**
   * Draws the borders around the pockets on the snooker table.
   * @private
   * @param {Object} _coordsSurface - The coordinates of the table surface.
   * @param {number} ballDiameter - The diameter of the snooker balls.
   */
  #drawPocketBorders(_coordsSurface, ballDiameter) {
    const coordsSurface = _coordsSurface;
    fill(this.pocketBorderColor);
    // Top left, middle, and right edges
    this.#drawRectWithRoundedCorners(
      coordsSurface.width / 11 - coordsSurface.y,
      0,
      ballDiameter * 2.5,
      ballDiameter * 2.5,
      [15, 0, 0, 0]
    );
    this.#drawRectWithRoundedCorners(
      this.width / 2 - this.ballDiameter,
      0,
      coordsSurface.y + this.ballDiameter / 2,
      ballDiameter * 2,
      [0, 0, 2, 2]
    );
    this.#drawRectWithRoundedCorners(
      coordsSurface.width + coordsSurface.x - ballDiameter * 2.5,
      0,
      this.ballDiameter * 2.5,
      this.ballDiameter * 2.5,
      [0, 15, 0, 0]
    );

    //Bottom left, middle, and right edges
    this.#drawRectWithRoundedCorners(
      coordsSurface.width + coordsSurface.x - ballDiameter * 2.5,
      coordsSurface.height + 2 * coordsSurface.y,
      this.ballDiameter * 2.5,
      -this.ballDiameter * 2.5,
      [0, 15, 0, 0]
    );
    this.#drawRectWithRoundedCorners(
      this.width / 2 - this.ballDiameter,
      coordsSurface.height + 2 * coordsSurface.y,
      coordsSurface.y + this.ballDiameter / 2,
      -this.ballDiameter * 2,
      [(0, 0, 2, 2)]
    );
    this.#drawRectWithRoundedCorners(
      coordsSurface.width / 11 - coordsSurface.y,
      coordsSurface.height + 2 * coordsSurface.y,
      this.ballDiameter * 2.5,
      -this.ballDiameter * 2.5,
      [15, 0, 0, 0]
    );
  }

  /**
   * Draws the pockets of the table.
   * @param {number} pocketDiameter - The pocket diameter.
   */
  #drawPockets(pocketDiameter) {
    let pockets = this.getPocketsData();
    for (let pocket of pockets) {
      fill(this.pocketColor);
      ellipse(pocket.x, pocket.y, pocketDiameter * 1.3);
    }
  }

  /**
   * Draws the cushions of the table.
   */
  #drawCushions() {
    strokeWeight(0.5);
    stroke("#081c15");
    fill(this.cushionColor);
    this.#getCushionData().forEach((cushion) => {
      this.#drawSingleCushion(cushion);
    });
  }

  /**
   * Draws a single cushion on the table.
   * @param {Object} cushion - The cushion object containing the cushion's data.
   * @private
   */
  #drawSingleCushion(cushion) {
    push();
    translate(cushion.x, cushion.y);
    rotate(radians(cushion.rotation));
    this.#drawCushionShadow(cushion.length, cushion.width);
    this.#drawQuadCushion(cushion.length, cushion.width);
    pop();
  }

  /////////////////////////////////////////////////////////////////////////////
  // ¬ Utility Methods
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Draws a rectangle with rounded corners.
   * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
   * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
   * @param {number} w - The width of the rectangle.
   * @param {number} h - The height of the rectangle.
   * @param {number[]} [radii] - The radii for the rounded corners [top-left, top-right, bottom-right, bottom-left].
   */
  #drawRectWithRoundedCorners(x, y, w, h, radii) {
    rect(x, y, w, h, ...radii);
  }

  /**
   * Draws a quadrilateral representing a shadow cushion.
   * @param {number} length - The length of the cushion.
   * @param {number} cushionWidth - The width of the cushion.
   */
  #drawCushionShadow(length, cushionWidth) {
    push();
    noStroke();
    fill(0, 0, 0, 50);
    quad(
      -length / 2 - 3,
      -cushionWidth / 2,
      length / 2 + 3,
      -cushionWidth / 2,
      length / 2 - cushionWidth,
      cushionWidth / 2 + 3,
      -length / 2 + cushionWidth,
      cushionWidth / 2 + 3
    );
    pop();
  }

  /**
   * Draws a quadrilateral representing a cushion.
   * @param {number} length - The length of the cushion.
   * @param {number} cushionWidth - The width of the cushion.
   */
  #drawQuadCushion(length, cushionWidth) {
    quad(
      -length / 2,
      -cushionWidth / 2,
      length / 2,
      -cushionWidth / 2,
      length / 2 - cushionWidth,
      cushionWidth / 2,
      -length / 2 + cushionWidth,
      cushionWidth / 2
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  // ¬ Main Drawing Method
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Main method to draw the entire snooker table.
   */
  drawTable() {
    const coordsSurface = this.#createCoordsTableSurface(
      this.tableWidth,
      this.tableHeight
    );
    this.#drawTableSurface(
      this.tableWidth,
      this.tableHeight,
      this.textureSurface,
      this.tableColor
    );
    this.#drawDZone(this.tableWidth, this.tableHeight);
    this.#drawBorders(
      coordsSurface,
      this.borderColor,
      this.tableWidth,
      this.tableHeight
    );
    this.#drawCushions();

    this.#drawPocketBorders(coordsSurface, this.ballDiameter);
    this.#drawPockets(this.pocketDiameter);
  }
}

class SnookerTableManager {
  constructor(table) {
    this.table = table;
  }

  /**
   * Checks if a given point (x, y) is within the D-Zone of a snooker table.
   * @param {number} x - The x-coordinate of the point to check.
   * @param {number} y - The y-coordinate of the point to check.
   * @returns {boolean} - True if the point is within the D-Zone, false otherwise.
   */
  isWithinDZone(x, y) {
    // Retrieve the D-Zone dimensions and coordinates from the table object.
    const dZoneData = this.table._createDZonCoords(this.table.tableWidth);
    let dZoneRadius = dZoneData.dZoneRadius;
    let dZoneCenterX = dZoneData.dZoneCenter.x;
    let dZoneCenterY = dZoneData.dZoneCenter.y;
    // Calculate if the point is within the D-Zone by checking the distance to the center is less than or equal to the D-Zone radius and the point is on the correct side of the center.
    return (
      dist(x, y, dZoneCenterX, dZoneCenterY) <= dZoneRadius && x <= dZoneCenterX
    );
  }

  /**
   * Checks if a given ball is within any of the pockets on the snooker table.
   * @param {object} ball - The ball object to check.
   * @returns {boolean} - True if the ball is within a pocket, false otherwise.
   */
  isBallInPocket(ball) {
    let pockets = this.table.getPocketsData();
    let ballPosition = ball.body.position;
    for (let pocket of pockets) {
      if (
        dist(ballPosition.x, ballPosition.y, pocket.x, pocket.y) <
        this.table.pocketDiameter / 2
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Updates the surface texture of the snooker table.
   *
   * @param {string} _newTexture - The new texture to be applied to the surface.
   */
  updateSurfaceTexture(_newTexture) {
    this.table.textureSurface = _newTexture;
  }

  /**
   * Updates the color of the snooker table's cushion.
   *
   * @param {string} _newColor - The new color for the cushion.
   */
  updateCushionColor(_newColor) {
    this.table.cushionColor = _newColor;
  }
}
