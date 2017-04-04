// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery-ui
//= require turbolinks
//= require_tree .


$( document ).ready(function() {

$('.item').draggable({revert: true});

$('.cart').droppable({
  classes: {"ui-droppable-active": "custom-state-active"},
  drop: function( event, ui ) {
      var price = $(ui.draggable).find('.product-price').html();
      var title = $(ui.draggable).find('.product-title').html();



      $("<li>" + title + " - " + price  + "</li>").appendTo('#outbox');

      var total_price = parseFloat(price.replace('$','')) + parseFloat( $('#outbox .total').html());
      $('.center').css("color", "#9d9d9d");
      $('#outbox .total').html( total_price.toFixed(2) );
  },
  over: function(event, ui){
    $(ui.draggable).find('.center').css("color", "#06b8a4");
  },
  out: function (event, ui) {
    $('.center').css("color", "#9d9d9d");
  }
});


  $('.sort-button').click( function(e){

    e.preventDefault();

    var sort_type = $('select option:selected').val();

    $.ajax({
        url: '/items/sort_type.json',
        data: {sort_type: sort_type},
        dataType: 'html',
        method: 'POST'
    }).
    success(function(data) {
      ajaxSort();
    });

  });


  function ajaxSort(e) {
    $.ajax({
        type: "GET",
        url: "/items/item_sorted"
    });
  };

});




