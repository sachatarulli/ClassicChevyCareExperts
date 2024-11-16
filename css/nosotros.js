var options = {
  accessibility: true,
  prevNextButtons: true,
  pageDots: true,
  setGallerySize: false,
  wrapAround: true
};

var carousel = document.querySelector('[data-carousel]');
var flkty = new Flickity(carousel, options);