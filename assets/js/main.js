/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	/* jshint esversion: 6 */
	(function ($) {
	
	    var setCookie = function setCookie(cname, cvalue, exdays) {
	
	        var d = new Date();
	        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	
	        var expires = 'expires=' + d.toUTCString();
	
	        document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
	    };
	
	    var getCookie = function getCookie(cname) {
	
	        var name = cname + '=';
	        var ca = document.cookie.split(';');
	
	        for (var i = 0; i < ca.length; i + 1) {
	            var c = ca[i];
	            while (c.charAt(0) === ' ') {
	                c = c.substring(1);
	            }
	            if (c.indexOf(name) === 0) {
	                return c.substring(name.length, c.length);
	            }
	        }
	
	        return '';
	    };
	
	    var isDesktop = function isDesktop() {
	        return window.matchMedia('(min-width: 768px)').matches;
	    };
	
	    var forEach = function forEach(array, callback, scope) {
	
	        for (var i = 0; i < array.length; i + 1) {
	            callback.call(scope, i, array[i]); // passes back stuff we need
	        }
	    };
	
	    var Comic = function Comic(comicNode) {
	
	        // TODO page transitions in out
	        // TODO preload images
	
	        var comicZoomNode = comicNode.querySelector('.js-comic-wrapper-zoom');
	        var comicPositionNode = comicNode.querySelector('.js-comic-wrapper-position');
	
	        var comicPageNodeList = comicNode.querySelectorAll('.js-comic-page');
	
	        var prevLinkNodeList = document.querySelectorAll('.js-comic-prev-link');
	        var nextLinkNodeList = document.querySelectorAll('.js-comic-next-link');
	
	        var toggleDynamicViewsNode = document.querySelector('.js-comic-toggle-dynamic-views');
	        var toggleFullScreenNode = document.querySelector('.js-comic-toggle-fullscreen');
	
	        var currentPageNode = document.querySelector('.js-comic-current-page');
	
	        var comicPageImageNodeList = document.querySelectorAll('.js-comic-page-image');
	
	        var comic = [];
	
	        var state = {
	            active: false,
	            dynamicViews: false,
	            fullscreen: false,
	            width: 0,
	            height: 0,
	            pageWidth: 0,
	            pageHeight: 0,
	            nextLink: '#',
	            prevLink: '#',
	            currentPageId: 1,
	            currentViewId: 1,
	            images: {}
	        };
	
	        var pageViewsData = [];
	        var currentViewData = [];
	
	        var pageViewCount = 0;
	
	        var positionPage = function positionPage() {
	
	            $('html, body').animate({
	                scrollTop: $('#comic').offset().top - 20
	            }, 300);
	        };
	
	        var getProperties = function getProperties() {
	
	            state.width = comicNode.offsetWidth;
	            state.height = comicNode.offsetHeight;
	            state.pageWidth = comicPageNodeList[state.currentPageId - 1].offsetWidth;
	            state.pageHeight = comicPageNodeList[state.currentPageId - 1].offsetHeight;
	        };
	
	        // Using the state generate the links and update them in the DOM
	        var setLinks = function setLinks() {
	
	            var prevLink = '#1-1';
	            var nextLink = '#' + comic.length + '-' + comic[comic.length - 1].views.length;
	
	            // Get the previous page/view link
	            if (state.currentPageId > 1 || state.currentViewId > 1) {
	
	                var prevPageId = state.currentPageId;
	                var prevViewId = state.currentViewId - 1;
	
	                if (state.currentViewId === 1) {
	                    prevPageId = state.currentPageId - 1;
	                    prevViewId = comic[prevPageId - 1].views.length;
	                }
	
	                if (!state.dynamicViews) {
	                    prevPageId = state.currentPageId - 1;
	                    prevViewId = 1;
	                }
	
	                prevLink = '#' + prevPageId + '-' + prevViewId;
	
	                forEach(prevLinkNodeList, function (index, prevLinkNode) {
	                    prevLinkNode.classList.remove('is-disabled');
	                });
	            } else {
	
	                forEach(prevLinkNodeList, function (index, prevLinkNode) {
	                    prevLinkNode.classList.add('is-disabled');
	                });
	            }
	
	            // Get the next page/view link
	            if (!(state.currentPageId === comic.length && (state.dynamicViews && state.currentViewId === comic[comic.length - 1].views.length || !state.dynamicViews))) {
	
	                var nextPageId = state.currentPageId;
	                var nextViewId = state.currentViewId + 1;
	
	                if (state.currentViewId === pageViewCount || !state.dynamicViews) {
	                    nextPageId = state.currentPageId + 1;
	                    nextViewId = 1;
	                }
	
	                nextLink = '#' + nextPageId + '-' + nextViewId;
	
	                forEach(nextLinkNodeList, function (index, nextLinkNode) {
	                    nextLinkNode.classList.remove('is-disabled');
	                });
	            } else {
	
	                forEach(nextLinkNodeList, function (index, nextLinkNode) {
	                    nextLinkNode.classList.add('is-disabled');
	                });
	            }
	
	            state.prevLink = prevLink;
	            state.nextLink = nextLink;
	
	            forEach(nextLinkNodeList, function (index, node) {
	                node.setAttribute('href', state.nextLink);
	            });
	
	            forEach(prevLinkNodeList, function (index, node) {
	                node.setAttribute('href', state.prevLink);
	            });
	
	            currentPageNode.innerText = state.currentPageId;
	        };
	
	        var loadImage = function loadImage(pageId) {
	
	            var image = state.images[pageId];
	
	            if (image) {
	
	                state.images[pageId].node.src = state.images[pageId].src;
	                state.images[pageId].node.removeAttribute('data-src');
	
	                delete state.images[pageId];
	            }
	        };
	
	        /**
	         * DOM updates for the page
	         */
	        var updatePage = function updatePage() {
	
	            if (state.dynamicViews) {
	
	                var pos = {
	                    x: Math.round((state.pageWidth - currentViewData.width) / 2) - currentViewData.left,
	                    y: Math.round((state.pageHeight - currentViewData.height) / 2) - currentViewData.top
	                };
	
	                var scaleX = Math.min(state.width / (currentViewData.width + 20), 2);
	                var scaleY = Math.min(state.height / (currentViewData.height + 20), 2);
	
	                var scale = scaleX > scaleY ? scaleY : scaleX;
	
	                comicPositionNode.style.msTransform = '-ms-translate(' + pos.x + 'px, ' + pos.y + 'px, 0)';
	                comicPositionNode.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
	
	                comicZoomNode.style.transform = 'scale(' + scale + ', ' + scale + ')';
	            }
	
	            for (var i = 0; i < comicPageNodeList.length; i + 1) {
	
	                var comicPageNode = comicPageNodeList[i];
	
	                var display = i + 1 === state.currentPageId ? 'block' : 'none';
	
	                comicPageNode.style.display = display;
	            }
	        };
	
	        /**
	         * Update state with the "location" of the comic and trigger some
	         * follow up functions.
	         *
	         * @param  {number} page Page Id we're updating to
	         * @param  {number} view View Id we're updating to
	         */
	        var setLocation = function setLocation() {
	            var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state.currentPageId;
	            var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : state.currentViewId;
	
	
	            if (state.currentPageId !== page) {
	
	                positionPage();
	
	                ga('send', 'event', 'Comic', 'page', page);
	            }
	
	            state.currentPageId = page;
	            state.currentViewId = view;
	
	            pageViewsData = comic[state.currentPageId - 1].views;
	            currentViewData = pageViewsData[state.currentViewId - 1];
	
	            pageViewCount = pageViewsData.length;
	
	            // Update the links
	            setLinks();
	
	            // Update the DOM
	            updatePage();
	
	            // Load the next image
	            loadImage(state.currentPageId + 1);
	            // Load the previous image
	            loadImage(state.currentPageId - 1);
	        };
	
	        /**
	         * Figure out where we are using the hash.
	         */
	        var getLocation = function getLocation() {
	
	            var location = window.location.hash.substring(1).split('-');
	
	            var pageId = Number(location[0]) || 1;
	            var viewId = Number(location[1]) || 1;
	
	            var fixHash = false;
	
	            if (comic) {
	
	                if (!comic[pageId - 1]) {
	                    pageId = comic.length;
	                    fixHash = true;
	                }
	
	                if (!comic[pageId - 1].views[viewId - 1]) {
	                    viewId = comic[pageId - 1].views.length;
	                    fixHash = true;
	                }
	            }
	
	            if (fixHash) {
	                window.location.hash = '#' + pageId + '-' + viewId;
	            } else {
	                setLocation(pageId, viewId);
	            }
	        };
	
	        /**
	         * Toggle the Dynamic Views and do appropriate cleanup
	         */
	        var toggleDynamicViews = function toggleDynamicViews() {
	            var dynamicViewsState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !state.dynamicViews;
	
	
	            state.dynamicViews = dynamicViewsState;
	
	            if (!state.dynamicViews) {
	
	                comicPositionNode.removeAttribute('style');
	                comicZoomNode.removeAttribute('style');
	
	                toggleDynamicViewsNode.classList.remove('is-active');
	                comicNode.classList.remove('c-comic--theater');
	
	                setCookie('dynamicViewsState', 0);
	            } else {
	
	                toggleDynamicViewsNode.classList.add('is-active');
	                comicNode.classList.add('c-comic--theater');
	
	                setCookie('dynamicViewsState', 1);
	            }
	
	            getProperties();
	
	            setLocation();
	
	            if (ga && isDesktop()) {
	                ga('send', 'event', 'UX', 'dynamicViews', state.dynamicViews);
	            }
	        };
	
	        // Update the location and prevent the hash from messing with things
	        var handleHashchange = function handleHashchange(e) {
	
	            e.preventDefault();
	
	            getLocation();
	        };
	
	        var toggleFullscreen = function toggleFullscreen() {
	
	            if (Modernizr.fullscreen) {
	
	                if (!document.fullscreenElement && // alternative standard method
	                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
	                    // current working methods
	
	                    if (comicNode.requestFullscreen) {
	                        comicNode.requestFullscreen();
	                    } else if (comicNode.msRequestFullscreen) {
	                        comicNode.msRequestFullscreen();
	                    } else if (comicNode.mozRequestFullScreen) {
	                        comicNode.mozRequestFullScreen();
	                    } else if (comicNode.webkitRequestFullscreen) {
	                        comicNode.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	                    }
	                } else {
	                    if (document.exitFullscreen) {
	                        document.exitFullscreen();
	                    } else if (document.msExitFullscreen) {
	                        document.msExitFullscreen();
	                    } else if (document.mozCancelFullScreen) {
	                        document.mozCancelFullScreen();
	                    } else if (document.webkitExitFullscreen) {
	                        document.webkitExitFullscreen();
	                    }
	                }
	
	                state.fullscreen = !state.fullscreen;
	
	                if (ga) {
	                    ga('send', 'event', 'UX', 'fullscreen', state.fullscreen);
	                }
	            }
	        };
	
	        //
	        var handleKeydown = function handleKeydown() {
	
	            var LEFT = 37;
	            var RIGHT = 39;
	            var SPACEBAR = 32;
	
	            document.body.onkeydown = function (e) {
	
	                if (e.keyCode === LEFT) {
	
	                    e.preventDefault();
	
	                    if (prevLinkNodeList) {
	                        prevLinkNodeList[0].click();
	                    }
	                } else if (e.keyCode === RIGHT || e.keyCode === SPACEBAR) {
	
	                    e.preventDefault();
	
	                    if (nextLinkNodeList) {
	                        nextLinkNodeList[0].click();
	                    }
	                }
	            };
	        };
	
	        // Let's do this sheet
	        var init = function init() {
	
	            if (comicNode) {
	
	                getProperties();
	
	                comic = comicData;
	
	                forEach(comicPageImageNodeList, function (index, comicPageImageNode) {
	
	                    var src = comicPageImageNode.getAttribute('data-src');
	
	                    state.images[index + 1] = {
	                        src: src,
	                        node: comicPageImageNode
	                    };
	                });
	
	                getLocation();
	
	                loadImage(state.currentPageId);
	
	                handleKeydown();
	
	                toggleDynamicViewsNode.addEventListener('click', function () {
	                    toggleDynamicViews();
	                }, false);
	
	                if (Modernizr.fullscreen) {
	
	                    toggleFullScreenNode.addEventListener('click', function () {
	                        toggleDynamicViews(false);
	                        toggleFullscreen();
	                    }, false);
	                }
	
	                window.addEventListener('hashchange', handleHashchange, false);
	
	                window.addEventListener('resize', function () {
	                    getProperties();
	                    updatePage();
	                }, false);
	
	                var hammertime = new Hammer(comicNode);
	
	                hammertime.on('swiperight', function () {
	                    prevLinkNodeList[0].click();
	                });
	
	                hammertime.on('swipeleft tap', function () {
	                    nextLinkNodeList[0].click();
	                });
	
	                if (getCookie('dynamicViewsState') === '1' || !isDesktop()) {
	                    toggleDynamicViews(true);
	                }
	
	                window.requestAnimationFrame(function () {
	                    state.active = true;
	                    comicNode.classList.remove('is-loading');
	                });
	            }
	        };
	
	        return {
	            state: state,
	            init: init
	        };
	    };
	
	    var comicNode = document.querySelector('.js-comic');
	
	    if (comicNode) {
	
	        // assign to the window so we can access it ;D
	        window.mainComic = Comic(comicNode);
	
	        mainComic.init();
	    }
	
	    document.querySelector('.js-share-facebook').addEventListener('click', function () {
	
	        FB.ui({
	            method: 'share',
	            href: URL
	        });
	
	        if (ga) {
	            ga('send', 'event', 'Social', 'facebook');
	        }
	    });
	
	    document.querySelector('.js-share-twitter').addEventListener('click', function () {
	
	        if (ga) {
	            ga('send', 'event', 'Social', 'twitter');
	        }
	    });
	})(jQuery);

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map