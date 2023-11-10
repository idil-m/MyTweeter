$(document).ready(function() {
  const length = 140;
  $('.new-tweet textarea').on('input',function() {
    const textLength = $(this).val().length;
    const remainingLength = length - textLength;
    const counterElement = $('div.counter');
    counterElement.text(remainingLength);
    if (remainingLength < 0) {
      counterElement.addClass('overLimit');
    } else {
      counterElement.removeClass('overLimit');
    }
  });
});
  


