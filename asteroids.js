// 'use strict';
(function() {
  /**
   * @return {undefined}
   */
  function Asteroids() {
    /**
     * @param {number} x
     * @param {number} y
     * @return {undefined}
     */
    function Vector(x, y) {
      if (typeof x == "Object") {
        this.x = x.x;
        this.y = x.y;
      } else {
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
      }
    }
    /**
     * @param {number} p1
     * @param {?} p2
     * @return {undefined}
     */
    function Line(p1, p2) {
      /** @type {number} */
      this.p1 = p1;
      this.p2 = p2;
    }
    /**
     * @return {undefined}
     */
    function updateEnemyIndex() {
      /** @type {number} */
      var i = 0;
      var enemy;
      for (; enemy = that.enemies[i]; i++) {
        removeClass(enemy, "ASTEROIDSYEAHENEMY");
      }
      /** @type {!NodeList<Element>} */
      var keyPathEls = document.body.getElementsByTagName("*");
      /** @type {!Array} */
      that.enemies = [];
      /** @type {number} */
      i = 0;
      var el;
      for (; el = keyPathEls[i]; i++) {
        if (indexOf(ignoredTypes, el.tagName.toUpperCase()) == -1 && el.prefix != "g_vml_" && hasOnlyTextualChildren(el) && el.className != "ASTEROIDSYEAH" && el.offsetHeight > 0) {
          el.aSize = size(el);
          that.enemies.push(el);
          addClass(el, "ASTEROIDSYEAHENEMY");
          if (!el.aAdded) {
            /** @type {boolean} */
            el.aAdded = true;
            that.totalEnemies++;
          }
        }
      }
    }
    /**
     * @param {number} a
     * @return {?}
     */
    function radians(a) {
      return a * 0.0174532925;
    }
    /**
     * @param {number} radian
     * @return {?}
     */
    function degrees(radian) {
      return radian * 57.2957795;
    }
    /**
     * @param {number} start
     * @param {number} rows
     * @return {?}
     */
    function random(start, rows) {
      return Math.floor(Math.random() * (rows + 1) + start);
    }
    /**
     * @param {string} key
     * @return {?}
     */
    function code(key) {
      var table = {
        "up" : 38,
        "down" : 40,
        "left" : 37,
        "right" : 39,
        "esc" : 27
      };
      if (table[key]) {
        return table[key];
      }
      return key.charCodeAt(0);
    }
    /**
     * @param {!Object} vec
     * @return {undefined}
     */
    function boundsCheck(vec) {
      if (vec.x > w) {
        /** @type {number} */
        vec.x = 0;
      } else {
        if (vec.x < 0) {
          vec.x = w;
        }
      }
      if (vec.y > h) {
        /** @type {number} */
        vec.y = 0;
      } else {
        if (vec.y < 0) {
          vec.y = h;
        }
      }
    }
    /**
     * @param {!Element} element
     * @return {?}
     */
    function size(element) {
      /** @type {!Element} */
      var cElement = element;
      /** @type {number} */
      var tick_x = 0;
      /** @type {number} */
      var totalPass = 0;
      do {
        tick_x = tick_x + (cElement.offsetLeft || 0);
        totalPass = totalPass + (cElement.offsetTop || 0);
        cElement = cElement.offsetParent;
      } while (cElement);
      return {
        x : tick_x,
        y : totalPass,
        width : element.offsetWidth || 10,
        height : element.offsetHeight || 10
      };
    }
    /**
     * @param {!Object} obj
     * @param {string} type
     * @param {!Function} fn
     * @return {undefined}
     */
    function addEvent(obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
      } else {
        if (obj.attachEvent) {
          /** @type {!Function} */
          obj["e" + type + fn] = fn;
          /**
           * @return {undefined}
           */
          obj[type + fn] = function() {
            obj["e" + type + fn](window.event);
          };
          obj.attachEvent("on" + type, obj[type + fn]);
        }
      }
    }
    /**
     * @param {!Object} elem
     * @param {string} type
     * @param {!Function} fn
     * @return {undefined}
     */
    function removeEvent(elem, type, fn) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, fn, false);
      } else {
        if (elem.detachEvent) {
          elem.detachEvent("on" + type, elem[type + fn]);
          /** @type {null} */
          elem[type + fn] = null;
          /** @type {null} */
          elem["e" + type + fn] = null;
        }
      }
    }
    /**
     * @param {!Array} array
     * @param {number} from
     * @param {number} to
     * @return {?}
     */
    function arrayRemove(array, from, to) {
      var searchPipeline = array.slice((to || from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, searchPipeline);
    }
    /**
     * @param {string} vis
     * @return {undefined}
     */
    function applyVisibility(vis) {
      /** @type {number} */
      var i = 0;
      var p;
      for (; p = window.ASTEROIDSPLAYERS[i]; i++) {
        /** @type {string} */
        p.gameContainer.style.visibility = vis;
      }
    }
    /**
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    function getElementFromPoint(x, y) {
      applyVisibility("hidden");
      /** @type {(Element|null)} */
      var el = document.elementFromPoint(x, y);
      if (!el) {
        applyVisibility("visible");
        return false;
      }
      if (el.nodeType == 3) {
        /** @type {(Node|null)} */
        el = el.parentNode;
      }
      applyVisibility("visible");
      return el;
    }
    /**
     * @param {?} startPos
     * @return {undefined}
     */
    function addParticles(startPos) {
      /** @type {number} */
      var time = (new Date).getTime();
      /** @type {number} */
      var amount = v;
      /** @type {number} */
      var i = 0;
      for (; i < amount; i++) {
        that.particles.push({
          dir : (new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(),
          pos : startPos.cp(),
          cameAlive : time
        });
      }
    }
    /**
     * @return {undefined}
     */
    function clear() {
      /** @type {number} */
      that.points.innerHTML = window.ASTEROIDS.enemiesKilled * 10;
    }
    /**
     * @param {!Element} element
     * @return {?}
     */
    function hasOnlyTextualChildren(element) {
      if (element.offsetLeft < -100 && element.offsetWidth > 0 && element.offsetHeight > 0) {
        return false;
      }
      if (indexOf(hiddenTypes, element.tagName) != -1) {
        return true;
      }
      if (element.offsetWidth == 0 && element.offsetHeight == 0) {
        return false;
      }
      /** @type {number} */
      var i = 0;
      for (; i < element.childNodes.length; i++) {
        if (indexOf(hiddenTypes, element.childNodes[i].tagName) == -1 && element.childNodes[i].childNodes.length != 0) {
          return false;
        }
      }
      return true;
    }
    /**
     * @param {!Array} arr
     * @param {string} obj
     * @param {number} from
     * @return {?}
     */
    function indexOf(arr, obj, from) {
      if (arr.indexOf) {
        return arr.indexOf(obj, from);
      }
      var l = arr.length;
      var i = from < 0 ? Math.max(0, l + from) : from || 0;
      for (; i < l; i++) {
        if (arr[i] === obj) {
          return i;
        }
      }
      return -1;
    }
    /**
     * @param {!Object} element
     * @param {string} className
     * @return {undefined}
     */
    function addClass(element, className) {
      if (element.className.indexOf(className) == -1) {
        /** @type {string} */
        element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
      }
    }
    /**
     * @param {!Object} element
     * @param {string} className
     * @return {undefined}
     */
    function removeClass(element, className) {
      element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(?:\\s|$)"), "$1");
    }
    /**
     * @param {string} selector
     * @param {string} rules
     * @return {undefined}
     */
    function addStylesheet(selector, rules) {
      /** @type {!Element} */
      var stylesheet = document.createElement("style");
      /** @type {string} */
      stylesheet.type = "text/css";
      /** @type {string} */
      stylesheet.rel = "stylesheet";
      /** @type {string} */
      stylesheet.id = "ASTEROIDSYEAHSTYLES";
      try {
        /** @type {string} */
        stylesheet.innerHTML = selector + "{" + rules + "}";
      } catch (e) {
        stylesheet.styleSheet.addRule(selector, rules);
      }
      document.getElementsByTagName("head")[0].appendChild(stylesheet);
    }
    /**
     * @param {string} name
     * @return {undefined}
     */
    function removeStylesheet(name) {
      /** @type {(Element|null)} */
      var stylesheet = document.getElementById(name);
      if (stylesheet) {
        stylesheet.parentNode.removeChild(stylesheet);
      }
    }
    /**
     * @return {undefined}
     */
    function destroy() {
      removeEvent(document, "keydown", eventKeydown);
      removeEvent(document, "keypress", eventKeypress);
      removeEvent(document, "keyup", eventKeyup);
      removeEvent(window, "resize", eventResize);
      /** @type {boolean} */
      isRunning = false;
      removeStylesheet("ASTEROIDSYEAHSTYLES");
      removeClass(document.body, "ASTEROIDSYEAH");
      this.gameContainer.parentNode.removeChild(this.gameContainer);
    }
    if (!window.ASTEROIDS) {
      window.ASTEROIDS = {
        enemiesKilled : 0
      };
    }
    Vector.prototype = {
      cp : function() {
        return new Vector(this.x, this.y);
      },
      mul : function(s) {
        this.x *= s;
        this.y *= s;
        return this;
      },
      mulNew : function(factor) {
        return new Vector(this.x * factor, this.y * factor);
      },
      add : function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
      },
      addNew : function(p) {
        return new Vector(this.x + p.x, this.y + p.y);
      },
      sub : function(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
      },
      subNew : function(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
      },
      rotate : function(theta) {
        var oldX = this.x;
        var oldY = this.y;
        /** @type {number} */
        this.x = oldX * Math.cos(theta) - Math.sin(theta) * oldY;
        /** @type {number} */
        this.y = oldX * Math.sin(theta) + Math.cos(theta) * oldY;
        return this;
      },
      rotateNew : function(angle) {
        return this.cp().rotate(angle);
      },
      setAngle : function(a) {
        var d = this.len();
        /** @type {number} */
        this.x = Math.cos(a) * d;
        /** @type {number} */
        this.y = Math.sin(a) * d;
        return this;
      },
      setAngleNew : function(angle) {
        return this.cp().setAngle(angle);
      },
      setLength : function(length) {
        var l = this.len();
        if (l) {
          this.mul(length / l);
        } else {
          this.x = this.y = length;
        }
        return this;
      },
      setLengthNew : function(length) {
        return this.cp().setLength(length);
      },
      normalize : function() {
        var len = this.len();
        this.x /= len;
        this.y /= len;
        return this;
      },
      normalizeNew : function() {
        return this.cp().normalize();
      },
      angle : function() {
        return Math.atan2(this.y, this.x);
      },
      collidesWith : function(rect) {
        return this.x > rect.x && this.y > rect.y && this.x < rect.x + rect.width && this.y < rect.y + rect.height;
      },
      len : function() {
        /** @type {number} */
        var length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length < 0.005 && length > -0.005) {
          return 0;
        }
        return length;
      },
      is : function(other) {
        return typeof other == "object" && this.x == other.x && this.y == other.y;
      },
      toString : function() {
        return "[Vector(" + this.x + ", " + this.y + ") angle: " + this.angle() + ", length: " + this.len() + "]";
      }
    };
    Line.prototype = {
      shift : function(pos) {
        this.p1.add(pos);
        this.p2.add(pos);
      },
      intersectsWithRect : function(rect) {
        var LL = new Vector(rect.x, rect.y + rect.height);
        var UL = new Vector(rect.x, rect.y);
        var LR = new Vector(rect.x + rect.width, rect.y + rect.height);
        var UR = new Vector(rect.x + rect.width, rect.y);
        if (this.p1.x > LL.x && this.p1.x < UR.x && this.p1.y < LL.y && this.p1.y > UR.y && this.p2.x > LL.x && this.p2.x < UR.x && this.p2.y < LL.y && this.p2.y > UR.y) {
          return true;
        }
        if (this.intersectsLine(new Line(UL, LL))) {
          return true;
        }
        if (this.intersectsLine(new Line(LL, LR))) {
          return true;
        }
        if (this.intersectsLine(new Line(UL, UR))) {
          return true;
        }
        if (this.intersectsLine(new Line(UR, LR))) {
          return true;
        }
        return false;
      },
      intersectsLine : function(line) {
        var p0 = this.p1;
        var p = this.p2;
        var p1 = line.p1;
        var p2 = line.p2;
        /** @type {number} */
        var denom = (p2.y - p1.y) * (p.x - p0.x) - (p2.x - p1.x) * (p.y - p0.y);
        /** @type {number} */
        var numeA = (p2.x - p1.x) * (p0.y - p1.y) - (p2.y - p1.y) * (p0.x - p1.x);
        /** @type {number} */
        var numer = (p.x - p0.x) * (p0.y - p1.y) - (p.y - p0.y) * (p0.x - p1.x);
        if (denom == 0.0) {
          return false;
        }
        /** @type {number} */
        var uA = numeA / denom;
        /** @type {number} */
        var mua = numer / denom;
        return uA >= 0.0 && uA <= 1.0 && mua >= 0.0 && mua <= 1.0;
      }
    };
    var that = this;
    /** @type {boolean} */
    var isVisible = !!window.ActiveXObject;
    /** @type {number} */
    var w = document.documentElement.clientWidth;
    /** @type {number} */
    var h = document.documentElement.clientHeight;
    /** @type {number} */
    var playerWidth = 20;
    /** @type {number} */
    var backoffDelay = 30;
    /** @type {!Array} */
    var playerVerts = [[-1 * backoffDelay / 2, -1 * playerWidth / 2], [-1 * backoffDelay / 2, playerWidth / 2], [backoffDelay / 2, 0]];
    /** @type {!Array} */
    var ignoredTypes = ["HTML", "HEAD", "BODY", "SCRIPT", "TITLE", "META", "STYLE", "LINK", "SHAPE", "LINE", "GROUP", "IMAGE", "STROKE", "FILL", "SKEW", "PATH", "TEXTPATH"];
    /** @type {!Array} */
    var hiddenTypes = ["BR", "HR"];
    /** @type {number} */
    var maxFPS = 50;
    /** @type {number} */
    var acc = 300;
    /** @type {number} */
    var maxSpeed = 600;
    /** @type {number} */
    var rotSpeed = 360;
    /** @type {number} */
    var bulletSpeed = 700;
    /** @type {number} */
    var particleSpeed = 400;
    /** @type {number} */
    var timeBetweenFire = 150;
    /** @type {number} */
    var time = 250;
    /** @type {number} */
    var cos = isVisible ? 10000 : 2000;
    /** @type {number} */
    var radius = 2;
    /** @type {number} */
    var v = isVisible ? 20 : 40;
    /** @type {number} */
    var rows = isVisible ? 10 : 20;
    this.flame = {
      r : [],
      y : []
    };
    /**
     * @return {undefined}
     */
    this.toggleBlinkStyle = function() {
      if (this.updated.blink.isActive) {
        removeClass(document.body, "ASTEROIDSBLINK");
      } else {
        addClass(document.body, "ASTEROIDSBLINK");
      }
      /** @type {boolean} */
      this.updated.blink.isActive = !this.updated.blink.isActive;
    };
    addStylesheet(".ASTEROIDSBLINK .ASTEROIDSYEAHENEMY", "outline: 2px dotted red;");
    this.pos = new Vector(100, 100);
    /** @type {boolean} */
    this.lastPos = false;
    this.vel = new Vector(0, 0);
    this.dir = new Vector(0, 1);
    this.keysPressed = {};
    /** @type {boolean} */
    this.firedAt = false;
    this.updated = {
      enemies : false,
      flame : (new Date).getTime(),
      blink : {
        time : 0,
        isActive : false
      }
    };
    this.scrollPos = new Vector(0, 0);
    /** @type {!Array} */
    this.bullets = [];
    /** @type {!Array} */
    this.enemies = [];
    /** @type {!Array} */
    this.dying = [];
    /** @type {number} */
    this.totalEnemies = 0;
    /** @type {!Array} */
    this.particles = [];
    updateEnemyIndex();
    var createFlames;
    (function() {
      /** @type {number} */
      var rWidth = playerWidth;
      /** @type {number} */
      var rIncrease = playerWidth * 0.1;
      /** @type {number} */
      var yWidth = playerWidth * 0.6;
      /** @type {number} */
      var yIncrease = yWidth * 0.2;
      /** @type {number} */
      var halfR = rWidth / 2;
      /** @type {number} */
      var halfY = yWidth / 2;
      /** @type {number} */
      var backoffDelaySeconds = backoffDelay / 2;
      /**
       * @return {undefined}
       */
      createFlames = function() {
        /** @type {!Array} */
        that.flame.r = [[-1 * backoffDelaySeconds, -1 * halfR]];
        /** @type {!Array} */
        that.flame.y = [[-1 * backoffDelaySeconds, -1 * halfY]];
        /** @type {number} */
        var x = 0;
        for (; x < rWidth; x = x + rIncrease) {
          that.flame.r.push([-random(2, 7) - backoffDelaySeconds, x - halfR]);
        }
        that.flame.r.push([-1 * backoffDelaySeconds, halfR]);
        /** @type {number} */
        x = 0;
        for (; x < yWidth; x = x + yIncrease) {
          that.flame.y.push([-random(2, 7) - backoffDelaySeconds, x - halfY]);
        }
        that.flame.y.push([-1 * backoffDelaySeconds, halfY]);
      };
    })();
    createFlames();
    /** @type {!Element} */
    this.gameContainer = document.createElement("div");
    /** @type {string} */
    this.gameContainer.className = "ASTEROIDSYEAH";
    document.body.appendChild(this.gameContainer);
    /** @type {!Element} */
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", w);
    this.canvas.setAttribute("height", h);
    /** @type {string} */
    this.canvas.className = "ASTEROIDSYEAH";
    with(this.canvas.style) {
      width = w + "px";
      height = h + "px";
      /** @type {string} */
      position = "fixed";
      /** @type {string} */
      top = "0px";
      /** @type {string} */
      left = "0px";
      /** @type {string} */
      bottom = "0px";
      /** @type {string} */
      right = "0px";
      /** @type {string} */
      zIndex = "10000";
    }
    if (typeof G_vmlCanvasManager != "undefined") {
      this.canvas = G_vmlCanvasManager.initElement(this.canvas);
      if (!this.canvas.getContext) {
        alert("So... you are using IE?  Sorry but at the moment WebsiteAsteroids only supports Firefox");
      }
    } else {
      if (!this.canvas.getContext) {
        alert("This program does not yet support your browser. Please join me at http://github.com/erkie/erkie.github.com if you think you can help");
      }
    }
    addEvent(this.canvas, "mousedown", function(event) {
      event = event || window.event;
      /** @type {!Element} */
      var message = document.createElement("span");
      /** @type {string} */
      message.style.position = "absolute";
      /** @type {string} */
      message.style.border = "1px solid #999";
      /** @type {string} */
      message.style.background = "white";
      /** @type {string} */
      message.style.color = "black";
      /** @type {string} */
      message.innerHTML = "Press Esc to quit";
      document.body.appendChild(message);
      var navHeightDiff = event.pageX || event.clientX + document.documentElement.scrollLeft;
      var y = event.pageY || event.clientY + document.documentElement.scrollTop;
      /** @type {string} */
      message.style.left = navHeightDiff - message.offsetWidth / 2 + "px";
      /** @type {string} */
      message.style.top = y - message.offsetHeight / 2 + "px";
      setTimeout(function() {
        try {
          message.parentNode.removeChild(message);
        } catch (e) {
        }
      }, 1000);
    });
    /**
     * @return {undefined}
     */
    var eventResize = function() {
      /** @type {string} */
      that.canvas.style.display = "none";
      /** @type {number} */
      w = document.documentElement.clientWidth;
      /** @type {number} */
      h = document.documentElement.clientHeight;
      that.canvas.setAttribute("width", w);
      that.canvas.setAttribute("height", h);
      with(that.canvas.style) {
        /** @type {string} */
        display = "block";
        /** @type {string} */
        width = w + "px";
        /** @type {string} */
        height = h + "px";
      }
    };
    addEvent(window, "resize", eventResize);
    this.gameContainer.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    /** @type {string} */
    this.ctx.fillStyle = "black";
    /** @type {string} */
    this.ctx.strokeStyle = "black";
    if (!document.getElementById("ASTEROIDS-NAVIGATION")) {
      /** @type {!Element} */
      this.navigation = document.createElement("div");
      /** @type {string} */
      this.navigation.id = "ASTEROIDS-NAVIGATION";
      /** @type {string} */
      this.navigation.className = "ASTEROIDSYEAH";
      with(this.navigation.style) {
        /** @type {string} */
        fontFamily = "Arial,sans-serif";
        /** @type {string} */
        position = "fixed";
        /** @type {string} */
        zIndex = "10001";
        /** @type {string} */
        bottom = "10px";
        /** @type {string} */
        right = "10px";
        /** @type {string} */
        textAlign = "right";
      }
      /** @type {string} */
      this.navigation.innerHTML = "(press esc to quit) ";
      this.gameContainer.appendChild(this.navigation);
      /** @type {!Element} */
      this.points = document.createElement("span");
      /** @type {string} */
      this.points.id = "ASTEROIDS-POINTS";
      /** @type {string} */
      this.points.style.font = "28pt Arial, sans-serif";
      /** @type {string} */
      this.points.style.fontWeight = "bold";
      /** @type {string} */
      this.points.className = "ASTEROIDSYEAH";
      this.navigation.appendChild(this.points);
    } else {
      /** @type {(Element|null)} */
      this.navigation = document.getElementById("ASTEROIDS-NAVIGATION");
      /** @type {(Element|null)} */
      this.points = document.getElementById("ASTEROIDS-POINTS");
    }
    clear();
    if (typeof G_vmlCanvasManager != "undefined") {
      var signedTransactions = this.canvas.getElementsByTagName("*");
      /** @type {number} */
      var signedTransactionsCounter = 0;
      var preLi;
      for (; preLi = signedTransactions[signedTransactionsCounter]; signedTransactionsCounter++) {
        addClass(preLi, "ASTEROIDSYEAH");
      }
    }
    /**
     * @param {!Object} event
     * @return {?}
     */
    var eventKeydown = function(event) {
      event = event || window.event;
      /** @type {boolean} */
      that.keysPressed[event.keyCode] = true;
      switch(event.keyCode) {
        case code(" "):
          /** @type {number} */
          that.firedAt = 1;
          break;
      }
      if (indexOf([code("up"), code("down"), code("right"), code("left"), code(" "), code("B"), code("W"), code("A"), code("S"), code("D")], event.keyCode) != -1) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        /** @type {boolean} */
        event.returnValue = false;
        /** @type {boolean} */
        event.cancelBubble = true;
        return false;
      }
    };
    addEvent(document, "keydown", eventKeydown);
    /**
     * @param {!Object} event
     * @return {?}
     */
    var eventKeypress = function(event) {
      event = event || window.event;
      if (indexOf([code("up"), code("down"), code("right"), code("left"), code(" "), code("W"), code("A"), code("S"), code("D")], event.keyCode || event.which) != -1) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        /** @type {boolean} */
        event.returnValue = false;
        /** @type {boolean} */
        event.cancelBubble = true;
        return false;
      }
    };
    addEvent(document, "keypress", eventKeypress);
    /**
     * @param {!Object} event
     * @return {?}
     */
    var eventKeyup = function(event) {
      event = event || window.event;
      /** @type {boolean} */
      that.keysPressed[event.keyCode] = false;
      if (indexOf([code("up"), code("down"), code("right"), code("left"), code(" "), code("B"), code("W"), code("A"), code("S"), code("D")], event.keyCode) != -1) {
        if (event.preventDefault) {
          event.preventDefault();
        }
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        /** @type {boolean} */
        event.returnValue = false;
        /** @type {boolean} */
        event.cancelBubble = true;
        return false;
      }
    };
    addEvent(document, "keyup", eventKeyup);
    /**
     * @return {undefined}
     */
    this.ctx.clear = function() {
      this.clearRect(0, 0, w, h);
    };
    this.ctx.clear();
    /**
     * @param {?} startX
     * @param {?} startY
     * @param {number} x
     * @param {number} y
     * @return {undefined}
     */
    this.ctx.drawLine = function(startX, startY, x, y) {
      this.beginPath();
      this.moveTo(startX, startY);
      this.lineTo(x, y);
      this.lineTo(x + 1, y + 1);
      this.closePath();
      this.fill();
    };
    /**
     * @param {!Array} verts
     * @return {undefined}
     */
    this.ctx.tracePoly = function(verts) {
      this.beginPath();
      this.moveTo(verts[0][0], verts[0][1]);
      /** @type {number} */
      var i = 1;
      for (; i < verts.length; i++) {
        this.lineTo(verts[i][0], verts[i][1]);
      }
      this.closePath();
    };
    /**
     * @return {undefined}
     */
    this.ctx.drawPlayer = function() {
      this.save();
      this.translate(that.pos.x, that.pos.y);
      this.rotate(that.dir.angle());
      this.tracePoly(playerVerts);
      /** @type {string} */
      this.fillStyle = "white";
      this.fill();
      this.tracePoly(playerVerts);
      this.stroke();
      this.restore();
    };
    /** @type {number} */
    var end = Math.PI * 2;
    /**
     * @param {!NodeList} bullets
     * @return {undefined}
     */
    this.ctx.drawBullets = function(bullets) {
      /** @type {number} */
      var i = 0;
      for (; i < bullets.length; i++) {
        this.beginPath();
        this.arc(bullets[i].pos.x, bullets[i].pos.y, radius, 0, end, true);
        this.closePath();
        this.fill();
      }
    };
    /**
     * @return {?}
     */
    var randomParticleColor = function() {
      return ["red", "yellow"][random(0, 1)];
    };
    /**
     * @param {!NodeList} particles
     * @return {undefined}
     */
    this.ctx.drawParticles = function(particles) {
      var fillStyle = this.fillStyle;
      /** @type {number} */
      var i = 0;
      for (; i < particles.length; i++) {
        this.fillStyle = randomParticleColor();
        this.drawLine(particles[i].pos.x, particles[i].pos.y, particles[i].pos.x - particles[i].dir.x * 10, particles[i].pos.y - particles[i].dir.y * 10);
      }
      this.fillStyle = fillStyle;
    };
    /**
     * @param {!Object} flame
     * @return {undefined}
     */
    this.ctx.drawFlames = function(flame) {
      this.save();
      this.translate(that.pos.x, that.pos.y);
      this.rotate(that.dir.angle());
      var strokeStyle = this.strokeStyle;
      /** @type {string} */
      this.strokeStyle = "red";
      this.tracePoly(flame.r);
      this.stroke();
      /** @type {string} */
      this.strokeStyle = "yellow";
      this.tracePoly(flame.y);
      this.stroke();
      this.strokeStyle = strokeStyle;
      this.restore();
    };
    addParticles(this.pos);
    addClass(document.body, "ASTEROIDSYEAH");
    /** @type {boolean} */
    var isRunning = true;
    /** @type {number} */
    var lastLoopTime = (new Date).getTime();
    /**
     * @return {undefined}
     */
    this.update = function() {
      /** @type {boolean} */
      var forceChange = false;
      /** @type {number} */
      var nowTime = (new Date).getTime();
      /** @type {number} */
      var tDelta = (nowTime - lastLoopTime) / 1000;
      /** @type {number} */
      lastLoopTime = nowTime;
      /** @type {boolean} */
      var drawFlame = false;
      if (nowTime - this.updated.flame > 50) {
        createFlames();
        /** @type {number} */
        this.updated.flame = nowTime;
      }
      /** @type {number} */
      this.scrollPos.x = window.pageXOffset || document.documentElement.scrollLeft;
      /** @type {number} */
      this.scrollPos.y = window.pageYOffset || document.documentElement.scrollTop;
      if (this.keysPressed[code("up")] || this.keysPressed[code("W")]) {
        this.vel.add(this.dir.mulNew(acc * tDelta));
        /** @type {boolean} */
        drawFlame = true;
      } else {
        this.vel.mul(0.96);
      }
      if (this.keysPressed[code("left")] || this.keysPressed[code("A")]) {
        /** @type {boolean} */
        forceChange = true;
        this.dir.rotate(radians(rotSpeed * tDelta * -1));
      }
      if (this.keysPressed[code("right")] || this.keysPressed[code("D")]) {
        /** @type {boolean} */
        forceChange = true;
        this.dir.rotate(radians(rotSpeed * tDelta));
      }
      if (this.keysPressed[code(" ")] && nowTime - this.firedAt > timeBetweenFire) {
        this.bullets.unshift({
          "dir" : this.dir.cp(),
          "pos" : this.pos.cp(),
          "startVel" : this.vel.cp(),
          "cameAlive" : nowTime
        });
        /** @type {number} */
        this.firedAt = nowTime;
        if (this.bullets.length > rows) {
          this.bullets.pop();
        }
      }
      if (this.keysPressed[code("B")]) {
        if (!this.updated.enemies) {
          updateEnemyIndex();
          /** @type {boolean} */
          this.updated.enemies = true;
        }
        /** @type {boolean} */
        forceChange = true;
        this.updated.blink.time += tDelta * 1000;
        if (this.updated.blink.time > time) {
          this.toggleBlinkStyle();
          /** @type {number} */
          this.updated.blink.time = 0;
        }
      } else {
        /** @type {boolean} */
        this.updated.enemies = false;
      }
      if (this.keysPressed[code("esc")]) {
        destroy.apply(this);
        return;
      }
      if (this.vel.len() > maxSpeed) {
        this.vel.setLength(maxSpeed);
      }
      this.pos.add(this.vel.mulNew(tDelta));
      if (this.pos.x > w) {
        window.scrollTo(this.scrollPos.x + 50, this.scrollPos.y);
        /** @type {number} */
        this.pos.x = 0;
      } else {
        if (this.pos.x < 0) {
          window.scrollTo(this.scrollPos.x - 50, this.scrollPos.y);
          this.pos.x = w;
        }
      }
      if (this.pos.y > h) {
        window.scrollTo(this.scrollPos.x, this.scrollPos.y + h * 0.75);
        /** @type {number} */
        this.pos.y = 0;
      } else {
        if (this.pos.y < 0) {
          window.scrollTo(this.scrollPos.x, this.scrollPos.y - h * 0.75);
          this.pos.y = h;
        }
      }
      /** @type {number} */
      var i = this.bullets.length - 1;
      for (; i >= 0; i--) {
        if (nowTime - this.bullets[i].cameAlive > 2000) {
          this.bullets.splice(i, 1);
          /** @type {boolean} */
          forceChange = true;
          continue;
        }
        var bulletVel = this.bullets[i].dir.setLengthNew(bulletSpeed * tDelta).add(this.bullets[i].startVel.mulNew(tDelta));
        this.bullets[i].pos.add(bulletVel);
        boundsCheck(this.bullets[i].pos);
        var murdered = getElementFromPoint(this.bullets[i].pos.x, this.bullets[i].pos.y);
        if (murdered && murdered.tagName && indexOf(ignoredTypes, murdered.tagName.toUpperCase()) == -1 && hasOnlyTextualChildren(murdered) && murdered.className != "ASTEROIDSYEAH") {
          /** @type {boolean} */
          didKill = true;
          addParticles(this.bullets[i].pos);
          this.dying.push(murdered);
          this.bullets.splice(i, 1);
          continue;
        }
      }
      if (this.dying.length) {
        /** @type {number} */
        i = this.dying.length - 1;
        for (; i >= 0; i--) {
          try {
            if (this.dying[i].parentNode) {
              window.ASTEROIDS.enemiesKilled++;
            }
            this.dying[i].parentNode.removeChild(this.dying[i]);
          } catch (e) {
          }
        }
        clear();
        /** @type {!Array} */
        this.dying = [];
      }
      /** @type {number} */
      i = this.particles.length - 1;
      for (; i >= 0; i--) {
        this.particles[i].pos.add(this.particles[i].dir.mulNew(particleSpeed * tDelta * Math.random()));
        if (nowTime - this.particles[i].cameAlive > 1000) {
          this.particles.splice(i, 1);
          /** @type {boolean} */
          forceChange = true;
          continue;
        }
      }
      if (forceChange || this.bullets.length != 0 || this.particles.length != 0 || !this.pos.is(this.lastPos) || this.vel.len() > 0) {
        this.ctx.clear();
        this.ctx.drawPlayer();
        if (drawFlame) {
          this.ctx.drawFlames(that.flame);
        }
        if (this.bullets.length) {
          this.ctx.drawBullets(this.bullets);
        }
        if (this.particles.length) {
          this.ctx.drawParticles(this.particles);
        }
      }
      this.lastPos = this.pos;
      setTimeout(updateFunc, 1000 / maxFPS);
    };
    /**
     * @return {undefined}
     */
    var updateFunc = function() {
      that.update.call(that);
    };
    setTimeout(updateFunc, 1000 / maxFPS);
  }
  if (!window.ASTEROIDSPLAYERS) {
    /** @type {!Array} */
    window.ASTEROIDSPLAYERS = [];
  }
  if (window.ActiveXObject) {
    try {
      /** @type {!Element} */
      var tag_script = document.createElement("script");
      tag_script.setAttribute("type", "text/xaml");
      /** @type {string} */
      tag_script.textContent = '<?xml version="1.0"?><Canvas xmlns="http://schemas.microsoft.com/client/2007"></Canvas>';
      document.getElementsByTagName("head")[0].appendChild(tag_script);
    } catch (e) {
    }
    /** @type {!Element} */
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    /**
     * @return {undefined}
     */
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        if (typeof G_vmlCanvasManager != "undefined") {
          window.ASTEROIDSPLAYERS[window.ASTEROIDSPLAYERS.length] = new Asteroids;
        }
      }
    };
    /** @type {string} */
    script.src = "http://erkie.github.com/excanvas.js";
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    window.ASTEROIDSPLAYERS[window.ASTEROIDSPLAYERS.length] = new Asteroids;
  }
})();
