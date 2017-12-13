/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 37);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT_SHADER_CODE = exports.DEFAULT_SHADER_CODE = __webpack_require__(5);
var DEFAULT_SHADER = exports.DEFAULT_SHADER = {
  id: '0',
  name: 'melt-internet',
  code: DEFAULT_SHADER_CODE
};

var EMPTY_SHADER_CODE = exports.EMPTY_SHADER_CODE = '\nprecision mediump float;\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D image;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D(image, uv);\n}\n'.trim();

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _store = __webpack_require__(4);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = new _store2.default();

var capture = function capture(tab) {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (imageUrl) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'postinternet:load',
      imageUrl: imageUrl,
      shader: store.getActiveShader()
    });
  });
};

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(tab.id, { file: 'content.js' }, function () {
    capture(tab);
  });
});

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(3);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefix = 'XXXPOSTINTERNETXXX';

var Store = function () {
  function Store() {
    _classCallCheck(this, Store);

    var shaders = this._get('shaders');
    if (!shaders) {
      this._set('shaders', { '0': _constants.DEFAULT_SHADER });
    }

    var activeShaderId = this._get('activeShaderId');
    if (activeShaderId == null) {
      this._set('activeShaderId', _constants.DEFAULT_SHADER.id);
    }
  }

  _createClass(Store, [{
    key: 'getShaders',
    value: function getShaders() {
      return this._get('shaders');
    }
  }, {
    key: 'getActiveShader',
    value: function getActiveShader() {
      var shaders = this.getShaders();
      var activeShaderId = this._get('activeShaderId');
      return shaders[activeShaderId];
    }
  }, {
    key: 'save',
    value: function save(shader) {
      var shaders = this.getShaders();
      this._set('shaders', _extends({}, shaders, _defineProperty({}, shader.id, shader)));
    }
  }, {
    key: 'delete',
    value: function _delete(shader) {
      var shaders = this._get('shaders') || {};

      delete shaders[shader.id];
      if (Object.keys(shaders).length === 0) {
        shaders[_constants.DEFAULT_SHADER.id] = _constants.DEFAULT_SHADER;
      }
      this._set('shaders', shaders);

      var activeShaderId = this._get('activeShaderId');
      if (activeShaderId === shader.id) {
        this._set('activeShaderId', _constants.DEFAULT_SHADER.id);
      }
    }
  }, {
    key: 'useThis',
    value: function useThis(shader) {
      this._set('activeShaderId', shader.id);
    }
  }, {
    key: '_get',
    value: function _get(key) {
      try {
        var item = localStorage.getItem(prefix + key);
        if (item) {
          return JSON.parse(item);
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    }
  }, {
    key: '_set',
    value: function _set(key, value) {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      } catch (e) {
        console.error(e);
      }
    }
  }]);

  return Store;
}();

exports.default = Store;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = "precision mediump float;\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D image;\nuniform sampler2D backbuffer;\n\nfloat random(in vec2 p) {\n  return fract(sin(dot(p, vec2(5395.3242, 38249.2348))) * 248.24);\n}\n\nfloat noise (in vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n    vec2 u = f*f*(3.0-2.0*f);\n\n    return mix(a, b, u.x) +\n            (c - a)* u.y * (1.0 - u.x) +\n            (d - b) * u.x * u.y;\n}\n\n// Util functions copied from http://glslsandbox.com/e#43153.1\nmat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}\nmat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);\nfloat tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}\nvec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}\n\nfloat triNoise2d(in vec2 p, float spd)\n{\n  float z=1.8;\n  float z2=2.5;\n  float rz = 0.;\n  p *= mm2(p.x*0.06);\n  vec2 bp = p;\n  for (float i=0.; i<5.; i++ )\n  {\n    vec2 dg = tri2(bp*1.85)*.75;\n    dg *= mm2(time*spd);\n    p -= dg/z2;\n\n    bp *= 1.3;\n    z2 *= .45;\n    z *= .42;\n    p *= 1.21 + (rz-1.0)*.02;\n\n    rz += tri(p.x+tri(p.y))*z;\n    p*= -m2;\n  }\n  return clamp(1./pow(rz*29., 1.3),0.,.55);\n}\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy / resolution;\n    vec2 uv0 = (uv - .5) * 1. + .5;\n\n    float z = 23.01;\n    float t = time * .4;\n    vec2 uv1 = uv0 + vec2(noise(uv0 * z - t)*cos(uv.x+t+2.4), noise(uv0 * z + t)) * .03 * sin(time * .07);\n    vec2 uv2 = uv1 + vec2(noise(uv1 * z - t)*sin(uv.y+t+.2), noise(uv1 * z + t)) * .04 * cos(time * .04 + .3);\n\n    vec2 v = vec2(0, .001);\n    gl_FragColor = mix(vec4(\n      texture2D(image, uv1 +v).r,\n      texture2D(image, uv2 +v).g,\n      texture2D(image, uv0 +v).b,\n      1.\n    ), vec4(\n      texture2D(backbuffer, uv2 + v * mod(t, 7.)).b,\n      texture2D(backbuffer, uv0 + v * mod(t, 8.)).r,\n      texture2D(backbuffer, uv1 + v * mod(t, 2.)).g,\n      1.\n    ), cos(triNoise2d(uv0 * .3, t * .001) * 20.) - .2);\n\n    // gl_FragColor.a = triNoise2d(uv2 * .3, t * .001) - 8.;\n}\n"

/***/ })

/******/ });