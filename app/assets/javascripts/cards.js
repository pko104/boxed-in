/* global document, randomColor, snabbt, FastClick */
// Constants

$( document ).ready(function() {
'use strict';

var CARD_HEIGHT = 100;
var CARD_WIDTH = 60;
var CARD_COUNT = 40;

var WIDTH = 800;
var HEIGHT = 600;

var TILT = Math.PI / 8;
var PYTH_ANGLE = Math.PI / 2 - TILT;

var TILTED_CARD_HEIGHT = Math.sin(PYTH_ANGLE) * CARD_HEIGHT + 2;
var TILTED_CARD_WIDTH = Math.cos(PYTH_ANGLE) * CARD_HEIGHT;
var CARD_SPACING = 2;
var PYRAMID_WIDTH = TILTED_CARD_WIDTH * 2 + CARD_SPACING * 2;

function updateSizes() {
  var container = document.getElementById('container');
  WIDTH = container.clientWidth;
  HEIGHT = container.clientHeight;
  CARD_WIDTH = WIDTH * 0.05;
  CARD_HEIGHT = HEIGHT * 0.15;
  TILTED_CARD_HEIGHT = Math.sin(PYTH_ANGLE) * CARD_HEIGHT + 2;
  TILTED_CARD_WIDTH = Math.cos(PYTH_ANGLE) * CARD_HEIGHT;
  PYRAMID_WIDTH = TILTED_CARD_WIDTH * 2 + CARD_SPACING * 2;
  for (var i = 0; i < Deck.length(); ++i) {
    Deck.cardAt(i).style.height = CARD_HEIGHT + 'px';
    Deck.cardAt(i).style.width = CARD_WIDTH + 'px';
  }
}

var COLORS = randomColor({
  count: 40,
  luminosity: 'dark'
});


// Formations
var PILE = 1;
var HOUSE = 2;
var WALL = 3;
var CYLINDER = 4;
var current_mode;

var formationBuilders = {};
formationBuilders[PILE] = pile_positions;
formationBuilders[HOUSE] = house_positions;
formationBuilders[WALL] = wall_positions;
formationBuilders[CYLINDER] = cylinder_positions;

function createCard(container, index) {
  var card = document.createElement('div');
  card.className = 'card';
  card.style.background = COLORS[index % COLORS.length];

  // card.innerHTML = '<img style="width:100%" src="https://d2ln0cvn4pv5w2.cloudfront.net/unsafe/fit-in/512x400/filters:quality(100):max_bytes(50000):fill(white)/dcmzfk78s4reh.cloudfront.net/1470353104132.jpg" alt="Chewy">';

  container.appendChild(card);
  return card;
}

// Deck
var Deck = (function() {
  var cards = [];
  var cardIndex = 0;

  for (var i = 0; i < CARD_COUNT; ++i) {
    var container = document.getElementById('surface');
    cards.push(createCard(container, i));
  }

  return {
    nextCard: function() {
      if (cardIndex > 51)
        return;
      return cards[cardIndex++];
    },
    cardAt: function(index) {
      return cards[index];
    },
    reset: function() {
      cardIndex = 0;
    },
    length: function() {
      return cards.length;
    }
  };
})();

function build_formation(positions) {
  Deck.reset();
  for (var i = 0; i < positions.length; ++i) {
    snabbt(Deck.nextCard(), {
      position: positions[i].position,
      rotation: positions[i].rotation,
      easing: 'ease',
      delay: i * 75
    });
  }
}

function setMode(mode) {
  updateSizes();
  if (mode === current_mode) {
    return;
  }

  var positions = formationBuilders[mode]();
  build_formation(positions);

  current_mode = mode;
}

function rotateContainer(x,y,z) {

  var rotation_coord;

  if(x){
    rotation_coord = [x,y,z];
  }
  else{
    rotation_coord = [0,0,0];
  }

  var container = document.getElementById('surface');
  snabbt(container, {
    fromRotation: rotation_coord,
    rotation: [0, 2 * Math.PI, 0],
    duration: 10000,
    perspective: 2000,
    complete: function() {
      rotateContainer();
    }
  });
}

function pile_positions() {
  Deck.reset();
  var positions = [];

  var i = 0;
  var card = Deck.nextCard();
  var center = (WIDTH - CARD_WIDTH) / 2;
  var y = HEIGHT - HEIGHT * 0.2;
  while (card) {
    positions.push({
      position: [center, y - i * 0.5, WIDTH * 0.1],
      rotation: [Math.PI / 2, 0, 0]
    });
    ++i;
    card = Deck.nextCard();
  }
  return positions;
}

function house_positions() {
  Deck.reset();

  var floors = 5;
  var y = (floors - 1) * TILTED_CARD_HEIGHT + TILTED_CARD_HEIGHT / 2;
  var z = -WIDTH * 0.2;
  var x = (WIDTH - PYRAMID_WIDTH * floors) / 2 - TILTED_CARD_WIDTH;

  var positions = [];
  var i;
  for (i = 0; i < floors; ++i) {
    var _x = x + i * TILTED_CARD_WIDTH + i * CARD_SPACING;
    var _y = y - i * TILTED_CARD_HEIGHT - i * CARD_SPACING;
    positions = positions.concat(house_row_positions(floors - i, _x, _y, z));
  }

  return positions;
}

function house_row_positions(count, x, y, z) {
  var positions = [];
  var i;
  // Tilted cards
  for (i = 0; i < count; ++i) {
    var cardPositions = pyramid_postions(x + i * PYRAMID_WIDTH, y, z);
    positions.push({
      position: cardPositions[0].position,
      rotation: cardPositions[0].rotation
    });
    positions.push({
      position: cardPositions[1].position,
      rotation: cardPositions[1].rotation
    });
  }
  // Bridge cards
  for (i = 0; i < count - 1; ++i) {
    positions.push({
      position: [x + i * PYRAMID_WIDTH + TILTED_CARD_WIDTH, y - TILTED_CARD_HEIGHT / 2 - CARD_SPACING / 2, z],
      rotation: [Math.PI / 2, Math.PI / 2, 0]
    });
  }
  return positions;
}

function pyramid_postions(x, y, z) {
  // Firefox flickers if elements overlap
  var spacing = TILTED_CARD_WIDTH / 2 + CARD_SPACING / 2;

  return [{
    position: [x - spacing, y, z],
    rotation: [-TILT, Math.PI / 2, 0]
  }, {
    position: [x + spacing, y, z],
    rotation: [TILT, Math.PI / 2, 0]
  }];
}

function wall_positions() {
  var positions = [];
  var w = CARD_WIDTH + 10;
  var h = CARD_HEIGHT + 10;
  var start_x = (WIDTH - 10 * w) / 2;
  var start_y = (HEIGHT - 4 * h) / 2;
  for (var i = 0; i < CARD_COUNT; ++i) {
    var x = i % 10 * w + start_x;
    var y = Math.floor(i / 10) * h + start_y;
    positions.push({
      position: [x, y, 0],
      rotation: [0, 0, 0]
    });
  }
  return positions;
}

function cylinder_positions() {
  var positions = [];
  var start_x = WIDTH / 2;
  var start_y = HEIGHT * 0.1;
  var radius = WIDTH * 0.2;
  for (var i = 0; i < CARD_COUNT; ++i) {
    var angle = i % 10 / 10 * 2 * Math.PI;
    var x = Math.cos(angle) * radius + start_x;
    var z = Math.sin(angle) * radius;
    var y = Math.floor(i / 10) * 1.2 * CARD_HEIGHT + start_y;
    positions.push({
      position: [x, y, z],
      rotation: [0, Math.PI / 2 + angle, 0]
    });
  }
  return positions;
}

function init() {
  updateSizes();
  Deck.reset();
  setMode(CYLINDER);
  rotateContainer();
  onClickcard();

  // Initialize fast click
  FastClick.attach(document.body);

  // Event handlers
  var buttons = {
    'pile_button': PILE,
    'house_button': HOUSE,
    'wall_button': WALL,
    'cylinder_button': CYLINDER
  };
}

function onClickcard(){
  var cardClicks = Array.from(document.getElementsByClassName('card'));

  cardClicks.forEach(function(ele){

    var state = 1;
    // var current_position;
    // var pos_array;

    ele.onclick = function(){
      var container = document.getElementById('surface');

      // if(state == 1){

        cardClicks.forEach(function(card){
          card.className = 'card make-opaque';
        });

        ele.className
        ele.className += 'card make-selected';
        // current_position = container.style.transform.split(' ');

        // pos_array = (current_position[9] + current_position[11]).split(',');
        // // pos_array[0] =
        // // pos_array[1] =

        // snabbt(container, 'stop');

    }

  });

}

init();

});
