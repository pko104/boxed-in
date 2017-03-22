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


// $('#bounce').mouseenter( function(){
//   $('#bounce').removeClass('rollIn').addClass('bounce').css("webkit-animation-delay", "0s");
// });

// $( "#bounce").mouseleave(function() {
//   $(this).removeClass('bounce')
// });

// $( "#rubberband").mouseleave(function() {
//   $(this).removeClass('bounce')
// });

// $( "#swivel").mouseleave(function() {
//   $(this).removeClass('bounce')
// });

// $('#rubberband').mouseenter( function(){
//   $('#rubberband').removeClass('rollIn').addClass('bounce').css("webkit-animation-delay", "0s");
// });

// $('#swivel').mouseenter( function(){
//   $('#swivel').removeClass('rollIn').addClass('bounce').css("webkit-animation-delay", "0s");
// });



$('.item').draggable({
    revert:true,
    proxy:'clone',
    onStartDrag:function(){
        $(this).draggable('options').cursor = 'not-allowed';
        $(this).draggable('proxy').css('z-index',10);
    },
    onStopDrag:function(){
        $(this).draggable('options').cursor='move';
    }
});





});





