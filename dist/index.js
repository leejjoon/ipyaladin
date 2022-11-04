define(["jupyter-js-widgets"], function(__WEBPACK_EXTERNAL_MODULE_4__) { return /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports, __webpack_require__) {

	// Entry point for the notebook bundle containing custom model definitions.
	//
	// Setup notebook base URL
	//
	// Some static assets may be required by the custom widget javascript. The base
	// url for the notebook is not known at build time and is therefore computed
	// dynamically.
	
	// Seems to create problem with jupyterlab
	// __webpack_public_path__ = document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/ipyaladin/';
	
	// Export widget models and views, and the npm package version number.
	module.exports = __webpack_require__(1);
	
	module.exports['version'] = __webpack_require__(6).version;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// For the moment, the AladinLite library is not online,
	// and is located in the same repository of this file.
	// The version currently used is the beta version, whose url is:
	// http://aladin.u-strasbg.fr/AladinLite/api/v2/beta/aladin.js
	// For the library to be compatible with node.js, the following code must be added at the file's end:
	//module.exports = {
	//    A: A
	//};
	// var astro = this.astro;
	
	var jQuery = __webpack_require__(2);
	var aladin_lib = __webpack_require__(3);
	
	// Allow us to use the DOMWidgetView base class for our models/views.
	// Additionnaly, this is where we put by default all the external libraries
	// fetched by using webpack (see webpack.config.js file).
	var widgets = __webpack_require__(4);
	var _ = __webpack_require__(5);
	
	
	// The sole purpose of this module is to load the css stylesheet when the first instance
	// of the AladinLite widget
	var CSS_Loader= ({
	
	    is_css_loaded: false,
	
	    load_css: function(data){
	        if(!CSS_Loader.is_css_loaded){
	            var link = document.createElement('link');
	            link.type = "text/css";
	            link.rel = "stylesheet";
	            link.href = "//aladin.u-strasbg.fr/AladinLite/api/v2/latest/aladin.min.css";
	            document.getElementsByTagName("head")[0].appendChild(link);
	            CSS_Loader.is_css_loaded= true;
	        }
	    }
	});
	
	/**
	 * Definition of the AladinLite widget's model in the browser
	 * Useful documentation about the widget's global implementation : 
	 * (from http://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Custom.html)
	 * The IPython widget framework front end relies heavily on Backbone.js.
	 * Backbone.js is an MVC (model view controller) framework. 
	 * Widgets defined in the back end are automatically synchronized with generic Backbone.js
	 * models in the front end.
	 * The traitlets are added to the front end instance automatically on first state push.
	 * The _view_name trait that you defined earlier is used by the widget framework to create
	 * the corresponding Backbone.js view and link that view to the model.
	 */
	var ModelAladin = widgets.DOMWidgetModel.extend({
	    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
	        _view_name : "ViewAladin",
	        _model_name : "ModelAladin",
	
	        _model_module : "jupyter-aladin",
	        _view_module : "jupyter-aladin",
	
	        _model_module_version : '0.1.9',
	        _view_module_version : '0.1.9',
	    })
	});
	
	
	/**
	 * Definition of the AladinLite widget's view in the browser
	 */
	var ViewAladin = widgets.DOMWidgetView.extend({
	    // The attr_js and attr_py variables are used as lock between the listeners
	    // of the corresponding attribute, python-side and javascript-side,
	    // in order to prevent infinite loop between listener calls on value change
	    fov_js: false,
	    fov_py: false,
	    target_js: false,
	    target_py: false,
	
	    // This function is automatically called when the python-side widget's instance is displayed
	    // (by calling it at the end of a bloc or by using the display() function)
	    render: function() {
	        // We load the css stylesheet.
	        CSS_Loader.load_css();
	        // We create the DOM element that will contain our widget
	        // Note: it seems that the 'el' element cannot directly be used as a container for
	        // the AladinLite widget wihthout causing rendering issues.
	        // Thus we use a div element and put it inside the 'el' element.
	        var div_test = document.createElement('div');
	        div_test.id = 'aladin-lite-div' + parseInt(Math.random()*1000000);
	        // TODO: should this style be somehow inherited from the widget Layout attribute?
	        div_test.setAttribute("style","width:100%;height:400px;");
	        this.el.appendChild(div_test);
	        // We get the options set on the python side and create an instance of the AladinLite object.
	        var aladin_options= {};
	        var opt= this.model.get('options');
	        for(i=0; i<opt.length; i++)
	            aladin_options[this.convert_pyname_to_jsname(opt[i])]= this.model.get(opt[i]);
	        this.al= aladin_lib.A.aladin([div_test], aladin_options);
	        // Declaration of the variable's listeners:
	        this.aladin_events();
	        this.model_events();
	    },
	
	    convert_pyname_to_jsname: function (pyname) {
	        var i, temp= pyname.split('_');
	        for(i=1; i<temp.length; i++){
	            temp[i]= temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
	        }
	        return temp.join('');
	    },
	
	    // Variables's listeners on the js side:
	    aladin_events: function () {
	        var that = this;
	        this.al.on('zoomChanged', function(fov) {
	            if(!that.fov_py){
	                that.fov_js= true;
	                // fov MUST be cast into float in order to be sent to the model
	                that.model.set('fov', parseFloat(fov.toFixed(5)));
	                // Note: touch function must be called after calling the model's set method
	                that.touch();
	            }else{
	                that.fov_py= false;
	            }
	        });
	        this.al.on('positionChanged', function(position) {
	            if(!that.target_py){
	                that.target_js= true;
	                that.model.set('target', '' + position.ra.toFixed(6) + ' ' + position.dec.toFixed(6));
	                that.touch();
	            }else{
	                that.target_py= false;
	            }
	            
	        });
	    },
	
	    // Variables's listeners on the python side:
	    model_events: function () {
	        var that = this;
	        // Model's class parameters listeners
	        this.listenTo(this.model, 'change:fov', function () {
	            if(!that.fov_js){
	                that.fov_py= true;
	                that.al.setFoV(that.model.get('fov'));
	            }else{
	                that.fov_js= false;
	            }
	        }, this);
	        this.listenTo(this.model, 'change:target', function () {
	            if(!that.target_js){
	                that.target_py= true;
	                that.al.gotoObject(that.model.get('target'));
	            }else{
	                that.target_js= false;
	            }
	        }, this);
	        this.listenTo(this.model, 'change:coo_frame', function () {
	            that.al.setFrame(that.model.get('coo_frame'));
	        }, this);
	        this.listenTo(this.model, 'change:survey', function () {
	            var s = that.model.get('survey');
	            if (s.constructor == Object) {
	                s = that.al.createImageSurvey(s.hips_id,
	                                              s.hips_name,
	                                              s.base_url,
	                                              s.frame, s.max_order,
	                                              {imgFormat: s.image_format});
	            }
	            that.al.setImageSurvey(s);
	        }, this);
	        this.listenTo(this.model, 'change:overlay_survey', function () {
	            that.al.setOverlayImageLayer(that.model.get('overlay_survey'));
	        }, this);
	        this.listenTo(this.model, 'change:overlay_survey_opacity', function () {
	            that.al.getOverlayImageLayer().setAlpha(that.model.get('overlay_survey_opacity'));
	        }, this);
	
	        // Model's functions parameters listeners
	        this.listenTo(this.model, 'change:votable_from_URL_flag', function(){
	            that.al.addCatalog(aladin_lib.A.catalogFromURL(that.model.get('votable_URL'), that.model.get('votable_options')));
	        }, this);
	
	        this.listenTo(this.model, 'change:moc_from_URL_flag', function(){
	            that.al.addMOC(aladin_lib.A.MOCFromURL(that.model.get('moc_URL'), that.model.get('moc_options')));
	        }, this);
	        
	        this.listenTo(this.model, 'change:moc_from_dict_flag', function(){
	            that.al.addMOC(aladin_lib.A.MOCFromJSON(that.model.get('moc_dict'), that.model.get('moc_options')));
	        }, this);
	
	        this.listenTo(this.model, 'change:table_flag', function(){
	            var cat = aladin_lib.A.catalog({onClick: 'showTable'});
	            that.al.addCatalog(cat);
	            cat.addSourcesAsArray(that.model.get('table_keys'), that.model.get('table_columns'))
	        }, this);
	
	        this.listenTo(this.model, 'change:overlay_from_stcs_flag', function() {
	            var overlay = aladin_lib.A.graphicOverlay(that.model.get('overlay_options'));
	            that.al.addOverlay(overlay);
	            overlay.addFootprints(that.al.createFootprintsFromSTCS(that.model.get('stc_string')));
	        }, this);
	
	        this.listenTo(this.model, 'change:listener_flag', function(){
	            var type= that.model.get('listener_type');
	            that.al.on(type, function(object) {
	                if (type==='select') {
	                    var sources = object;
	                    // first, deselect previously selected sources
	                    for (var k=0; k<that.al.view.catalogs.length; k++) {
	                        that.al.view.catalogs[k].deselectAll();
	                    }
	                    var sourcesData = [];
	                    for (var k = 0; k<sources.length ; k++) {
	                        var source = sources[k];
	                        source.select();
	                        sourcesData.push(
	                            {
	                                data: source.data,
	                                dec: source.dec,
	                                ra: source.ra,
	                                x: source.x,
	                                y: source.y
	                            }
	                        );
	                    }
	                    that.send({
	                        'event': 'callback',
	                        'type': type,
	                        'data': sourcesData,
	                    });
	
	                    return;
	
	                }
	
	                // Send json object to the python-side of the application
	                // We only send object.data because the whole object possess a catalog attribute
	                // that cause error when trying to convert it into json
	                // (at least on chrome, due to object circularization)
	                if(object){
	                    that.send({
	                        'event': 'callback',
	                        'type': type,
	                        'data': {'data': object.data,
	                                 'dec': object.dec,
	                                 'ra': object.ra,
	                                 'x': object.x,
	                                 'y': object.y}
	                    });
	                }
	            });
	        }, this);
	
	        this.listenTo(this.model, 'change:rectangular_selection_flag', function(){
	            that.al.select();
	        });
	
	        this.listenTo(this.model, 'change:thumbnail_flag', function(){
	            that.al.exportAsPNG();
	        });
	
	        this.listenTo(this.model, 'change:color_map_flag', function(){
	            that.al.getBaseImageLayer().getColorMap().update(that.model.get('color_map_name'));
	        });
	    }
	
	});
	
	// Node.js exports
	module.exports = {
	    ViewAladin : ViewAladin,
	    ModelAladin : ModelAladin
	};
	
	/** 
	TODO:
	!!!: it seems that the rendering bug that occurs when the widget is displayed on full-screen is back......
	load AladinLite library from http...
	 */


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.6.0
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright OpenJS Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2021-03-02T17:08Z
	 */
	( function( global, factory ) {
	
		"use strict";
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
	
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";
	
	var arr = [];
	
	var getProto = Object.getPrototypeOf;
	
	var slice = arr.slice;
	
	var flat = arr.flat ? function( array ) {
		return arr.flat.call( array );
	} : function( array ) {
		return arr.concat.apply( [], array );
	};
	
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var fnToString = hasOwn.toString;
	
	var ObjectFunctionString = fnToString.call( Object );
	
	var support = {};
	
	var isFunction = function isFunction( obj ) {
	
			// Support: Chrome <=57, Firefox <=52
			// In some browsers, typeof returns "function" for HTML <object> elements
			// (i.e., `typeof document.createElement( "object" ) === "function"`).
			// We don't want to classify *any* DOM node as a function.
			// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
			// Plus for old WebKit, typeof returns "function" for HTML collections
			// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
			return typeof obj === "function" && typeof obj.nodeType !== "number" &&
				typeof obj.item !== "function";
		};
	
	
	var isWindow = function isWindow( obj ) {
			return obj != null && obj === obj.window;
		};
	
	
	var document = window.document;
	
	
	
		var preservedScriptAttributes = {
			type: true,
			src: true,
			nonce: true,
			noModule: true
		};
	
		function DOMEval( code, node, doc ) {
			doc = doc || document;
	
			var i, val,
				script = doc.createElement( "script" );
	
			script.text = code;
			if ( node ) {
				for ( i in preservedScriptAttributes ) {
	
					// Support: Firefox 64+, Edge 18+
					// Some browsers don't support the "nonce" property on scripts.
					// On the other hand, just using `getAttribute` is not enough as
					// the `nonce` attribute is reset to an empty string whenever it
					// becomes browsing-context connected.
					// See https://github.com/whatwg/html/issues/2369
					// See https://html.spec.whatwg.org/#nonce-attributes
					// The `node.getAttribute` check was added for the sake of
					// `jQuery.globalEval` so that it can fake a nonce-containing node
					// via an object.
					val = node[ i ] || node.getAttribute && node.getAttribute( i );
					if ( val ) {
						script.setAttribute( i, val );
					}
				}
			}
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}
	
	
	function toType( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
	
		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module
	
	
	
	var
		version = "3.6.0",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
	
			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}
	
			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		even: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return ( i + 1 ) % 2;
			} ) );
		},
	
		odd: function() {
			return this.pushStack( jQuery.grep( this, function( _elem, i ) {
				return i % 2;
			} ) );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !isFunction( target ) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					copy = options[ name ];
	
					// Prevent Object.prototype pollution
					// Prevent never-ending loop
					if ( name === "__proto__" || target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = Array.isArray( copy ) ) ) ) {
						src = target[ name ];
	
						// Ensure proper type for the source value
						if ( copyIsArray && !Array.isArray( src ) ) {
							clone = [];
						} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
							clone = {};
						} else {
							clone = src;
						}
						copyIsArray = false;
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isPlainObject: function( obj ) {
			var proto, Ctor;
	
			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}
	
			proto = getProto( obj );
	
			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}
	
			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},
	
		isEmptyObject: function( obj ) {
			var name;
	
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		// Evaluates a script in a provided context; falls back to the global one
		// if not specified.
		globalEval: function( code, options, doc ) {
			DOMEval( code, { nonce: options && options.nonce }, doc );
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
							[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return flat( ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
		function( _i, name ) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase();
		} );
	
	function isArrayLike( obj ) {
	
		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = toType( obj );
	
		if ( isFunction( obj ) || isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.6
	 * https://sizzlejs.com/
	 *
	 * Copyright JS Foundation and other contributors
	 * Released under the MIT license
	 * https://js.foundation/
	 *
	 * Date: 2021-02-16
	 */
	( function( window ) {
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		nonnativeSelectorCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// Instance methods
		hasOwn = ( {} ).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		pushNative = arr.push,
		push = arr.push,
		slice = arr.slice,
	
		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[ i ] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
			"ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
		identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
			"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
	
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
	
			// "Attribute values must be CSS identifiers [capture 5]
			// or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
			whitespace + "*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
	
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
	
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
	
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
			whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
			"*" ),
		rdescend = new RegExp( whitespace + "|>" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
	
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace +
				"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
				"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rhtml = /HTML$/i,
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
	
		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
		funescape = function( escape, nonHex ) {
			var high = "0x" + escape.slice( 1 ) - 0x10000;
	
			return nonHex ?
	
				// Strip the backslash prefix from a non-hex escape sequence
				nonHex :
	
				// Replace a hexadecimal escape sequence with the encoded Unicode code point
				// Support: IE <=11+
				// For values outside the Basic Multilingual Plane (BMP), manually construct a
				// surrogate pair
				high < 0 ?
					String.fromCharCode( high + 0x10000 ) :
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {
	
				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}
	
				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" +
					ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}
	
			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},
	
		inDisabledFieldset = addCombinator(
			function( elem ) {
				return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
			},
			{ dir: "parentNode", next: "legend" }
		);
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			( arr = slice.call( preferredDoc.childNodes ) ),
			preferredDoc.childNodes
		);
	
		// Support: Android<4.0
		// Detect silently failing push.apply
		// eslint-disable-next-line no-unused-expressions
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				pushNative.apply( target, slice.call( els ) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
	
				// Can't trust NodeList.length
				while ( ( target[ j++ ] = els[ i++ ] ) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
			setDocument( context );
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {
	
					// ID selector
					if ( ( m = match[ 1 ] ) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( ( elem = context.getElementById( m ) ) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && ( elem = newContext.getElementById( m ) ) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[ 2 ] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!nonnativeSelectorCache[ selector + " " ] &&
					( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&
	
					// Support: IE 8 only
					// Exclude object elements
					( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {
	
					newSelector = selector;
					newContext = context;
	
					// qSA considers elements outside a scoping root when evaluating child or
					// descendant combinators, which is not what we want.
					// In such cases, we work around the behavior by prefixing every selector in the
					// list with an ID selector referencing the scope context.
					// The technique has to be used as well when a leading combinator is used
					// as such selectors are not recognized by querySelectorAll.
					// Thanks to Andrew Dupont for this technique.
					if ( nodeType === 1 &&
						( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
	
						// We can use :scope instead of the ID hack if the browser
						// supports it & if we're not changing the context.
						if ( newContext !== context || !support.scope ) {
	
							// Capture the context ID, setting it first if necessary
							if ( ( nid = context.getAttribute( "id" ) ) ) {
								nid = nid.replace( rcssescape, fcssescape );
							} else {
								context.setAttribute( "id", ( nid = expando ) );
							}
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
								toSelector( groups[ i ] );
						}
						newSelector = groups.join( "," );
					}
	
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
						nonnativeSelectorCache( selector, true );
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
	
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
	
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return ( cache[ key + " " ] = value );
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement( "fieldset" );
	
		try {
			return !!fn( el );
		} catch ( e ) {
			return false;
		} finally {
	
			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}
	
			// release memory in IE
			el = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split( "|" ),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[ i ] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( ( cur = cur.nextSibling ) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return ( name === "input" || name === "button" ) && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {
	
		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {
	
			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {
	
				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {
	
					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}
	
					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||
	
						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
				}
	
				return elem.disabled === disabled;
	
			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}
	
			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction( function( argument ) {
			argument = +argument;
			return markFunction( function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
						seed[ j ] = !( matches[ j ] = seed[ j ] );
					}
				}
			} );
		} );
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;
	
		// Support: IE <=8
		// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
		// https://bugs.jquery.com/ticket/4833
		return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9 - 11+, Edge 12 - 18+
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( preferredDoc != document &&
			( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {
	
			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}
	
		// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
		// Safari 4 - 5 only, Opera <=11.6 - 12.x only
		// IE/Edge & older browsers don't support the :scope pseudo-class.
		// Support: Safari 6.0 only
		// Safari 6.0 supports :scope but it's an alias of :root there.
		support.scope = assert( function( el ) {
			docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
			return typeof el.querySelectorAll !== "undefined" &&
				!el.querySelectorAll( ":scope fieldset div" ).length;
		} );
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert( function( el ) {
			el.className = "i";
			return !el.getAttribute( "className" );
		} );
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert( function( el ) {
			el.appendChild( document.createComment( "" ) );
			return !el.getElementsByTagName( "*" ).length;
		} );
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert( function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		} );
	
		// ID filter and find
		if ( support.getById ) {
			Expr.filter[ "ID" ] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute( "id" ) === attrId;
				};
			};
			Expr.find[ "ID" ] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter[ "ID" ] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode( "id" );
					return node && node.value === attrId;
				};
			};
	
			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find[ "ID" ] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );
	
					if ( elem ) {
	
						// Verify the id attribute
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
	
						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( ( elem = elems[ i++ ] ) ) {
							node = elem.getAttributeNode( "id" );
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}
	
					return [];
				}
			};
		}
	
		// Tag
		Expr.find[ "TAG" ] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
	
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( ( elem = results[ i++ ] ) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {
	
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert( function( el ) {
	
				var input;
	
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll( "[selected]" ).length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push( "~=" );
				}
	
				// Support: IE 11+, Edge 15 - 18+
				// IE 11/Edge don't find elements on a `[name='']` query in some cases.
				// Adding a temporary attribute to the document before the selection works
				// around the issue.
				// Interestingly, IE 10 & older don't seem to have the issue.
				input = document.createElement( "input" );
				input.setAttribute( "name", "" );
				el.appendChild( input );
				if ( !el.querySelectorAll( "[name='']" ).length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
						whitespace + "*(?:''|\"\")" );
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll( ":checked" ).length ) {
					rbuggyQSA.push( ":checked" );
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push( ".#.+[+~]" );
				}
	
				// Support: Firefox <=3.6 - 5 only
				// Old Firefox doesn't throw on a badly-escaped identifier.
				el.querySelectorAll( "\\\f" );
				rbuggyQSA.push( "[\\r\\n\\f]" );
			} );
	
			assert( function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";
	
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement( "input" );
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll( "[name=d]" ).length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Support: Opera 10 - 11 only
				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll( "*,:x" );
				rbuggyQSA.push( ",.*:" );
			} );
		}
	
		if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector ) ) ) ) {
	
			assert( function( el ) {
	
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			} );
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				) );
			} :
			function( a, b ) {
				if ( b ) {
					while ( ( b = b.parentNode ) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {
	
				// Choose the first element that is related to our preferred document
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( a == document || a.ownerDocument == preferredDoc &&
					contains( preferredDoc, a ) ) {
					return -1;
				}
	
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if ( b == document || b.ownerDocument == preferredDoc &&
					contains( preferredDoc, b ) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
	
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
	
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				/* eslint-disable eqeqeq */
				return a == document ? -1 :
					b == document ? 1 :
					/* eslint-enable eqeqeq */
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( ( cur = cur.parentNode ) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( ( cur = cur.parentNode ) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[ i ] === bp[ i ] ) {
				i++;
			}
	
			return i ?
	
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[ i ], bp[ i ] ) :
	
				// Otherwise nodes in our document sort first
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				/* eslint-disable eqeqeq */
				ap[ i ] == preferredDoc ? -1 :
				bp[ i ] == preferredDoc ? 1 :
				/* eslint-enable eqeqeq */
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		setDocument( elem );
	
		if ( support.matchesSelector && documentIsHTML &&
			!nonnativeSelectorCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
	
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch ( e ) {
				nonnativeSelectorCache( expr, true );
			}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
	
		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( context.ownerDocument || context ) != document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
	
		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( ( elem.ownerDocument || elem ) != document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
	
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.escape = function( sel ) {
		return ( sel + "" ).replace( rcssescape, fcssescape );
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( ( elem = results[ i++ ] ) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
	
			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {
	
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
	
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
	
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[ 1 ] = match[ 1 ].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
					match[ 5 ] || "" ).replace( runescape, funescape );
	
				if ( match[ 2 ] === "~=" ) {
					match[ 3 ] = " " + match[ 3 ] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
	
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[ 1 ] = match[ 1 ].toLowerCase();
	
				if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {
	
					// nth-* requires argument
					if ( !match[ 3 ] ) {
						Sizzle.error( match[ 0 ] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[ 4 ] = +( match[ 4 ] ?
						match[ 5 ] + ( match[ 6 ] || 1 ) :
						2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
					match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );
	
					// other types prohibit arguments
				} else if ( match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[ 6 ] && match[ 2 ];
	
				if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[ 3 ] ) {
					match[ 2 ] = match[ 4 ] || match[ 5 ] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
	
					// Get excess from tokenize (recursively)
					( excess = tokenize( unquoted, true ) ) &&
	
					// advance to the next closing parenthesis
					( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {
	
					// excess is a negative index
					match[ 0 ] = match[ 0 ].slice( 0, excess );
					match[ 2 ] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() {
						return true;
					} :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					( pattern = new RegExp( "(^|" + whitespace +
						")" + className + "(" + whitespace + "|$)" ) ) && classCache(
							className, function( elem ) {
								return pattern.test(
									typeof elem.className === "string" && elem.className ||
									typeof elem.getAttribute !== "undefined" &&
										elem.getAttribute( "class" ) ||
									""
								);
					} );
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					/* eslint-disable max-len */
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
					/* eslint-enable max-len */
	
				};
			},
	
			"CHILD": function( type, what, _argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, _context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( ( node = node[ dir ] ) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
	
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || ( node[ expando ] = {} );
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									( diff = nodeIndex = 0 ) || start.pop() ) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
	
								// Use previously-cached element index if available
								if ( useCache ) {
	
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || ( node[ expando ] = {} );
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										( outerCache[ node.uniqueID ] = {} );
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
	
									// Use the same loop as above to seek `elem` from the start
									while ( ( node = ++nodeIndex && node && node[ dir ] ||
										( diff = nodeIndex = 0 ) || start.pop() ) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] ||
													( node[ expando ] = {} );
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													( outerCache[ node.uniqueID ] = {} );
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
	
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction( function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[ i ] );
								seed[ idx ] = !( matches[ idx ] = matched[ i ] );
							}
						} ) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
	
			// Potentially complex pseudos
			"not": markFunction( function( selector ) {
	
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction( function( seed, matches, _context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( ( elem = unmatched[ i ] ) ) {
								seed[ i ] = !( matches[ i ] = elem );
							}
						}
					} ) :
					function( elem, _context, xml ) {
						input[ 0 ] = elem;
						matcher( input, null, xml, results );
	
						// Don't keep the element (issue #299)
						input[ 0 ] = null;
						return !results.pop();
					};
			} ),
	
			"has": markFunction( function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			} ),
	
			"contains": markFunction( function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
				};
			} ),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
	
				// lang value must be a valid identifier
				if ( !ridentifier.test( lang || "" ) ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( ( elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
					return false;
				};
			} ),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement &&
					( !document.hasFocus || document.hasFocus() ) &&
					!!( elem.type || elem.href || ~elem.tabIndex );
			},
	
			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),
	
			"checked": function( elem ) {
	
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return ( nodeName === "input" && !!elem.checked ) ||
					( nodeName === "option" && !!elem.selected );
			},
	
			"selected": function( elem ) {
	
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					// eslint-disable-next-line no-unused-expressions
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
	
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos[ "empty" ]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( ( attr = elem.getAttribute( "type" ) ) == null ||
						attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo( function() {
				return [ 0 ];
			} ),
	
			"last": createPositionalPseudo( function( _matchIndexes, length ) {
				return [ length - 1 ];
			} ),
	
			"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			} ),
	
			"even": createPositionalPseudo( function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),
	
			"odd": createPositionalPseudo( function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),
	
			"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i = argument < 0 ?
					argument + length :
					argument > length ?
						length :
						argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} ),
	
			"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			} )
		}
	};
	
	Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
				if ( match ) {
	
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[ 0 ].length ) || soFar;
				}
				groups.push( ( tokens = [] ) );
			}
	
			matched = false;
	
			// Combinators
			if ( ( match = rcombinators.exec( soFar ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
	
					// Cast descendant combinators to space
					type: match[ 0 ].replace( rtrim, " " )
				} );
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
					( match = preFilters[ type ]( match ) ) ) ) {
					matched = match.shift();
					tokens.push( {
						value: matched,
						type: type,
						matches: match
					} );
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
	
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[ i ].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;
	
		return combinator.first ?
	
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( ( elem = elem[ dir ] ) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || ( elem[ expando ] = {} );
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] ||
								( outerCache[ elem.uniqueID ] = {} );
	
							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( ( oldCache = uniqueCache[ key ] ) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return ( newCache[ 2 ] = oldCache[ 2 ] );
							} else {
	
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[ i ]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[ 0 ];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[ i ], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( ( elem = unmatched[ i ] ) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction( function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts(
					selector || "*",
					context.nodeType ? [ context ] : context,
					[]
				),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
	
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( ( elem = temp[ i ] ) ) {
						matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
	
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( ( elem = matcherOut[ i ] ) ) {
	
								// Restore matcherIn since elem is not yet a final match
								temp.push( ( matcherIn[ i ] = elem ) );
							}
						}
						postFinder( null, ( matcherOut = [] ), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) &&
							( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {
	
							seed[ temp ] = !( results[ temp ] = elem );
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		} );
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[ 0 ].type ],
			implicitRelative = leadingRelative || Expr.relative[ " " ],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					( checkContext = context ).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
	
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
				matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
			} else {
				matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
	
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[ j ].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
	
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens
							.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
	
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),
	
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
					len = elems.length;
	
				if ( outermost ) {
	
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					outermostContext = context == document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
	
						// Support: IE 11+, Edge 17 - 18+
						// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
						// two documents; shallow comparisons work.
						// eslint-disable-next-line eqeqeq
						if ( !context && elem.ownerDocument != document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( ( matcher = elementMatchers[ j++ ] ) ) {
							if ( matcher( elem, context || document, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
	
						// They will have gone through all possible matchers
						if ( ( elem = !matcher && elem ) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( ( matcher = setMatchers[ j++ ] ) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
	
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
									setMatched[ i ] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
	
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[ i ] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache(
				selector,
				matcherFromGroupMatchers( elementMatchers, setMatchers )
			);
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( ( selector = compiled.selector || selector ) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[ 0 ] = match[ 0 ].slice( 0 );
			if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {
	
				context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
					.replace( runescape, funescape ), context ) || [] )[ 0 ];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[ i ];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ ( type = token.type ) ] ) {
					break;
				}
				if ( ( find = Expr.find[ type ] ) ) {
	
					// Search, expanding context for leading sibling combinators
					if ( ( seed = find(
						token.matches[ 0 ].replace( runescape, funescape ),
						rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
							context
					) ) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert( function( el ) {
	
		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
	} );
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert( function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute( "href" ) === "#";
	} ) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		} );
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert( function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	} ) ) {
		addHandle( "value", function( elem, _name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		} );
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert( function( el ) {
		return el.getAttribute( "disabled" ) == null;
	} ) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
					( val = elem.getAttributeNode( name ) ) && val.specified ?
						val.value :
						null;
			}
		} );
	}
	
	return Sizzle;
	
	} )( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	
	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;
	
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	
	
	function nodeName( elem, name ) {
	
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	
	}
	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
	
	
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}
	
		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}
	
		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}
	
		// Filtered directly for both simple and complex selectors
		return jQuery.filter( qualifier, elements, not );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}
	
		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			ret = this.pushStack( [] );
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						if ( elem ) {
	
							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );
	
			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :
	
							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
							matched.push( cur );
							break;
						}
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, _i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, _i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, _i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			if ( elem.contentDocument != null &&
	
				// Support: IE 11+
				// <object> elements with no `data` attribute has an object
				// `contentDocument` with a `null` prototype.
				getProto( elem.contentDocument ) ) {
	
				return elem.contentDocument;
			}
	
			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if ( nodeName( elem, "template" ) ) {
				elem = elem.content || elem;
			}
	
			return jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = locked || options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && toType( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}
	
	function adoptValue( value, resolve, reject, noValue ) {
		var method;
	
		try {
	
			// Check for promise aspect first to privilege synchronous behavior
			if ( value && isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );
	
			// Other thenables
			} else if ( value && isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );
	
			// Other non-thenables
			} else {
	
				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply( undefined, [ value ].slice( noValue ) );
			}
	
		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {
	
			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply( undefined, [ value ] );
		}
	}
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},
	
					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
	
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( _i, tuple ) {
	
								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];
	
								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;
	
										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}
	
										returned = handler.apply( that, args );
	
										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}
	
										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&
	
											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;
	
										// Handle a returned thenable
										if ( isFunction( then ) ) {
	
											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);
	
											// Normal processors (resolve) also hook into progress
											} else {
	
												// ...and disregard older resolution values
												maxDepth++;
	
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}
	
										// Handle all other returned values
										} else {
	
											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}
	
											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},
	
									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {
	
												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}
	
												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {
	
													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}
	
													deferred.rejectWith( that, args );
												}
											}
										};
	
								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {
	
									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}
	
						return jQuery.Deferred( function( newDefer ) {
	
							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);
	
							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);
	
							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];
	
				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add(
						function() {
	
							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},
	
						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,
	
						// rejected_handlers.disable
						// fulfilled_handlers.disable
						tuples[ 3 - i ][ 3 ].disable,
	
						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock,
	
						// progress_handlers.lock
						tuples[ 0 ][ 3 ].lock
					);
				}
	
				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );
	
				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};
	
				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( singleValue ) {
			var
	
				// count of uncompleted subordinates
				remaining = arguments.length,
	
				// count of unprocessed arguments
				i = remaining,
	
				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),
	
				// the primary Deferred
				primary = jQuery.Deferred(),
	
				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							primary.resolveWith( resolveContexts, resolveValues );
						}
					};
				};
	
			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
					!remaining );
	
				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( primary.state() === "pending" ||
					isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {
	
					return primary.then();
				}
			}
	
			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
			}
	
			return primary.promise();
		}
	} );
	
	
	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
	
	jQuery.Deferred.exceptionHook = function( error, stack ) {
	
		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};
	
	
	
	
	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};
	
	
	
	
	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();
	
	jQuery.fn.ready = function( fn ) {
	
		readyList
			.then( fn )
	
			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );
	
	jQuery.ready.then = readyList.then;
	
	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}
	
	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );
	
	} else {
	
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );
	
		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( toType( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, _key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
							value :
							value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		if ( chainable ) {
			return elems;
		}
	
		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}
	
		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	
	
	// Matches dashed string for camelizing
	var rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g;
	
	// Used by camelCase as callback to replace()
	function fcamelCase( _all, letter ) {
		return letter.toUpperCase();
	}
	
	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 15
	// Microsoft forgot to hump their vendor prefix (#9572)
	function camelCase( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	}
	var acceptData = function( owner ) {
	
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	
	
	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	
	Data.prototype = {
	
		cache: function( owner ) {
	
			// Check if the owner object already has a cache
			var value = owner[ this.expando ];
	
			// If not, create one
			if ( !value ) {
				value = {};
	
				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {
	
					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;
	
					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}
	
			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );
	
			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ camelCase( data ) ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
	
				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
	
				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
		},
		access: function( owner, key, value ) {
	
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				return this.get( owner, key );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key !== undefined ) {
	
				// Support array or space separated string of keys
				if ( Array.isArray( key ) ) {
	
					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( camelCase );
				} else {
					key = camelCase( key );
	
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}
	
				i = key.length;
	
				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();
	
	var dataUser = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	
	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}
	
		if ( data === "false" ) {
			return false;
		}
	
		if ( data === "null" ) {
			return null;
		}
	
		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}
	
		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}
	
		return data;
	}
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );
	
					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}
	
			return access( this, function( value ) {
				var data;
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
	
					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				this.each( function() {
	
					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || Array.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var documentElement = document.documentElement;
	
	
	
		var isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem );
			},
			composed = { composed: true };
	
		// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
		// Check attachment across shadow DOM boundaries when possible (gh-3504)
		// Support: iOS 10.0-10.2 only
		// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
		// leading to errors. We need to check for `getRootNode`.
		if ( documentElement.getRootNode ) {
			isAttached = function( elem ) {
				return jQuery.contains( elem.ownerDocument, elem ) ||
					elem.getRootNode( composed ) === elem.ownerDocument;
			};
		}
	var isHiddenWithinTree = function( elem, el ) {
	
			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
	
			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&
	
				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				isAttached( elem ) &&
	
				jQuery.css( elem, "display" ) === "none";
		};
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted, scale,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = elem.nodeType &&
				( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Support: Firefox <=54
			// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
			initial = initial / 2;
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			while ( maxIterations-- ) {
	
				// Evaluate and update our best guess (doubling guesses that zero out).
				// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
				jQuery.style( elem, prop, initialInUnit + unit );
				if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
					maxIterations = 0;
				}
				initialInUnit = initialInUnit / scale;
	
			}
	
			initialInUnit = initialInUnit * 2;
			jQuery.style( elem, prop, initialInUnit + unit );
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	
	
	var defaultDisplayMap = {};
	
	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];
	
		if ( display ) {
			return display;
		}
	
		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );
	
		temp.parentNode.removeChild( temp );
	
		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;
	
		return display;
	}
	
	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;
	
		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			display = elem.style.display;
			if ( show ) {
	
				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";
	
					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}
	
		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}
	
		return elements;
	}
	
	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );
	
	var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );
	
	
	
	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	
		// Support: IE <=9 only
		// IE <=9 replaces <option> tags with their contents when inserted outside of
		// the select element.
		div.innerHTML = "<option></option>";
		support.option = !!div.lastChild;
	} )();
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
	
		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		_default: [ 0, "", "" ]
	};
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	// Support: IE <=9 only
	if ( !support.option ) {
		wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
	}
	
	
	function getAll( context, tag ) {
	
		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;
	
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );
	
		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );
	
		} else {
			ret = [];
		}
	
		if ( tag === undefined || tag && nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}
	
		return ret;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/;
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, attached, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( toType( elem ) === "object" ) {
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}
	
			attached = isAttached( elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( attached ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	}
	
	
	var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE <=9 - 11+
	// focus() and blur() are asynchronous, except when they are no-op.
	// So expect focus to be synchronous when the element is already active,
	// and blur to be synchronous when the element is not already active.
	// (focus and blur are always synchronous in other supported browsers,
	// this just defines when we can count on it).
	function expectSync( elem, type ) {
		return ( elem === safeActiveElement() ) === ( type === "focus" );
	}
	
	// Support: IE <=9 only
	// Accessing document.activeElement can throw unexpectedly
	// https://bugs.jquery.com/ticket/13393
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );
	
			// Only attach events to objects that accept data
			if ( !acceptData( elem ) ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = Object.create( null );
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},
	
		dispatch: function( nativeEvent ) {
	
			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),
	
				// Make a writable jQuery.Event from the native event object
				event = jQuery.event.fix( nativeEvent ),
	
				handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
	
			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}
	
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// If the event is namespaced, then each handler is only invoked if it is
					// specially universal or its namespaces are a superset of the event's.
					if ( !event.rnamespace || handleObj.namespace === false ||
						event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Find delegate handlers
			if ( delegateCount &&
	
				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&
	
				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,
	
				get: isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
							return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
							return this.originalEvent[ name ];
						}
					},
	
				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},
	
		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			click: {
	
				// Utilize native event to ensure correct state for checkable inputs
				setup: function( data ) {
	
					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;
	
					// Claim the first handler
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {
	
						// dataPriv.set( el, "click", ... )
						leverageNative( el, "click", returnTrue );
					}
	
					// Return false to allow normal processing in the caller
					return false;
				},
				trigger: function( data ) {
	
					// For mutual compressibility with _default, replace `this` access with a local var.
					// `|| data` is dead code meant only to preserve the variable through minification.
					var el = this || data;
	
					// Force setup before triggering a click
					if ( rcheckableType.test( el.type ) &&
						el.click && nodeName( el, "input" ) ) {
	
						leverageNative( el, "click" );
					}
	
					// Return non-false to allow normal event-path propagation
					return true;
				},
	
				// For cross-browser consistency, suppress native .click() on links
				// Also prevent it if we're currently inside a leveraged native-event stack
				_default: function( event ) {
					var target = event.target;
					return rcheckableType.test( target.type ) &&
						target.click && nodeName( target, "input" ) &&
						dataPriv.get( target, "click" ) ||
						nodeName( target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};
	
	// Ensure the presence of an event listener that handles manually-triggered
	// synthetic events by interrupting progress until reinvoked in response to
	// *native* events that it fires directly, ensuring that state changes have
	// already occurred before other listeners are invoked.
	function leverageNative( el, type, expectSync ) {
	
		// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
		if ( !expectSync ) {
			if ( dataPriv.get( el, type ) === undefined ) {
				jQuery.event.add( el, type, returnTrue );
			}
			return;
		}
	
		// Register the controller as a special universal handler for all event namespaces
		dataPriv.set( el, type, false );
		jQuery.event.add( el, type, {
			namespace: false,
			handler: function( event ) {
				var notAsync, result,
					saved = dataPriv.get( this, type );
	
				if ( ( event.isTrigger & 1 ) && this[ type ] ) {
	
					// Interrupt processing of the outer synthetic .trigger()ed event
					// Saved data should be false in such cases, but might be a leftover capture object
					// from an async native handler (gh-4350)
					if ( !saved.length ) {
	
						// Store arguments for use when handling the inner native event
						// There will always be at least one argument (an event object), so this array
						// will not be confused with a leftover capture object.
						saved = slice.call( arguments );
						dataPriv.set( this, type, saved );
	
						// Trigger the native event and capture its result
						// Support: IE <=9 - 11+
						// focus() and blur() are asynchronous
						notAsync = expectSync( this, type );
						this[ type ]();
						result = dataPriv.get( this, type );
						if ( saved !== result || notAsync ) {
							dataPriv.set( this, type, false );
						} else {
							result = {};
						}
						if ( saved !== result ) {
	
							// Cancel the outer synthetic event
							event.stopImmediatePropagation();
							event.preventDefault();
	
							// Support: Chrome 86+
							// In Chrome, if an element having a focusout handler is blurred by
							// clicking outside of it, it invokes the handler synchronously. If
							// that handler calls `.remove()` on the element, the data is cleared,
							// leaving `result` undefined. We need to guard against this.
							return result && result.value;
						}
	
					// If this is an inner synthetic event for an event with a bubbling surrogate
					// (focus or blur), assume that the surrogate already propagated from triggering the
					// native event and prevent that from happening again here.
					// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
					// bubbling surrogate propagates *after* the non-bubbling base), but that seems
					// less bad than duplication.
					} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
						event.stopPropagation();
					}
	
				// If this is a native event triggered above, everything is now in order
				// Fire an inner synthetic event with the original arguments
				} else if ( saved.length ) {
	
					// ...and capture the result
					dataPriv.set( this, type, {
						value: jQuery.event.trigger(
	
							// Support: IE <=9 - 11+
							// Extend with the prototype to reset the above stopImmediatePropagation()
							jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
							saved.slice( 1 ),
							this
						)
					} );
	
					// Abort handling of the native event
					event.stopImmediatePropagation();
				}
			}
		} );
	}
	
	jQuery.removeEvent = function( elem, type, handle ) {
	
		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;
	
			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || Date.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		code: true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,
		which: true
	}, jQuery.event.addProp );
	
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
		jQuery.event.special[ type ] = {
	
			// Utilize native event if possible so blur/focus sequence is correct
			setup: function() {
	
				// Claim the first handler
				// dataPriv.set( this, "focus", ... )
				// dataPriv.set( this, "blur", ... )
				leverageNative( this, type, expectSync );
	
				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function() {
	
				// Force setup before trigger
				leverageNative( this, type );
	
				// Return non-false to allow normal event-path propagation
				return true;
			},
	
			// Suppress native focus or blur as it's already being fired
			// in leverageNative.
			_default: function() {
				return true;
			},
	
			delegateType: delegateType
		};
	} );
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	jQuery.fn.extend( {
	
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );
	
	
	var
	
		// Support: IE <=10 - 11, Edge 12 - 13 only
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	
	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget( elem, content ) {
		if ( nodeName( elem, "table" ) &&
			nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {
	
			return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
		}
	
		return elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
			elem.type = elem.type.slice( 5 );
		} else {
			elem.removeAttribute( "type" );
		}
	
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.get( src );
			events = pdataOld.events;
	
			if ( events ) {
				dataPriv.remove( dest, "handle events" );
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			dataUser.set( dest, udataCur );
		}
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = flat( args );
	
		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			valueIsFunction = isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( valueIsFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( valueIsFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl && !node.noModule ) {
									jQuery._evalUrl( node.src, {
										nonce: node.nonce || node.getAttribute( "nonce" )
									}, doc );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
							}
						}
					}
				}
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && isAttached( node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html;
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = isAttached( elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
	
			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
	var swap = function( elem, options, callback ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.call( elem );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );
	
	
	
	( function() {
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
	
			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}
	
			container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
				"margin-top:1px;padding:0;border:0";
			div.style.cssText =
				"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
				"margin:auto;border:1px;padding:1px;" +
				"width:60%;top:1%";
			documentElement.appendChild( container ).appendChild( div );
	
			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
	
			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;
	
			// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
			// Some styles come back with percentage values, even though they shouldn't
			div.style.right = "60%";
			pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;
	
			// Support: IE 9 - 11 only
			// Detect misreporting of content dimensions for box-sizing:border-box elements
			boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;
	
			// Support: IE 9 only
			// Detect overflow:scroll screwiness (gh-3699)
			// Support: Chrome <=64
			// Don't get tricked when zoom affects offsetWidth (gh-4029)
			div.style.position = "absolute";
			scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;
	
			documentElement.removeChild( container );
	
			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}
	
		function roundPixelMeasures( measure ) {
			return Math.round( parseFloat( measure ) );
		}
	
		var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
			reliableTrDimensionsVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		jQuery.extend( support, {
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelBoxStyles: function() {
				computeStyleTests();
				return pixelBoxStylesVal;
			},
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			},
			scrollboxSize: function() {
				computeStyleTests();
				return scrollboxSizeVal;
			},
	
			// Support: IE 9 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Behavior in IE 9 is more subtle than in newer versions & it passes
			// some versions of this test; make sure not to make it pass there!
			//
			// Support: Firefox 70+
			// Only Firefox includes border widths
			// in computed dimensions. (gh-4529)
			reliableTrDimensions: function() {
				var table, tr, trChild, trStyle;
				if ( reliableTrDimensionsVal == null ) {
					table = document.createElement( "table" );
					tr = document.createElement( "tr" );
					trChild = document.createElement( "div" );
	
					table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
					tr.style.cssText = "border:1px solid";
	
					// Support: Chrome 86+
					// Height set through cssText does not get applied.
					// Computed height then comes back as 0.
					tr.style.height = "1px";
					trChild.style.height = "9px";
	
					// Support: Android 8 Chrome 86+
					// In our bodyBackground.html iframe,
					// display for all div elements is set to "inline",
					// which causes a problem only in Android 8 Chrome 86.
					// Ensuring the div is display: block
					// gets around this issue.
					trChild.style.display = "block";
	
					documentElement
						.appendChild( table )
						.appendChild( tr )
						.appendChild( trChild );
	
					trStyle = window.getComputedStyle( tr );
					reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
						parseInt( trStyle.borderTopWidth, 10 ) +
						parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;
	
					documentElement.removeChild( table );
				}
				return reliableTrDimensionsVal;
			}
		} );
	} )();
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
	
			// Support: Firefox 51+
			// Retrieving style before computed somehow
			// fixes an issue with getting wrong values
			// on detached elements
			style = elem.style;
	
		computed = computed || getStyles( elem );
	
		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
	
			if ( ret === "" && !isAttached( elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
	
			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style,
		vendorProps = {};
	
	// Return a vendor-prefixed property or undefined
	function vendorPropName( name ) {
	
		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
	function finalPropName( name ) {
		var final = jQuery.cssProps[ name ] || vendorProps[ name ];
	
		if ( final ) {
			return final;
		}
		if ( name in emptyStyle ) {
			return name;
		}
		return vendorProps[ name ] = vendorPropName( name ) || name;
	}
	
	
	var
	
		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rcustomProp = /^--/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		};
	
	function setPositiveNumber( _elem, value, subtract ) {
	
		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}
	
	function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
		var i = dimension === "width" ? 1 : 0,
			extra = 0,
			delta = 0;
	
		// Adjustment may not be necessary
		if ( box === ( isBorderBox ? "border" : "content" ) ) {
			return 0;
		}
	
		for ( ; i < 4; i += 2 ) {
	
			// Both box models exclude margin
			if ( box === "margin" ) {
				delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
			}
	
			// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
			if ( !isBorderBox ) {
	
				// Add padding
				delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// For "border" or "margin", add border
				if ( box !== "padding" ) {
					delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
	
				// But still keep track of it otherwise
				} else {
					extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
	
			// If we get here with a border-box (content + padding + border), we're seeking "content" or
			// "padding" or "margin"
			} else {
	
				// For "content", subtract padding
				if ( box === "content" ) {
					delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// For "content" or "padding", subtract border
				if ( box !== "margin" ) {
					delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		// Account for positive content-box scroll gutter when requested by providing computedVal
		if ( !isBorderBox && computedVal >= 0 ) {
	
			// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
			// Assuming integer scroll gutter, subtract the rest and round down
			delta += Math.max( 0, Math.ceil(
				elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
				computedVal -
				delta -
				extra -
				0.5
	
			// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
			// Use an explicit zero to avoid NaN (gh-3964)
			) ) || 0;
		}
	
		return delta;
	}
	
	function getWidthOrHeight( elem, dimension, extra ) {
	
		// Start with computed style
		var styles = getStyles( elem ),
	
			// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
			// Fake content-box until we know it's needed to know the true value.
			boxSizingNeeded = !support.boxSizingReliable() || extra,
			isBorderBox = boxSizingNeeded &&
				jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
			valueIsBorderBox = isBorderBox,
	
			val = curCSS( elem, dimension, styles ),
			offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );
	
		// Support: Firefox <=54
		// Return a confounding non-pixel value or feign ignorance, as appropriate.
		if ( rnumnonpx.test( val ) ) {
			if ( !extra ) {
				return val;
			}
			val = "auto";
		}
	
	
		// Support: IE 9 - 11 only
		// Use offsetWidth/offsetHeight for when box sizing is unreliable.
		// In those cases, the computed value can be trusted to be border-box.
		if ( ( !support.boxSizingReliable() && isBorderBox ||
	
			// Support: IE 10 - 11+, Edge 15 - 18+
			// IE/Edge misreport `getComputedStyle` of table rows with width/height
			// set in CSS while `offset*` properties report correct values.
			// Interestingly, in some cases IE 9 doesn't suffer from this issue.
			!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||
	
			// Fall back to offsetWidth/offsetHeight when value is "auto"
			// This happens for inline elements with no explicit setting (gh-3571)
			val === "auto" ||
	
			// Support: Android <=4.1 - 4.3 only
			// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
			!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&
	
			// Make sure the element is visible & connected
			elem.getClientRects().length ) {
	
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
			// Where available, offsetWidth/offsetHeight approximate border box dimensions.
			// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
			// retrieved value as a content box dimension.
			valueIsBorderBox = offsetProp in elem;
			if ( valueIsBorderBox ) {
				val = elem[ offsetProp ];
			}
		}
	
		// Normalize "" and auto
		val = parseFloat( val ) || 0;
	
		// Adjust for the element's box model
		return ( val +
			boxModelAdjustment(
				elem,
				dimension,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles,
	
				// Provide the current computed size to request scroll gutter calculation (gh-3589)
				val
			)
		) + "px";
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"gridArea": true,
			"gridColumn": true,
			"gridColumnEnd": true,
			"gridColumnStart": true,
			"gridRow": true,
			"gridRowEnd": true,
			"gridRowStart": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name ),
				style = elem.style;
	
			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
				// "px" to a few hardcoded values.
				if ( type === "number" && !isCustomProp ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					if ( isCustomProp ) {
						style.setProperty( name, value );
					} else {
						style[ name ] = value;
					}
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = camelCase( name ),
				isCustomProp = rcustomProp.test( name );
	
			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if ( !isCustomProp ) {
				name = finalPropName( origName );
			}
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
	
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( _i, dimension ) {
		jQuery.cssHooks[ dimension ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
	
						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var matches,
					styles = getStyles( elem ),
	
					// Only read styles.position if the test has a chance to fail
					// to avoid forcing a reflow.
					scrollboxSizeBuggy = !support.scrollboxSize() &&
						styles.position === "absolute",
	
					// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
					boxSizingNeeded = scrollboxSizeBuggy || extra,
					isBorderBox = boxSizingNeeded &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					subtract = extra ?
						boxModelAdjustment(
							elem,
							dimension,
							extra,
							isBorderBox,
							styles
						) :
						0;
	
				// Account for unreliable border-box dimensions by comparing offset* to computed and
				// faking a content-box to get border and padding (gh-3699)
				if ( isBorderBox && scrollboxSizeBuggy ) {
					subtract -= Math.ceil(
						elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
						parseFloat( styles[ dimension ] ) -
						boxModelAdjustment( elem, dimension, "border", false, styles ) -
						0.5
					);
				}
	
				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {
	
					elem.style[ dimension ] = value;
					value = jQuery.css( elem, dimension );
				}
	
				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
				) + "px";
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( prefix !== "margin" ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( Array.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
						tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, inProgress,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	function schedule() {
		if ( inProgress ) {
			if ( document.hidden === false && window.requestAnimationFrame ) {
				window.requestAnimationFrame( schedule );
			} else {
				window.setTimeout( schedule, jQuery.fx.interval );
			}
	
			jQuery.fx.tick();
		}
	}
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = Date.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );
	
		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
	
					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}
	
		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}
	
		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {
	
			// Support: IE <=9 - 11, Edge 12 - 15
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY and Edge just mirrors
			// the overflowX value there.
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {
	
					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}
	
			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {
	
					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	
		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {
	
			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}
	
				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}
	
				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}
	
				/* eslint-disable no-loop-func */
	
				anim.done( function() {
	
					/* eslint-enable no-loop-func */
	
					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}
	
			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( Array.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				// If there's more to do, yield
				if ( percent < 1 && length ) {
					return remaining;
				}
	
				// If this was an empty animation, synthesize a final progress notification
				if ( !length ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
				}
	
				// Resolve the animation and report its conclusion
				deferred.resolveWith( elem, [ animation ] );
				return false;
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						result.stop.bind( result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		// Attach callbacks from options
		animation
			.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		return animation;
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !isFunction( easing ) && easing
		};
	
		// Go to the end state if fx are off
		if ( jQuery.fx.off ) {
			opt.duration = 0;
	
		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];
	
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
	
			doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = Date.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Run the timer and safely remove it when done (allowing for external removal)
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		jQuery.fx.start();
	};
	
	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( inProgress ) {
			return;
		}
	
		inProgress = true;
		schedule();
	};
	
	jQuery.fx.stop = function() {
		inProgress = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();
	
	
	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name,
				i = 0,
	
				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();
	
			if ( !isXML ) {
	
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}
	
					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}
	
					return -1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	
	
	
		// Strip and collapse whitespace according to HTML spec
		// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}
	
	
	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}
	
	function classesToArray( value ) {
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			return value.match( rnothtmlwhite ) || [];
		}
		return [];
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			classes = classesToArray( value );
	
			if ( classes.length ) {
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			classes = classesToArray( value );
	
			if ( classes.length ) {
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value,
				isValidValue = type === "string" || Array.isArray( value );
	
			if ( typeof stateVal === "boolean" && isValidValue ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( isValidValue ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = classesToArray( value );
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// Store className if set
						dataPriv.set( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
								"" :
								dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	var rreturn = /\r/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, valueIsFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}
	
					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}
	
				return;
			}
	
			valueIsFunction = isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( valueIsFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( Array.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
	
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;
	
					if ( index < 0 ) {
						i = max;
	
					} else {
						i = one ? index : 0;
					}
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
	
						/* eslint-disable no-cond-assign */
	
						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
	
						/* eslint-enable no-cond-assign */
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( Array.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	support.focusin = "onfocusin" in window;
	
	
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		stopPropagationCallback = function( e ) {
			e.stopPropagation();
		};
	
	jQuery.extend( jQuery.event, {
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = lastElement = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
				lastElement = cur;
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
	
						if ( event.isPropagationStopped() ) {
							lastElement.addEventListener( type, stopPropagationCallback );
						}
	
						elem[ type ]();
	
						if ( event.isPropagationStopped() ) {
							lastElement.removeEventListener( type, stopPropagationCallback );
						}
	
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);
	
			jQuery.event.trigger( e, null, elem );
		}
	
	} );
	
	jQuery.fn.extend( {
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
	
					// Handle: regular nodes (via `this.ownerDocument`), window
					// (via `this.document`) & document (via `this`).
					var doc = this.ownerDocument || this.document || this,
						attaches = dataPriv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this.document || this,
						attaches = dataPriv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );
	
					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;
	
	var nonce = { guid: Date.now() };
	
	var rquery = ( /\?/ );
	
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, parserErrorElem;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {}
	
		parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
		if ( !xml || parserErrorElem ) {
			jQuery.error( "Invalid XML: " + (
				parserErrorElem ?
					jQuery.map( parserErrorElem.childNodes, function( el ) {
						return el.textContent;
					} ).join( "\n" ) :
					data
			) );
		}
		return xml;
	};
	
	
	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( Array.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && toType( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {
	
				// If value is a function, invoke it and use its return value
				var value = isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;
	
				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};
	
		if ( a == null ) {
			return "";
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} ).filter( function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} ).map( function( _i, elem ) {
				var val = jQuery( this ).val();
	
				if ( val == null ) {
					return null;
				}
	
				if ( Array.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}
	
				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
	
	originAnchor.href = location.href;
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];
	
			if ( isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": JSON.parse,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers
				responseHeadersString,
				responseHeaders,
	
				// timeout handle
				timeoutTimer,
	
				// Url cleanup var
				urlAnchor,
	
				// Request state (becomes false upon send and true upon completion)
				completed,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				// Loop variable
				i,
	
				// uncached part of the url
				uncached,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
										( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
											.concat( match[ 2 ] );
								}
							}
							match = responseHeaders[ key.toLowerCase() + " " ];
						}
						return match == null ? null : match.join( ", " );
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {
	
								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR );
	
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];
	
			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );
	
				// Support: IE <=8 - 11, Edge 12 - 15
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;
	
					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {
	
					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );
	
				// If data is available and should be processed, append data to url
				if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
						uncached;
				}
	
				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;
	
			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}
	
					// Propagate others as results
					done( -1, e );
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Ignore repeat invocations
				if ( completed ) {
					return;
				}
	
				completed = true;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Use a noop converter for missing script but not if jsonp
				if ( !isSuccess &&
					jQuery.inArray( "script", s.dataTypes ) > -1 &&
					jQuery.inArray( "json", s.dataTypes ) < 0 ) {
					s.converters[ "text script" ] = function() {};
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( _i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// Shift arguments if data argument was omitted
			if ( isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	jQuery.ajaxPrefilter( function( s ) {
		var i;
		for ( i in s.headers ) {
			if ( i.toLowerCase() === "content-type" ) {
				s.contentType = s.headers[ i ] || "";
			}
		}
	} );
	
	
	jQuery._evalUrl = function( url, options, doc ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
	
			// Only evaluate the response if it is successful (gh-4126)
			// dataFilter is not invoked for failure responses, so using it instead
			// of the default converter is kludgy but it works.
			converters: {
				"text script": function() {}
			},
			dataFilter: function( response ) {
				jQuery.globalEval( response, options, doc );
			}
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;
	
			if ( this[ 0 ] ) {
				if ( isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var htmlIsFunction = isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );
	
	
	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};
	
	
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};
	
	var xhrSuccessStatus = {
	
			// File protocol always yields status code 0, assume 200
			0: 200,
	
			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();
	
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.ontimeout =
										xhr.onreadystatechange = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
	
									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(
	
											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
	
										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );
	
					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
	
							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {
	
								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}
	
					// Create the abort callback
					callback = callback( "abort" );
	
					try {
	
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
	
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain or forced-by-attrs requests
		if ( s.crossDomain || s.scriptAttrs ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" )
						.attr( s.scriptAttrs || {} )
						.prop( { charset: s.scriptCharset, src: s.url } )
						.on( "load error", callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						} );
	
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// Force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();
	
	
	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
	
		var base, parsed, scripts;
	
		if ( !context ) {
	
			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );
	
				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}
	
		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
	
		// offset() relates an element's border box to the document origin
		offset: function( options ) {
	
			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var rect, win,
				elem = this[ 0 ];
	
			if ( !elem ) {
				return;
			}
	
			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}
	
			// Get document-relative position by adding viewport scroll to viewport-relative gBCR
			rect = elem.getBoundingClientRect();
			win = elem.ownerDocument.defaultView;
			return {
				top: rect.top + win.pageYOffset,
				left: rect.left + win.pageXOffset
			};
		},
	
		// position() relates an element's margin box to its offset parent's padding box
		// This corresponds to the behavior of CSS absolute positioning
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset, doc,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// position:fixed elements are offset from the viewport, which itself always has zero offset
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// Assume position:fixed implies availability of getBoundingClientRect
				offset = elem.getBoundingClientRect();
	
			} else {
				offset = this.offset();
	
				// Account for the *real* offset parent, which can be the document or its root element
				// when a statically positioned element is identified
				doc = elem.ownerDocument;
				offsetParent = elem.offsetParent || doc.documentElement;
				while ( offsetParent &&
					( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
					jQuery.css( offsetParent, "position" ) === "static" ) {
	
					offsetParent = offsetParent.parentNode;
				}
				if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {
	
					// Incorporate borders into its offset, since they are outside its content origin
					parentOffset = jQuery( offsetParent ).offset();
					parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
					parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
				}
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
	
				// Coalesce documents and windows
				var win;
				if ( isWindow( elem ) ) {
					win = elem;
				} else if ( elem.nodeType === 9 ) {
					win = elem.defaultView;
				}
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );
	
	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( _i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( {
			padding: "inner" + name,
			content: type,
			"": "outer" + name
		}, function( defaultExtra, funcName ) {
	
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( isWindow( elem ) ) {
	
						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );
	
	
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( _i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},
	
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	jQuery.each(
		( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( _i, name ) {
	
			// Handle event binding
			jQuery.fn[ name ] = function( data, fn ) {
				return arguments.length > 0 ?
					this.on( name, null, data, fn ) :
					this.trigger( name );
			};
		}
	);
	
	
	
	
	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	
	// Bind a function to a context, optionally partially applying any
	// arguments.
	// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
	// However, it is not slated for removal any time soon
	jQuery.proxy = function( fn, context ) {
		var tmp, args, proxy;
	
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}
	
		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !isFunction( fn ) ) {
			return undefined;
		}
	
		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};
	
		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
		return proxy;
	};
	
	jQuery.holdReady = function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;
	jQuery.isFunction = isFunction;
	jQuery.isWindow = isWindow;
	jQuery.camelCase = camelCase;
	jQuery.type = toType;
	
	jQuery.now = Date.now;
	
	jQuery.isNumeric = function( obj ) {
	
		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&
	
			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	};
	
	jQuery.trim = function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	};
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === "undefined" ) {
		window.jQuery = window.$ = jQuery;
	}
	
	
	
	
	return jQuery;
	} );


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var $ = __webpack_require__(2);
	
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	// cds namespace
	
	var cds = cds || {};
	
	var A = A || {};
	/*
	    json2.js
	    2012-10-08
	
	    Public Domain.
	
	    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	
	    See http://www.JSON.org/js.html
	
	
	    This code should be minified before deployment.
	    See http://javascript.crockford.com/jsmin.html
	
	    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	    NOT CONTROL.
	
	
	    This file creates a global JSON object containing two methods: stringify
	    and parse.
	
	        JSON.stringify(value, replacer, space)
	            value       any JavaScript value, usually an object or array.
	
	            replacer    an optional parameter that determines how object
	                        values are stringified for objects. It can be a
	                        function or an array of strings.
	
	            space       an optional parameter that specifies the indentation
	                        of nested structures. If it is omitted, the text will
	                        be packed without extra whitespace. If it is a number,
	                        it will specify the number of spaces to indent at each
	                        level. If it is a string (such as '\t' or '&nbsp;'),
	                        it contains the characters used to indent at each level.
	
	            This method produces a JSON text from a JavaScript value.
	
	            When an object value is found, if the object contains a toJSON
	            method, its toJSON method will be called and the result will be
	            stringified. A toJSON method does not serialize: it returns the
	            value represented by the name/value pair that should be serialized,
	            or undefined if nothing should be serialized. The toJSON method
	            will be passed the key associated with the value, and this will be
	            bound to the value
	
	            For example, this would serialize Dates as ISO strings.
	
	                Date.prototype.toJSON = function (key) {
	                    function f(n) {
	                        // Format integers to have at least two digits.
	                        return n < 10 ? '0' + n : n;
	                    }
	
	                    return this.getUTCFullYear()   + '-' +
	                         f(this.getUTCMonth() + 1) + '-' +
	                         f(this.getUTCDate())      + 'T' +
	                         f(this.getUTCHours())     + ':' +
	                         f(this.getUTCMinutes())   + ':' +
	                         f(this.getUTCSeconds())   + 'Z';
	                };
	
	            You can provide an optional replacer method. It will be passed the
	            key and value of each member, with this bound to the containing
	            object. The value that is returned from your method will be
	            serialized. If your method returns undefined, then the member will
	            be excluded from the serialization.
	
	            If the replacer parameter is an array of strings, then it will be
	            used to select the members to be serialized. It filters the results
	            such that only members with keys listed in the replacer array are
	            stringified.
	
	            Values that do not have JSON representations, such as undefined or
	            functions, will not be serialized. Such values in objects will be
	            dropped; in arrays they will be replaced with null. You can use
	            a replacer function to replace those with JSON values.
	            JSON.stringify(undefined) returns undefined.
	
	            The optional space parameter produces a stringification of the
	            value that is filled with line breaks and indentation to make it
	            easier to read.
	
	            If the space parameter is a non-empty string, then that string will
	            be used for indentation. If the space parameter is a number, then
	            the indentation will be that many spaces.
	
	            Example:
	
	            text = JSON.stringify(['e', {pluribus: 'unum'}]);
	            // text is '["e",{"pluribus":"unum"}]'
	
	
	            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
	            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
	
	            text = JSON.stringify([new Date()], function (key, value) {
	                return this[key] instanceof Date ?
	                    'Date(' + this[key] + ')' : value;
	            });
	            // text is '["Date(---current time---)"]'
	
	
	        JSON.parse(text, reviver)
	            This method parses a JSON text to produce an object or array.
	            It can throw a SyntaxError exception.
	
	            The optional reviver parameter is a function that can filter and
	            transform the results. It receives each of the keys and values,
	            and its return value is used instead of the original value.
	            If it returns what it received, then the structure is not modified.
	            If it returns undefined then the member is deleted.
	
	            Example:
	
	            // Parse the text. Values that look like ISO date strings will
	            // be converted to Date objects.
	
	            myData = JSON.parse(text, function (key, value) {
	                var a;
	                if (typeof value === 'string') {
	                    a =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
	                    if (a) {
	                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
	                            +a[5], +a[6]));
	                    }
	                }
	                return value;
	            });
	
	            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
	                var d;
	                if (typeof value === 'string' &&
	                        value.slice(0, 5) === 'Date(' &&
	                        value.slice(-1) === ')') {
	                    d = new Date(value.slice(5, -1));
	                    if (d) {
	                        return d;
	                    }
	                }
	                return value;
	            });
	
	
	    This is a reference implementation. You are free to copy, modify, or
	    redistribute.
	*/
	
	/*jslint evil: true, regexp: true */
	
	/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	    lastIndex, length, parse, prototype, push, replace, slice, stringify,
	    test, toJSON, toString, valueOf
	*/
	
	
	// Create a JSON object only if one does not already exist. We create the
	// methods in a closure to avoid creating global variables.
	
	if (typeof JSON !== 'object') {
	    JSON = {};
	}
	
	(function () {
	    'use strict';
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    if (typeof Date.prototype.toJSON !== 'function') {
	
	        Date.prototype.toJSON = function (key) {
	
	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null;
	        };
	
	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function (key) {
	                return this.valueOf();
	            };
	    }
	
	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;
	
	
	    function quote(string) {
	
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }
	
	
	    function str(key, holder) {
	
	// Produce a string from holder[key].
	
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];
	
	// If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }
	
	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.
	
	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	
	// What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	
	        case 'number':
	
	// JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	
	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce 'null'. The case is included here in
	// the remote chance that this gets fixed someday.
	
	            return String(value);
	
	// If the type is 'object', we might be dealing with an object or an array or
	// null.
	
	        case 'object':
	
	// Due to a specification blunder in ECMAScript, typeof null is 'object',
	// so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	// Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	// Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	
	// Join all of the elements together, separated with commas, and wrap them in
	// brackets.
	
	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	
	// If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	
	// Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	
	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.
	
	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }
	
	// If the JSON object does not yet have a stringify method, give it one.
	
	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = function (value, replacer, space) {
	
	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.
	
	            var i;
	            gap = '';
	            indent = '';
	
	// If the space parameter is a number, make an indent string containing that
	// many spaces.
	
	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }
	
	// If the space parameter is a string, it will be used as the indent string.
	
	            } else if (typeof space === 'string') {
	                indent = space;
	            }
	
	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.
	
	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }
	
	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.
	
	            return str('', {'': value});
	        };
	    }
	
	
	// If the JSON object does not yet have a parse method, give it one.
	
	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {
	
	// The parse method takes a text and an optional reviver function, and returns
	// a JavaScript value if the text is a valid JSON text.
	
	            var j;
	
	            function walk(holder, key) {
	
	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.
	
	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }
	
	
	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many characters
	// incorrectly, either silently deleting them, or treating them as line endings.
	
	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }
	
	// In the second stage, we run the text against regular expressions that look
	// for non-JSON patterns. We are especially concerned with '()' and 'new'
	// because they can cause invocation, and '=' because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.
	
	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.
	
	                j = eval('(' + text + ')');
	
	// In the optional fourth stage, we recursively walk the new structure, passing
	// each name/value pair to a reviver function for possible transformation.
	
	                return typeof reviver === 'function'
	                    ? walk({'': j}, '')
	                    : j;
	            }
	
	// If the text is not JSON parseable, then a SyntaxError is thrown.
	
	            throw new SyntaxError('JSON.parse');
	        };
	    }
	}());// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	// log 
	Logger = {};
	
	Logger.log = function(action, params) {
	    try {
	        var logUrl = "//alasky.unistra.fr/cgi/AladinLiteLogger/log.py";
	        var paramStr = "";
	        if (params) {
	            paramStr = JSON.stringify(params);
	        }
	        
	        $.ajax({
	            url: logUrl,
	            data: {"action": action, "params": paramStr, "pageUrl": window.location.href, "referer": document.referrer ? document.referrer : ""},
	            method: 'GET',
	            dataType: 'json' // as alasky supports CORS, we do not need JSONP any longer
	        });
	        
	    }
	    catch(e) {
	        window.console && console.log('Exception: ' + e);
	    }
	
	};
	/*!
	 * jQuery Mousewheel 3.1.13
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 */
	
	(function (factory) {
	    if ( true ) {
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        // Node/CommonJS style for Browserify
	        module.exports = factory;
	    } else {
	        // Browser globals
	        factory(jQuery);
	    }
	}(function ($) {
	
	    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
	        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
	                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
	        slice  = Array.prototype.slice,
	        nullLowestDeltaTimeout, lowestDelta;
	
	    if ( $.event.fixHooks ) {
	        for ( var i = toFix.length; i; ) {
	            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
	        }
	    }
	
	    var special = $.event.special.mousewheel = {
	        version: '3.1.12',
	
	        setup: function() {
	            if ( this.addEventListener ) {
	                for ( var i = toBind.length; i; ) {
	                    this.addEventListener( toBind[--i], handler, false );
	                }
	            } else {
	                this.onmousewheel = handler;
	            }
	            // Store the line height and page height for this particular element
	            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
	            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
	        },
	
	        teardown: function() {
	            if ( this.removeEventListener ) {
	                for ( var i = toBind.length; i; ) {
	                    this.removeEventListener( toBind[--i], handler, false );
	                }
	            } else {
	                this.onmousewheel = null;
	            }
	            // Clean up the data we added to the element
	            $.removeData(this, 'mousewheel-line-height');
	            $.removeData(this, 'mousewheel-page-height');
	        },
	
	        getLineHeight: function(elem) {
	            var $elem = $(elem),
	                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
	            if (!$parent.length) {
	                $parent = $('body');
	            }
	            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
	        },
	
	        getPageHeight: function(elem) {
	            return $(elem).height();
	        },
	
	        settings: {
	            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
	            normalizeOffset: true  // calls getBoundingClientRect for each event
	        }
	    };
	
	    $.fn.extend({
	        mousewheel: function(fn) {
	            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
	        },
	
	        unmousewheel: function(fn) {
	            return this.unbind('mousewheel', fn);
	        }
	    });
	
	
	    function handler(event) {
	        var orgEvent   = event || window.event,
	            args       = slice.call(arguments, 1),
	            delta      = 0,
	            deltaX     = 0,
	            deltaY     = 0,
	            absDelta   = 0,
	            offsetX    = 0,
	            offsetY    = 0;
	        event = $.event.fix(orgEvent);
	        event.type = 'mousewheel';
	
	        // Old school scrollwheel delta
	        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
	        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
	        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
	        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }
	
	        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
	        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
	            deltaX = deltaY * -1;
	            deltaY = 0;
	        }
	
	        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
	        delta = deltaY === 0 ? deltaX : deltaY;
	
	        // New school wheel delta (wheel event)
	        if ( 'deltaY' in orgEvent ) {
	            deltaY = orgEvent.deltaY * -1;
	            delta  = deltaY;
	        }
	        if ( 'deltaX' in orgEvent ) {
	            deltaX = orgEvent.deltaX;
	            if ( deltaY === 0 ) { delta  = deltaX * -1; }
	        }
	
	        // No change actually happened, no reason to go any further
	        if ( deltaY === 0 && deltaX === 0 ) { return; }
	
	        // Need to convert lines and pages to pixels if we aren't already in pixels
	        // There are three delta modes:
	        //   * deltaMode 0 is by pixels, nothing to do
	        //   * deltaMode 1 is by lines
	        //   * deltaMode 2 is by pages
	        if ( orgEvent.deltaMode === 1 ) {
	            var lineHeight = $.data(this, 'mousewheel-line-height');
	            delta  *= lineHeight;
	            deltaY *= lineHeight;
	            deltaX *= lineHeight;
	        } else if ( orgEvent.deltaMode === 2 ) {
	            var pageHeight = $.data(this, 'mousewheel-page-height');
	            delta  *= pageHeight;
	            deltaY *= pageHeight;
	            deltaX *= pageHeight;
	        }
	
	        // Store lowest absolute delta to normalize the delta values
	        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
	
	        if ( !lowestDelta || absDelta < lowestDelta ) {
	            lowestDelta = absDelta;
	
	            // Adjust older deltas if necessary
	            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
	                lowestDelta /= 40;
	            }
	        }
	
	        // Adjust older deltas if necessary
	        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
	            // Divide all the things by 40!
	            delta  /= 40;
	            deltaX /= 40;
	            deltaY /= 40;
	        }
	
	        // Get a whole, normalized value for the deltas
	        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
	        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
	        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);
	
	        // Normalise offsetX and offsetY properties
	        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
	            var boundingRect = this.getBoundingClientRect();
	            offsetX = event.clientX - boundingRect.left;
	            offsetY = event.clientY - boundingRect.top;
	        }
	
	        // Add information to the event object
	        event.deltaX = deltaX;
	        event.deltaY = deltaY;
	        event.deltaFactor = lowestDelta;
	        event.offsetX = offsetX;
	        event.offsetY = offsetY;
	        // Go ahead and set deltaMode to 0 since we converted to pixels
	        // Although this is a little odd since we overwrite the deltaX/Y
	        // properties with normalized deltas.
	        event.deltaMode = 0;
	
	        // Add event and delta to the front of the arguments
	        args.unshift(event, delta, deltaX, deltaY);
	
	        // Clearout lowestDelta after sometime to better
	        // handle multiple device types that give different
	        // a different lowestDelta
	        // Ex: trackpad = 3 and mouse wheel = 120
	        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
	        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
	
	        return ($.event.dispatch || $.event.handle).apply(this, args);
	    }
	
	    function nullLowestDelta() {
	        lowestDelta = null;
	    }
	
	    function shouldAdjustOldDeltas(orgEvent, absDelta) {
	        // If this is an older event and the delta is divisable by 120,
	        // then we are assuming that the browser is treating this as an
	        // older mouse wheel event and that we should divide the deltas
	        // by 40 to try and get a more usable deltaFactor.
	        // Side note, this actually impacts the reported scroll distance
	        // in older browsers and can cause scrolling to be slower than native.
	        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
	        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
	    }
	
	}));
	// requestAnimationFrame() shim by Paul Irish
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
					window.setTimeout(callback, 1000 / 60);
				};
	})();// stats.js r6 - http://github.com/mrdoob/stats.js
	var Stats=function(){function s(a,g,d){var f,c,e;for(c=0;c<30;c++)for(f=0;f<73;f++)e=(f+c*74)*4,a[e]=a[e+4],a[e+1]=a[e+5],a[e+2]=a[e+6];for(c=0;c<30;c++)e=(73+c*74)*4,c<g?(a[e]=b[d].bg.r,a[e+1]=b[d].bg.g,a[e+2]=b[d].bg.b):(a[e]=b[d].fg.r,a[e+1]=b[d].fg.g,a[e+2]=b[d].fg.b)}var r=0,t=2,g,u=0,j=(new Date).getTime(),F=j,v=j,l=0,w=1E3,x=0,k,d,a,m,y,n=0,z=1E3,A=0,f,c,o,B,p=0,C=1E3,D=0,h,i,q,E,b={fps:{bg:{r:16,g:16,b:48},fg:{r:0,g:255,b:255}},ms:{bg:{r:16,g:48,b:16},fg:{r:0,g:255,b:0}},mb:{bg:{r:48,g:16,
	b:26},fg:{r:255,g:0,b:128}}};g=document.createElement("div");g.style.cursor="pointer";g.style.width="80px";g.style.opacity="0.9";g.style.zIndex="10001";g.addEventListener("click",function(){r++;r==t&&(r=0);k.style.display="none";f.style.display="none";h.style.display="none";switch(r){case 0:k.style.display="block";break;case 1:f.style.display="block";break;case 2:h.style.display="block"}},!1);k=document.createElement("div");k.style.backgroundColor="rgb("+Math.floor(b.fps.bg.r/2)+","+Math.floor(b.fps.bg.g/
	2)+","+Math.floor(b.fps.bg.b/2)+")";k.style.padding="2px 0px 3px 0px";g.appendChild(k);d=document.createElement("div");d.style.fontFamily="Helvetica, Arial, sans-serif";d.style.textAlign="left";d.style.fontSize="9px";d.style.color="rgb("+b.fps.fg.r+","+b.fps.fg.g+","+b.fps.fg.b+")";d.style.margin="0px 0px 1px 3px";d.innerHTML='<span style="font-weight:bold">FPS</span>';k.appendChild(d);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";k.appendChild(a);
	m=a.getContext("2d");m.fillStyle="rgb("+b.fps.bg.r+","+b.fps.bg.g+","+b.fps.bg.b+")";m.fillRect(0,0,a.width,a.height);y=m.getImageData(0,0,a.width,a.height);f=document.createElement("div");f.style.backgroundColor="rgb("+Math.floor(b.ms.bg.r/2)+","+Math.floor(b.ms.bg.g/2)+","+Math.floor(b.ms.bg.b/2)+")";f.style.padding="2px 0px 3px 0px";f.style.display="none";g.appendChild(f);c=document.createElement("div");c.style.fontFamily="Helvetica, Arial, sans-serif";c.style.textAlign="left";c.style.fontSize=
	"9px";c.style.color="rgb("+b.ms.fg.r+","+b.ms.fg.g+","+b.ms.fg.b+")";c.style.margin="0px 0px 1px 3px";c.innerHTML='<span style="font-weight:bold">MS</span>';f.appendChild(c);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";f.appendChild(a);o=a.getContext("2d");o.fillStyle="rgb("+b.ms.bg.r+","+b.ms.bg.g+","+b.ms.bg.b+")";o.fillRect(0,0,a.width,a.height);B=o.getImageData(0,0,a.width,a.height);try{performance&&performance.memory&&performance.memory.totalJSHeapSize&&
	(t=3)}catch(G){}h=document.createElement("div");h.style.backgroundColor="rgb("+Math.floor(b.mb.bg.r/2)+","+Math.floor(b.mb.bg.g/2)+","+Math.floor(b.mb.bg.b/2)+")";h.style.padding="2px 0px 3px 0px";h.style.display="none";g.appendChild(h);i=document.createElement("div");i.style.fontFamily="Helvetica, Arial, sans-serif";i.style.textAlign="left";i.style.fontSize="9px";i.style.color="rgb("+b.mb.fg.r+","+b.mb.fg.g+","+b.mb.fg.b+")";i.style.margin="0px 0px 1px 3px";i.innerHTML='<span style="font-weight:bold">MB</span>';
	h.appendChild(i);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";h.appendChild(a);q=a.getContext("2d");q.fillStyle="#301010";q.fillRect(0,0,a.width,a.height);E=q.getImageData(0,0,a.width,a.height);return{domElement:g,update:function(){u++;j=(new Date).getTime();n=j-F;z=Math.min(z,n);A=Math.max(A,n);s(B.data,Math.min(30,30-n/200*30),"ms");c.innerHTML='<span style="font-weight:bold">'+n+" MS</span> ("+z+"-"+A+")";o.putImageData(B,0,0);F=j;if(j>
	v+1E3){l=Math.round(u*1E3/(j-v));w=Math.min(w,l);x=Math.max(x,l);s(y.data,Math.min(30,30-l/100*30),"fps");d.innerHTML='<span style="font-weight:bold">'+l+" FPS</span> ("+w+"-"+x+")";m.putImageData(y,0,0);if(t==3)p=performance.memory.usedJSHeapSize*9.54E-7,C=Math.min(C,p),D=Math.max(D,p),s(E.data,Math.min(30,30-p/2),"mb"),i.innerHTML='<span style="font-weight:bold">'+Math.round(p)+" MB</span> ("+Math.round(C)+"-"+Math.round(D)+")",q.putImageData(E,0,0);v=j;u=0}}}};
	
	Constants={},Constants.PI=Math.PI,Constants.C_PR=Math.PI/180,Constants.VLEV=2,Constants.EPS=1e-7,Constants.c=.105,Constants.LN10=Math.log(10),Constants.PIOVER2=Math.PI/2,Constants.TWOPI=2*Math.PI,Constants.TWOTHIRD=2/3,Constants.ARCSECOND_RADIAN=484813681109536e-20,SpatialVector=function(){function t(t,s,i){"use strict";this.x=t,this.y=s,this.z=i,this.ra_=0,this.dec_=0,this.okRaDec_=!1}return t.prototype.setXYZ=function(t,s,i){this.x=t,this.y=s,this.z=i,this.okRaDec_=!1},t.prototype.length=function(){"use strict";return Math.sqrt(this.lengthSquared())},t.prototype.lengthSquared=function(){"use strict";return this.x*this.x+this.y*this.y+this.z*this.z},t.prototype.normalized=function(){"use strict";var t=this.length();this.x/=t,this.y/=t,this.z/=t},t.prototype.set=function(t,s){"use strict";this.ra_=t,this.dec_=s,this.okRaDec_=!0,this.updateXYZ()},t.prototype.angle=function(t){"use strict";var s=this.y*t.z-this.z*t.y,i=this.z*t.x-this.x*t.z,n=this.x*t.y-this.y*t.x,a=Math.sqrt(s*s+i*i+n*n);return Math.abs(Math.atan2(a,dot(t)))},t.prototype.get=function(){"use strict";return[x,y,z]},t.prototype.toString=function(){"use strict";return"SpatialVector["+this.x+", "+this.y+", "+this.z+"]"},t.prototype.cross=function(s){"use strict";return new t(this.y*s.z-s.y*this.z,this.z*s.x-s.z*this.x,this.x*s.y-s.x()*this.y)},t.prototype.equal=function(t){"use strict";return this.x==t.x&&this.y==t.y&&this.z==t.z()?!0:!1},t.prototype.mult=function(s){"use strict";return new t(s*this.x,s*this.y,s*this.z)},t.prototype.dot=function(t){"use strict";return this.x*t.x+this.y*t.y+this.z*t.z},t.prototype.add=function(s){"use strict";return new t(this.x+s.x,this.y+s.y,this.z+s.z)},t.prototype.sub=function(s){"use strict";return new t(this.x-s.x,this.y-s.y,this.z-s.z)},t.prototype.dec=function(){"use strict";return this.okRaDec_||(this.normalized(),this.updateRaDec()),this.dec_},t.prototype.ra=function(){"use strict";return this.okRaDec_||(this.normalized(),this.updateRaDec()),this.ra_},t.prototype.updateXYZ=function(){"use strict";var t=Math.cos(this.dec_*Constants.C_PR);this.x=Math.cos(this.ra_*Constants.C_PR)*t,this.y=Math.sin(this.ra_*Constants.C_PR)*t,this.z=Math.sin(this.dec_*Constants.C_PR)},t.prototype.updateRaDec=function(){"use strict";this.dec_=Math.asin(this.z)/Constants.C_PR;var t=Math.cos(this.dec_*Constants.C_PR);this.ra_=t>Constants.EPS||-Constants.EPS>t?this.y>Constants.EPS||this.y<-Constants.EPS?0>this.y?360-Math.acos(this.x/t)/Constants.C_PR:Math.acos(this.x/t)/Constants.C_PR:0>this.x?180:0:0,this.okRaDec_=!0},t.prototype.toRaRadians=function(){"use strict";var t=0;return(0!=this.x||0!=this.y)&&(t=Math.atan2(this.y,this.x)),0>t&&(t+=2*Math.PI),t},t.prototype.toDeRadians=function(){var t=z/this.length(),s=Math.acos(t);return Math.PI/2-s},t}(),AngularPosition=function(){return AngularPosition=function(t,s){"use strict";this.theta=t,this.phi=s},AngularPosition.prototype.toString=function(){"use strict";return"theta: "+this.theta+", phi: "+this.phi},AngularPosition}(),LongRangeSetBuilder=function(){function t(){this.items=[]}return t.prototype.appendRange=function(t,s){for(var i=t;s>=i;i++)i in this.items||this.items.push(i)},t}(),HealpixIndex=function(){function t(t){"use strict";this.nside=t}return t.NS_MAX=8192,t.ORDER_MAX=13,t.NSIDELIST=[1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192],t.JRLL=[2,2,2,2,3,3,3,3,4,4,4,4],t.JPLL=[1,3,5,7,0,2,4,6,1,3,5,7],t.XOFFSET=[-1,-1,0,1,1,1,0,-1],t.YOFFSET=[0,1,1,1,0,-1,-1,-1],t.FACEARRAY=[[8,9,10,11,-1,-1,-1,-1,10,11,8,9],[5,6,7,4,8,9,10,11,9,10,11,8],[-1,-1,-1,-1,5,6,7,4,-1,-1,-1,-1],[4,5,6,7,11,8,9,10,11,8,9,10],[0,1,2,3,4,5,6,7,8,9,10,11],[1,2,3,0,0,1,2,3,5,6,7,4],[-1,-1,-1,-1,7,4,5,6,-1,-1,-1,-1],[3,0,1,2,3,0,1,2,4,5,6,7],[2,3,0,1,-1,-1,-1,-1,0,1,2,3]],t.SWAPARRAY=[[0,0,0,0,0,0,0,0,3,3,3,3],[0,0,0,0,0,0,0,0,6,6,6,6],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,5,5,5,5],[0,0,0,0,0,0,0,0,0,0,0,0],[5,5,5,5,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[6,6,6,6,0,0,0,0,0,0,0,0],[3,3,3,3,0,0,0,0,0,0,0,0]],t.Z0=Constants.TWOTHIRD,t.prototype.init=function(){"use strict";var s=256;this.ctab=Array(s),this.utab=Array(s);for(var i=0;256>i;++i)this.ctab[i]=1&i|(2&i)<<7|(4&i)>>1|(8&i)<<6|(16&i)>>2|(32&i)<<5|(64&i)>>3|(128&i)<<4,this.utab[i]=1&i|(2&i)<<1|(4&i)<<2|(8&i)<<3|(16&i)<<4|(32&i)<<5|(64&i)<<6|(128&i)<<7;this.nl2=2*this.nside,this.nl3=3*this.nside,this.nl4=4*this.nside,this.npface=this.nside*this.nside,this.ncap=2*this.nside*(this.nside-1),this.npix=12*this.npface,this.fact2=4/this.npix,this.fact1=(this.nside<<1)*this.fact2,this.order=t.nside2order(this.nside)},t.calculateNSide=function(s){for(var i=0,n=s*s,a=180/Constants.PI,e=3600*3600*4*Constants.PI*a*a,h=Utils.castToInt(e/n),r=h/12,o=Math.sqrt(r),c=t.NS_MAX,u=0,p=0;t.NSIDELIST.length>p;p++)if(c>=Math.abs(o-t.NSIDELIST[p])&&(c=Math.abs(o-t.NSIDELIST[p]),i=t.NSIDELIST[p],u=p),o>i&&t.NS_MAX>o&&(i=t.NSIDELIST[u+1]),o>t.NS_MAX)return console.log("nside cannot be bigger than "+t.NS_MAX),t.NS_MAX;return i},t.nside2order=function(s){"use strict";return(s&s-1)>0?-1:Utils.castToInt(t.log2(s))},t.log2=function(t){"use strict";return Math.log(t)/Math.log(2)},t.prototype.ang2pix_nest=function(s,i){"use strict";var n,a,e,h,r,o,c,u,p,l,d,f,I;if(i>=Constants.TWOPI&&(i-=Constants.TWOPI),0>i&&(i+=Constants.TWOPI),s>Constants.PI||0>s)throw{name:"Illegal argument",message:"theta must be between 0 and "+Constants.PI};if(i>Constants.TWOPI||0>i)throw{name:"Illegal argument",message:"phi must be between 0 and "+Constants.TWOPI};if(a=Math.cos(s),e=Math.abs(a),h=i/Constants.PIOVER2,t.Z0>=e){var M=this.nside*(.5+h),y=this.nside*.75*a,u=M-y,p=M+y;o=u>>this.order,c=p>>this.order,d=o==c?4==o?4:o+4:c>o?o:c+8,f=Utils.castToInt(p&this.nside-1),I=Utils.castToInt(this.nside-(u&this.nside-1)-1)}else{l=Utils.castToInt(h),l>=4&&(l=3),r=h-l;var g=this.nside*Math.sqrt(3*(1-e));u=Utils.castToInt(r*g),p=Utils.castToInt((1-r)*g),u=Math.min(t.NS_MAX-1,u),p=Math.min(t.NS_MAX-1,p),a>=0?(d=l,f=Utils.castToInt(this.nside-p-1),I=Utils.castToInt(this.nside-u-1)):(d=l+8,f=u,I=p)}return n=this.xyf2nest(f,I,d)},t.prototype.xyf2nest=function(t,s,i){"use strict";return(i<<2*this.order)+(this.utab[255&t]|this.utab[255&t>>8]<<16|this.utab[255&t>>16]<<32|this.utab[255&t>>24]<<48|this.utab[255&s]<<1|this.utab[255&s>>8]<<17|this.utab[255&s>>16]<<33|this.utab[255&s>>24]<<49)},t.prototype.nest2xyf=function(t){"use strict";var s={};s.face_num=t>>2*this.order;var i=t&this.npface-1,n=(93823560581120&i)>>16|(614882086624428e4&i)>>31|21845&i|(1431633920&i)>>15;return s.ix=this.ctab[255&n]|this.ctab[255&n>>8]<<4|this.ctab[255&n>>16]<<16|this.ctab[255&n>>24]<<20,i>>=1,n=(93823560581120&i)>>16|(614882086624428e4&i)>>31|21845&i|(1431633920&i)>>15,s.iy=this.ctab[255&n]|this.ctab[255&n>>8]<<4|this.ctab[255&n>>16]<<16|this.ctab[255&n>>24]<<20,s},t.prototype.pix2ang_nest=function(s){"use strict";if(0>s||s>this.npix-1)throw{name:"Illegal argument",message:"ipix out of range"};var i,n,a,e=this.nest2xyf(s),h=e.ix,r=e.iy,o=e.face_num,c=(t.JRLL[o]<<this.order)-h-r-1;this.nside>c?(i=c,n=1-i*i*this.fact2,a=0):c>this.nl3?(i=this.nl4-c,n=i*i*this.fact2-1,a=0):(i=this.nside,n=(this.nl2-c)*this.fact1,a=1&c-this.nside);var u=Math.acos(n),p=(t.JPLL[o]*i+h-r+1+a)/2;p>this.nl4&&(p-=this.nl4),1>p&&(p+=this.nl4);var l=(p-.5*(a+1))*(Constants.PIOVER2/i);return{theta:u,phi:l}},t.nside2Npix=function(s){"use strict";if(0>s||(s&-s)!=s||s>t.NS_MAX)throw{name:"Illegal argument",message:"nside should be >0, power of 2, <"+t.NS_MAX};var i=12*s*s;return i},t.prototype.xyf2ring=function(s,i,n){"use strict";var a,e,h,r=t.JRLL[n]*this.nside-s-i-1;this.nside>r?(a=r,h=2*a*(a-1),e=0):r>3*this.nside?(a=this.nl4-r,h=this.npix-2*(a+1)*a,e=0):(a=this.nside,h=this.ncap+(r-this.nside)*this.nl4,e=1&r-this.nside);var o=(t.JPLL[n]*a+s-i+1+e)/2;return o>this.nl4?o-=this.nl4:1>o&&(o+=this.nl4),h+o-1},t.prototype.nest2ring=function(t){"use strict";var s=this.nest2xyf(t),i=this.xyf2ring(s.ix,s.iy,s.face_num);return i},t.prototype.corners_nest=function(t,s){"use strict";var i=this.nest2ring(t);return this.corners_ring(i,s)},t.prototype.pix2ang_ring=function(t){"use strict";var s,i,n,a,e,h,r,o,c;if(0>t||t>this.npix-1)throw{name:"Illegal argument",message:"ipix out of range"};return h=t+1,this.ncap>=h?(o=h/2,c=Utils.castToInt(o),n=Utils.castToInt(Math.sqrt(o-Math.sqrt(c)))+1,a=h-2*n*(n-1),s=Math.acos(1-n*n*this.fact2),i=(a-.5)*Constants.PI/(2*n)):this.npix-this.ncap>t?(e=t-this.ncap,n=e/this.nl4+this.nside,a=e%this.nl4+1,r=(1&n+this.nside)>0?1:.5,s=Math.acos((this.nl2-n)*this.fact1),i=(a-r)*Constants.PI/this.nl2):(e=this.npix-t,n=Utils.castToInt(.5*(1+Math.sqrt(2*e-1))),a=4*n+1-(e-2*n*(n-1)),s=Math.acos(-1+Math.pow(n,2)*this.fact2),i=(a-.5)*Constants.PI/(2*n)),[s,i]},t.prototype.ring=function(t){"use strict";var s,i,n=0,a=t+1,e=0;return this.ncap>=a?(i=a/2,e=Utils.castToInt(i),n=Utils.castToInt(Math.sqrt(i-Math.sqrt(e)))+1):this.nl2*(5*this.nside+1)>=a?(s=Utils.castToInt(a-this.ncap-1),n=Utils.castToInt(s/this.nl4+this.nside)):(s=this.npix-a+1,i=s/2,e=Utils.castToInt(i),n=Utils.castToInt(Math.sqrt(i-Math.sqrt(e)))+1,n=this.nl4-n),n},t.prototype.integration_limits_in_costh=function(t){"use strict";var s,i,n,a;return a=1*this.nside,this.nside>=t?(i=1-Math.pow(t,2)/3/this.npface,n=1-Math.pow(t-1,2)/3/this.npface,s=t==this.nside?2*(this.nside-1)/3/a:1-Math.pow(t+1,2)/3/this.npface):this.nl3>t?(i=2*(2*this.nside-t)/3/a,n=2*(2*this.nside-t+1)/3/a,s=2*(2*this.nside-t-1)/3/a):(n=t==this.nl3?2*(-this.nside+1)/3/a:-1+Math.pow(4*this.nside-t+1,2)/3/this.npface,s=-1+Math.pow(this.nl4-t-1,2)/3/this.npface,i=-1+Math.pow(this.nl4-t,2)/3/this.npface),[n,i,s]},t.prototype.pixel_boundaries=function(t,s,i,n){var a,e,h,r,o,c,u,p,l=1*this.nside;if(Math.abs(n)>=1-1/3/this.npface)return u=i*Constants.PIOVER2,p=(i+1)*Constants.PIOVER2,[u,p];if(1.5*n>=1)a=Math.sqrt(3*(1-n)),e=1/l/a,h=s,r=h-1,o=t-s,c=o+1,u=Constants.PIOVER2*(Math.max(r*e,1-c*e)+i),p=Constants.PIOVER2*(Math.min(1-o*e,h*e)+i);else if(1.5*n>-1){var d=.5*(1-1.5*n),f=d+1,I=this.nside+t%2;h=s-(I-t)/2,r=h-1,o=(I+t)/2-s,c=o+1,u=Constants.PIOVER2*(Math.max(f-c/l,-d+r/l)+i),p=Constants.PIOVER2*(Math.min(f-o/l,-d+h/l)+i)}else{a=Math.sqrt(3*(1+n)),e=1/l/a;var M=2*this.nside;h=t-M+s,r=h-1,o=M-s,c=o+1,u=Constants.PIOVER2*(Math.max(1-(M-r)*e,(M-c)*e)+i),p=Constants.PIOVER2*(Math.min(1-(M-h)*e,(M-o)*e)+i)}return[u,p]},t.vector=function(t,s){"use strict";var i=1*Math.sin(t)*Math.cos(s),n=1*Math.sin(t)*Math.sin(s),a=1*Math.cos(t);return new SpatialVector(i,n,a)},t.prototype.corners_ring=function(s,i){"use strict";var n=2*i+2,a=Array(n),e=this.pix2ang_ring(s),h=Math.cos(e[0]),r=e[0],o=e[1],c=Utils.castToInt(o/Constants.PIOVER2),u=this.ring(s),p=Math.min(u,Math.min(this.nside,this.nl4-u)),l=0,d=Constants.PIOVER2/p;l=u>=this.nside&&this.nl3>=u?Utils.castToInt(o/d+u%2/2)+1:Utils.castToInt(o/d)+1,l-=c*p;var f=n/2,I=this.integration_limits_in_costh(u),M=Math.acos(I[0]),y=Math.acos(I[2]),g=this.pixel_boundaries(u,l,c,I[0]);if(a[0]=l>p/2?t.vector(M,g[1]):t.vector(M,g[0]),g=this.pixel_boundaries(u,l,c,I[2]),a[f]=l>p/2?t.vector(y,g[1]):t.vector(y,g[0]),1==i){var P=Math.acos(I[1]);g=this.pixel_boundaries(u,l,c,I[1]),a[1]=t.vector(P,g[0]),a[3]=t.vector(P,g[1])}else for(var x=I[2]-I[0],C=x/(i+1),v=1;i>=v;v++)h=I[0]+C*v,r=Math.acos(h),g=this.pixel_boundaries(u,l,c,h),a[v]=t.vector(r,g[0]),a[n-v]=t.vector(r,g[1]);return a},t.vec2Ang=function(t){"use strict";var s=t.z/t.length(),i=Math.acos(s),n=0;return(0!=t.x||0!=t.y)&&(n=Math.atan2(t.y,t.x)),0>n&&(n+=2*Math.PI),[i,n]},t.prototype.queryDisc=function(s,i,n,a){"use strict";if(0>i||i>Constants.PI)throw{name:"Illegal argument",message:"angular radius is in RADIAN and should be in [0,pi]"};var e,h,r,o,c,u,p,l,d,f,I,M,y,g,P,x,C,v,_,R=new LongRangeSetBuilder,T=null,c=i;if(a&&(c+=Constants.PI/this.nl4),T=t.vec2Ang(s),u=T[0],p=T[1],I=this.fact2,M=this.fact1,o=Math.cos(u),_=1/Math.sqrt((1-o)*(1+o)),g=u-c,P=u+c,l=Math.cos(c),C=Math.cos(g),e=this.ringAbove(C)+1,x=Math.cos(P),h=this.ringAbove(x),e>h&&0==h&&(h=e),0>=g)for(var m=1;e>m;++m)this.inRing(m,0,Math.PI,R);for(r=e;h>=r;++r)v=this.nside>r?1-r*r*I:this.nl3>=r?(this.nl2-r)*M:-1+(this.nl4-r)*(this.nl4-r)*I,d=(l-v*o)*_,f=1-v*v-d*d,y=Math.atan2(Math.sqrt(f),d),isNaN(y)&&(y=c),this.inRing(r,p,y,R);if(P>=Math.PI)for(var m=h+1;this.nl4>m;++m)this.inRing(m,0,Math.PI,R,!1);var b;if(n){for(var S=R.items,U=[],A=0;S.length>A;A++){var O=this.ring2nest(S[A]);U.indexOf(O)>=0||U.push(O)}b=U}else b=R.items;return b},t.prototype.inRing=function(t,s,i,n,a){"use strict";var e,h,r,o,c=!1,u=!1,p=1e-12,l=0,d=0,f=0,I=0,M=(s-i)%Constants.TWOPI-p,y=s+i+p,g=(s+i)%Constants.TWOPI+p;if(p>Math.abs(i-Constants.PI)&&(c=!0),t>=this.nside&&this.nl3>=t?(d=t-this.nside+1,r=this.ncap+this.nl4*(d-1),o=r+this.nl4-1,e=d%2,h=this.nl4):(this.nside>t?(d=t,r=2*d*(d-1),o=r+4*d-1):(d=4*this.nside-t,r=this.npix-2*d*(d+1),o=r+4*d-1),h=4*d,e=1),c)return n.appendRange(r,o),void 0;if(l=e/2,a)f=Math.round(h*M/Constants.TWOPI-l),I=Math.round(h*y/Constants.TWOPI-l),f%=h,I>h&&(I%=h);else{if(f=Math.ceil(h*M/Constants.TWOPI-l),I=Utils.castToInt(h*g/Constants.TWOPI-l),f>I&&1==t&&(I=Utils.castToInt(h*y/Constants.TWOPI-l)),f==I+1&&(f=I),1==f-I&&Constants.PI>i*h)return console.log("the interval is too small and avay from center"),void 0;f=Math.min(f,h-1),I=Math.max(I,0)}if(f>I&&(u=!0),u)f+=r,I+=r,n.appendRange(r,I),n.appendRange(f,o);else{if(0>f)return f=Math.abs(f),n.appendRange(r,r+I),n.appendRange(o-f+1,o),void 0;f+=r,I+=r,n.appendRange(f,I)}},t.prototype.ringAbove=function(t){"use strict";var s=Math.abs(t);if(s>Constants.TWOTHIRD){var i=Utils.castToInt(this.nside*Math.sqrt(3*(1-s)));return t>0?i:4*this.nside-i-1}return Utils.castToInt(this.nside*(2-1.5*t))},t.prototype.ring2nest=function(t){"use strict";var s=this.ring2xyf(t);return this.xyf2nest(s.ix,s.iy,s.face_num)},t.prototype.ring2xyf=function(s){"use strict";var i,n,a,e,h={};if(this.ncap>s){i=Utils.castToInt(.5*(1+Math.sqrt(1+2*s))),n=s+1-2*i*(i-1),a=0,e=i,h.face_num=0;var r=n-1;r>=2*i&&(h.face_num=2,r-=2*i),r>=i&&++h.face_num}else if(this.npix-this.ncap>s){var o=s-this.ncap;this.order>=0?(i=(o>>this.order+2)+this.nside,n=(o&this.nl4-1)+1):(i=o/this.nl4+this.nside,n=o%this.nl4+1),a=1&i+this.nside,e=this.nside;var c,u,p=i-this.nside+1,l=this.nl2+2-p;this.order>=0?(c=n-Utils.castToInt(p/2)+this.nside-1>>this.order,u=n-Utils.castToInt(l/2)+this.nside-1>>this.order):(c=(n-Utils.castToInt(p/2)+this.nside-1)/this.nside,u=(n-Utils.castToInt(l/2)+this.nside-1)/this.nside),h.face_num=u==c?4==u?4:Utils.castToInt(u)+4:c>u?Utils.castToInt(u):Utils.castToInt(c)+8}else{var o=this.npix-s;i=Utils.castToInt(.5*(1+Math.sqrt(2*o-1))),n=4*i+1-(o-2*i*(i-1)),a=0,e=i,i=2*this.nl2-i,h.face_num=8;var r=n-1;r>=2*e&&(h.face_num=10,r-=2*e),r>=e&&++h.face_num}var d=i-t.JRLL[h.face_num]*this.nside+1,f=2*n-t.JPLL[h.face_num]*e-a-1;return f>=this.nl2&&(f-=8*this.nside),h.ix=f-d>>1,h.iy=-(f+d)>>1,h},t}(),Utils=function(){},Utils.radecToPolar=function(t,s){return{theta:Math.PI/2-s/180*Math.PI,phi:t/180*Math.PI}},Utils.polarToRadec=function(t,s){return{ra:180*s/Math.PI,dec:180*(Math.PI/2-t)/Math.PI}},Utils.castToInt=function(t){return t>0?Math.floor(t):Math.ceil(t)};//=================================
	//            AstroMath
	//=================================
	
	// Class AstroMath having 'static' methods
	function AstroMath() {}
	
	// Constant for conversion Degrees => Radians (rad = deg*AstroMath.D2R)
	AstroMath.D2R = Math.PI/180.0;
	// Constant for conversion Radians => Degrees (deg = rad*AstroMath.R2D)
	AstroMath.R2D = 180.0/Math.PI;
	/**
	 * Function sign
	 * @param x value for checking the sign
	 * @return -1, 0, +1 respectively if x < 0, = 0, > 0
	 */
	AstroMath.sign = function(x) { return x > 0 ? 1 : (x < 0 ? -1 : 0 ); };
	
	/**
	 * Function cosd(degrees)
	 * @param x angle in degrees
	 * @returns the cosine of the angle
	 */
	AstroMath.cosd = function(x) {
		if (x % 90 == 0) {
			var i = Math.abs(Math.floor(x / 90 + 0.5)) % 4;
			switch (i) {
				case 0:	return 1;
				case 1:	return 0;
				case 2:	return -1;
				case 3:	return 0;
			}
		}
		return Math.cos(x*AstroMath.D2R);
	};
	
	/**
	 * Function sind(degrees)
	 * @param x angle in degrees
	 * @returns the sine of the angle
	 */
	AstroMath.sind = function(x) {
		if (x % 90 === 0) {
			var i = Math.abs(Math.floor(x / 90 - 0.5)) % 4;
			switch (i) {
				case 0:	return 1;
				case 1:	return 0;
				case 2:	return -1;
				case 3:	return 0;
			}
		}
	
		return Math.sin(x*AstroMath.D2R);
	};
	
	/**
	 * Function tand(degrees)
	 * @param x angle in degrees
	 * @returns the tangent of the angle
	 */
	AstroMath.tand = function(x) {
		var resid;
	
		resid = x % 360;
		if (resid == 0 || Math.abs(resid) == 180) {
			return 0;
		} else if (resid == 45 || resid == 225) {
			return 1;
		} else if (resid == -135 || resid == -315) {
			return -1
		}
	
		return Math.tan(x * AstroMath.D2R);
	};
	
	/**
	 * Function asin(degrees)
	 * @param sine value [0,1]
	 * @return the angle in degrees
	 */
	AstroMath.asind = function(x) { return Math.asin(x)*AstroMath.R2D; };
	
	/**
	 * Function acos(degrees)
	 * @param cosine value [0,1]
	 * @return the angle in degrees
	 */
	AstroMath.acosd = function(x) { return Math.acos(x)*AstroMath.R2D; };
	
	/**
	 * Function atan(degrees)
	 * @param tangent value
	 * @return the angle in degrees
	 */
	AstroMath.atand = function(x) { return Math.atan(x)*AstroMath.R2D; };
	
	/**
	 * Function atan2(y,x)
	 * @param y y component of the vector
	 * @param x x component of the vector
	 * @return the angle in radians
	 */
	AstroMath.atan2 = function(y,x) {
		if (y != 0.0) {
			var sgny = AstroMath.sign(y);
			if (x != 0.0) {
				var phi = Math.atan(Math.abs(y/x));
				if (x > 0.0) return phi*sgny;
				else if (x < 0) return (Math.PI-phi)*sgny;
			} else return (Math.PI/2)*sgny;
		} else {
			return x > 0.0 ? 0.0 : (x < 0 ? Math.PI : 0.0/0.0);
		}
	}  
	
	/**
	 * Function atan2d(y,x)
	 * @param y y component of the vector
	 * @param x x component of the vector
	 * @return the angle in degrees
	 */
	AstroMath.atan2d = function(y,x) {
		return AstroMath.atan2(y,x)*AstroMath.R2D;
	}
	
	/*=========================================================================*/
	/**
	 * Computation of hyperbolic cosine
	 * @param x argument
	 */
	AstroMath.cosh = function(x) {
		return (Math.exp(x)+Math.exp(-x))/2;
	}
	
	/**
	 * Computation of hyperbolic sine
	 * @param x argument
	 */
	AstroMath.sinh = function(x) {
		return (Math.exp(x)-Math.exp(-x))/2;
	}
	
	/**
	 * Computation of hyperbolic tangent
	 * @param x argument
	 */
	AstroMath.tanh = function(x) {
		return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x));
	}
	
	/**
	 * Computation of Arg cosh
	 * @param x argument in degrees. Must be in the range [ 1, +infinity ]
	 */
	AstroMath.acosh = function(x) {
		return(Math.log(x+Math.sqrt(x*x-1.0)));
	}
	
	/**
	 * Computation of Arg sinh
	 * @param x argument in degrees
	 */
	AstroMath.asinh = function(x) {
		return(Math.log(x+Math.sqrt(x*x+1.0)));
	}
	
	/**
	 * Computation of Arg tanh
	 * @param x argument in degrees. Must be in the range ] -1, +1 [
	 */
	AstroMath.atanh = function(x) {
		return(0.5*Math.log((1.0+x)/(1.0-x)));
	}
	
	//=============================================================================
	//      Special Functions using trigonometry
	//=============================================================================
	/**
	 * Computation of sin(x)/x
	 *	@param x in degrees.
	 * For small arguments x <= 0.001, use approximation 
	 */
	AstroMath.sinc = function(x) {
		var ax = Math.abs(x);
		var y;
	
		if (ax <= 0.001) {
			ax *= ax;
			y = 1 - ax*(1.0-ax/20.0)/6.0;
		} else {
			y = Math.sin(ax)/ax;
		}
	
		return y;
	}
	
	/**
	 * Computes asin(x)/x
	 * @param x in degrees.
	 * For small arguments x <= 0.001, use an approximation
	 */
	AstroMath.asinc = function(x) {
		var ax = Math.abs(x);
		var y;
	
		if (ax <= 0.001) {
			ax *= ax; 
			y = 1 + ax*(6.0 + ax*(9.0/20.0))/6.0;
		} else {
			y = Math.asin(ax)/ax;	// ???? radians ???
		}
	
		return (y);
	}
	
	
	//=============================================================================
	/**
	 * Computes the hypotenuse of x and y
	 * @param x value
	 * @param y value
	 * @return sqrt(x*x+y*y)
	 */
	AstroMath.hypot = function(x,y) {
		return Math.sqrt(x*x+y*y);
	}
	
	/** Generate the rotation matrix from the Euler angles
	 * @param z	Euler angle
	 * @param theta	Euler angle
	 * @param zeta	Euler angles
	 * @return R [3][3]		the rotation matrix
	 * The rotation matrix is defined by:<pre>
	 *    R =      R_z(-z)      *        R_y(theta)     *     R_z(-zeta)
	 *   |cos.z -sin.z  0|   |cos.the  0 -sin.the|   |cos.zet -sin.zet 0|
	 * = |sin.z  cos.z  0| x |   0     1     0   | x |sin.zet  cos.zet 0|
	 *   |   0      0   1|   |sin.the  0  cos.the|   |   0        0    1|
	 * </pre>
	 */
	AstroMath.eulerMatrix = function(z, theta, zeta) {
		var R = new Array(3);
		R[0] = new Array(3);
		R[1] = new Array(3);
		R[2] = new Array(3);
		var cosdZ = AstroMath.cosd(z);
		var sindZ = AstroMath.sind(z);
		var cosdTheta = AstroMath.cosd(theta);
		var w = AstroMath.sind(theta) ;
		var cosdZeta = AstroMath.cosd(zeta);
		var sindZeta = AstroMath.sind(zeta);
	
		R[0][0] = cosdZeta*cosdTheta*cosdZ - sindZeta*sindZ;
		R[0][1] = -sindZeta*cosdTheta*cosdZ - cosdZeta*sindZ;
		R[0][2] = -w*cosdZ;
	
		R[1][0] = cosdZeta*cosdTheta*sindZ + sindZeta*cosdZ;
		R[1][1] = -sindZeta*cosdTheta*sindZ + cosdZeta*cosdZ;
		R[1][2] = -w*sindZ;
	
		R[2][0] = -w*cosdZeta;
		R[2][1] = -w*cosdZ;
		R[2][2] = cosdTheta;
		return R ;
	};
	
	
	AstroMath.displayMatrix = function(m) {
		// Number of rows
		var nbrows = m.length;
		// Max column count
		var nbcols = 0
		for (var i=0; i<nbrows; i++) {
			if (m[i].length > nbcols) nbcols = m[i].length;
		}
		var str = '<table>\n';
		for (var i=0; i<nbrows; i++) {
			str += '<tr>';
			for (var j=0; j<nbrows; j++) {
				str += '<td>';
				if (i < m[i].length)
					str += (m[i][j]).toString();
				str += '</td>';
			}
			str += '</td>\n';
		}
		str += '</table>\n';
	
		return str;
	}
	function Projection(lon0, lat0) {
		this.PROJECTION = Projection.PROJ_TAN;
		this.ROT = this.tr_oR(lon0, lat0);
	
	    this.longitudeIsReversed = false;
	}
	
	//var ROT;
	//var PROJECTION = Projection.PROJ_TAN;	// Default projection
	
	
	Projection.PROJ_TAN = 1;	/* Gnomonic projection*/
	Projection.PROJ_TAN2 = 2;	/* Stereographic projection*/
	Projection.PROJ_STG = 2;	
	Projection.PROJ_SIN = 3;	/* Orthographic		*/
	Projection.PROJ_SIN2 = 4;	/* Equal-area 		*/
	Projection.PROJ_ZEA = 4;	/* Zenithal Equal-area 	*/
	Projection.PROJ_ARC = 5;	/* For Schmidt plates	*/
	Projection.PROJ_SCHMIDT = 5;	/* For Schmidt plates	*/
	Projection.PROJ_AITOFF = 6;	/* Aitoff Projection	*/
	Projection.PROJ_AIT = 6;	/* Aitoff Projection	*/
	Projection.PROJ_GLS = 7;	/* Global Sin (Sanson)	*/
	Projection.PROJ_MERCATOR = 8;
	Projection.PROJ_MER = 8;	
	Projection.PROJ_LAM = 9;	/* Lambert Projection	*/
	Projection.PROJ_LAMBERT = 9;	
	Projection.PROJ_TSC = 10;	/* Tangent Sph. Cube	*/
	Projection.PROJ_QSC = 11;	/* QuadCube Sph. Cube	*/
	
	Projection.PROJ_LIST = [
		"Mercator",Projection.PROJ_MERCATOR,
		"Gnomonic",Projection.PROJ_TAN,
		"Stereographic",Projection.PROJ_TAN2,
		"Orthographic",Projection.PROJ_SIN,
		"Zenithal",Projection.PROJ_ZEA,
		"Schmidt",Projection.PROJ_SCHMIDT,
		"Aitoff",Projection.PROJ_AITOFF,
		"Lambert",Projection.PROJ_LAMBERT,
	//	"Tangential",Projection.PROJ_TSC,
	//	"Quadrilaterized",Projection.PROJ_QSC,
	];
	Projection.PROJ_NAME = [
		'-', 'Gnomonic', 'Stereographic', 'Orthographic', 'Equal-area', 'Schmidt plates',
		'Aitoff', 'Global sin', 'Mercator', 'Lambert'
	];
	
	Projection.prototype = { 
		
		/** Set the center of the projection
		 * 
		 * (ajout T. Boch, 19/02/2013)
		 * 
		 * */
		setCenter: function(lon0, lat0) {
			this.ROT = this.tr_oR(lon0, lat0);
		},
	
	    /** Reverse the longitude
	      * If set to true, longitudes will increase from left to right
	      *
	      * */
	    reverseLongitude: function(b) {
	        this.longitudeIsReversed = b;
	    },
		
		/**
		 * Set the projection to use
		 * p = projection code
		 */
		setProjection: function(p) {
			this.PROJECTION = p;
		},
	
	
		/**
		 * Computes the projection of 1 point : ra,dec => X,Y
		 * alpha, delta = longitude, lattitude
		 */
		project: function(alpha, delta) {
	        var u1 = this.tr_ou(alpha, delta);	// u1[3]
			var u2 = this.tr_uu(u1, this.ROT);	// u2[3]
			var P = this.tr_up(this.PROJECTION, u2);	// P[2] = [X,Y]
			if (P == null) {
				return null;
			}
	
			if( this.longitudeIsReversed) {
	            return { X: P[0], Y: -P[1] };
	        }
	        else {
			    return { X: -P[0], Y: -P[1] };
	        }
	        //return { X: -P[0], Y: -P[1] };
		},
	
		/**
		 * Computes the coordinates from a projection point : X,Y => ra,dec
		 * return o = [ ra, dec ]
		 */
		unproject: function(X,Y) {
			if ( ! this.longitudeIsReversed) {
	            X = -X;
	        }
			Y = -Y;
			var u1 = this.tr_pu(this.PROJECTION, X, Y);	// u1[3]
			var u2 = this.tr_uu1(u1, this.ROT);	// u2[3]
			var o = this.tr_uo(u2);	// o[2]
	
	/*
			if (this.longitudeIsReversed) {
	            return { ra: 360-o[0], dec: o[1] };
	        }
	        else {
			    return { ra: o[0], dec: o[1] };
	        }
	*/
	        return { ra: o[0], dec: o[1] };
		},
	
		/**
		 * Compute projections from unit vector
		 * The center of the projection correspond to u = [1, 0, 0)
		 * proj = projection system (integer code like _PROJ_MERCATOR_
		 * u[3] = unit vector
		 * return: an array [x,y] or null
		 */
		tr_up: function(proj, u) {
			var x = u[0]; var y = u[1]; var z = u[2];
			var r, den;
			var pp;
			var X,Y;
	
			r = AstroMath.hypot(x,y);			// r = cos b
			if (r == 0.0 && z == 0.0) return null;
	
			switch(proj) {
				default:
					pp = null;
					break;
	
				case Projection.PROJ_AITOFF:
					den = Math.sqrt(r*(r+x)/2.0); 		// cos b . cos l/2
					X = Math.sqrt(2.0*r*(r-x));
					den = Math.sqrt((1.0 + den)/2.0); 
					X = X / den;
					Y = z / den;
					if (y < 0.0) X = -X;
					pp = [ X, Y];
					break;
	
				case Projection.PROJ_GLS:
					Y = Math.asin(z);				// sin b
					X = (r != 0) ? Math.atan2(y,x)*r : 0.0;
					pp = [ X, Y];
					break;
	
				case Projection.PROJ_MERCATOR:
					if (r != 0) {
						X = Math.atan2(y,x);
						Y = AstroMath.atanh(z);
						pp = [ X, Y];
					} else {
						pp = null;
					}
					break;
	
				case Projection.PROJ_TAN:
					if (x > 0.0) {
						X = y/x;
						Y = z/x;
						pp = [ X, Y ];
					} else {
						pp = null;
					}
					break;
	
				case Projection.PROJ_TAN2:
					den = (1.0 + x)/2.0;
					if (den > 0.0)	{
						X = y/den;
						Y = z/den;
						pp = [ X, Y ];
					} else {
						pp = null;
					}
				 	break;
	
				case Projection.PROJ_ARC:
					if (x <= -1.0) {
						// Distance of 180 degrees
						X = Math.PI
						Y = 0.0;
					} else {
						// Arccos(x) = Arcsin(r)
						r = AstroMath.hypot(y,z);
						if (x > 0.0) den = AstroMath.asinc(r);
						else den = Math.acos(x)/r;
						X = y * den;
						Y = z * den;
					}
					pp = [ X, Y ];
					break;
	
				case Projection.PROJ_SIN:
					if (x >= 0.0) {
						X = y;
						Y = z;
						pp = [ X, Y ];
					} else {
						pp = null;
					}
					break;
	
				case Projection.PROJ_SIN2:	// Always possible
					den = Math.sqrt((1.0 + x)/2.0);
					if (den != 0)	{
						X = y / den;
						Y = z / den;
					} else {
						// For x = -1
						X = 2.0;
						Y = 0.0;
					}
					pp = [ X, Y ];
					break;
	
				case Projection.PROJ_LAMBERT:	// Always possible
					Y = z;
					X = 0;
					if (r != 0)	X = Math.atan2(y,x);
					pp = [ X, Y ];
					break;
		  }
		  return pp;
		},
	
		/**
		 * Computes Unit vector from a position in projection centered at position (0,0).
		 * proj = projection code
		 * X,Y : coordinates of the point in the projection
		 * returns : the unit vector u[3] or a face number for cube projection. 
		 *           null if the point is outside the limits, or if the projection is unknown.
		 */
		tr_pu: function( proj, X, Y ) {
			var r,s,x,y,z;
	
			switch(proj) {
				default:
				return null;
	
				case Projection.PROJ_AITOFF:
					// Limit is ellipse with axises 
					// a = 2 * sqrt(2) ,  b = sqrt(2)
					// Compute dir l/2, b
					r = X*X/8.e0 + Y*Y/2.e0; 	// 1 - cos b . cos l/2
					if (r > 1.0) {
		  				// Test outside domain */
						return null;
					}
					x = 1.0 - r ;	// cos b . cos l/2
					s = Math.sqrt(1.0 - r/2.0) ;	// sqrt(( 1 + cos b . cos l/2)/2)
					y = X * s / 2.0;
					z = Y * s ;
					// From (l/2,b) to (l,b)
					r = AstroMath.hypot( x, y ) ;	// cos b
					if (r != 0.0) {
						s = x;
						x = (s*s - y*y) /r;
						y = 2.0 * s * y/r;
					}
					break;
	
				case Projection.PROJ_GLS:
					// Limit is |Y| <= pi/2
					z = Math.sin(Y);
					r = 1 - z*z;		// cos(b) ** 2
					if (r < 0.0) {
						return null;
					}
					r = Math.sqrt(r);		// cos b
					if (r != 0.0) {
						s = X/r;	// Longitude
					} else {
						s = 0.0;	// For poles
					}
					x = r * Math.cos(s);
					y = r * Math.sin(s);
					break;
	
				case Projection.PROJ_MERCATOR:
					z = AstroMath.tanh(Y);
					r = 1.0/AstroMath.cosh(Y);
					x = r * Math.cos(X);
					y = r * Math.sin(X);
					break;
	
				case Projection.PROJ_LAMBERT:
					// Always possible
					z = Y;
					r = 1 - z*z;		// cos(b) ** 2
					if (r < 0.0) {
						return null;
					}
					r = Math.sqrt(r);		// cos b
					x = r * Math.cos(X);
					y = r * Math.sin(X);
					break;
		
				case Projection.PROJ_TAN:
					// No limit
					x = 1.0 / Math.sqrt(1.0 + X*X + Y*Y);
					y = X * x;
					z = Y * x;
					break;
	
				case Projection.PROJ_TAN2:
					// No limit
					r = (X*X + Y*Y)/4.0;
					s = 1.0 + r;
					x = (1.0 - r)/s;
					y = X / s;
					z = Y / s;
					break;
	
				case Projection.PROJ_ARC:
					// Limit is circle, radius PI
					r = AstroMath.hypot(X, Y);
					if (r > Math.PI) {
						return null;
					}
					s = AstroMath.sinc(r);
					x = Math.cos(r);
					y = s * X;
					z = s * Y;
					break;
	
				case Projection.PROJ_SIN:
					// Limit is circle, radius 1
					s = 1.0 - X*X - Y*Y;
					if (s < 0.0) {
						return null;
					}
					x = Math.sqrt(s);
					y = X;
					z = Y;
					break;
	
				case Projection.PROJ_SIN2:
					// Limit is circle, radius 2	*/
					r = (X*X + Y*Y)/4.e0;
					if (r > 1.0) {
						return null;
					}
					s = Math.sqrt(1.0 - r);
					x = 1.0 - 2.0 * r;
					y = s * X;
					z = s * Y;
					break;
		  }
		  return [ x,y,z ];
		},
	
		/**
		 * Creates the rotation matrix R[3][3] defined as
		 * R[0] (first row) = unit vector towards Zenith
		 * R[1] (second row) = unit vector towards East
		 * R[2] (third row) = unit vector towards North
		 * o[2] original angles
		 * @return rotation matrix
		 */
		tr_oR: function(lon, lat) {
			var R = new Array(3);
			R[0] = new Array(3);
			R[1] = new Array(3);
			R[2] = new Array(3);
			R[2][2] =  AstroMath.cosd(lat);
			R[0][2] =  AstroMath.sind(lat);
			R[1][1] =  AstroMath.cosd(lon);
			R[1][0] =  -AstroMath.sind(lon);
			R[1][2] =  0.0;
			R[0][0] =  R[2][2] * R[1][1];  
			R[0][1] = -R[2][2] * R[1][0];
			R[2][0] = -R[0][2] * R[1][1];
			R[2][1] =  R[0][2] * R[1][0];
			return R;
		},
	
		/**
		 * Transformation from polar coordinates to Unit vector
		 * @return U[3]
		 */
		tr_ou: function(ra, dec) {
			var u = new Array(3);
			var cosdec = AstroMath.cosd(dec);
	
			u[0] = cosdec * AstroMath.cosd(ra);
			u[1] = cosdec * AstroMath.sind(ra);
			u[2] = AstroMath.sind(dec);
	
			return u;
		},
	
		/**
		 * Rotates the unit vector u1 using the rotation matrix
		 * u1[3] unit vector
		 * R[3][3] rotation matrix
		 * return resulting unit vector u2[3]
		 */
		tr_uu: function( u1, R ) {
			var u2 = new Array(3);
			var x = u1[0];
			var y = u1[1];
			var z = u1[2];
	
			u2[0] = R[0][0]*x + R[0][1]*y + R[0][2]*z ;
			u2[1] = R[1][0]*x + R[1][1]*y + R[1][2]*z ;
			u2[2] = R[2][0]*x + R[2][1]*y + R[2][2]*z ;
	
			return u2;
		},
	
		/**
		 * reverse rotation the unit vector u1 using the rotation matrix
		 * u1[3] unit vector
		 * R[3][3] rotation matrix
		 * return resulting unit vector u2[3]
		 */
		tr_uu1: function( u1 , R) {
			var u2 = new Array(3);
			var x = u1[0];
			var y = u1[1];
			var z = u1[2];
	
			u2[0] = R[0][0]*x + R[1][0]*y + R[2][0]*z;
			u2[1] = R[0][1]*x + R[1][1]*y + R[2][1]*z;
			u2[2] = R[0][2]*x + R[1][2]*y + R[2][2]*z;
	
			return u2;
		},
	
		/**
		 * Computes angles from direction cosines
		 * u[3] = direction cosines vector
		 * return o = [ ra, dec ]
		 */
		tr_uo: function(u) {
			var x = u[0]; var y = u[1]; var z = u[2];  
			var r2 = x*x + y*y;
			var ra, dec;
			if (r2  == 0.0) {
		 		// in case of poles
				if (z == 0.0) {
					return null;
				}
				ra = 0.0;
				dec = z > 0.0 ? 90.0 : -90.0;
			} else {
				dec = AstroMath.atand( z / Math.sqrt(r2));
				ra  = AstroMath.atan2d (y , x );
				if (ra < 0.0) ra += 360.0;
			}
	
			return [ ra, dec ];
		}
	}
	//=================================
	// Class Coo
	//=================================
	
	/**
	 * Constructor
	 * @param longitude longitude (decimal degrees)
	 * @param latitude latitude (decimal degrees)
	 * @param prec precision
	 * (8: 1/1000th sec, 7: 1/100th sec, 6: 1/10th sec, 5: sec, 4: 1/10th min, 3: min, 2: 1/10th deg, 1: deg
	 */
	function Coo(longitude, latitude, prec) {
		this.lon = longitude;
		this.lat = latitude;
		this.prec = prec;
		this.frame = null;
	
		this.computeDirCos();
	}
	
	Coo.factor = [ 3600.0, 60.0, 1.0 ];
	Coo.prototype = {
		setFrame: function(astroframe) {
			this.frame = astroframe;
		},
		computeDirCos: function() {
			var coslat = AstroMath.cosd(this.lat);
	
			this.x = coslat*AstroMath.cosd(this.lon);
			this.y = coslat*AstroMath.sind(this.lon);
			this.z = AstroMath.sind(this.lat);	
		}, 
		computeLonLat: function() {
			var r2 = this.x*this.x+this.y*this.y;
			this.lon = 0.0;
			if (r2 == 0.0) {
				// In case of poles
				if (this.z == 0.0) {
					this.lon = 0.0/0.0;
					this.lat = 0.0/0.0;
				} else {
					this.lat = (this.z > 0.0) ? 90.0 : -90.0;
				}
			} else {
				this.lon = AstroMath.atan2d(this.y, this.x);
				this.lat = AstroMath.atan2d(this.z, Math.sqrt(r2));
				if (this.lon < 0) this.lon += 360.0;
			}
		},
	
	  /**
	    * Squared distance between 2 points (= 4.sin<sup>2</sup>(r/2))
	    * @param  pos      another position on the sphere
	    * @return ||pos-this||<sup>2</sup> = 4.sin<sup>2</sup>(r/2)
	   **/
	   dist2: function(pos) {
	//    	if ((this.x==0)&&(this.y==0)&&(this.z==0)) return(0./0.);
	//    	if ((pos.x==0)&&(pos.y==0)&&(pos.z==0)) return(0./0.);
		var w = pos.x - this.x;
		var r2 = w * w;
		w = pos.y - this.y; r2 += w * w;
		w = pos.z - this.z; r2 += w * w;
		return r2;
	   },
	
	   /**
	    * Distance between 2 points on the sphere.
	    * @param  pos another position on the sphere
	    * @return distance in degrees in range [0, 180]
	   **/
	    distance: function(pos) {
	      // Take care of NaN:
	    	if ((pos.x==0)&&(pos.y==0)&&(pos.z==0)) return(0./0.);
	    	if ((this.x==0)&&(this.y==0)&&(this.z==0)) return(0./0.);
	      return (2. * AstroMath.asind(0.5 * Math.sqrt(this.dist2(pos))));
	    },
	
	   /**
	    * Transform the position into another frame.
	    * @param new_frame	The frame of the resulting position.
	   **/
	   convertTo: function(new_frame) {
			// Verify first if frames identical -- then nothing to do !
			if (this.frame.equals(new_frame)) {
		    		return;
			}
	
			// Move via ICRS
			this.frame.toICRS(this.coo);	// Position now in ICRS
			new_frame.fromICRS(this.coo);	// Position now in new_frame
			this.frame = new_frame;
			this.lon = this.lat = 0./0.;	// Actual angles not recomputed
	   },
	
	    /**
	     * Rotate a coordinate (apply a rotation to the position).
	     * @param R [3][3] Rotation Matrix
	     */
	    rotate: function(R) {
	      var X, Y, Z;
			if (R == Umatrix3) return;
			X = R[0][0]*this.x + R[0][1]*this.y + R[0][2]*this.z;
			Y = R[1][0]*this.x + R[1][1]*this.y + R[1][2]*this.z;
			Z = R[2][0]*this.x + R[2][1]*this.y + R[2][2]*this.z;
	    	// this.set(X, Y, Z); Not necessary to compute positions each time.
			this.x = X; this.y = Y; this.z = Z;
			this.lon = this.lat = 0./0.;
	    },
	
	    /**
	     * Rotate a coordinate (apply a rotation to the position) in reverse direction.
	     * The method is the inverse of rotate.
	     * @param R [3][3] Rotation Matrix
	     */
	    rotate_1: function(R) {
	      var X, Y, Z;
	      if (R == Umatrix3) return;
			X = R[0][0]*this.x + R[1][0]*this.y + R[2][0]*this.z;
			Y = R[0][1]*this.x + R[1][1]*this.y + R[2][1]*this.z;
			Z = R[0][2]*this.x + R[1][2]*this.y + R[2][2]*this.z;
	    	// this.set(X, Y, Z); Not necessary to compute positions each time.
			this.x = X; this.y = Y; this.z = Z;
			this.lon = this.lat = 0./0.;
	    },
	
	
	    /**
	     * Test equality of Coo.
	     * @param coo Second coordinate to compare with
	     * @return  True if the two coordinates are equal
	     */
	    equals: function(coo) {
			return this.x == coo.x && this.y == coo.y && this.z == coo.z;
	    },
	
		/**
		 * parse a coordinate string. The coordinates can be in decimal or sexagesimal
		 * @param str string to parse
		 * @return true if the parsing succeded, false otherwise
		 */
		parse: function(str) {
			var p = str.indexOf('+');
			if (p < 0) p = str.indexOf('-');
			if (p < 0) p = str.indexOf(' ');
			if (p < 0) {
				this.lon = 0.0/0.0;
				this.lat = 0.0/0.0;
				this.prec = 0;
				return false;
			}
			var strlon = str.substring(0,p);
			var strlat = str.substring(p);
		
			this.lon = this.parseLon(strlon);	// sets the precision parameter
			this.lat = this.parseLat(strlat);	// sets the precision parameter
			return true;
		},
	
		parseLon: function(str) {
			var str = str.trim();
	        str = str.replace(/:/g, ' ');
	
			if (str.indexOf(' ') < 0) {
				// The longitude is a integer or decimal number
				var p = str.indexOf('.');
				this.prec = p < 0 ? 0 : str.length - p - 1;
				return parseFloat(str);
			} else {
				var stok = new Tokenizer(str,' ');
				var i = 0;
				var l = 0;
				var pr = 0;
				while (stok.hasMore()) {
					var tok = stok.nextToken();
					var dec = tok.indexOf('.');
					l += parseFloat(tok)*Coo.factor[i];
	//				pr = dec < 0 ? 1 : 2;
					switch (i) {
						case 0: pr = dec < 0 ? 1 : 2; break;
						case 1: pr = dec < 0 ? 3 : 4; break;
						case 2: pr = dec < 0 ? 5 : 4+tok.length-dec;
						default: break;
					}
					i++;
				}
				this.prec = pr;
				return l*15/3600.0;	
			}
		},
				
		parseLat: function(str) {
			var str = str.trim();
	        str = str.replace(/:/g, ' ');
	
			var sign;
			if (str.charAt(0) == '-') {
				sign = -1;
				str = str.substring(1);
			} else if (str.charAt(0) == '-') {
				sign = 1;
				str = str.substring(1);
			} else {
				// No sign specified
				sign = 1;
			}
			if (str.indexOf(' ') < 0) {
				// The longitude is a integer or decimal number
				var p = str.indexOf('.');
				this.prec = p < 0 ? 0 : str.length - p - 1;
				return parseFloat(str)*sign;
			} else {
				var stok = new Tokenizer(str,' ');
				var i = 0;
				var l = 0;
				var pr = 0;
				while (stok.hasMore()) {
					var tok = stok.nextToken();
					var dec = tok.indexOf('.');
					l += parseFloat(tok)*Coo.factor[i];
					switch (i) {
						case 0: pr = dec < 0 ? 1 : 2; break;
						case 1: pr = dec < 0 ? 3 : 4; break;
						case 2: pr = dec < 0 ? 5 : 4+tok.length-dec;
						default: break;
					}
					i++;
				}
				this.prec = pr;
				return l*sign/3600.0;	
			}
		},
	
		/**
		 * Format coordinates according to the options
		 * @param options 'd': decimal, 's': sexagésimal, '/': space separated, '2': return [ra,dec] in an array
		 * @return the formatted coordinates
		 */
		format: function(options) {
			if (isNaN(this.lon)) this.computeLonLat();
			var strlon = "", strlat = "";
			if (options.indexOf('d') >= 0) {
				// decimal display
				strlon = Numbers.format(this.lon, this.prec);
				strlat = Numbers.format(this.lat, this.prec);
			} else {
				// sexagesimal display
				var hlon = this.lon/15.0;
				var strlon = Numbers.toSexagesimal(hlon, this.prec+1, false);
				var strlat = Numbers.toSexagesimal(this.lat, this.prec, false);
			}
			if (this.lat > 0) strlat = '+'+strlat;
	
			if (options.indexOf('/') >= 0) {
				return strlon+' '+strlat;
			} else if (options.indexOf('2') >= 0) {
				return [strlon, strlat];
			}
			return strlon+strlat;
		}
			
	}
	
	/**
	 * Distance between 2 points on the sphere.
	 * @param coo1 firs	var coslat = AstroMath.cosd(this.lat);
	
		this.x = coslat*AstroMath.cosd(this.lon);
		this.y = coslat*AstroMath.sind(this.lon);
		this.z = AstroMath.sind(this.lat);
	t coordinates point
	 * @param coo2 second coordinates point
	 * @return distance in degrees in range [0, 180]
	**/
	/*
	Coo.distance = function(Coo coo1, Coo coo2) {
		return Coo.distance(coo1.lon, coo1.lat, coo2.lon, coo2.lat);
	}
	*/
	/**
	 * Distance between 2 points on the sphere.
	 * @param lon1 longitude of first point in degrees
	 * @param lat1 latitude of first point in degrees
	 * @param lon2 longitude of second point in degrees
	 * @param lat2 latitude of second point in degrees
	 * @return distance in degrees in range [0, 180]
	**/
	/*
	Coo.distance = function(lon1, lat1, lon2, lat2) {
		var c1 = AstroMath.cosd(lat1);
		var c2 = AstroMath.cosd(lat2);
	
		var w, r2;
		w = c1 * AstroMath.cosd(lon1) - c2 * AstroMath.cosd(lon2);
		r2 = w*w;
		w = c1 * AstroMath.sind(lon1) - c2 * AstroMath.sind(lon2);
		r2 += w*w;
		w = AstroMath.sind(lat1) - AstroMath.sind(lat2);
		r2 += w*w;
	
		return 2. * AstroMath.asind(0.5 * Math.sqrt(r2));
	}
	
	
	//===================================
	// Class Tokenizer (similar to Java)
	//===================================
	
	/**
	 * Constructor
	 * @param str String to tokenize
	 * @param sep token separator char
	 */
	function Tokenizer(str, sep) {
		this.string = Strings.trim(str, sep);
		this.sep = sep;
		this.pos = 0;
	}
	
	Tokenizer.prototype = {
		/**
		 * Check if the string has more tokens
		 * @return true if a token remains (read with nextToken())
		 */
		hasMore: function() {
			return this.pos < this.string.length;
		},
	
		/**
		 * Returns the next token (as long as hasMore() is true)
		 * @return the token string
		 */
		nextToken: function() {
			// skip all the separator chars
			var p0 = this.pos;
			while (p0 < this.string.length && this.string.charAt(p0) == this.sep) p0++;
			var p1 = p0;
			// get the token
			while (p1 < this.string.length && this.string.charAt(p1) != this.sep) p1++;
			this.pos = p1;
			return this.string.substring(p0, p1);
		},
	}
	
	//================================
	// Class Strings (static methods)
	//================================
	function Strings() {}
	
	/**
	 * Removes a given char at the beginning and the end of a string
	 * @param str string to trim
	 * @param c char to remove
	 * @return the trimmed string
	 */
	
	Strings.trim = function(str, c) {
		var p0=0, p1=str.length-1;
		while (p0 < str.length && str.charAt(p0) == c) p0++;
		if (p0 == str.length) return "";
		while (p1 > p0 && str.charAt(p1) == c) p1--;
		return str.substring(p0, p1+1);
	}
	
	//================================
	// Class Numbers (static methods)
	//================================
	function Numbers() {}
	//                0  1   2    3     4      5       6        7         8          9
	Numbers.pow10 = [ 1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
	//      10           11            12             13              14
		10000000000, 100000000000, 1000000000000, 10000000000000, 100000000000000 ];
	//                 0    1     2      3       4        5         6          7
	Numbers.rndval = [ 0.5, 0.05, 0.005, 0.0005, 0.00005, 0.000005, 0.0000005, 0.00000005,
	//      8            9             10             11              12
		0.000000005, 0.0000000005, 0.00000000005, 0.000000000005, 0.0000000000005,
	//      13                14
		0.00000000000005, 0.00000000000005 ];
	/**
	 * Format a integer or decimal number, adjusting the value with 'prec' decimal digits
	 * @param num number (integer or decimal)
	 * @param prec precision (= number of decimal digit to keep or append)
	 * @return a string with the formatted number
	 */
	Numbers.format = function(num, prec) {
			if (prec <= 0) {
				// Return an integer number
				return (Math.round(num)).toString();
			}
			var str = num.toString();
			var p = str.indexOf('.');
			var nbdec = p >= 0 ? str.length-p-1 : 0;
			if (prec >= nbdec) {
				if (p < 0) str += '.';
				for (var i=0; i<prec-nbdec; i++)
					str += '0';
				return str;
			}
			// HERE: prec > 0 and prec < nbdec
			str = (num+Numbers.rndval[prec]).toString();
			return str.substr(0, p+prec+1);
	}
	
	
	/**
	 * Convert a decimal coordinate into sexagesimal string, according to the given precision<br>
	 * 8: 1/1000th sec, 7: 1/100th sec, 6: 1/10th sec, 5: sec, 4: 1/10th min, 3: min, 2: 1/10th deg, 1: deg
	 * @param num number (integer or decimal)
	 * @param prec precision (= number of decimal digit to keep or append)
	 * @param plus if true, the '+' sign is displayed
	 * @return a string with the formatted sexagesimal number
	 */
	Numbers.toSexagesimal = function(num, prec, plus) {
		var resu = "";
		var sign = num < 0 ? '-' : (plus ? '+' : '');
		var n = Math.abs(num);
	
		switch (prec) {
			case 1:	// deg
				var n1 = Math.round(n);
				return sign+n1.toString();
			case 2:	// deg.d
				return sign+Numbers.format(n, 1);
			case 3:	// deg min
				var n1 = Math.floor(n);
				var n2 = Math.round((n-n1)*60);
				return sign+n1+' '+n2;
			case 4:	// deg min.d
				var n1 = Math.floor(n);
				var n2 = (n-n1)*60;
				return sign+n1+' '+Numbers.format(n2, 1);
			case 5:	// deg min sec
				var n1 = Math.floor(n);	// d
				var n2 = (n-n1)*60;		// M.d
				var n3 = Math.floor(n2);// M
				var n4 = Math.round((n2-n3)*60);	// S
				return sign+n1+' '+n3+' '+n4;
			case 6:	// deg min sec.d
			case 7:	// deg min sec.dd
			case 8:	// deg min sec.ddd
				var n1 = Math.floor(n);	// d
				if (n1<10) n1 = '0' + n1;
				var n2 = (n-n1)*60;		// M.d
				var n3 = Math.floor(n2);// M
				if (n3<10) n3 = '0' + n3;
				var n4 = (n2-n3)*60;		// S.ddd
				return sign+n1+' '+n3+' '+Numbers.format(n4, prec-5);
			default:
				return sign+Numbers.format(n, 1);
		}
	}
	// Copyright 2018 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File SimbadPointer.js
	 *
	 * The SIMBAD pointer will query Simbad for a given position and radius and
	 * return information on the object with 
	 *  
	 * Author: Thomas Boch [CDS]
	 * 
	 *****************************************************************************/
	
	SimbadPointer = (function() {
	    
	    
	    SimbadPointer = {};
	
	    SimbadPointer.MIRRORS = ['//alasky.u-strasbg.fr/cgi/simbad-flat/simbad-quick.py', '//alaskybis.u-strasbg.fr/cgi/simbad-flat/simbad-quick.py']; // list of base URL for Simbad pointer service
	
	    
	    SimbadPointer.query = function(ra, dec, radiusDegrees, aladinInstance) {
	        var coo = new Coo(ra, dec, 7);
	        var params = {Ident: coo.format('s/'), SR: radiusDegrees}
	        var successCallback = function(result) {
	            aladinInstance.view.setCursor('pointer');
	
	            var regexp = /(.*?)\/(.*?)\((.*?),(.*?)\)/g;
	            var match = regexp.exec(result);
	            if (match) {
	                var objCoo = new Coo();
	                objCoo.parse(match[1]);
	                var objName = match[2];
	                var title = '<div class="aladin-sp-title"><a target="_blank" href="http://simbad.u-strasbg.fr/simbad/sim-id?Ident=' + encodeURIComponent(objName) + '">' + objName + '</a></div>';
	                var content = '<div class="aladin-sp-content">';
	                content += '<em>Type: </em>' + match[4] + '<br>';
	                var magnitude = match[3];
	                if (Utils.isNumber(magnitude)) {
	                    content += '<em>Mag: </em>' + magnitude + '<br>';
	                }
	                content += '<br><a target="_blank" href="http://cdsportal.u-strasbg.fr/?target=' + encodeURIComponent(objName) + '">Query in CDS portal</a>';
	                content += '</div>';
	                aladinInstance.showPopup(objCoo.lon, objCoo.lat, title, content);
	            }
	            else {
	                aladinInstance.hidePopup();
	            }
	        };
	        var failureCallback = function() {
	            aladinInstance.view.setCursor('pointer');
	            aladinInstance.hidePopup();
	        };
	        Utils.loadFromMirrors(SimbadPointer.MIRRORS, {data: params, onSuccess: successCallback, onFailure: failureCallback, timeout: 5});
	
	    };
	
	    return SimbadPointer;
	})();
	    
	// Copyright 2013-2017 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Box
	 *
	 * A Box instance is a GUI element providing a div nested
	 * in Aladin Lite parent div
	 * 
	 * Author: Thomas Boch [CDS]
	 * 
	 *****************************************************************************/
	Box = (function() {
	
	    // constructor
	    var Box = function(properties) {
	
	        this.$parentDiv = $('<div>');
	        this.$parentDiv.addClass('aladin-box');
	
	        properties = properties || {};
	
	        this.css = properties.css || {padding: '4px'};
	
	        this.position = properties.position || 'bottom'; // position can be bottom, left, top or right
	        if (this.position=='right') {
	            this.css['left'] = 'unset';
	        }
	        this.css[this.position] = '4px';
	
	        this.contentCss = properties.contentCss || {};
	
	        this.title = properties.title || undefined;
	
	        this.content = properties.content || undefined;
	
	        this.showHandler = properties.showHandler !== undefined ? properties.showHandler : true;
	
	        this.openCallback = properties.openCallback || undefined; // callback called when the user opens the panel
	        this.closeCallback = properties.closeCallback || undefined; // callback called when the user closes the panel
	
	        this.changingDim = 'width';
	        if (this.position=='top' || this.position=='bottom') {
	            this.changingDim = 'height';
	        }
	
	
	        this.open = false;
	        this._render();
	        this.$parentDiv.show();
	        this.open = true;
	        this.hide();
	    };
	
	    Box.prototype = {
	
	        show: function() {
	            if (this.open) {
	                return;
	            }
	
	            this.open = true;
	            this.$parentDiv.show();
	            this._updateChevron();
	
	            if (this.changingDim=='width') {
	                this.$parentDiv.find('.aladin-box-title-label').show();
	            }
	            var self = this;
	            var options = {};
	            options[this.changingDim] = 'show';
	            var delay = this.changingDim=='width' ? 0 : 400;
	            this.$parentDiv.find('.aladin-box-content').animate(options, delay, function() {
	                self.css[self.position] = '4px';
	                self.updateStyle(self.css);
	
	                typeof self.openCallback === 'function' && self.openCallback();
	            });
	
	        },
	
	        hide: function() {
	            if (! this.open) {
	                return;
	            }
	
	            this.open = false;
	            this._updateChevron();
	
	            if (this.changingDim=='width') {
	                this.$parentDiv.find('.aladin-box-title-label').hide();
	            }
	            var self = this;
	            var options = {};
	            options[this.changingDim] = 'hide';
	            var delay = this.changingDim=='width' ? 0 : 400;
	            this.$parentDiv.find('.aladin-box-content').animate(options, delay, function() {
	                self.css[self.position] = '0px';
	                self.updateStyle(self.css);
	
	                typeof self.closeCallback === 'function' && self.closeCallback();
	            });
	        },
	
	        // complety hide parent div
	        realHide: function() {
	            this.open = false;
	            this.$parentDiv.hide();
	        },
	
	        updateStyle: function(css) {
	            this.css = css;
	            this.$parentDiv.css(css);
	        },
	
	        setContent: function(content) {
	            this.content = content;
	            this._render();
	        },
	
	        setTitle: function(title) {
	            this.title = title;
	            this._render();
	        },
	
	        enable: function() {
	            this.$parentDiv.enable();
	        },
	
	        disable: function() {
	            this.$parentDiv.disable();
	        },
	
	        // fill $parentDiv with HTML corresponding to current state
	        _render: function() {
	            var self = this;
	
	            this.$parentDiv.empty();
	            this.$parentDiv.off();
	
	            var titleDiv = $('<div class="aladin-box-title">');
	            if (this.showHandler) {
	                var chevron = $('<span class="aladin-chevron">');
	                titleDiv.append(chevron);
	            }
	            if (this.title) {
	                titleDiv.append(' <span class="aladin-box-title-label">' + this.title + '</span>');
	            }
	            this.$parentDiv.append(titleDiv);
	            var $content = $('<div class="aladin-box-content">' + (this.content?this.content:'') + '</div>');
	            $content.css(this.contentCss);
	            this.$parentDiv.append($content);
	
	            this._updateChevron();
	            this.updateStyle(this.css);
	
	            titleDiv.on('click', function() {
	                if (self.open) {
	                    self.hide();
	                }
	                else {
	                    self.show();
	                }
	            });
	        },
	
	        _updateChevron: function() {
	            this.$parentDiv.find('.aladin-chevron').removeClass().addClass('aladin-chevron ' + getChevronClass(this.position, this.open))
	                                                        .attr('title', 'Click to ' + (this.open?'hide ':'show ') + (this.title?this.title:'') + ' panel');
	        }
	    };
	
	    // return the jquery object corresponding to the given position and open/close state
	    var getChevronClass = function(position, isOpen) {
	        if (position=='top' && isOpen || position=='bottom' && !isOpen) {
	            return 'aladin-chevron-up';
	        }
	        if (position=='bottom' && isOpen || position=='top' && !isOpen) {
	            return 'aladin-chevron-down';
	        }
	        if (position=='right' && isOpen || position=='left' && !isOpen) {
	            return 'aladin-chevron-right';
	        }
	        if (position=='left' && isOpen || position=='right' && !isOpen) {
	            return 'aladin-chevron-left';
	        }
	        return '';
	    };
	
	    
	
	
	    return Box;
	
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	CooConversion = (function() {
	
	    var CooConversion = {};
	    
	    CooConversion.GALACTIC_TO_J2000 = [
	       -0.0548755604024359,  0.4941094279435681, -0.8676661489811610,
	       -0.8734370902479237, -0.4448296299195045, -0.1980763734646737,
	       -0.4838350155267381,  0.7469822444763707,  0.4559837762325372 ];
	    
	    CooConversion.J2000_TO_GALACTIC = [
	        -0.0548755604024359, -0.873437090247923, -0.4838350155267381,
	         0.4941094279435681, -0.4448296299195045, 0.7469822444763707,
	        -0.8676661489811610, -0.1980763734646737, 0.4559837762325372 ];
	    
	    // adapted from www.robertmartinayers.org/tools/coordinates.html
	    // radec : array of ra, dec in degrees
	    // return coo in degrees
	    CooConversion.Transform = function( radec, matrix ) {// returns a radec array of two elements
	        radec[0] = radec[0]*Math.PI/180;
	        radec[1] = radec[1]*Math.PI/180;
	      var r0 = new Array ( 
	       Math.cos(radec[0]) * Math.cos(radec[1]),
	       Math.sin(radec[0]) * Math.cos(radec[1]),
	       Math.sin(radec[1]) );
	        
	     var s0 = new Array (
	       r0[0]*matrix[0] + r0[1]*matrix[1] + r0[2]*matrix[2], 
	       r0[0]*matrix[3] + r0[1]*matrix[4] + r0[2]*matrix[5], 
	       r0[0]*matrix[6] + r0[1]*matrix[7] + r0[2]*matrix[8] ); 
	     
	      var r = Math.sqrt ( s0[0]*s0[0] + s0[1]*s0[1] + s0[2]*s0[2] ); 
	    
	      var result = new Array ( 0.0, 0.0 );
	      result[1] = Math.asin ( s0[2]/r ); // New dec in range -90.0 -- +90.0 
	      // or use sin^2 + cos^2 = 1.0  
	      var cosaa = ( (s0[0]/r) / Math.cos(result[1] ) );
	      var sinaa = ( (s0[1]/r) / Math.cos(result[1] ) );
	      result[0] = Math.atan2 (sinaa,cosaa);
	      if ( result[0] < 0.0 ) result[0] = result[0] + 2*Math.PI;
	    
	        result[0] = result[0]*180/Math.PI;
	        result[1] = result[1]*180/Math.PI;
	      return result;
	    };
	    
	    // coo : array of lon, lat in degrees
	    CooConversion.GalacticToJ2000 = function(coo) {
	        return CooConversion.Transform(coo, CooConversion.GALACTIC_TO_J2000);
	    };
	    // coo : array of lon, lat in degrees
	    CooConversion.J2000ToGalactic = function(coo) {
	        return CooConversion.Transform(coo, CooConversion.J2000_TO_GALACTIC);
	    };
	    return CooConversion;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Sesame.js
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Sesame = (function() {
	    Sesame = {};
	    
	    Sesame.cache = {};
	
	    Sesame.SESAME_URL = "http://cds.u-strasbg.fr/cgi-bin/nph-sesame.jsonp";
	
	    /** find RA, DEC for any target (object name or position)
	     *  if successful, callback is called with an object {ra: <ra-value>, dec: <dec-value>}
	     *  if not successful, errorCallback is called
	     */
	    Sesame.getTargetRADec = function(target, callback, errorCallback) {
	        if (!callback) {
	            return;
	        }
	        var isObjectName = /[a-zA-Z]/.test(target);
	
	        // try to parse as a position
	        if ( ! isObjectName) {
	            var coo = new Coo();
	
	            coo.parse(target);
	            if (callback) {
	                callback({ra: coo.lon, dec: coo.lat});
	            }
	        }
	        // ask resolution by Sesame
	        else {
	            Sesame.resolve(target,
	                   function(data) { // success callback
	                       callback({ra:  data.Target.Resolver.jradeg,
	                                 dec: data.Target.Resolver.jdedeg});
	                   },
	
	                   function(data) { // error callback
	                       if (errorCallback) {
	                           errorCallback();
	                       }
	                   }
	           );
	        }
	    };
	    
	    Sesame.resolve = function(objectName, callbackFunctionSuccess, callbackFunctionError) {
	        var sesameUrl = Sesame.SESAME_URL;
	        if (Utils.isHttpsContext()) {
	            sesameUrl = sesameUrl.replace('http://', 'https://')
	        }
	            
	
	        $.ajax({
	            url: sesameUrl ,
	            data: {"object": objectName},
	            method: 'GET',
	            dataType: 'jsonp',
	            success: function(data) {
	                if (data.Target && data.Target.Resolver && data.Target.Resolver) {
	                    callbackFunctionSuccess(data);
	                }
	                else {
	                    callbackFunctionError(data);
	                }
	            },
	            error: callbackFunctionError
	            });
	    };
	    
	    return Sesame;
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File HealpixCache
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	// class holding some HEALPix computations for better performances
	//
	// it is made of :
	// - a static cache for HEALPix corners at nside=8 
	// - a dynamic cache for 
	HealpixCache = (function() {
	
	    var HealpixCache = {};
	    
	    HealpixCache.staticCache = {corners: {nside8: []}};
	    // TODO : utilisation du dynamicCache
	    HealpixCache.dynamicCache = {};
	    
	    HealpixCache.lastNside = 8;
	    
	    HealpixCache.hpxIdxCache = null;
	    
	    // TODO : conserver en cache le dernier résultat ?
	    
	    HealpixCache.init = function() {
	    	// pre-compute corners position for nside=8
	    	var hpxIdx = new HealpixIndex(8);
	    	hpxIdx.init();
	    	var npix = HealpixIndex.nside2Npix(8);
	        var corners;
	    	for (var ipix=0; ipix<npix; ipix++) {
	            corners =  hpxIdx.corners_nest(ipix, 1);
	    		HealpixCache.staticCache.corners.nside8.push(corners);
	    	}
	    	
	    	HealpixCache.hpxIdxCache = hpxIdx;
	    };
	
	    HealpixCache.init();
	    
	    HealpixCache.corners_nest = function(ipix, nside) {
	    	if (nside==8) {
	    		return HealpixCache.staticCache.corners.nside8[ipix];
	    	}
	    	
	    	if (nside != HealpixCache.lastNside) {
	    		HealpixCache.hpxIdxCache = new HealpixIndex(nside);
	    		HealpixCache.hpxIdxCache.init();
	    		HealpixCache.lastNside = nside;
	    	}
	    	
	    	return HealpixCache.hpxIdxCache.corners_nest(ipix, 1);
	    	
	    };
	    
	    return HealpixCache;
	})();
		
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Utils
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Utils = Utils || {};
	
	Utils.cssScale = undefined;
	// adding relMouseCoords to HTMLCanvasElement prototype (see http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element ) 
	function relMouseCoords(event) {
	    var totalOffsetX = 0;
	    var totalOffsetY = 0;
	    var canvasX = 0;
	    var canvasY = 0;
	    var currentElement = this;
	   
	    if (event.offsetX) {
	        return {x: event.offsetX, y:event.offsetY};
	    } 
	    else {
	        if (!Utils.cssScale) {
	            var st = window.getComputedStyle(document.body, null);
	            var tr = st.getPropertyValue("-webkit-transform") ||
	                    st.getPropertyValue("-moz-transform") ||
	                    st.getPropertyValue("-ms-transform") ||
	                    st.getPropertyValue("-o-transform") ||
	                    st.getPropertyValue("transform");
	            var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
	            var matches = tr.match(matrixRegex);
	            if (matches) {
	                Utils.cssScale = parseFloat(matches[1]);
	            }
	            else {
	                Utils.cssScale = 1;
	            }
	        }
	        var e = event;
	        var canvas = e.target;
	        // http://www.jacklmoore.com/notes/mouse-position/
	        var target = e.target || e.srcElement;
	        var style = target.currentStyle || window.getComputedStyle(target, null);
	        var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
	        var borderTopWidth = parseInt(style['borderTopWidth'], 10);
	        var rect = target.getBoundingClientRect();
	
	        var clientX = e.clientX;
	        var clientY = e.clientY;
	        if (e.clientX) {
	            clientX = e.clientX;
	            clientY = e.clientY;
	        }
	        else {
	            clientX = e.originalEvent.changedTouches[0].clientX;
	            clientY = e.originalEvent.changedTouches[0].clientY;
	        }
	
	        var offsetX = clientX - borderLeftWidth - rect.left;
	        var offsetY = clientY - borderTopWidth - rect.top
	
	        return {x: parseInt(offsetX/Utils.cssScale), y: parseInt(offsetY/Utils.cssScale)};
	    }
	}
	HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
	
	
	
	//Function.prototype.bind polyfill from 
	//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind) {
	    Function.prototype.bind = function (obj) {
	        // closest thing possible to the ECMAScript 5 internal IsCallable function
	        if (typeof this !== 'function') {
	            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	        }
	
	        var slice = [].slice,
	        args = slice.call(arguments, 1),
	        self = this,
	        nop = function () { },
	        bound = function () {
	            return self.apply(this instanceof nop ? this : (obj || {}),
	                    args.concat(slice.call(arguments)));
	        };
	
	        bound.prototype = this.prototype;
	
	        return bound;
	    };
	}
	
	
	
	
	
	
	
	
	$ = $ || jQuery;
	
	/* source : http://stackoverflow.com/a/8764051 */
	$.urlParam = function(name, queryString){
	    if (queryString===undefined) {
	        queryString = location.search;
	    }
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(queryString)||[,""])[1].replace(/\+/g, '%20'))||null;
	};
	
	/* source: http://stackoverflow.com/a/1830844 */
	Utils.isNumber = function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	};
	
	Utils.isInt = function(n) {
	    return Utils.isNumber(n) && Math.floor(n)==n;
	};
	
	/* a debounce function, used to prevent multiple calls to the same function if less than delay milliseconds have passed */
	Utils.debounce = function(fn, delay) {
	    var timer = null;
	    return function () {
	      var context = this, args = arguments;
	      clearTimeout(timer);
	      timer = setTimeout(function () {
	        fn.apply(context, args);
	      }, delay);
	    };
	};
	
	/* return a throttled function, to rate limit the number of calls (by default, one call every 250 milliseconds) */
	Utils.throttle = function(fn, threshhold, scope) {
	  threshhold || (threshhold = 250);
	  var last,
	      deferTimer;
	  return function () {
	    var context = scope || this;
	
	    var now = +new Date,
	        args = arguments;
	    if (last && now < last + threshhold) {
	      // hold on to it
	      clearTimeout(deferTimer);
	      deferTimer = setTimeout(function () {
	        last = now;
	        fn.apply(context, args);
	      }, threshhold);
	    } else {
	      last = now;
	      fn.apply(context, args);
	    }
	  };
	}
	
	
	/* A LRU cache, inspired by https://gist.github.com/devinus/409353#file-gistfile1-js */
	// TODO : utiliser le LRU cache pour les tuiles images
	Utils.LRUCache = function (maxsize) {
	    this._keys = [];
	    this._items = {};
	    this._expires = {};
	    this._size = 0;
	    this._maxsize = maxsize || 1024;
	};
	   
	Utils.LRUCache.prototype = {
	        set: function (key, value) {
	            var keys = this._keys,
	                items = this._items,
	                expires = this._expires,
	                size = this._size,
	                maxsize = this._maxsize;
	
	            if (size >= maxsize) { // remove oldest element when no more room
	                keys.sort(function (a, b) {
	                    if (expires[a] > expires[b]) return -1;
	                    if (expires[a] < expires[b]) return 1;
	                    return 0;
	                });
	
	                size--;
	                delete expires[keys[size]];
	                delete items[keys[size]];
	            }
	
	            keys[size] = key;
	            items[key] = value;
	            expires[key] = Date.now();
	            size++;
	
	            this._keys = keys;
	            this._items = items;
	            this._expires = expires;
	            this._size = size;
	        },
	
	        get: function (key) {
	            var item = this._items[key];
	            if (item) this._expires[key] = Date.now();
	            return item;
	        },
	        
	        keys: function() {
	            return this._keys;
	        }
	};
	
	////////////////////////////////////////////////////////////////////////////:
	
	/**
	  Make an AJAX call, given a list of potential mirrors
	  First successful call will result in options.onSuccess being called back
	  If all calls fail, onFailure is called back at the end
	
	  This method assumes the URL are CORS-compatible, no proxy will be used
	 */
	Utils.loadFromMirrors = function(urls, options) {
	    var data    = options && options.data || null;
	    var method = options && options.method || 'GET';
	    var dataType = options && options.dataType || null;
	    var timeout = options && options.timeout || 20;
	
	    var onSuccess = options && options.onSuccess || null;
	    var onFailure = options && options.onFailure || null;
	
	    if (urls.length === 0) {
	        (typeof onFailure === 'function') && onFailure();
	    }
	    else {
	        var ajaxOptions = {
	            url: urls[0],
	            data: data
	        }
	        if (dataType) {
	            ajaxOptions.dataType = dataType;
	        }
	
	        $.ajax(ajaxOptions)
	        .done(function(data) {
	            (typeof onSuccess === 'function') && onSuccess(data);
	        })
	        .fail(function() {
	             Utils.loadFromMirrors(urls.slice(1), options);
	        });
	    }
	} 
	
	// return the jquery ajax object configured with the requested parameters
	// by default, we use the proxy (safer, as we don't know if the remote server supports CORS)
	Utils.getAjaxObject = function(url, method, dataType, useProxy) {
	        if (useProxy!==false) {
	            useProxy = true;
	        }
	
	        if (useProxy===true) {
	            var urlToRequest = Aladin.JSONP_PROXY + '?url=' + encodeURIComponent(url);
	        }
	        else {
	            urlToRequest = url;
	        }
	        method = method || 'GET';
	        dataType = dataType || null;
	
	        return $.ajax({
	            url: urlToRequest,
	            method: method,
	            dataType: dataType
	        }); 
	};
	
	// return true if script is executed in a HTTPS context
	// return false otherwise
	Utils.isHttpsContext = function() {
	    return ( window.location.protocol === 'https:' );
	};
	
	// generate an absolute URL from a relative URL
	// example: getAbsoluteURL('foo/bar/toto') return http://cds.unistra.fr/AL/foo/bar/toto if executed from page http://cds.unistra.fr/AL/
	Utils.getAbsoluteURL = function(url) {
	    var a = document.createElement('a');
	    a.href = url;
	
	    return a.href;
	};
	
	// generate a valid v4 UUID
	Utils.uuidv4 = function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	        return v.toString(16);
	    });
	}
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File URLBuilder
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	
	URLBuilder = (function() {    
	
	    URLBuilder = {
	        buildSimbadCSURL: function(target, radiusDegrees) {
	            if (target && (typeof target  === "object")) {
	                if ('ra' in target && 'dec' in target) {
	                    var coo = new Coo(target.ra, target.dec, 7);
	                    target = coo.format('s');
	                }
	            }
	            return 'https://alasky.unistra.fr/cgi/simbad-flat/simbad-cs.py?target=' + encodeURIComponent(target) + '&SR=' + radiusDegrees + '&format=votable&SRUNIT=deg&SORTBY=nbref';
	        },
	
	        buildNEDPositionCSURL: function(ra, dec, radiusDegrees) {
	                return 'https://ned.ipac.caltech.edu/cgi-bin/nph-objsearch?search_type=Near+Position+Search&of=xml_main&RA=' + ra + '&DEC=' + dec + '&SR=' + radiusDegrees;
	        },
	
	        buildNEDObjectCSURL: function(object, radiusDegrees) {
	                return 'https://ned.ipac.caltech.edu/cgi-bin/nph-objsearch?search_type=Near+Name+Search&radius=' + (60 * radiusDegrees) + '&of=xml_main&objname=' + object;
	        },
	
	        buildVizieRCSURL: function(vizCatId, target, radiusDegrees, options) {
	            if (target && (typeof target  === "object")) {
	                if ('ra' in target && 'dec' in target) {
	                    var coo = new Coo(target.ra, target.dec, 7);
	                    target = coo.format('s');
	                }
	            }
	            
	            var maxNbSources = 1e5;
	            if (options && options.hasOwnProperty('limit') && Utils.isNumber(options.limit)) {
	                maxNbSources = parseInt(options.limit);
	            }
	            return 'https://vizier.unistra.fr/viz-bin/votable?-source=' + vizCatId + '&-c=' + encodeURIComponent(target) + '&-out.max=' + maxNbSources + '&-c.rd=' + radiusDegrees;
	        },
	
	        buildSkyBotCSURL: function(ra, dec, radius, epoch, queryOptions) {
	            var url = 'http://vo.imcce.fr/webservices/skybot/skybotconesearch_query.php?-from=AladinLite';
	            url += '&RA=' + encodeURIComponent(ra);
	            url += '&DEC=' + encodeURIComponent(dec);
	            url += '&SR=' + encodeURIComponent(radius);
	            url += '&EPOCH=' + encodeURIComponent(epoch);
	
	            if (queryOptions) {
	                for (var key in queryOptions) {
	                    if (queryOptions.hasOwnProperty(key)) {
	                            url += '&' + key + '=' + encodeURIComponent(queryOptions[key]);
	                    }
	                }
	            }
	
	            return url;
	        }
	    
	
	    };
	
	    return URLBuilder;
	    
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File MeasurementTable
	 *
	 * Graphic object showing measurement of a catalog
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	MeasurementTable = (function() {
	
	
	    // constructor
	    MeasurementTable = function(aladinLiteDiv) {
	        this.isShowing = false;
	
	        this.divEl = $('<div class="aladin-measurement-div"></div>');
	        
	        $(aladinLiteDiv).append(this.divEl);
	    }
	
	    // show measurement associated with a given source
	    MeasurementTable.prototype.showMeasurement = function(source) {
	        this.divEl.empty();
	        var header = '<thead><tr>';
	        var content = '<tr>';
	        for (key in source.data) {
	            header += '<th>' + key + '</th>';
	            content += '<td>' + source.data[key] + '</td>';
	        }
	        header += '</tr></thead>';
	        content += '</tr>';
	        this.divEl.append('<table>' + header + content + '</table>');
	        this.show();
	    };
	
	    MeasurementTable.prototype.show = function() {
	        this.divEl.show();
	    };
	    
	    MeasurementTable.prototype.hide = function() {
	        this.divEl.hide();
	    };
	    
	    
	    return MeasurementTable;
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Color
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Color = (function() {
	
	
	    Color = {};
	    
	    Color.curIdx = 0;
	    Color.colors = ['#ff0000', '#0000ff', '#99cc00', '#ffff00','#000066', '#00ffff', '#9900cc', '#0099cc', '#cc9900', '#cc0099', '#00cc99', '#663333', '#ffcc9a', '#ff9acc', '#ccff33', '#660000', '#ffcc33', '#ff00ff', '#00ff00', '#ffffff'];
	
	    
	    Color.getNextColor = function() {
	        var c = Color.colors[Color.curIdx % (Color.colors.length)];
	        Color.curIdx++;
	        return c;
	    };
	
	    /** return most suited (ie readable) color for a label, given a background color
	     * bkgdColor: color, given as a 'rgb(<r value>, <g value>, <v value>)' . This is returned by $(<element>).css('background-color')
	     * 
	     * example call: Color.getLabelColorForBackground('rgb(3, 123, 42)')
	     * adapted from http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
	     */
	    Color.getLabelColorForBackground = function(rgbBkgdColor) {
	        var lightLabel = '#eee' 
	        var darkLabel = '#111' 
	        rgb = rgbBkgdColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	        if (rgb==null) {
	            // we return the dark label color if we can't parse the color
	            return darkLabel
	        }
	        r = parseInt(rgb[1]);
	        g = parseInt(rgb[2]);
	        b = parseInt(rgb[3]);
	        
	        var d = 0;
	        // Counting the perceptive luminance - human eye favors green color... 
	        var a = 1 - ( 0.299 * r + 0.587 * g + 0.114 * b) / 255;
	
	        if (a < 0.5) {
	            return darkLabel; // bright color --> dark font
	        }
	        else {
	            return lightLabel; // dark color --> light font
	        }
	    };
	    
	    return Color;
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File AladinUtils
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	AladinUtils = (function() {
	
	    return {
	    	/**
	    	 * passage de xy projection à xy dans la vue écran 
	    	 * @param x
	    	 * @param y
	    	 * @param width
	    	 * @param height
	    	 * @param largestDim largest dimension of the view
	    	 * @returns position in the view
	    	 */
	    	xyToView: function(x, y, width, height, largestDim, zoomFactor, round) {
	    	    if (round==undefined) {
	                // we round by default
	    	        round = true;
	    	    }
	
	    	    if (round) {
	    	        // we round the result for potential performance gains
	    	        return {vx: AladinUtils.myRound(largestDim/2*(1+zoomFactor*x)-(largestDim-width)/2), vy: AladinUtils.myRound(largestDim/2*(1+zoomFactor*y)-(largestDim-height)/2)};
	
	    	    }
	    	    else {
	                return {vx: largestDim/2*(1+zoomFactor*x)-(largestDim-width)/2, vy: largestDim/2*(1+zoomFactor*y)-(largestDim-height)/2};
	    	    }
	    	},
	    	
	    	/**
	    	 * passage de xy dans la vue écran à xy projection
	    	 * @param vx
	    	 * @param vy
	    	 * @param width
	    	 * @param height
	    	 * @param largestDim
	    	 * @param zoomFactor
	    	 * @returns position in xy projection
	    	 */
	    	viewToXy: function(vx, vy, width, height, largestDim, zoomFactor) {
	    		return {x: ((2*vx+(largestDim-width))/largestDim-1)/zoomFactor, y: ((2*vy+(largestDim-height))/largestDim-1)/zoomFactor};
	    	},
	
	    	/**
	    	 * convert a 
	    	 * @returns position x,y in the view. Null if projection is impossible
	    	 */
	        radecToViewXy: function(ra, dec, currentProjection, currentFrame, width, height, largestDim, zoomFactor) {
	            var xy;
	            if (currentFrame.system != CooFrameEnum.SYSTEMS.J2000) {
	                var lonlat = CooConversion.J2000ToGalactic([ra, dec]);
	                xy = currentProjection.project(lonlat[0], lonlat[1]);
	            }
	            else {
	                xy = currentProjection.project(ra, dec);
	            }
	            if (!xy) {
	                return null;
	            }
	            
	            return AladinUtils.xyToView(xy.X, xy.Y, width, height, largestDim, zoomFactor, false);
	        },
	
	    	
	    	myRound: function(a) {
	    		if (a<0) {
	    			return -1*( (-a) | 0);
	    		}
	    		else {
	    			return a | 0;
	    		}
	    	},
	    	
	    	
	    	
	    	/**
	    	 * tests whether a healpix pixel is visible or not
	    	 * @param pixCorners array of position (xy view) of the corners of the pixel
	    	 * @param viewW
	    	 */
	    	isHpxPixVisible: function(pixCorners, viewWidth, viewHeight) {
	    		for (var i = 0; i<pixCorners.length; i++) {
	    			if ( pixCorners[i].vx>=-20 && pixCorners[i].vx<(viewWidth+20) &&
	    				 pixCorners[i].vy>=-20 && pixCorners[i].vy<(viewHeight+20) ) {
	    				return true;
	    			}
	    		}
	    		return false;
	    	},
	    	
	    	ipixToIpix: function(npixIn, norderIn, norderOut) {
	    		var npixOut = [];
	    		if (norderIn>=norderOut) {
	    		}
	    	},
	        
	        getZoomFactorForAngle: function(angleInDegrees, projectionMethod) {
	            var p1 = {ra: 0, dec: 0};
	            var p2 = {ra: angleInDegrees, dec: 0};
	            var projection = new Projection(angleInDegrees/2, 0);
	            projection.setProjection(projectionMethod);
	            var p1Projected = projection.project(p1.ra, p1.dec);
	            var p2Projected = projection.project(p2.ra, p2.dec);
	           
	            var zoomFactor = 1/Math.abs(p1Projected.X - p2Projected.Y);
	
	            return zoomFactor;
	        },
	
	        // grow array b of vx,vy view positions by *val* pixels
	        grow2: function(b, val) {
	            var j=0;
	            for ( var i=0; i<4; i++ ) {
	                if ( b[i]==null ) {
	                    j++;
	                }
	            }
	
	            if( j>1 ) {
	                return b;
	            }
	
	            var b1 = [];
	            for ( var i=0; i<4; i++ ) {
	                b1.push( {vx: b[i].vx, vy: b[i].vy} );
	            }
	    
	            for ( var i=0; i<2; i++ ) {
	                var a = i==1 ? 1 : 0;
	                var c = i==1 ? 3 : 2;
	
	                if ( b1[a]==null ) {
	                    var d,g;
	                    if ( a==0 || a==3 ) {
	                        d=1;
	                        g=2;
	                    }
	                    else {
	                        d=0;
	                        g=3;
	                    }
	                    b1[a] = {vx: (b1[d].vx+b1[g].vx)/2, vy: (b1[d].vy+b1[g].vy)/2};
	                }
	                if ( b1[c]==null ) {
	                    var d,g;
	                    if ( c==0 || c==3 ) {
	                        d=1;
	                        g=2;
	                    }
	                    else {
	                        d=0;
	                        g=3;
	                    }
	                    b1[c] = {vx: (b1[d].vx+b1[g].vx)/2, vy: (b1[d].vy+b1[g].vy)/2};
	                }
	                if( b1[a]==null || b1[c]==null ) {
	                    continue;
	                }
	
	                var angle = Math.atan2(b1[c].vy-b1[a].vy, b1[c].vx-b1[a].vx);
	                var chouilla = val*Math.cos(angle);
	                b1[a].vx -= chouilla;
	                b1[c].vx += chouilla;
	                chouilla = val*Math.sin(angle);
	                b1[a].vy-=chouilla;
	                b1[c].vy+=chouilla;
	            }
	            return b1;
	        },
	
	        // SVG icons templates are stored here rather than in a CSS, as to allow
	        // to dynamically change the fill color
	        // Pretty ugly, haven't found a prettier solution yet
	        //
	        // TODO: store this in the Stack class once it will exist
	        //
	        SVG_ICONS: {
	            CATALOG: '<svg xmlns="http://www.w3.org/2000/svg"><polygon points="1,0,5,0,5,3,1,3"  fill="FILLCOLOR" /><polygon points="7,0,9,0,9,3,7,3"  fill="FILLCOLOR" /><polygon points="10,0,12,0,12,3,10,3"  fill="FILLCOLOR" /><polygon points="13,0,15,0,15,3,13,3"  fill="FILLCOLOR" /><polyline points="1,5,5,9"  stroke="FILLCOLOR" /><polyline points="1,9,5,5" stroke="FILLCOLOR" /><line x1="7" y1="7" x2="15" y2="7" stroke="FILLCOLOR" stroke-width="2" /><polyline points="1,11,5,15"  stroke="FILLCOLOR" /><polyline points="1,15,5,11"  stroke="FILLCOLOR" /><line x1="7" y1="13" x2="15" y2="13" stroke="FILLCOLOR" stroke-width="2" /></svg>',
	            MOC: '<svg xmlns="http://www.w3.org/2000/svg"><polyline points="0.5,7,2.5,7,2.5,5,7,5,7,3,10,3,10,5,13,5,13,7,15,7,15,9,13,9,13,12,10,12,10,14,7,14,7,12,2.5,12,2.5,10,0.5,10,0.5,7" stroke-width="1" stroke="FILLCOLOR" fill="transparent" /><line x1="1" y1="10" x2="6" y2="5" stroke="FILLCOLOR" stroke-width="0.5" /><line x1="2" y1="12" x2="10" y2="4" stroke="FILLCOLOR" stroke-width="0.5" /><line x1="5" y1="12" x2="12" y2="5" stroke="FILLCOLOR" stroke-width="0.5" /><line x1="7" y1="13" x2="13" y2="7" stroke="FILLCOLOR" stroke-width="0.5" /><line x1="10" y1="13" x2="13" y2="10" stroke="FILLCOLOR" stroke-width="0.5" /></svg>',
	            OVERLAY: '<svg xmlns="http://www.w3.org/2000/svg"><polygon points="10,5,10,1,14,1,14,14,2,14,2,9,6,9,6,5" fill="transparent" stroke="FILLCOLOR" stroke-width="2"/></svg>'
	        }
	 
	    };
	
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File CooFrameEnum
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	 
	 ProjectionEnum = {
	    SIN: Projection.PROJ_SIN,
	    AITOFF:  Projection.PROJ_AITOFF
	 };
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File CooFrameEnum
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	 
	CooFrameEnum = (function() {
	
	    var systems = {J2000: 'J2000', GAL: 'Galactic'};
	    return {
	        SYSTEMS: systems,
	
	        J2000: {label: "J2000", system: systems.J2000},
	        J2000d: {label: "J2000d", system: systems.J2000},
	        GAL:  {label: "Galactic", system: systems.GAL}
	    };
	 
	})();
	
	
	
	CooFrameEnum.fromString = function(str, defaultValue) {
	    if (! str) {
	        return defaultValue ? defaultValue : null;
	    }
	    
	    str = str.toLowerCase().replace(/^\s+|\s+$/g, ''); // convert to lowercase and trim
	    
	    if (str.indexOf('j2000d')==0 || str.indexOf('icrsd')==0) {
	        return CooFrameEnum.J2000d;
	    }
	    else if (str.indexOf('j2000')==0 || str.indexOf('icrs')==0) {
	        return CooFrameEnum.J2000;
	    }
	    else if (str.indexOf('gal')==0) {
	        return CooFrameEnum.GAL;
	    }
	    else {
	        return defaultValue ? defaultValue : null;
	    }
	};
	
	// Copyright 2013-2017 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File HiPSDefinition
	 * 
	 * Author: Thomas Boch [CDS]
	 * 
	 *****************************************************************************/
	HiPSDefinition = (function() {
	
	    // constructor
	    var HiPSDefinition = function(properties) {
	        this.properties = properties; // key-value object corresponding to the properties file
	
	        this.id = this.getID();
	        this.obsTitle = properties['obs_title'];
	        this.frame = properties['hips_frame'];
	        this.order = parseInt(properties['hips_order']);
	        this.clientSortKey = properties['client_sort_key'];
	        this.tileFormats = properties.hasOwnProperty('hips_tile_format') && properties['hips_tile_format'].split(' ');
	        this.urls = [];
	        this.urls.push(properties['hips_service_url']);
	        var k = 1;
	        while (properties.hasOwnProperty('hips_service_url_' + k)) {
	            this.urls.push(properties['hips_service_url_' + k]);
	            k++;
	        }
	
	        this.clientApplications = properties['client_application'];
	    };
	
	    HiPSDefinition.prototype = {
	
	        getServiceURLs: function(httpsOnly) {
	            httpsOnly = httpsOnly === true;
	
	            // TODO: TO BE COMPLETED
	        },
	
	        // return the ID according to the properties
	        getID: function() {
	            // ID is explicitely given
	            if (this.properties.hasOwnProperty('ID')) {
	                return this.properties['ID'];
	            }
	
	            var id = null;
	            // ID might be built from different fields
	            if (this.properties.hasOwnProperty('creator_did')) {
	                id = this.properties['creator_did'];
	            }
	            if (id==null && this.properties.hasOwnProperty('publisher_did')) {
	                id = this.properties['publisher_did'];
	            }
	
	            if (id != null) {
	                // remove ivo:// prefix
	                if (id.slice(0, 6) === 'ivo://') {
	                    id = id.slice(6);
	                }
	
	                // '?' are replaced by '/'
	                id = id.replace(/\?/g, '/')
	            }
	
	            return id;
	        }
	
	
	
	    };
	
	    // cache (at the source code level) of the list of HiPS
	    // this is the result to a query to http://alasky.u-strasbg.fr/MocServer/query?dataproduct_type=image&client_application=AladinLite&fmt=json&fields=ID,obs_title,client_sort_key,client_application,hips_service_url*,hips_order,hips_tile_format,hips_frame
	    var AL_CACHE_CLASS_LEVEL = [{
	    "ID": "CDS/P/2MASS/color",
	    "obs_title": "2MASS color J (1.23 microns), H (1.66 microns), K (2.16 microns)",
	    "client_sort_key": "04-001-00",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/2MASS/Color",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/2MASS/Color",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/2MASS/Color"
	    }, {
	    "ID": "CDS/P/AKARI/FIS/Color",
	    "obs_title": "AKARI Far-infrared All-Sky Survey - color composition WideL/WideS/N60",
	    "client_sort_key": "04-05-00",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "5",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "png jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/AKARI-FIS/ColorLSN60",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/AKARI-FIS/ColorLSN60",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/AKARI-FIS/ColorLSN60"
	    }, {
	    "ID": "CDS/P/DECaLS/DR3/color",
	    "obs_title": "DECaLS DR3 color",
	    "hips_frame": "equatorial",
	    "hips_order": "11",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/DECaLS/DR3/color"
	}, {
	    "ID": "CDS/P/DSS2/blue",
	    "obs_title": "DSS2 Blue (XJ+S)",
	    "client_sort_key": "03-01-03",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg fits",
	    "hips_service_url": "http://alasky.unistra.fr/DSS/DSS2-blue-XJ-S",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/DSS/DSS2-blue-XJ-S",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/DSS/DSS2-blue-XJ-S",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/DSS2Blue"
	}, {
	    "ID": "CDS/P/DSS2/color",
	    "obs_title": "DSS colored",
	    "client_sort_key": "03-00",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/DSS/DSSColor",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/DSS/DSSColor",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/DSS/DSSColor",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/DSSColorNew",
	    "hips_service_url_4": "http://skies.esac.esa.int/DSSColor/"
	}, {
	    "ID": "CDS/P/DSS2/red",
	    "obs_title": "DSS2 Red (F+R)",
	    "client_sort_key": "03-01-02",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg fits",
	    "hips_service_url": "http://alasky.unistra.fr/DSS/DSS2Merged",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/DSS/DSS2Merged",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/DSS/DSS2Merged",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/DSS2Merged"
	}, {
	    "ID": "P/PanSTARRS/DR1/g",
	    "hips_service_url": "http://alasky.u-strasbg.fr/Pan-STARRS/DR1/g",
	    "obs_title": "PanSTARRS DR1 g",
	    "hips_order": 11,
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg fits"
	}, {
	    "ID": "CDS/P/Fermi/color",
	    "obs_title": "Fermi Color HEALPix survey",
	    "client_sort_key": "00-01-01",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "3",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/Fermi/Color",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/Fermi/Color",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/Fermi/Color"
	}, {
	    "ID": "CDS/P/Finkbeiner",
	    "obs_title": "Finkbeiner Halpha composite survey",
	    "client_sort_key": "06-01",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "3",
	    "hips_frame": "galactic",
	    "hips_tile_format": "jpeg fits",
	    "hips_service_url": "http://alasky.unistra.fr/FinkbeinerHalpha",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/FinkbeinerHalpha",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/FinkbeinerHalpha"
	}, {
	    "ID": "CDS/P/GALEXGR6/AIS/color",
	    "obs_title": "GALEX GR6 AIS (until March 2014)- Color composition",
	    "client_sort_key": "02-01-01",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "8",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "png jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/GALEX/GR6-03-2014/AIS-Color",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/GALEX/GR6-03-2014/AIS-Color",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/GALEX/GR6-03-2014/AIS-Color"
	}, {
	    "ID": "CDS/P/IRIS/color",
	    "obs_title": "IRAS-IRIS HEALPix survey, color",
	    "client_sort_key": "04-02-01",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "3",
	    "hips_frame": "galactic",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/IRISColor",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/IRISColor",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/IRISColor",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/IRISColor",
	    "hips_service_url_4": "http://skies.esac.esa.int/IRISColor/"
	}, {
	    "ID": "CDS/P/Mellinger/color",
	    "obs_title": "Mellinger optical survey, color",
	    "client_sort_key": "03-03",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "4",
	    "hips_frame": "galactic",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/MellingerRGB",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/MellingerRGB",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/MellingerRGB"
	}, {
	    "ID": "CDS/P/SDSS9/color",
	    "obs_title": "SDSS 9 color",
	    "client_sort_key": "03-02-01",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "10",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/SDSS/DR9/color",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/SDSS/DR9/color",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/SDSS/DR9/color",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/SDSS9Color",
	    "hips_service_url_4": "http://skies.esac.esa.int/SDSS9Color/"
	}, {
	    "ID": "CDS/P/SPITZER/color",
	    "obs_title": "IRAC HEALPix survey, color",
	    "client_sort_key": "04-03-00",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "galactic",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/SpitzerI1I2I4color",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/SpitzerI1I2I4color",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/SpitzerI1I2I4color",
	    "hips_service_url_3": "http://healpix.ias.u-psud.fr/SPITZERColor"
	}, {
	    "ID": "CDS/P/allWISE/color",
	    "obs_title": "AllWISE color  Red (W4) , Green (W2) , Blue (W1) from raw Atlas Images",
	    "client_sort_key": "04-003-00",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "8",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://alasky.unistra.fr/AllWISE/RGB-W4-W2-W1",
	    "hips_service_url_1": "http://alaskybis.unistra.fr/AllWISE/RGB-W4-W2-W1",
	    "hips_service_url_2": "https://alaskybis.unistra.fr/AllWISE/RGB-W4-W2-W1"
	}, {
	    "ID": "IPAC/P/GLIMPSE360",
	    "obs_title": "GLIMPSE360: Spitzer's Infrared Milky Way",
	    "client_sort_key": "04-03-0",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "9",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "jpeg",
	    "hips_service_url": "http://www.spitzer.caltech.edu/glimpse360/aladin/data"
	}, {
	    "ID": "JAXA/P/MAXI_SSC_SUM",
	    "hips_tile_format": "png",
	    "hips_frame": "equatorial",
	    "obs_title": "MAXI SSC all-sky image integrated for 4.5 years",
	    "hips_order": "6",
	    "hips_service_url": "http://darts.isas.jaxa.jp/pub/judo2/HiPS/maxi_ssc_sum",
	    "hips_service_url_1": "http://alasky.unistra.fr//JAXA/JAXA_P_MAXI_SSC_SUM",
	    "hips_service_url_2": "http://alaskybis.unistra.fr//JAXA/JAXA_P_MAXI_SSC_SUM",
	    "hips_service_url_3": "https://alaskybis.unistra.fr//JAXA/JAXA_P_MAXI_SSC_SUM"
	}, {
	    "ID": "JAXA/P/SWIFT_BAT_FLUX",
	    "hips_tile_format": "png",
	    "hips_frame": "equatorial",
	    "obs_title": "Swift-BAT 70-month all-sray hard X-ray survey image",
	    "hips_order": "6",
	    "hips_service_url": "http://darts.isas.jaxa.jp/pub/judo2/HiPS/swift_bat_flux/",
	    "hips_service_url_1": "http://alasky.unistra.fr//JAXA/JAXA_P_SWIFT_BAT_FLUX",
	    "hips_service_url_2": "http://alaskybis.unistra.fr//JAXA/JAXA_P_SWIFT_BAT_FLUX",
	    "hips_service_url_3": "https://alaskybis.unistra.fr//JAXA/JAXA_P_SWIFT_BAT_FLUX"
	}, {
	    "ID": "ov-gso/P/VTSS/Ha",
	    "obs_title": "Virginia Tech Spectral-Line Survey (VTSS) - Halpha image",
	    "client_sort_key": "06-xx",
	    "client_application":[ "AladinLite", "AladinDesktop"],
	    "hips_order": "3",
	    "hips_frame": ["galactic", "galactic"],
	    "hips_tile_format": "png jpeg fits",
	    "hips_service_url": "http://cade.irap.omp.eu/documents/Ancillary/4Aladin/VTSS",
	    "hips_service_url_1": "http://alasky.unistra.fr/IRAP/VTSS",
	    "hips_service_url_2": "http://alaskybis.unistra.fr/IRAP/VTSS",
	    "hips_service_url_3": "https://alaskybis.unistra.fr/IRAP/VTSS"
	}, {
	    "ID": "xcatdb/P/XMM/EPIC",
	    "obs_title": "XMM-Newton stacked EPIC images",
	    "hips_frame": "equatorial",
	    "hips_order": "7",
	    "hips_service_url": "http://saada.u-strasbg.fr/xmmallsky",
	    "hips_tile_format": "png fits",
	    "hips_service_url_1": "http://alasky.unistra.fr/SSC/xmmallsky",
	    "hips_service_url_2": "http://alaskybis.unistra.fr/SSC/xmmallsky",
	    "hips_service_url_3": "https://alaskybis.unistra.fr/SSC/xmmallsky"
	}, {
	    "ID": "xcatdb/P/XMM/PN/color",
	    "obs_title": "False color X-ray images (Red=0.5-1 Green=1-2 Blue=2-4.5)Kev",
	    "hips_order": "7",
	    "hips_frame": "equatorial",
	    "hips_tile_format": "png jpeg",
	    "hips_service_url": "http://saada.unistra.fr/xmmpnsky",
	    "hips_service_url_1": "http://alasky.unistra.fr/SSC/xmmpnsky",
	    "hips_service_url_2": "http://alaskybis.unistra.fr/SSC/xmmpnsky",
	    "hips_service_url_3": "https://alaskybis.unistra.fr/SSC/xmmpnsky"
	}];
	
	    var listHipsProperties = []; // this variable stores our current knowledge
	
	    HiPSDefinition.LOCAL_STORAGE_KEY = 'aladin:hips-list';
	    
	    var RETRIEVAL_TIMESTAMP_KEY = '_timestamp_retrieved';
	    var LAST_URL_KEY = '_last_used_url'; // URL previousy used to retrieve data from this HiPS
	    // retrieve definitions previousy stored in local storage
	    // @return an array with the HiPS definitions, empty array if nothing found or if an error occured
	    HiPSDefinition.getLocalStorageDefinitions = function() {
	        try {
	            var defs = window.localStorage.getItem(HiPSDefinition.LOCAL_STORAGE_KEY);
	            return defs === null ? [] : window.JSON.parse(defs);
	        }
	        catch(e) {
	            console.error(e);
	            return [];
	        }
	    };
	
	    // store in local storage a list of HiPSDefinition objects
	    // @return true if storage was successful
	    HiPSDefinition.storeInLocalStorage = function(properties) {
	        try {
	            window.localStorage.setItem(HiPSDefinition.LOCAL_STORAGE_KEY, window.JSON.stringify(properties));
	        }
	        catch(e) {
	            console.error(e);
	            return false;
	        }
	
	        return true;
	    };
	
	    var MOCSERVER_MIRRORS_HTTP = ['http://alasky.u-strasbg.fr/MocServer/query', 'http://alaskybis.u-strasbg.fr/MocServer/query']; // list of base URL for MocServer mirrors, available in HTTP
	    var MOCSERVER_MIRRORS_HTTPS = ['https://alasky.u-strasbg.fr/MocServer/query', 'https://alaskybis.unistra.fr/MocServer/query']; // list of base URL for MocServer mirrors, available in HTTPS
	
	    // get HiPS definitions, by querying the MocServer
	    // return data as dict-like objects
	    HiPSDefinition.getRemoteDefinitions = function(params, successCallbackFn, failureCallbackFn) {
	        var params = params || {client_application: 'AladinLite'}; // by default, retrieve only HiPS tagged "Aladin Lite"
	
	        params['fmt'] = 'json';
	        params['fields'] = 'ID,obs_title,client_sort_key,client_application,hips_service_url*,hips_order,hips_tile_format,hips_frame';
	
	        var urls = Utils.isHttpsContext() ? MOCSERVER_MIRRORS_HTTPS : MOCSERVER_MIRRORS_HTTP;
	
	        var successCallback = function(data) {
	            (typeof successCallbackFn === 'function') && successCallbackFn(data);
	        };
	        var failureCallback = function() {
	            console.error('Could not load HiPS definitions from urls ' + urls);
	            (typeof failureCallbackFn === 'function') && failureCallbackFn();
	        };
	
	        Utils.loadFromMirrors(urls, {data: params, onSuccess: successCallback, onFailure: failureCallback, timeout: 5});
	    };
	
	    // complement the baseList with the items in newList
	    var merge = function(baseList, newList) {
	        var updatedList = [];
	        var newListById = {};
	        for (var k=0; k<newList.length; k++) {
	            var item = newList[k];
	            newListById[item.ID] = item;
	        }
	
	        for (var k=0; k<baseList.length; k++) {
	            var item = baseList[k];
	            var id = item.ID;
	            if (newListById.hasOwnProperty(id)) {
	                var itemToAdd = newListById[id];
	                // we keep the last used URL property
	                if (item.hasOwnProperty(LAST_URL_KEY) && ! itemToAdd.hasOwnProperty(LAST_URL_KEY)) {
	                    itemToAdd[LAST_URL_KEY] = item[LAST_URL_KEY];
	                }
	                updatedList.push(itemToAdd);
	            }
	            else {
	                updatedList.push(item);
	            }
	        }
	
	        return updatedList;
	    };
	
	    HiPSDefinition.CACHE_RETENTION_TIME_SECONDS = 7 * 86400; // definitions can be kept 7 days
	    HiPSDefinition.init = function() {
	        // first, merge local definitions at class level with definitions in local storage
	        listHipsProperties = AL_CACHE_CLASS_LEVEL;
	
	        // second, remove old definitions (client != AladinLite and timestamp older than CACHE_RETENTION_TIME_SECONDS) and merge
	        var localDefs = HiPSDefinition.getLocalStorageDefinitions();
	        // 2.1 remove old defs
	        var now = new Date().getTime();
	        var indicesToRemove = [];
	        for (var k=0; k<localDefs.length; k++) {
	            var def = localDefs[k];
	            if (def.hasOwnProperty(RETRIEVAL_TIMESTAMP_KEY) && (now - def[RETRIEVAL_TIMESTAMP_KEY]) > 1000 * HiPSDefinition.CACHE_RETENTION_TIME_SECONDS) {
	                indicesToRemove.push(k);
	            }
	        }
	        // we have to browse the array in reverse order in order not to mess up indices
	        for (var k = indicesToRemove.length - 1; k >= 0; k--) {
	            localDefs.splice(indicesToRemove[k],1);
	        }
	        // 2.2 merge
	        listHipsProperties = merge(listHipsProperties, localDefs);
	
	        // third, retrieve remote definitions, merge and save
	        HiPSDefinition.getRemoteDefinitions({dataproduct_type: 'image', client_application: 'AladinLite'}, function(remoteDefs) {
	            // adding timestamp of retrieval
	            var now = new Date().getTime();
	            for (var k=0; k<remoteDefs.length; k++) {
	                remoteDefs[k][RETRIEVAL_TIMESTAMP_KEY] = now;
	            }
	            listHipsProperties = merge(listHipsProperties, remoteDefs);
	            HiPSDefinition.storeInLocalStorage(listHipsProperties);
	        });
	
	    };
	
	    // return list of HiPSDefinition objects, filtering out definitions whose client_application is not AladinLite
	    HiPSDefinition.getALDefaultHiPSDefinitions = function() {
	        // filter out definitions with client_application != 'AladinLite'
	        var ret = [];
	        for (var k=0; k<listHipsProperties.length; k++) {
	            var properties = listHipsProperties[k];
	            if ( ! properties.hasOwnProperty('client_application') || properties['client_application'].indexOf('AladinLite')<0) {
	                continue;
	            }
	
	            ret.push(new HiPSDefinition(properties));
	        }
	
	        return ret;
	    };
	
	    // return list of known HiPSDefinition objects
	    HiPSDefinition.getDefinitions = function() {
	        var ret = [];
	        for (var k=0; k<listHipsProperties.length; k++) {
	            var properties = listHipsProperties[k];
	            ret.push(new HiPSDefinition(properties));
	        }
	
	        return ret;
	    };
	
	    // parse a HiPS properties and return a dict-like object with corresponding key-values
	    // return null if parsing failed
	    HiPSDefinition.parseHiPSProperties = function(propertiesStr) {
	        if (propertiesStr==null) {
	            return null;
	        }
	
	        var propertiesDict = {};
	        // remove CR characters
	        propertiesStr = propertiesStr.replace(/[\r]/g, '');
	        // split on LF
	        var lines = propertiesStr.split('\n');
	        for (var k=0; k<lines.length; k++)  {
	            var l = $.trim(lines[k]);
	            // ignore comments lines
	            if (l.slice(0, 1)==='#') {
	                continue;
	            }
	            var idx = l.indexOf('=');
	            if (idx<0) {
	                continue;
	            }
	            var key = $.trim(l.slice(0, idx));
	            var value = $.trim(l.slice(idx+1));
	
	            propertiesDict[key] = value;
	        }
	
	        return propertiesDict;
	    };
	
	
	    // find a HiPSDefinition by id.
	    // look first locally, and remotely only if local search was unsuccessful
	    //
	    // call callback function with a list of HiPSDefinition candidates, empty array if nothing found
	
	    HiPSDefinition.findByID = function(id, callback) {
	        // look first locally
	        var candidates = findByIDLocal(id);
	        if (candidates.length>0) {
	            (typeof callback === 'function') && callback(candidates);
	            return;
	        }
	
	        // then remotely
	        findByIDRemote(id, callback);
	    };
	
	    // find a HiPSDefinition by id.
	    // search is done on the local knowledge of HiPSDefinitions
	    HiPSDefinition.findByIDLocal = function(id2search, callback) {
	        var candidates = [];
	        for (var k=0; k<listHipsProperties.length; k++) {
	            var properties = listHipsProperties[k];
	            var id = properties['ID'];
	            if (id.match(id2search) != null ) {
	                candidates.push(new HiPSDefinition(properties));
	            }
	        }
	
	        return candidates;
	    };
	
	    // find remotely a HiPSDefinition by ID
	    HiPSDefinition.findByIDRemote = function(id, callback) {
	        HiPSDefinition.findHiPSRemote({ID: '*' + id + '*'}, callback);
	    };
	
	    // search a HiPS according to some criteria
	    HiPSDefinition.findHiPSRemote = function(searchOptions, callback) {
	        searchOptions = searchOptions || {};
	        if (! searchOptions.hasOwnProperty('dataproduct_type')) {
	            searchOptions['dataproduct_type'] = 'image';
	        }
	        HiPSDefinition.getRemoteDefinitions(searchOptions, function(candidates) {
	            var defs = [];
	            for (var k=0; k<candidates.length; k++) {
	                defs.push(new HiPSDefinition(candidates[k]));
	            }
	            (typeof callback === 'function') && callback(defs);
	        });
	    };
	
	
	    // Create a HiPSDefinition object from a URL
	    //
	    // If the URL ends with 'properties', it is assumed to be the URL of the properties file
	    // else, it is assumed to be the base URL of the HiPS
	    //
	    // return a HiPSDefinition if successful, null if it failed
	    HiPSDefinition.fromURL = function(url, callback) {
	        var hipsUrl, propertiesUrl;
	        if (url.slice(-10) === 'properties') {
	            propertiesUrl = url;
	            hipsUrl = propertiesUrl.slice(0, -11);
	        }
	        else {
	            if (url.slice(-1) === '/') {
	                url = url.slice(0, -1);
	            }
	            hipsUrl = url;
	            propertiesUrl = hipsUrl + '/properties';
	        }
	
	        var callbackWhenPropertiesLoaded = function(properties) {
	            // Sometimes, hips_service_url is missing. That can happen for instance Hipsgen does not set the hips_service_url keyword
	            // --> in that case, we add as an attribyte the URL that was given as input parameter
	            var hipsPropertiesDict = HiPSDefinition.parseHiPSProperties(properties);
	            if (! hipsPropertiesDict.hasOwnProperty('hips_service_url')) {
	                hipsPropertiesDict['hips_service_url'] = hipsUrl;
	            }
	            (typeof callback === 'function') && callback(new HiPSDefinition(hipsPropertiesDict));
	        };
	
	        // try first without proxy
	        var ajax = Utils.getAjaxObject(propertiesUrl, 'GET', 'text', false);
	        ajax
	            .done(function(data) {
	                callbackWhenPropertiesLoaded(data);
	            })
	            .fail(function() {
	                // if not working, try with the proxy
	                var ajax = Utils.getAjaxObject(propertiesUrl, 'GET', 'text', true);
	                ajax
	                    .done(function(data) {
	                        callbackWhenPropertiesLoaded(data);
	                    })
	                    .fail(function() {
	                        (typeof callback === 'function') && callback(null);
	                    })
	            });
	    };
	
	    // HiPSDefinition generation from a properties dict-like object
	    HiPSDefinition.fromProperties = function(properties) {
	        return new HiPSDefinition(properties);
	    };
	
	
	
	
	    HiPSDefinition.init();
	
	    return HiPSDefinition;
	
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Downloader
	 * Queue downloading for image elements
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Downloader = (function() {
		var NB_MAX_SIMULTANEOUS_DL = 4;
		// TODO : le fading ne marche pas bien actuellement
		var FADING_ENABLED = false;
		var FADING_DURATION = 700; // in milliseconds
		
		
		var Downloader = function(view) {
			this.view = view; // reference to the view to be able to request redraw
			this.nbDownloads = 0; // number of current downloads
			this.dlQueue = []; // queue of items being downloaded
	        this.urlsInQueue = {};
		};
		
		Downloader.prototype.requestDownload = function(img, url, cors) {
	        // first check if url already in queue
	        if (url in this.urlsInQueue)  {
	            return;
	        }
			// put in queue
			this.dlQueue.push({img: img, url: url, cors: cors});
			this.urlsInQueue[url] = 1;
			
			this.tryDownload();
		};
		
		// try to download next items in queue if possible
		Downloader.prototype.tryDownload = function() {
		    //if (this.dlQueue.length>0 && this.nbDownloads<NB_MAX_SIMULTANEOUS_DL) {
			while (this.dlQueue.length>0 && this.nbDownloads<NB_MAX_SIMULTANEOUS_DL) {
				this.startDownloadNext();
			}
		};
		
		Downloader.prototype.startDownloadNext = function() {
			// get next in queue
			var next = this.dlQueue.shift();
			if ( ! next) {
				return;
			}
	
			this.nbDownloads++;
			var downloaderRef = this;
			next.img.onload = function() {
				downloaderRef.completeDownload(this, true); // in this context, 'this' is the Image
			};
				
			next.img.onerror = function(e) {
				downloaderRef.completeDownload(this, false); // in this context, 'this' is the Image
			};
			if (next.cors) {
			    next.img.crossOrigin = 'anonymous';
			}
			
			else {
			    if (next.img.crossOrigin !== undefined) {
			        delete next.img.crossOrigin;
			    }
			}
			
			
			next.img.src = next.url;
		};
		
		Downloader.prototype.completeDownload = function(img, success) {
	        delete this.urlsInQueue[img.src];
			img.onerror = null;
			img.onload = null;
			this.nbDownloads--;
			if (success) {
				if (FADING_ENABLED) {
					var now = new Date().getTime();
					img.fadingStart = now;
					img.fadingEnd = now + FADING_DURATION;
				}
				this.view.requestRedraw();
			}
			else {
			    img.dlError = true;
			}
			
			this.tryDownload();
		};
		
		
		
		return Downloader;
	})();
	// Generated by CoffeeScript 1.6.3
	(function() {
	  var Base, BinaryTable, CompressedImage, DataUnit, Decompress, FITS, HDU, Header, HeaderVerify, Image, ImageUtils, Parser, Table, Tabular, _ref, _ref1,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    __slice = [].slice;
	
	  if (this.astro == null) {
	    this.astro = {};
	  }
	
	  Base = (function() {
	    function Base() {}
	
	    Base.include = function(obj) {
	      var key, value;
	      for (key in obj) {
	        value = obj[key];
	        this.prototype[key] = value;
	      }
	      return this;
	    };
	
	    Base.extend = function(obj) {
	      var key, value;
	      for (key in obj) {
	        value = obj[key];
	        this[key] = value;
	      }
	      return this;
	    };
	
	    Base.prototype.proxy = function(func) {
	      var _this = this;
	      return function() {
	        return func.apply(_this, arguments);
	      };
	    };
	
	    Base.prototype.invoke = function(callback, opts, data) {
	      var context;
	      context = (opts != null ? opts.context : void 0) != null ? opts.context : this;
	      if (callback != null) {
	        return callback.call(context, data, opts);
	      }
	    };
	
	    return Base;
	
	  })();
	
	  Parser = (function(_super) {
	    __extends(Parser, _super);
	
	    Parser.prototype.LINEWIDTH = 80;
	
	    Parser.prototype.BLOCKLENGTH = 2880;
	
	    File.prototype.slice = File.prototype.slice || File.prototype.webkitSlice;
	
	    Blob.prototype.slice = Blob.prototype.slice || Blob.prototype.webkitSlice;
	
	    function Parser(arg, callback, opts) {
	      var xhr,
	        _this = this;
	      this.arg = arg;
	      this.callback = callback;
	      this.opts = opts;
	      this.hdus = [];
	      this.blockCount = 0;
	      this.begin = 0;
	      this.end = this.BLOCKLENGTH;
	      this.offset = 0;
	      this.headerStorage = new Uint8Array();
	      if (typeof this.arg === 'string') {
	        this.readNextBlock = this._readBlockFromBuffer;
	        xhr = new XMLHttpRequest();
	        xhr.open('GET', this.arg);
	        xhr.responseType = 'arraybuffer';
	
	        // the onerror handling has been added wrt the original fitsjs library as retrieved on the astrojs github repo
	        // if an error occurs, we return an empty object
	        xhr.onerror = function() {
	          _this.invoke(_this.callback, _this.opts);
	        }
	
	        xhr.onload = function() {
	          if (xhr.status !== 200) {
	            _this.invoke(_this.callback, _this.opts);
	            return;
	          }
	          _this.arg = xhr.response;
	          _this.length = _this.arg.byteLength;
	          return _this.readFromBuffer();
	        };
	        xhr.send();
	      } else {
	        this.length = this.arg.size;
	        this.readNextBlock = this._readBlockFromFile;
	        this.readFromFile();
	      }
	    }
	
	    Parser.prototype.readFromBuffer = function() {
	      var block;
	      block = this.arg.slice(this.begin + this.offset, this.end + this.offset);
	      return this.readBlock(block);
	    };
	
	    Parser.prototype.readFromFile = function() {
	      var block,
	        _this = this;
	      this.reader = new FileReader();
	      this.reader.onloadend = function(e) {
	        return _this.readBlock(e.target.result);
	      };
	      block = this.arg.slice(this.begin + this.offset, this.end + this.offset);
	      return this.reader.readAsArrayBuffer(block);
	    };
	
	    Parser.prototype.readBlock = function(block) {
	      var arr, dataLength, dataunit, header, rowIndex, rows, s, slice, tmp, value, _i, _len, _ref;
	      arr = new Uint8Array(block);
	      tmp = new Uint8Array(this.headerStorage);
	      this.headerStorage = new Uint8Array(this.end);
	      this.headerStorage.set(tmp, 0);
	      this.headerStorage.set(arr, this.begin);
	      rows = this.BLOCKLENGTH / this.LINEWIDTH;
	      while (rows--) {
	        rowIndex = rows * this.LINEWIDTH;
	        if (arr[rowIndex] === 32) {
	          continue;
	        }
	        if (arr[rowIndex] === 69 && arr[rowIndex + 1] === 78 && arr[rowIndex + 2] === 68 && arr[rowIndex + 3] === 32) {
	          s = '';
	          _ref = this.headerStorage;
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            value = _ref[_i];
	            s += String.fromCharCode(value);
	          }
	          header = new Header(s);
	          this.start = this.end + this.offset;
	          dataLength = header.getDataLength();
	          slice = this.arg.slice(this.start, this.start + dataLength);
	          if (header.hasDataUnit()) {
	            dataunit = this.createDataUnit(header, slice);
	          }
	          this.hdus.push(new HDU(header, dataunit));
	          this.offset += this.end + dataLength + this.excessBytes(dataLength);
	          if (this.offset === this.length) {
	            this.headerStorage = null;
	            this.invoke(this.callback, this.opts, this);
	            return;
	          }
	          this.blockCount = 0;
	          this.begin = this.blockCount * this.BLOCKLENGTH;
	          this.end = this.begin + this.BLOCKLENGTH;
	          this.headerStorage = new Uint8Array();
	          block = this.arg.slice(this.begin + this.offset, this.end + this.offset);
	          this.readNextBlock(block);
	          return;
	        }
	        break;
	      }
	      this.blockCount += 1;
	      this.begin = this.blockCount * this.BLOCKLENGTH;
	      this.end = this.begin + this.BLOCKLENGTH;
	      block = this.arg.slice(this.begin + this.offset, this.end + this.offset);
	      this.readNextBlock(block);
	    };
	
	    Parser.prototype._readBlockFromBuffer = function(block) {
	      return this.readBlock(block);
	    };
	
	    Parser.prototype._readBlockFromFile = function(block) {
	      return this.reader.readAsArrayBuffer(block);
	    };
	
	    Parser.prototype.createDataUnit = function(header, blob) {
	      var type;
	      type = header.getDataType();
	      return new astro.FITS[type](header, blob);
	    };
	
	    Parser.prototype.excessBytes = function(length) {
	      return (this.BLOCKLENGTH - (length % this.BLOCKLENGTH)) % this.BLOCKLENGTH;
	    };
	
	    Parser.prototype.isEOF = function() {
	      if (this.offset === this.length) {
	        return true;
	      } else {
	        return false;
	      }
	    };
	
	    return Parser;
	
	  })(Base);
	
	  FITS = (function(_super) {
	    __extends(FITS, _super);
	
	    function FITS(arg, callback, opts) {
	      var parser,
	        _this = this;
	      this.arg = arg;
	      parser = new Parser(this.arg, function(fits) {
	        _this.hdus = parser.hdus;
	        return _this.invoke(callback, opts, _this);
	      });
	    }
	
	    FITS.prototype.getHDU = function(index) {
	      var hdu, _i, _len, _ref;
	      if ((index != null) && (this.hdus[index] != null)) {
	        return this.hdus[index];
	      }
	      _ref = this.hdus;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        hdu = _ref[_i];
	        if (hdu.hasData()) {
	          return hdu;
	        }
	      }
	    };
	
	    FITS.prototype.getHeader = function(index) {
	      return this.getHDU(index).header;
	    };
	
	    FITS.prototype.getDataUnit = function(index) {
	      return this.getHDU(index).data;
	    };
	
	    return FITS;
	
	  })(Base);
	
	  FITS.version = '0.6.5';
	
	  this.astro.FITS = FITS;
	
	  DataUnit = (function(_super) {
	    __extends(DataUnit, _super);
	
	    DataUnit.swapEndian = {
	      B: function(value) {
	        return value;
	      },
	      I: function(value) {
	        return (value << 8) | (value >> 8);
	      },
	      J: function(value) {
	        return ((value & 0xFF) << 24) | ((value & 0xFF00) << 8) | ((value >> 8) & 0xFF00) | ((value >> 24) & 0xFF);
	      }
	    };
	
	    DataUnit.swapEndian[8] = DataUnit.swapEndian['B'];
	
	    DataUnit.swapEndian[16] = DataUnit.swapEndian['I'];
	
	    DataUnit.swapEndian[32] = DataUnit.swapEndian['J'];
	
	    function DataUnit(header, data) {
	      if (data instanceof ArrayBuffer) {
	        this.buffer = data;
	      } else {
	        this.blob = data;
	      }
	    }
	
	    return DataUnit;
	
	  })(Base);
	
	  this.astro.FITS.DataUnit = DataUnit;
	
	  HeaderVerify = {
	    verifyOrder: function(keyword, order) {
	      if (order !== this.cardIndex) {
	        return console.warn("" + keyword + " should appear at index " + this.cardIndex + " in the FITS header");
	      }
	    },
	    verifyBetween: function(keyword, value, lower, upper) {
	      if (!(value >= lower && value <= upper)) {
	        throw "The " + keyword + " value of " + value + " is not between " + lower + " and " + upper;
	      }
	    },
	    verifyBoolean: function(value) {
	      if (value === "T") {
	        return true;
	      } else {
	        return false;
	      }
	    },
	    VerifyFns: {
	      SIMPLE: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = arguments[0];
	        this.primary = true;
	        this.verifyOrder("SIMPLE", 0);
	        return this.verifyBoolean(value);
	      },
	      XTENSION: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        this.extension = true;
	        this.extensionType = arguments[0];
	        this.verifyOrder("XTENSION", 0);
	        return this.extensionType;
	      },
	      BITPIX: function() {
	        var args, key, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        key = "BITPIX";
	        value = parseInt(arguments[0]);
	        this.verifyOrder(key, 1);
	        if (value !== 8 && value !== 16 && value !== 32 && value !== (-32) && value !== (-64)) {
	          throw "" + key + " value " + value + " is not permitted";
	        }
	        return value;
	      },
	      NAXIS: function() {
	        var args, array, key, required, value, _ref;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        key = "NAXIS";
	        value = parseInt(arguments[0]);
	        array = arguments[1];
	        if (!array) {
	          this.verifyOrder(key, 2);
	          this.verifyBetween(key, value, 0, 999);
	          if (this.isExtension()) {
	            if ((_ref = this.extensionType) === "TABLE" || _ref === "BINTABLE") {
	              required = 2;
	              if (value !== required) {
	                throw "" + key + " must be " + required + " for TABLE and BINTABLE extensions";
	              }
	            }
	          }
	        }
	        return value;
	      },
	      PCOUNT: function() {
	        var args, key, order, required, value, _ref;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        key = "PCOUNT";
	        value = parseInt(arguments[0]);
	        order = 1 + 1 + 1 + this.get("NAXIS");
	        this.verifyOrder(key, order);
	        if (this.isExtension()) {
	          if ((_ref = this.extensionType) === "IMAGE" || _ref === "TABLE") {
	            required = 0;
	            if (value !== required) {
	              throw "" + key + " must be " + required + " for the " + this.extensionType + " extensions";
	            }
	          }
	        }
	        return value;
	      },
	      GCOUNT: function() {
	        var args, key, order, required, value, _ref;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        key = "GCOUNT";
	        value = parseInt(arguments[0]);
	        order = 1 + 1 + 1 + this.get("NAXIS") + 1;
	        this.verifyOrder(key, order);
	        if (this.isExtension()) {
	          if ((_ref = this.extensionType) === "IMAGE" || _ref === "TABLE" || _ref === "BINTABLE") {
	            required = 1;
	            if (value !== required) {
	              throw "" + key + " must be " + required + " for the " + this.extensionType + " extensions";
	            }
	          }
	        }
	        return value;
	      },
	      EXTEND: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = arguments[0];
	        if (!this.isPrimary()) {
	          throw "EXTEND must only appear in the primary header";
	        }
	        return this.verifyBoolean(value);
	      },
	      BSCALE: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseFloat(arguments[0]);
	      },
	      BZERO: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseFloat(arguments[0]);
	      },
	      BLANK: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = arguments[0];
	        if (!(this.get("BITPIX") > 0)) {
	          console.warn("BLANK is not to be used for BITPIX = " + (this.get('BITPIX')));
	        }
	        return parseInt(value);
	      },
	      DATAMIN: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseFloat(arguments[0]);
	      },
	      DATAMAX: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseFloat(arguments[0]);
	      },
	      EXTVER: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      },
	      EXTLEVEL: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      },
	      TFIELDS: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = parseInt(arguments[0]);
	        this.verifyBetween("TFIELDS", value, 0, 999);
	        return value;
	      },
	      TBCOL: function() {
	        var args, index, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = arguments[0];
	        index = arguments[2];
	        this.verifyBetween("TBCOL", index, 0, this.get("TFIELDS"));
	        return value;
	      },
	      ZIMAGE: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return this.verifyBoolean(arguments[0]);
	      },
	      ZCMPTYPE: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = arguments[0];
	        if (value !== 'GZIP_1' && value !== 'RICE_1' && value !== 'PLIO_1' && value !== 'HCOMPRESS_1') {
	          throw "ZCMPTYPE value " + value + " is not permitted";
	        }
	        if (value !== 'RICE_1') {
	          throw "Compress type " + value + " is not yet implement";
	        }
	        return value;
	      },
	      ZBITPIX: function() {
	        var args, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = parseInt(arguments[0]);
	        if (value !== 8 && value !== 16 && value !== 32 && value !== 64 && value !== (-32) && value !== (-64)) {
	          throw "ZBITPIX value " + value + " is not permitted";
	        }
	        return value;
	      },
	      ZNAXIS: function() {
	        var args, array, value;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        value = parseInt(arguments[0]);
	        array = arguments[1];
	        value = value;
	        if (!array) {
	          this.verifyBetween("ZNAXIS", value, 0, 999);
	        }
	        return value;
	      },
	      ZTILE: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      },
	      ZSIMPLE: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        if (arguments[0] === "T") {
	          return true;
	        } else {
	          return false;
	        }
	      },
	      ZPCOUNT: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      },
	      ZGCOUNT: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      },
	      ZDITHER0: function() {
	        var args;
	        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	        return parseInt(arguments[0]);
	      }
	    }
	  };
	
	  this.astro.FITS.HeaderVerify = HeaderVerify;
	
	  Header = (function(_super) {
	    __extends(Header, _super);
	
	    Header.include(HeaderVerify);
	
	    Header.prototype.arrayPattern = /(\D+)(\d+)/;
	
	    Header.prototype.maxLines = 600;
	
	    function Header(block) {
	      var method, name, _ref;
	      this.primary = false;
	      this.extension = false;
	      this.verifyCard = {};
	      _ref = this.VerifyFns;
	      for (name in _ref) {
	        method = _ref[name];
	        this.verifyCard[name] = this.proxy(method);
	      }
	      this.cards = {};
	      this.cards["COMMENT"] = [];
	      this.cards["HISTORY"] = [];
	      this.cardIndex = 0;
	      this.block = block;
	      this.readBlock(block);
	    }
	
	    Header.prototype.get = function(key) {
	      if (this.contains(key)) {
	        return this.cards[key].value;
	      } else {
	        return null;
	      }
	    };
	
	    Header.prototype.set = function(key, value, comment) {
	      comment = comment || '';
	      this.cards[key] = {
	        index: this.cardIndex,
	        value: value,
	        comment: comment
	      };
	      return this.cardIndex += 1;
	    };
	
	    Header.prototype.contains = function(key) {
	      return this.cards.hasOwnProperty(key);
	    };
	
	    Header.prototype.readLine = function(l) {
	      var blank, comment, firstByte, indicator, key, value, _ref;
	      key = l.slice(0, 8).trim();
	      blank = key === '';
	      if (blank) {
	        return;
	      }
	      indicator = l.slice(8, 10);
	      value = l.slice(10);
	      if (indicator !== "= ") {
	        if (key === 'COMMENT' || key === 'HISTORY') {
	          this.cards[key].push(value.trim());
	        }
	        return;
	      }
	      _ref = value.split(' /'), value = _ref[0], comment = _ref[1];
	      value = value.trim();
	      firstByte = value[0];
	      if (firstByte === "'") {
	        value = value.slice(1, -1).trim();
	      } else {
	        if (value !== 'T' && value !== 'F') {
	          value = parseFloat(value);
	        }
	      }
	      value = this.validate(key, value);
	      return this.set(key, value, comment);
	    };
	
	    Header.prototype.validate = function(key, value) {
	      var baseKey, index, isArray, match, _ref;
	      index = null;
	      baseKey = key;
	      isArray = this.arrayPattern.test(key);
	      if (isArray) {
	        match = this.arrayPattern.exec(key);
	        _ref = match.slice(1), baseKey = _ref[0], index = _ref[1];
	      }
	      if (baseKey in this.verifyCard) {
	        value = this.verifyCard[baseKey](value, isArray, index);
	      }
	      return value;
	    };
	
	    Header.prototype.readBlock = function(block) {
	      var i, line, lineWidth, nLines, _i, _ref, _results;
	      lineWidth = 80;
	      nLines = block.length / lineWidth;
	      nLines = nLines < this.maxLines ? nLines : this.maxLines;
	      _results = [];
	      for (i = _i = 0, _ref = nLines - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
	        line = block.slice(i * lineWidth, (i + 1) * lineWidth);
	        _results.push(this.readLine(line));
	      }
	      return _results;
	    };
	
	    Header.prototype.hasDataUnit = function() {
	      if (this.get("NAXIS") === 0) {
	        return false;
	      } else {
	        return true;
	      }
	    };
	
	    Header.prototype.getDataLength = function() {
	      var i, length, naxis, _i, _ref;
	      if (!this.hasDataUnit()) {
	        return 0;
	      }
	      naxis = [];
	      for (i = _i = 1, _ref = this.get("NAXIS"); 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
	        naxis.push(this.get("NAXIS" + i));
	      }
	      length = naxis.reduce(function(a, b) {
	        return a * b;
	      }) * Math.abs(this.get("BITPIX")) / 8;
	      length += this.get("PCOUNT");
	      return length;
	    };
	
	    Header.prototype.getDataType = function() {
	      switch (this.extensionType) {
	        case 'BINTABLE':
	          if (this.contains('ZIMAGE')) {
	            return 'CompressedImage';
	          }
	          return 'BinaryTable';
	        case 'TABLE':
	          return 'Table';
	        default:
	          if (this.hasDataUnit()) {
	            return 'Image';
	          } else {
	            return null;
	          }
	      }
	    };
	
	    Header.prototype.isPrimary = function() {
	      return this.primary;
	    };
	
	    Header.prototype.isExtension = function() {
	      return this.extension;
	    };
	
	    return Header;
	
	  })(Base);
	
	  this.astro.FITS.Header = Header;
	
	  ImageUtils = {
	    getExtent: function(arr) {
	      var index, max, min, value;
	      index = arr.length;
	      while (index--) {
	        value = arr[index];
	        if (isNaN(value)) {
	          continue;
	        }
	        min = max = value;
	        break;
	      }
	      if (index === -1) {
	        return [NaN, NaN];
	      }
	      while (index--) {
	        value = arr[index];
	        if (isNaN(value)) {
	          continue;
	        }
	        if (value < min) {
	          min = value;
	        }
	        if (value > max) {
	          max = value;
	        }
	      }
	      return [min, max];
	    },
	    getPixel: function(arr, x, y) {
	      return arr[y * this.width + x];
	    }
	  };
	
	  this.astro.FITS.ImageUtils = ImageUtils;
	
	  Image = (function(_super) {
	    __extends(Image, _super);
	
	    Image.include(ImageUtils);
	
	    Image.prototype.allocationSize = 16777216;
	
	    function Image(header, data) {
	      var begin, frame, i, naxis, _i, _j, _ref;
	      Image.__super__.constructor.apply(this, arguments);
	      naxis = header.get("NAXIS");
	      this.bitpix = header.get("BITPIX");
	      this.naxis = [];
	      for (i = _i = 1; 1 <= naxis ? _i <= naxis : _i >= naxis; i = 1 <= naxis ? ++_i : --_i) {
	        this.naxis.push(header.get("NAXIS" + i));
	      }
	      this.width = header.get("NAXIS1");
	      this.height = header.get("NAXIS2") || 1;
	      this.depth = header.get("NAXIS3") || 1;
	      this.bzero = header.get("BZERO") || 0;
	      this.bscale = header.get("BSCALE") || 1;
	      this.bytes = Math.abs(this.bitpix) / 8;
	      this.length = this.naxis.reduce(function(a, b) {
	        return a * b;
	      }) * Math.abs(this.bitpix) / 8;
	      this.frame = 0;
	      this.frameOffsets = [];
	      this.frameLength = this.bytes * this.width * this.height;
	      this.nBuffers = this.buffer != null ? 1 : 2;
	      for (i = _j = 0, _ref = this.depth - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
	        begin = i * this.frameLength;
	        frame = {
	          begin: begin
	        };
	        if (this.buffer != null) {
	          frame.buffers = [this.buffer.slice(begin, begin + this.frameLength)];
	        }
	        this.frameOffsets.push(frame);
	      }
	    }
	
	    Image.prototype._getFrame = function(buffer, bitpix, bzero, bscale) {
	      var arr, bytes, dataType, i, nPixels, swapEndian, tmp, value;
	      bytes = Math.abs(bitpix) / 8;
	      nPixels = i = buffer.byteLength / bytes;
	      dataType = Math.abs(bitpix);
	      if (bitpix > 0) {
	        switch (bitpix) {
	          case 8:
	            tmp = new Uint8Array(buffer);
	            tmp = new Uint16Array(tmp);
	            swapEndian = function(value) {
	              return value;
	            };
	            break;
	          case 16:
	            tmp = new Int16Array(buffer);
	            swapEndian = function(value) {
	              return ((value & 0xFF) << 8) | ((value >> 8) & 0xFF);
	            };
	            break;
	          case 32:
	            tmp = new Int32Array(buffer);
	            swapEndian = function(value) {
	              return ((value & 0xFF) << 24) | ((value & 0xFF00) << 8) | ((value >> 8) & 0xFF00) | ((value >> 24) & 0xFF);
	            };
	        }
	        if (!(parseInt(bzero) === bzero && parseInt(bscale) === bscale)) {
	          arr = new Float32Array(tmp.length);
	        } else {
	          arr = tmp;
	        }
	        while (nPixels--) {
	          tmp[nPixels] = swapEndian(tmp[nPixels]);
	          arr[nPixels] = bzero + bscale * tmp[nPixels];
	        }
	      } else {
	        arr = new Uint32Array(buffer);
	        swapEndian = function(value) {
	          return ((value & 0xFF) << 24) | ((value & 0xFF00) << 8) | ((value >> 8) & 0xFF00) | ((value >> 24) & 0xFF);
	        };
	        while (i--) {
	          value = arr[i];
	          arr[i] = swapEndian(value);
	        }
	        arr = new Float32Array(buffer);
	        while (nPixels--) {
	          arr[nPixels] = bzero + bscale * arr[nPixels];
	        }
	      }
	      return arr;
	    };
	
	    Image.prototype._getFrameAsync = function(buffers, callback, opts) {
	      var URL, blobGetFrame, blobOnMessage, fn1, fn2, i, mime, msg, onmessage, pixels, start, urlGetFrame, urlOnMessage, worker,
	        _this = this;
	      onmessage = function(e) {
	        var arr, bitpix, bscale, buffer, bzero, data, url;
	        data = e.data;
	        buffer = data.buffer;
	        bitpix = data.bitpix;
	        bzero = data.bzero;
	        bscale = data.bscale;
	        url = data.url;
	        importScripts(url);
	        arr = _getFrame(buffer, bitpix, bzero, bscale);
	        return postMessage(arr);
	      };
	      fn1 = onmessage.toString().replace('return postMessage', 'postMessage');
	      fn1 = "onmessage = " + fn1;
	      fn2 = this._getFrame.toString();
	      fn2 = fn2.replace('function', 'function _getFrame');
	      mime = "application/javascript";
	      blobOnMessage = new Blob([fn1], {
	        type: mime
	      });
	      blobGetFrame = new Blob([fn2], {
	        type: mime
	      });
	      URL = window.URL || window.webkitURL;
	      urlOnMessage = URL.createObjectURL(blobOnMessage);
	      urlGetFrame = URL.createObjectURL(blobGetFrame);
	      worker = new Worker(urlOnMessage);
	      msg = {
	        buffer: buffers[0],
	        bitpix: this.bitpix,
	        bzero: this.bzero,
	        bscale: this.bscale,
	        url: urlGetFrame
	      };
	      i = 0;
	      pixels = null;
	      start = 0;
	      worker.onmessage = function(e) {
	        var arr;
	        arr = e.data;
	        if (pixels == null) {
	          pixels = new arr.constructor(_this.width * _this.height);
	        }
	        pixels.set(arr, start);
	        start += arr.length;
	        i += 1;
	        if (i === _this.nBuffers) {
	          _this.invoke(callback, opts, pixels);
	          URL.revokeObjectURL(urlOnMessage);
	          URL.revokeObjectURL(urlGetFrame);
	          return worker.terminate();
	        } else {
	          msg.buffer = buffers[i];
	          return worker.postMessage(msg, [buffers[i]]);
	        }
	      };
	      worker.postMessage(msg, [buffers[0]]);
	    };
	
	    Image.prototype.getFrame = function(frame, callback, opts) {
	      var begin, blobFrame, blobs, buffers, bytesPerBuffer, frameInfo, i, nRowsPerBuffer, reader, start, _i, _ref,
	        _this = this;
	      this.frame = frame || this.frame;
	      frameInfo = this.frameOffsets[this.frame];
	      buffers = frameInfo.buffers;
	      if ((buffers != null ? buffers.length : void 0) === this.nBuffers) {
	        return this._getFrameAsync(buffers, callback, opts);
	      } else {
	        this.frameOffsets[this.frame].buffers = [];
	        begin = frameInfo.begin;
	        blobFrame = this.blob.slice(begin, begin + this.frameLength);
	        blobs = [];
	        nRowsPerBuffer = Math.floor(this.height / this.nBuffers);
	        bytesPerBuffer = nRowsPerBuffer * this.bytes * this.width;
	        for (i = _i = 0, _ref = this.nBuffers - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
	          start = i * bytesPerBuffer;
	          if (i === this.nBuffers - 1) {
	            blobs.push(blobFrame.slice(start));
	          } else {
	            blobs.push(blobFrame.slice(start, start + bytesPerBuffer));
	          }
	        }
	        buffers = [];
	        reader = new FileReader();
	        reader.frame = this.frame;
	        i = 0;
	        reader.onloadend = function(e) {
	          var buffer;
	          frame = e.target.frame;
	          buffer = e.target.result;
	          _this.frameOffsets[frame].buffers.push(buffer);
	          i += 1;
	          if (i === _this.nBuffers) {
	            return _this.getFrame(frame, callback, opts);
	          } else {
	            return reader.readAsArrayBuffer(blobs[i]);
	          }
	        };
	        return reader.readAsArrayBuffer(blobs[0]);
	      }
	    };
	
	    Image.prototype.getFrames = function(frame, number, callback, opts) {
	      var cb,
	        _this = this;
	      cb = function(arr, opts) {
	        _this.invoke(callback, opts, arr);
	        number -= 1;
	        frame += 1;
	        if (!number) {
	          return;
	        }
	        return _this.getFrame(frame, cb, opts);
	      };
	      return this.getFrame(frame, cb, opts);
	    };
	
	    Image.prototype.isDataCube = function() {
	      if (this.naxis.length > 2) {
	        return true;
	      } else {
	        return false;
	      }
	    };
	
	    return Image;
	
	  })(DataUnit);
	
	  this.astro.FITS.Image = Image;
	
	  Tabular = (function(_super) {
	    __extends(Tabular, _super);
	
	    Tabular.prototype.maxMemory = 1048576;
	
	    function Tabular(header, data) {
	      Tabular.__super__.constructor.apply(this, arguments);
	      this.rowByteSize = header.get("NAXIS1");
	      this.rows = header.get("NAXIS2");
	      this.cols = header.get("TFIELDS");
	      this.length = this.rowByteSize * this.rows;
	      this.heapLength = header.get("PCOUNT");
	      this.columns = this.getColumns(header);
	      if (this.buffer != null) {
	        this.rowsInMemory = this._rowsInMemoryBuffer;
	        this.heap = this.buffer.slice(this.length, this.length + this.heapLength);
	      } else {
	        this.rowsInMemory = this._rowsInMemoryBlob;
	        this.firstRowInBuffer = this.lastRowInBuffer = 0;
	        this.nRowsInBuffer = Math.floor(this.maxMemory / this.rowByteSize);
	      }
	      this.accessors = [];
	      this.descriptors = [];
	      this.elementByteLengths = [];
	      this.setAccessors(header);
	    }
	
	    Tabular.prototype._rowsInMemoryBuffer = function() {
	      return true;
	    };
	
	    Tabular.prototype._rowsInMemoryBlob = function(firstRow, lastRow) {
	      if (firstRow < this.firstRowInBuffer) {
	        return false;
	      }
	      if (lastRow > this.lastRowInBuffer) {
	        return false;
	      }
	      return true;
	    };
	
	    Tabular.prototype.getColumns = function(header) {
	      var columns, i, key, _i, _ref;
	      columns = [];
	      for (i = _i = 1, _ref = this.cols; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
	        key = "TTYPE" + i;
	        if (!header.contains(key)) {
	          return null;
	        }
	        columns.push(header.get(key));
	      }
	      return columns;
	    };
	
	    Tabular.prototype.getColumn = function(name, callback, opts) {
	      var accessor, cb, column, descriptor, elementByteLength, elementByteOffset, factor, i, index, iterations, rowsPerIteration,
	        _this = this;
	      if (this.blob != null) {
	        index = this.columns.indexOf(name);
	        descriptor = this.descriptors[index];
	        accessor = this.accessors[index];
	        elementByteLength = this.elementByteLengths[index];
	        elementByteOffset = this.elementByteLengths.slice(0, index);
	        if (elementByteOffset.length === 0) {
	          elementByteOffset = 0;
	        } else {
	          elementByteOffset = elementByteOffset.reduce(function(a, b) {
	            return a + b;
	          });
	        }
	        column = this.typedArray[descriptor] != null ? new this.typedArray[descriptor](this.rows) : [];
	        rowsPerIteration = ~~(this.maxMemory / this.rowByteSize);
	        rowsPerIteration = Math.min(rowsPerIteration, this.rows);
	        factor = this.rows / rowsPerIteration;
	        iterations = Math.floor(factor) === factor ? factor : Math.floor(factor) + 1;
	        i = 0;
	        index = 0;
	        cb = function(buffer, opts) {
	          var nRows, offset, startRow, view;
	          nRows = buffer.byteLength / _this.rowByteSize;
	          view = new DataView(buffer);
	          offset = elementByteOffset;
	          while (nRows--) {
	            column[i] = accessor(view, offset)[0];
	            i += 1;
	            offset += _this.rowByteSize;
	          }
	          iterations -= 1;
	          index += 1;
	          if (iterations) {
	            startRow = index * rowsPerIteration;
	            return _this.getTableBuffer(startRow, rowsPerIteration, cb, opts);
	          } else {
	            _this.invoke(callback, opts, column);
	          }
	        };
	        return this.getTableBuffer(0, rowsPerIteration, cb, opts);
	      } else {
	        cb = function(rows, opts) {
	          column = rows.map(function(d) {
	            return d[name];
	          });
	          return _this.invoke(callback, opts, column);
	        };
	        return this.getRows(0, this.rows, cb, opts);
	      }
	    };
	
	    Tabular.prototype.getTableBuffer = function(row, number, callback, opts) {
	      var begin, blobRows, end, reader,
	        _this = this;
	      number = Math.min(this.rows - row, number);
	      begin = row * this.rowByteSize;
	      end = begin + number * this.rowByteSize;
	      blobRows = this.blob.slice(begin, end);
	      reader = new FileReader();
	      reader.row = row;
	      reader.number = number;
	      reader.onloadend = function(e) {
	        return _this.invoke(callback, opts, e.target.result);
	      };
	      return reader.readAsArrayBuffer(blobRows);
	    };
	
	    Tabular.prototype.getRows = function(row, number, callback, opts) {
	      var begin, blobRows, buffer, end, reader, rows,
	        _this = this;
	      if (this.rowsInMemory(row, row + number)) {
	        if (this.blob != null) {
	          buffer = this.buffer;
	        } else {
	          begin = row * this.rowByteSize;
	          end = begin + number * this.rowByteSize;
	          buffer = this.buffer.slice(begin, end);
	        }
	        rows = this._getRows(buffer, number);
	        this.invoke(callback, opts, rows);
	        return rows;
	      } else {
	        begin = row * this.rowByteSize;
	        end = begin + Math.max(this.nRowsInBuffer * this.rowByteSize, number * this.rowByteSize);
	        blobRows = this.blob.slice(begin, end);
	        reader = new FileReader();
	        reader.row = row;
	        reader.number = number;
	        reader.onloadend = function(e) {
	          var target;
	          target = e.target;
	          _this.buffer = target.result;
	          _this.firstRowInBuffer = _this.lastRowInBuffer = target.row;
	          _this.lastRowInBuffer += target.number;
	          return _this.getRows(row, number, callback, opts);
	        };
	        return reader.readAsArrayBuffer(blobRows);
	      }
	    };
	
	    return Tabular;
	
	  })(DataUnit);
	
	  this.astro.FITS.Tabular = Tabular;
	
	  Table = (function(_super) {
	    __extends(Table, _super);
	
	    function Table() {
	      _ref = Table.__super__.constructor.apply(this, arguments);
	      return _ref;
	    }
	
	    Table.prototype.dataAccessors = {
	      A: function(value) {
	        return value.trim();
	      },
	      I: function(value) {
	        return parseInt(value);
	      },
	      F: function(value) {
	        return parseFloat(value);
	      },
	      E: function(value) {
	        return parseFloat(value);
	      },
	      D: function(value) {
	        return parseFloat(value);
	      }
	    };
	
	    Table.prototype.setAccessors = function(header) {
	      var descriptor, form, i, match, pattern, type, _i, _ref1, _results,
	        _this = this;
	      pattern = /([AIFED])(\d+)\.*(\d+)*/;
	      _results = [];
	      for (i = _i = 1, _ref1 = this.cols; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
	        form = header.get("TFORM" + i);
	        type = header.get("TTYPE" + i);
	        match = pattern.exec(form);
	        descriptor = match[1];
	        _results.push((function(descriptor) {
	          var accessor;
	          accessor = function(value) {
	            return _this.dataAccessors[descriptor](value);
	          };
	          return _this.accessors.push(accessor);
	        })(descriptor));
	      }
	      return _results;
	    };
	
	    Table.prototype._getRows = function(buffer) {
	      var accessor, arr, begin, end, i, index, line, nRows, row, rows, subarray, value, _i, _j, _k, _len, _len1, _ref1, _ref2;
	      nRows = buffer.byteLength / this.rowByteSize;
	      arr = new Uint8Array(buffer);
	      rows = [];
	      for (i = _i = 0, _ref1 = nRows - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
	        begin = i * this.rowByteSize;
	        end = begin + this.rowByteSize;
	        subarray = arr.subarray(begin, end);
	        line = '';
	        for (_j = 0, _len = subarray.length; _j < _len; _j++) {
	          value = subarray[_j];
	          line += String.fromCharCode(value);
	        }
	        line = line.trim().split(/\s+/);
	        row = {};
	        _ref2 = this.accessors;
	        for (index = _k = 0, _len1 = _ref2.length; _k < _len1; index = ++_k) {
	          accessor = _ref2[index];
	          value = line[index];
	          row[this.columns[index]] = accessor(value);
	        }
	        rows.push(row);
	      }
	      return rows;
	    };
	
	    return Table;
	
	  })(Tabular);
	
	  this.astro.FITS.Table = Table;
	
	  BinaryTable = (function(_super) {
	    __extends(BinaryTable, _super);
	
	    function BinaryTable() {
	      _ref1 = BinaryTable.__super__.constructor.apply(this, arguments);
	      return _ref1;
	    }
	
	    BinaryTable.prototype.typedArray = {
	      B: Uint8Array,
	      I: Uint16Array,
	      J: Uint32Array,
	      E: Float32Array,
	      D: Float64Array,
	      1: Uint8Array,
	      2: Uint16Array,
	      4: Uint32Array
	    };
	
	    BinaryTable.offsets = {
	      L: 1,
	      B: 1,
	      I: 2,
	      J: 4,
	      K: 8,
	      A: 1,
	      E: 4,
	      D: 8,
	      C: 8,
	      M: 16
	    };
	
	    BinaryTable.prototype.dataAccessors = {
	      L: function(view, offset) {
	        var val, x;
	        x = view.getInt8(offset);
	        offset += 1;
	        val = x === 84 ? true : false;
	        return [val, offset];
	      },
	      B: function(view, offset) {
	        var val;
	        val = view.getUint8(offset);
	        offset += 1;
	        return [val, offset];
	      },
	      I: function(view, offset) {
	        var val;
	        val = view.getInt16(offset);
	        offset += 2;
	        return [val, offset];
	      },
	      J: function(view, offset) {
	        var val;
	        val = view.getInt32(offset);
	        offset += 4;
	        return [val, offset];
	      },
	      K: function(view, offset) {
	        var factor, highByte, lowByte, mod, val;
	        highByte = Math.abs(view.getInt32(offset));
	        offset += 4;
	        lowByte = Math.abs(view.getInt32(offset));
	        offset += 4;
	        mod = highByte % 10;
	        factor = mod ? -1 : 1;
	        highByte -= mod;
	        val = factor * ((highByte << 32) | lowByte);
	        return [val, offset];
	      },
	      A: function(view, offset) {
	        var val;
	        val = view.getUint8(offset);
	        val = String.fromCharCode(val);
	        offset += 1;
	        return [val, offset];
	      },
	      E: function(view, offset) {
	        var val;
	        val = view.getFloat32(offset);
	        offset += 4;
	        return [val, offset];
	      },
	      D: function(view, offset) {
	        var val;
	        val = view.getFloat64(offset);
	        offset += 8;
	        return [val, offset];
	      },
	      C: function(view, offset) {
	        var val, val1, val2;
	        val1 = view.getFloat32(offset);
	        offset += 4;
	        val2 = view.getFloat32(offset);
	        offset += 4;
	        val = [val1, val2];
	        return [val, offset];
	      },
	      M: function(view, offset) {
	        var val, val1, val2;
	        val1 = view.getFloat64(offset);
	        offset += 8;
	        val2 = view.getFloat64(offset);
	        offset += 8;
	        val = [val1, val2];
	        return [val, offset];
	      }
	    };
	
	    BinaryTable.prototype.toBits = function(byte) {
	      var arr, i;
	      arr = [];
	      i = 128;
	      while (i >= 1) {
	        arr.push((byte & i ? 1 : 0));
	        i /= 2;
	      }
	      return arr;
	    };
	
	    BinaryTable.prototype.getFromHeap = function(view, offset, descriptor) {
	      var arr, heapOffset, heapSlice, i, length;
	      length = view.getInt32(offset);
	      offset += 4;
	      heapOffset = view.getInt32(offset);
	      offset += 4;
	      heapSlice = this.heap.slice(heapOffset, heapOffset + length);
	      arr = new this.typedArray[descriptor](heapSlice);
	      i = arr.length;
	      while (i--) {
	        arr[i] = this.constructor.swapEndian[descriptor](arr[i]);
	      }
	      return [arr, offset];
	    };
	
	    BinaryTable.prototype.setAccessors = function(header) {
	      var count, descriptor, form, i, isArray, match, pattern, type, _i, _ref2, _results,
	        _this = this;
	      pattern = /(\d*)([P|Q]*)([L|X|B|I|J|K|A|E|D|C|M]{1})/;
	      _results = [];
	      for (i = _i = 1, _ref2 = this.cols; 1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 1 <= _ref2 ? ++_i : --_i) {
	        form = header.get("TFORM" + i);
	        type = header.get("TTYPE" + i);
	        match = pattern.exec(form);
	        count = parseInt(match[1]) || 1;
	        isArray = match[2];
	        descriptor = match[3];
	        _results.push((function(descriptor, count) {
	          var accessor, nBytes;
	          _this.descriptors.push(descriptor);
	          _this.elementByteLengths.push(_this.constructor.offsets[descriptor] * count);
	          if (isArray) {
	            switch (type) {
	              case "COMPRESSED_DATA":
	                accessor = function(view, offset) {
	                  var arr, pixels, _ref3;
	                  _ref3 = _this.getFromHeap(view, offset, descriptor), arr = _ref3[0], offset = _ref3[1];
	                  pixels = new _this.typedArray[_this.algorithmParameters["BYTEPIX"]](_this.ztile[0]);
	                  Decompress.Rice(arr, _this.algorithmParameters["BLOCKSIZE"], _this.algorithmParameters["BYTEPIX"], pixels, _this.ztile[0], Decompress.RiceSetup);
	                  return [pixels, offset];
	                };
	                break;
	              case "GZIP_COMPRESSED_DATA":
	                accessor = function(view, offset) {
	                  var arr;
	                  arr = new Float32Array(_this.width);
	                  i = arr.length;
	                  while (i--) {
	                    arr[i] = NaN;
	                  }
	                  return [arr, offset];
	                };
	                break;
	              default:
	                accessor = function(view, offset) {
	                  return _this.getFromHeap(view, offset, descriptor);
	                };
	            }
	          } else {
	            if (count === 1) {
	              accessor = function(view, offset) {
	                var value, _ref3;
	                _ref3 = _this.dataAccessors[descriptor](view, offset), value = _ref3[0], offset = _ref3[1];
	                return [value, offset];
	              };
	            } else {
	              if (descriptor === 'X') {
	                nBytes = Math.log(count) / Math.log(2);
	                accessor = function(view, offset) {
	                  var arr, bits, buffer, byte, bytes, _j, _len;
	                  buffer = view.buffer.slice(offset, offset + nBytes);
	                  bytes = new Uint8Array(buffer);
	                  bits = [];
	                  for (_j = 0, _len = bytes.length; _j < _len; _j++) {
	                    byte = bytes[_j];
	                    arr = _this.toBits(byte);
	                    bits = bits.concat(arr);
	                  }
	                  offset += nBytes;
	                  return [bits.slice(0, +(count - 1) + 1 || 9e9), offset];
	                };
	              } else if (descriptor === 'A') {
	                accessor = function(view, offset) {
	                  var arr, buffer, s, value, _j, _len;
	                  buffer = view.buffer.slice(offset, offset + count);
	                  arr = new Uint8Array(buffer);
	                  s = '';
	                  for (_j = 0, _len = arr.length; _j < _len; _j++) {
	                    value = arr[_j];
	                    s += String.fromCharCode(value);
	                  }
	                  s = s.trim();
	                  offset += count;
	                  return [s, offset];
	                };
	              } else {
	                accessor = function(view, offset) {
	                  var data, value, _ref3;
	                  i = count;
	                  data = [];
	                  while (i--) {
	                    _ref3 = _this.dataAccessors[descriptor](view, offset), value = _ref3[0], offset = _ref3[1];
	                    data.push(value);
	                  }
	                  return [data, offset];
	                };
	              }
	            }
	          }
	          return _this.accessors.push(accessor);
	        })(descriptor, count));
	      }
	      return _results;
	    };
	
	    BinaryTable.prototype._getRows = function(buffer, nRows) {
	      var accessor, index, offset, row, rows, value, view, _i, _len, _ref2, _ref3;
	      view = new DataView(buffer);
	      offset = 0;
	      rows = [];
	      while (nRows--) {
	        row = {};
	        _ref2 = this.accessors;
	        for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
	          accessor = _ref2[index];
	          _ref3 = accessor(view, offset), value = _ref3[0], offset = _ref3[1];
	          row[this.columns[index]] = value;
	        }
	        rows.push(row);
	      }
	      return rows;
	    };
	
	    return BinaryTable;
	
	  })(Tabular);
	
	  this.astro.FITS.BinaryTable = BinaryTable;
	
	  Decompress = {
	    RiceSetup: {
	      1: function(array) {
	        var fsbits, fsmax, lastpix, pointer;
	        pointer = 1;
	        fsbits = 3;
	        fsmax = 6;
	        lastpix = array[0];
	        return [fsbits, fsmax, lastpix, pointer];
	      },
	      2: function(array) {
	        var bytevalue, fsbits, fsmax, lastpix, pointer;
	        pointer = 2;
	        fsbits = 4;
	        fsmax = 14;
	        lastpix = 0;
	        bytevalue = array[0];
	        lastpix = lastpix | (bytevalue << 8);
	        bytevalue = array[1];
	        lastpix = lastpix | bytevalue;
	        return [fsbits, fsmax, lastpix, pointer];
	      },
	      4: function(array) {
	        var bytevalue, fsbits, fsmax, lastpix, pointer;
	        pointer = 4;
	        fsbits = 5;
	        fsmax = 25;
	        lastpix = 0;
	        bytevalue = array[0];
	        lastpix = lastpix | (bytevalue << 24);
	        bytevalue = array[1];
	        lastpix = lastpix | (bytevalue << 16);
	        bytevalue = array[2];
	        lastpix = lastpix | (bytevalue << 8);
	        bytevalue = array[3];
	        lastpix = lastpix | bytevalue;
	        return [fsbits, fsmax, lastpix, pointer];
	      }
	    },
	    Rice: function(array, blocksize, bytepix, pixels, nx, setup) {
	      var b, bbits, diff, fs, fsbits, fsmax, i, imax, k, lastpix, nbits, nonzeroCount, nzero, pointer, _ref2, _ref3;
	      bbits = 1 << fsbits;
	      _ref2 = setup[bytepix](array), fsbits = _ref2[0], fsmax = _ref2[1], lastpix = _ref2[2], pointer = _ref2[3];
	      nonzeroCount = new Uint8Array(256);
	      nzero = 8;
	      _ref3 = [128, 255], k = _ref3[0], i = _ref3[1];
	      while (i >= 0) {
	        while (i >= k) {
	          nonzeroCount[i] = nzero;
	          i -= 1;
	        }
	        k = k / 2;
	        nzero -= 1;
	      }
	      nonzeroCount[0] = 0;
	      b = array[pointer++];
	      nbits = 8;
	      i = 0;
	      while (i < nx) {
	        nbits -= fsbits;
	        while (nbits < 0) {
	          b = (b << 8) | array[pointer++];
	          nbits += 8;
	        }
	        fs = (b >> nbits) - 1;
	        b &= (1 << nbits) - 1;
	        imax = i + blocksize;
	        if (imax > nx) {
	          imax = nx;
	        }
	        if (fs < 0) {
	          while (i < imax) {
	            pixels[i] = lastpix;
	            i += 1;
	          }
	        } else if (fs === fsmax) {
	          while (i < imax) {
	            k = bbits - nbits;
	            diff = b << k;
	            k -= 8;
	            while (k >= 0) {
	              b = array[pointer++];
	              diff |= b << k;
	              k -= 8;
	            }
	            if (nbits > 0) {
	              b = array[pointer++];
	              diff |= b >> (-k);
	              b &= (1 << nbits) - 1;
	            } else {
	              b = 0;
	            }
	            if ((diff & 1) === 0) {
	              diff = diff >> 1;
	            } else {
	              diff = ~(diff >> 1);
	            }
	            pixels[i] = diff + lastpix;
	            lastpix = pixels[i];
	            i++;
	          }
	        } else {
	          while (i < imax) {
	            while (b === 0) {
	              nbits += 8;
	              b = array[pointer++];
	            }
	            nzero = nbits - nonzeroCount[b];
	            nbits -= nzero + 1;
	            b ^= 1 << nbits;
	            nbits -= fs;
	            while (nbits < 0) {
	              b = (b << 8) | array[pointer++];
	              nbits += 8;
	            }
	            diff = (nzero << fs) | (b >> nbits);
	            b &= (1 << nbits) - 1;
	            if ((diff & 1) === 0) {
	              diff = diff >> 1;
	            } else {
	              diff = ~(diff >> 1);
	            }
	            pixels[i] = diff + lastpix;
	            lastpix = pixels[i];
	            i++;
	          }
	        }
	      }
	      return pixels;
	    }
	  };
	
	  this.astro.FITS.Decompress = Decompress;
	
	  CompressedImage = (function(_super) {
	    __extends(CompressedImage, _super);
	
	    CompressedImage.include(ImageUtils);
	
	    CompressedImage.extend(Decompress);
	
	    CompressedImage.randomGenerator = function() {
	      var a, i, m, random, seed, temp, _i;
	      a = 16807;
	      m = 2147483647;
	      seed = 1;
	      random = new Float32Array(10000);
	      for (i = _i = 0; _i <= 9999; i = ++_i) {
	        temp = a * seed;
	        seed = temp - m * parseInt(temp / m);
	        random[i] = seed / m;
	      }
	      return random;
	    };
	
	    CompressedImage.randomSequence = CompressedImage.randomGenerator();
	
	    function CompressedImage(header, data) {
	      var i, key, value, ztile, _i, _ref2;
	      CompressedImage.__super__.constructor.apply(this, arguments);
	      this.zcmptype = header.get("ZCMPTYPE");
	      this.zbitpix = header.get("ZBITPIX");
	      this.znaxis = header.get("ZNAXIS");
	      this.zblank = header.get("ZBLANK");
	      this.blank = header.get("BLANK");
	      this.zdither = header.get('ZDITHER0') || 0;
	      this.ztile = [];
	      for (i = _i = 1, _ref2 = this.znaxis; 1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 1 <= _ref2 ? ++_i : --_i) {
	        ztile = header.contains("ZTILE" + i) ? header.get("ZTILE" + i) : i === 1 ? header.get("ZNAXIS1") : 1;
	        this.ztile.push(ztile);
	      }
	      this.width = header.get("ZNAXIS1");
	      this.height = header.get("ZNAXIS2") || 1;
	      this.algorithmParameters = {};
	      if (this.zcmptype === 'RICE_1') {
	        this.algorithmParameters["BLOCKSIZE"] = 32;
	        this.algorithmParameters["BYTEPIX"] = 4;
	      }
	      i = 1;
	      while (true) {
	        key = "ZNAME" + i;
	        if (!header.contains(key)) {
	          break;
	        }
	        value = "ZVAL" + i;
	        this.algorithmParameters[header.get(key)] = header.get(value);
	        i += 1;
	      }
	      this.zmaskcmp = header.get("ZMASKCMP");
	      this.zquantiz = header.get("ZQUANTIZ") || "LINEAR_SCALING";
	      this.bzero = header.get("BZERO") || 0;
	      this.bscale = header.get("BSCALE") || 1;
	    }
	
	    CompressedImage.prototype._getRows = function(buffer, nRows) {
	      var accessor, arr, blank, data, i, index, nTile, offset, r, rIndex, row, scale, seed0, seed1, value, view, zero, _i, _j, _len, _len1, _ref2, _ref3;
	      view = new DataView(buffer);
	      offset = 0;
	      arr = new Float32Array(this.width * this.height);
	      while (nRows--) {
	        row = {};
	        _ref2 = this.accessors;
	        for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
	          accessor = _ref2[index];
	          _ref3 = accessor(view, offset), value = _ref3[0], offset = _ref3[1];
	          row[this.columns[index]] = value;
	        }
	        data = row['COMPRESSED_DATA'] || row['UNCOMPRESSED_DATA'] || row['GZIP_COMPRESSED_DATA'];
	        blank = row['ZBLANK'] || this.zblank;
	        scale = row['ZSCALE'] || this.bscale;
	        zero = row['ZZERO'] || this.bzero;
	        nTile = this.height - nRows;
	        seed0 = nTile + this.zdither - 1;
	        seed1 = (seed0 - 1) % 10000;
	        rIndex = parseInt(this.constructor.randomSequence[seed1] * 500);
	        for (index = _j = 0, _len1 = data.length; _j < _len1; index = ++_j) {
	          value = data[index];
	          i = (nTile - 1) * this.width + index;
	          if (value === -2147483647) {
	            arr[i] = NaN;
	          } else if (value === -2147483646) {
	            arr[i] = 0;
	          } else {
	            r = this.constructor.randomSequence[rIndex];
	            arr[i] = (value - r + 0.5) * scale + zero;
	          }
	          rIndex += 1;
	          if (rIndex === 10000) {
	            seed1 = (seed1 + 1) % 10000;
	            rIndex = parseInt(this.randomSequence[seed1] * 500);
	          }
	        }
	      }
	      return arr;
	    };
	
	    CompressedImage.prototype.getFrame = function(nFrame, callback, opts) {
	      var heapBlob, reader,
	        _this = this;
	      if (this.heap) {
	        this.frame = nFrame || this.frame;
	        return this.getRows(0, this.rows, callback, opts);
	      } else {
	        heapBlob = this.blob.slice(this.length, this.length + this.heapLength);
	        reader = new FileReader();
	        reader.onloadend = function(e) {
	          _this.heap = e.target.result;
	          return _this.getFrame(nFrame, callback, opts);
	        };
	        return reader.readAsArrayBuffer(heapBlob);
	      }
	    };
	
	    return CompressedImage;
	
	  })(BinaryTable);
	
	  this.astro.FITS.CompressedImage = CompressedImage;
	
	  HDU = (function() {
	    function HDU(header, data) {
	      this.header = header;
	      this.data = data;
	    }
	
	    HDU.prototype.hasData = function() {
	      if (this.data != null) {
	        return true;
	      } else {
	        return false;
	      }
	    };
	
	    return HDU;
	
	  })();
	
	  this.astro.FITS.HDU = HDU;
	
	}).call(this);
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File MOC
	 *
	 * This class represents a MOC (Multi Order Coverage map) layer
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	MOC = (function() {
	    MOC = function(options) {
	        this.order = undefined;
	
	        this.type = 'moc';
	
	        // TODO homogenize options parsing for all kind of overlay (footprints, catalog, MOC)
	        options = options || {};
	        this.name = options.name || "MOC";
	        this.color = options.color || Color.getNextColor();
	        this.opacity = options.opacity || 1;
	        this.opacity = Math.max(0, Math.min(1, this.opacity)); // 0 <= this.opacity <= 1
	        this.lineWidth = options["lineWidth"] || 1;
	        this.adaptativeDisplay = options['adaptativeDisplay'] !== false;
	
	        this.proxyCalled = false; // this is a flag to check whether we already tried to load the MOC through the proxy
	
	        // index of MOC cells at high and low resolution
	        this._highResIndexOrder3 = new Array(768);
	        this._lowResIndexOrder3 = new Array(768);
	        for (var k=0; k<768; k++) {
	            this._highResIndexOrder3[k] = {};
	            this._lowResIndexOrder3[k] = {};
	        }
	
	        this.nbCellsDeepestLevel = 0; // needed to compute the sky fraction of the MOC
	
	        this.isShowing = true;
	        this.ready = false;
	    }
	
	    
	    function log2(val) {
	        return Math.log(val) / Math.LN2;
	    }
	
	    // max norder we can currently handle (limitation of healpix.js)
	    MOC.MAX_NORDER = 13; // NSIDE = 8192
	
	    MOC.LOWRES_MAXORDER = 6; // 5 or 6 ??
	    MOC.HIGHRES_MAXORDER = 11; // ??
	
	    // TODO: options to modifiy this ?
	    MOC.PIVOT_FOV = 30; // when do we switch from low res cells to high res cells (fov in degrees)
	
	    // at end of parsing, we need to remove duplicates from the 2 indexes
	    MOC.prototype._removeDuplicatesFromIndexes = function() {
	        var a, aDedup;
	        for (var k=0; k<768; k++) {
	            for (var key in this._highResIndexOrder3[k]) {
	                a = this._highResIndexOrder3[k][key];
	                aDedup = uniq(a);
	                this._highResIndexOrder3[k][key] = aDedup;
	            }
	            for (var key in this._lowResIndexOrder3[k]) {
	                a = this._lowResIndexOrder3[k][key];
	                aDedup = uniq(a);
	                this._lowResIndexOrder3[k][key] = aDedup;
	            }
	        }
	        
	    }
	
	    // add pixel (order, ipix)
	    MOC.prototype._addPix = function(order, ipix) {
	        var ipixOrder3 = Math.floor( ipix * Math.pow(4, (3 - order)) );
	        // fill low and high level cells
	        // 1. if order <= LOWRES_MAXORDER, just store value in low and high res cells
	        if (order<=MOC.LOWRES_MAXORDER) {
	            if (! (order in this._lowResIndexOrder3[ipixOrder3])) {
	                this._lowResIndexOrder3[ipixOrder3][order] = [];
	                this._highResIndexOrder3[ipixOrder3][order] = [];
	            }
	            this._lowResIndexOrder3[ipixOrder3][order].push(ipix);
	            this._highResIndexOrder3[ipixOrder3][order].push(ipix);
	        }
	        // 2. if LOWRES_MAXORDER < order <= HIGHRES_MAXORDER , degrade ipix for low res cells
	        else if (order<=MOC.HIGHRES_MAXORDER) {
	            if (! (order in this._highResIndexOrder3[ipixOrder3])) {
	                this._highResIndexOrder3[ipixOrder3][order] = [];
	            }
	            this._highResIndexOrder3[ipixOrder3][order].push(ipix);
	            
	            var degradedOrder = MOC.LOWRES_MAXORDER; 
	            var degradedIpix  = Math.floor(ipix / Math.pow(4, (order - degradedOrder)));
	            var degradedIpixOrder3 = Math.floor( degradedIpix * Math.pow(4, (3 - degradedOrder)) );
	            if (! (degradedOrder in this._lowResIndexOrder3[degradedIpixOrder3])) {
	                this._lowResIndexOrder3[degradedIpixOrder3][degradedOrder]= [];
	            }
	            this._lowResIndexOrder3[degradedIpixOrder3][degradedOrder].push(degradedIpix);
	        }
	        // 3. if order > HIGHRES_MAXORDER , degrade ipix for low res and high res cells
	        else {
	            // low res cells
	            var degradedOrder = MOC.LOWRES_MAXORDER; 
	            var degradedIpix  = Math.floor(ipix / Math.pow(4, (order - degradedOrder)));
	            var degradedIpixOrder3 = Math.floor(degradedIpix * Math.pow(4, (3 - degradedOrder)) );
	            if (! (degradedOrder in this._lowResIndexOrder3[degradedIpixOrder3])) {
	                this._lowResIndexOrder3[degradedIpixOrder3][degradedOrder]= [];
	            }
	            this._lowResIndexOrder3[degradedIpixOrder3][degradedOrder].push(degradedIpix);
	
	            
	            // high res cells
	            degradedOrder = MOC.HIGHRES_MAXORDER; 
	            degradedIpix  = Math.floor(ipix / Math.pow(4, (order - degradedOrder)));
	            var degradedIpixOrder3 = Math.floor(degradedIpix * Math.pow(4, (3 - degradedOrder)) );
	            if (! (degradedOrder in this._highResIndexOrder3[degradedIpixOrder3])) {
	                this._highResIndexOrder3[degradedIpixOrder3][degradedOrder]= [];
	            }
	            this._highResIndexOrder3[degradedIpixOrder3][degradedOrder].push(degradedIpix);
	        }
	
	        this.nbCellsDeepestLevel += Math.pow(4, (this.order - order));
	    };
	
	
	    /**
	     *  Return a value between 0 and 1 denoting the fraction of the sky
	     *  covered by the MOC
	     */
	    MOC.prototype.skyFraction = function() {
	        return this.nbCellsDeepestLevel / (12 * Math.pow(4, this.order));
	    };
	
	    /**
	     * set MOC data by parsing a MOC serialized in JSON
	     * (as defined in IVOA MOC document, section 3.1.1)
	     */
	    MOC.prototype.dataFromJSON = function(jsonMOC) {
	        var order, ipix;
	        for (var orderStr in jsonMOC) {
	            if (jsonMOC.hasOwnProperty(orderStr)) {
	                order = parseInt(orderStr);
	                if (this.order===undefined || order > this.order) {
	                    this.order = order;
	                }
	                for (var k=0; k<jsonMOC[orderStr].length; k++) {
	                    ipix = jsonMOC[orderStr][k];
	                    this._addPix(order, ipix);
	                }
	            }
	        }
	
	        this.reportChange();
	        this.ready = true;
	    };
	
	    /**
	     * set MOC data by parsing a URL pointing to a FITS MOC file
	     */
	    MOC.prototype.dataFromFITSURL = function(mocURL, successCallback) {
	        var self = this;
	        var callback = function() {
	            // note: in the callback, 'this' refers to the FITS instance
	
	            // first, let's find MOC norder
	            var hdr0;
	            try {
	                // A zero-length hdus array might mean the served URL does not have CORS header
	                // --> let's try again through the proxy
	                if (this.hdus.length == 0) {
	                    if (self.proxyCalled !== true) {
	                        self.proxyCalled = true;
	                        var proxiedURL = Aladin.JSONP_PROXY + '?url=' + encodeURIComponent(self.dataURL);
	                        new astro.FITS(proxiedURL, callback);
	                    }
	
	                    return;
	                }
	                hdr0 = this.getHeader(0);
	            }
	            catch (e) {
	                console.error('Could not get header of extension #0');
	                return;
	            }
	            var hdr1 = this.getHeader(1);
	
	            if (hdr0.contains('HPXMOC')) {
	                self.order = hdr0.get('HPXMOC')
	            }
	            else if (hdr0.contains('MOCORDER')) {
	                self.order = hdr0.get('MOCORDER')
	            }
	            else if (hdr1.contains('HPXMOC')) {
	                self.order = hdr1.get('HPXMOC')
	            }
	            else if (hdr1.contains('MOCORDER')) {
	                self.order = hdr1.get('MOCORDER')
	            }
	            else {
	                console.error('Can not find MOC order in FITS file');
	                return;
	            }
	
	
	            var data = this.getDataUnit(1);
	            var colName = data.columns[0];
	            data.getRows(0, data.rows, function(rows) {
	                for (var k=0; k<rows.length; k++) {
	                    var uniq = rows[k][colName];
	                    var order = Math.floor(Math.floor(log2(Math.floor(uniq/4))) / 2);
	                    var ipix = uniq - 4 *(Math.pow(4, order));
	
	
	
	                    self._addPix(order, ipix);
	                }
	
	            });
	            data = null; // this helps releasing memory
	
	            self._removeDuplicatesFromIndexes();
	
	            if (successCallback) {
	                successCallback();
	            }
	
	            self.reportChange();
	            self.ready = true;
	        }; // end of callback function
	
	        this.dataURL = mocURL;
	
	        // instantiate the FITS object which will fetch the URL passed as parameter
	        new astro.FITS(this.dataURL, callback);
	    };
	
	    MOC.prototype.setView = function(view) {
	        this.view = view;
	        this.reportChange();
	    };
	    
	    MOC.prototype.draw = function(ctx, projection, viewFrame, width, height, largestDim, zoomFactor, fov) {
	        if (! this.isShowing || ! this.ready) {
	            return;
	        }
	
	        var mocCells = fov > MOC.PIVOT_FOV && this.adaptativeDisplay ? this._lowResIndexOrder3 : this._highResIndexOrder3;
	
	        this._drawCells(ctx, mocCells, fov, projection, viewFrame, CooFrameEnum.J2000, width, height, largestDim, zoomFactor);
	    };
	
	    MOC.prototype._drawCells = function(ctx, mocCellsIdxOrder3, fov, projection, viewFrame, surveyFrame, width, height, largestDim, zoomFactor) {
	        ctx.lineWidth = this.lineWidth;
	        // if opacity==1, we draw solid lines, else we fill each HEALPix cell
	        if (this.opacity==1) {
	            ctx.strokeStyle = this.color;
	        }
	        else {
	            ctx.fillStyle = this.color;
	            ctx.globalAlpha = this.opacity;
	        }
	
	
	        ctx.beginPath();
	
	        var orderedKeys = [];
	        for (var k=0; k<768; k++) {
	            var mocCells = mocCellsIdxOrder3[k];
	            for (key in mocCells) {
	                orderedKeys.push(parseInt(key));
	            }
	        }
	        orderedKeys.sort(function(a, b) {return a - b;});
	        var norderMax = orderedKeys[orderedKeys.length-1];
	
	        var nside, xyCorners, ipix;
	        var potentialVisibleHpxCellsOrder3 = this.view.getVisiblePixList(3, CooFrameEnum.J2000);
	        var visibleHpxCellsOrder3 = [];
	        // let's test first all potential visible cells and keep only the one with a projection inside the view
	        for (var k=0; k<potentialVisibleHpxCellsOrder3.length; k++) {
	            var ipix = potentialVisibleHpxCellsOrder3[k];
	            xyCorners = getXYCorners(8, ipix, viewFrame, surveyFrame, width, height, largestDim, zoomFactor, projection); 
	            if (xyCorners) {
	                visibleHpxCellsOrder3.push(ipix);
	            }
	        }
	
	        var counter = 0;
	        var mocCells;
	        for (var norder=1; norder<=norderMax; norder++) {
	            nside = 1 << norder;
	
	            for (var i=0; i<visibleHpxCellsOrder3.length; i++) {
	                var ipixOrder3 = visibleHpxCellsOrder3[i];
	                mocCells = mocCellsIdxOrder3[ipixOrder3];
	                if (typeof mocCells[norder]==='undefined') {
	                    continue;
	                }
	            
	                if (norder<=3) {
	                    for (var j=0; j<mocCells[norder].length; j++) {
	                        ipix = mocCells[norder][j];
	                        var factor = Math.pow(4, (3-norder));
	                        var startIpix = ipix * factor;
	                        for (var k=0; k<factor; k++) {
	                            norder3Ipix = startIpix + k;
	                            xyCorners = getXYCorners(8, norder3Ipix, viewFrame, surveyFrame, width, height, largestDim, zoomFactor, projection);
	                            if (xyCorners) {
	                                drawCorners(ctx, xyCorners);
	                            }
	                        }
	                    }
	                }
	                else {
	                    for (var j=0; j<mocCells[norder].length; j++) {
	                        ipix = mocCells[norder][j];
	                        var parentIpixOrder3 = Math.floor(ipix/Math.pow(4, norder-3));
	                        xyCorners = getXYCorners(nside, ipix, viewFrame, surveyFrame, width, height, largestDim, zoomFactor, projection);
	                        if (xyCorners) {
	                            drawCorners(ctx, xyCorners);
	                        }
	                    }
	                }
	            }
	        }
	
	
	        if (this.opacity==1) {
	            ctx.stroke();
	        }
	        else {
	            ctx.fill();
	            ctx.globalAlpha = 1.0;
	        }
	    };
	
	    var drawCorners = function(ctx, xyCorners) {
	        ctx.moveTo(xyCorners[0].vx, xyCorners[0].vy);
	        ctx.lineTo(xyCorners[1].vx, xyCorners[1].vy);
	        ctx.lineTo(xyCorners[2].vx, xyCorners[2].vy);
	        ctx.lineTo(xyCorners[3].vx, xyCorners[3].vy);
	        ctx.lineTo(xyCorners[0].vx, xyCorners[0].vy);
	    }
	
	    // remove duplicate items from array a
	    var uniq = function(a) {
	        var seen = {};
	        var out = [];
	        var len = a.length;
	        var j = 0;
	        for (var i = 0; i < len; i++) {
	            var item = a[i];
	            if (seen[item] !== 1) {
	                seen[item] = 1;
	                out[j++] = item;
	            }
	        }
	
	        return out;
	    };
	
	
	    // TODO: merge with what is done in View.getVisibleCells
	    var _spVec = new SpatialVector();
	    var getXYCorners = function(nside, ipix, viewFrame, surveyFrame, width, height, largestDim, zoomFactor, projection) {
	        var cornersXYView = [];
	        var cornersXY = [];
	
	        var spVec = _spVec;
	
	        var corners = HealpixCache.corners_nest(ipix, nside);
	        for (var k=0; k<4; k++) {
	            spVec.setXYZ(corners[k].x, corners[k].y, corners[k].z);
	
	            // need for frame transformation ?
	            if (surveyFrame && surveyFrame.system != viewFrame.system) {
	                if (surveyFrame.system == CooFrameEnum.SYSTEMS.J2000) {
	                    var radec = CooConversion.J2000ToGalactic([spVec.ra(), spVec.dec()]);
	                    lon = radec[0];
	                    lat = radec[1];
	                }
	                else if (surveyFrame.system == CooFrameEnum.SYSTEMS.GAL) {
	                    var radec = CooConversion.GalacticToJ2000([spVec.ra(), spVec.dec()]);
	                    lon = radec[0];
	                    lat = radec[1];
	                }
	            }
	            else {
	                lon = spVec.ra();
	                lat = spVec.dec();
	            }
	
	            cornersXY[k] = projection.project(lon, lat);
	        }
	
	
	        if (cornersXY[0] == null ||  cornersXY[1] == null  ||  cornersXY[2] == null ||  cornersXY[3] == null ) {
	            return null;
	        }
	
	        for (var k=0; k<4; k++) {
	            cornersXYView[k] = AladinUtils.xyToView(cornersXY[k].X, cornersXY[k].Y, width, height, largestDim, zoomFactor);
	        }
	
	        var indulge = 10;
	        // detect pixels outside view. Could be improved !
	        // we minimize here the number of cells returned
	        if( cornersXYView[0].vx<0 && cornersXYView[1].vx<0 && cornersXYView[2].vx<0 &&cornersXYView[3].vx<0) {
	            return null;
	        }
	        if( cornersXYView[0].vy<0 && cornersXYView[1].vy<0 && cornersXYView[2].vy<0 &&cornersXYView[3].vy<0) {
	            return null;
	        }
	        if( cornersXYView[0].vx>=width && cornersXYView[1].vx>=width && cornersXYView[2].vx>=width &&cornersXYView[3].vx>=width) {
	            return null;
	        }
	        if( cornersXYView[0].vy>=height && cornersXYView[1].vy>=height && cornersXYView[2].vy>=height &&cornersXYView[3].vy>=height) {
	            return null;
	        }
	
	        cornersXYView = AladinUtils.grow2(cornersXYView, 1);
	        return cornersXYView;
	    };
	
	    MOC.prototype.reportChange = function() {
	        this.view && this.view.requestRedraw();
	    };
	
	    MOC.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        this.reportChange();
	    };
	
	    MOC.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        this.reportChange();
	    };
	
	    // Tests whether a given (ra, dec) point on the sky is within the current MOC object
	    //
	    // returns true if point is contained, false otherwise
	    MOC.prototype.contains = function(ra, dec) {
	        var hpxIdx = new HealpixIndex(Math.pow(2, this.order));
	        hpxIdx.init();
	        var polar = Utils.radecToPolar(ra, dec);
	        var ipix = hpxIdx.ang2pix_nest(polar.theta, polar.phi);
	        var ipixMapByOrder = {};
	        for (var curOrder=0; curOrder<=this.order; curOrder++) {
	            ipixMapByOrder[curOrder] = Math.floor(ipix / Math.pow(4, this.order - curOrder));
	        }
	
	        // first look for large HEALPix cells (order<3)
	        for (var ipixOrder3=0; ipixOrder3<768; ipixOrder3++) {
	            var mocCells = this._highResIndexOrder3[ipixOrder3];
	            for (var order in mocCells) {
	                if (order<3) {
	                    for (var k=mocCells[order].length; k>=0; k--) {
	                        if (ipixMapByOrder[order] == mocCells[order][k]) {
	                            return true;
	                        }   
	                    }
	                }
	            }
	        }
	
	        // look for finer cells
	        var ipixOrder3 = ipixMapByOrder[3];
	        var mocCells = this._highResIndexOrder3[ipixOrder3];
	        for (var order in mocCells) {
	            for (var k=mocCells[order].length; k>=0; k--) {
	                if (ipixMapByOrder[order] == mocCells[order][k]) {
	                    return true;
	                }   
	            }
	        }
	
	        return false;
	    };
	
	
	
	    return MOC;
	
	})();
	
	    
	// Copyright 2015 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File CooGrid
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	CooGrid = (function() {
	    var CooGrid = function() {
	    };
	    
	    function viewxy2lonlat(projection, vx, vy, width, height, largestDim, zoomFactor) {
	        var xy = AladinUtils.viewToXy(vx, vy, width, height, largestDim, zoomFactor);
	        var lonlat;
	        try {
	            lonlat = projection.unproject(xy.x, xy.y);
	        }
	        catch(err) {
	            return null;
	        }
	        return {lon: lonlat.ra, lat: lonlat.dec};
	    };
	    
	    var NB_STEPS = 10;
	    var NB_LINES = 10;
	    
	    CooGrid.prototype.redraw = function(ctx, projection, frame, width, height, largestDim, zoomFactor, fov) {
	        if (fov>60) { // currently not supported
	            return; 
	        }
	        
	        var lonMax = 0, lonMin = 359.9999, latMax = -90, latMin = 90;
	        var lonlat1 = viewxy2lonlat(projection, 0, 0, width, height, largestDim, zoomFactor);
	        var lonlat2 = viewxy2lonlat(projection, width-1, height-1, width, height, largestDim, zoomFactor);
	        lonMin = Math.min(lonlat1.lon, lonlat2.lon);
	        lonMax = Math.max(lonlat1.lon, lonlat2.lon);
	        latMin = Math.min(lonlat1.lat, lonlat2.lat);
	        latMax = Math.max(lonlat1.lat, lonlat2.lat);
	        
	        var lonlat3 = viewxy2lonlat(projection, 0, height-1, width, height, largestDim, zoomFactor);
	        lonMin = Math.min(lonMin, lonlat3.lon);
	        lonMax = Math.max(lonMax, lonlat3.lon);
	        latMin = Math.min(latMin, lonlat3.lat);
	        latMax = Math.max(latMax, lonlat3.lat);
	        
	        var lonlat4 = viewxy2lonlat(projection, width-1, 0, width, height, largestDim, zoomFactor);
	        lonMin = Math.min(lonMin, lonlat4.lon);
	        lonMax = Math.max(lonMax, lonlat4.lon);
	        latMin = Math.min(latMin, lonlat4.lat);
	        latMax = Math.max(latMax, lonlat4.lat);
	        
	
	        
	        var lonDiff = lonMax - lonMin;
	        var latDiff = latMax - latMin;
	        
	        var LON_STEP, LAT_STEP;
	        if (fov>10) {
	            LON_STEP = 4;
	            LAT_STEP = 4;
	        }
	        else if (fov>1) {
	            LON_STEP = 1;
	            LAT_STEP = 1;
	        }
	        else if (fov>0.1) {
	            LON_STEP = 0.1;
	            LAT_STEP = 0.1;
	        }
	        else {
	            LON_STEP = 0.01;
	            LAT_STEP = 0.01;
	        }
	        
	        var lonStart = Math.round(lonMin % LON_STEP) * (LON_STEP);
	        var latStart = Math.round(latMin % LAT_STEP) * (LAT_STEP);
	        
	        
	        
	        ctx.lineWidth = 1;
	        ctx.strokeStyle = "rgb(120,120,255)";
	        // draw iso-latitudes lines
	        for (var lat=latStart; lat<latMax+LAT_STEP; lat+=LAT_STEP) {
	            ctx.beginPath();
	            
	            var vxy;
	            vxy = AladinUtils.radecToViewXy(lonMin, lat, projection, CooFrameEnum.J2000, width, height, largestDim, zoomFactor);
	            if (!vxy) {
	                continue;
	            }
	            ctx.moveTo(vxy.vx, vxy.vy);
	            var k = 0;
	            for (var lon=lonMin; lon<lonMax+LON_STEP; lon+=lonDiff/10) {
	                k++;
	                vxy = AladinUtils.radecToViewXy(lon, lat, projection, CooFrameEnum.J2000, width, height, largestDim, zoomFactor);
	                ctx.lineTo(vxy.vx, vxy.vy);
	                if (k==3 ) {
	                    ctx.strokeText(lat.toFixed(2), vxy.vx, vxy.vy-2);
	                }
	                
	            }
	            ctx.stroke();
	        }
	        
	        for (var lon=lonStart; lon<lonMax+LON_STEP; lon+=LON_STEP) {
	            ctx.beginPath();
	            
	            var vxy;
	            vxy = AladinUtils.radecToViewXy(lon, latMin, projection, CooFrameEnum.J2000, width, height, largestDim, zoomFactor);
	            if (!vxy) {
	                continue;
	            }
	            ctx.moveTo(vxy.vx, vxy.vy);
	            var k = 0;
	            for (var lat=latMin; lat<latMax+LAT_STEP; lat+=latDiff/10) {
	                k++;
	                vxy = AladinUtils.radecToViewXy(lon, lat, projection, CooFrameEnum.J2000, width, height, largestDim, zoomFactor);
	                ctx.lineTo(vxy.vx, vxy.vy);
	                if (k==3 ) {
	                    ctx.strokeText(lon.toFixed(2), vxy.vx, vxy.vy-2);
	                }
	            }
	            ctx.stroke();
	        }
	        
	        
	        
	    };
	
	    
	    
	    return CooGrid;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Footprint
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Footprint = (function() {
	    // constructor
	    Footprint = function(polygons) {
	        this.polygons = polygons;
	    	this.overlay = null;
	
	        // TODO : all graphic overlays should have an id
	        this.id = 'footprint-' + Utils.uuidv4();
	    	
	    	this.isShowing = true;
	    	this.isSelected = false;
	    };
	    
	    Footprint.prototype.setOverlay = function(overlay) {
	        this.overlay = overlay;
	    };
	    
	    Footprint.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Footprint.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	
	    Footprint.prototype.dispatchClickEvent = function() {
	        if (this.overlay) {
	            // footprint selection code adapted from Fabrizzio Giordano dev. from Serco for ESA/ESDC
	            //window.dispatchEvent(new CustomEvent("footprintClicked", {
	            this.overlay.view.aladinDiv.dispatchEvent(new CustomEvent("footprintClicked", {
	                detail: {
	                    footprintId: this.id,
	                    overlayName: this.overlay.name
	                }
	            }));
	        }
	    };
	    
	    Footprint.prototype.select = function() {
	        if (this.isSelected) {
	            return;
	        }
	        this.isSelected = true;
	        if (this.overlay) {
	/*
	            // footprint selection code adapted from Fabrizzio Giordano dev. from Serco for ESA/ESDC
	            //window.dispatchEvent(new CustomEvent("footprintClicked", {
	            this.overlay.view.aladinDiv.dispatchEvent(new CustomEvent("footprintClicked", {
	                detail: {
	                    footprintId: this.id,
	                    overlayName: this.overlay.name
	                }
	            }));
	*/
	
	            this.overlay.reportChange();
	        }
	    };
	
	    Footprint.prototype.deselect = function() {
	        if (! this.isSelected) {
	            return;
	        }
	        this.isSelected = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    return Footprint;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Popup.js
	 * 
	 * Author: Thomas Boch [CDS]
	 * 
	 *****************************************************************************/
	
	Popup = (function() {
	    
	    
	    // constructor
	    Popup = function(parentDiv, view) {
	        this.domEl = $('<div class="aladin-popup-container"><div class="aladin-popup"><a class="aladin-closeBtn">&times;</a><div class="aladin-popupTitle"></div><div class="aladin-popupText"></div></div><div class="aladin-popup-arrow"></div></div>');
	        this.domEl.appendTo(parentDiv);
	
	        this.view = view;
	
	
	        var self = this;
	        // close popup
	        this.domEl.find('.aladin-closeBtn').click(function() {self.hide();});
	        
	    };
	    
	    Popup.prototype.hide = function() {
	        this.domEl.hide();
	
	        this.view.mustClearCatalog=true;
	        this.view.catalogForPopup.hide();
	    };
	
	    Popup.prototype.show = function() {
	        this.domEl.show();
	    };
	
	    Popup.prototype.setTitle = function(title) {
	        this.domEl.find('.aladin-popupTitle').html(title || '');
	    };
	
	    Popup.prototype.setText = function(text) {
	        this.domEl.find('.aladin-popupText').html(text || '');
	        this.w = this.domEl.outerWidth();
	        this.h = this.domEl.outerHeight();
	    };
	
	    Popup.prototype.setSource = function(source) {
	        // remove reference to popup for previous source
	        if (this.source) {
	            this.source.popup = null;
	        }
	        source.popup = this;
	        this.source = source;
	        this.setPosition(source.x, source.y);
	    };
	
	    Popup.prototype.setPosition = function(x, y) {
	        var newX = x - this.w/2;
	        var newY = y - this.h;
	        if (this.source) {
	            newY += this.source.catalog.sourceSize/2;
	        }
	
	        this.domEl[0].style.left = newX + 'px';
	        this.domEl[0].style.top  = newY + 'px';
	    };
	    
	    return Popup;
	})();
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Circle
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	// TODO : Circle and Footprint should inherit from the same root object
	Circle = (function() {
	    // constructor
	    Circle = function(centerRaDec, radiusDegrees, options) {
	        options = options || {};
	        
	        this.color = options['color'] || undefined;
	
	        // TODO : all graphic overlays should have an id
	        this.id = 'circle-' + Utils.uuidv4();
	
	        this.setCenter(centerRaDec);
	        this.setRadius(radiusDegrees);
	    	this.overlay = null;
	    	
	    	this.isShowing = true;
	    	this.isSelected = false;
	    };
	
	    Circle.prototype.setOverlay = function(overlay) {
	        this.overlay = overlay;
	    };
	    
	    Circle.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Circle.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Circle.prototype.dispatchClickEvent = function() {
	        if (this.overlay) {
	            // footprint selection code adapted from Fabrizzio Giordano dev. from Serco for ESA/ESDC
	            //window.dispatchEvent(new CustomEvent("footprintClicked", {
	            this.overlay.view.aladinDiv.dispatchEvent(new CustomEvent("footprintClicked", {
	                detail: {
	                    footprintId: this.id,
	                    overlayName: this.overlay.name
	                }
	            }));
	        }
	    };
	    
	    Circle.prototype.select = function() {
	        if (this.isSelected) {
	            return;
	        }
	        this.isSelected = true;
	        if (this.overlay) {
	/*
	            this.overlay.view.aladinDiv.dispatchEvent(new CustomEvent("footprintClicked", {
	                detail: {
	                    footprintId: this.id,
	                    overlayName: this.overlay.name
	                }
	            }));
	*/
	
	            this.overlay.reportChange();
	        }
	    };
	
	    Circle.prototype.deselect = function() {
	        if (! this.isSelected) {
	            return;
	        }
	        this.isSelected = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	
	
	    
	    Circle.prototype.setCenter = function(centerRaDec) {
	        this.centerRaDec = centerRaDec;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	
	    Circle.prototype.setRadius = function(radiusDegrees) {
	        this.radiusDegrees = radiusDegrees;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	
	    // TODO
	    Circle.prototype.draw = function(ctx, projection, frame, width, height, largestDim, zoomFactor, noStroke) {
	        if (! this.isShowing) {
	            return;
	        }
	
	
	        noStroke = noStroke===true || false;
	
	        var centerXy;
	        if (frame.system != CooFrameEnum.SYSTEMS.J2000) {
	            var lonlat = CooConversion.J2000ToGalactic([this.centerRaDec[0], this.centerRaDec[1]]);
	            centerXy = projection.project(lonlat[0], lonlat[1]);
	        }
	        else {
	            centerXy = projection.project(this.centerRaDec[0], this.centerRaDec[1]);
	        }
	        if (!centerXy) {
	            return;
	        }
	        var centerXyview = AladinUtils.xyToView(centerXy.X, centerXy.Y, width, height, largestDim, zoomFactor, false);
	
	        // compute value of radius in pixels in current projection
	        var circlePtXy;
	        var ra = this.centerRaDec[0];
	        var dec = this.centerRaDec[1] + (ra>0 ? - this.radiusDegrees : this.radiusDegrees);
	        if (frame.system != CooFrameEnum.SYSTEMS.J2000) {
	            var lonlat = CooConversion.J2000ToGalactic([ra, dec]);
	            circlePtXy = projection.project(lonlat[0], lonlat[1]);
	        }
	        else {
	            circlePtXy = projection.project(ra, dec);
	        }
	        if (!circlePtXy) {
	            return;
	        }
	        var circlePtXyView = AladinUtils.xyToView(circlePtXy.X, circlePtXy.Y, width, height, largestDim, zoomFactor, false);
	        var dx = circlePtXyView.vx - centerXyview.vx;
	        var dy = circlePtXyView.vy - centerXyview.vy;
	        var radiusInPix = Math.sqrt(dx*dx + dy*dy);
	
	        // TODO : check each 4 point until show
	        var baseColor = this.color;
	        if (! baseColor && this.overlay) {
	            baseColor = this.overlay.color;
	        }
	        if (! baseColor) {
	            baseColor = '#ff0000';
	        }
	        
	        if (this.isSelected) {
	            ctx.strokeStyle= Overlay.increaseBrightness(baseColor, 50);
	        }
	        else {
	            ctx.strokeStyle= baseColor;
	        }
	
	        ctx.beginPath();
	        ctx.arc(centerXyview.vx, centerXyview.vy, radiusInPix, 0, 2*Math.PI, false);
	        if (!noStroke) {
	            ctx.stroke();
	        }
	    }; 
	    
	    return Circle;
	})();
	// Copyright 2015 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * Class Polyline
	 * 
	 * A Polyline is a graphical overlay made of several connected points
	 * 
	 * TODO: Polyline and Circle should derive from a common base class
	 * TODO: index polyline, Circle in HEALPix pixels to avoid unneeded calls to draw 
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Polyline= (function() {
	    // constructor
	    Polyline = function(radecArray, options) {
	        options = options || {};
	        this.color = options['color'] || undefined;
	        
	        this.radecArray = radecArray;
	        this.overlay = null;
	    	
	    	this.isShowing = true;
	    	this.isSelected = false;
	    };
	    
	    Polyline.prototype.setOverlay = function(overlay) {
	        this.overlay = overlay;
	    };
	    
	    Polyline.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Polyline.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Polyline.prototype.select = function() {
	        if (this.isSelected) {
	            return;
	        }
	        this.isSelected = true;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Polyline.prototype.deselect = function() {
	        if (! this.isSelected) {
	            return;
	        }
	        this.isSelected = false;
	        if (this.overlay) {
	            this.overlay.reportChange();
	        }
	    };
	    
	    Polyline.prototype.draw = function(ctx, projection, frame, width, height, largestDim, zoomFactor) {
	        if (! this.isShowing) {
	            return;
	        }
	
	        if (! this.radecArray || this.radecArray.length<2) {
	            return;
	        }
	        
	        if (this.color) {
	            ctx.strokeStyle= this.color;
	        }
	        var start = AladinUtils.radecToViewXy(this.radecArray[0][0], this.radecArray[0][1], projection, frame, width, height, largestDim, zoomFactor);
	        if (! start) {
	            return;
	        }
	        
	        ctx.moveTo(start.vx, start.vy);
	        var pt;
	        for (var k=1; k<this.radecArray.length; k++) {
	            pt = AladinUtils.radecToViewXy(this.radecArray[k][0], this.radecArray[k][1], projection, frame, width, height, largestDim, zoomFactor);
	            if (!pt) {
	                break;
	            }
	            ctx.lineTo(pt.vx, pt.vy);
	        }
	        
	        
	        ctx.stroke();
	    };
	    
	    return Polyline;
	})();
	// Copyright 2015 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Overlay
	 *
	 * Description: a plane holding overlays (footprints, polylines, circles)
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Overlay = (function() {
	   Overlay = function(options) {
	        options = options || {};
	
	        this.type = 'overlay';
	
	    	this.name = options.name || "overlay";
	    	this.color = options.color || Color.getNextColor();
	        
	    	this.lineWidth = options["lineWidth"] || 2;
	    	
	    	//this.indexationNorder = 5; // at which level should we index overlays?
	    	this.overlays = [];
	    	this.overlay_items = []; // currently Circle or Polyline
	    	//this.hpxIdx = new HealpixIndex(this.indexationNorder);
	    	//this.hpxIdx.init();
	    	
	    	this.isShowing = true;
	    };
	    
	
	    // TODO : show/hide methods should be integrated in a parent class 
	    Overlay.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        this.reportChange();
	    };
	    
	    Overlay.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        this.reportChange();
	    };
	    
	    // return an array of Footprint from a STC-S string
	    Overlay.parseSTCS = function(stcs) {
	        var footprints = [];
	        var parts = stcs.match(/\S+/g);
	        var k = 0, len = parts.length;
	        while(k<len) {
	            var s = parts[k].toLowerCase();
	            if(s=='polygon') {
	                var curPolygon = [];
	                k++;
	                frame = parts[k].toLowerCase();
	                if (frame=='icrs' || frame=='j2000' || frame=='fk5') {
	                    while(k+2<len) {
	                        var ra = parseFloat(parts[k+1]);
	                        if (isNaN(ra)) {
	                            break;
	                        }
	                        var dec = parseFloat(parts[k+2]);
	                        curPolygon.push([ra, dec]);
	                        k += 2;
	                    }
	                    curPolygon.push(curPolygon[0]);
	                    footprints.push(new Footprint(curPolygon));
	                }
	            }
	            else if (s=='circle') {
	                var frame;
	                k++;
	                frame = parts[k].toLowerCase();
	
	                if (frame=='icrs' || frame=='j2000' || frame=='fk5') {
	                    var ra, dec, radiusDegrees;
	
	                    ra = parseFloat(parts[k+1]);
	                    dec = parseFloat(parts[k+2]);
	                    radiusDegrees = parseFloat(parts[k+3]);
	
	                    footprints.push(A.circle(ra, dec, radiusDegrees)); 
	
	                    k += 3;
	                }
	            }
	
	            k++;
	        }
	
	        return footprints;
	    };
	    
	    // ajout d'un tableau d'overlays (= objets Footprint, Circle ou Polyline)
	    Overlay.prototype.addFootprints = function(overlaysToAdd) {
	    	for (var k=0, len=overlaysToAdd.length; k<len; k++) {
	            this.add(overlaysToAdd[k], false);
	        }
	
	        this.view.requestRedraw();
	    };
	
	    // TODO : item doit pouvoir prendre n'importe quoi en param (footprint, circle, polyline)
	    Overlay.prototype.add = function(item, requestRedraw) {
	        requestRedraw = requestRedraw !== undefined ? requestRedraw : true;
	
	        if (item instanceof Footprint) {
	            this.overlays.push(item);
	        }
	        else {
	            this.overlay_items.push(item);
	        }
	        item.setOverlay(this);
	        
	        if (requestRedraw) {
	            this.view.requestRedraw();
	        }
	    };
	
	    
	    // return a footprint by index
	   Overlay.prototype.getFootprint = function(idx) {
	        if (idx<this.footprints.length) {
	            return this.footprints[idx];
	        }
	        else {
	            return null;
	        }
	    };
	    
	    Overlay.prototype.setView = function(view) {
	        this.view = view;
	    };
	    
	    Overlay.prototype.removeAll = function() {
	        // TODO : RAZ de l'index
	        this.overlays = [];
	        this.overlay_items = [];
	    };
	    
	    Overlay.prototype.draw = function(ctx, projection, frame, width, height, largestDim, zoomFactor) {
	        if (!this.isShowing) {
	            return;
	        }
	        
	        // simple drawing
	        ctx.strokeStyle= this.color;
	
	        // 1. Drawing polygons
	        
	        // TODO: les overlay polygons devrait se tracer lui meme (methode draw)
	        ctx.lineWidth = this.lineWidth;
	    	ctx.beginPath();
	    	xyviews = [];
	    	for (var k=0, len = this.overlays.length; k<len; k++) {
	    		xyviews.push(this.drawFootprint(this.overlays[k], ctx, projection, frame, width, height, largestDim, zoomFactor));
	    	}
	        ctx.stroke();
	
	    	// selection drawing
	        ctx.strokeStyle= Overlay.increaseBrightness(this.color, 50);
	        ctx.beginPath();
	        for (var k=0, len = this.overlays.length; k<len; k++) {
	            if (! this.overlays[k].isSelected) {
	                continue;
	            }
	            this.drawFootprintSelected(ctx, xyviews[k]);
	            
	        }
	    	ctx.stroke();
	    	
	        // 2. Circle and polylines drawing
	    	for (var k=0; k<this.overlay_items.length; k++) {
	    	    this.overlay_items[k].draw(ctx, projection, frame, width, height, largestDim, zoomFactor);
	    	}
	    };
	
	    Overlay.increaseBrightness = function(hex, percent){
	        // strip the leading # if it's there
	        hex = hex.replace(/^\s*#|\s*$/g, '');
	
	        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	        if(hex.length == 3){
	            hex = hex.replace(/(.)/g, '$1$1');
	        }
	
	        var r = parseInt(hex.substr(0, 2), 16),
	            g = parseInt(hex.substr(2, 2), 16),
	            b = parseInt(hex.substr(4, 2), 16);
	
	        return '#' +
	                ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
	                ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
	                ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
	    };
	    
	    
	    Overlay.prototype.drawFootprint = function(f, ctx, projection, frame, width, height, largestDim, zoomFactor) {
	        if (! f.isShowing) {
	            return null;
	        }
	        var xyviewArray = [];
	        var show = false;
	        var radecArray = f.polygons;
	        // for
	            for (var k=0, len=radecArray.length; k<len; k++) {
	                var xy;
	                if (frame.system != CooFrameEnum.SYSTEMS.J2000) {
	                    var lonlat = CooConversion.J2000ToGalactic([radecArray[k][0], radecArray[k][1]]);
	                    xy = projection.project(lonlat[0], lonlat[1]);
	                }
	                else {
	                    xy = projection.project(radecArray[k][0], radecArray[k][1]);
	                }
	                if (!xy) {
	                    return null;
	                }
	                var xyview = AladinUtils.xyToView(xy.X, xy.Y, width, height, largestDim, zoomFactor);
	                xyviewArray.push(xyview);
	                if (!show && xyview.vx<width  && xyview.vx>=0 && xyview.vy<=height && xyview.vy>=0) {
	                    show = true;
	                }
	            }
	
	            if (show) {
	                ctx.moveTo(xyviewArray[0].vx, xyviewArray[0].vy);
	                for (var k=1, len=xyviewArray.length; k<len; k++) {
	                    ctx.lineTo(xyviewArray[k].vx, xyviewArray[k].vy);
	                }
	            }
	            else {
	                //return null;
	            }
	        // end for
	
	        return xyviewArray;
	
	
	
	    };
	
	    Overlay.prototype.drawFootprintSelected = function(ctx, xyview) {
	        if (!xyview) {
	            return;
	        }
	
	        var xyviewArray = xyview;
	        ctx.moveTo(xyviewArray[0].vx, xyviewArray[0].vy);
	        for (var k=1, len=xyviewArray.length; k<len; k++) {
	            ctx.lineTo(xyviewArray[k].vx, xyviewArray[k].vy);
	        }
	    };
	
	
	    
	    // callback function to be called when the status of one of the footprints has changed
	    Overlay.prototype.reportChange = function() {
	        this.view.requestRedraw();
	    };
	
	    return Overlay;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Source
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	cds.Source = (function() {
	    // constructor
	    cds.Source = function(ra, dec, data, options) {
	    	this.ra = ra;
	    	this.dec = dec;
	    	this.data = data;
	    	this.catalog = null;
	    	
	        this.marker = (options && options.marker) || false;
	        if (this.marker) {
	            this.popupTitle = (options && options.popupTitle) ? options.popupTitle : '';
	            this.popupDesc = (options && options.popupDesc) ? options.popupDesc : '';
	            this.useMarkerDefaultIcon = (options && options.useMarkerDefaultIcon!==undefined) ? options.useMarkerDefaultIcon : true;
	        }
	
	    	this.isShowing = true;
	    	this.isSelected = false;
	    };
	    
	    cds.Source.prototype.setCatalog = function(catalog) {
	        this.catalog = catalog;
	    };
	    
	    cds.Source.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        if (this.catalog) {
	            this.catalog.reportChange();
	        }
	    };
	    
	    cds.Source.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        if (this.catalog) {
	            this.catalog.reportChange();
	        }
	    };
	    
	    cds.Source.prototype.select = function() {
	        if (this.isSelected) {
	            return;
	        }
	        this.isSelected = true;
	        if (this.catalog) {
	            this.catalog.reportChange();
	        }
	    };
	    
	    cds.Source.prototype.deselect = function() {
	        if (! this.isSelected) {
	            return;
	        }
	        this.isSelected = false;
	        if (this.catalog) {
	            this.catalog.reportChange();
	        }
	    };
	
	    // function called when a source is clicked. Called by the View object
	    cds.Source.prototype.actionClicked = function() {
	        if (this.catalog && this.catalog.onClick) {
	            var view = this.catalog.view;
	            if (this.catalog.onClick=='showTable') {
	                view.aladin.measurementTable.showMeasurement(this);
	                this.select();
	            }
	            else if (this.catalog.onClick=='showPopup') {
	                view.popup.setTitle('<br><br>');
	                var m = '<div class="aladin-marker-measurement">';
	                m += '<table>';
	                for (var key in this.data) {
	                    m += '<tr><td>' + key + '</td><td>' + this.data[key] + '</td></tr>';
	                }
	                m += '</table>';
	                m += '</div>';
	                view.popup.setText(m);
	                view.popup.setSource(this);
	                view.popup.show();
	            }
	            else if (typeof this.catalog.onClick === 'function') {
	                this.catalog.onClick(this);
	                view.lastClickedObject = this;
	            }
	
	        }
	    };
	
	    
	    cds.Source.prototype.actionOtherObjectClicked = function() {
	        if (this.catalog && this.catalog.onClick) {
	            this.deselect();
	        }
	    };
	    
	    return cds.Source;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Catalog
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	// TODO : harmoniser parsing avec classe ProgressiveCat
	cds.Catalog = (function() {
	   cds.Catalog = function(options) {
	        options = options || {};
	
	        this.type = 'catalog';    	this.name = options.name || "catalog";
	    	this.color = options.color || Color.getNextColor();
	    	this.sourceSize = options.sourceSize || 8;
	    	this.markerSize = options.sourceSize || 12;
	    	this.shape = options.shape || "square";
	        this.maxNbSources = options.limit || undefined;
	        this.onClick = options.onClick || undefined;
	
	        this.raField = options.raField || undefined; // ID or name of the field holding RA
	        this.decField = options.decField || undefined; // ID or name of the field holding dec
	
	    	this.indexationNorder = 5; // à quel niveau indexe-t-on les sources
	    	this.sources = [];
	    	this.hpxIdx = new HealpixIndex(this.indexationNorder);
	    	this.hpxIdx.init();
	
	        this.displayLabel = options.displayLabel || false;
	        this.labelColor = options.labelColor || this.color;
	        this.labelFont = options.labelFont || '10px sans-serif';
	        if (this.displayLabel) {
	            this.labelColumn = options.labelColumn;
	            if (!this.labelColumn) {
	                this.displayLabel = false;
	            }
	        }
	    	
	        if (this.shape instanceof Image || this.shape instanceof HTMLCanvasElement) {
	            this.sourceSize = this.shape.width;
	        }
	        this._shapeIsFunction = false; // if true, the shape is a function drawing on the canvas
	        if ($.isFunction(this.shape)) {
	            this._shapeIsFunction = true;
	        }
	        
	    	this.selectionColor = '#00ff00';
	    	
	
	        // create this.cacheCanvas    	
	    	// cacheCanvas permet de ne créer le path de la source qu'une fois, et de le réutiliser (cf. http://simonsarris.com/blog/427-increasing-performance-by-caching-paths-on-canvas)
	        this.updateShape(options);
	
	        this.cacheMarkerCanvas = document.createElement('canvas');
	        this.cacheMarkerCanvas.width = this.markerSize;
	        this.cacheMarkerCanvas.height = this.markerSize;
	        var cacheMarkerCtx = this.cacheMarkerCanvas.getContext('2d');
	        cacheMarkerCtx.fillStyle = this.color;
	        cacheMarkerCtx.beginPath();
	        var half = (this.markerSize)/2.;
	        cacheMarkerCtx.arc(half, half, half-2, 0, 2 * Math.PI, false);
	        cacheMarkerCtx.fill();
	        cacheMarkerCtx.lineWidth = 2;
	        cacheMarkerCtx.strokeStyle = '#ccc';
	        cacheMarkerCtx.stroke();
	        
	
	        this.isShowing = true;
	    };
	    
	    cds.Catalog.createShape = function(shapeName, color, sourceSize) {
	        if (shapeName instanceof Image || shapeName instanceof HTMLCanvasElement) { // in this case, the shape is already created
	            return shapeName;
	        }
	        var c = document.createElement('canvas');
	        c.width = c.height = sourceSize;
	        var ctx= c.getContext('2d');
	        ctx.beginPath();
	        ctx.strokeStyle = color;
	        ctx.lineWidth = 2.0;
	        if (shapeName=="plus") {
	            ctx.moveTo(sourceSize/2., 0);
	            ctx.lineTo(sourceSize/2., sourceSize);
	            ctx.stroke();
	            
	            ctx.moveTo(0, sourceSize/2.);
	            ctx.lineTo(sourceSize, sourceSize/2.);
	            ctx.stroke();
	        }
	        else if (shapeName=="cross") {
	            ctx.moveTo(0, 0);
	            ctx.lineTo(sourceSize-1, sourceSize-1);
	            ctx.stroke();
	            
	            ctx.moveTo(sourceSize-1, 0);
	            ctx.lineTo(0, sourceSize-1);
	            ctx.stroke();
	        }
	        else if (shapeName=="rhomb") {
	            ctx.moveTo(sourceSize/2, 0);
	            ctx.lineTo(0, sourceSize/2);
	            ctx.lineTo(sourceSize/2, sourceSize);
	            ctx.lineTo(sourceSize, sourceSize/2);
	            ctx.lineTo(sourceSize/2, 0);
	            ctx.stroke();
	        }
	        else if (shapeName=="triangle") {
	            ctx.moveTo(sourceSize/2, 0);
	            ctx.lineTo(0, sourceSize-1);
	            ctx.lineTo(sourceSize-1, sourceSize-1);
	            ctx.lineTo(sourceSize/2, 0);
	            ctx.stroke();
	        }
	        else if (shapeName=="circle") {
	            ctx.arc(sourceSize/2, sourceSize/2, sourceSize/2 - 1, 0, 2*Math.PI, true);
	            ctx.stroke();
	        }
	        else { // default shape: square
	            ctx.moveTo(1, 0);
	            ctx.lineTo(1,  sourceSize-1);
	            ctx.lineTo( sourceSize-1,  sourceSize-1);
	            ctx.lineTo( sourceSize-1, 1);
	            ctx.lineTo(1, 1);
	            ctx.stroke();
	        }
	        
	        return c;
	        
	    };
	    
	
	        // find RA, Dec fields among the given fields
	        //
	        // @param fields: list of objects with ucd, unit, ID, name attributes
	        // @param raField:  index or name of right ascension column (might be undefined)
	        // @param decField: index or name of declination column (might be undefined)
	        //
	        function findRADecFields(fields, raField, decField) {
	            var raFieldIdx,  decFieldIdx;
	            raFieldIdx = decFieldIdx = null;
	
	            // first, look if RA/DEC fields have been already given
	            if (raField) { // ID or name of RA field given at catalogue creation
	                for (var l=0, len=fields.length; l<len; l++) {
	                    var field = fields[l];
	                    if (Utils.isInt(raField) && raField<fields.length) { // raField can be given as an index
	                        raFieldIdx = raField;
	                        break;
	                    } 
	                    if ( (field.ID && field.ID===raField) || (field.name && field.name===raField)) {
	                        raFieldIdx = l;
	                        break;
	                    }
	                }
	            }
	            if (decField) { // ID or name of dec field given at catalogue creation
	                for (var l=0, len=fields.length; l<len; l++) {
	                    var field = fields[l];
	                    if (Utils.isInt(decField) && decField<fields.length) { // decField can be given as an index
	                        decFieldIdx = decField;
	                        break;
	                    } 
	                    if ( (field.ID && field.ID===decField) || (field.name && field.name===decField)) {
	                        decFieldIdx = l;
	                        break;
	                    }
	                }
	            }
	            // if not already given, let's guess position columns on the basis of UCDs
	            for (var l=0, len=fields.length; l<len; l++) {
	                if (raFieldIdx!=null && decFieldIdx!=null) {
	                    break;
	                }
	
	                var field = fields[l];
	                if ( ! raFieldIdx) {
	                    if (field.ucd) {
	                        var ucd = $.trim(field.ucd.toLowerCase());
	                        if (ucd.indexOf('pos.eq.ra')==0 || ucd.indexOf('pos_eq_ra')==0) {
	                            raFieldIdx = l;
	                            continue;
	                        }
	                    }
	                }
	                    
	                if ( ! decFieldIdx) {
	                    if (field.ucd) {
	                        var ucd = $.trim(field.ucd.toLowerCase());
	                        if (ucd.indexOf('pos.eq.dec')==0 || ucd.indexOf('pos_eq_dec')==0) {
	                            decFieldIdx = l;
	                            continue;
	                        }
	                    }
	                }
	            }
	
	            // still not found ? try some common names for RA and Dec columns
	            if (raFieldIdx==null && decFieldIdx==null) {
	                for (var l=0, len=fields.length; l<len; l++) {
	                    var field = fields[l];
	                    var name = field.name || field.ID || '';
	                    name = name.toLowerCase();
	                    
	                    if ( ! raFieldIdx) {
	                        if (name.indexOf('ra')==0 || name.indexOf('_ra')==0 || name.indexOf('ra(icrs)')==0 || name.indexOf('_ra')==0 || name.indexOf('alpha')==0) {
	                            raFieldIdx = l;
	                            continue;
	                        }
	                    }
	
	                    if ( ! decFieldIdx) {
	                        if (name.indexOf('dej2000')==0 || name.indexOf('_dej2000')==0 || name.indexOf('de')==0 || name.indexOf('de(icrs)')==0 || name.indexOf('_de')==0 || name.indexOf('delta')==0) {
	                            decFieldIdx = l;
	                            continue;
	                        }
	                    }
	                    
	                }
	            }
	
	            // last resort: take two first fieds
	            if (raFieldIdx==null || decFieldIdx==null) {
	                raFieldIdx  = 0;
	                decFieldIdx = 1
	            }
	
	            return [raFieldIdx, decFieldIdx];
	        };
	        
	    
	    
	    // return an array of Source(s) from a VOTable url
	    // callback function is called each time a TABLE element has been parsed
	    cds.Catalog.parseVOTable = function(url, callback, maxNbSources, useProxy, raField, decField) {
	
	        // adapted from votable.js
	        function getPrefix($xml) {
	            var prefix;
	            // If Webkit chrome/safari/... (no need prefix)
	            if($xml.find('RESOURCE').length>0) {
	                prefix = '';
	            }
	            else {
	                // Select all data in the document
	                prefix = $xml.find("*").first();
	
	                if (prefix.length==0) {
	                    return '';
	                }
	
	                // get name of the first tag
	                prefix = prefix.prop("tagName");
	
	                var idx = prefix.indexOf(':');
	
	                prefix = prefix.substring(0, idx) + "\\:";
	
	
	            }
	
	            return prefix;
	        }
	
	        function doParseVOTable(xml, callback) {
	            xml = xml.replace(/^\s+/g, ''); // we need to trim whitespaces at start of document
	            var attributes = ["name", "ID", "ucd", "utype", "unit", "datatype", "arraysize", "width", "precision"];
	            
	            var fields = [];
	            var k = 0;
	            var $xml = $($.parseXML(xml));
	            var prefix = getPrefix($xml);
	            $xml.find(prefix + "FIELD").each(function() {
	                var f = {};
	                for (var i=0; i<attributes.length; i++) {
	                    var attribute = attributes[i];
	                    if ($(this).attr(attribute)) {
	                        f[attribute] = $(this).attr(attribute);
	                    }
	                }
	                if ( ! f.ID) {
	                    f.ID = "col_" + k;
	                }
	                fields.push(f);
	                k++;
	            });
	                
	            var raDecFieldIdxes = findRADecFields(fields, raField, decField);
	            var raFieldIdx,  decFieldIdx;
	            raFieldIdx = raDecFieldIdxes[0];
	            decFieldIdx = raDecFieldIdxes[1];
	
	            var sources = [];
	            
	            var coo = new Coo();
	            var ra, dec;
	            $xml.find(prefix + "TR").each(function() {
	               var mesures = {};
	               var k = 0;
	               $(this).find(prefix + "TD").each(function() {
	                   var key = fields[k].name ? fields[k].name : fields[k].id;
	                   mesures[key] = $(this).text();
	                   k++;
	               });
	               var keyRa = fields[raFieldIdx].name ? fields[raFieldIdx].name : fields[raFieldIdx].id;
	               var keyDec = fields[decFieldIdx].name ? fields[decFieldIdx].name : fields[decFieldIdx].id;
	
	               if (Utils.isNumber(mesures[keyRa]) && Utils.isNumber(mesures[keyDec])) {
	                   ra = parseFloat(mesures[keyRa]);
	                   dec = parseFloat(mesures[keyDec]);
	               }
	               else {
	                   coo.parse(mesures[keyRa] + " " + mesures[keyDec]);
	                   ra = coo.lon;
	                   dec = coo.lat;
	               }
	               sources.push(new cds.Source(ra, dec, mesures));
	               if (maxNbSources && sources.length==maxNbSources) {
	                   return false; // break the .each loop
	               }
	                
	            });
	            if (callback) {
	                callback(sources);
	            }
	        }
	        
	        var ajax = Utils.getAjaxObject(url, 'GET', 'text', useProxy);
	        ajax.done(function(xml) {
	            doParseVOTable(xml, callback);
	        });
	    };
	
	    // API
	    cds.Catalog.prototype.updateShape = function(options) {
	        options = options || {};
	    	this.color = options.color || this.color || Color.getNextColor();
	    	this.sourceSize = options.sourceSize || this.sourceSize || 6;
	    	this.shape = options.shape || this.shape || "square";
	
	        this.selectSize = this.sourceSize + 2;
	
	        this.cacheCanvas = cds.Catalog.createShape(this.shape, this.color, this.sourceSize); 
	        this.cacheSelectCanvas = cds.Catalog.createShape('square', this.selectionColor, this.selectSize);
	
	        this.reportChange();
	    };
	    
	    // API
	    cds.Catalog.prototype.addSources = function(sourcesToAdd) {
	        sourcesToAdd = [].concat(sourcesToAdd); // make sure we have an array and not an individual source
	    	this.sources = this.sources.concat(sourcesToAdd);
	    	for (var k=0, len=sourcesToAdd.length; k<len; k++) {
	    	    sourcesToAdd[k].setCatalog(this);
	    	}
	        this.reportChange();
	    };
	
	    // API
	    //
	    // create sources from a 2d array and add them to the catalog
	    //
	    // @param columnNames: array with names of the columns
	    // @array: 2D-array, each item being a 1d-array with the same number of items as columnNames
	    cds.Catalog.prototype.addSourcesAsArray = function(columnNames, array) {
	        var fields = [];
	        for (var colIdx=0 ; colIdx<columnNames.length; colIdx++) {
	            fields.push({name: columnNames[colIdx]});
	        }
	        var raDecFieldIdxes = findRADecFields(fields, this.raField, this.decField);
	        var raFieldIdx,  decFieldIdx;
	        raFieldIdx = raDecFieldIdxes[0];
	        decFieldIdx = raDecFieldIdxes[1];
	
	
	        var newSources = [];
	        var coo = new Coo();
	        var ra, dec, row, dataDict;
	        for (var rowIdx=0 ; rowIdx<array.length ; rowIdx++) {
	            row = array[rowIdx];
	            if (Utils.isNumber(row[raFieldIdx]) && Utils.isNumber(row[decFieldIdx])) {
	                   ra = parseFloat(row[raFieldIdx]);
	                   dec = parseFloat(row[decFieldIdx]);
	            }
	               else {
	                   coo.parse(row[raFieldIdx] + " " + row[decFieldIdx]);
	                   ra = coo.lon;
	                   dec = coo.lat;
	               }
	
	            dataDict = {};
	            for (var colIdx=0 ; colIdx<columnNames.length; colIdx++) {
	                dataDict[columnNames[colIdx]] = row[colIdx];
	            }
	
	            newSources.push(A.source(ra, dec, dataDict));
	        }
	
	        this.addSources(newSources);
	    };
	    
	    // return the current list of Source objects
	    cds.Catalog.prototype.getSources = function() {
	        return this.sources;
	    };
	    
	    // TODO : fonction générique traversant la liste des sources
	    cds.Catalog.prototype.selectAll = function() {
	        if (! this.sources) {
	            return;
	        }
	        
	        for (var k=0; k<this.sources.length; k++) {
	            this.sources[k].select();
	        }
	    };
	    
	    cds.Catalog.prototype.deselectAll = function() {
	        if (! this.sources) {
	            return;
	        }
	        
	        for (var k=0; k<this.sources.length; k++) {
	            this.sources[k].deselect();
	        }
	    };
	    
	    // return a source by index
	    cds.Catalog.prototype.getSource = function(idx) {
	        if (idx<this.sources.length) {
	            return this.sources[idx];
	        }
	        else {
	            return null;
	        }
	    };
	    
	    cds.Catalog.prototype.setView = function(view) {
	        this.view = view;
	        this.reportChange();
	    };
	    
	    cds.Catalog.prototype.removeAll = cds.Catalog.prototype.clear = function() {
	        // TODO : RAZ de l'index
	        this.sources = [];
	    };
	    
	    cds.Catalog.prototype.draw = function(ctx, projection, frame, width, height, largestDim, zoomFactor) {
	        if (! this.isShowing) {
	            return;
	        }
	        // tracé simple
	        //ctx.strokeStyle= this.color;
	
	        //ctx.lineWidth = 1;
	    	//ctx.beginPath();
	        if (this._shapeIsFunction) {
	            ctx.save();
	        }
	        var sourcesInView = [];
	 	    for (var k=0, len = this.sources.length; k<len; k++) {
			    var inView = cds.Catalog.drawSource(this, this.sources[k], ctx, projection, frame, width, height, largestDim, zoomFactor);
	            if (inView) {
	                sourcesInView.push(this.sources[k]);
	            }
	        }
	        if (this._shapeIsFunction) {
	            ctx.restore();
	        }
	        //ctx.stroke();
	
	    	// tracé sélection
	        ctx.strokeStyle= this.selectionColor;
	        //ctx.beginPath();
	        var source;
	        for (var k=0, len = sourcesInView.length; k<len; k++) {
	            source = sourcesInView[k];
	            if (! source.isSelected) {
	                continue;
	            }
	            cds.Catalog.drawSourceSelection(this, source, ctx);
	            
	        }
	        // NEEDED ?
	    	//ctx.stroke();
	
	        // tracé label
	        if (this.displayLabel) {
	            ctx.fillStyle = this.labelColor;
	            ctx.font = this.labelFont;
	            for (var k=0, len = sourcesInView.length; k<len; k++) {
	                cds.Catalog.drawSourceLabel(this, sourcesInView[k], ctx);
	            }
	        }
	    };
	    
	    
	    
	    cds.Catalog.drawSource = function(catalogInstance, s, ctx, projection, frame, width, height, largestDim, zoomFactor) {
	        if (! s.isShowing) {
	            return false;
	        }
	        var sourceSize = catalogInstance.sourceSize;
	        // TODO : we could factorize this code with Aladin.world2pix
	        var xy;
	        if (frame.system != CooFrameEnum.SYSTEMS.J2000) {
	            var lonlat = CooConversion.J2000ToGalactic([s.ra, s.dec]);
	            xy = projection.project(lonlat[0], lonlat[1]);
	        }
	        else {
	            xy = projection.project(s.ra, s.dec);
	        }
	
	        if (xy) {
	            var xyview = AladinUtils.xyToView(xy.X, xy.Y, width, height, largestDim, zoomFactor, true);
	            var max = s.popup ? 100 : s.sourceSize;
	            if (xyview) {
	                // TODO : index sources by HEALPix cells at level 3, 4 ?
	
	                // check if source is visible in view
	                if (xyview.vx>(width+max)  || xyview.vx<(0-max) ||
	                    xyview.vy>(height+max) || xyview.vy<(0-max)) {
	                    s.x = s.y = undefined;
	                    return false;
	                }
	                
	                s.x = xyview.vx;
	                s.y = xyview.vy;
	                if (catalogInstance._shapeIsFunction) {
	                    catalogInstance.shape(s, ctx, catalogInstance.view.getViewParams());
	                }
	                else if (s.marker && s.useMarkerDefaultIcon) {
	                    ctx.drawImage(catalogInstance.cacheMarkerCanvas, s.x-sourceSize/2, s.y-sourceSize/2);
	                }
	                else {
	                    ctx.drawImage(catalogInstance.cacheCanvas, s.x-catalogInstance.cacheCanvas.width/2, s.y-catalogInstance.cacheCanvas.height/2);
	                }
	
	
	                // has associated popup ?
	                if (s.popup) {
	                    s.popup.setPosition(s.x, s.y);
	                }
	                
	                
	            }
	            return true;
	        }
	        else {
	            return false;
	        }
	
	        
	    };
	    
	    cds.Catalog.drawSourceSelection = function(catalogInstance, s, ctx) {
	        if (!s || !s.isShowing || !s.x || !s.y) {
	            return;
	        }
	        var sourceSize = catalogInstance.selectSize;
	        
	        ctx.drawImage(catalogInstance.cacheSelectCanvas, s.x-sourceSize/2, s.y-sourceSize/2);
	    };
	
	    cds.Catalog.drawSourceLabel = function(catalogInstance, s, ctx) {
	        if (!s || !s.isShowing || !s.x || !s.y) {
	            return;
	        }
	
	        var label = s.data[catalogInstance.labelColumn];
	        if (!label) {
	            return;
	        }
	
	        ctx.fillText(label, s.x, s.y);
	    };
	
	    
	    // callback function to be called when the status of one of the sources has changed
	    cds.Catalog.prototype.reportChange = function() {
	        this.view && this.view.requestRedraw();
	    };
	    
	    cds.Catalog.prototype.show = function() {
	        if (this.isShowing) {
	            return;
	        }
	        this.isShowing = true;
	        this.reportChange();
	    };
	    
	    cds.Catalog.prototype.hide = function() {
	        if (! this.isShowing) {
	            return;
	        }
	        this.isShowing = false;
	        if (this.view && this.view.popup && this.view.popup.source && this.view.popup.source.catalog==this) {
	            this.view.popup.hide();
	        }
	
	        this.reportChange();
	    };
	
	    return cds.Catalog;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File ProgressiveCat.js
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	// TODO: index sources according to their HEALPix ipix
	// TODO : merge parsing with class Catalog
	ProgressiveCat = (function() {
	    
	    // TODO : test if CORS support. If no, need to pass through a proxy
	    // currently, we suppose CORS is supported
	    
	    // constructor
	    ProgressiveCat = function(rootUrl, frameStr, maxOrder, options) {
	        options = options || {};
	
	        this.type = 'progressivecat';
	        
	        this.rootUrl = rootUrl; // TODO: method to sanitize rootURL (absolute, no duplicate slashes, remove end slash if existing)
	        // fast fix for HTTPS support --> will work for all HiPS served by CDS
	        if (Utils.isHttpsContext() && ( /u-strasbg.fr/i.test(this.rootUrl) || /unistra.fr/i.test(this.rootUrl)  ) ) {
	            this.rootUrl = this.rootUrl.replace('http://', 'https://');
	        }
	
	        this.frameStr = frameStr;
	        this.frame = CooFrameEnum.fromString(frameStr) || CooFrameEnum.J2000;
	        this.maxOrder = maxOrder;
	        this.isShowing = true; // TODO : inherit from catalogue
	
	        this.name = options.name || "progressive-cat";
	        this.color = options.color || Color.getNextColor();
	        this.shape = options.shape || "square";
	        this.sourceSize = options.sourceSize || 6;
	        this.selectSize = this.sourceSize + 2;
	        this.selectionColor = '#00ff00'; // TODO: to be merged with Catalog
	
	
	        this.onClick = options.onClick || undefined; // TODO: inherit from catalog
	
	        
	
	        // we cache the list of sources in each healpix tile. Key of the cache is norder+'-'+npix
	        this.sourcesCache = new Utils.LRUCache(100);
	
	        this.updateShape(options);
	
	
	
	
	        this.maxOrderAllsky = 2;
	        this.isReady = false;
	    };
	
	    // TODO: to be put higher in the class diagram, in a HiPS generic class
	    ProgressiveCat.readProperties = function(rootUrl, successCallback, errorCallback) {
	        if (! successCallback) {
	            return;
	        }
	
	        var propertiesURL = rootUrl + '/properties';
	        $.ajax({
	            url: propertiesURL,
	            method: 'GET',
	            dataType: 'text',
	            success: function(propertiesTxt) {
	                var props = {};
	                var lines = propertiesTxt.split('\n');
	                for (var k=0; k<lines.length; k++) {
	                    var line = lines[k];
	                    var idx = line.indexOf('=');
	                    var propName  = $.trim(line.substring(0, idx));
	                    var propValue = $.trim(line.substring(idx + 1));
	                    
	                    props[propName] = propValue;
	                }
	    
	                successCallback(props);
	                
	            },
	            error: function(err) { // TODO : which parameters should we put in the error callback
	                errorCallback && errorCallback(err);
	            }
	        });
	
	
	
	
	        
	    };
	
	    function getFields(instance, xml) {
	        var attributes = ["name", "ID", "ucd", "utype", "unit", "datatype", "arraysize", "width", "precision"];
	
	        var fields = [];
	        var k = 0;
	        instance.keyRa = instance.keyDec = null;
	        $(xml).find("FIELD").each(function() {
	            var f = {};
	            for (var i=0; i<attributes.length; i++) {
	                var attribute = attributes[i];
	                if ($(this).attr(attribute)) {
	                    f[attribute] = $(this).attr(attribute);
	                }
	                
	            }
	            if ( ! f.ID) {
	                f.ID = "col_" + k;
	            }
	            
	            if (!instance.keyRa && f.ucd && (f.ucd.indexOf('pos.eq.ra')==0 || f.ucd.indexOf('POS_EQ_RA')==0)) {
	                if (f.name) {
	                    instance.keyRa = f.name;
	                }
	                else {
	                    instance.keyRa = f.ID;
	                }
	            }
	            if (!instance.keyDec && f.ucd && (f.ucd.indexOf('pos.eq.dec')==0 || f.ucd.indexOf('POS_EQ_DEC')==0)) {
	                if (f.name) {
	                    instance.keyDec = f.name;
	                }
	                else {
	                    instance.keyDec = f.ID;
	                }
	            }
	            
	            fields.push(f);
	            k++;
	        });
	
	        return fields;
	    }
	
	    function getSources(instance, csv, fields) {
	        // TODO : find ra and dec key names (see in Catalog)
	        if (!instance.keyRa || ! instance.keyDec) {
	            return [];
	        }
	        lines = csv.split('\n');
	        var mesureKeys = [];
	        for (var k=0; k<fields.length; k++) {
	            if (fields[k].name) {
	                mesureKeys.push(fields[k].name);
	            }
	            else {
	                mesureKeys.push(fields[k].ID);
	            }
	        }
	        
	
	        var sources = [];
	        var coo = new Coo();
	        var newSource;
	        // start at i=1, as first line repeat the fields names
	        for (var i=2; i<lines.length; i++) {
	            var mesures = {};
	            var data = lines[i].split('\t');
	            if (data.length<mesureKeys.length) {
	                continue;
	            }
	            for (var j=0; j<mesureKeys.length; j++) {
	                mesures[mesureKeys[j]] = data[j];
	            }
	            var ra, dec;
	            if (Utils.isNumber(mesures[instance.keyRa]) && Utils.isNumber(mesures[instance.keyDec])) {
	                ra = parseFloat(mesures[instance.keyRa]);
	                dec = parseFloat(mesures[instance.keyDec]);
	            }
	            else {
	                coo.parse(mesures[instance.keyRa] + " " + mesures[instance.keyDec]);
	                ra = coo.lon;
	                dec = coo.lat;
	            }
	            newSource = new cds.Source(ra, dec, mesures);
	            sources.push(newSource);
	            newSource.setCatalog(instance);
	        }
	        return sources;
	    };
	
	    //ProgressiveCat.prototype.updateShape = cds.Catalog.prototype.updateShape;
	
	    ProgressiveCat.prototype = {
	
	        init: function(view) {
	            var self = this;
	            this.view = view;
	
	            if (this.maxOrder && this.frameStr) {
	                this._loadMetadata();
	            }
	
	            else {
	                ProgressiveCat.readProperties(self.rootUrl,
	                    function (properties) {
	                        self.properties = properties;
	                        self.maxOrder = self.properties['hips_order'];
	                        self.frame = CooFrameEnum.fromString(self.properties['hips_frame']);
	
	                        self._loadMetadata();
	                    }, function(err) {
	                        console.log('Could not find properties for HiPS ' + self.rootUrl);
	                    }
	                );
	            }
	        },
	
	        updateShape: cds.Catalog.prototype.updateShape,
	
	        _loadMetadata: function() {
	            var self = this;
	            $.ajax({
	                url: self.rootUrl + '/' + 'Metadata.xml',
	                method: 'GET',
	                success: function(xml) {
	                    self.fields = getFields(self, xml);
	                    self._loadAllskyNewMethod();
	                },
	                error: function(err) {
	                    self._loadAllskyOldMethod();
	                }
	            });
	        },
	
	        _loadAllskyNewMethod: function() {
	            var self = this;
	            $.ajax({
	                url: self.rootUrl + '/' + 'Norder1/Allsky.tsv',
	                method: 'GET',
	                success: function(tsv) {
	                    self.order1Sources = getSources(self, tsv, self.fields);
	
	                    if (self.order2Sources) {
	                        self.isReady = true;
	                        self._finishInitWhenReady();
	                    }
	                },
	                error: function(err) {
	                    console.log('Something went wrong: ' + err);
	                }
	            });
	
	            $.ajax({
	                url: self.rootUrl + '/' + 'Norder2/Allsky.tsv',
	                method: 'GET',
	                success: function(tsv) {
	                    self.order2Sources = getSources(self, tsv, self.fields);
	
	                    if (self.order1Sources) {
	                        self.isReady = true;
	                        self._finishInitWhenReady();
	                    }
	                },
	                error: function(err) {
	                    console.log('Something went wrong: ' + err);
	                }
	            });
	
	        },
	
	        _loadAllskyOldMethod: function() {
	            this.maxOrderAllsky = 3;
	            this._loadLevel2Sources();
	            this._loadLevel3Sources();
	        },
	
	        _loadLevel2Sources: function() {
	            var self = this;
	            $.ajax({
	                url: self.rootUrl + '/' + 'Norder2/Allsky.xml',
	                method: 'GET',
	                success: function(xml) {
	                    self.fields = getFields(self, xml);
	                    self.order2Sources = getSources(self, $(xml).find('CSV').text(), self.fields);
	                    if (self.order3Sources) {
	                        self.isReady = true;
	                        self._finishInitWhenReady();
	                    }
	                },
	                error: function(err) {
	                    console.log('Something went wrong: ' + err);
	                }
	            });
	        },
	
	        _loadLevel3Sources: function() {
	            var self = this;
	            $.ajax({
	                url: self.rootUrl + '/' + 'Norder3/Allsky.xml',
	                method: 'GET',
	                success: function(xml) {
	                    self.order3Sources = getSources(self, $(xml).find('CSV').text(), self.fields);
	                    if (self.order2Sources) {
	                        self.isReady = true;
	                        self._finishInitWhenReady();
	                    }
	                },
	                error: function(err) {
	                    console.log('Something went wrong: ' + err);
	                }
	            });
	        },
	
	        _finishInitWhenReady: function() {
	            this.view.requestRedraw();
	            this.loadNeededTiles();
	        },
	
	        draw: function(ctx, projection, frame, width, height, largestDim, zoomFactor) {
	            if (! this.isShowing || ! this.isReady) {
	                return;
	            }
	            this.drawSources(this.order1Sources, ctx, projection, frame, width, height, largestDim, zoomFactor);
	            this.drawSources(this.order2Sources, ctx, projection, frame, width, height, largestDim, zoomFactor);
	            this.drawSources(this.order3Sources, ctx, projection, frame, width, height, largestDim, zoomFactor);
	            
	            if (!this.tilesInView) {
	                return;
	            }
	            var sources, key, t;
	            for (var k=0; k<this.tilesInView.length; k++) {
	                t = this.tilesInView[k];
	                key = t[0] + '-' + t[1];
	                sources = this.sourcesCache.get(key);
	                if (sources) {
	                    this.drawSources(sources, ctx, projection, frame, width, height, largestDim, zoomFactor);
	                }
	            }
	            
	            
	            
	        },
	        drawSources: function(sources, ctx, projection, frame, width, height, largestDim, zoomFactor) {
	            if (! sources) {
	                return;
	            }
	            for (var k=0, len = sources.length; k<len; k++) {
	                cds.Catalog.drawSource(this, sources[k], ctx, projection, frame, width, height, largestDim, zoomFactor);
	            }
	            for (var k=0, len = sources.length; k<len; k++) {
	                if (! sources[k].isSelected) {
	                    continue;
	                }
	                cds.Catalog.drawSourceSelection(this, sources[k], ctx);
	            }
	        },
	
	        getSources: function() {
	            var ret = [];
	            if (this.order1Sources) {
	                ret = ret.concat(this.order1Sources);
	            }
	            if (this.order2Sources) {
	                ret = ret.concat(this.order2Sources);
	            }
	            if (this.order3Sources) {
	                ret = ret.concat(this.order3Sources);
	            }
	            if (this.tilesInView) {
	                var sources, key, t;
	                for (var k=0; k<this.tilesInView.length; k++) {
	                    t = this.tilesInView[k];
	                    key = t[0] + '-' + t[1];
	                    sources = this.sourcesCache.get(key);
	                    if (sources) {
	                        ret = ret.concat(sources);
	                    }
	                }
	            }
	            
	            return ret;
	        },
	
	
	        
	        deselectAll: function() {
	            if (this.order1Sources) {
	                for (var k=0; k<this.order1Sources.length; k++) {
	                    this.order1Sources[k].deselect();
	                }
	            }
	
	            if (this.order2Sources) {
	                for (var k=0; k<this.order2Sources.length; k++) {
	                    this.order2Sources[k].deselect();
	                }
	            }
	
	            if (this.order3Sources) {
	                for (var k=0; k<this.order3Sources.length; k++) {
	                    this.order3Sources[k].deselect();
	                }
	            }
	            var keys = this.sourcesCache.keys();
	            for (key in keys) {
	                if ( ! this.sourcesCache[key]) {
	                    continue;
	                }
	                var sources = this.sourcesCache[key];
	                for (var k=0; k<sources.length; k++) {
	                    sources[k].deselect();
	                }
	            }
	        },
	
	        show: function() {
	            if (this.isShowing) {
	                return;
	            }
	            this.isShowing = true;
	            this.loadNeededTiles();
	            this.reportChange();
	        },
	        hide: function() {
	            if (! this.isShowing) {
	                return;
	            }
	            this.isShowing = false;
	            this.reportChange();
	        },
	        reportChange: function() {
	            this.view.requestRedraw();
	        },
	        
	        getTileURL: function(norder, npix) {
	            var dirIdx = Math.floor(npix/10000)*10000;
	            return this.rootUrl + "/" + "Norder" + norder + "/Dir" + dirIdx + "/Npix" + npix + ".tsv";
	        },
	    
	        loadNeededTiles: function() {
	            if ( ! this.isShowing) {
	                return;
	            }
	            this.tilesInView = [];
	            
	            var norder = this.view.realNorder;
	            if (norder>this.maxOrder) {
	                norder = this.maxOrder;
	            }
	            if (norder<=this.maxOrderAllsky) {
	                return; // nothing to do, hurrayh !
	            }
	            var cells = this.view.getVisibleCells(norder, this.frame);
	            var ipixList, ipix;
	            for (var curOrder=3; curOrder<=norder; curOrder++) {
	                ipixList = [];
	                for (var k=0; k<cells.length; k++) {
	                    ipix = Math.floor(cells[k].ipix / Math.pow(4, norder - curOrder));
	                    if (ipixList.indexOf(ipix)<0) {
	                        ipixList.push(ipix);
	                    }
	                }
	                
	                // load needed tiles
	                for (var i=0; i<ipixList.length; i++) {
	                    this.tilesInView.push([curOrder, ipixList[i]]);
	                }
	            }
	            
	            var t, key;
	            var self = this;
	            for (var k=0; k<this.tilesInView.length; k++) {
	                t = this.tilesInView[k];
	                key = t[0] + '-' + t[1]; // t[0] is norder, t[1] is ipix
	                if (!this.sourcesCache.get(key)) {
	                    (function(self, norder, ipix) { // wrapping function is needed to be able to retrieve norder and ipix in ajax success function
	                        var key = norder + '-' + ipix;
	                        $.ajax({
	                            /*
	                            url: Aladin.JSONP_PROXY,
	                            data: {"url": self.getTileURL(norder, ipix)},
	                            */
	                            // ATTENTIOn : je passe en JSON direct, car je n'arrive pas a choper les 404 en JSONP
	                            url: self.getTileURL(norder, ipix),
	                            method: 'GET',
	                            //dataType: 'jsonp',
	                            success: function(tsv) {
	                                self.sourcesCache.set(key, getSources(self, tsv, self.fields));
	                                self.view.requestRedraw();
	                            },
	                            error: function() {
	                                // on suppose qu'il s'agit d'une erreur 404
	                                self.sourcesCache.set(key, []);
	                            }
	                        });
	                    })(this, t[0], t[1]);
	                }
	            }
	        },
	
	        reportChange: function() { // TODO: to be shared with Catalog
	            this.view && this.view.requestRedraw();
	        }
	    
	
	    }; // END OF .prototype functions
	    
	    
	    return ProgressiveCat;
	})();
	    
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Tile
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Tile = (function() {
	    // constructor
		function Tile(img, url) {
			this.img = img;
			this.url = url;
		};
		
		// check whether the image corresponding to the tile is loaded and ready to be displayed
		//
		// source : http://www.sajithmr.me/javascript-check-an-image-is-loaded-or-not
		Tile.isImageOk = function(img) {
			if (img.allSkyTexture) {
				return true;
			}
			
	        if (!img.src) {
	            return false;
	        }
	
		    // During the onload event, IE correctly identifies any images that
		    // weren’t downloaded as not complete. Others should too. Gecko-based
		    // browsers act like NS4 in that they report this incorrectly.
		    if (!img.complete) {
		        return false;
		    }
	
		    // However, they do have two very useful properties: naturalWidth and
		    // naturalHeight. These give the true size of the image. If it failed
		    // to load, either of these should be zero.
	
		    if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
		        return false;
		    }
	
		    // No other way of checking: assume it’s ok.
		    return true;
		};
		
	
		return Tile;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File TileBuffer
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	TileBuffer = (function() {
		var NB_MAX_TILES = 800; // buffer size
		
		// constructor
		function TileBuffer() {
			this.pointer = 0;
			this.tilesMap = {};
			this.tilesArray = new Array(NB_MAX_TILES);
	
			for (var i=0; i<NB_MAX_TILES; i++) {
				this.tilesArray[i] = new Tile(new Image(), null);
			}
		};
		
		TileBuffer.prototype.addTile = function(url) {
		    // return null if already in buffer
	        if (this.getTile(url)) {
	            return null;
	        }
	
	        // delete existing tile
	        var curTile = this.tilesArray[this.pointer];
	        if (curTile.url != null) {
	            curTile.img.src = null;
	            delete this.tilesMap[curTile.url];
	        }
	
	        this.tilesArray[this.pointer].url = url;
	        this.tilesMap[url] = this.tilesArray[this.pointer];
	
	        this.pointer++;
	        if (this.pointer>=NB_MAX_TILES) {
	            this.pointer = 0;
	        }
	
	        return this.tilesMap[url];
		};
		
		TileBuffer.prototype.getTile = function(url) {
	        return this.tilesMap[url];
		};
		
		return TileBuffer;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File ColorMap.js
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	ColorMap = (function() {
	    
	    
	    // constructor
	    ColorMap = function(view) {
	        this.view = view;
	        this.reversed = false;
	        this.mapName = 'native';
	        this.sig = this.signature();
	    };
	    
	ColorMap.MAPS = {};
	    
	    ColorMap.MAPS['eosb'] = {
	            name: 'Eos B',
	            r: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,9,18,27,36,45,49,57,72,81,91,100,109,118,127,
	                136,131,139,163,173,182,191,200,209,218,227,213,221,255,255,255,255,255,
	                255,255,255,229,229,255,255,255,255,255,255,255,255,229,229,255,255,255,
	                255,255,255,255,255,229,229,255,255,255,255,255,255,255,255,229,229,255,
	                255,255,255,255,255,255,255,229,229,255,255,255,255,255,255,255,255,229,
	                229,255,255,255,255,255,255,255,255,229,229,255,255,255,255,255,255,255,
	                255,229,229,255,255,255,255,255,255,255,255,229,229,255,253,251,249,247,
	                245,243,241,215,214,235,234,232,230,228,226,224,222,198,196,216,215,213,
	                211,209,207,205,203,181,179,197,196,194,192,190,188,186,184,164,162,178,
	                176,175,173,171,169,167,165,147,145,159,157,156,154,152,150,148,146,130,
	                128,140,138,137,135,133,131,129,127,113,111,121,119,117,117],
	            g: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,15,23,31,39,47,55,57,64,79,87,95,
	                103,111,119,127,135,129,136,159,167,175,183,191,199,207,215,200,207,239,
	                247,255,255,255,255,255,255,229,229,255,255,255,255,255,255,255,255,229,
	                229,255,255,255,255,255,255,255,255,229,229,255,250,246,242,238,233,229,
	                225,198,195,212,208,204,199,195,191,187,182,160,156,169,165,161,157,153,
	                148,144,140,122,118,127,125,123,121,119,116,114,112,99,97,106,104,102,
	                99,97,95,93,91,80,78,84,82,80,78,76,74,72,70,61,59,63,61,59,57,55,53,50,
	                48,42,40,42,40,38,36,33,31,29,27,22,21,21,19,16,14,12,13,8,6,3,1,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	            b: [116,121,127,131,136,140,144,148,153,
	                157,145,149,170,174,178,182,187,191,195,199,183,187,212,216,221,225,229,
	                233,238,242,221,225,255,247,239,231,223,215,207,199,172,164,175,167,159,
	                151,143,135,127,119,100,93,95,87,79,71,63,55,47,39,28,21,15,7,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0]
	    };
	    ColorMap.MAPS['rainbow'] = {
	            name: 'Rainbow',
	            r: [0,4,9,13,18,22,27,31,36,40,45,50,54,
	                58,61,64,68,69,72,74,77,79,80,82,83,85,84,86,87,88,86,87,87,87,85,84,84,
	                84,83,79,78,77,76,71,70,68,66,60,58,55,53,46,43,40,36,33,25,21,16,12,4,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,8,12,21,25,29,33,42,
	                46,51,55,63,67,72,76,80,89,93,97,101,110,114,119,123,131,135,140,144,153,
	                157,161,165,169,178,182,187,191,199,203,208,212,221,225,229,233,242,246,
	                250,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255],
	            g: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,4,8,16,21,25,29,38,42,46,51,55,63,67,72,76,84,89,93,97,
	                106,110,114,119,127,131,135,140,144,152,157,161,165,174,178,182,187,195,
	                199,203,208,216,220,225,229,233,242,246,250,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,250,242,238,233,229,221,216,212,208,199,195,191,187,178,174,170,165,
	                161,153,148,144,140,131,127,123,119,110,106,102,97,89,85,80,76,72,63,59,
	                55,51,42,38,34,29,21,17,12,8,0],
	            b: [0,3,7,10,14,19,23,28,32,38,43,48,53,
	                59,63,68,72,77,81,86,91,95,100,104,109,113,118,122,127,132,136,141,145,
	                150,154,159,163,168,173,177,182,186,191,195,200,204,209,214,218,223,227,
	                232,236,241,245,250,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,
	                255,255,255,255,255,255,246,242,238,233,225,220,216,212,203,199,195,191,
	                187,178,174,170,165,157,152,148,144,135,131,127,123,114,110,106,102,97,
	                89,84,80,76,67,63,59,55,46,42,38,34,25,21,16,12,8,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
	                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	    };
	    ColorMap.MAPS['cubehelix'] = {
	            name: 'Cubehelix',
	            r: [0,1,3,4,6,8,9,10,12,13,14,15,17,18,
	                19,20,20,21,22,23,23,24,24,25,25,25,26,26,26,26,26,26,26,26,26,26,26,25,
	                25,25,25,24,24,24,23,23,23,23,22,22,22,21,21,21,21,21,21,20,20,20,21,21,
	                21,21,21,22,22,22,23,23,24,25,26,27,27,28,30,31,32,33,35,36,38,39,41,43,
	                45,47,49,51,53,55,57,60,62,65,67,70,72,75,78,81,83,86,89,92,95,98,101,104,
	                107,110,113,116,120,123,126,129,132,135,138,141,144,147,150,153,155,158,
	                161,164,166,169,171,174,176,178,181,183,185,187,189,191,193,194,196,198,
	                199,201,202,203,204,205,206,207,208,209,209,210,211,211,211,212,212,212,
	                212,212,212,212,212,211,211,211,210,210,210,209,208,208,207,207,206,205,
	                205,204,203,203,202,201,201,200,199,199,198,197,197,196,196,195,195,194,
	                194,194,193,193,193,193,193,193,193,193,193,193,194,194,195,195,196,196,
	                197,198,199,200,200,202,203,204,205,206,208,209,210,212,213,215,217,218,
	                220,222,223,225,227,229,231,232,234,236,238,240,242,244,245,247,249,251,
	                253,255],
	            g: [0,0,1,1,2,2,3,4,4,5,6,6,7,8,9,10,
	                11,11,12,13,14,15,17,18,19,20,21,22,24,25,26,28,29,31,32,34,35,37,38,40,
	                41,43,45,46,48,50,52,53,55,57,58,60,62,64,66,67,69,71,73,74,76,78,79,81,
	                83,84,86,88,89,91,92,94,95,97,98,99,101,102,103,104,106,107,108,109,110,
	                111,112,113,114,114,115,116,116,117,118,118,119,119,120,120,120,121,121,
	                121,121,122,122,122,122,122,122,122,122,122,122,122,122,122,122,122,121,
	                121,121,121,121,121,121,121,121,120,120,120,120,120,120,120,120,120,120,
	                121,121,121,121,121,122,122,122,123,123,124,124,125,125,126,127,127,128,
	                129,130,131,131,132,133,135,136,137,138,139,140,142,143,144,146,147,149,
	                150,152,154,155,157,158,160,162,164,165,167,169,171,172,174,176,178,180,
	                182,183,185,187,189,191,193,194,196,198,200,202,203,205,207,208,210,212,
	                213,215,216,218,219,221,222,224,225,226,228,229,230,231,232,233,235,236,
	                237,238,239,240,240,241,242,243,244,244,245,246,247,247,248,248,249,250,
	                250,251,251,252,252,253,253,254,255],
	            b: [0,1,3,4,6,8,9,11,13,15,17,19,21,23,
	                25,27,29,31,33,35,37,39,41,43,45,47,48,50,52,54,56,57,59,60,62,63,65,66,
	                67,69,70,71,72,73,74,74,75,76,76,77,77,77,78,78,78,78,78,78,78,77,77,77,
	                76,76,75,75,74,73,73,72,71,70,69,68,67,66,66,65,64,63,61,60,59,58,58,57,
	                56,55,54,53,52,51,51,50,49,49,48,48,47,47,47,46,46,46,46,46,47,47,47,48,
	                48,49,50,50,51,52,53,55,56,57,59,60,62,64,65,67,69,71,74,76,78,81,83,86,
	                88,91,94,96,99,102,105,108,111,114,117,120,124,127,130,133,136,140,143,
	                146,149,153,156,159,162,165,169,172,175,178,181,184,186,189,192,195,197,
	                200,203,205,207,210,212,214,216,218,220,222,224,226,227,229,230,231,233,
	                234,235,236,237,238,239,239,240,241,241,242,242,242,243,243,243,243,243,
	                243,243,243,243,243,242,242,242,242,241,241,241,241,240,240,240,239,239,
	                239,239,239,238,238,238,238,238,238,238,238,239,239,239,240,240,240,241,
	                242,242,243,244,245,246,247,248,249,250,252,253,255]
	    };
	
	
	    
	    ColorMap.MAPS_CUSTOM = ['cubehelix', 'eosb', 'rainbow'];
	    ColorMap.MAPS_NAMES = ['native', 'grayscale'].concat(ColorMap.MAPS_CUSTOM);
	    
	    ColorMap.prototype.reverse = function(val) {
	        if (val) {
	            this.reversed = val;
	        }
	        else {
	            this.reversed = ! this.reversed;
	        }
	        this.sig = this.signature();
	        this.view.requestRedraw();
	    };
	    
	    
	    ColorMap.prototype.signature = function() {
	        var s = this.mapName;
	        
	        if (this.reversed) {
	            s += ' reversed';
	        }
	        
	        return s;
	    };
	    
	    ColorMap.prototype.update = function(mapName) {
	        this.mapName = mapName;
	        this.sig = this.signature();
	        this.view.requestRedraw();
	    };
	    
	    ColorMap.prototype.apply = function(img) {
	        if ( this.sig=='native' ) {
	            return img;
	        }
	        
	        if (img.cmSig==this.sig) {
	            return img.cmImg; // return cached pixels
	        }
	        
	        var canvas = document.createElement("canvas");
	        canvas.width = img.width;
	        canvas.height = img.height;
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, 0, 0);
	        
	        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	        var pixelData = imageData.data;
	        var length = pixelData.length;
	        var a, b, c;
	        var switchCase = 3;
	        if (this.mapName=='grayscale') {
	            switchCase = 1;
	        }
	        else if (ColorMap.MAPS_CUSTOM.indexOf(this.mapName)>=0) {
	            switchCase = 2;
	        }
	        for (var i = 0; i < length; i+= 4) {
	            switch(switchCase) {
	                case 1:
	                    a = b = c = AladinUtils.myRound((pixelData[i]+pixelData[i+1]+pixelData[i+2])/3);
	                    break;
	                case 2:
	                    if (this.reversed) {
	                        a = ColorMap.MAPS[this.mapName].r[255-pixelData[i]];
	                        b = ColorMap.MAPS[this.mapName].g[255-pixelData[i+1]];
	                        c = ColorMap.MAPS[this.mapName].b[255-pixelData[i+2]];
	                    }
	                    else {
	                        a = ColorMap.MAPS[this.mapName].r[pixelData[i]];
	                        b = ColorMap.MAPS[this.mapName].g[pixelData[i+1]];
	                        c = ColorMap.MAPS[this.mapName].b[pixelData[i+2]];
	                    }
	                    break;
	                default:
	                    a = pixelData[i];
	                    b = pixelData[i + 1];
	                    c = pixelData[i + 2];
	                    
	            }
	            if (switchCase!=2 && this.reversed) {
	                a = 255-a;
	                b = 255-b;
	                c = 255-c;
	              
	            }
	            pixelData[i]     = a;
	            pixelData[i + 1] = b;
	            pixelData[i + 2] = c;
	            
	        }
	        imageData.data = pixelData;
	        ctx.putImageData(imageData, 0, 0);
	        
	        // cache image with color map applied
	        img.cmSig = this.sig;
	        img.cmImg = canvas;
	
	        return img.cmImg;
	    };
	    
	    return ColorMap;
	})();
	    
	// Copyright 2016 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File HpxKey
	 * This class represents a HEALPix cell
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	HpxKey = (function() {
	
	    "use strict";
	
	    /** Constructor
	     *  
	     */
	    var HpxKey = function(norder, npix, hips, width, height, dx, dy, allskyTexture, allskyTextureSize) {
	        this.norder = norder;
	        this.npix = npix;
	
	        this.nside = Math.pow(2, norder);
	
	        this.hips = hips; // survey to which this HpxKey is attached
	        this.frame = hips.cooFrame; // coordinate frame of the survey to which this HpxKey is attached
	
	        this.width = width; // width of the tile
	        this.height = height; // height of the tile
	
	        this.dx = dx || 0; // shift in x (for all-sky tiles)
	        this.dy = dy || 0; // shift in y (for all-sky tiles)
	
	        this.allskyTexture = allskyTexture || undefined;
	        this.allskyTextureSize = allskyTextureSize;
	
	        this.parente = 0; // if this key comes from an ancestor, length of the filiation
	
	        this.children = null; 
	        this.ancestor = null; // ancestor having the pixels
	    }
	
	    // "static" methods
	    HpxKey.createHpxKeyfromAncestor = function(father, childNb) {
	        var hpxKey = new HpxKey(father.norder+1, father.npix*4 + childNb, father.hips, father.width/2, father.height/2,
	                                childNb==2 || childNb==3 ? father.dx+father.width/2 : father.dx, childNb==1 || childNb==3 ? father.dy+father.height/2 : father.dy, father.allskyTexture, father.allskyTextureSize);
	        hpxKey.parente = father.parente + 1;
	        hpxKey.ancestor = father.ancestor || father;
	
	
	        return hpxKey;
	    };
	
	    var MAX_PARENTE = 4;
	
	    HpxKey.prototype = {
	
	        draw: function(ctx, view) {
	//console.log('Drawing ', this.norder, this.npix);
	            var n = 0; // number of traced triangles
	            var corners = this.getProjViewCorners(view);
	
	            if (corners==null) {
	                return 0;
	            }
	     
	
	            var now = new Date().getTime();
	            var updateNeededTiles = this.ancestor==null && this.norder>=3 && (now-this.hips.lastUpdateDateNeededTiles) > 0.1;
	
	            try {
	                if (isTooLarge(corners)) {
	//console.log('too large');
	                    var m = this.drawChildren(ctx, view, MAX_PARENTE);
	
	                    // Si aucun sous-losange n'a pu être dessiné, je trace tout de même le père
	                    if( m>0 ) {
	                        return m;
	                    }
	                }
	            }
	            catch(e) {
	                return 0;
	            }
	
	
	            // actual drawing
	            var norder = this.ancestor==null ? this.norder : this.ancestor.norder;
	            var npix = this.ancestor==null ? this.npix : this.ancestor.npix;
	
	            //console.log(corners);
	            //corners = AladinUtils.grow2(corners, 1); // grow by 1 pixel in each direction
	            //console.log(corners);
	            var url = this.hips.getTileURL(norder, npix);
	            var tile = this.hips.tileBuffer.getTile(url);
	            if (tile && Tile.isImageOk(tile.img) || this.allskyTexture) {
	                if (!this.allskyTexture && !this.hips.tileSize) {
	                    this.hips.tileSize = tile.img.width;
	                }
	                var img = this.allskyTexture || tile.img;
	                var w = this.allskyTextureSize || img.width;
	                if (this.parente) {
	                    w = w / Math.pow(2, this.parente);
	                } 
	
	                this.hips.drawOneTile2(ctx, img, corners, w, null, this.dx, this.dy, true, norder);
	                n += 2;
	            }
	            else if (updateNeededTiles && ! tile) {
	                tile = this.hips.tileBuffer.addTile(url);
	                view.downloader.requestDownload(tile.img, tile.url, this.hips.useCors);
	                this.hips.lastUpdateDateNeededTiles = now;
	                view.requestRedrawAtDate(now+HpxImageSurvey.UPDATE_NEEDED_TILES_DELAY+10);
	            }
	
	
	            return n;
	        },
	
	        drawChildren: function(ctx, view, maxParente) {
	            var n=0;
	            var limitOrder = 13; // corresponds to NSIDE=8192, current HealpixJS limit
	            if ( this.width>1 && this.norder<limitOrder && this.parente<maxParente ) {
	                var children = this.getChildren();
	                if ( children!=null ) {
	                    for ( var i=0; i<4; i++ ) {
	//console.log(i);
	                        if ( children[i]!=null ) {
	                            n += children[i].draw(ctx , view, maxParente);
	                        }
	                    }
	                }
	            }
	
	            return n;
	        },
	
	
	        // returns the 4 HpxKey children
	        getChildren: function() {
	            if (this.children!=null) {
	                return this.children;
	            }
	
	            var children = [];
	            for ( var childNb=0; childNb<4; childNb++ ) {
	                var child = HpxKey.createHpxKeyfromAncestor(this, childNb);
	                children[childNb] = child;
	            }
	            this.children = children;
	
	
	            return this.children;
	        },
	
	
	
	        getProjViewCorners: function(view) {
	            var cornersXY = [];
	            var cornersXYView = [];
	            var spVec = new SpatialVector();
	
	            corners = HealpixCache.corners_nest(this.npix, this.nside);
	
	            var lon, lat;
	            for (var k=0; k<4; k++) {
	                spVec.setXYZ(corners[k].x, corners[k].y, corners[k].z);
	
	                // need for frame transformation ?
	                if (this.frame.system != view.cooFrame.system) {
	                    if (this.frame.system == CooFrameEnum.SYSTEMS.J2000) {
	                        var radec = CooConversion.J2000ToGalactic([spVec.ra(), spVec.dec()]);
	                        lon = radec[0];
	                        lat = radec[1];
	                    }
	                    else if (this.frame.system == CooFrameEnum.SYSTEMS.GAL) {
	                        var radec = CooConversion.GalacticToJ2000([spVec.ra(), spVec.dec()]);
	                        lon = radec[0];
	                        lat = radec[1];
	                    }
	                }
	                else {
	                    lon = spVec.ra();
	                    lat = spVec.dec();
	                }
	                cornersXY[k] = view.projection.project(lon, lat);
	            }
	
	
	            if (cornersXY[0] == null ||  cornersXY[1] == null  ||  cornersXY[2] == null ||  cornersXY[3] == null ) {
	                return null;
	            }
	
	
	
	            for (var k=0; k<4; k++) {
	                cornersXYView[k] = AladinUtils.xyToView(cornersXY[k].X, cornersXY[k].Y, view.width, view.height, view.largestDim, view.zoomFactor);
	            }
	
	            return cornersXYView;
	        }
	
	    } // end of HpxKey.prototype
	
	
	
	
	    /** Returns the squared distance for points in array c at indexes g and d
	     */
	    var dist = function(c, g, d) {
	        var dx=c[g].vx-c[d].vx;
	        var dy=c[g].vy-c[d].vy;
	        return  dx*dx + dy*dy;
	    }
	
	
	    var M = 280*280;
	    var N = 150*150;
	    var RAP=0.7;
	
	    /** Returns true if the HEALPix rhomb described by its 4 corners (array c)
	     * is too large to be drawn in one pass ==> need to be subdivided */
	    var isTooLarge = function(c) {
	
	        var d1,d2;
	        if ( (d1=dist(c,0,2))>M || (d2=dist(c,2,1))>M ) {
	            return true;
	        }
	        if ( d1==0 || d2==0 ) {
	            throw "Rhomb error";
	        }
	        var diag1 = dist(c,0,3);
	        var diag2 = dist(c,1,2);
	        if ( diag2==0 || diag2==0 ) {
	            throw "Rhomb error";
	        }
	        var rap = diag2>diag1 ? diag1/diag2 : diag2/diag1;
	
	        return rap<RAP && (diag1>N || diag2>N);
	    }
	
	
	    return HpxKey;
	
	})();
	
	
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File HpxImageSurvey
	 * 
	 * Author: Thomas Boch [CDS]
	 * 
	 *****************************************************************************/
	
	HpxImageSurvey = (function() {
	
	
	    /** Constructor
	     * cooFrame and maxOrder can be set to null
	     * They will be determined by reading the properties file
	     *  
	     */
	    var HpxImageSurvey = function(idOrHiPSDefinition, name, rootUrl, cooFrame, maxOrder, options) {
	        // new way
	        if (idOrHiPSDefinition instanceof HiPSDefinition) {
	            this.hipsDefinition = idOrHiPSDefinition;
	
	        }
	
	        else {
	// REPRENDRE LA,  EN CREANT l'OBJET HiPSDefinition ou FAIRE dans l'autre sens
	            // old way, we retrofit parameters into a HiPSDefinition object
	            var hipsDefProps = {};
	
	            this.id = idOrHiPSDefinition;
	            hipsDefProps['ID'] = this.id;
	
	    	    this.name = name;
	            hipsDefProps['obs_title'] = this.name;
	
	            // remove final slash
	    	    if (rootUrl.slice(-1) === '/') {
	    	        this.rootUrl = rootUrl.substr(0, rootUrl.length-1);
	    	    }
	    	    else {
	    	        this.rootUrl = rootUrl;
	    	    }
	            this.additionalParams = (options && options.additionalParams) || null; // parameters for cut, stretch, etc
	
	            // make URL absolute
	            this.rootUrl = Utils.getAbsoluteURL(this.rootUrl);
	
	            // fast fix for HTTPS support --> will work for all HiPS served by CDS
	            if (Utils.isHttpsContext() && ( /u-strasbg.fr/i.test(this.rootUrl) || /unistra.fr/i.test(this.rootUrl)  ) ) {
	                this.rootUrl = this.rootUrl.replace('http://', 'https://');
	            }
	    	
	    	    options = options || {};
	    	    // TODO : support PNG
	    	    this.imgFormat = options.imgFormat || 'jpg';
	
	            // permet de forcer l'affichage d'un certain niveau
	            this.minOrder = options.minOrder || null;
	
	
	            // TODO : lire depuis fichier properties
	            this.cooFrame = CooFrameEnum.fromString(cooFrame, CooFrameEnum.J2000);
	
	            this.longitudeReversed = options.longitudeReversed || false;
	        
	            // force coo frame for Glimpse 360
	            if (this.rootUrl.indexOf('/glimpse360/aladin/data')>=0) {
	                this.cooFrame = CooFrameEnum.J2000;
	            }
	            // TODO : lire depuis fichier properties
	            this.maxOrder = maxOrder;
	
	            this.hipsDefinition = HiPSDefinition.fromProperties(hipsDefProps);
	        }
	
	        this.ascendingLongitude = false;
	    	
	        this.tileSize = undefined;
	    	this.allskyTexture = null;
	    	this.alpha = 0.0; // opacity value between 0 and 1 (if this layer is an opacity layer)
	    	this.allskyTextureSize = 0;
	        this.lastUpdateDateNeededTiles = 0;
	
	        var found = false;
	        for (var k=0; k<HpxImageSurvey.SURVEYS.length; k++) {
	            if (HpxImageSurvey.SURVEYS[k].id==this.id) {
	                found = true;
	            }
	        }
	        if (! found) {
	            HpxImageSurvey.SURVEYS.push({
	                 "id": this.id,
	                 "url": this.rootUrl,
	                 "name": this.name,
	                 "maxOrder": this.maxOrder,
	                 "frame": this.cooFrame
	            });
	        }
	        HpxImageSurvey.SURVEYS_OBJECTS[this.id] = this;
	    };
	
	
	
	    HpxImageSurvey.UPDATE_NEEDED_TILES_DELAY = 1000; // in milliseconds
	    
	    HpxImageSurvey.prototype.init = function(view, callback) {
	    	this.view = view;
	    	
	        if (!this.cm) {
	            this.cm = new ColorMap(this.view);
	        }
	    	
	    	// tileBuffer is now shared across different image surveys
	    	//this.tileBuffer = new TileBuffer();
	    	this.tileBuffer = this.view.tileBuffer;
	    	
	    	this.useCors = false;
	    	var self = this;
	        if ($.support.cors) {
	            // testing if server supports CORS ( http://www.html5rocks.com/en/tutorials/cors/ )
	            $.ajax({
	                type: 'GET',
	                url: this.rootUrl + '/properties'  + (this.additionalParams ? ('?' + this.additionalParams) : ''),
	                dataType: 'text',
	                xhrFields: {
	                },
	                headers: {
	                },
	                success: function() {
	                    // CORS is supported
	                    self.useCors = true;
	                    
	                    self.retrieveAllskyTextures();
	                    if (callback) {
	                        callback();
	                    }
	                },
	                error: function(jqXHR, textStatus, errorThrown) {
	                    // CORS is not supported
	                    self.retrieveAllskyTextures();
	                    if (callback) {
	                        callback();
	                    }
	                }
	              });
	        }
	        else {
	            this.retrieveAllskyTextures();
	            callback();
	        }
	    	
	    };
	    
	    HpxImageSurvey.DEFAULT_SURVEY_ID = "P/DSS2/color";
	    
	    HpxImageSurvey.SURVEYS_OBJECTS = {};
	    HpxImageSurvey.SURVEYS = [
	     {
	        "id": "P/2MASS/color",
	        "url": "http://alasky.u-strasbg.fr/2MASS/Color",
	        "name": "2MASS colored",
	        "maxOrder": 9,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/DSS2/color",
	        "url": "http://alasky.u-strasbg.fr/DSS/DSSColor",
	        "name": "DSS colored",
	        "maxOrder": 9,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/DSS2/red",
	        "url": "http://alasky.u-strasbg.fr/DSS/DSS2Merged",
	        "name": "DSS2 Red (F+R)",
	        "maxOrder": 9,
	        "frame": "equatorial",
	        "format": "jpeg fits"
	     },
	     {
	        "id": "P/PanSTARRS/DR1/g",
	        "url": "http://alasky.u-strasbg.fr/Pan-STARRS/DR1/g",
	        "name": "PanSTARRS DR1 g",
	        "maxOrder": 11,
	        "frame": "equatorial",
	        "format": "jpeg fits"
	     },
	     {
	        "id": "P/PanSTARRS/DR1/color-z-zg-g",
	        "url": "http://alasky.u-strasbg.fr/Pan-STARRS/DR1/color-z-zg-g",
	        "name": "PanSTARRS DR1 color",
	        "maxOrder": 11,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/DECaPS/DR1/color",
	        "url": "http://alasky.u-strasbg.fr/DECaPS/DR1/color",
	        "name": "DECaPS DR1 color",
	        "maxOrder": 11,
	        "frame": "equatorial",
	        "format": "jpeg png"
	     },
	     {
	        "id": "P/Fermi/color",
	        "url": "http://alasky.u-strasbg.fr/Fermi/Color",
	        "name": "Fermi color",
	        "maxOrder": 3,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/Finkbeiner",
	        "url": "http://alasky.u-strasbg.fr/FinkbeinerHalpha",
	        "maxOrder": 3,
	        "frame": "galactic",
	        "format": "jpeg fits",
	        "name": "Halpha"
	     },
	     {
	        "id": "P/GALEXGR6/AIS/color",
	        "url": "http://alasky.u-strasbg.fr/GALEX/GR6-02-Color",
	        "name": "GALEX Allsky Imaging Survey colored",
	        "maxOrder": 8,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/IRIS/color",
	        "url": "http://alasky.u-strasbg.fr/IRISColor",
	        "name": "IRIS colored",
	        "maxOrder": 3,
	        "frame": "galactic",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/Mellinger/color",
	        "url": "http://alasky.u-strasbg.fr/MellingerRGB",
	        "name": "Mellinger colored",
	        "maxOrder": 4,
	        "frame": "galactic",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/SDSS9/color",
	        "url": "http://alasky.u-strasbg.fr/SDSS/DR9/color",
	        "name": "SDSS9 colored",
	        "maxOrder": 10,
	        "frame": "equatorial",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/SPITZER/color",
	        "url": "http://alasky.u-strasbg.fr/SpitzerI1I2I4color",
	        "name": "IRAC color I1,I2,I4 - (GLIMPSE, SAGE, SAGE-SMC, SINGS)",
	        "maxOrder": 9,
	        "frame": "galactic",
	        "format": "jpeg"
	     },
	     {
	        "id": "P/VTSS/Ha",
	        "url": "http://alasky.u-strasbg.fr/VTSS/Ha",
	        "maxOrder": 3,
	        "frame": "galactic",
	        "format": "png jpeg fits",
	        "name": "VTSS-Ha"
	     },
	     {
	        "id": "P/XMM/EPIC",
	        "url": "http://saada.u-strasbg.fr/xmmallsky",
	        "name": "XMM-Newton stacked EPIC images (no phot. normalization)",
	        "maxOrder": 7,
	        "frame": "equatorial",
	        "format": "png fits"
	     },
	     {
	         "id": "P/XMM/PN/color",
	          "url": "http://saada.unistra.fr/xmmpnsky",
	          "name": "XMM PN colored",
	          "maxOrder": 7,
	          "frame": "equatorial",
	          "format": "png jpeg"
	     },
	     {
	         "id": "P/allWISE/color",
	         "url": "http://alasky.u-strasbg.fr/AllWISE/RGB-W4-W2-W1/",
	         "name": "AllWISE color",
	         "maxOrder": 8,
	         "frame": "equatorial",
	         "format": "jpeg"
	     },
	     {
	         "id": "P/GLIMPSE360",
	         "url": "http://www.spitzer.caltech.edu/glimpse360/aladin/data",
	         "name": "GLIMPSE360",
	         "maxOrder": 9,
	         "frame": "equatorial",
	         "format": "jpeg"
	     }
	  ];
	
	
	    
	    HpxImageSurvey.getAvailableSurveys = function() {
	    	return HpxImageSurvey.SURVEYS;
	    };
	    
	    HpxImageSurvey.getSurveyInfoFromId = function(id) {
	        var surveys = HpxImageSurvey.getAvailableSurveys();
	        for (var i=0; i<surveys.length; i++) {
	            if (surveys[i].id==id) {
	                return surveys[i];
	            }
	        }
	        return null;
	    };
	
	    HpxImageSurvey.getSurveyFromId = function(id) {
	        if (HpxImageSurvey.SURVEYS_OBJECTS[id]) {
	            return HpxImageSurvey.SURVEYS_OBJECTS[id];
	        }
	        var surveyInfo = HpxImageSurvey.getSurveyInfoFromId(id);
	        if (surveyInfo) {
	            var options = {};
	            if ( surveyInfo.format && surveyInfo.format.indexOf('jpeg')<0 && surveyInfo.format.indexOf('png')>=0 ) {
	                options.imgFormat = 'png';
	            }
	            return new HpxImageSurvey(surveyInfo.id, surveyInfo.name, surveyInfo.url, surveyInfo.frame, surveyInfo.maxOrder, options);
	        }
	
	        return null;
	    }
	   
	    
	    HpxImageSurvey.prototype.getTileURL = function(norder, npix) {
	    	var dirIdx = Math.floor(npix/10000)*10000;
	    	return this.rootUrl + "/" + "Norder" + norder + "/Dir" + dirIdx + "/Npix" + npix + "." + this.imgFormat  + (this.additionalParams ? ('?' + this.additionalParams) : '');;
	    };
	    
	    HpxImageSurvey.prototype.retrieveAllskyTextures = function() {
	    	// start loading of allsky
	    	var img = new Image();
	    	if (this.useCors) {
	            img.crossOrigin = 'anonymous';
	        }
	    	var self = this;
	    	img.onload = function() {
	    		// sur ipad, le fichier qu'on récupère est 2 fois plus petit. Il faut donc déterminer la taille de la texture dynamiquement
	    	    self.allskyTextureSize = img.width/27;
	            self.allskyTexture = img;
	   
	            /* 
	    		// récupération des 768 textures (NSIDE=4)
	    		for (var j=0; j<29; j++) {
	    			for (var i=0; i<27; i++) {
	    				var c = document.createElement('canvas');
	    				c.width = c.height = self.allskyTextureSize;
	    				c.allSkyTexture = true;
	    				var context = c.getContext('2d');
	    				context.drawImage(img, i*self.allskyTextureSize, j*self.allskyTextureSize, self.allskyTextureSize, self.allskyTextureSize, 0, 0, c.width, c.height);
	    				self.allskyTextures.push(c);
	    			}
	    		}
	            */
	    		self.view.requestRedraw();
	    	};
	    	img.src = this.rootUrl + '/Norder3/Allsky.' + this.imgFormat + (this.additionalParams ? ('?' + this.additionalParams) : '');
	    
	    };
	
	    // Nouvelle méthode pour traitement des DEFORMATIONS
	    /**
	     * Draw the image survey according 
	     *
	     * @param ctx: canvas context where to draw
	     * @param view
	     * @param subdivide: should
	     *
	     */
	    HpxImageSurvey.prototype.draw = function(ctx, view, subdivide, curOverlayNorder) {
	        subdivide = (subdivide===undefined) ? false: subdivide;
	
	        var cornersXYViewMapAllsky = view.getVisibleCells(3, this.cooFrame);
	        var cornersXYViewMapHighres = null;
	
	
	
	        var norder4Display = Math.min(curOverlayNorder, this.maxOrder);
	        if (curOverlayNorder>=3) {
	            if (curOverlayNorder==3) {
	                cornersXYViewMapHighres = cornersXYViewMapAllsky;
	            }
	            else {
	                cornersXYViewMapHighres = view.getVisibleCells(norder4Display, this.cooFrame);
	            }
	        }
	
	        // new way of drawing
	        if (subdivide) {
	
	            if (curOverlayNorder<=4) {
	                this.drawAllsky(ctx, cornersXYViewMapAllsky, norder4Display, view);
	            }
	
	            if (curOverlayNorder>=3) {
	                this.drawHighres(ctx, cornersXYViewMapHighres, norder4Display, view);
	            }
	/*
	            else {
	                this.drawAllsky(ctx, cornersXYViewMapAllsky, norder4Display, view);
	            }
	*/
	
	            return;
	        }
	
	        // regular way of drawing
	        // TODO : a t on besoin de dessiner le allsky si norder>=3 ?
	        // TODO refactoring : devrait être une méthode de HpxImageSurvey
	        if (view.curNorder>=3) {
	            this.redrawHighres(ctx, cornersXYViewMapHighres, view.curNorder);
	        }
	        else {
	            this.redrawAllsky(ctx, cornersXYViewMapAllsky, view.fov, view.curNorder);
	        }
	
	    };
	
	    HpxImageSurvey.prototype.drawHighres = function(ctx, cornersXYViewMap, norder, view) {
	//////////////////////////////
	        var parentTilesToDraw = [];
	        var parentTilesToDrawIndex = {};
	        var parentTilesMissingIndex = {};
	        for (var k=0; k<cornersXYViewMap.length; k++) {
	            var ipix = cornersXYViewMap[k].ipix
	            var tileURL = this.getTileURL(norder, ipix);
	            var tile = this.tileBuffer.getTile(tileURL);
	            var tileAvailable = tile && Tile.isImageOk(tile.img);
	            if (! tileAvailable) { // if tile is not available, search if upper level tiles can be drawn
	                var MAX_UPPER_LEVELS = 4; // we search parent tiles up to 4 levels
	                for (var parentOrder = norder -1 ; parentOrder>=3 && parentOrder >= norder-MAX_UPPER_LEVELS ; parentOrder--) {
	                    var parentIpix = ~~(ipix / Math.pow(4, norder - parentOrder));
	                    var key = parentOrder + '-' + parentIpix;
	                    if (parentTilesToDrawIndex[key]===true || parentTilesMissingIndex===true) {
	                        break;
	                    }
	                    var parentTileURL = this.getTileURL(parentOrder, parentIpix);
	                    var parentTile = this.tileBuffer.getTile(parentTileURL);
	                    var parentTileAvailable = parentTile && Tile.isImageOk(parentTile.img);
	                    if (parentTileAvailable) {
	                        parentTilesToDraw.push({ipix: parentIpix, order: parentOrder});
	                        parentTilesToDrawIndex[key] = true;
	
	                        break;
	                    }
	                    else {
	                        parentTilesMissingIndex[key] = true;
	                    }
	                }
	            }
	        }
	        // sort to draw lower norder first
	        parentTilesToDraw = parentTilesToDraw.sort(function(itemA, itemB) {
	            return itemA.order - itemB.order;
	        });
	
	//////////////////////////////
	
	        var tSize = this.tileSize || 512;
	        // draw parent tiles
	        for (var k=0; k<parentTilesToDraw.length; k++) {
	            var t = parentTilesToDraw[k];
	            new HpxKey(t.order, t.ipix, this, tSize, tSize).draw(ctx, view);
	        }
	
	        // TODO : we could have a pool of HpxKey to prevent object re-creation at each frame
	        // draw tiles
	        for (var k=0; k<cornersXYViewMap.length; k++) {
	            new HpxKey(norder, cornersXYViewMap[k].ipix, this, tSize, tSize).draw(ctx, view);
	        }
	    };
	
	    HpxImageSurvey.prototype.drawAllsky = function(ctx, cornersXYViewMap, norder, view) {
	        // for norder deeper than 6, we think it brings nothing to draw the all-sky
	        if (this.view.curNorder>6) {
	            return;
	        }
	
	        if ( ! this.allskyTexture || !Tile.isImageOk(this.allskyTexture) ) {
	            return;
	        }
	
	        var hpxKeys = [];
	    	var cornersXYView;
	        var ipix;
	        var dx, dy;
	        for (var k=0; k<cornersXYViewMap.length; k++) {
	    		cornersXYView = cornersXYViewMap[k];
	    		ipix = cornersXYView.ipix;
	            dy = this.allskyTextureSize * Math.floor(ipix/27);
	            dx = this.allskyTextureSize * (ipix - 27*Math.floor(ipix/27));
	            hpxKeys.push(new HpxKey(3, cornersXYViewMap[k].ipix, this, this.allskyTextureSize, this.allskyTextureSize, dx, dy, this.allskyTexture, this.allskyTextureSize));
	        }
	
	        for (var k=0; k<hpxKeys.length; k++) {
	            hpxKeys[k].draw(ctx, view);
	        }
	    };
	
	    
	    HpxImageSurvey.prototype.redrawAllsky = function(ctx, cornersXYViewMap, fov, norder) {
	    	// for norder deeper than 6, we think it brings nothing to draw the all-sky
	    	if (this.view.curNorder>6) {
	    		return;
	    	}
	    	
	    	if ( ! this.allskyTexture ) {
	    		return;
	    	}
	    	
	
	    	var cornersXYView;
	        var coeff = 0;
	        var center;
	        var ipix;
	    	for (var k=0, len=cornersXYViewMap.length; k<len; k++) {
	    		cornersXYView = cornersXYViewMap[k];
	    		ipix = cornersXYView.ipix;
	
	
	    		
	            if ( ! this.allskyTexture || !Tile.isImageOk(this.allskyTexture) ) {
	                continue;
	            }
	
	            var dy = this.allskyTextureSize * Math.floor(ipix/27);
	            var dx = this.allskyTextureSize * (ipix - 27*Math.floor(ipix/27));
	
	    		
	    
	    		// TODO : plutot agrandir le clip ?
	    	    // grow cornersXYView
	    	    if (fov>40) {
	    			coeff = 0.02;
	                coeff = 0.0;
	    	        center = {x: (cornersXYView[0].vx+cornersXYView[2].vx)/2, y: (cornersXYView[0].vy+cornersXYView[2].vy)/2};
	    	        for (var i=0; i<4; i++) {
	    	            var diff = {x: cornersXYView[i].vx-center.x, y: cornersXYView[i].vy-center.y};
	    	            cornersXYView[i].vx += coeff*diff.x;
	    	            cornersXYView[i].vy += coeff*diff.y;
	    	        }
	    	    }
	    			
	    	    this.drawOneTile(ctx, this.allskyTexture, cornersXYView, this.allskyTextureSize, null, dx, dy, true);
	    	}
	    };
	    
	    HpxImageSurvey.prototype.getColorMap = function() {
	        return this.cm;
	    };
	    
	    var drawEven = true;
	    // TODO: avoir un mode où on ne cherche pas à dessiner d'abord les tuiles parentes (pour génération vignettes côté serveur)
	    HpxImageSurvey.prototype.redrawHighres = function(ctx, cornersXYViewMap, norder) {
	        
	        // DOES THAT FIX THE PROBLEM ???
	        if (cornersXYViewMap.length==0) {
	            return;
	        }
	        
	        drawEven = ! drawEven;
	        var now = new Date().getTime();
	        var updateNeededTiles = (now-this.lastUpdateDateNeededTiles) > HpxImageSurvey.UPDATE_NEEDED_TILES_DELAY;
	        var tile, url, parentTile, parentUrl;
	        var parentNorder = norder - 1;
	        var cornersXYView, parentCornersXYView;
	        var tilesToDraw = [];
	        var parentTilesToDraw = [];
	        var parentTilesToDrawIpix = {};
	        var missingTiles = false;
	        
	        var tilesToDownload = [];
	        var parentTilesToDownload = [];
	        
	        var parentIpix;
	        var ipix;
	        
	        // tri des tuiles selon la distance
	        if (updateNeededTiles) {
	            var center = [(cornersXYViewMap[0][0].vx+cornersXYViewMap[0][1].vx)/2, (cornersXYViewMap[0][0].vy+cornersXYViewMap[0][1].vy)/2];
	            var newCornersXYViewMap = cornersXYViewMap.sort(function(a, b) {
	                var cA = [(a[0].vx+a[2].vx)/2, (a[0].vy+a[2].vy)/2];
	                var cB = [(b[0].vx+b[2].vx)/2, (b[0].vy+b[2].vy)/2]; 
	
	                var distA = (cA[0]-center[0])*(cA[0]-center[0]) + (cA[1]-center[1])*(cA[1]-center[1]);
	                var distB = (cB[0]-center[0])*(cB[0]-center[0]) + (cB[1]-center[1])*(cB[1]-center[1]);
	                
	                return distA-distB;
	                    
	            });
	            cornersXYViewMap = newCornersXYViewMap;
	        }
	
	        
	    	for (var k=0, len=cornersXYViewMap.length; k<len; k++) {
	    		cornersXYView = cornersXYViewMap[k];
	    		ipix = cornersXYView.ipix;
	            
	            // on demande à charger le parent (cas d'un zoomOut)
	            // TODO : mettre priorité plus basse
	            parentIpix = ~~(ipix/4);
	        	parentUrl = this.getTileURL(parentNorder, parentIpix);
	            if (updateNeededTiles && parentNorder>=3) {
	            	parentTile = this.tileBuffer.addTile(parentUrl);
	                if (parentTile) {
	                    parentTilesToDownload.push({img: parentTile.img, url: parentUrl});
	                }
	            }
	            
	            url = this.getTileURL(norder, ipix);
	            tile = this.tileBuffer.getTile(url);
	            
	            if ( ! tile ) {
	                missingTiles = true;
	                
	                if (updateNeededTiles) {
	                    var tile = this.tileBuffer.addTile(url);
	                    if (tile) {
	                        tilesToDownload.push({img: tile.img, url: url});
	                    }
	                }
	                
	                // is the parent tile available ?
	                if (parentNorder>=3 && ! parentTilesToDrawIpix[parentIpix]) {
	                	parentTile = this.tileBuffer.getTile(parentUrl);
	                	if (parentTile && Tile.isImageOk(parentTile.img)) {
	                		parentCornersXYView = this.view.getPositionsInView(parentIpix, parentNorder);
	                		if (parentCornersXYView) {
	                			parentTilesToDraw.push({img: parentTile.img, corners: parentCornersXYView, ipix: parentIpix});
	                		}
	                	}
	                	parentTilesToDrawIpix[parentIpix] = 1;
	                }
	    
	                continue;
	            }
	            else if ( ! Tile.isImageOk(tile.img)) {
	                missingTiles = true;
	                if (updateNeededTiles && ! tile.img.dlError) {
	                    tilesToDownload.push({img: tile.img, url: url});
	                }
	                
	                // is the parent tile available ?
	                if (parentNorder>=3 && ! parentTilesToDrawIpix[parentIpix]) {
	                	parentTile = this.tileBuffer.getTile(parentUrl);
	                	if (parentTile && Tile.isImageOk(parentTile.img)) {
	                		parentCornersXYView = this.view.getPositionsInView(parentIpix, parentNorder);
	                		if (parentCornersXYView) {
	                			parentTilesToDraw.push({img: parentTile.img, corners: parentCornersXYView, ipix: parentIpix});
	                		}
	                	}
	                	parentTilesToDrawIpix[parentIpix] = 1;
	                }
	                
	                continue;
	            }
	            tilesToDraw.push({img: tile.img, corners: cornersXYView});
	        }
	    	
	    
	    
	        // draw parent tiles
	        for (var k=0, len = parentTilesToDraw.length; k<len; k++) {
	        	this.drawOneTile(ctx, parentTilesToDraw[k].img, parentTilesToDraw[k].corners, parentTilesToDraw[k].img.width);
	        }
	        
	        // draw tiles
	        ///*
	        for (var k=0, len = tilesToDraw.length; k<len; k++) {
	        	var alpha = null;
	        	var img = tilesToDraw[k].img;
	        	if (img.fadingStart) {
	        		if (img.fadingEnd && now<img.fadingEnd) {
	        			alpha = 0.2 + (now - img.fadingStart)/(img.fadingEnd - img.fadingStart)*0.8;
	                    this.requestRedraw();
	        		}
	        	}
	        	this.drawOneTile(ctx, img, tilesToDraw[k].corners, img.width, alpha);
	        }
	        //*/
	    
	
	        // demande de chargement des tuiles manquantes et mise à jour lastUpdateDateNeededTiles
	        if (updateNeededTiles) {
	            // demande de chargement des tuiles
	            for (var k=0, len = tilesToDownload.length; k<len; k++) {
	                this.view.downloader.requestDownload(tilesToDownload[k].img, tilesToDownload[k].url, this.useCors);
	            }
	            //demande de chargement des tuiles parentes
	            for (var k=0, len = parentTilesToDownload.length; k<len; k++) {
	                this.view.downloader.requestDownload(parentTilesToDownload[k].img, parentTilesToDownload[k].url, this.useCors);
	            }
	            this.lastUpdateDateNeededTiles = now;
	        }
	        if (missingTiles) {
	            // callback pour redemander un display dans 1000ms
	            this.view.requestRedrawAtDate(now+HpxImageSurvey.UPDATE_NEEDED_TILES_DELAY+10);
	        }
	    };
	    
	    function dist2(x1,y1,x2,y2) {
	    	return Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2);
	    }
	    
	    HpxImageSurvey.prototype.drawOneTile = function(ctx, img, cornersXYView, textureSize, alpha, dx, dy, applyCorrection) {
	        
	        // apply CM
	        var newImg = this.useCors ? this.cm.apply(img) : img;
	        
	        
	    	// is the tile a diamond ?
	    //	var round = AladinUtils.myRound;
	    //	var b = cornersXYView;
	    //	var flagDiamond =  round(b[0].vx - b[2].vx) == round(b[1].vx - b[3].vx)
	    //    				&& round(b[0].vy - b[2].vy) == round(b[1].vy - b[3].vy); 
	    	
	    	drawTexturedTriangle(ctx, newImg,
	                cornersXYView[0].vx, cornersXYView[0].vy,
	                cornersXYView[1].vx, cornersXYView[1].vy,
	    	        cornersXYView[3].vx, cornersXYView[3].vy,
	    	        textureSize-1, textureSize-1,
	    	        textureSize-1, 0,
	    	        0, textureSize-1,
	    	        alpha,
	                dx, dy, applyCorrection);
	        drawTexturedTriangle(ctx, newImg,
	        		cornersXYView[1].vx, cornersXYView[1].vy,
	        		cornersXYView[3].vx, cornersXYView[3].vy,
	        		cornersXYView[2].vx, cornersXYView[2].vy,
	        		textureSize-1, 0,
	        		0, textureSize-1,
	        		0, 0,
	        		alpha,
	                dx, dy, applyCorrection);
	    };
	    
	       HpxImageSurvey.prototype.drawOneTile2 = function(ctx, img, cornersXYView, textureSize, alpha, dx, dy, applyCorrection, norder) {
	
	        // apply CM
	        var newImg = this.useCors ? this.cm.apply(img) : img;
	
	
	        // is the tile a diamond ?
	    //  var round = AladinUtils.myRound;
	    //  var b = cornersXYView;
	    //  var flagDiamond =  round(b[0].vx - b[2].vx) == round(b[1].vx - b[3].vx)
	    //                  && round(b[0].vy - b[2].vy) == round(b[1].vy - b[3].vy); 
	
	        var delta = norder<=3 ? (textureSize<100 ? 0.5 : 0.2) : 0;
	        drawTexturedTriangle2(ctx, newImg,
	                cornersXYView[0].vx, cornersXYView[0].vy,
	                cornersXYView[1].vx, cornersXYView[1].vy,
	                cornersXYView[3].vx, cornersXYView[3].vy,
	                textureSize-delta, textureSize-delta,
	                textureSize-delta, 0+delta,
	                0+delta, textureSize-delta,
	                alpha,
	                dx, dy, applyCorrection, norder);
	        drawTexturedTriangle2(ctx, newImg,
	                cornersXYView[1].vx, cornersXYView[1].vy,
	                cornersXYView[3].vx, cornersXYView[3].vy,
	                cornersXYView[2].vx, cornersXYView[2].vy,
	                textureSize-delta, 0+delta,
	                0+delta, textureSize-delta,
	                0+delta, 0+delta,
	                alpha,
	                dx, dy, applyCorrection, norder);
	    };
	 
	    function drawTexturedTriangle2(ctx, img, x0, y0, x1, y1, x2, y2,
	                                        u0, v0, u1, v1, u2, v2, alpha,
	                                        dx, dy, applyCorrection, norder) {
	
	        dx = dx || 0;
	        dy = dy || 0;
	
	        if (!applyCorrection) {
	            applyCorrection = false;
	        }
	
	        u0 += dx;
	        u1 += dx;
	        u2 += dx;
	        v0 += dy;
	        v1 += dy;
	        v2 += dy;
	        var xc = (x0 + x1 + x2) / 3;
	        var yc = (y0 + y1 + y2) / 3;
	
	
	        // ---- centroid ----
	        var xc = (x0 + x1 + x2) / 3;
	        var yc = (y0 + y1 + y2) / 3;
	        ctx.save();
	        if (alpha) {
	            ctx.globalAlpha = alpha;
	        }
	
	/*
	        var coeff = 0.01; // default value
	        if (applyCorrection) {
	            coeff = 0.01;
	        }
	        if (norder<3) {
	            coeff = 0.02; // TODO ???? 
	        }
	*/
	coeff = 0.02;
	
	        // ---- scale triangle by (1 + coeff) to remove anti-aliasing and draw ----
	        ctx.beginPath();
	        ctx.moveTo(((1+coeff) * x0 - xc * coeff), ((1+coeff) * y0 - yc * coeff));
	        ctx.lineTo(((1+coeff) * x1 - xc * coeff), ((1+coeff) * y1 - yc * coeff));
	        ctx.lineTo(((1+coeff) * x2 - xc * coeff), ((1+coeff) * y2 - yc * coeff));
	        ctx.closePath();
	        ctx.clip();
	
	        // this is needed to prevent to see some lines between triangles
	        if (applyCorrection) {
	            coeff = 0.01;
	            x0 = ((1+coeff) * x0 - xc * coeff), y0 = ((1+coeff) * y0 - yc * coeff);
	            x1 = ((1+coeff) * x1 - xc * coeff), y1 = ((1+coeff) * y1 - yc * coeff);
	            x2 = ((1+coeff) * x2 - xc * coeff), y2 = ((1+coeff) * y2 - yc * coeff);
	        }
	
	        // ---- transform texture ----
	        var d_inv = 1/ (u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0);
	        ctx.transform(
	            -(v0 * (x2 - x1) -  v1 * x2  + v2 *  x1 + (v1 - v2) * x0) * d_inv, // m11
	             (v1 *  y2 + v0  * (y1 - y2) - v2 *  y1 + (v2 - v1) * y0) * d_inv, // m12
	             (u0 * (x2 - x1) -  u1 * x2  + u2 *  x1 + (u1 - u2) * x0) * d_inv, // m21
	            -(u1 *  y2 + u0  * (y1 - y2) - u2 *  y1 + (u2 - u1) * y0) * d_inv, // m22
	             (u0 * (v2 * x1  -  v1 * x2) + v0 * (u1 *  x2 - u2  * x1) + (u2 * v1 - u1 * v2) * x0) * d_inv, // dx
	             (u0 * (v2 * y1  -  v1 * y2) + v0 * (u1 *  y2 - u2  * y1) + (u2 * v1 - u1 * v2) * y0) * d_inv  // dy
	        );
	        ctx.drawImage(img, 0, 0);
	        //ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height); 
	
	    //    ctx.globalAlpha = 1.0;
	
	        ctx.restore();
	    }
	
	 
	    // uses affine texture mapping to draw a textured triangle
	    // at screen coordinates [x0, y0], [x1, y1], [x2, y2] from
	    // img *pixel* coordinates [u0, v0], [u1, v1], [u2, v2]
	    // code from http://www.dhteumeuleu.com/lab/image3D.html
	    function drawTexturedTriangle(ctx, img, x0, y0, x1, y1, x2, y2,
	                                        u0, v0, u1, v1, u2, v2, alpha,
	                                        dx, dy, applyCorrection) {
	
	        dx = dx || 0;
	        dy = dy || 0;
	
	        if (!applyCorrection) {
	            applyCorrection = false;
	        }
	
	        u0 += dx;
	        u1 += dx;
	        u2 += dx;
	        v0 += dy;
	        v1 += dy;
	        v2 += dy;
	        var xc = (x0 + x1 + x2) / 3;
	        var yc = (y0 + y1 + y2) / 3;
	
	
	        // ---- centroid ----
	        var xc = (x0 + x1 + x2) / 3;
	        var yc = (y0 + y1 + y2) / 3;
	        ctx.save();
	        if (alpha) {
	        	ctx.globalAlpha = alpha;
	        }
	    
	        var coeff = 0.01; // default value
	        if (applyCorrection) {
	            coeff = 0.01;
	        }
	        // ---- scale triangle by (1 + coeff) to remove anti-aliasing and draw ----
	        ctx.beginPath();
	        ctx.moveTo(((1+coeff) * x0 - xc * coeff), ((1+coeff) * y0 - yc * coeff));
	        ctx.lineTo(((1+coeff) * x1 - xc * coeff), ((1+coeff) * y1 - yc * coeff));
	        ctx.lineTo(((1+coeff) * x2 - xc * coeff), ((1+coeff) * y2 - yc * coeff));
	        ctx.closePath();
	        ctx.clip();
	
	
	        // this is needed to prevent to see some lines between triangles
	        if (applyCorrection) {
	            coeff = 0.03;
	            x0 = ((1+coeff) * x0 - xc * coeff), y0 = ((1+coeff) * y0 - yc * coeff);
	            x1 = ((1+coeff) * x1 - xc * coeff), y1 = ((1+coeff) * y1 - yc * coeff);
	            x2 = ((1+coeff) * x2 - xc * coeff), y2 = ((1+coeff) * y2 - yc * coeff);
	        }
	
	        // ---- transform texture ----
	        var d_inv = 1/ (u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0);
	        ctx.transform(
	            -(v0 * (x2 - x1) -  v1 * x2  + v2 *  x1 + (v1 - v2) * x0) * d_inv, // m11
	             (v1 *  y2 + v0  * (y1 - y2) - v2 *  y1 + (v2 - v1) * y0) * d_inv, // m12
	             (u0 * (x2 - x1) -  u1 * x2  + u2 *  x1 + (u1 - u2) * x0) * d_inv, // m21
	            -(u1 *  y2 + u0  * (y1 - y2) - u2 *  y1 + (u2 - u1) * y0) * d_inv, // m22
	             (u0 * (v2 * x1  -  v1 * x2) + v0 * (u1 *  x2 - u2  * x1) + (u2 * v1 - u1 * v2) * x0) * d_inv, // dx
	             (u0 * (v2 * y1  -  v1 * y2) + v0 * (u1 *  y2 - u2  * y1) + (u2 * v1 - u1 * v2) * y0) * d_inv  // dy
	        );
	        ctx.drawImage(img, 0, 0);
	        //ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height); 
	        
	    //    ctx.globalAlpha = 1.0;
	    
	        ctx.restore();
	    }
	    
	    /*
	    function drawTexturedTriangle4Points(ctx, img, x0, y0, x1, y1, x2, y2,
	            u0, v0, u1, v1, u2, v2) {
	    
	    	var x3 = x1+x2-x0;
	    	var y3 = y1+y2-y0;
	    // ---- centroid ----
	    var xc = (x0 + x1 + x2 + x3) / 4;
	    var yc = (y0 + y1 + y2 + y3) / 4;
	    ctx.save();
	    ctx.beginPath();
	    // ---- scale triagle by 1.05 to remove anti-aliasing and draw ----
	    ctx.moveTo((1.05 * x0 - xc * 0.05), (1.05 * y0 - yc * 0.05));
	    ctx.lineTo((1.05 * x1 - xc * 0.05), (1.05 * y1 - yc * 0.05));
	    ctx.lineTo((1.05 * x3 - xc * 0.05), (1.05 * y3 - yc * 0.05));
	    ctx.lineTo((1.05 * x2 - xc * 0.05), (1.05 * y2 - yc * 0.05));
	    ctx.closePath();
	    ctx.clip();
	    // ---- transform texture ----
	    var d_inv = 1/ (u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0);
	    ctx.transform(
	    -(v0 * (x2 - x1) -  v1 * x2  + v2 *  x1 + (v1 - v2) * x0) * d_inv, // m11
	    (v1 *  y2 + v0  * (y1 - y2) - v2 *  y1 + (v2 - v1) * y0) * d_inv, // m12
	    (u0 * (x2 - x1) -  u1 * x2  + u2 *  x1 + (u1 - u2) * x0) * d_inv, // m21
	    -(u1 *  y2 + u0  * (y1 - y2) - u2 *  y1 + (u2 - u1) * y0) * d_inv, // m22
	    (u0 * (v2 * x1  -  v1 * x2) + v0 * (u1 *  x2 - u2  * x1) + (u2 * v1 - u1 * v2) * x0) * d_inv, // dx
	    (u0 * (v2 * y1  -  v1 * y2) + v0 * (u1 *  y2 - u2  * y1) + (u2 * v1 - u1 * v2) * y0) * d_inv  // dy
	    );
	    //ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height); // faster ??
	    ctx.drawImage(img, 0, 0); // slower ??
	    
	    ctx.restore();
	    }
	    */
	    
	    
	    // @api
	    HpxImageSurvey.prototype.setAlpha = function(alpha) {
	        alpha = +alpha; // coerce to number
	        this.alpha = Math.max(0, Math.min(alpha, 1));
	        this.view.requestRedraw();
	    };
	    
	    // @api
	    HpxImageSurvey.prototype.getAlpha = function() {
	        return this.alpha;
	    }
	
	    return HpxImageSurvey;
	})();
	// Copyright 2015 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File HealpixGrid
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	HealpixGrid = (function() {
		var HealpixGrid = function() {
		};
		
		HealpixGrid.prototype.redraw = function(ctx, cornersXYViewMap, fov, norder) {
			// on dessine les lignes
			ctx.lineWidth = 1;
			ctx.strokeStyle = "rgb(150,150,220)";
			ctx.beginPath();
			var cornersXYView;
			for (var k=0, len=cornersXYViewMap.length; k<len; k++) {
				cornersXYView = cornersXYViewMap[k];
				ipix = cornersXYView.ipix;
				
				// draw pixel
				ctx.moveTo(cornersXYView[0].vx, cornersXYView[0].vy);
				ctx.lineTo(cornersXYView[1].vx, cornersXYView[1].vy);
				ctx.lineTo(cornersXYView[2].vx, cornersXYView[2].vy);
				//ctx.lineTo(cornersXYView[3].vx, cornersXYView[3].vy);
				
	
	            //ctx.strokeText(ipix, (cornersXYView[0].vx + cornersXYView[2].vx)/2, (cornersXYView[0].vy + cornersXYView[2].vy)/2);
			}
			ctx.stroke();
			
			// on dessine les numéros de pixel HEALpix
	        ctx.strokeStyle="#FFDDDD";
			ctx.beginPath();
			for (var k=0, len=cornersXYViewMap.length; k<len; k++) {
				cornersXYView = cornersXYViewMap[k];
				ipix = cornersXYView.ipix;
	
	            ctx.strokeText(norder + '/' + ipix, (cornersXYView[0].vx + cornersXYView[2].vx)/2, (cornersXYView[0].vy + cornersXYView[2].vy)/2);
			}
			ctx.stroke();
		};
	
		
		
		return HealpixGrid;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Location.js
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Location = (function() {
	    // constructor
	    Location = function(locationDiv) {
	    		this.$div = $(locationDiv);
	    	};
		
		Location.prototype.update = function(lon, lat, cooFrame, isViewCenterPosition) {
	        isViewCenterPosition = (isViewCenterPosition && isViewCenterPosition===true) || false;
			var coo = new Coo(lon, lat, 7);
			if (cooFrame==CooFrameEnum.J2000) {
	            this.$div.html(coo.format('s/'));
	        }
			else if (cooFrame==CooFrameEnum.J2000d) {
	            this.$div.html(coo.format('d/'));
	        }
	        else {
	            this.$div.html(coo.format('d/'));
	        }
	
	        this.$div.toggleClass('aladin-reticleColor', isViewCenterPosition);
		};
		
		return Location;
	})();
		
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File View.js
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	View = (function() {
	
	    /** Constructor */
	    function View (aladin, location, fovDiv, cooFrame, zoom) {
	            this.aladin = aladin;
	            this.options = aladin.options;
	            this.aladinDiv = this.aladin.aladinDiv;
	            this.popup = new Popup(this.aladinDiv, this);
	
	            this.createCanvases();
	            this.location = location;
	            this.fovDiv = fovDiv;
	            this.mustClearCatalog = true;
	            this.mustRedrawReticle = true;
	            
	            this.mode = View.PAN;
	            
	            this.minFOV = this.maxFOV = null; // by default, no restriction
	            
	            this.healpixGrid = new HealpixGrid(this.imageCanvas);
	            if (cooFrame) {
	                this.cooFrame = cooFrame;
	            }
	            else {
	                this.cooFrame = CooFrameEnum.GAL;
	            }
	            
	            var lon, lat;
	            lon = lat = 0;
	            
	            this.projectionMethod = ProjectionEnum.SIN;
	            this.projection = new Projection(lon, lat);
	            this.projection.setProjection(this.projectionMethod);
	            this.zoomLevel = 0;
	            this.zoomFactor = this.computeZoomFactor(this.zoomLevel);
	    
	            this.viewCenter = {lon: lon, lat: lat}; // position of center of view
	            
	            if (zoom) {
	                this.setZoom(zoom);
	            }
	            
	            // current reference image survey displayed
	            this.imageSurvey = null;
	            // current catalogs displayed
	            this.catalogs = [];
	            // a dedicated catalog for the popup
	            var c = document.createElement('canvas');
	            c.width = c.height = 24;
	            var ctx= c.getContext('2d');
	            ctx.lineWidth = 6.0;
	            ctx.beginPath();
	            ctx.strokeStyle = '#eee';
	            ctx.arc(12, 12, 8, 0, 2*Math.PI, true);
	            ctx.stroke();
	            ctx.lineWidth = 3.0;
	            ctx.beginPath();
	            ctx.strokeStyle = '#c38';
	            ctx.arc(12, 12, 8, 0, 2*Math.PI, true);
	            ctx.stroke();
	            this.catalogForPopup = A.catalog({shape: c, sourceSize: 24});
	            //this.catalogForPopup = A.catalog({sourceSize: 18, shape: 'circle', color: '#c38'});
	            this.catalogForPopup.hide();
	            this.catalogForPopup.setView(this);
	            // overlays (footprints for instance)
	            this.overlays = [];
	            // MOCs
	            this.mocs = [];
	            // reference to all overlay layers (= catalogs + overlays + mocs)
	            this.allOverlayLayers = []
	            
	    
	            
	            this.tileBuffer = new TileBuffer(); // tile buffer is shared across different image surveys
	            this.fixLayoutDimensions();
	            
	    
	            this.curNorder = 1;
	            this.realNorder = 1;
	            this.curOverlayNorder = 1;
	            
	            // some variables for mouse handling
	            this.dragging = false;
	            this.dragx = null;
	            this.dragy = null;
	            this.needRedraw = true;
	
	            // zoom pinching
	            this.pinchZoomParameters = {
	                isPinching: false, // true if a pinch zoom is ongoing
	                initialFov: undefined,
	                initialDistance: undefined
	            };
	    
	            this.downloader = new Downloader(this); // the downloader object is shared across all HpxImageSurveys
	            this.flagForceRedraw = false;
	    
	            this.fadingLatestUpdate = null;
	            
	            this.dateRequestRedraw = null;
	            
	            this.showGrid = false; // coordinates grid
	            
	            init(this);
	            
	
	            // listen to window resize and reshape canvases
	            this.resizeTimer = null;
	            var self = this;
	            $(window).resize(function() {
	                clearTimeout(self.resizeTimer);
	                self.resizeTimer = setTimeout(function() {self.fixLayoutDimensions(self)}, 100);
	            });
	
	
	            // in some contexts (Jupyter notebook for instance), the parent div changes little time after Aladin Lite creation
	            // this results in canvas dimension to be incorrect.
	            // The following line tries to fix this issue
	            setTimeout(function() {
	                var computedWidth = $(self.aladinDiv).width();
	                var computedHeight = $(self.aladinDiv).height();
	
	                if (self.width!==computedWidth || self.height===computedHeight) {
	                    self.fixLayoutDimensions();
	                    self.setZoomLevel(self.zoomLevel); // needed to force recomputation of displayed FoV
	                }
	           }, 1000);
	        };
	    
	    // different available modes
	    View.PAN = 0;
	    View.SELECT = 1;
	    View.TOOL_SIMBAD_POINTER = 2;
	        
	    
	    // TODO: should be put as an option at layer level    
	    View.DRAW_SOURCES_WHILE_DRAGGING = true;
	    View.DRAW_MOCS_WHILE_DRAGGING = true;
	
	    View.CALLBACKS_THROTTLE_TIME_MS = 100; // minimum time between two consecutive callback calls
	    
	    
	    // (re)create needed canvases
	    View.prototype.createCanvases = function() {
	        var a = $(this.aladinDiv);
	        a.find('.aladin-imageCanvas').remove();
	        a.find('.aladin-catalogCanvas').remove();
	        a.find('.aladin-reticleCanvas').remove();
	        
	        // canvas to draw the images
	        this.imageCanvas = $("<canvas class='aladin-imageCanvas'></canvas>").appendTo(this.aladinDiv)[0];
	        // canvas to draw the catalogs
	        this.catalogCanvas = $("<canvas class='aladin-catalogCanvas'></canvas>").appendTo(this.aladinDiv)[0];
	        // canvas to draw the reticle
	        this.reticleCanvas = $("<canvas class='aladin-reticleCanvas'></canvas>").appendTo(this.aladinDiv)[0];
	    };
	    
	    
	    // called at startup and when window is resized
	    View.prototype.fixLayoutDimensions = function() {
	        Utils.cssScale = undefined;
	        
	        var computedWidth = $(this.aladinDiv).width();
	        var computedHeight = $(this.aladinDiv).height();
	
	        this.width = Math.max(computedWidth, 1);
	        this.height = Math.max(computedHeight, 1); // this prevents many problems when div size is equal to 0
	        
	        
	        this.cx = this.width/2;
	        this.cy = this.height/2;
	        
	        this.largestDim = Math.max(this.width, this.height);
	        this.smallestDim = Math.min(this.width, this.height);
	        this.ratio = this.largestDim/this.smallestDim;
	
	        
	        this.mouseMoveIncrement = 160/this.largestDim;
	
	        // reinitialize 2D context
	        this.imageCtx = this.imageCanvas.getContext("2d");
	        this.catalogCtx = this.catalogCanvas.getContext("2d");
	        this.reticleCtx = this.reticleCanvas.getContext("2d");
	        
	        this.imageCtx.canvas.width = this.width;
	        this.catalogCtx.canvas.width = this.width;
	        this.reticleCtx.canvas.width = this.width;
	
	        
	        this.imageCtx.canvas.height = this.height;
	        this.catalogCtx.canvas.height = this.height;
	        this.reticleCtx.canvas.height = this.height;
	
	        pixelateCanvasContext(this.imageCtx);
	
	        // change logo
	        if (!this.logoDiv) {
	            this.logoDiv = $(this.aladinDiv).find('.aladin-logo')[0];
	        }
	        if (this.width>800) {
	            $(this.logoDiv).removeClass('aladin-logo-small');
	            $(this.logoDiv).addClass('aladin-logo-large');
	            $(this.logoDiv).css('width', '90px');
	        }
	        else {
	            $(this.logoDiv).addClass('aladin-logo-small');
	            $(this.logoDiv).removeClass('aladin-logo-large');
	            $(this.logoDiv).css('width', '32px');
	        }
	
	        
	        this.computeNorder();
	        this.requestRedraw();
	    };
	
	    var pixelateCanvasContext = function(ctx) {
	        ctx.imageSmoothingEnabled = false;
	        ctx.webkitImageSmoothingEnabled = false;
	        ctx.mozImageSmoothingEnabled = false;
	        ctx.msImageSmoothingEnabled = false;
	        ctx.oImageSmoothingEnabled = false;
	    }
	    
	
	    View.prototype.setMode = function(mode) {
	        this.mode = mode;
	        if (this.mode==View.SELECT) {
	            this.setCursor('crosshair');
	        }
	        else if (this.mode==View.TOOL_SIMBAD_POINTER) {
	            this.popup.hide();
	            this.reticleCanvas.style.cursor = '';
	            $(this.reticleCanvas).addClass('aladin-sp-cursor');
	        }
	        else {
	            this.setCursor('default');
	        }
	    };
	    
	    View.prototype.setCursor = function(cursor) {
	        if (this.reticleCanvas.style.cursor==cursor) {
	            return;
	        }
	        if (this.mode==View.TOOL_SIMBAD_POINTER) {
	            return;
	        }
	        this.reticleCanvas.style.cursor = cursor;
	    };
	
	    
	    
	    /**
	     * return dataURL string corresponding to the current view
	     */
	    View.prototype.getCanvasDataURL = function(imgType, width, height) {
	        imgType = imgType || "image/png"; 
	        var c = document.createElement('canvas');
	        width = width || this.width;
	        height = height || this.height;
	        c.width = width;
	        c.height = height;
	        var ctx = c.getContext('2d');
	        ctx.drawImage(this.imageCanvas, 0, 0, c.width, c.height);
	        ctx.drawImage(this.catalogCanvas, 0, 0, c.width, c.height);
	        ctx.drawImage(this.reticleCanvas, 0, 0, c.width, c.height);
	        
	        return c.toDataURL(imgType);
	        //return c.toDataURL("image/jpeg", 0.01); // setting quality only works for JPEG (?)
	    };
	
	
	    /**
	     * Compute the FoV in degrees of the view and update mouseMoveIncrement
	     * 
	     * @param view
	     * @returns FoV (array of 2 elements : width and height) in degrees
	     */
	    computeFov = function(view) {
	        var fov = doComputeFov(view, view.zoomFactor);
	        
	        
	        view.mouseMoveIncrement = fov/view.imageCanvas.width;
	            
	        return fov;
	    };
	    
	    doComputeFov = function(view, zoomFactor) {
	        // if zoom factor < 1, we view 180°
	        var fov;
	        if (view.zoomFactor<1) {
	            fov = 180;
	        }
	        else {
	            // TODO : fov sur les 2 dimensions !!
	            // to compute FoV, we first retrieve 2 points at coordinates (0, view.cy) and (width-1, view.cy)
	            var xy1 = AladinUtils.viewToXy(0, view.cy, view.width, view.height, view.largestDim, zoomFactor);
	            var lonlat1 = view.projection.unproject(xy1.x, xy1.y);
	            
	            var xy2 = AladinUtils.viewToXy(view.imageCanvas.width-1, view.cy, view.width, view.height, view.largestDim, zoomFactor);
	            var lonlat2 = view.projection.unproject(xy2.x, xy2.y);
	            
	            
	            fov = new Coo(lonlat1.ra, lonlat1.dec).distance(new Coo(lonlat2.ra, lonlat2.dec));
	        }
	        
	        return fov;
	    };
	    
	    updateFovDiv = function(view) {
	        if (isNaN(view.fov)) {
	            view.fovDiv.html("FoV:");
	            return;
	        }
	        // update FoV value
	        var fovStr;
	        if (view.fov>1) {
	            fovStr = Math.round(view.fov*100)/100 + "°";
	        }
	        else if (view.fov*60>1) {
	            fovStr = Math.round(view.fov*60*100)/100 + "'";
	        }
	        else {
	            fovStr = Math.round(view.fov*3600*100)/100 + '"';
	        }
	        view.fovDiv.html("FoV: " + fovStr);
	    };
	    
	    
	    createListeners = function(view) {
	        var hasTouchEvents = false;
	        if ('ontouchstart' in window) {
	            hasTouchEvents = true;
	        }
	        
	        // various listeners
	        onDblClick = function(e) {
	            var xymouse = view.imageCanvas.relMouseCoords(e);
	            var xy = AladinUtils.viewToXy(xymouse.x, xymouse.y, view.width, view.height, view.largestDim, view.zoomFactor);
	            try {
	                var lonlat = view.projection.unproject(xy.x, xy.y);
	            }
	            catch(err) {
	                return;
	            }
	            radec = [];
	            // convert to J2000 if needed
	            if (view.cooFrame.system==CooFrameEnum.SYSTEMS.GAL) {
	                radec = CooConversion.GalacticToJ2000([lonlat.ra, lonlat.dec]);
	            }
	            else {
	                radec = [lonlat.ra, lonlat.dec];
	            }
	
	            view.pointTo(radec[0], radec[1]);
	        };
	        if (! hasTouchEvents) {
	            $(view.reticleCanvas).dblclick(onDblClick);
	        }
	        
	        
	        $(view.reticleCanvas).bind("mousedown touchstart", function(e) {
	            // zoom pinching
	            if (e.type==='touchstart' && e.originalEvent && e.originalEvent.targetTouches && e.originalEvent.targetTouches.length==2) {
	                view.dragging = false;
	
	                view.pinchZoomParameters.isPinching = true;
	                var fov = view.aladin.getFov();
	                view.pinchZoomParameters.initialFov = Math.max(fov[0], fov[1]);
	                view.pinchZoomParameters.initialDistance = Math.sqrt(Math.pow(e.originalEvent.targetTouches[0].clientX - e.originalEvent.targetTouches[1].clientX, 2) + Math.pow(e.originalEvent.targetTouches[0].clientY - e.originalEvent.targetTouches[1].clientY, 2));
	
	                return;
	            }
	
	            var xymouse = view.imageCanvas.relMouseCoords(e);
	            if (e.originalEvent && e.originalEvent.targetTouches) {
	                view.dragx = e.originalEvent.targetTouches[0].clientX;
	                view.dragy = e.originalEvent.targetTouches[0].clientY;
	            }
	            else {
	                /*
	                view.dragx = e.clientX;
	                view.dragy = e.clientY;
	                */
	                view.dragx = xymouse.x;
	                view.dragy = xymouse.y;
	            }
	
	
	            view.dragging = true;
	            if (view.mode==View.PAN) {
	                view.setCursor('move');
	            }
	            else if (view.mode==View.SELECT) {
	                view.selectStartCoo = {x: view.dragx, y: view.dragy};
	            }
	            return false; // to disable text selection
	        });
	
	        //$(view.reticleCanvas).bind("mouseup mouseout touchend", function(e) {
	        $(view.reticleCanvas).bind("click mouseout touchend", function(e) { // reacting on 'click' rather on 'mouseup' is more reliable when panning the view
	            if (e.type==='touchend' && view.pinchZoomParameters.isPinching) {
	                view.pinchZoomParameters.isPinching = false;
	                view.pinchZoomParameters.initialFov = view.pinchZoomParameters.initialDistance = undefined;
	    
	                return;
	            }
	
	
	            var wasDragging = view.realDragging === true;
	            var selectionHasEnded = view.mode===View.SELECT && view.dragging;
	
	            if (view.dragging) { // if we were dragging, reset to default cursor
	                view.setCursor('default');
	                view.dragging = false;
	
	                if (wasDragging) {
	                    view.realDragging = false;
	                
	                    // call positionChanged one last time after dragging, with dragging: false
	                    var posChangedFn = view.aladin.callbacksByEventName['positionChanged'];
	                    if (typeof posChangedFn === 'function') {
	                        var pos = view.aladin.pix2world(view.width/2, view.height/2);
	                        if (pos !== undefined) {
	                            posChangedFn({ra: pos[0], dec: pos[1], dragging: false});
	                        }
	                    }
	                }
	            } // end of "if (view.dragging) ... "
	
	            if (selectionHasEnded) {
	                view.aladin.fire('selectend', 
	                                 view.getObjectsInBBox(view.selectStartCoo.x, view.selectStartCoo.y,
	                                                       view.dragx-view.selectStartCoo.x, view.dragy-view.selectStartCoo.y));    
	
	                view.mustRedrawReticle = true; // pour effacer selection bounding box
	                view.requestRedraw();
	
	                return;
	            }
	
	
	
	            view.mustClearCatalog = true;
	            view.mustRedrawReticle = true; // pour effacer selection bounding box
	            view.dragx = view.dragy = null;
	
	
	
	            if (e.type==="mouseout" || e.type==="touchend") {
	                view.requestRedraw(true);
	                updateLocation(view, view.width/2, view.height/2, true);
	
	
	                if (e.type==="mouseout") {
	                    if (view.mode===View.TOOL_SIMBAD_POINTER) {
	                        view.setMode(View.PAN);
	                    }
	
	                    return;
	                }
	            }
	
	            var xymouse = view.imageCanvas.relMouseCoords(e);
	
	            if (view.mode==View.TOOL_SIMBAD_POINTER) {
	                var radec = view.aladin.pix2world(xymouse.x, xymouse.y);
	
	                view.setMode(View.PAN);
	                view.setCursor('wait');
	
	                SimbadPointer.query(radec[0], radec[1], Math.min(1, 15 * view.fov / view.largestDim), view.aladin);
	
	                return; // when in TOOL_SIMBAD_POINTER mode, we do not call the listeners
	            }
	
	            // popup to show ?
	            var objs = view.closestObjects(xymouse.x, xymouse.y, 5);
	            if (! wasDragging && objs) {
	                var o = objs[0];
	
	                // footprint selection code adapted from Fabrizzio Giordano dev. from Serco for ESA/ESDC
	                if (o instanceof Footprint || o instanceof Circle) {
	                    o.dispatchClickEvent();
	                }
	
	                // display marker
	                else if (o.marker) {
	                    // could be factorized in Source.actionClicked
	                    view.popup.setTitle(o.popupTitle);
	                    view.popup.setText(o.popupDesc);
	                    view.popup.setSource(o);
	                    view.popup.show();
	                }
	                // show measurements
	                else {
	                    if (view.lastClickedObject) {
	                        view.lastClickedObject.actionOtherObjectClicked && view.lastClickedObject.actionOtherObjectClicked();
	                    }
	                    o.actionClicked();
	                }
	                view.lastClickedObject = o;
	                var objClickedFunction = view.aladin.callbacksByEventName['objectClicked'];
	                (typeof objClickedFunction === 'function') && objClickedFunction(o);
	            }
	            else {
	                if (view.lastClickedObject && ! wasDragging) {
	                    view.aladin.measurementTable.hide();
	                    view.popup.hide();
	
	                    if (view.lastClickedObject instanceof Footprint) {
	                        //view.lastClickedObject.deselect();
	                    }
	                    else {
	                        view.lastClickedObject.actionOtherObjectClicked();
	                    }
	
	                    view.lastClickedObject = null;
	                    var objClickedFunction = view.aladin.callbacksByEventName['objectClicked'];
	                    (typeof objClickedFunction === 'function') && objClickedFunction(null);
	                }
	            }
	
	            // call listener of 'click' event
	            var onClickFunction = view.aladin.callbacksByEventName['click'];
	            if (typeof onClickFunction === 'function') {
	                var pos = view.aladin.pix2world(xymouse.x, xymouse.y);
	                if (pos !== undefined) {
	                    onClickFunction({ra: pos[0], dec: pos[1], x: xymouse.x, y: xymouse.y, isDragging: wasDragging});
	                }
	            }
	
	
	            // TODO : remplacer par mecanisme de listeners
	            // on avertit les catalogues progressifs
	            view.refreshProgressiveCats();
	
	            view.requestRedraw(true);
	        });
	        var lastHoveredObject; // save last object hovered by mouse
	        $(view.reticleCanvas).bind("mousemove touchmove", function(e) {
	            e.preventDefault();
	
	            if (e.type==='touchmove' && view.pinchZoomParameters.isPinching && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length==2) {
	                var dist = Math.sqrt(Math.pow(e.originalEvent.touches[0].clientX - e.originalEvent.touches[1].clientX, 2) + Math.pow(e.originalEvent.touches[0].clientY - e.originalEvent.touches[1].clientY, 2));
	                view.setZoom(view.pinchZoomParameters.initialFov * view.pinchZoomParameters.initialDistance / dist);
	
	                return;
	            }
	
	            var xymouse = view.imageCanvas.relMouseCoords(e);
	            if (!view.dragging || hasTouchEvents) {
	                // update location box
	                updateLocation(view, xymouse.x, xymouse.y);
	                // call listener of 'mouseMove' event
	                var onMouseMoveFunction = view.aladin.callbacksByEventName['mouseMove'];
	                if (typeof onMouseMoveFunction === 'function') {
	                    var pos = view.aladin.pix2world(xymouse.x, xymouse.y);
	                    if (pos !== undefined) {
	                        onMouseMoveFunction({ra: pos[0], dec: pos[1], x: xymouse.x, y: xymouse.y});
	                    }
	                }
	
	
	                if (!view.dragging && ! view.mode==View.SELECT) {
	                    // objects under the mouse ?
	                    var closest = view.closestObjects(xymouse.x, xymouse.y, 5);
	                    if (closest) {
	                        view.setCursor('pointer');
	                        var objHoveredFunction = view.aladin.callbacksByEventName['objectHovered'];
	                        if (typeof objHoveredFunction === 'function' && closest[0]!=lastHoveredObject) {
	                            var ret = objHoveredFunction(closest[0]);
	                        }
	                        lastHoveredObject = closest[0];
	        
	                    }
	                    else {
	                        view.setCursor('default');
	                        var objHoveredFunction = view.aladin.callbacksByEventName['objectHovered'];
	                        if (typeof objHoveredFunction === 'function' && lastHoveredObject) {
	                            lastHoveredObject = null;
	                            // call callback function to notify we left the hovered object
	                            var ret = objHoveredFunction(null);
	                        }
	                    }
	                }
	                if (!hasTouchEvents) {
	                    return;
	                }
	            }
	
	            if (! view.dragging) {
	                return;
	            }
	
	            var xoffset, yoffset;
	            var pos1, pos2;
	            
	            if (e.originalEvent && e.originalEvent.targetTouches) {
	                // ???
	                xoffset = e.originalEvent.targetTouches[0].clientX-view.dragx;
	                yoffset = e.originalEvent.targetTouches[0].clientY-view.dragy;
	                var xy1 = AladinUtils.viewToXy(e.originalEvent.targetTouches[0].clientX, e.originalEvent.targetTouches[0].clientY, view.width, view.height, view.largestDim, view.zoomFactor);
	                var xy2 = AladinUtils.viewToXy(view.dragx, view.dragy, view.width, view.height, view.largestDim, view.zoomFactor);
	
	                pos1 = view.projection.unproject(xy1.x, xy1.y);
	                pos2 = view.projection.unproject(xy2.x, xy2.y);
	            }
	            else {
	                /*
	                xoffset = e.clientX-view.dragx;
	                yoffset = e.clientY-view.dragy;
	                */
	                xoffset = xymouse.x-view.dragx;
	                yoffset = xymouse.y-view.dragy;
	                
	                var xy1 = AladinUtils.viewToXy(xymouse.x, xymouse.y, view.width, view.height, view.largestDim, view.zoomFactor);
	                var xy2 = AladinUtils.viewToXy(view.dragx, view.dragy, view.width, view.height, view.largestDim, view.zoomFactor);
	
	                
	                pos1 = view.projection.unproject(xy1.x, xy1.y);
	                pos2 = view.projection.unproject(xy2.x, xy2.y);
	                
	            }
	            
	            // TODO : faut il faire ce test ??
	//            var distSquared = xoffset*xoffset+yoffset*yoffset;
	//            if (distSquared<3) {
	//                return;
	//            }
	            if (e.originalEvent && e.originalEvent.targetTouches) {
	                view.dragx = e.originalEvent.targetTouches[0].clientX;
	                view.dragy = e.originalEvent.targetTouches[0].clientY;
	            }
	            else {
	                view.dragx = xymouse.x;
	                view.dragy = xymouse.y;
	                /*
	                view.dragx = e.clientX;
	                view.dragy = e.clientY;
	                */
	            }
	            
	            if (view.mode==View.SELECT) {
	                  view.requestRedraw();
	                  return;
	            }
	
	            //view.viewCenter.lon += xoffset*view.mouseMoveIncrement/Math.cos(view.viewCenter.lat*Math.PI/180.0);
	            /*
	            view.viewCenter.lon += xoffset*view.mouseMoveIncrement;
	            view.viewCenter.lat += yoffset*view.mouseMoveIncrement;
	            */
	            view.viewCenter.lon += pos2.ra -  pos1.ra;
	            view.viewCenter.lat += pos2.dec - pos1.dec;
	            
	
	            
	            // can not go beyond poles
	            if (view.viewCenter.lat>90) {
	                view.viewCenter.lat = 90;
	            }
	            else if (view.viewCenter.lat < -90) {
	                view.viewCenter.lat = -90;
	            }
	            
	            // limit lon to [0, 360]
	            if (view.viewCenter.lon < 0) {
	                view.viewCenter.lon = 360 + view.viewCenter.lon;
	            }
	            else if (view.viewCenter.lon > 360) {
	                view.viewCenter.lon = view.viewCenter.lon % 360;
	            }
	            view.realDragging = true;
	            view.requestRedraw();
	        }); //// endof mousemove ////
	        
	        // disable text selection on IE
	        $(view.aladinDiv).onselectstart = function () { return false; }
	
	        $(view.reticleCanvas).on('mousewheel', function(event) {
	            event.preventDefault();
	            event.stopPropagation();
	            var level = view.zoomLevel;
	
	             var delta = event.deltaY;
	            // this seems to happen in context of Jupyter notebook --> we have to invert the direction of scroll
	            // hope this won't trigger some side effects ...
	            if (event.hasOwnProperty('originalEvent')) {
	                delta = -event.originalEvent.deltaY;
	            } 
	            if (delta>0) {
	                level += 1;
	            }
	            else {
	                level -= 1;
	            }
	            view.setZoomLevel(level);
	            
	            return false;
	        });
	
	    };
	    
	    var init = function(view) {
	        var stats = new Stats();
	        stats.domElement.style.top = '50px';
	        if ($('#aladin-statsDiv').length>0) {
	            $('#aladin-statsDiv')[0].appendChild( stats.domElement );
	        }
	        
	        view.stats = stats;
	
	        createListeners(view);
	
	        view.executeCallbacksThrottled = Utils.throttle(
	            function() {
	                var pos = view.aladin.pix2world(view.width/2, view.height/2);
	                var fov = view.fov;
	                if (pos===undefined || fov===undefined) {
	                    return;
	                }
	
	                var ra = pos[0];
	                var dec = pos[1];
	                // trigger callback only if position has changed !
	                if (ra!==this.ra || dec!==this.dec) {
	                    var posChangedFn = view.aladin.callbacksByEventName['positionChanged'];
	                    (typeof posChangedFn === 'function') && posChangedFn({ra: ra, dec: dec, dragging: true});
	    
	                    // finally, save ra and dec value
	                    this.ra = ra;
	                    this.dec = dec;
	                }
	
	                // trigger callback only if FoV (zoom) has changed !
	                if (fov!==this.old_fov) {
	                    var fovChangedFn = view.aladin.callbacksByEventName['zoomChanged'];
	                    (typeof fovChangedFn === 'function') && fovChangedFn(fov);
	    
	                    // finally, save fov value
	                    this.old_fov = fov;
	                }
	
	            },
	            View.CALLBACKS_THROTTLE_TIME_MS);
	
	
	        view.displayHpxGrid = false;
	        view.displaySurvey = true;
	        view.displayCatalog = false;
	        view.displayReticle = true;
	        
	        // initial draw
	        view.fov = computeFov(view);
	        updateFovDiv(view);
	        
	        view.redraw();
	    };
	
	    function updateLocation(view, x, y, isViewCenterPosition) {
	        if (!view.projection) {
	            return;
	        }
	        var xy = AladinUtils.viewToXy(x, y, view.width, view.height, view.largestDim, view.zoomFactor);
	        var lonlat;
	        try {
	            lonlat = view.projection.unproject(xy.x, xy.y);
	        }
	        catch(err) {
	        }
	        if (lonlat) {
	            view.location.update(lonlat.ra, lonlat.dec, view.cooFrame, isViewCenterPosition);
	        }
	    }
	    
	    View.prototype.requestRedrawAtDate = function(date) {
	        this.dateRequestDraw = date;
	    };
	
	    /**
	     * Return the color of the lowest intensity pixel 
	     * in teh current color map of the current background image HiPS
	     */
	    View.prototype.getBackgroundColor = function() {
	        var white = 'rgb(255, 255, 255)';
	        var black = 'rgb(0, 0, 0)';
	
	        if (! this.imageSurvey) {
	            return black;
	        }
	
	        var cm = this.imageSurvey.getColorMap();
	        if (!cm) {
	            return black;
	        }
	        if (cm.mapName == 'native' || cm.mapName == 'grayscale') {
	            return cm.reversed ? white : black;
	        }
	
	        var idx = cm.reversed ? 255 : 0;
	        var r = ColorMap.MAPS[cm.mapName].r[idx];
	        var g = ColorMap.MAPS[cm.mapName].g[idx];
	        var b = ColorMap.MAPS[cm.mapName].b[idx];
	
	        return 'rgb(' + r + ',' + g + ',' + b + ')';
	    };
	
	    View.prototype.getViewParams = function() {
	        var resolution = this.width > this.height ? this.fov / this.width : this.fov / this.height;
	        return {
	            fov: [this.width * resolution, this.height * resolution],   
	            width: this.width,   
	            height: this.height   
	        };
	    };
	    
	    
	
	    /**
	     * redraw the whole view
	     */
	    View.prototype.redraw = function() {
	        var saveNeedRedraw = this.needRedraw;
	        requestAnimFrame(this.redraw.bind(this));
	
	        var now = new Date().getTime();
	        
	        if (this.dateRequestDraw && now>this.dateRequestDraw) {
	            this.dateRequestDraw = null;
	        } 
	        else if (! this.needRedraw) {
	            if ( ! this.flagForceRedraw) {
	                return;
	            }
	            else {
	                this.flagForceRedraw = false;
	            }
	        }
	        this.stats.update();
	
	
	        var imageCtx = this.imageCtx;
	        //////// 1. Draw images ////////
	        if (imageCtx.start2D) {
	            imageCtx.start2D();
	        }
	        //// clear canvas ////
	        // TODO : do not need to clear if fov small enough ?
	        imageCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
	        ////////////////////////
	    
	        var bkgdColor = this.getBackgroundColor();    
	        // fill with background of the same color than the first color map value (lowest intensity)
	        if (this.projectionMethod==ProjectionEnum.SIN) {
	            if (this.fov>=60) {
	                imageCtx.fillStyle = bkgdColor;
	                imageCtx.beginPath();
	                var maxCxCy = this.cx>this.cy ? this.cx : this.cy;
	                imageCtx.arc(this.cx, this.cy, maxCxCy * this.zoomFactor, 0, 2*Math.PI, true);
	                imageCtx.fill();
	            }
	            // pour eviter les losanges blancs qui apparaissent quand les tuiles sont en attente de chargement
	            else {
	                imageCtx.fillStyle = bkgdColor;
	                imageCtx.fillRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
	            }
	        }
	        else if (this.projectionMethod==ProjectionEnum.AITOFF) {
	            if (imageCtx.ellipse) {
	                imageCtx.fillStyle = bkgdColor;
	                imageCtx.beginPath();
	                imageCtx.ellipse(this.cx, this.cy, 2.828*this.cx*this.zoomFactor, this.cx*this.zoomFactor*1.414, 0, 0, 2*Math.PI);
	                imageCtx.fill();
	            }
	        }
	        if (imageCtx.finish2D) {
	            imageCtx.finish2D();
	        }
	
	        
	        this.projection.setCenter(this.viewCenter.lon, this.viewCenter.lat);
	        // do we have to redo that every time? Probably not
	        this.projection.setProjection(this.projectionMethod);
	    
	
	        // ************* Draw allsky tiles (low resolution) *****************
	
	        var cornersXYViewMapHighres = null;
	        // Pour traitement des DEFORMATIONS --> TEMPORAIRE, draw deviendra la methode utilisee systematiquement
	        if (this.imageSurvey && this.imageSurvey.isReady && this.displaySurvey) {
	                if (this.aladin.reduceDeformations==null) {
	                    this.imageSurvey.draw(imageCtx, this, !this.dragging, this.curNorder);
	                }
	
	                else {
	                    this.imageSurvey.draw(imageCtx, this, this.aladin.reduceDeformations, this.curNorder);
	                }
	        }
	        /*
	        else {
	            var cornersXYViewMapAllsky = this.getVisibleCells(3);
	            var cornersXYViewMapHighres = null;
	            if (this.curNorder>=3) {
	                if (this.curNorder==3) {
	                    cornersXYViewMapHighres = cornersXYViewMapAllsky;
	                }
	                else {
	                    cornersXYViewMapHighres = this.getVisibleCells(this.curNorder);
	                }
	            }
	
	            // redraw image survey
	            if (this.imageSurvey && this.imageSurvey.isReady && this.displaySurvey) {
	                // TODO : a t on besoin de dessiner le allsky si norder>=3 ?
	                // TODO refactoring : should be a method of HpxImageSurvey
	                this.imageSurvey.redrawAllsky(imageCtx, cornersXYViewMapAllsky, this.fov, this.curNorder);
	                if (this.curNorder>=3) {
	                    this.imageSurvey.redrawHighres(imageCtx, cornersXYViewMapHighres, this.curNorder);
	                }
	            }
	        }
	        */
	        
	
	        // redraw overlay image survey
	        // TODO : does not work if different frames 
	        // TODO: use HpxImageSurvey.draw method !!
	        if (this.overlayImageSurvey && this.overlayImageSurvey.isReady) {
	            imageCtx.globalAlpha = this.overlayImageSurvey.getAlpha();
	
	            if (this.aladin.reduceDeformations==null) {
	                this.overlayImageSurvey.draw(imageCtx, this, !this.dragging, this.curOverlayNorder);
	            }
	
	            else {
	                this.overlayImageSurvey.draw(imageCtx, this, this.aladin.reduceDeformations, this.curOverlayNorder);
	            }
	            /*
	            if (this.fov>50) {
	                this.overlayImageSurvey.redrawAllsky(imageCtx, cornersXYViewMapAllsky, this.fov, this.curOverlayNorder);
	            }
	            if (this.curOverlayNorder>=3) {
	                var norderOverlay = Math.min(this.curOverlayNorder, this.overlayImageSurvey.maxOrder);
	                if ( cornersXYViewMapHighres==null || norderOverlay != this.curNorder ) {
	                    cornersXYViewMapHighres = this.getVisibleCells(norderOverlay);
	                }
	                this.overlayImageSurvey.redrawHighres(imageCtx, cornersXYViewMapHighres, norderOverlay);
	            }
	            */
	
	           imageCtx.globalAlpha = 1.0;
	
	        }
	        
	        
	        // redraw HEALPix grid
	        if( this.displayHpxGrid) {
	            var cornersXYViewMapAllsky = this.getVisibleCells(3);
	            var cornersXYViewMapHighres = null;
	            if (this.curNorder>=3) {
	                if (this.curNorder==3) {
	                    cornersXYViewMapHighres = cornersXYViewMapAllsky;
	                }
	                else {
	                    cornersXYViewMapHighres = this.getVisibleCells(this.curNorder);
	                }
	            }
	            if (cornersXYViewMapHighres && this.curNorder>3) {
	                this.healpixGrid.redraw(imageCtx, cornersXYViewMapHighres, this.fov, this.curNorder);
	            }
	            else {
	                this.healpixGrid.redraw(imageCtx, cornersXYViewMapAllsky, this.fov, 3);
	            }
	        }
	        
	        // redraw coordinates grid
	        if (this.showGrid) {
	            if (this.cooGrid==null) {
	                this.cooGrid = new CooGrid();
	            }
	            
	            this.cooGrid.redraw(imageCtx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor, this.fov);
	        }
	         
	
	
	        
	        ////// 2. Draw catalogues////////
	        var catalogCtx = this.catalogCtx;
	
	        var catalogCanvasCleared = false;
	        if (this.mustClearCatalog) {
	            catalogCtx.clearRect(0, 0, this.width, this.height);
	            catalogCanvasCleared = true;
	            this.mustClearCatalog = false;
	        }
	        if (this.catalogs && this.catalogs.length>0 && this.displayCatalog && (! this.dragging  || View.DRAW_SOURCES_WHILE_DRAGGING)) {
	              // TODO : do not clear every time
	            //// clear canvas ////
	            if (! catalogCanvasCleared) {
	                catalogCtx.clearRect(0, 0, this.width, this.height);
	                catalogCanvasCleared = true;
	            }
	            for (var i=0; i<this.catalogs.length; i++) {
	                var cat = this.catalogs[i];
	                cat.draw(catalogCtx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor);
	            }
	        }
	        // draw popup catalog
	        if (this.catalogForPopup.isShowing && this.catalogForPopup.sources.length>0) {
	            if (! catalogCanvasCleared) {
	                catalogCtx.clearRect(0, 0, this.width, this.height);
	                catalogCanvasCleared = true;
	            }
	            this.catalogForPopup.draw(catalogCtx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor);
	        }
	
	        ////// 3. Draw overlays////////
	        var overlayCtx = this.catalogCtx;
	        if (this.overlays && this.overlays.length>0 && (! this.dragging  || View.DRAW_SOURCES_WHILE_DRAGGING)) {
	            if (! catalogCanvasCleared) {
	                catalogCtx.clearRect(0, 0, this.width, this.height);
	                catalogCanvasCleared = true;
	            }
	            for (var i=0; i<this.overlays.length; i++) {
	                this.overlays[i].draw(overlayCtx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor);
	            }
	        }
	        
	
	        // draw MOCs
	        var mocCtx = this.catalogCtx;
	        if (this.mocs && this.mocs.length>0 && (! this.dragging  || View.DRAW_MOCS_WHILE_DRAGGING)) {
	            if (! catalogCanvasCleared) {
	                catalogCtx.clearRect(0, 0, this.width, this.height);
	                catalogCanvasCleared = true;
	            }
	            for (var i=0; i<this.mocs.length; i++) {
	                this.mocs[i].draw(mocCtx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor, this.fov);
	            }
	        }
	
	
	        if (this.mode==View.SELECT) {
	            mustRedrawReticle = true;
	        }
	        ////// 4. Draw reticle ///////
	        // TODO: reticle should be placed in a static DIV, no need to waste a canvas
	        var reticleCtx = this.reticleCtx;
	        if (this.mustRedrawReticle || this.mode==View.SELECT) {
	            reticleCtx.clearRect(0, 0, this.width, this.height);
	        }
	        if (this.displayReticle) {
	            
	            if (! this.reticleCache) {
	                // build reticle image
	                var c = document.createElement('canvas');
	                var s = this.options.reticleSize;
	                c.width = s;
	                c.height = s;
	                var ctx = c.getContext('2d');
	                ctx.lineWidth = 2;
	                ctx.strokeStyle = this.options.reticleColor;
	                ctx.beginPath();
	                ctx.moveTo(s/2, s/2+(s/2-1));
	                ctx.lineTo(s/2, s/2+2);
	                ctx.moveTo(s/2, s/2-(s/2-1));
	                ctx.lineTo(s/2, s/2-2);
	                
	                ctx.moveTo(s/2+(s/2-1), s/2);
	                ctx.lineTo(s/2+2,  s/2);
	                ctx.moveTo(s/2-(s/2-1), s/2);
	                ctx.lineTo(s/2-2,  s/2);
	                
	                ctx.stroke();
	                
	                this.reticleCache = c;
	            }
	                
	            reticleCtx.drawImage(this.reticleCache, this.width/2 - this.reticleCache.width/2, this.height/2 - this.reticleCache.height/2);
	            
	            
	            this.mustRedrawReticle = false;
	        }
	
	        ////// 5. Draw all-sky ring /////
	        if (this.projectionMethod==ProjectionEnum.SIN && this.fov>=60 && this.aladin.options['showAllskyRing'] === true) {
	                    imageCtx.strokeStyle = this.aladin.options['allskyRingColor'];
	                    var ringWidth = this.aladin.options['allskyRingWidth'];
	                    imageCtx.lineWidth = ringWidth;
	                    imageCtx.beginPath();
	                    var maxCxCy = this.cx>this.cy ? this.cx : this.cy;
	                    imageCtx.arc(this.cx, this.cy, (maxCxCy-(ringWidth/2.0)+1) * this.zoomFactor, 0, 2*Math.PI, true);
	                    imageCtx.stroke();
	        }
	
	        
	        // draw selection box
	        if (this.mode==View.SELECT && this.dragging) {
	            reticleCtx.fillStyle = "rgba(100, 240, 110, 0.25)";
	            var w = this.dragx - this.selectStartCoo.x;
	            var h =  this.dragy - this.selectStartCoo.y;
	            
	            reticleCtx.fillRect(this.selectStartCoo.x, this.selectStartCoo.y, w, h);
	        }
	        
	        
	         // TODO : is this the right way?
	         if (saveNeedRedraw==this.needRedraw) {
	             this.needRedraw = false;
	         }
	
	
	        // objects lookup
	        if (!this.dragging) {
	            this.updateObjectsLookup();
	        } 
	
	        // execute 'positionChanged' and 'zoomChanged' callbacks
	        this.executeCallbacksThrottled();
	
	    };
	
	    View.prototype.forceRedraw = function() {
	        this.flagForceRedraw = true;
	    };
	    
	    View.prototype.refreshProgressiveCats = function() {
	        if (! this.catalogs) {
	            return;
	        }
	        for (var i=0; i<this.catalogs.length; i++) {
	            if (this.catalogs[i].type=='progressivecat') {
	                this.catalogs[i].loadNeededTiles();
	            }
	        }
	    };
	
	    View.prototype.getVisiblePixList = function(norder, frameSurvey) {
	        var nside = Math.pow(2, norder);
	
	        var pixList;
	        var npix = HealpixIndex.nside2Npix(nside);
	        if (this.fov>80) {
	            pixList = [];
	            for (var ipix=0; ipix<npix; ipix++) {
	                pixList.push(ipix);
	            }
	        }
	        else {
	            var hpxIdx = new HealpixIndex(nside);
	            hpxIdx.init();
	            var spatialVector = new SpatialVector();
	            // if frame != frame image survey, we need to convert to survey frame system
	            var xy = AladinUtils.viewToXy(this.cx, this.cy, this.width, this.height, this.largestDim, this.zoomFactor);
	            var radec = this.projection.unproject(xy.x, xy.y);
	            var lonlat = [];
	            if (frameSurvey && frameSurvey.system != this.cooFrame.system) {
	                if (frameSurvey.system==CooFrameEnum.SYSTEMS.J2000) {
	                    lonlat = CooConversion.GalacticToJ2000([radec.ra, radec.dec]);
	                }
	                else if (frameSurvey.system==CooFrameEnum.SYSTEMS.GAL) {
	                    lonlat = CooConversion.J2000ToGalactic([radec.ra, radec.dec]);
	                }
	            }
	            else {
	                lonlat = [radec.ra, radec.dec];
	            }
	            if (this.imageSurvey && this.imageSurvey.longitudeReversed===true) {
	                spatialVector.set(lonlat[0], lonlat[1]);
	            }
	            else {
	                spatialVector.set(lonlat[0], lonlat[1]);
	            }
	            var radius = this.fov*0.5*this.ratio;
	            // we need to extend the radius
	            if (this.fov>60) {
	                radius *= 1.6;
	            }
	            else if (this.fov>12) {
	                radius *=1.45;
	            }
	            else {
	                radius *= 1.1;
	            }
	
	
	
	            pixList = hpxIdx.queryDisc(spatialVector, radius*Math.PI/180.0, true, true);
	            // add central pixel at index 0
	            var polar = Utils.radecToPolar(lonlat[0], lonlat[1]);
	            ipixCenter = hpxIdx.ang2pix_nest(polar.theta, polar.phi);
	            pixList.unshift(ipixCenter);
	
	        }
	
	        return pixList;
	    };
	    
	    // TODO: optimize this method !!
	    View.prototype.getVisibleCells = function(norder, frameSurvey) {
	        if (! frameSurvey && this.imageSurvey) {
	            frameSurvey = this.imageSurvey.cooFrame;
	        }
	        var cells = []; // array to be returned
	        var cornersXY = [];
	        var spVec = new SpatialVector();
	        var nside = Math.pow(2, norder); // TODO : to be modified
	        var npix = HealpixIndex.nside2Npix(nside);
	        var ipixCenter = null;
	        
	        // build list of pixels
	        // TODO: pixList can be obtained from getVisiblePixList
	        var pixList;
	        if (this.fov>80) {
	            pixList = [];
	            for (var ipix=0; ipix<npix; ipix++) {
	                pixList.push(ipix);
	            }
	        }
	        else {
	            var hpxIdx = new HealpixIndex(nside);
	            hpxIdx.init();
	            var spatialVector = new SpatialVector();
	            // if frame != frame image survey, we need to convert to survey frame system
	            var xy = AladinUtils.viewToXy(this.cx, this.cy, this.width, this.height, this.largestDim, this.zoomFactor);
	            var radec = this.projection.unproject(xy.x, xy.y);
	            var lonlat = [];
	            if (frameSurvey && frameSurvey.system != this.cooFrame.system) {
	                if (frameSurvey.system==CooFrameEnum.SYSTEMS.J2000) {
	                    lonlat = CooConversion.GalacticToJ2000([radec.ra, radec.dec]); 
	                }
	                else if (frameSurvey.system==CooFrameEnum.SYSTEMS.GAL) {
	                    lonlat = CooConversion.J2000ToGalactic([radec.ra, radec.dec]);
	                }
	            }
	            else {
	                lonlat = [radec.ra, radec.dec];
	            }
	            if (this.imageSurvey && this.imageSurvey.longitudeReversed===true) {
	                spatialVector.set(lonlat[0], lonlat[1]);
	            }
	            else {
	                spatialVector.set(lonlat[0], lonlat[1]);
	            }
	            var radius = this.fov*0.5*this.ratio;
	            // we need to extend the radius
	            if (this.fov>60) {
	                radius *= 1.6;
	            }
	            else if (this.fov>12) {
	                radius *=1.45;
	            }
	            else {
	                radius *= 1.1;
	            }
	            
	            
	                
	            pixList = hpxIdx.queryDisc(spatialVector, radius*Math.PI/180.0, true, true);
	            // add central pixel at index 0
	            var polar = Utils.radecToPolar(lonlat[0], lonlat[1]);
	            ipixCenter = hpxIdx.ang2pix_nest(polar.theta, polar.phi);
	            pixList.unshift(ipixCenter);
	        }
	        
	        
	        var ipix;
	        var lon, lat;
	        for (var ipixIdx=0, len=pixList.length; ipixIdx<len; ipixIdx++) {
	            ipix = pixList[ipixIdx];
	            if (ipix==ipixCenter && ipixIdx>0) { 
	                continue;
	            }
	            var cornersXYView = [];
	            corners = HealpixCache.corners_nest(ipix, nside);
	
	            for (var k=0; k<4; k++) {
	                spVec.setXYZ(corners[k].x, corners[k].y, corners[k].z);
	                
	                // need for frame transformation ?
	                if (frameSurvey && frameSurvey.system != this.cooFrame.system) {
	                    if (frameSurvey.system == CooFrameEnum.SYSTEMS.J2000) {
	                        var radec = CooConversion.J2000ToGalactic([spVec.ra(), spVec.dec()]); 
	                        lon = radec[0];
	                        lat = radec[1];
	                    }
	                    else if (frameSurvey.system == CooFrameEnum.SYSTEMS.GAL) {
	                        var radec = CooConversion.GalacticToJ2000([spVec.ra(), spVec.dec()]); 
	                        lon = radec[0];
	                        lat = radec[1];
	                    }
	                }
	                else {
	                    lon = spVec.ra();
	                    lat = spVec.dec();
	                }
	                
	                cornersXY[k] = this.projection.project(lon, lat);
	            }
	
	
	            if (cornersXY[0] == null ||  cornersXY[1] == null  ||  cornersXY[2] == null ||  cornersXY[3] == null ) {
	                continue;
	            }
	
	
	
	            for (var k=0; k<4; k++) {
	                cornersXYView[k] = AladinUtils.xyToView(cornersXY[k].X, cornersXY[k].Y, this.width, this.height, this.largestDim, this.zoomFactor);
	            }
	
	            var indulge = 10;
	            // detect pixels outside view. Could be improved !
	            // we minimize here the number of cells returned
	            if( cornersXYView[0].vx<0 && cornersXYView[1].vx<0 && cornersXYView[2].vx<0 &&cornersXYView[3].vx<0) {
	                continue;
	            }
	            if( cornersXYView[0].vy<0 && cornersXYView[1].vy<0 && cornersXYView[2].vy<0 &&cornersXYView[3].vy<0) {
	                continue;
	            }
	            if( cornersXYView[0].vx>=this.width && cornersXYView[1].vx>=this.width && cornersXYView[2].vx>=this.width &&cornersXYView[3].vx>=this.width) {
	                continue;
	            }
	            if( cornersXYView[0].vy>=this.height && cornersXYView[1].vy>=this.height && cornersXYView[2].vy>=this.height &&cornersXYView[3].vy>=this.height) {
	                continue;
	            }
	
	
	            // check if pixel is visible
	//            if (this.fov<160) { // don't bother checking if fov is large enough
	//                if ( ! AladinUtils.isHpxPixVisible(cornersXYView, this.width, this.height) ) {
	//                    continue;
	//                }
	//            }
	            // check if we have a pixel at the edge of the view in AITOFF --> TO BE MODIFIED
	            if (this.projection.PROJECTION==ProjectionEnum.AITOFF) {
	                var xdiff = cornersXYView[0].vx-cornersXYView[2].vx;
	                var ydiff = cornersXYView[0].vy-cornersXYView[2].vy;
	                var distDiag = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
	                if (distDiag>this.largestDim/5) {
	                    continue;
	                }
	                xdiff = cornersXYView[1].vx-cornersXYView[3].vx;
	                ydiff = cornersXYView[1].vy-cornersXYView[3].vy;
	                distDiag = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
	                if (distDiag>this.largestDim/5) {
	                    continue;
	                }
	            }
	            
	            cornersXYView.ipix = ipix;
	            cells.push(cornersXYView);
	        }
	        
	        return cells;
	    };
	    
	    
	    
	    // get position in view for a given HEALPix cell
	    View.prototype.getPositionsInView = function(ipix, norder) {
	        var cornersXY = [];
	        var lon, lat;
	        var spVec = new SpatialVector();
	        var nside = Math.pow(2, norder); // TODO : to be modified
	        
	        
	        var cornersXYView = [];  // will be returned
	        var corners = HealpixCache.corners_nest(ipix, nside);
	
	        for (var k=0; k<4; k++) {
	            spVec.setXYZ(corners[k].x, corners[k].y, corners[k].z);
	                
	            // need for frame transformation ?
	            if (this.imageSurvey && this.imageSurvey.cooFrame.system != this.cooFrame.system) {
	                if (this.imageSurvey.cooFrame.system == CooFrameEnum.SYSTEMS.J2000) {
	                    var radec = CooConversion.J2000ToGalactic([spVec.ra(), spVec.dec()]); 
	                    lon = radec[0];
	                    lat = radec[1];
	                }
	                else if (this.imageSurvey.cooFrame.system == CooFrameEnum.SYSTEMS.GAL) {
	                    var radec = CooConversion.GalacticToJ2000([spVec.ra(), spVec.dec()]); 
	                    lon = radec[0];
	                    lat = radec[1];
	                }
	            }
	            else {
	                lon = spVec.ra();
	                lat = spVec.dec();
	            }
	                
	            cornersXY[k] = this.projection.project(lon, lat);
	        }
	        
	        if (cornersXY[0] == null ||  cornersXY[1] == null  ||  cornersXY[2] == null ||  cornersXY[3] == null ) {
	            return null;
	        }
	
	
	        for (var k=0; k<4; k++) {
	            cornersXYView[k] = AladinUtils.xyToView(cornersXY[k].X, cornersXY[k].Y, this.width, this.height, this.largestDim, this.zoomFactor);
	        }
	
	        return cornersXYView;
	    };
	    
	    
	    View.prototype.computeZoomFactor = function(level) {
	        if (level>0) {
	            return AladinUtils.getZoomFactorForAngle(180/Math.pow(1.15, level), this.projectionMethod);
	        }
	        else {
	            return 1 + 0.1*level;
	        }
	    };
	    
	    View.prototype.setZoom = function(fovDegrees) {
	        if (fovDegrees<0 || fovDegrees>180) {
	            return;
	        }
	        var zoomLevel = Math.log(180/fovDegrees)/Math.log(1.15);
	        this.setZoomLevel(zoomLevel);
	    };
	    
	    View.prototype.setShowGrid = function(showGrid) {
	        this.showGrid = showGrid;
	        this.requestRedraw();
	    };
	
	    
	    View.prototype.setZoomLevel = function(level) {
	        if (this.minFOV || this.maxFOV) {
	            var newFov = doComputeFov(this, this.computeZoomFactor(Math.max(-2, level)));
	            if (this.maxFOV && newFov>this.maxFOV  ||  this.minFOV && newFov<this.minFOV)  {
	                return;
	            }
	        }
	        
	        if (this.projectionMethod==ProjectionEnum.SIN) {
	            if (this.aladin.options.allowFullZoomout === true) {
	                // special case for Andreas Wicenec until I fix the problem
	                if (this.width/this.height>2) {
	                    this.zoomLevel = Math.max(-7, level); // TODO : canvas freezes in firefox when max level is small
	                }
	                else if (this.width/this.height<0.5) {
	                    this.zoomLevel = Math.max(-2, level); // TODO : canvas freezes in firefox when max level is small
	                }
	                else {
	                    this.zoomLevel = Math.max(-6, level); // TODO : canvas freezes in firefox when max level is small
	                }
	            }
	            else {
	                this.zoomLevel = Math.max(-2, level); // TODO : canvas freezes in firefox when max level is small
	            }
	        }
	        else {
	            this.zoomLevel = Math.max(-7, level); // TODO : canvas freezes in firefox when max level is small
	        }
	        
	        
	        this.zoomFactor = this.computeZoomFactor(this.zoomLevel);
	        
	        this.fov = computeFov(this);
	        updateFovDiv(this);
	        
	        this.computeNorder();
	        
	        this.forceRedraw();
	        this.requestRedraw();
	        
	        // on avertit les catalogues progressifs
	        if (! this.debounceProgCatOnZoom) {
	            var self = this;
	            this.debounceProgCatOnZoom = Utils.debounce(function() {self.refreshProgressiveCats();}, 300);
	        }
	        this.debounceProgCatOnZoom();
	        
	    };
	    
	    /**
	     * compute and set the norder corresponding to the current view resolution
	     */
	    View.prototype.computeNorder = function() {
	        var resolution = this.fov / this.largestDim; // in degree/pixel
	        var tileSize = 512; // TODO : read info from HpxImageSurvey.tileSize
	        var nside = HealpixIndex.calculateNSide(3600*tileSize*resolution); // 512 = size of a "tile" image
	        var norder = Math.log(nside)/Math.log(2);
	        norder = Math.max(norder, 1);
	        this.realNorder = norder;
	
	            
	        // here, we force norder to 3 (otherwise, the display is "blurry" for too long when zooming in)
	        if (this.fov<=50 && norder<=2) {
	            norder = 3;
	        }
	           
	
	        // that happens if we do not wish to display tiles coming from Allsky.[jpg|png]
	        if (this.imageSurvey && norder<=2 && this.imageSurvey.minOrder>2) {
	            norder = this.imageSurvey.minOrder;
	        }
	
	        var overlayNorder  = norder;
	        if (this.imageSurvey && norder>this.imageSurvey.maxOrder) {
	            norder = this.imageSurvey.maxOrder;
	        }
	        if (this.overlayImageSurvey && overlayNorder>this.overlayImageSurvey.maxOrder) {
	            overlayNorder = this.overlayImageSurvey.maxOrder;
	        }
	        // should never happen, as calculateNSide will return something <=HealpixIndex.ORDER_MAX
	        if (norder>HealpixIndex.ORDER_MAX) {
	            norder = HealpixIndex.ORDER_MAX;
	        }
	        if (overlayNorder>HealpixIndex.ORDER_MAX) {
	            overlayNorder = HealpixIndex.ORDER_MAX;
	        }
	            
	        this.curNorder = norder;
	        this.curOverlayNorder = overlayNorder;
	    };
	    
	    View.prototype.untaintCanvases = function() {
	        this.createCanvases();
	        createListeners(this);
	        this.fixLayoutDimensions();
	    };
	    
	    View.prototype.setOverlayImageSurvey = function(overlayImageSurvey, callback) {
	        if (! overlayImageSurvey) {
	            this.overlayImageSurvey = null;
	            this.requestRedraw();
	            return;
	        }
	        
	        // reset canvas to "untaint" canvas if needed
	        // we test if the previous base image layer was using CORS or not
	        if ($.support.cors && this.overlayImageSurvey && ! this.overlayImageSurvey.useCors) {
	            this.untaintCanvases();
	        }
	        
	        var newOverlayImageSurvey;
	        if (typeof overlayImageSurvey == "string") {
	            newOverlayImageSurvey = HpxImageSurvey.getSurveyFromId(overlayImageSurvey);
	            if ( ! newOverlayImageSurvey) {
	                newOverlayImageSurvey = HpxImageSurvey.getSurveyFromId(HpxImageSurvey.DEFAULT_SURVEY_ID);
	            }
	        }
	        else {
	            newOverlayImageSurvey = overlayImageSurvey;
	        }
	        newOverlayImageSurvey.isReady = false;
	        this.overlayImageSurvey = newOverlayImageSurvey;
	        
	        var self = this;
	        newOverlayImageSurvey.init(this, function() {
	            //self.imageSurvey = newImageSurvey;
	            self.computeNorder();
	            newOverlayImageSurvey.isReady = true;
	            self.requestRedraw();
	            self.updateObjectsLookup();
	            
	            if (callback) {
	                callback();
	            }
	        });
	    };
	
	    View.prototype.setUnknownSurveyIfNeeded = function() {
	        if (unknownSurveyId) {
	            this.setImageSurvey(unknownSurveyId);
	            unknownSurveyId = undefined;
	        }
	    }
	    
	    var unknownSurveyId = undefined;
	    // @param imageSurvey : HpxImageSurvey object or image survey identifier
	    View.prototype.setImageSurvey = function(imageSurvey, callback) {
	        if (! imageSurvey) {
	            return;
	        }
	        
	        // reset canvas to "untaint" canvas if needed
	        // we test if the previous base image layer was using CORS or not
	        if ($.support.cors && this.imageSurvey && ! this.imageSurvey.useCors) {
	            this.untaintCanvases();
	        }
	        
	        var newImageSurvey;
	        if (typeof imageSurvey == "string") {
	            newImageSurvey = HpxImageSurvey.getSurveyFromId(imageSurvey);
	            if ( ! newImageSurvey) {
	                newImageSurvey = HpxImageSurvey.getSurveyFromId(HpxImageSurvey.DEFAULT_SURVEY_ID);
	                unknownSurveyId = imageSurvey;
	            }
	        }
	        else {
	            newImageSurvey = imageSurvey;
	        }
	    
	        // do not touch the tileBuffer if we load the exact same HiPS (in that case, should we stop here??)    
	        if (newImageSurvey && this.imageSurvey && newImageSurvey.hasOwnProperty('id') && this.imageSurvey.hasOwnProperty('id') && newImageSurvey.id==this.imageSurvey.id) {
	            // do nothing
	        }
	        else {
	            // buffer reset
	            this.tileBuffer = new TileBuffer();
	        }
	        
	        newImageSurvey.isReady = false;
	        this.imageSurvey = newImageSurvey;
	
	        this.projection.reverseLongitude(this.imageSurvey.longitudeReversed); 
	        
	        var self = this;
	        newImageSurvey.init(this, function() {
	            //self.imageSurvey = newImageSurvey;
	            self.computeNorder();
	            newImageSurvey.isReady = true;
	            self.requestRedraw();
	            self.updateObjectsLookup();
	            
	            if (callback) {
	                callback();
	            }
	        });
	    };
	    
	    View.prototype.requestRedraw = function() {
	        this.needRedraw = true;
	    };
	    
	    View.prototype.changeProjection = function(projectionMethod) {
	        this.projectionMethod = projectionMethod;
	        this.requestRedraw();
	    };
	
	    View.prototype.changeFrame = function(cooFrame) {
	        var oldCooFrame = this.cooFrame;
	        this.cooFrame = cooFrame;
	        // recompute viewCenter
	        if (this.cooFrame.system == CooFrameEnum.SYSTEMS.GAL && this.cooFrame.system != oldCooFrame.system) {
	            var lb = CooConversion.J2000ToGalactic([this.viewCenter.lon, this.viewCenter.lat]);
	            this.viewCenter.lon = lb[0];
	            this.viewCenter.lat = lb[1]; 
	        }
	        else if (this.cooFrame.system == CooFrameEnum.SYSTEMS.J2000 && this.cooFrame.system != oldCooFrame.system) {
	            var radec = CooConversion.GalacticToJ2000([this.viewCenter.lon, this.viewCenter.lat]);
	            this.viewCenter.lon = radec[0];
	            this.viewCenter.lat = radec[1]; 
	        }
	
	        this.location.update(this.viewCenter.lon, this.viewCenter.lat, this.cooFrame, true);
	
	        this.requestRedraw();
	    };
	
	    View.prototype.showHealpixGrid = function(show) {
	        this.displayHpxGrid = show;
	        this.requestRedraw();
	    };
	    
	    View.prototype.showSurvey = function(show) {
	        this.displaySurvey = show;
	
	        this.requestRedraw();
	    };
	    
	    View.prototype.showCatalog = function(show) {
	        this.displayCatalog = show;
	
	        if (!this.displayCatalog) {
	            this.mustClearCatalog = true;
	        }
	        this.requestRedraw();
	    };
	    
	    View.prototype.showReticle = function(show) {
	        this.displayReticle = show;
	
	        this.mustRedrawReticle = true;
	        this.requestRedraw();
	    };
	
	    View.prototype.pointTo = function(ra, dec) {
	        ra = parseFloat(ra);
	        dec = parseFloat(dec);
	        if (isNaN(ra) || isNaN(dec)) {
	            return;
	        }
	        if (this.cooFrame.system==CooFrameEnum.SYSTEMS.J2000) {
	            this.viewCenter.lon = ra;
	            this.viewCenter.lat = dec;
	        }
	        else if (this.cooFrame.system==CooFrameEnum.SYSTEMS.GAL) {
	            var lb = CooConversion.J2000ToGalactic([ra, dec]);
	            this.viewCenter.lon = lb[0];
	            this.viewCenter.lat = lb[1];
	        }
	
	        this.location.update(this.viewCenter.lon, this.viewCenter.lat, this.cooFrame, true);
	
	        this.forceRedraw();
	        this.requestRedraw();
	        var self = this;
	        setTimeout(function() {self.refreshProgressiveCats();}, 1000);
	
	    };
	    View.prototype.makeUniqLayerName = function(name) {
	        if (! this.layerNameExists(name)) {
	            return name;
	        }
	        for (var k=1;;++k) {
	            var newName = name + '_' + k;
	            if ( ! this.layerNameExists(newName)) {
	                return newName;
	            }
	        }
	    };
	    View.prototype.layerNameExists = function(name) {
	        var c = this.allOverlayLayers;
	        for (var k=0; k<c.length; k++) {
	            if (name==c[k].name) {
	                return true;
	            }
	        }
	        return false;
	    };
	
	    View.prototype.removeLayers = function() {
	        this.catalogs = [];
	        this.overlays = [];
	        this.mocs = [];
	        this.allOverlayLayers = [];
	        this.requestRedraw();
	    };
	
	    View.prototype.addCatalog = function(catalog) {
	        catalog.name = this.makeUniqLayerName(catalog.name);
	        this.allOverlayLayers.push(catalog);
	        this.catalogs.push(catalog);
	        if (catalog.type=='catalog') {
	            catalog.setView(this);
	        }
	        else if (catalog.type=='progressivecat') {
	            catalog.init(this);
	        }
	    };
	    View.prototype.addOverlay = function(overlay) {
	        overlay.name = this.makeUniqLayerName(overlay.name);
	        this.overlays.push(overlay);
	        this.allOverlayLayers.push(overlay);
	        overlay.setView(this);
	    };
	    
	    View.prototype.addMOC = function(moc) {
	        moc.name = this.makeUniqLayerName(moc.name);
	        this.mocs.push(moc);
	        this.allOverlayLayers.push(moc);
	        moc.setView(this);
	    };
	    
	    View.prototype.getObjectsInBBox = function(x, y, w, h) {
	        if (w<0) {
	            x = x+w;
	            w = -w;
	        }
	        if (h<0) {
	            y = y+h;
	            h = -h;
	        }
	        var objList = [];
	        var cat, sources, s;
	        if (this.catalogs) {
	            for (var k=0; k<this.catalogs.length; k++) {
	                cat = this.catalogs[k];
	                if (!cat.isShowing) {
	                    continue;
	                }
	                sources = cat.getSources();
	                for (var l=0; l<sources.length; l++) {
	                    s = sources[l];
	                    if (!s.isShowing || !s.x || !s.y) {
	                        continue;
	                    }
	                    if (s.x>=x && s.x<=x+w && s.y>=y && s.y<=y+h) {
	                        objList.push(s);
	                    }
	                }
	            }
	        }
	        return objList;
	        
	    };
	
	    // update objLookup, lookup table 
	    View.prototype.updateObjectsLookup = function() {
	        this.objLookup = [];
	
	        var cat, sources, s, x, y;
	        if (this.catalogs) {
	            for (var k=0; k<this.catalogs.length; k++) {
	                cat = this.catalogs[k];
	                if (!cat.isShowing) {
	                    continue;
	                }
	                sources = cat.getSources();
	                for (var l=0; l<sources.length; l++) {
	                    s = sources[l];
	                    if (!s.isShowing || !s.x || !s.y) {
	                        continue;
	                    }
	
	                    x = s.x;
	                    y = s.y;
	
	                    if (typeof this.objLookup[x] === 'undefined') {
	                        this.objLookup[x] = [];
	                    }
	                    if (typeof this.objLookup[x][y] === 'undefined') {
	                        this.objLookup[x][y] = [];
	                    }
	                    this.objLookup[x][y].push(s);
	                }       
	            }           
	        }     
	    };
	
	    // return closest object within a radius of maxRadius pixels. maxRadius is an integer
	    View.prototype.closestObjects = function(x, y, maxRadius) {
	
	        // footprint selection code adapted from Fabrizzio Giordano dev. from Serco for ESA/ESDC
	        var overlay;
	        var canvas=this.catalogCanvas;
	        var ctx = canvas.getContext("2d");
	
	        if (this.overlays) {
	            for (var k=0; k<this.overlays.length; k++) {
	                overlay = this.overlays[k];
	                for (var i=0; i<overlay.overlays.length;i++){
	
	                    // test polygons first
	                    var footprint = overlay.overlays[i];
	                    var pointXY = [];
	                    for(var j=0;j<footprint.polygons.length;j++){
	
	                        var xy = AladinUtils.radecToViewXy(footprint.polygons[j][0], footprint.polygons[j][1],
	                                this.projection,
	                                this.cooFrame,
	                                this.width, this.height,
	                                this.largestDim,
	                                this.zoomFactor);
	                        if (! xy) {
	                            continue;
	                        }
	                        pointXY.push({
	                            x: xy.vx,
	                            y: xy.vy
	                        });
	                    }
	                    for(var l=0; l<pointXY.length-1;l++){
	
	                        ctx.beginPath();                        // new segment
	                        ctx.moveTo(pointXY[l].x, pointXY[l].y);     // start is current point
	                        ctx.lineTo(pointXY[l+1].x, pointXY[l+1].y); // end point is next
	                        if (ctx.isPointInStroke(x, y)) {        // x,y is on line?
	                            closest = footprint;
	                            return [closest];
	                        }
	                    }
	                }
	
	                // test Circles
	                for (var i=0; i<overlay.overlay_items.length; i++) {
	                    if (overlay.overlay_items[i] instanceof Circle) {
	                        overlay.overlay_items[i].draw(ctx, this.projection, this.cooFrame, this.width, this.height, this.largestDim, this.zoomFactor, true);
	
	                        if (ctx.isPointInStroke(x, y)) {
	                            closest = overlay.overlay_items[i];
	                            return [closest];
	                        }
	                    }
	                }
	            }
	        }
	
	
	
	
	
	
	        if (!this.objLookup) {
	            return null;
	        }
	        var closest, dist;
	        for (var r=0; r<=maxRadius; r++) {
	            closest = dist = null;
	            for (var dx=-maxRadius; dx<=maxRadius; dx++) {
	                if (! this.objLookup[x+dx]) {
	                    continue;
	                }
	                for (var dy=-maxRadius; dy<=maxRadius; dy++) {
	                    if (this.objLookup[x+dx][y+dy]) {
	                        var d = dx*dx + dy*dy;
	                        if (!closest) {
	                            closest = this.objLookup[x+dx][y+dy];
	                            dist = d;
	                        }
	                        else if (d<dist) {
	                            dist = d;
	                            closest = this.objLookup[x+dx][y+dy];
	                        }
	                    }
	                }
	            }
	            if (closest) {
	                return closest;
	            }
	        }
	        return null;
	    };
	    
	    return View;
	})();
	// Copyright 2013 - UDS/CNRS
	// The Aladin Lite program is distributed under the terms
	// of the GNU General Public License version 3.
	//
	// This file is part of Aladin Lite.
	//
	//    Aladin Lite is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, version 3 of the License.
	//
	//    Aladin Lite is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    The GNU General Public License is available in COPYING file
	//    along with Aladin Lite.
	//
	
	
	/******************************************************************************
	 * Aladin Lite project
	 * 
	 * File Aladin.js (main class)
	 * Facade to expose Aladin Lite methods
	 * 
	 * Author: Thomas Boch[CDS]
	 * 
	 *****************************************************************************/
	
	Aladin = (function() {
	    
	    // Constructor
	    var Aladin = function(aladinDiv, requestedOptions) {
	        // check that aladinDiv exists, stop immediately otherwise
	        if ($(aladinDiv).length==0) {
	            console.log('Could not find div ' + aladinDiv + '. Aborting creation of Aladin Lite instance');
	            return;
	        }
	
	
		    var self = this;
		    
		    // if not options was set, try to retrieve them from the query string
		    if (requestedOptions===undefined) {
		        requestedOptions = this.getOptionsFromQueryString();
		    }
		    requestedOptions = requestedOptions || {};
		    
		    
		    // 'fov' option was previsouly called 'zoom'
		    if ('zoom' in requestedOptions) {
		        var fovValue = requestedOptions.zoom;
		        delete requestedOptions.zoom;
		        requestedOptions.fov = fovValue;
		    }
		    // merge with default options
		    var options = {};
		    for (var key in Aladin.DEFAULT_OPTIONS) {
		        if (requestedOptions[key] !== undefined) {
		            options[key] = requestedOptions[key];
		        }
		        else {
		            options[key] = Aladin.DEFAULT_OPTIONS[key];
		        }
		    }
		    for (var key in requestedOptions) {
		        if (Aladin.DEFAULT_OPTIONS[key]===undefined) {
		            options[key] = requestedOptions[key];
		        }
		    }
		    
	        this.options = options;
	
	        $("<style type='text/css'> .aladin-reticleColor { color: " + this.options.reticleColor + "; font-weight:bold;} </style>").appendTo(aladinDiv);
	
		    
	
			this.aladinDiv = aladinDiv;
	
	        this.reduceDeformations = true;
	
			// parent div
			$(aladinDiv).addClass("aladin-container");
			
		      
			var cooFrame = CooFrameEnum.fromString(options.cooFrame, CooFrameEnum.J2000);
			// locationDiv is the div where we write the position
			var locationDiv = $('<div class="aladin-location">'
			                    + (options.showFrame ? '<select class="aladin-frameChoice"><option value="' + CooFrameEnum.J2000.label + '" '
			                    + (cooFrame==CooFrameEnum.J2000 ? 'selected="selected"' : '') + '>J2000</option><option value="' + CooFrameEnum.J2000d.label + '" '
			                    + (cooFrame==CooFrameEnum.J2000d ? 'selected="selected"' : '') + '>J2000d</option><option value="' + CooFrameEnum.GAL.label + '" '
			                    + (cooFrame==CooFrameEnum.GAL ? 'selected="selected"' : '') + '>GAL</option></select>' : '')
			                    + '<span class="aladin-location-text"></span></div>')
			                    .appendTo(aladinDiv);
			// div where FoV value is written
			var fovDiv = $('<div class="aladin-fov"></div>').appendTo(aladinDiv);
			
			
			// zoom control
	        if (options.showZoomControl) {
		          $('<div class="aladin-zoomControl"><a href="#" class="zoomPlus" title="Zoom in">+</a><a href="#" class="zoomMinus" title="Zoom out">&ndash;</a></div>').appendTo(aladinDiv);
		    }
	        
	        // maximize control
	        if (options.showFullscreenControl) {
	            $('<div class="aladin-fullscreenControl aladin-maximize" title="Full screen"></div>')
	                .appendTo(aladinDiv);
	        }
	        this.fullScreenBtn = $(aladinDiv).find('.aladin-fullscreenControl')
	        this.fullScreenBtn.click(function() {
	            self.toggleFullscreen(self.options.realFullscreen);
	        });
	        // react to fullscreenchange event to restore initial width/height (if user pressed ESC to go back from full screen)
	        $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e) {
	            var fullscreenElt = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
	            if (fullscreenElt===null || fullscreenElt===undefined) {
	                self.fullScreenBtn.removeClass('aladin-restore');
	                self.fullScreenBtn.addClass('aladin-maximize');
	                self.fullScreenBtn.attr('title', 'Full screen');
	                $(self.aladinDiv).removeClass('aladin-fullscreen');
	        
	                var fullScreenToggledFn = self.callbacksByEventName['fullScreenToggled'];
	                var isInFullscreen = self.fullScreenBtn.hasClass('aladin-restore');
	                (typeof fullScreenToggledFn === 'function') && fullScreenToggledFn(isInFullscreen);
	            }
	        });
	
	        
	
	
	
			// Aladin logo
			$("<div class='aladin-logo-container'><a href='http://aladin.unistra.fr/' title='Powered by Aladin Lite' target='_blank'><div class='aladin-logo'></div></a></div>").appendTo(aladinDiv);
			
			
			// we store the boxes
			this.boxes = [];
	
	        // measurement table
	        this.measurementTable = new MeasurementTable(aladinDiv);
	
			
			
			var location = new Location(locationDiv.find('.aladin-location-text'));
	        
			// set different options
			this.view = new View(this, location, fovDiv, cooFrame, options.fov);
			this.view.setShowGrid(options.showCooGrid);
	
		    // retrieve available surveys
	        // TODO: replace call with MocServer
		    $.ajax({
		        url: "//aladin.unistra.fr/java/nph-aladin.pl",
		        data: {"frame": "aladinLiteDic"},
		        method: 'GET',
		        dataType: 'jsonp', // could this be repaced by json ??
		        success: function(data) {
	                var map = {};
	                for (var k=0; k<data.length; k++) {
	                    map[data[k].id] = true;
	                }
	                // retrieve existing surveys
	                for (var k=0; k<HpxImageSurvey.SURVEYS.length; k++) {
	                    if (! map[HpxImageSurvey.SURVEYS[k].id]) {
	                        data.push(HpxImageSurvey.SURVEYS[k]);
	                    }
	                }
		            HpxImageSurvey.SURVEYS = data;
	                self.view.setUnknownSurveyIfNeeded();
		        },
		        error: function() {
		        }
		    });
			
		      // layers control panel
	        // TODO : valeur des checkbox en fonction des options
			// TODO : classe LayerBox
	        if (options.showLayersControl) {
	            var d = $('<div class="aladin-layersControl-container" title="Manage layers"><div class="aladin-layersControl"></div></div>');
	            d.appendTo(aladinDiv);
	            
	            var layerBox = $('<div class="aladin-box aladin-layerBox aladin-cb-list"></div>');
	            layerBox.appendTo(aladinDiv);
	            
	            this.boxes.push(layerBox);
	            
	            // we return false so that the default event is not submitted, and to prevent event bubbling
	            d.click(function() {self.hideBoxes();self.showLayerBox();return false;});
	
	        }
	
	        
	        // goto control panel
	        if (options.showGotoControl) {
	            var d = $('<div class="aladin-gotoControl-container" title="Go to position"><div class="aladin-gotoControl"></div></div>');
	            d.appendTo(aladinDiv);
	            
	            var gotoBox = 
	                $('<div class="aladin-box aladin-gotoBox">' +
	                  '<a class="aladin-closeBtn">&times;</a>' +
	                  '<div style="clear: both;"></div>' +
	                  '<form class="aladin-target-form">Go to: <input type="text" placeholder="Object name/position" /></form></div>');
	            gotoBox.appendTo(aladinDiv);
	            this.boxes.push(gotoBox);
	            
	            var input = gotoBox.find('.aladin-target-form input');
	            input.on("paste keydown", function() {
	                $(this).removeClass('aladin-unknownObject'); // remove red border
	            });
	            
	            // TODO : classe GotoBox
	            d.click(function() {
	                self.hideBoxes();
	                input.val('');
	                input.removeClass('aladin-unknownObject');
	                gotoBox.show();
	                input.focus();
	                
	                
	                return false;
	            });
	            gotoBox.find('.aladin-closeBtn').click(function() {self.hideBoxes();return false;});
	        }
	        
	        // simbad pointer tool
	        if (options.showSimbadPointerControl) {
	            var d = $('<div class="aladin-simbadPointerControl-container" title="SIMBAD pointer"><div class="aladin-simbadPointerControl"></div></div>');
	            d.appendTo(aladinDiv);
	
	            d.click(function() {
	                self.view.setMode(View.TOOL_SIMBAD_POINTER);
	            });
	        }
	
	        // share control panel
	        if (options.showShareControl) {
	            var d = $('<div class="aladin-shareControl-container" title="Get link for current view"><div class="aladin-shareControl"></div></div>');
	            d.appendTo(aladinDiv);
	            
	            var shareBox = 
	                $('<div class="aladin-box aladin-shareBox">' +
	                  '<a class="aladin-closeBtn">&times;</a>' +
	                  '<div style="clear: both;"></div>' +
	                  'Link to previewer: <span class="info"></span>' +
	                  '<input type="text" class="aladin-shareInput" />' +
	                  '</div>');
	            shareBox.appendTo(aladinDiv);
	            this.boxes.push(shareBox);
	            
	            
	            // TODO : classe GotoBox, GenericBox
	            d.click(function() {
	                self.hideBoxes();
	                shareBox.show();
	                var url = self.getShareURL();
	                shareBox.find('.aladin-shareInput').val(url).select();
	                document.execCommand('copy');
	                
	                return false;
	            });
	            shareBox.find('.aladin-closeBtn').click(function() {self.hideBoxes();return false;});
	        }
			
			
	        this.gotoObject(options.target);
	
	        if (options.log) {
	            var params = requestedOptions;
	            params['version'] = Aladin.VERSION;
	            Logger.log("startup", params);
	        }
	        
			this.showReticle(options.showReticle);
			
			if (options.catalogUrls) {
			    for (var k=0, len=options.catalogUrls.length; k<len; k++) {
			        this.createCatalogFromVOTable(options.catalogUrls[k]);
			    }
			}
			
			this.setImageSurvey(options.survey);
			this.view.showCatalog(options.showCatalog);
			
		    
	    	var aladin = this;
	    	$(aladinDiv).find('.aladin-frameChoice').change(function() {
	    		aladin.setFrame($(this).val());
	    	});
	    	$('#projectionChoice').change(function() {
	    		aladin.setProjection($(this).val());
	    	});
	        
	
	        $(aladinDiv).find('.aladin-target-form').submit(function() {
	            aladin.gotoObject($(this).find('input').val(), function() {
	                $(aladinDiv).find('.aladin-target-form input').addClass('aladin-unknownObject');
	            });
	            return false;
	        });
	        
	        var zoomPlus = $(aladinDiv).find('.zoomPlus');
	        zoomPlus.click(function() {
	        	aladin.increaseZoom();
	        	return false;
	        });
	        zoomPlus.bind('mousedown', function(e) {
	            e.preventDefault(); // to prevent text selection
	        });
	        
	        var zoomMinus = $(aladinDiv).find('.zoomMinus');
	        zoomMinus.click(function() {
	            aladin.decreaseZoom();
	            return false;
	        });
	        zoomMinus.bind('mousedown', function(e) {
	            e.preventDefault(); // to prevent text selection
	        });
	        
	        // go to full screen ?
	        if (options.fullScreen) {
	            window.setTimeout(function() {self.toggleFullscreen(self.options.realFullscreen);}, 1000);
	        }
	
	
	        this.callbacksByEventName = {}; // we store the callback functions (on 'zoomChanged', 'positionChanged', ...) here
		};
		
	    /**** CONSTANTS ****/
	    Aladin.VERSION = "2018-10-30"; // will be filled by the build.sh script
	    
	    Aladin.JSONP_PROXY = "https://alasky.unistra.fr/cgi/JSONProxy";
	
	
	    
	    Aladin.DEFAULT_OPTIONS = {
	        target:                   "0 +0",
	        cooFrame:                 "J2000",
	        survey:                   "P/DSS2/color",
	        fov:                      60,
	        showReticle:              true,
	        showZoomControl:          true,
	        showFullscreenControl:    true,
	        showLayersControl:        true,
	        showGotoControl:          true,
	        showSimbadPointerControl: false,
	        showShareControl:         false,
	        showCatalog:              true, // TODO: still used ??
	        showFrame:                true,
	        showCooGrid:              false,
	        fullScreen:               false,
	        reticleColor:             "rgb(178, 50, 178)",
	        reticleSize:              22,
	        log:                      true,
	        allowFullZoomout:         false,
	        realFullscreen:           false,
	        showAllskyRing:           false,
	        allskyRingColor:          '#c8c8ff',
	        allskyRingWidth:          8
	    };
	
	   
	    // realFullscreen: AL div expands not only to the size of its parent, but takes the whole available screen estate 
	    Aladin.prototype.toggleFullscreen = function(realFullscreen) {
	        realFullscreen = Boolean(realFullscreen);
	
	        this.fullScreenBtn.toggleClass('aladin-maximize aladin-restore');
	        var isInFullscreen = this.fullScreenBtn.hasClass('aladin-restore');
	        this.fullScreenBtn.attr('title', isInFullscreen ? 'Restore original size' : 'Full screen');
	        $(this.aladinDiv).toggleClass('aladin-fullscreen');
	
	        if (realFullscreen) {
	            // go to "real" full screen mode
	            if (isInFullscreen) {
	                var d = this.aladinDiv;
	
	                if (d.requestFullscreen) {
	                    d.requestFullscreen();
	                }
	                else if (d.webkitRequestFullscreen) {
	                    d.webkitRequestFullscreen();
	                }
	                else if (d.mozRequestFullScreen) { // notice the difference in capitalization for Mozilla functions ...
	                    d.mozRequestFullScreen();
	                }
	                else if (d.msRequestFullscreen) {
	                    d.msRequestFullscreen();
	                }
	            }
	            // exit from "real" full screen mode
	            else {
	                if (document.exitFullscreen) {
	                    document.exitFullscreen();
	                }
	                else if (document.webkitExitFullscreen) {
	                    document.webkitExitFullscreen();
	                }
	                else if (document.mozCancelFullScreen) {
	                    document.mozCancelFullScreen();
	                }
	                else if (document.webkitExitFullscreen) {
	                    document.webkitExitFullscreen();
	                }
	            }
	        }
	        
	        this.view.fixLayoutDimensions();
	
	        // force call to zoomChanged callback
	        var fovChangedFn = this.callbacksByEventName['zoomChanged'];
	        (typeof fovChangedFn === 'function') && fovChangedFn(this.view.fov);
	
	        var fullScreenToggledFn = this.callbacksByEventName['fullScreenToggled'];
	        (typeof fullScreenToggledFn === 'function') && fullScreenToggledFn(isInFullscreen);
	    };
	    
	    Aladin.prototype.updateSurveysDropdownList = function(surveys) {
	        surveys = surveys.sort(function(a, b) {
	            if (! a.order) {
	                return a.id > b.id;
	            }
	            return a.order && a.order > b.order ? 1 : -1;
	        });
	        var select = $(this.aladinDiv).find('.aladin-surveySelection');
	        select.empty();
	        for (var i=0; i<surveys.length; i++) {
	            var isCurSurvey = this.view.imageSurvey.id==surveys[i].id;
	            select.append($("<option />").attr("selected", isCurSurvey).val(surveys[i].id).text(surveys[i].name));
	        };
	    };
	    
	    Aladin.prototype.getOptionsFromQueryString = function() {
	        var options = {};
	        var requestedTarget = $.urlParam('target');
	        if (requestedTarget) {
	            options.target = requestedTarget;
	        }
	        var requestedFrame = $.urlParam('frame');
	        if (requestedFrame && CooFrameEnum[requestedFrame] ) {
	            options.frame = requestedFrame;
	        }
	        var requestedSurveyId = $.urlParam('survey');
	        if (requestedSurveyId && HpxImageSurvey.getSurveyInfoFromId(requestedSurveyId)) {
	            options.survey = requestedSurveyId;
	        }
	        var requestedZoom = $.urlParam('zoom');
	        if (requestedZoom && requestedZoom>0 && requestedZoom<180) {
	            options.zoom = requestedZoom;
	        }
	        
	        var requestedShowreticle = $.urlParam('showReticle');
	        if (requestedShowreticle) {
	            options.showReticle = requestedShowreticle.toLowerCase()=='true';
	        }
	        
	        var requestedCooFrame =  $.urlParam('cooFrame');
	        if (requestedCooFrame) {
	            options.cooFrame = requestedCooFrame;
	        }
	        
	        var requestedFullscreen =  $.urlParam('fullScreen');
	        if (requestedFullscreen !== undefined) {
	            options.fullScreen = requestedFullscreen;
	        }
	        
	        return options;
	    };
		
	    // TODO: rename to setFoV
	    //@oldAPI
		Aladin.prototype.setZoom = function(fovDegrees) {
			this.view.setZoom(fovDegrees);
		};
	
		// @API
		Aladin.prototype.setFoV = Aladin.prototype.setFov = function(fovDegrees) {
			this.view.setZoom(fovDegrees);
		};
	
	    // @API
	    // (experimental) try to adjust the FoV to the given object name. Does nothing if object is not known from Simbad
		Aladin.prototype.adjustFovForObject = function(objectName) {
	        var self = this;
			this.getFovForObject(objectName, function(fovDegrees) {
	            self.setFoV(fovDegrees);
	        });
		};
	
	    
		Aladin.prototype.getFovForObject = function(objectName, callback) {
	        var query = "SELECT galdim_majaxis, V FROM basic JOIN ident ON oid=ident.oidref JOIN allfluxes ON oid=allfluxes.oidref WHERE id='" + objectName + "'";
	        var url = '//simbad.u-strasbg.fr/simbad/sim-tap/sync?query=' + encodeURIComponent(query) + '&request=doQuery&lang=adql&format=json&phase=run';
	
	        var ajax = Utils.getAjaxObject(url, 'GET', 'json', false)
	        ajax.done(function(result) {
	            var defaultFov = 4 / 60; // 4 arcmin
	            var fov = defaultFov;
	
	            if ( 'data' in result && result.data.length>0) {
	                var galdimMajAxis = Utils.isNumber(result.data[0][0]) ? result.data[0][0] / 60.0 : null; // result gives galdim in arcmin
	                var magV = Utils.isNumber(result.data[0][1]) ? result.data[0][1] : null;
	
	                if (galdimMajAxis !== null) {
	                    fov = 2 * galdimMajAxis;
	                }
	                else if (magV !== null) {
	                    if (magV<10) {
	                        fov = 2 * Math.pow(2.0, (6-magV/2.0)) / 60;
	                    }
	                }
	            }
	
	            (typeof callback === 'function') && callback(fov);
	        });
	    };
		
	    Aladin.prototype.setFrame = function(frameName) {
	        if (! frameName) {
	            return;
	        }
	        var newFrame = CooFrameEnum.fromString(frameName, CooFrameEnum.J2000);
	        if (newFrame==this.view.cooFrame)  {
	            return;
	        }
	
	        this.view.changeFrame(newFrame);
	        // màj select box
	        $(this.aladinDiv).find('.aladin-frameChoice').val(newFrame.label);
	    };
	
		Aladin.prototype.setProjection = function(projectionName) {
			if (! projectionName) {
				return;
			}
			projectionName = projectionName.toLowerCase();
			switch(projectionName) {
				case "aitoff":
					this.view.changeProjection(ProjectionEnum.AITOFF);
					break;
				case "sinus":
				default:
					this.view.changeProjection(ProjectionEnum.SIN);
			}
		};
	    
	    /** point view to a given object (resolved by Sesame) or position
	     * @api
	     *
	     * @param: target; object name or position
	     * @callbackOptions: (optional) the object with key 'success' and/or 'error' containing the success and error callback functions.
	     *
	     */
	    Aladin.prototype.gotoObject = function(targetName, callbackOptions) {
	        var successCallback = errorCallback = undefined;
	        if (typeof callbackOptions === 'object') {
	            if (callbackOptions.hasOwnProperty('success')) {
	                successCallback = callbackOptions.success;
	            }
	            if (callbackOptions.hasOwnProperty('error')) {
	                errorCallback = callbackOptions.error;
	            }
	        }
	        // this is for compatibility reason with the previous method signature which was function(targetName, errorCallback)
	        else if (typeof callbackOptions === 'function') {
	            errorCallback = callbackOptions;
	        }
	
	
	    	var isObjectName = /[a-zA-Z]/.test(targetName);
	    	
	    	// try to parse as a position
	    	if ( ! isObjectName) {
	    		var coo = new Coo();
	
				coo.parse(targetName);
				var lonlat = [coo.lon, coo.lat];
				if (this.view.cooFrame == CooFrameEnum.GAL) {
					lonlat = CooConversion.GalacticToJ2000(lonlat);
				}
	    		this.view.pointTo(lonlat[0], lonlat[1]);
	            
	            (typeof successCallback === 'function') && successCallback(this.getRaDec());
	    	}
	    	// ask resolution by Sesame
	    	else {
		        var self = this;
		        Sesame.resolve(targetName,
		                       function(data) { // success callback
		        					   var ra = data.Target.Resolver.jradeg;
		        					   var dec = data.Target.Resolver.jdedeg;
		        					   self.view.pointTo(ra, dec);
	
	                                   (typeof successCallback === 'function') && successCallback(self.getRaDec());
		                       },
		                       function(data) { // errror callback
		                            if (console) {
		                                console.log("Could not resolve object name " + targetName);
		                                console.log(data);
		                            }
	                                (typeof errorCallback === 'function') && errorCallback();
		                       });
	    	}
	    };
	    
	    
	    
	    /**
	     * go to a given position, expressed in the current coordinate frame
	     * 
	     * @API
	     */
	    Aladin.prototype.gotoPosition = function(lon, lat) {
	        var radec;
	        // first, convert to J2000 if needed
	        if (this.view.cooFrame==CooFrameEnum.GAL) {
	            radec = CooConversion.GalacticToJ2000([lon, lat]);
	        }
	        else {
	            radec = [lon, lat];
	        }
	    	this.view.pointTo(radec[0], radec[1]);
	    };
	    
	    
	    var doAnimation = function(aladin) {
	        var params = aladin.animationParams;
	        if (params==null) {
	            return;
	        }
	        var now = new Date().getTime();
	        // this is the animation end: set the view to the end position, and call complete callback 
	        if (now>params['end']) {
	            aladin.gotoRaDec(params['raEnd'], params['decEnd']);
	            
	            if (params['complete']) {
	                params['complete']();
	            }
	            
	            return;
	        }
	        
	        // compute current position
	        var fraction =  (now-params['start']) / (params['end'] - params['start']);
	        var curPos = intermediatePoint(params['raStart'], params['decStart'], params['raEnd'], params['decEnd'], fraction);
	        curRa =  curPos[0];
	        curDec = curPos[1];
	        //var curRa =  params['raStart'] + (params['raEnd'] - params['raStart']) * (now-params['start']) / (params['end'] - params['start']);
	        //var curDec = params['decStart'] + (params['decEnd'] - params['decStart']) * (now-params['start']) / (params['end'] - params['start']);
	        
	        aladin.gotoRaDec(curRa, curDec);
	        
	        setTimeout(function() {doAnimation(aladin);}, 50);
	        
	    };
	    /*
	     * animate smoothly from the current position to the given ra, dec
	     * 
	     * the total duration (in seconds) of the animation can be given (otherwise set to 5 seconds by default)
	     * 
	     * complete: a function to call once the animation has completed
	     * 
	     * @API
	     * 
	     */
	    Aladin.prototype.animateToRaDec = function(ra, dec, duration, complete) {
	        duration = duration || 5;
	        
	        this.animationParams = null;
	        
	        var animationParams = {};
	        animationParams['start'] = new Date().getTime();
	        animationParams['end'] = new Date().getTime() + 1000*duration;
	        var raDec = this.getRaDec();
	        animationParams['raStart'] = raDec[0];
	        animationParams['decStart'] = raDec[1];
	        animationParams['raEnd'] = ra;
	        animationParams['decEnd'] = dec;
	        animationParams['complete'] = complete;
	        
	        this.animationParams = animationParams;
	        
	        doAnimation(this);
	    };
	    
	    var doZoomAnimation = function(aladin) {
	        var params = aladin.zoomAnimationParams;
	        if (params==null) {
	            return;
	        }
	        var now = new Date().getTime();
	        // this is the zoom animation end: set the view to the end fov, and call complete callback 
	        if (now>params['end']) {
	            aladin.setFoV(params['fovEnd']);
	            
	            if (params['complete']) {
	                params['complete']();
	            }
	            
	            return;
	        }
	        
	        // compute current position
	        var fraction = (now-params['start']) / (params['end'] - params['start']);
	        var curFov =  params['fovStart'] + (params['fovEnd'] - params['fovStart']) * Math.sqrt(fraction);
	        
	        aladin.setFoV(curFov);
	        
	        setTimeout(function() {doZoomAnimation(aladin);}, 50);
	        
	    };
	    /*
	     * zoom smoothly from the current FoV to the given new fov to the given ra, dec
	     * 
	     * the total duration (in seconds) of the animation can be given (otherwise set to 5 seconds by default)
	     * 
	     * complete: a function to call once the animation has completed
	     * 
	     * @API
	     * 
	     */
	    Aladin.prototype.zoomToFoV = function(fov, duration, complete) {
	        duration = duration || 5;
	        
	        this.zoomAnimationParams = null;
	        
	        var zoomAnimationParams = {};
	        zoomAnimationParams['start'] = new Date().getTime();
	        zoomAnimationParams['end'] = new Date().getTime() + 1000*duration;
	        var fovArray = this.getFov();
	        zoomAnimationParams['fovStart'] = Math.max(fovArray[0], fovArray[1]);
	        zoomAnimationParams['fovEnd'] = fov;
	        zoomAnimationParams['complete'] = complete;
	
	        console.log(zoomAnimationParams);
	        
	        this.zoomAnimationParams = zoomAnimationParams;
	        doZoomAnimation(this);
	    };
	
	
	
	    /**
	     *  Compute intermediate point between points (lng1, lat1) and (lng2, lat2)
	     *  at distance fraction times the total distance (fraction between 0 and 1)
	     *
	     *  Return intermediate points in degrees
	     *
	     */
	    function intermediatePoint(lng1, lat1, lng2, lat2, fraction) {
	        function degToRad(d) {
	            return d * Math.PI / 180;
	        }
	        function radToDeg(r) {
	            return r * 180 / Math.PI;
	        }
	        var lat1=degToRad(lat1);
	        var lng1=degToRad(lng1);
	        var lat2=degToRad(lat2);
	        var lng2=degToRad(lng2);
	        var d = 2 * Math.asin(
	                    Math.sqrt(Math.pow((Math.sin((lat1 - lat2) / 2)),
	                    2) +
	                    Math.cos(lat1) * Math.cos(lat2) *
	                    Math.pow(Math.sin((lng1-lng2) / 2), 2)));
	        var A = Math.sin((1 - fraction) * d) / Math.sin(d);
	        var B = Math.sin(fraction * d) / Math.sin(d);
	        var x = A * Math.cos(lat1) * Math.cos(lng1) + B *
	            Math.cos(lat2) * Math.cos(lng2);
	        var y = A * Math.cos(lat1) * Math.sin(lng1) + B *
	            Math.cos(lat2) * Math.sin(lng2);
	        var z = A * Math.sin(lat1) + B * Math.sin(lat2);
	        var lon = Math.atan2(y, x);
	        var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) +
	             Math.pow(y, 2)));
	
	        return [radToDeg(lon), radToDeg(lat)];
	    };
	
	
	
	    
	    /**
	     * get current [ra, dec] position of the center of the view
	     * 
	     * @API
	     */
	    Aladin.prototype.getRaDec = function() {
	        if (this.view.cooFrame.system==CooFrameEnum.SYSTEMS.J2000) {
	            return [this.view.viewCenter.lon, this.view.viewCenter.lat];
	        }
	        else {
	            var radec = CooConversion.GalacticToJ2000([this.view.viewCenter.lon, this.view.viewCenter.lat]);
	            return radec;
	            
	        }
	    };
	    
	    
	    /**
	     * point to a given position, expressed as a ra,dec coordinate
	     * 
	     * @API
	     */
	    Aladin.prototype.gotoRaDec = function(ra, dec) {
	        this.view.pointTo(ra, dec);
	    };
	
	    Aladin.prototype.showHealpixGrid = function(show) {
	        this.view.showHealpixGrid(show);
	    };
	    
	    Aladin.prototype.showSurvey = function(show) {
	        this.view.showSurvey(show);
	    };
	    Aladin.prototype.showCatalog = function(show) {
	        this.view.showCatalog(show);
	    };
	    Aladin.prototype.showReticle = function(show) {
	        this.view.showReticle(show);
	        $('#displayReticle').attr('checked', show);
	    };
	    Aladin.prototype.removeLayers = function() {
	        this.view.removeLayers();
	    };
	
	    // these 3 methods should be merged into a unique "add" method
	    Aladin.prototype.addCatalog = function(catalog) {
	        this.view.addCatalog(catalog);
	    };
	    Aladin.prototype.addOverlay = function(overlay) {
	        this.view.addOverlay(overlay);
	    };
	    Aladin.prototype.addMOC = function(moc) {
	        this.view.addMOC(moc);
	    };
	    
	
	  
	    // @oldAPI
	    Aladin.prototype.createImageSurvey = function(id, name, rootUrl, cooFrame, maxOrder, options) {
	        return new HpxImageSurvey(id, name, rootUrl, cooFrame, maxOrder, options);        
	    };
	
	
	 
	    // @api
	    Aladin.prototype.getBaseImageLayer = function() {
	        return this.view.imageSurvey;
	    };
	    // @param imageSurvey : HpxImageSurvey object or image survey identifier
	    // @api
	    // @old
	    Aladin.prototype.setImageSurvey = function(imageSurvey, callback) {
	        this.view.setImageSurvey(imageSurvey, callback);
	        this.updateSurveysDropdownList(HpxImageSurvey.getAvailableSurveys());
	        if (this.options.log) {
	            var id = imageSurvey;
	            if (typeof imageSurvey !== "string") {
	                id = imageSurvey.rootUrl;
	            }
	
	            Logger.log("changeImageSurvey", id);
	        }
	    };
	    // @api
	    Aladin.prototype.setBaseImageLayer = Aladin.prototype.setImageSurvey;
	    
	    // @api
	    Aladin.prototype.getOverlayImageLayer = function() {
	        return this.view.overlayImageSurvey;
	    };
	    // @api
	    Aladin.prototype.setOverlayImageLayer = function(imageSurvey, callback) {
	        this.view.setOverlayImageSurvey(imageSurvey, callback);
	    };
	    
	
	    Aladin.prototype.increaseZoom = function(step) {
	        if (!step) {
	            step = 5;
	        }
	    	this.view.setZoomLevel(this.view.zoomLevel+step);
	    };
	    
	    Aladin.prototype.decreaseZoom = function(step) {
	        if (!step) {
	            step = 5;
	        }
	    	this.view.setZoomLevel(this.view.zoomLevel-step);
	    };
	    
	    // @oldAPI
	    Aladin.prototype.createCatalog = function(options) {
	        return A.catalog(options);
	    };
	
	
	    Aladin.prototype.createProgressiveCatalog = function(url, frame, maxOrder, options) {
	        return new ProgressiveCat(url, frame, maxOrder, options);
	    };
	    
	    // @oldAPI
	    Aladin.prototype.createSource = function(ra, dec, data) {
	        return new cds.Source(ra, dec, data);
	    };
	    // @oldAPI
	    Aladin.prototype.createMarker = function(ra, dec, options, data) {
	        options = options || {};
	        options['marker'] = true;
	        return new cds.Source(ra, dec, data, options);
	    };
	
	    Aladin.prototype.createOverlay = function(options) {
	        return new Overlay(options);
	    };
	
	    // @oldAPI
	    Aladin.prototype.createFootprintsFromSTCS = function(stcs) {
	        return A.footprintsFromSTCS(stcs);
	    };
	
	    // API
	    A.footprintsFromSTCS = function(stcs) {
	        var footprints = Overlay.parseSTCS(stcs);
	
	        return footprints;
	    }
	
	    // API
	    A.MOCFromURL = function(url, options, successCallback) {
	        var moc = new MOC(options);
	        moc.dataFromFITSURL(url, successCallback);
	
	        return moc;
	    };
	
	    // API
	    A.MOCFromJSON = function(jsonMOC, options) {
	        var moc = new MOC(options);
	        moc.dataFromJSON(jsonMOC);
	
	        return moc;
	    };
	
	    
	    // @oldAPI
	    Aladin.prototype.createCatalogFromVOTable = function(url, options) {
	        return A.catalogFromURL(url, options);
	    };
	
	    // TODO: try first without proxy, and then with, if param useProxy not set
	    // API
	    A.catalogFromURL = function(url, options, successCallback, useProxy) {
	        var catalog = A.catalog(options);
	        // TODO: should be self-contained in Catalog class
	        cds.Catalog.parseVOTable(url, function(sources) {
	                catalog.addSources(sources);
	                if (successCallback) {
	                    successCallback(sources);
	                }
	            },
	            catalog.maxNbSources, useProxy,
	            catalog.raField, catalog.decField
	        );
	
	        return catalog;
	    };
	
	    // API
	    // @param target: can be either a string representing a position or an object name, or can be an object with keys 'ra' and 'dec' (values being in decimal degrees)
	    A.catalogFromSimbad = function(target, radius, options, successCallback) {
	        options = options || {};
	        if (! ('name' in options)) {
	            options['name'] = 'Simbad';
	        }
	        var url = URLBuilder.buildSimbadCSURL(target, radius);
	        return A.catalogFromURL(url, options, successCallback, false);
	    };
	     
	    // API
	    A.catalogFromNED = function(target, radius, options, successCallback) {
	        options = options || {};
	        if (! ('name' in options)) {
	            options['name'] = 'NED';
	        }
	        var url;
	        if (target && (typeof target  === "object")) {
	            if ('ra' in target && 'dec' in target) {
	                url = URLBuilder.buildNEDPositionCSURL(target.ra, target.dec, radius);
	            }
	        }
	        else {
	    	    var isObjectName = /[a-zA-Z]/.test(target);
	            if (isObjectName)  {
	                url = URLBuilder.buildNEDObjectCSURL(target, radius);
	            }
	            else {
	                var coo = new Coo();
	                coo.parse(target);
	                url = URLBuilder.buildNEDPositionCSURL(coo.lon, coo.lat, radius);
	            }
	        }
	
	        return A.catalogFromURL(url, options, successCallback);
	    };
	
	    // API
	    A.catalogFromVizieR = function(vizCatId, target, radius, options, successCallback) {
	        options = options || {};
	        if (! ('name' in options)) {
	            options['name'] = 'VizieR:' + vizCatId;
	        }
	        var url = URLBuilder.buildVizieRCSURL(vizCatId, target, radius, options);
	
	        return A.catalogFromURL(url, options, successCallback, false);
	    };
	
	    // API
	    A.catalogFromSkyBot = function(ra, dec, radius, epoch, queryOptions, options, successCallback) {
	        queryOptions = queryOptions || {};
	        options = options || {};
	        if (! ('name' in options)) {
	            options['name'] = 'SkyBot';
	        }
	        var url = URLBuilder.buildSkyBotCSURL(ra, dec, radius, epoch, queryOptions);
	        return A.catalogFromURL(url, options, successCallback, false);
	    };
	
	     Aladin.AVAILABLE_CALLBACKS = ['select', 'objectClicked', 'objectHovered', 'footprintClicked', 'footprintHovered', 'positionChanged', 'zoomChanged', 'click', 'mouseMove', 'fullScreenToggled']; 
	     // API
	     //
	     // setting callbacks
	     Aladin.prototype.on = function(what, myFunction) {
	         if (Aladin.AVAILABLE_CALLBACKS.indexOf(what)<0) {
	            return; 
	         }
	
	         this.callbacksByEventName[what] = myFunction;
	     };
	     
	     Aladin.prototype.select = function() {
	         this.fire('selectstart');
	     };
	     
	     Aladin.prototype.fire = function(what, params) {
	         if (what==='selectstart') {
	             this.view.setMode(View.SELECT);
	         }
	         else if (what==='selectend') {
	             this.view.setMode(View.PAN);
	             var callbackFn = this.callbacksByEventName['select'];
	             (typeof callbackFn === 'function') && callbackFn(params);
	         }
	     };
	     
	     Aladin.prototype.hideBoxes = function() {
	         if (this.boxes) {
	             for (var k=0; k<this.boxes.length; k++) {
	                 this.boxes[k].hide();
	             }
	         }
	     };
	     
	     // ?
	     Aladin.prototype.updateCM = function() {
	         
	     };
	     
	     // TODO : LayerBox (or Stack?) must be extracted as a separate object
	     Aladin.prototype.showLayerBox = function() {
	         var self = this;
	         
	         // first, update
	         var layerBox = $(this.aladinDiv).find('.aladin-layerBox');
	         layerBox.empty();
	         layerBox.append('<a class="aladin-closeBtn">&times;</a>' +
	                 '<div style="clear: both;"></div>' +
	                 '<div class="aladin-label">Base image layer</div>' +
	                 '<select class="aladin-surveySelection"></select>' +
	                 '<div class="aladin-cmap">Color map:' +
	                 '<div><select class="aladin-cmSelection"></select><button class="aladin-btn aladin-btn-small aladin-reverseCm" type="button">Reverse</button></div></div>' +
	                 '<div class="aladin-box-separator"></div>' +
	                 '<div class="aladin-label">Overlay layers</div>');
	         
	         var cmDiv = layerBox.find('.aladin-cmap');
	         
	         // fill color maps options
	         var cmSelect = layerBox.find('.aladin-cmSelection');
	         for (var k=0; k<ColorMap.MAPS_NAMES.length; k++) {
	             cmSelect.append($("<option />").text(ColorMap.MAPS_NAMES[k]));
	         }
	         cmSelect.val(self.getBaseImageLayer().getColorMap().mapName);
	
	         
	         // loop over all overlay layers
	         var layers = this.view.allOverlayLayers;
	         var str = '<ul>';
	         for (var k=layers.length-1; k>=0; k--) {
	             var layer = layers[k];
	             var name = layer.name;
	             var checked = '';
	             if (layer.isShowing) {
	                 checked = 'checked="checked"';
	             }
	
	             var tooltipText = '';
	             var iconSvg = '';
	             if (layer.type=='catalog' || layer.type=='progressivecat') {
	                var nbSources = layer.getSources().length;
	                tooltipText = nbSources + ' source' + ( nbSources>1 ? 's' : '');
	
	                iconSvg = AladinUtils.SVG_ICONS.CATALOG;
	            }
	            else if (layer.type=='moc') {
	                tooltipText = 'Coverage: ' + (100*layer.skyFraction()).toFixed(3) + ' % of sky';
	
	                iconSvg = AladinUtils.SVG_ICONS.MOC;
	            }
	            else if (layer.type=='overlay') {
	                iconSvg = AladinUtils.SVG_ICONS.OVERLAY;
	            }
	
	             var rgbColor = $('<div></div>').css('color', layer.color).css('color'); // trick to retrieve the color as 'rgb(,,)' - does not work for named colors :(
	             var labelColor = Color.getLabelColorForBackground(rgbColor);
	
	             // retrieve SVG icon, and apply the layer color
	             var svgBase64 = window.btoa(iconSvg.replace(/FILLCOLOR/g, layer.color));
	             str += '<li><div class="aladin-stack-icon" style=\'background-image: url("data:image/svg+xml;base64,' + svgBase64 + '");\'></div>';
	            str += '<input type="checkbox" ' + checked + ' id="aladin_lite_' + name + '"></input><label for="aladin_lite_' + name + '" class="aladin-layer-label" style="background: ' + layer.color + '; color:' + labelColor + ';" title="' + tooltipText + '">' + name + '</label></li>';
	         }
	         str += '</ul>';
	         layerBox.append(str);
	         
	         layerBox.append('<div class="aladin-blank-separator"></div>');
	         
	         // gestion du réticule
	         var checked = '';
	         if (this.view.displayReticle) {
	             checked = 'checked="checked"';
	         }
	         var reticleCb = $('<input type="checkbox" ' + checked + ' id="displayReticle" />');
	         layerBox.append(reticleCb).append('<label for="displayReticle">Reticle</label><br/>');
	         reticleCb.change(function() {
	             self.showReticle($(this).is(':checked'));
	         });
	         
	         // Gestion grille Healpix
	         checked = '';
	         if (this.view.displayHpxGrid) {
	             checked = 'checked="checked"';
	         }
	         var hpxGridCb = $('<input type="checkbox" ' + checked + ' id="displayHpxGrid"/>');
	         layerBox.append(hpxGridCb).append('<label for="displayHpxGrid">HEALPix grid</label><br/>');
	         hpxGridCb.change(function() {
	             self.showHealpixGrid($(this).is(':checked'));
	         });
	         
	         
	         layerBox.append('<div class="aladin-box-separator"></div>' +
	              '<div class="aladin-label">Tools</div>');
	         var exportBtn = $('<button class="aladin-btn" type="button">Export view as PNG</button>');
	         layerBox.append(exportBtn);
	         exportBtn.click(function() {
	             self.exportAsPNG();
	         });
	                 
	                 /*
	                 '<div class="aladin-box-separator"></div>' +
	                 '<div class="aladin-label">Projection</div>' +
	                 '<select id="projectionChoice"><option>SINUS</option><option>AITOFF</option></select><br/>'
	                 */
	
	         layerBox.find('.aladin-closeBtn').click(function() {self.hideBoxes();return false;});
	         
	         // update list of surveys
	         this.updateSurveysDropdownList(HpxImageSurvey.getAvailableSurveys());
	         var surveySelection = $(this.aladinDiv).find('.aladin-surveySelection');
	         surveySelection.change(function() {
	             var survey = HpxImageSurvey.getAvailableSurveys()[$(this)[0].selectedIndex];
	             self.setImageSurvey(survey.id, function() {
	                 var baseImgLayer = self.getBaseImageLayer();
	                 
	                 if (baseImgLayer.useCors) {
	                     // update color map list with current value color map
	                     cmSelect.val(baseImgLayer.getColorMap().mapName);
	                     cmDiv.show();
	                     
	                     exportBtn.show();
	                 }
	                 else {
	                     cmDiv.hide();
	                     
	                     exportBtn.hide();
	                 }
	             });
	
	             
	             
	         });
	         
	         //// COLOR MAP management ////////////////////////////////////////////
	         // update color map
	         cmDiv.find('.aladin-cmSelection').change(function() {
	             var cmName = $(this).find(':selected').val();
	             self.getBaseImageLayer().getColorMap().update(cmName);
	         });
	         
	         // reverse color map
	         cmDiv.find('.aladin-reverseCm').click(function() {
	             self.getBaseImageLayer().getColorMap().reverse(); 
	         });
	         if (this.getBaseImageLayer().useCors) {
	             cmDiv.show();
	             exportBtn.show();
	         }
	         else {
	             cmDiv.hide();
	             exportBtn.hide();
	         }
	         layerBox.find('.aladin-reverseCm').parent().attr('disabled', true);
	         //////////////////////////////////////////////////////////////////////
	         
	         
	         // handler to hide/show overlays
	         $(this.aladinDiv).find('.aladin-layerBox ul input').change(function() {
	             var layerName = ($(this).attr('id').substr(12));
	             var layer = self.layerByName(layerName);
	             if ($(this).is(':checked')) {
	                 layer.show();
	             }
	             else {
	                 layer.hide();
	             }
	         });
	         
	         // finally show
	         layerBox.show();
	         
	     };
	     
	     Aladin.prototype.layerByName = function(name) {
	         var c = this.view.allOverlayLayers;
	         for (var k=0; k<c.length; k++) {
	             if (name==c[k].name) {
	                 return c[k];
	             }
	         }
	         return null;
	     };
	     
	     // TODO : integrate somehow into API ?
	     Aladin.prototype.exportAsPNG = function(imgFormat) {
	         var w = window.open();
	         w.document.write('<img src="' + this.getViewDataURL() + '">');
	         w.document.title = 'Aladin Lite snapshot';
	     };
	
	    /**
	     * Return the current view as a data URL (base64-formatted string)
	     * Parameters:
	     * - options (optional): object with attributs
	     *     * format (optional): 'image/png' or 'image/jpeg'
	     *     * width: width in pixels of the image to output
	     *     * height: height in pixels of the image to output
	     *
	     * @API
	    */
	    Aladin.prototype.getViewDataURL = function(options) {
	        var options = options || {};
	        // support for old API signature
	        if (typeof options !== 'object') {
	            var imgFormat = options;
	            options = {format: imgFormat};
	        }
	
	        return this.view.getCanvasDataURL(options.format, options.width, options.height);
	    }
	     
	     /** restrict FOV range
	      * @API
	      * @param minFOV in degrees when zoom in at max
	      * @param maxFOV in degreen when zoom out at max
	     */
	     Aladin.prototype.setFovRange = Aladin.prototype.setFOVRange = function(minFOV, maxFOV) {
	         if (minFOV>maxFOV) {
	             var tmp = minFOV;
	             minFOV = maxFOV;
	             maxFOV = tmp;
	         }
	         
	         this.view.minFOV = minFOV;
	         this.view.maxFOV = maxFOV;
	         
	     };
	     
	     /**
	      * Transform pixel coordinates to world coordinates
	      * 
	      * Origin (0,0) of pixel coordinates is at top left corner of Aladin Lite view
	      * 
	      * @API
	      * 
	      * @param x
	      * @param y
	      * 
	      * @return a [ra, dec] array with world coordinates in degrees. Returns undefined is something went wrong
	      * 
	      */
	     Aladin.prototype.pix2world = function(x, y) {
	         // this might happen at early stage of initialization
	         if (!this.view) {
	            return undefined;
	         }
	
	         var xy = AladinUtils.viewToXy(x, y, this.view.width, this.view.height, this.view.largestDim, this.view.zoomFactor);
	         
	         var radec;
	         try {
	            radec = this.view.projection.unproject(xy.x, xy.y);
	         }
	         catch(e) {
	            return undefined;
	         }
	         
	         var res;
	         if (this.view.cooFrame==CooFrameEnum.GAL) {
	             res = CooConversion.GalacticToJ2000([radec.ra, radec.dec]);
	         }
	         else {
	             res =  [radec.ra, radec.dec];
	         }
	             
	         return res;
	     };
	     
	     /**
	      * Transform world coordinates to pixel coordinates in the view
	      * 
	      * @API
	      * 
	      * @param ra  
	      * @param dec
	      * 
	      * @return a [x, y] array with pixel coordinates in the view. Returns null if the projection failed somehow
	      *   
	      */
	     Aladin.prototype.world2pix = function(ra, dec) {
	         // this might happen at early stage of initialization
	         if (!this.view) {
	            return;
	         }
	
	         var xy;
	         if (this.view.cooFrame==CooFrameEnum.GAL) {
	             var lonlat = CooConversion.J2000ToGalactic([ra, dec]);
	             xy = this.view.projection.project(lonlat[0], lonlat[1]);
	         }
	         else {
	             xy = this.view.projection.project(ra, dec);
	         }
	         if (xy) {
	             var xyview = AladinUtils.xyToView(xy.X, xy.Y, this.view.width, this.view.height, this.view.largestDim, this.view.zoomFactor);
	             return [xyview.vx, xyview.vy];
	         }
	         else {
	             return null;
	         }
	     };
	     
	     /**
	      * 
	      * @API
	      * 
	      * @param ra  
	      * @param nbSteps the number of points to return along each side (the total number of points returned is 4*nbSteps)
	      * 
	      * @return set of points along the current FoV with the following format: [[ra1, dec1], [ra2, dec2], ..., [ra_n, dec_n]]
	      *   
	      */
	     Aladin.prototype.getFovCorners = function(nbSteps) {
	         // default value: 1
	         if (!nbSteps || nbSteps<1) {
	             nbSteps = 1;
	         }
	         
	         var points = [];
	         var x1, y1, x2, y2;
	         for (var k=0; k<4; k++) {
	             x1 = (k==0 || k==3) ? 0 : this.view.width-1;
	             y1 = (k<2) ? 0 : this.view.height-1;
	             x2 = (k<2) ? this.view.width-1 : 0;
	             y2 = (k==1 || k==2) ? this.view.height-1 :0;
	             
	             for (var step=0; step<nbSteps; step++) {
	                 points.push(this.pix2world(x1 + step/nbSteps * (x2-x1), y1 + step/nbSteps * (y2-y1)));
	             }
	         }
	         
	         return points;
	         
	     };
	     
	     /**
	      * @API
	      * 
	      * @return the current FoV size in degrees as a 2-elements array
	      */
	     Aladin.prototype.getFov = function() {
	         var fovX = this.view.fov;
	         var s = this.getSize();
	         var fovY = s[1] / s[0] * fovX;
	         // TODO : take into account AITOFF projection where fov can be larger than 180
	         fovX = Math.min(fovX, 180);
	         fovY = Math.min(fovY, 180);
	         
	         return [fovX, fovY];
	     };
	     
	     /**
	      * @API
	      * 
	      * @return the size in pixels of the Aladin Lite view
	      */
	     Aladin.prototype.getSize = function() {
	         return [this.view.width, this.view.height];
	     };
	     
	     /**
	      * @API
	      * 
	      * @return the jQuery object representing the DIV element where the Aladin Lite instance lies
	      */
	     Aladin.prototype.getParentDiv = function() {
	         return $(this.aladinDiv);
	     };
	    
		return Aladin;
	})();
	
	//// New API ////
	// For developers using Aladin lite: all objects should be created through the API, 
	// rather than creating directly the corresponding JS objects
	// This facade allows for more flexibility as objects can be updated/renamed harmlessly
	
	//@API
	A.aladin = function(divSelector, options) {
	  return new Aladin($(divSelector)[0], options);
	};
	
	//@API
	// TODO : lecture de properties
	A.imageLayer = function(id, name, rootUrl, options) {
	    return new HpxImageSurvey(id, name, rootUrl, null, null, options);
	};
	
	// @API
	A.source = function(ra, dec, data, options) {
	    return new cds.Source(ra, dec, data, options);
	};
	
	// @API
	A.marker = function(ra, dec, options, data) {
	    options = options || {};
	    options['marker'] = true;
	    return A.source(ra, dec, data, options);
	};
	
	// @API
	A.polygon = function(raDecArray) {
	    var l = raDecArray.length;
	    if (l>0) {
	        // close the polygon if needed
	        if (raDecArray[0][0]!=raDecArray[l-1][0] || raDecArray[0][1]!=raDecArray[l-1][1]) {
	            raDecArray.push([raDecArray[0][0], raDecArray[0][1]]);
	        }
	    }
	    return new Footprint(raDecArray);
	};
	
	//@API
	A.polyline = function(raDecArray, options) {
	    return new Polyline(raDecArray, options);
	};
	
	
	// @API
	A.circle = function(ra, dec, radiusDeg, options) {
	    return new Circle([ra, dec], radiusDeg, options);
	};
	
	// @API
	A.graphicOverlay = function(options) {
	    return new Overlay(options);
	};
	
	// @API
	A.catalog = function(options) {
	    return new cds.Catalog(options);
	};
	
	// @API
	A.catalogHiPS = function(rootURL, options) {
	    return new ProgressiveCat(rootURL, null, null, options);
	};
	
	// @API
	/*
	 * return a Box GUI element to insert content
	 */
	Aladin.prototype.box = function(options) {
	    var box = new Box(options);
	    box.$parentDiv.appendTo(this.aladinDiv);
	
	    return box;
	};
	
	// @API
	/*
	 * show popup at ra, dec position with given title and content
	 */
	Aladin.prototype.showPopup = function(ra, dec, title, content) {
	    this.view.catalogForPopup.removeAll();
	    var marker = A.marker(ra, dec, {popupTitle: title, popupDesc: content, useMarkerDefaultIcon: false});
	    this.view.catalogForPopup.addSources(marker);
	    this.view.catalogForPopup.show();
	
	    this.view.popup.setTitle(title);
	    this.view.popup.setText(content);
	    this.view.popup.setSource(marker);
	    this.view.popup.show();
	};
	
	// @API
	/*
	 * hide popup
	 */
	Aladin.prototype.hidePopup = function() {
	    this.view.popup.hide();
	};
	
	// @API
	/*
	 * return a URL allowing to share the current view
	 */
	Aladin.prototype.getShareURL = function() {
	    var radec = this.getRaDec();
	    var coo = new Coo();
	    coo.prec = 7;
	    coo.lon = radec[0];
	    coo.lat = radec[1];
	
	    return 'http://aladin.unistra.fr/AladinLite/?target=' + encodeURIComponent(coo.format('s')) +
	           '&fov=' + this.getFov()[0].toFixed(2) + '&survey=' + encodeURIComponent(this.getBaseImageLayer().id || this.getBaseImageLayer().rootUrl);
	};
	
	// @API
	/*
	 * return, as a string, the HTML embed code
	 */
	Aladin.prototype.getEmbedCode = function() {
	    var radec = this.getRaDec();
	    var coo = new Coo();
	    coo.prec = 7;
	    coo.lon = radec[0];
	    coo.lat = radec[1];
	
	    var survey = this.getBaseImageLayer().id;
	    var fov = this.getFov()[0];
	    var s = '';
	    s += '<link rel="stylesheet" href="http://aladin.unistra.fr/AladinLite/api/v2/latest/aladin.min.css" />\n';
	    s += '<script type="text/javascript" src="//code.jquery.com/jquery-1.9.1.min.js" charset="utf-8"></script>\n';
	    s += '<div id="aladin-lite-div" style="width:400px;height:400px;"></div>\n';
	    s += '<script type="text/javascript" src="http://aladin.unistra.fr/AladinLite/api/v2/latest/aladin.min.js" charset="utf-8"></script>\n';
	    s += '<script type="text/javascript">\n';
	    s += 'var aladin = A.aladin("#aladin-lite-div", {survey: "' + survey + 'P/DSS2/color", fov: ' + fov.toFixed(2) + ', target: "' + coo.format('s') + '"});\n';
	    s += '</script>';
	    return s;
	};
	
	// @API
	/*
	 * Creates remotely a HiPS from a FITS image URL and displays it
	 */
	Aladin.prototype.displayFITS = function(url, options, successCallback, errorCallback) {
	    options = options || {};
	    var data = {url: url};
	    if (options.color) {
	        data.color = true;
	    }
	    if (options.outputFormat) {
	        data.format = options.outputFormat;
	    }
	    if (options.order) {
	        data.order = options.order;
	    }
	    if (options.nocache) {
	        data.nocache = options.nocache;
	    }
	    var self = this;
	    $.ajax({
	        url: 'https://alasky.unistra.fr/cgi/fits2HiPS',
	        data: data,
	        method: 'GET',
	        dataType: 'json',
	        success: function(response) {
	            if (response.status!='success') {
	                console.error('An error occured: ' + response.message);
	                if (errorCallback) {
	                    errorCallback(response.message);
	                }
	                return;
	            }
	            var label = options.label || "FITS image"; 
	            var meta = response.data.meta;
	            self.setOverlayImageLayer(self.createImageSurvey(label, label, response.data.url, "equatorial", meta.max_norder, {imgFormat: 'png'}));
	            var transparency = (options && options.transparency) || 1.0;
	            self.getOverlayImageLayer().setAlpha(transparency);
	
	            var executeDefaultSuccessAction = true;
	            if (successCallback) {
	                executeDefaultSuccessAction = successCallback(meta.ra, meta.dec, meta.fov);
	            }
	            if (executeDefaultSuccessAction===true) {
	                self.gotoRaDec(meta.ra, meta.dec);
	                self.setFoV(meta.fov);
	            }
	
	        }
	    });
	
	};
	
	// @API
	/*
	 * Creates remotely a HiPS from a JPEG or PNG image with astrometry info
	 * and display it
	 */
	Aladin.prototype.displayJPG = Aladin.prototype.displayPNG = function(url, options, successCallback, errorCallback) {
	    options = options || {};
	    options.color = true;
	    options.label = "JPG/PNG image";
	    options.outputFormat = 'png';
	    this.displayFITS(url, options, successCallback, errorCallback);
	};
	
	Aladin.prototype.setReduceDeformations = function(reduce) {
	    this.reduceDeformations = reduce;
	    this.view.requestRedraw();
	}
	
	
	
	// conservé pour compatibilité avec existant
	// @oldAPI
	if ($) {
	    $.aladin = A.aladin;
	}
	
	// TODO: callback function onAladinLiteReady
	
	
	
	module.exports = {
	    A: A
	};
	var astro = this.astro;
	


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define('underscore', factory) :
	  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
	    var current = global._;
	    var exports = global._ = factory();
	    exports.noConflict = function () { global._ = current; return exports; };
	  }()));
	}(this, (function () {
	  //     Underscore.js 1.13.4
	  //     https://underscorejs.org
	  //     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
	  //     Underscore may be freely distributed under the MIT license.
	
	  // Current version.
	  var VERSION = '1.13.4';
	
	  // Establish the root object, `window` (`self`) in the browser, `global`
	  // on the server, or `this` in some virtual machines. We use `self`
	  // instead of `window` for `WebWorker` support.
	  var root = (typeof self == 'object' && self.self === self && self) ||
	            (typeof global == 'object' && global.global === global && global) ||
	            Function('return this')() ||
	            {};
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
	  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var push = ArrayProto.push,
	      slice = ArrayProto.slice,
	      toString = ObjProto.toString,
	      hasOwnProperty = ObjProto.hasOwnProperty;
	
	  // Modern feature detection.
	  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
	      supportsDataView = typeof DataView !== 'undefined';
	
	  // All **ECMAScript 5+** native function implementations that we hope to use
	  // are declared here.
	  var nativeIsArray = Array.isArray,
	      nativeKeys = Object.keys,
	      nativeCreate = Object.create,
	      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
	
	  // Create references to these builtin functions because we override them.
	  var _isNaN = isNaN,
	      _isFinite = isFinite;
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  // The largest integer that can be represented exactly.
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	
	  // Some functions take a variable number of arguments, or a few expected
	  // arguments at the beginning and then a variable number of values to operate
	  // on. This helper accumulates all remaining arguments past the function’s
	  // argument length (or an explicit `startIndex`), into an array that becomes
	  // the last argument. Similar to ES6’s "rest parameter".
	  function restArguments(func, startIndex) {
	    startIndex = startIndex == null ? func.length - 1 : +startIndex;
	    return function() {
	      var length = Math.max(arguments.length - startIndex, 0),
	          rest = Array(length),
	          index = 0;
	      for (; index < length; index++) {
	        rest[index] = arguments[index + startIndex];
	      }
	      switch (startIndex) {
	        case 0: return func.call(this, rest);
	        case 1: return func.call(this, arguments[0], rest);
	        case 2: return func.call(this, arguments[0], arguments[1], rest);
	      }
	      var args = Array(startIndex + 1);
	      for (index = 0; index < startIndex; index++) {
	        args[index] = arguments[index];
	      }
	      args[startIndex] = rest;
	      return func.apply(this, args);
	    };
	  }
	
	  // Is a given variable an object?
	  function isObject(obj) {
	    var type = typeof obj;
	    return type === 'function' || (type === 'object' && !!obj);
	  }
	
	  // Is a given value equal to null?
	  function isNull(obj) {
	    return obj === null;
	  }
	
	  // Is a given variable undefined?
	  function isUndefined(obj) {
	    return obj === void 0;
	  }
	
	  // Is a given value a boolean?
	  function isBoolean(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  }
	
	  // Is a given value a DOM element?
	  function isElement(obj) {
	    return !!(obj && obj.nodeType === 1);
	  }
	
	  // Internal function for creating a `toString`-based type tester.
	  function tagTester(name) {
	    var tag = '[object ' + name + ']';
	    return function(obj) {
	      return toString.call(obj) === tag;
	    };
	  }
	
	  var isString = tagTester('String');
	
	  var isNumber = tagTester('Number');
	
	  var isDate = tagTester('Date');
	
	  var isRegExp = tagTester('RegExp');
	
	  var isError = tagTester('Error');
	
	  var isSymbol = tagTester('Symbol');
	
	  var isArrayBuffer = tagTester('ArrayBuffer');
	
	  var isFunction = tagTester('Function');
	
	  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
	  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
	  var nodelist = root.document && root.document.childNodes;
	  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	    isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  var isFunction$1 = isFunction;
	
	  var hasObjectTag = tagTester('Object');
	
	  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
	  // In IE 11, the most common among them, this problem also applies to
	  // `Map`, `WeakMap` and `Set`.
	  var hasStringTagBug = (
	        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
	      ),
	      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));
	
	  var isDataView = tagTester('DataView');
	
	  // In IE 10 - Edge 13, we need a different heuristic
	  // to determine whether an object is a `DataView`.
	  function ie10IsDataView(obj) {
	    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
	  }
	
	  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native `Array.isArray`.
	  var isArray = nativeIsArray || tagTester('Array');
	
	  // Internal function to check whether `key` is an own property name of `obj`.
	  function has$1(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  }
	
	  var isArguments = tagTester('Arguments');
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  (function() {
	    if (!isArguments(arguments)) {
	      isArguments = function(obj) {
	        return has$1(obj, 'callee');
	      };
	    }
	  }());
	
	  var isArguments$1 = isArguments;
	
	  // Is a given object a finite number?
	  function isFinite$1(obj) {
	    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
	  }
	
	  // Is the given value `NaN`?
	  function isNaN$1(obj) {
	    return isNumber(obj) && _isNaN(obj);
	  }
	
	  // Predicate-generating function. Often useful outside of Underscore.
	  function constant(value) {
	    return function() {
	      return value;
	    };
	  }
	
	  // Common internal logic for `isArrayLike` and `isBufferLike`.
	  function createSizePropertyCheck(getSizeProperty) {
	    return function(collection) {
	      var sizeProperty = getSizeProperty(collection);
	      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
	    }
	  }
	
	  // Internal helper to generate a function to obtain property `key` from `obj`.
	  function shallowProperty(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  }
	
	  // Internal helper to obtain the `byteLength` property of an object.
	  var getByteLength = shallowProperty('byteLength');
	
	  // Internal helper to determine whether we should spend extensive checks against
	  // `ArrayBuffer` et al.
	  var isBufferLike = createSizePropertyCheck(getByteLength);
	
	  // Is a given value a typed array?
	  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
	  function isTypedArray(obj) {
	    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
	    // Otherwise, fall back on the above regular expression.
	    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
	                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
	  }
	
	  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);
	
	  // Internal helper to obtain the `length` property of an object.
	  var getLength = shallowProperty('length');
	
	  // Internal helper to create a simple lookup structure.
	  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
	  // circular imports. `emulatedSet` is a one-off solution that only works for
	  // arrays of strings.
	  function emulatedSet(keys) {
	    var hash = {};
	    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
	    return {
	      contains: function(key) { return hash[key] === true; },
	      push: function(key) {
	        hash[key] = true;
	        return keys.push(key);
	      }
	    };
	  }
	
	  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
	  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
	  // needed.
	  function collectNonEnumProps(obj, keys) {
	    keys = emulatedSet(keys);
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`.
	  function keys(obj) {
	    if (!isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (has$1(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  }
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  function isEmpty(obj) {
	    if (obj == null) return true;
	    // Skip the more expensive `toString`-based type checks if `obj` has no
	    // `.length`.
	    var length = getLength(obj);
	    if (typeof length == 'number' && (
	      isArray(obj) || isString(obj) || isArguments$1(obj)
	    )) return length === 0;
	    return getLength(keys(obj)) === 0;
	  }
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  function isMatch(object, attrs) {
	    var _keys = keys(attrs), length = _keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = _keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  }
	
	  // If Underscore is called as a function, it returns a wrapped object that can
	  // be used OO-style. This wrapper holds altered versions of all functions added
	  // through `_.mixin`. Wrapped objects may be chained.
	  function _$1(obj) {
	    if (obj instanceof _$1) return obj;
	    if (!(this instanceof _$1)) return new _$1(obj);
	    this._wrapped = obj;
	  }
	
	  _$1.VERSION = VERSION;
	
	  // Extracts the result from a wrapped and chained object.
	  _$1.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxies for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
	
	  _$1.prototype.toString = function() {
	    return String(this._wrapped);
	  };
	
	  // Internal function to wrap or shallow-copy an ArrayBuffer,
	  // typed array or DataView to a new view, reusing the buffer.
	  function toBufferView(bufferSource) {
	    return new Uint8Array(
	      bufferSource.buffer || bufferSource,
	      bufferSource.byteOffset || 0,
	      getByteLength(bufferSource)
	    );
	  }
	
	  // We use this string twice, so give it a name for minification.
	  var tagDataView = '[object DataView]';
	
	  // Internal recursive comparison function for `_.isEqual`.
	  function eq(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // `null` or `undefined` only equal to itself (strict comparison).
	    if (a == null || b == null) return false;
	    // `NaN`s are equivalent, but non-reflexive.
	    if (a !== a) return b !== b;
	    // Exhaust primitive checks
	    var type = typeof a;
	    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	    return deepEq(a, b, aStack, bStack);
	  }
	
	  // Internal recursive comparison function for `_.isEqual`.
	  function deepEq(a, b, aStack, bStack) {
	    // Unwrap any wrapped objects.
	    if (a instanceof _$1) a = a._wrapped;
	    if (b instanceof _$1) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    // Work around a bug in IE 10 - Edge 13.
	    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
	      if (!isDataView$1(b)) return false;
	      className = tagDataView;
	    }
	    switch (className) {
	      // These types are compared by value.
	      case '[object RegExp]':
	        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN.
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	      case '[object Symbol]':
	        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	      case '[object ArrayBuffer]':
	      case tagDataView:
	        // Coerce to typed array so we can fall through.
	        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays && isTypedArray$1(a)) {
	        var byteLength = getByteLength(a);
	        if (byteLength !== getByteLength(b)) return false;
	        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
	        areArrays = true;
	    }
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
	                               isFunction$1(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var _keys = keys(a), key;
	      length = _keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = _keys[length];
	        if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  }
	
	  // Perform a deep comparison to check if two objects are equal.
	  function isEqual(a, b) {
	    return eq(a, b);
	  }
	
	  // Retrieve all the enumerable property names of an object.
	  function allKeys(obj) {
	    if (!isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  }
	
	  // Since the regular `Object.prototype.toString` type tests don't work for
	  // some types in IE 11, we use a fingerprinting heuristic instead, based
	  // on the methods. It's not great, but it's the best we got.
	  // The fingerprint method lists are defined below.
	  function ie11fingerprint(methods) {
	    var length = getLength(methods);
	    return function(obj) {
	      if (obj == null) return false;
	      // `Map`, `WeakMap` and `Set` have no enumerable keys.
	      var keys = allKeys(obj);
	      if (getLength(keys)) return false;
	      for (var i = 0; i < length; i++) {
	        if (!isFunction$1(obj[methods[i]])) return false;
	      }
	      // If we are testing against `WeakMap`, we need to ensure that
	      // `obj` doesn't have a `forEach` method in order to distinguish
	      // it from a regular `Map`.
	      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
	    };
	  }
	
	  // In the interest of compact minification, we write
	  // each string in the fingerprints only once.
	  var forEachName = 'forEach',
	      hasName = 'has',
	      commonInit = ['clear', 'delete'],
	      mapTail = ['get', hasName, 'set'];
	
	  // `Map`, `WeakMap` and `Set` each have slightly different
	  // combinations of the above sublists.
	  var mapMethods = commonInit.concat(forEachName, mapTail),
	      weakMapMethods = commonInit.concat(mapTail),
	      setMethods = ['add'].concat(commonInit, forEachName, hasName);
	
	  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');
	
	  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');
	
	  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');
	
	  var isWeakSet = tagTester('WeakSet');
	
	  // Retrieve the values of an object's properties.
	  function values(obj) {
	    var _keys = keys(obj);
	    var length = _keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[_keys[i]];
	    }
	    return values;
	  }
	
	  // Convert an object into a list of `[key, value]` pairs.
	  // The opposite of `_.object` with one argument.
	  function pairs(obj) {
	    var _keys = keys(obj);
	    var length = _keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [_keys[i], obj[_keys[i]]];
	    }
	    return pairs;
	  }
	
	  // Invert the keys and values of an object. The values must be serializable.
	  function invert(obj) {
	    var result = {};
	    var _keys = keys(obj);
	    for (var i = 0, length = _keys.length; i < length; i++) {
	      result[obj[_keys[i]]] = _keys[i];
	    }
	    return result;
	  }
	
	  // Return a sorted list of the function names available on the object.
	  function functions(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (isFunction$1(obj[key])) names.push(key);
	    }
	    return names.sort();
	  }
	
	  // An internal function for creating assigner functions.
	  function createAssigner(keysFunc, defaults) {
	    return function(obj) {
	      var length = arguments.length;
	      if (defaults) obj = Object(obj);
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!defaults || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  }
	
	  // Extend a given object with all the properties in passed-in object(s).
	  var extend = createAssigner(allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in
	  // object(s).
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  var extendOwn = createAssigner(keys);
	
	  // Fill in a given object with default properties.
	  var defaults = createAssigner(allKeys, true);
	
	  // Create a naked function reference for surrogate-prototype-swapping.
	  function ctor() {
	    return function(){};
	  }
	
	  // An internal function for creating a new object that inherits from another.
	  function baseCreate(prototype) {
	    if (!isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    var Ctor = ctor();
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  }
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  function create(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) extendOwn(result, props);
	    return result;
	  }
	
	  // Create a (shallow-cloned) duplicate of an object.
	  function clone(obj) {
	    if (!isObject(obj)) return obj;
	    return isArray(obj) ? obj.slice() : extend({}, obj);
	  }
	
	  // Invokes `interceptor` with the `obj` and then returns `obj`.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  function tap(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  }
	
	  // Normalize a (deep) property `path` to array.
	  // Like `_.iteratee`, this function can be customized.
	  function toPath$1(path) {
	    return isArray(path) ? path : [path];
	  }
	  _$1.toPath = toPath$1;
	
	  // Internal wrapper for `_.toPath` to enable minification.
	  // Similar to `cb` for `_.iteratee`.
	  function toPath(path) {
	    return _$1.toPath(path);
	  }
	
	  // Internal function to obtain a nested property in `obj` along `path`.
	  function deepGet(obj, path) {
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      if (obj == null) return void 0;
	      obj = obj[path[i]];
	    }
	    return length ? obj : void 0;
	  }
	
	  // Get the value of the (deep) property on `path` from `object`.
	  // If any property in `path` does not exist or if the value is
	  // `undefined`, return `defaultValue` instead.
	  // The `path` is normalized through `_.toPath`.
	  function get(object, path, defaultValue) {
	    var value = deepGet(object, toPath(path));
	    return isUndefined(value) ? defaultValue : value;
	  }
	
	  // Shortcut function for checking if an object has a given property directly on
	  // itself (in other words, not on a prototype). Unlike the internal `has`
	  // function, this public version can also traverse nested properties.
	  function has(obj, path) {
	    path = toPath(path);
	    var length = path.length;
	    for (var i = 0; i < length; i++) {
	      var key = path[i];
	      if (!has$1(obj, key)) return false;
	      obj = obj[key];
	    }
	    return !!length;
	  }
	
	  // Keep the identity function around for default iteratees.
	  function identity(value) {
	    return value;
	  }
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  function matcher(attrs) {
	    attrs = extendOwn({}, attrs);
	    return function(obj) {
	      return isMatch(obj, attrs);
	    };
	  }
	
	  // Creates a function that, when passed an object, will traverse that object’s
	  // properties down the given `path`, specified as an array of keys or indices.
	  function property(path) {
	    path = toPath(path);
	    return function(obj) {
	      return deepGet(obj, path);
	    };
	  }
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  function optimizeCb(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      // The 2-argument case is omitted because we’re not using it.
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  }
	
	  // An internal function to generate callbacks that can be applied to each
	  // element in a collection, returning the desired result — either `_.identity`,
	  // an arbitrary callback, a property matcher, or a property accessor.
	  function baseIteratee(value, context, argCount) {
	    if (value == null) return identity;
	    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
	    if (isObject(value) && !isArray(value)) return matcher(value);
	    return property(value);
	  }
	
	  // External wrapper for our callback generator. Users may customize
	  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
	  // This abstraction hides the internal-only `argCount` argument.
	  function iteratee(value, context) {
	    return baseIteratee(value, context, Infinity);
	  }
	  _$1.iteratee = iteratee;
	
	  // The function we call internally to generate a callback. It invokes
	  // `_.iteratee` if overridden, otherwise `baseIteratee`.
	  function cb(value, context, argCount) {
	    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
	    return baseIteratee(value, context, argCount);
	  }
	
	  // Returns the results of applying the `iteratee` to each element of `obj`.
	  // In contrast to `_.map` it returns an object.
	  function mapObject(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var _keys = keys(obj),
	        length = _keys.length,
	        results = {};
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys[index];
	      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  }
	
	  // Predicate-generating function. Often useful outside of Underscore.
	  function noop(){}
	
	  // Generates a function for a given object that returns a given property.
	  function propertyOf(obj) {
	    if (obj == null) return noop;
	    return function(path) {
	      return get(obj, path);
	    };
	  }
	
	  // Run a function **n** times.
	  function times(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  }
	
	  // Return a random integer between `min` and `max` (inclusive).
	  function random(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  }
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  var now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	  // Internal helper to generate functions for escaping and unescaping strings
	  // to/from HTML interpolation.
	  function createEscaper(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped.
	    var source = '(?:' + keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  }
	
	  // Internal list of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	
	  // Function for escaping strings to HTML interpolation.
	  var _escape = createEscaper(escapeMap);
	
	  // Internal list of HTML entities for unescaping.
	  var unescapeMap = invert(escapeMap);
	
	  // Function for unescaping strings from HTML interpolation.
	  var _unescape = createEscaper(unescapeMap);
	
	  // By default, Underscore uses ERB-style template delimiters. Change the
	  // following template settings to use alternative delimiters.
	  var templateSettings = _$1.templateSettings = {
	    evaluate: /<%([\s\S]+?)%>/g,
	    interpolate: /<%=([\s\S]+?)%>/g,
	    escape: /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `_.templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'": "'",
	    '\\': '\\',
	    '\r': 'r',
	    '\n': 'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  function escapeChar(match) {
	    return '\\' + escapes[match];
	  }
	
	  // In order to prevent third-party code injection through
	  // `_.templateSettings.variable`, we test it against the following regular
	  // expression. It is intentionally a bit more liberal than just matching valid
	  // identifiers, but still prevents possible loopholes through defaults or
	  // destructuring assignment.
	  var bareIdentifier = /^\s*(\w|\$)+\s*$/;
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  function template(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = defaults({}, settings, _$1.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offset.
	      return match;
	    });
	    source += "';\n";
	
	    var argument = settings.variable;
	    if (argument) {
	      // Insure against third-party code injection. (CVE-2021-23358)
	      if (!bareIdentifier.test(argument)) throw new Error(
	        'variable is not a bare identifier: ' + argument
	      );
	    } else {
	      // If a variable is not specified, place data values in local scope.
	      source = 'with(obj||{}){\n' + source + '}\n';
	      argument = 'obj';
	    }
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    var render;
	    try {
	      render = new Function(argument, '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _$1);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  }
	
	  // Traverses the children of `obj` along `path`. If a child is a function, it
	  // is invoked with its parent as context. Returns the value of the final
	  // child, or `fallback` if any child is undefined.
	  function result(obj, path, fallback) {
	    path = toPath(path);
	    var length = path.length;
	    if (!length) {
	      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
	    }
	    for (var i = 0; i < length; i++) {
	      var prop = obj == null ? void 0 : obj[path[i]];
	      if (prop === void 0) {
	        prop = fallback;
	        i = length; // Ensure we don't continue iterating.
	      }
	      obj = isFunction$1(prop) ? prop.call(obj) : prop;
	    }
	    return obj;
	  }
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  function uniqueId(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  }
	
	  // Start chaining a wrapped Underscore object.
	  function chain(obj) {
	    var instance = _$1(obj);
	    instance._chain = true;
	    return instance;
	  }
	
	  // Internal function to execute `sourceFunc` bound to `context` with optional
	  // `args`. Determines whether to execute a function as a constructor or as a
	  // normal function.
	  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (isObject(result)) return result;
	    return self;
	  }
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
	  // as a placeholder by default, allowing any combination of arguments to be
	  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
	  var partial = restArguments(function(func, boundArgs) {
	    var placeholder = partial.placeholder;
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  });
	
	  partial.placeholder = _$1;
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally).
	  var bind = restArguments(function(func, context, args) {
	    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
	    var bound = restArguments(function(callArgs) {
	      return executeBound(func, bound, context, this, args.concat(callArgs));
	    });
	    return bound;
	  });
	
	  // Internal helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object.
	  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var isArrayLike = createSizePropertyCheck(getLength);
	
	  // Internal implementation of a recursive `flatten` function.
	  function flatten$1(input, depth, strict, output) {
	    output = output || [];
	    if (!depth && depth !== 0) {
	      depth = Infinity;
	    } else if (depth <= 0) {
	      return output.concat(input);
	    }
	    var idx = output.length;
	    for (var i = 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
	        // Flatten current level of array or arguments object.
	        if (depth > 1) {
	          flatten$1(value, depth - 1, strict, output);
	          idx = output.length;
	        } else {
	          var j = 0, len = value.length;
	          while (j < len) output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  }
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  var bindAll = restArguments(function(obj, keys) {
	    keys = flatten$1(keys, false, false);
	    var index = keys.length;
	    if (index < 1) throw new Error('bindAll must be passed function names');
	    while (index--) {
	      var key = keys[index];
	      obj[key] = bind(obj[key], obj);
	    }
	    return obj;
	  });
	
	  // Memoize an expensive function by storing its results.
	  function memoize(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  }
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  var delay = restArguments(function(func, wait, args) {
	    return setTimeout(function() {
	      return func.apply(null, args);
	    }, wait);
	  });
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  var defer = partial(delay, _$1, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  function throttle(func, wait, options) {
	    var timeout, context, args, result;
	    var previous = 0;
	    if (!options) options = {};
	
	    var later = function() {
	      previous = options.leading === false ? 0 : now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	
	    var throttled = function() {
	      var _now = now();
	      if (!previous && options.leading === false) previous = _now;
	      var remaining = wait - (_now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = _now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	
	    throttled.cancel = function() {
	      clearTimeout(timeout);
	      previous = 0;
	      timeout = context = args = null;
	    };
	
	    return throttled;
	  }
	
	  // When a sequence of calls of the returned function ends, the argument
	  // function is triggered. The end of a sequence is defined by the `wait`
	  // parameter. If `immediate` is passed, the argument function will be
	  // triggered at the beginning of the sequence instead of at the end.
	  function debounce(func, wait, immediate) {
	    var timeout, previous, args, result, context;
	
	    var later = function() {
	      var passed = now() - previous;
	      if (wait > passed) {
	        timeout = setTimeout(later, wait - passed);
	      } else {
	        timeout = null;
	        if (!immediate) result = func.apply(context, args);
	        // This check is needed because `func` can recursively invoke `debounced`.
	        if (!timeout) args = context = null;
	      }
	    };
	
	    var debounced = restArguments(function(_args) {
	      context = this;
	      args = _args;
	      previous = now();
	      if (!timeout) {
	        timeout = setTimeout(later, wait);
	        if (immediate) result = func.apply(context, args);
	      }
	      return result;
	    });
	
	    debounced.cancel = function() {
	      clearTimeout(timeout);
	      timeout = args = context = null;
	    };
	
	    return debounced;
	  }
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  function wrap(func, wrapper) {
	    return partial(wrapper, func);
	  }
	
	  // Returns a negated version of the passed-in predicate.
	  function negate(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  }
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  function compose() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  }
	
	  // Returns a function that will only be executed on and after the Nth call.
	  function after(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  }
	
	  // Returns a function that will only be executed up to (but not including) the
	  // Nth call.
	  function before(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  }
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  var once = partial(before, 2);
	
	  // Returns the first key on an object that passes a truth test.
	  function findKey(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = keys(obj), key;
	    for (var i = 0, length = _keys.length; i < length; i++) {
	      key = _keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  }
	
	  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a truth test.
	  var findIndex = createPredicateIndexFinder(1);
	
	  // Returns the last index on an array-like that passes a truth test.
	  var findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  function sortedIndex(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  }
	
	  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	          i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), isNaN$1);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
	
	  // Return the position of the last occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  var lastIndexOf = createIndexFinder(-1, findLastIndex);
	
	  // Return the first value which passes a truth test.
	  function find(obj, predicate, context) {
	    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
	    var key = keyFinder(obj, predicate, context);
	    if (key !== void 0 && key !== -1) return obj[key];
	  }
	
	  // Convenience version of a common use case of `_.find`: getting the first
	  // object containing specific `key:value` pairs.
	  function findWhere(obj, attrs) {
	    return find(obj, matcher(attrs));
	  }
	
	  // The cornerstone for collection functions, an `each`
	  // implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  function each(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var _keys = keys(obj);
	      for (i = 0, length = _keys.length; i < length; i++) {
	        iteratee(obj[_keys[i]], _keys[i], obj);
	      }
	    }
	    return obj;
	  }
	
	  // Return the results of applying the iteratee to each element.
	  function map(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  }
	
	  // Internal helper to create a reducing function, iterating left or right.
	  function createReduce(dir) {
	    // Wrap code that reassigns argument variables in a separate function than
	    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	    var reducer = function(obj, iteratee, memo, initial) {
	      var _keys = !isArrayLike(obj) && keys(obj),
	          length = (_keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      if (!initial) {
	        memo = obj[_keys ? _keys[index] : index];
	        index += dir;
	      }
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = _keys ? _keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    };
	
	    return function(obj, iteratee, memo, context) {
	      var initial = arguments.length >= 3;
	      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  var reduce = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  var reduceRight = createReduce(-1);
	
	  // Return all the elements that pass a truth test.
	  function filter(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  }
	
	  // Return all the elements for which a truth test fails.
	  function reject(obj, predicate, context) {
	    return filter(obj, negate(cb(predicate)), context);
	  }
	
	  // Determine whether all of the elements pass a truth test.
	  function every(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  }
	
	  // Determine if at least one element in the object passes a truth test.
	  function some(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var _keys = !isArrayLike(obj) && keys(obj),
	        length = (_keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = _keys ? _keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  }
	
	  // Determine if the array or object contains a given item (using `===`).
	  function contains(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return indexOf(obj, item, fromIndex) >= 0;
	  }
	
	  // Invoke a method (with arguments) on every item in a collection.
	  var invoke = restArguments(function(obj, path, args) {
	    var contextPath, func;
	    if (isFunction$1(path)) {
	      func = path;
	    } else {
	      path = toPath(path);
	      contextPath = path.slice(0, -1);
	      path = path[path.length - 1];
	    }
	    return map(obj, function(context) {
	      var method = func;
	      if (!method) {
	        if (contextPath && contextPath.length) {
	          context = deepGet(context, contextPath);
	        }
	        if (context == null) return void 0;
	        method = context[path];
	      }
	      return method == null ? method : method.apply(context, args);
	    });
	  });
	
	  // Convenience version of a common use case of `_.map`: fetching a property.
	  function pluck(obj, key) {
	    return map(obj, property(key));
	  }
	
	  // Convenience version of a common use case of `_.filter`: selecting only
	  // objects containing specific `key:value` pairs.
	  function where(obj, attrs) {
	    return filter(obj, matcher(attrs));
	  }
	
	  // Return the maximum element (or element-based computation).
	  function max(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
	      obj = isArrayLike(obj) ? obj : values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  }
	
	  // Return the minimum element (or element-based computation).
	  function min(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
	      obj = isArrayLike(obj) ? obj : values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value != null && value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      each(obj, function(v, index, list) {
	        computed = iteratee(v, index, list);
	        if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
	          result = v;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  }
	
	  // Safely create a real, live array from anything iterable.
	  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	  function toArray(obj) {
	    if (!obj) return [];
	    if (isArray(obj)) return slice.call(obj);
	    if (isString(obj)) {
	      // Keep surrogate pair characters together.
	      return obj.match(reStrSymbol);
	    }
	    if (isArrayLike(obj)) return map(obj, identity);
	    return values(obj);
	  }
	
	  // Sample **n** random values from a collection using the modern version of the
	  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `_.map`.
	  function sample(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = values(obj);
	      return obj[random(obj.length - 1)];
	    }
	    var sample = toArray(obj);
	    var length = getLength(sample);
	    n = Math.max(Math.min(n, length), 0);
	    var last = length - 1;
	    for (var index = 0; index < n; index++) {
	      var rand = random(index, last);
	      var temp = sample[index];
	      sample[index] = sample[rand];
	      sample[rand] = temp;
	    }
	    return sample.slice(0, n);
	  }
	
	  // Shuffle a collection.
	  function shuffle(obj) {
	    return sample(obj, Infinity);
	  }
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  function sortBy(obj, iteratee, context) {
	    var index = 0;
	    iteratee = cb(iteratee, context);
	    return pluck(map(obj, function(value, key, list) {
	      return {
	        value: value,
	        index: index++,
	        criteria: iteratee(value, key, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  }
	
	  // An internal function used for aggregate "group by" operations.
	  function group(behavior, partition) {
	    return function(obj, iteratee, context) {
	      var result = partition ? [[], []] : {};
	      iteratee = cb(iteratee, context);
	      each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  }
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  var groupBy = group(function(result, value, key) {
	    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
	  // when you know that your index values will be unique.
	  var indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  var countBy = group(function(result, value, key) {
	    if (has$1(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Split a collection into two arrays: one whose elements all pass the given
	  // truth test, and one whose elements all do not pass the truth test.
	  var partition = group(function(result, value, pass) {
	    result[pass ? 0 : 1].push(value);
	  }, true);
	
	  // Return the number of elements in a collection.
	  function size(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : keys(obj).length;
	  }
	
	  // Internal `_.pick` helper function to determine whether `key` is an enumerable
	  // property name of `obj`.
	  function keyInObj(value, key, obj) {
	    return key in obj;
	  }
	
	  // Return a copy of the object only containing the allowed properties.
	  var pick = restArguments(function(obj, keys) {
	    var result = {}, iteratee = keys[0];
	    if (obj == null) return result;
	    if (isFunction$1(iteratee)) {
	      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
	      keys = allKeys(obj);
	    } else {
	      iteratee = keyInObj;
	      keys = flatten$1(keys, false, false);
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  });
	
	  // Return a copy of the object without the disallowed properties.
	  var omit = restArguments(function(obj, keys) {
	    var iteratee = keys[0], context;
	    if (isFunction$1(iteratee)) {
	      iteratee = negate(iteratee);
	      if (keys.length > 1) context = keys[1];
	    } else {
	      keys = map(flatten$1(keys, false, false), String);
	      iteratee = function(value, key) {
	        return !contains(keys, key);
	      };
	    }
	    return pick(obj, iteratee, context);
	  });
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  function initial(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  }
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  function first(array, n, guard) {
	    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
	    if (n == null || guard) return array[0];
	    return initial(array, array.length - n);
	  }
	
	  // Returns everything but the first entry of the `array`. Especially useful on
	  // the `arguments` object. Passing an **n** will return the rest N values in the
	  // `array`.
	  function rest(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  }
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  function last(array, n, guard) {
	    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
	    if (n == null || guard) return array[array.length - 1];
	    return rest(array, Math.max(0, array.length - n));
	  }
	
	  // Trim out all falsy values from an array.
	  function compact(array) {
	    return filter(array, Boolean);
	  }
	
	  // Flatten out an array, either recursively (by default), or up to `depth`.
	  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
	  function flatten(array, depth) {
	    return flatten$1(array, depth, false);
	  }
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  var difference = restArguments(function(array, rest) {
	    rest = flatten$1(rest, true, true);
	    return filter(array, function(value){
	      return !contains(rest, value);
	    });
	  });
	
	  // Return a version of the array that does not contain the specified value(s).
	  var without = restArguments(function(array, otherArrays) {
	    return difference(array, otherArrays);
	  });
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // The faster algorithm will not work with an iteratee if the iteratee
	  // is not a one-to-one function, so providing an iteratee will disable
	  // the faster algorithm.
	  function uniq(array, isSorted, iteratee, context) {
	    if (!isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted && !iteratee) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  }
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  var union = restArguments(function(arrays) {
	    return uniq(flatten$1(arrays, true, true));
	  });
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  function intersection(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (contains(result, item)) continue;
	      var j;
	      for (j = 1; j < argsLength; j++) {
	        if (!contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  }
	
	  // Complement of zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices.
	  function unzip(array) {
	    var length = (array && max(array, getLength).length) || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = pluck(array, index);
	    }
	    return result;
	  }
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  var zip = restArguments(unzip);
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
	  function object(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  }
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](https://docs.python.org/library/functions.html#range).
	  function range(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    if (!step) {
	      step = stop < start ? -1 : 1;
	    }
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  }
	
	  // Chunk a single array into multiple arrays, each containing `count` or fewer
	  // items.
	  function chunk(array, count) {
	    if (count == null || count < 1) return [];
	    var result = [];
	    var i = 0, length = array.length;
	    while (i < length) {
	      result.push(slice.call(array, i, i += count));
	    }
	    return result;
	  }
	
	  // Helper function to continue chaining intermediate results.
	  function chainResult(instance, obj) {
	    return instance._chain ? _$1(obj).chain() : obj;
	  }
	
	  // Add your own custom functions to the Underscore object.
	  function mixin(obj) {
	    each(functions(obj), function(name) {
	      var func = _$1[name] = obj[name];
	      _$1.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return chainResult(this, func.apply(_$1, args));
	      };
	    });
	    return _$1;
	  }
	
	  // Add all mutator `Array` functions to the wrapper.
	  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _$1.prototype[name] = function() {
	      var obj = this._wrapped;
	      if (obj != null) {
	        method.apply(obj, arguments);
	        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
	          delete obj[0];
	        }
	      }
	      return chainResult(this, obj);
	    };
	  });
	
	  // Add all accessor `Array` functions to the wrapper.
	  each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _$1.prototype[name] = function() {
	      var obj = this._wrapped;
	      if (obj != null) obj = method.apply(obj, arguments);
	      return chainResult(this, obj);
	    };
	  });
	
	  // Named Exports
	
	  var allExports = {
	    __proto__: null,
	    VERSION: VERSION,
	    restArguments: restArguments,
	    isObject: isObject,
	    isNull: isNull,
	    isUndefined: isUndefined,
	    isBoolean: isBoolean,
	    isElement: isElement,
	    isString: isString,
	    isNumber: isNumber,
	    isDate: isDate,
	    isRegExp: isRegExp,
	    isError: isError,
	    isSymbol: isSymbol,
	    isArrayBuffer: isArrayBuffer,
	    isDataView: isDataView$1,
	    isArray: isArray,
	    isFunction: isFunction$1,
	    isArguments: isArguments$1,
	    isFinite: isFinite$1,
	    isNaN: isNaN$1,
	    isTypedArray: isTypedArray$1,
	    isEmpty: isEmpty,
	    isMatch: isMatch,
	    isEqual: isEqual,
	    isMap: isMap,
	    isWeakMap: isWeakMap,
	    isSet: isSet,
	    isWeakSet: isWeakSet,
	    keys: keys,
	    allKeys: allKeys,
	    values: values,
	    pairs: pairs,
	    invert: invert,
	    functions: functions,
	    methods: functions,
	    extend: extend,
	    extendOwn: extendOwn,
	    assign: extendOwn,
	    defaults: defaults,
	    create: create,
	    clone: clone,
	    tap: tap,
	    get: get,
	    has: has,
	    mapObject: mapObject,
	    identity: identity,
	    constant: constant,
	    noop: noop,
	    toPath: toPath$1,
	    property: property,
	    propertyOf: propertyOf,
	    matcher: matcher,
	    matches: matcher,
	    times: times,
	    random: random,
	    now: now,
	    escape: _escape,
	    unescape: _unescape,
	    templateSettings: templateSettings,
	    template: template,
	    result: result,
	    uniqueId: uniqueId,
	    chain: chain,
	    iteratee: iteratee,
	    partial: partial,
	    bind: bind,
	    bindAll: bindAll,
	    memoize: memoize,
	    delay: delay,
	    defer: defer,
	    throttle: throttle,
	    debounce: debounce,
	    wrap: wrap,
	    negate: negate,
	    compose: compose,
	    after: after,
	    before: before,
	    once: once,
	    findKey: findKey,
	    findIndex: findIndex,
	    findLastIndex: findLastIndex,
	    sortedIndex: sortedIndex,
	    indexOf: indexOf,
	    lastIndexOf: lastIndexOf,
	    find: find,
	    detect: find,
	    findWhere: findWhere,
	    each: each,
	    forEach: each,
	    map: map,
	    collect: map,
	    reduce: reduce,
	    foldl: reduce,
	    inject: reduce,
	    reduceRight: reduceRight,
	    foldr: reduceRight,
	    filter: filter,
	    select: filter,
	    reject: reject,
	    every: every,
	    all: every,
	    some: some,
	    any: some,
	    contains: contains,
	    includes: contains,
	    include: contains,
	    invoke: invoke,
	    pluck: pluck,
	    where: where,
	    max: max,
	    min: min,
	    shuffle: shuffle,
	    sample: sample,
	    sortBy: sortBy,
	    groupBy: groupBy,
	    indexBy: indexBy,
	    countBy: countBy,
	    partition: partition,
	    toArray: toArray,
	    size: size,
	    pick: pick,
	    omit: omit,
	    first: first,
	    head: first,
	    take: first,
	    initial: initial,
	    last: last,
	    rest: rest,
	    tail: rest,
	    drop: rest,
	    compact: compact,
	    flatten: flatten,
	    without: without,
	    uniq: uniq,
	    unique: uniq,
	    union: union,
	    intersection: intersection,
	    difference: difference,
	    unzip: unzip,
	    transpose: unzip,
	    zip: zip,
	    object: object,
	    range: range,
	    chunk: chunk,
	    mixin: mixin,
	    'default': _$1
	  };
	
	  // Default Export
	
	  // Add all of the Underscore functions to the wrapper object.
	  var _ = mixin(allExports);
	  // Legacy Node.js API.
	  _._ = _;
	
	  return _;
	
	})));
	//# sourceMappingURL=underscore-umd.js.map
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = {"name":"ipyaladin","version":"0.1.9","description":"ipyaladin","author":"Thomas Boch and Jerome Desroziers","main":"src/index.js","repository":{"type":"git","url":"https://github.com/cds-astro/ipyaladin"},"keywords":["jupyter","widgets","ipython","ipywidgets"],"scripts":{"prepublish":"webpack","test":"echo \"Error: no test specified\" && exit 1"},"devDependencies":{"json-loader":"^0.5.4","webpack":"^1.12.14"},"dependencies":{"@jupyter-widgets/base":"1.1 || ^2.0","jquery":"^3.0","underscore":"^1.8.3"},"jupyterlab":{"extension":"src/jupyterlab-plugin.js"}}

/***/ })
/******/ ])});;
//# sourceMappingURL=index.js.map