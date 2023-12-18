/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  var element = document.createElement('h2');
  element.textContent = 'Hello world';
  element.addEventListener('click', function () {
    alert('Hello webpack');
  });
  return element;
});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var api = __webpack_require__(3);
            var content = __webpack_require__(4);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 4 */
/***/ ((module, exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_AT_RULE_IMPORT_0___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
// Module
exports.push([module.id, "\r\nbody {\r\n    margin: 0 auto;\r\n    padding: 0 20px;\r\n    max-width: 800px;\r\n    background: #f4f8fb;\r\n  }", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);
      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }
      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names

  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }
      list.push(item);
    }
  };
  return list;
};
function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }
  return [content].join('\n');
} // Adapted from convert-source-map (MIT)

function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),
/* 6 */
/***/ ((module, exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.id, "* {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n", ""]);
// Exports
module.exports = exports;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAADIyMjEyMi0vLjw5OTMzMzExMTc1NhYdHTQzMzAxMT46OzIyMjQ0NC8vLzIyMjQ0NDIyMhYdHDIyMiAlJTIyMjQzMy8xMRMbGjAxMUxGRiEmJRwiIDIyMi8wMDEyMjMzMzMzM//X3S0uLh4jIystLQgTEigqKh0kIjQ0NP7JzjAxMRUcGygrK1FISTQ0NFFJSiYqKSwuLtO2u/nY3u7GyvLFyicsK0tDRP3d4yMoJxgeHjMzMxYfHhcfHv/i6OG1uf/U2gIQD5t9gDQzM/bFyhwiISstLR8lJaqLjhsjIRAZGLmXmpB3euq7v//y+BISEjIyMv+8yfjFygAEALuXmmpVWPSrtv/q8raTl+a6v//j6f/d4//t89Sprv/b4vrKzxogH+u7wElDRAwWFN6xtuza39S7wDAwMFxRUn5rbP/V29+us3poahIaGdSqrlJJSv///2BUVodxdP/b4jU1NaCGiP/k6f///9u6v////7CXm0lAQP/j6P/6///Kz//i6P/O0v/Jzv/W3P/Y3f/M0f/P06WHi//a3//Q1u+qtP/IzTExMf/R2O+nsxEaGfituSQoKP/f5P/V2u6lsf/c4h0jIv/n7P/O0//T2BkgIP/P1CssLCgqKv/HzPvFy/+0wBUdHf/k6nxoavywvAwWE8Kanv/EyvGstvi9xP/d4GiaAMqipolydE5FRmJTVjc1Nf/+///y9/3ByfSyvLiEjmuiAJ1/hGtbXXZlZvLCxj85OQMRD1tRUem6vv/g5qqJju6jr56Dhv/q79err1lNUc+orHFfYUM9PuS5vbKTluudqvWotCskNTlXDfOtuE08UHGsAJZud+u9wvTMz0hAQUdBQtqwtP+8yNKVoF9OUfa4wPzL0eustnFeaXRcb1lMTSQ6EvjDyCI1FQgZCWSUADQsQH5fZFF0DGCNBf/D0YVpbJB5e//5+9Cdo8ePmEtCQ5h8fqx9heKxtoNub+bL0AAAAL6KkreUmG1NYjBPDFyHBoNcckRoDOakriw4Hw5v7x4AAADYdFJOUwAsKEASODMi8wFIDQWCCqBpXtca/7r3Zu1YFprTPZBUT8mtdefpye+j4/6p9m+k18SC0Aln+z1fOYqWqJq2x+kb8u5Os87y+rHmv+Ll21LqQ8Ev86/BOr+kM+z2kbu/+ljfM4CLoOw4+dTy1Iii+uT8s1O8Q65bte99wT3a8Zn///////////////////////////////////////////////////////////////////////////////////////7//////////////////////////////sgZMj8AAAVYSURBVGje7Zd3UBNZHMcXCGBiQEpABBSli70rKmfv5XpvXq9e72WT3SxkSS8bNo0EQkKHCNJ7LwoWFMV29u5Z8Pqd5+YwCJ5zM27COTe3n7/ebN687/v1FwCgoKCgoKCgoKD4HxE24l8QmTTmv+4m19FDr+E+3t9tyEWcx/u7DvrwoNcQqLgN1gC8FwyROSEjby18hw+dz7xtLgpxur9Z6ERz1Ek02hCKeDL78tnFzfmfE96OonIbN7bvtq5uA4qGTv+7OaPIi4wQ+PWllasrs/+jByt8rCODyhzjfmtxW2OU9s3SlXdJNtoUF8cJL4t7/TXdYO8wrFfx9HC2s1n6DnAha/Jb0pEDf/WyOdU+/G4FgTFhU0C4Rap+QxqwZlr/xb39JzhChPlXPnlFmSKmrl63r6u6MaektEIdZwuCi9VQOpP8+aNtMfYdL5269J23k2RcuZyL1QgPX8uX+nne3uhhx5h+yDZ9/SI8gQ/YchTV4DjI13DZ8Pkey5wBpUJm/Awf7Wx1Eq3P3e5hrGCXD98rj+FohDBPjqP68u+LduuC59jVVDxYaukm7/6UUkrfb2qVKqUrLRXdTXm1i1sEApZSdyBfoBxJvmeNY727vPc6a1VfB6FFvvwqCmX2mutzjWUtVXntL+RWluU0Jm5Pu9GitI6DQDcXJ/q9iowTTP/IPOvzHK2Ptc4YDGBmqqbgUhI7KbWmBuPyYPkeS31Blkay3bD/zMSQST6bdVq1z732rwVTpvgs8f/0s/IrwZ5AoHbaDHYy1LCFIAu+xEFwEMSOlhbIOcfrFIa0vZWW6+37es2lZDznuWI+sLFNEA14pAQ+C4JQOqjKkuGaLBAC+Spe0+mSPRiytU5k6LnaVcDGVVsKLqSQmJ9hYmBeUrvYO+KVRTIIBEF+eno6n59OrIT6fN2fJ3fu4elFIoUES7pqEVSsDxW2knhsMsTDZ6Jwfoog8EUUHARWazpbfM50JEtDmKLYX2Kaxggyzf34YhyJYte6b5Cntpu6Z4Ym8/FUXrL1fD5GWMX77kRx9q4/OnqzMutEkoy9QcTu6ZHA6rUk5qLWaQOX25ZSFbocRMsvmoVWEdT8M06IHCs+VfybsgjTK0RpN65MInZ/MgxYH07iEal1nQ1rcK3xGT4oa/5xL6YhNOQC9SEVlqA8l52dfeJ3FZKokEgOxBL90X8+YJxP4jmsZbwEg2hzl5wPcjITclRcBOeiOeb0ZKyx4yzhr86dhWiGYkdafjTRidVzZ3eHkeheWq9FMAhhs45zwIw6eVJjbuoPxurUQ9syUGRn567sU792HCZECEuiAXpUJLBO7EuiuWg9ZhCW6AX1NVDitoPcLp2xyoKrDm7bAcqOnOw8lqI8k8YnRER5c4Bg04x5FUFkOljUCGAxSAQln43oM2NAbnNeVRsMgYV8EK5uOv3L7h5DIVEohh5BrE/UV9+WBZAxBJgwEXguGZTlittgJB6EIC7M4xJ5zEGIklfpESHKQYkU3n+tUv31F1/misk9lBjKubOxZLhcWSrrK0Ich2z1qFGh8QiCE8WYdrmleeM3RjHZnr9M7D6vIR7bl3NHxdvgxCQSdSLcUmNuFY8iP1bEk59fLG8okEPQ3UQ0mXUZhsu1JXniNYH2DEi1Oq+sLPfpB5C7qMTHiBSFRdLNa2PtfNcxQ4KiF5oinnpSxb9TA+FsrTP8pFvFBByCe3jA0tAGFTI4IPFbJeclrQsd9gCmTTdNfewRjD2QmsLtRbufeJwOOA7vFeJuY0ltQj/1F4oMRx918H9DuktsnE/AxGH9LJn8MJ0OUFBQUFBQUFBQUFDcZ24CzaxVoPcQxuwAAAAASUVORK5CYII=");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _heading_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_main_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _icon_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);



var heading = (0,_heading_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
document.body.append(heading);
var img = new Image();
img.src = _icon_png__WEBPACK_IMPORTED_MODULE_2__["default"];
document.body.append(img);
})();

/******/ })()
;