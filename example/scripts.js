(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var lazy = require('../lazy-images')('image-thumbnail');

},{"../lazy-images":2}],2:[function(require,module,exports){
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

  //
  return window.addEventListener('load', function() {
    var images, processScroll;
    images = document.querySelectorAll("img." + (selector || 'lazy'));
    processScroll = function() {
      var image, i, len, results;
      results = [];
      for (i = 0, len = images.length; i < len; i++) {
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

},{}]},{},[1]);

//# sourceMappingURL=scripts.js.map