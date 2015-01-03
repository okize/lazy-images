function lazy(selector) {

  'use strict';

  var imageInView, imageLoaded, loadImage;

  // replace empty image source with data-src value
  loadImage = function(el, cb) {
    var img, src;
    img = new Image();
    src = el.getAttribute('data-src');
    img.onload = function() {
      if (!imageLoaded(el)) {
        el.src = src;
        el.className = el.getAttribute('class') + ' loaded';
        if (cb) {
          return cb();
        } else {
          return null;
        }
      }
    };
    img.src = src;
    return img;
  };

  // check if image has a class called 'loaded'
  imageLoaded = function(el) {
    return el.className.indexOf('loaded') > -1;
  };

  // check if image is visible in viewport
  imageInView = function(el) {
    var rect;
    rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.top <= window.innerHeight;
  };

  // event handler for scrolling
  return window.addEventListener('load', function() {
    var images, processScroll;
    images = document.querySelectorAll("img." + (selector || 'lazy'));
    processScroll = function() {
      var image, results = [];
      for (var i = 0, len = images.length; i < len; i++) {
        image = images[i];
        if (imageInView(image)) {
          results.push(loadImage(image));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    processScroll();
    return window.addEventListener('scroll', processScroll, false);
  });

}

exports = module.exports = lazy;
