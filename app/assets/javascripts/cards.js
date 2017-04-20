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
  CARD_WIDTH = WIDTH * 0.09;
  CARD_HEIGHT = HEIGHT * 0.19;
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
var CYLINDER = 4;
var current_mode;

var formationBuilders = {};
formationBuilders[CYLINDER] = cylinder_positions;

// Deck
var Deck = (function() {
  var cards = [];
  var cardIndex = 0;
  var index = 0;
  var cardArray = Array.from(document.getElementsByClassName('card'));
  var container = document.getElementById('surface');

  for(var t in cardArray){
    cardArray[t].style.background = COLORS[index % COLORS.length];
    container.appendChild(cardArray[t]);
    cards.push(cardArray[t]);
    index++;
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
      delay: i * 50
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

function rotateContainer(y) {

  var rotationArray;
  if (y !== undefined){
    y = Math.abs(y);
    rotationArray = [0,y,0];
  }
  else{
    rotationArray = [0, 0, 0];
  }

  var container = document.getElementById('surface');
  snabbt(container, {
    fromRotation: rotationArray,
    rotation: [0, 2 * Math.PI, 0],
    duration: 20000,
    perspective: 2000,
    complete: function() {
      rotateContainer();
    }
  });
}

function cylinder_positions() {
  var positions = [];
  var start_x = WIDTH / 2;
  var start_y = HEIGHT * 0.1;
  var radius = WIDTH * 0.2;
  for (var i = 0; i < Deck.length(); ++i) {
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

}

function onClickcard(){
  var cardClicks = Array.from(document.getElementsByClassName('card'));

  cardClicks.forEach(function(ele){

    var state = 1;
    var current_position;
    var pos_array;
    var yAngle;


    ele.onclick = function(e){
      var container = document.getElementById('surface');
      var popup_img = document.getElementById('popupImg');

      ele.className += ' make-selected';
      var card_chosen = document.getElementsByClassName('make-selected')[0];

      if(state == 1){

        cardClicks.forEach(function(card){
          card.className = 'card make-opaque';
          $('.card-holder').css({opacity: 0.0, visibility: 'visible'}).animate({opacity:1}, 100 );
        });

        ele.className += ' make-selected';

        popup_img.src = $(this).find('img').attr('src');
        $('.first').html( $(this).children('.product-title').html() )
        $('.second ').html( $(this).children('.product-type').html() )
        $('.third').html( $(this).children('.product-price').html() )

        //calculating Radians
        current_position = container.style.transform.split(' ');
        pos_array = (current_position[9] + current_position[11]).split(',');

        var a = parseFloat(current_position[11]);
        var b = parseFloat(current_position[3]);

        yAngle = Math.round(Math.atan2(b, a) * (180/Math.PI));

        snabbt(container, 'stop')
      }
      else if (state == 2){

        // if $

        cardClicks.forEach(function(card){
          card.className = 'card';
          $('.card-holder').css({opacity: 0.0, visibility: 'hidden'}).animate({opacity:0}, 100 );
        });

        rotateContainer(yAngle * Math.PI / 180);
        state = 0
      }
      state+=1
    }

  });

}

init();

});
