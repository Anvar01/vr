function makeMaze(mazeSeeds) {
  var iteration = 0;
  !(function a(b, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!b[g]) {
          var i = "function" == typeof require && require;
          if (!h && i) return i(g, !0);
          if (f) return f(g, !0);
          var j = new Error("Cannot find module '" + g + "'");
          throw ((j.code = "MODULE_NOT_FOUND"), j);
        }
        var k = (c[g] = {
          exports: {},
        });
        b[g][0].call(
          k.exports,
          function (a) {
            var c = b[g][1][a];
            return e(c ? c : a);
          },
          k,
          k.exports,
          a,
          b,
          c,
          d
        );
      }
      return c[g].exports;
    }
    for (
      var f = "function" == typeof require && require, g = 0;
      g < d.length;
      g++
    )
      e(d[g]);
    return e;
  })(
    {
      1: [
        function (a, b, c) {
          "use strict";
          !(function () {
            if ("undefined" == typeof AFRAME)
              return void console.error(
                "Component attempted to register before AFRAME was available."
              );
            var b = a("./modules/index");
            console.log(b.Component.name() + ": " + b.Component.version());
            var c = {
                maze: b.Component,
              },
              d = {};
            Object.keys(c).forEach(function (a) {
              AFRAME.aframeCore
                ? AFRAME.aframeCore.registerComponent(a, c[a])
                : AFRAME.registerComponent(a, c[a]);
            }),
              Object.keys(d).forEach(function (a) {
                AFRAME.aframeCore
                  ? AFRAME.aframeCore.registerPrimitive(a, d[a])
                  : AFRAME.registerPrimitive(a, d[a]);
              });
          })();
        },
        {
          "./modules/index": 2,
        },
      ],
      2: [
        function (a, b, c) {
          "use strict";
          var d = a("@mitchallen/maze-generator-square"),
            e = null,
            f = a("../upcoming-info").name,
            g = a("../upcoming-info").upcoming.version;
          b.exports.Component = {
            version: function () {
              return g;
            },
            name: function () {
              return f;
            },
            dependencies: ["position", "rotation"],
            schema: {
              enabled: {
                default: !0,
              },
              size: {
                type: "vec2",
                default: {
                  x: 5,
                  y: 6,
                },
              },
              open: {
                default: "",
              },
              wall: {
                default: "",
              },
              cap: {
                default: "",
              },
            },
            init: function () {
              this.mazeData = {};
              var a = this.data.wall;
              a = "#" == a[0] ? a.substring(1) : a;
              var b = document.getElementById(a);
              b
                ? ((this.mazeData.wallWidth = b.getAttribute("width")),
                  (this.mazeData.wallDepth = b.getAttribute("depth")),
                  (this.mazeData.wallHeight = b.getAttribute("height")))
                : ((this.mazeData.wallWidth = 4),
                  (this.mazeData.wallDepth = 1),
                  (this.mazeData.wallHeight = 1)),
                this.buildCapInfo(),
                this.buildOpenSpec();
            },
            buildCapInfo: function () {
              var a = this.data.cap.split(" "),
                b = "",
                c = 0;
              a.length > 0 &&
                ((b = a[0]),
                (b = "#" == b[0] ? b.substring(1) : b),
                a[1] && (c = parseFloat(a[1]))),
                (this.mazeData.capId = b),
                (this.mazeData.capHeight = c);
            },
            buildOpenSpec: function () {
              var a = {
                  N: [],
                  E: [],
                  W: [],
                  S: [],
                },
                b = this.data.open.split(" "),
                c = null;
              for (var d in b) {
                var e = b[d];
                ["N", "E", "W", "S"].indexOf(e) >= 0
                  ? (c = e)
                  : c && a[c].push(parseInt(e, 10));
              }
              this.mazeData.openSpec = [];
              for (var f in a) {
                var g = a[f];
                this.mazeData.openSpec.push({
                  border: f,
                  list: g,
                });
              }
            },
            drawMazeWall: function (a) {
              a = a || {};
              var b = a.position || {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                c = a.rotation || {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                d = a.cap || !1,
                e = d ? this.mazeData.capId : this.data.wall;
              e = "#" == e[0] ? e.substring(1) : e;
              var f = null,
                g = document.getElementById(e);
              if (g) (f = g.cloneNode(!0)), this.el.appendChild(f);
              else {
                if (d) return !0;
                (f = document.createElement("a-box")),
                  this.el.appendChild(f),
                  f.setAttribute("color", "tomato"),
                  f.setAttribute("width", this.mazeData.wallWidth),
                  f.setAttribute("depth", this.mazeData.wallDepth),
                  f.setAttribute("height", this.mazeData.wallHeight),
                  f.setAttribute("static-body", "");
              }
              f.setAttribute("rotation", c), f.setAttribute("position", b);
            },
            update: function () {
              if (this.data.enabled && this.data.size) {
                var a = this.data.size.x,
                  b = this.data.size.y;
                e = d.create({
                  x: a,
                  y: b,
                });
                var c = {};
                this.mazeData.openSpec && (c.open = this.mazeData.openSpec),
                  e.generate(c),
                  e.printBoard();
                for (
                  var f = this.mazeData.wallWidth,
                    g = (this.mazeData.wallDepth, this.mazeData.wallHeight, f),
                    h = 0,
                    i = ((a + 1) * f) / 2,
                    j = ((b + 1) * f) / 2,
                    k = -1;
                  k < b;
                  k++
                )
                  for (var l = -1; l < a; l++) {
                    var m = i + (l - a) * f,
                      n = j + (k - b) * f;
                    this.drawMazeWall({
                      position: {
                        x: m + g / 2,
                        y: this.mazeData.capHeight,
                        z: n + g / 2,
                      },
                      cap: !0,
                    }),
                      e.connects(l, k, "S") ||
                        !(l >= 0) ||
                        (k === -1 && e.connects(l, 0, "N")) ||
                        this.drawMazeWall({
                          position: {
                            x: m,
                            y: h,
                            z: n + g / 2,
                          },
                        }),
                      e.connects(l, k, "E") ||
                        !(k >= 0) ||
                        (l === -1 && e.connects(0, k, "W")) ||
                        this.drawMazeWall({
                          position: {
                            x: m + g / 2,
                            y: h,
                            z: n,
                          },
                          rotation: {
                            x: 0,
                            y: 90,
                            z: 0,
                          },
                        });
                  }
              }
            },
            remove: function () {},
          };
        },
        {
          "../upcoming-info": 4,
          "@mitchallen/maze-generator-square": 3,
        },
      ],
      3: [
        function (a, b, c) {
          (function (d) {
            !(function (a) {
              if ("object" == typeof c && "undefined" != typeof b)
                b.exports = a();
              else if ("function" == typeof define && define.amd) define([], a);
              else {
                var e;
                (e =
                  "undefined" != typeof window
                    ? window
                    : "undefined" != typeof d
                    ? d
                    : "undefined" != typeof self
                    ? self
                    : this),
                  ((e.MitchAllen || (e.MitchAllen = {})).MazeGeneratorSquare =
                    a());
              }
            })(function () {
              var b;
              return (function b(c, d, e) {
                function f(h, i) {
                  if (!d[h]) {
                    if (!c[h]) {
                      var j = "function" == typeof a && a;
                      if (!i && j) return j(h, !0);
                      if (g) return g(h, !0);
                      var k = new Error("Cannot find module '" + h + "'");
                      throw ((k.code = "MODULE_NOT_FOUND"), k);
                    }
                    var l = (d[h] = {
                      exports: {},
                    });
                    c[h][0].call(
                      l.exports,
                      function (a) {
                        var b = c[h][1][a];
                        return f(b ? b : a);
                      },
                      l,
                      l.exports,
                      b,
                      c,
                      d,
                      e
                    );
                  }
                  return d[h].exports;
                }
                for (
                  var g = "function" == typeof a && a, h = 0;
                  h < e.length;
                  h++
                )
                  f(e[h]);
                return f;
              })(
                {
                  1: [
                    function (a, b, c) {
                      "use strict";
                      var d = a("@mitchallen/connection-grid-square"),
                        e = a("@mitchallen/maze-generator-core");
                      b.exports.create = function (a) {
                        a = a || {};
                        var b = a.x || 0,
                          c = a.y || 0,
                          f = {
                            x: b,
                            y: c,
                          },
                          g = d.create(f),
                          h = e.create({
                            grid: g,
                          });
                        return Object.assign(h, {
                          afterGenerate: function (a) {
                            a = a || {};
                            var d = a.open || [];
                            if (0 !== d.length) {
                              var e = ["N", "E", "W", "S"];
                              for (var f in d) {
                                var g = d[f];
                                if (e.indexOf(g.border) >= 0) {
                                  var h = g.list;
                                  if (!h) {
                                    console.error(
                                      "ERROR: open border requires list parameter."
                                    );
                                    continue;
                                  }
                                  for (var i in h) {
                                    var j = h[i];
                                    "N" === g.border &&
                                      j >= 0 &&
                                      j < b &&
                                      this.open(j, 0, "N"),
                                      "S" === g.border &&
                                        j >= 0 &&
                                        j < b &&
                                        this.open(j, c - 1, "S"),
                                      "W" === g.border &&
                                        j >= 0 &&
                                        j < c &&
                                        this.open(0, j, "W"),
                                      "E" === g.border &&
                                        j >= 0 &&
                                        j < c &&
                                        this.open(b - 1, j, "E");
                                  }
                                } else
                                  console.error(
                                    "ERROR: open.border ('%s') not found",
                                    g.border
                                  );
                              }
                            }
                          },
                          printBoard: function () {
                            console.log("MAZE: %d, %d", b, c);
                            for (var a = "", d = 0; d < b; d++)
                              (a += 0 === d ? " " : ""),
                                (a += this.connects(d, 0, "N") ? "  " : "__");
                            console.log(a);
                            for (var e = this.dirMap, f = 0; f < c; f++) {
                              for (
                                var g = this.connects(0, f, "W") ? " " : "|",
                                  h = 0;
                                h < b;
                                h++
                              )
                                (g += this.connects(h, f, "S") ? " " : "_"),
                                  (g += this.connects(h, f, "E")
                                    ? 0 !==
                                      ((this.get(h, f) | this.get(h + 1, f)) &
                                        e.S)
                                      ? " "
                                      : "_"
                                    : "|");
                              console.log(g);
                            }
                          },
                        });
                      };
                    },
                    {
                      "@mitchallen/connection-grid-square": 2,
                      "@mitchallen/maze-generator-core": 3,
                    },
                  ],
                  2: [
                    function (a, c, e) {
                      (function (d) {
                        !(function (a) {
                          if ("object" == typeof e && "undefined" != typeof c)
                            c.exports = a();
                          else if ("function" == typeof b && b.amd) b([], a);
                          else {
                            var f;
                            (f =
                              "undefined" != typeof window
                                ? window
                                : "undefined" != typeof d
                                ? d
                                : "undefined" != typeof self
                                ? self
                                : this),
                              ((
                                f.MitchAllen || (f.MitchAllen = {})
                              ).ConnectionGridSquare = a());
                          }
                        })(function () {
                          var b;
                          return (function b(c, d, e) {
                            function f(h, i) {
                              if (!d[h]) {
                                if (!c[h]) {
                                  var j = "function" == typeof a && a;
                                  if (!i && j) return j(h, !0);
                                  if (g) return g(h, !0);
                                  var k = new Error(
                                    "Cannot find module '" + h + "'"
                                  );
                                  throw ((k.code = "MODULE_NOT_FOUND"), k);
                                }
                                var l = (d[h] = {
                                  exports: {},
                                });
                                c[h][0].call(
                                  l.exports,
                                  function (a) {
                                    var b = c[h][1][a];
                                    return f(b ? b : a);
                                  },
                                  l,
                                  l.exports,
                                  b,
                                  c,
                                  d,
                                  e
                                );
                              }
                              return d[h].exports;
                            }
                            for (
                              var g = "function" == typeof a && a, h = 0;
                              h < e.length;
                              h++
                            )
                              f(e[h]);
                            return f;
                          })(
                            {
                              1: [
                                function (a, b, c) {
                                  "use strict";
                                  var d = a("@mitchallen/grid-square"),
                                    e = a(
                                      "@mitchallen/connection-grid-core"
                                    ).create;
                                  b.exports.create = function (a) {
                                    a = a || {};
                                    var b = a.x || 0,
                                      c = a.y || 0,
                                      f = d.create({
                                        x: b,
                                        y: c,
                                      });
                                    f.fill(0);
                                    var g = {
                                        N: 16,
                                        S: 32,
                                        E: 64,
                                        W: 128,
                                      },
                                      h = {
                                        E: "W",
                                        W: "E",
                                        N: "S",
                                        S: "N",
                                      },
                                      i = e({
                                        grid: f,
                                        dirMap: g,
                                        oppositeMap: h,
                                      });
                                    return (
                                      Object.assign(i, {
                                        getNeighbor: function (a, b, c) {
                                          if (!this.isCell(a, b)) return null;
                                          if (!this.isDir(c)) return null;
                                          var d = {
                                              E: 1,
                                              W: -1,
                                              N: 0,
                                              S: 0,
                                            },
                                            e = {
                                              E: 0,
                                              W: 0,
                                              N: -1,
                                              S: 1,
                                            },
                                            f = a + d[c],
                                            g = b + e[c];
                                          return this.isCell(f, g)
                                            ? {
                                                x: f,
                                                y: g,
                                              }
                                            : null;
                                        },
                                        getNeighborDirs: function (a, b) {
                                          return ["N", "S", "E", "W"];
                                        },
                                      }),
                                      i
                                    );
                                  };
                                },
                                {
                                  "@mitchallen/connection-grid-core": 2,
                                  "@mitchallen/grid-square": 3,
                                },
                              ],
                              2: [
                                function (a, c, e) {
                                  (function (d) {
                                    !(function (a) {
                                      if (
                                        "object" == typeof e &&
                                        "undefined" != typeof c
                                      )
                                        c.exports = a();
                                      else if ("function" == typeof b && b.amd)
                                        b([], a);
                                      else {
                                        var f;
                                        (f =
                                          "undefined" != typeof window
                                            ? window
                                            : "undefined" != typeof d
                                            ? d
                                            : "undefined" != typeof self
                                            ? self
                                            : this),
                                          ((
                                            f.MitchAllen || (f.MitchAllen = {})
                                          ).ConnectionGridCore = a());
                                      }
                                    })(function () {
                                      var b;
                                      return (function b(c, d, e) {
                                        function f(h, i) {
                                          if (!d[h]) {
                                            if (!c[h]) {
                                              var j =
                                                "function" == typeof a && a;
                                              if (!i && j) return j(h, !0);
                                              if (g) return g(h, !0);
                                              var k = new Error(
                                                "Cannot find module '" + h + "'"
                                              );
                                              throw (
                                                ((k.code = "MODULE_NOT_FOUND"),
                                                k)
                                              );
                                            }
                                            var l = (d[h] = {
                                              exports: {},
                                            });
                                            c[h][0].call(
                                              l.exports,
                                              function (a) {
                                                var b = c[h][1][a];
                                                return f(b ? b : a);
                                              },
                                              l,
                                              l.exports,
                                              b,
                                              c,
                                              d,
                                              e
                                            );
                                          }
                                          return d[h].exports;
                                        }
                                        for (
                                          var g = "function" == typeof a && a,
                                            h = 0;
                                          h < e.length;
                                          h++
                                        )
                                          f(e[h]);
                                        return f;
                                      })(
                                        {
                                          1: [
                                            function (a, b, c) {
                                              "use strict";
                                              var d = a("@mitchallen/shuffle");
                                              b.exports.create = function (a) {
                                                a = a || {};
                                                var b = a.grid,
                                                  c = a.dirMap || {},
                                                  e = a.oppositeMap || {};
                                                if (!b) return null;
                                                var f = 1,
                                                  g = 2;
                                                return (
                                                  Object.defineProperties(b, {
                                                    dirMap: {
                                                      writeable: !1,
                                                      value: c,
                                                      enumerable: !0,
                                                      configurable: !0,
                                                    },
                                                  }),
                                                  Object.assign(b, {
                                                    isDir: function (a) {
                                                      return (
                                                        "string" == typeof a &&
                                                        void 0 !== c[a]
                                                      );
                                                    },
                                                    getOppositeDir: function (
                                                      a
                                                    ) {
                                                      return this.isDir(a)
                                                        ? e[a]
                                                        : null;
                                                    },
                                                    getNeighbor: function (
                                                      a,
                                                      b,
                                                      c
                                                    ) {
                                                      return (
                                                        console.log(
                                                          "getNeighbor should be overriden by derived class"
                                                        ),
                                                        null
                                                      );
                                                    },
                                                    getNeighborDirs: function (
                                                      a,
                                                      b
                                                    ) {
                                                      return (
                                                        console.log(
                                                          "getNeighborDirs should be overriden by derived class"
                                                        ),
                                                        []
                                                      );
                                                    },
                                                    getShuffledNeighborDirs:
                                                      function (a, b) {
                                                        var c = d.create({
                                                          array:
                                                            this.getNeighborDirs(
                                                              a,
                                                              b
                                                            ),
                                                        });
                                                        return c.shuffle();
                                                      },
                                                    markVisited: function (
                                                      a,
                                                      b
                                                    ) {
                                                      return this.set(
                                                        a,
                                                        b,
                                                        this.get(a, b) | f
                                                      );
                                                    },
                                                    visited: function (a, b) {
                                                      return (
                                                        !!this.isCell(a, b) &&
                                                        0 !==
                                                          (this.get(a, b) & f)
                                                      );
                                                    },
                                                    mask: function (a, b) {
                                                      return this.set(
                                                        a,
                                                        b,
                                                        this.get(a, b) | g
                                                      );
                                                    },
                                                    isMasked: function (a, b) {
                                                      return (
                                                        !!this.isCell(a, b) &&
                                                        0 !==
                                                          (this.get(a, b) & g)
                                                      );
                                                    },
                                                    hasConnections: function (
                                                      a,
                                                      b
                                                    ) {
                                                      var d = this.get(a, b);
                                                      if (null === d) return !1;
                                                      if (0 === d) return !1;
                                                      var e =
                                                        this.getNeighborDirs(
                                                          a,
                                                          b
                                                        );
                                                      for (var f in e) {
                                                        var g = e[f];
                                                        if (!this.isDir(g))
                                                          return (
                                                            console.error(
                                                              "hasConnections unknown direction: ",
                                                              g
                                                            ),
                                                            !1
                                                          );
                                                        var h = c[g];
                                                        if (0 !== (d & h))
                                                          return !0;
                                                      }
                                                      return !1;
                                                    },
                                                    open: function (a, b, d) {
                                                      return (
                                                        !!this.isDir(d) &&
                                                        this.set(
                                                          a,
                                                          b,
                                                          this.get(a, b) | c[d]
                                                        )
                                                      );
                                                    },
                                                    connect: function (
                                                      a,
                                                      b,
                                                      c
                                                    ) {
                                                      return (
                                                        !!this.getNeighbor(
                                                          a,
                                                          b,
                                                          c
                                                        ) && this.open(a, b, c)
                                                      );
                                                    },
                                                    connectUndirected:
                                                      function (a, b, c) {
                                                        if (
                                                          !this.connect(a, b, c)
                                                        )
                                                          return !1;
                                                        var d =
                                                          this.getNeighbor(
                                                            a,
                                                            b,
                                                            c
                                                          );
                                                        return !!this.connect(
                                                          d.x,
                                                          d.y,
                                                          e[c]
                                                        );
                                                      },
                                                    connects: function (
                                                      a,
                                                      b,
                                                      d
                                                    ) {
                                                      if (!this.isDir(d))
                                                        return (
                                                          console.error(
                                                            "connects unknown direction: ",
                                                            d
                                                          ),
                                                          !1
                                                        );
                                                      var e = this.get(a, b);
                                                      if (null === e) return !1;
                                                      var f = c[d];
                                                      return 0 !== (e & f);
                                                    },
                                                    connectsAny: function (
                                                      a,
                                                      b,
                                                      c
                                                    ) {
                                                      var d = this,
                                                        e = !1;
                                                      return (
                                                        c.forEach(function (c) {
                                                          d.connects(a, b, c) &&
                                                            (e = !0);
                                                        }),
                                                        e
                                                      );
                                                    },
                                                  })
                                                );
                                              };
                                            },
                                            {
                                              "@mitchallen/shuffle": 2,
                                            },
                                          ],
                                          2: [
                                            function (a, c, e) {
                                              (function (d) {
                                                !(function (a) {
                                                  if (
                                                    "object" == typeof e &&
                                                    "undefined" != typeof c
                                                  )
                                                    c.exports = a();
                                                  else if (
                                                    "function" == typeof b &&
                                                    b.amd
                                                  )
                                                    b([], a);
                                                  else {
                                                    var f;
                                                    (f =
                                                      "undefined" !=
                                                      typeof window
                                                        ? window
                                                        : "undefined" !=
                                                          typeof d
                                                        ? d
                                                        : "undefined" !=
                                                          typeof self
                                                        ? self
                                                        : this),
                                                      ((
                                                        f.MitchAllen ||
                                                        (f.MitchAllen = {})
                                                      ).Shuffle = a());
                                                  }
                                                })(function () {
                                                  return (function b(c, d, e) {
                                                    function f(h, i) {
                                                      if (!d[h]) {
                                                        if (!c[h]) {
                                                          var j =
                                                            "function" ==
                                                              typeof a && a;
                                                          if (!i && j)
                                                            return j(h, !0);
                                                          if (g)
                                                            return g(h, !0);
                                                          var k = new Error(
                                                            "Cannot find module '" +
                                                              h +
                                                              "'"
                                                          );
                                                          throw (
                                                            ((k.code =
                                                              "MODULE_NOT_FOUND"),
                                                            k)
                                                          );
                                                        }
                                                        var l = (d[h] = {
                                                          exports: {},
                                                        });
                                                        c[h][0].call(
                                                          l.exports,
                                                          function (a) {
                                                            var b = c[h][1][a];
                                                            return f(b ? b : a);
                                                          },
                                                          l,
                                                          l.exports,
                                                          b,
                                                          c,
                                                          d,
                                                          e
                                                        );
                                                      }
                                                      return d[h].exports;
                                                    }
                                                    for (
                                                      var g =
                                                          "function" ==
                                                            typeof a && a,
                                                        h = 0;
                                                      h < e.length;
                                                      h++
                                                    )
                                                      f(e[h]);
                                                    return f;
                                                  })(
                                                    {
                                                      1: [
                                                        function (a, b, c) {
                                                          "use strict";
                                                          b.exports.create =
                                                            function (a) {
                                                              if (!a)
                                                                return null;
                                                              if (!a.array)
                                                                return null;
                                                              var b =
                                                                a.array.slice(
                                                                  0
                                                                );
                                                              return {
                                                                shuffle:
                                                                  function () {
                                                                    var a = 0,
                                                                      c = 0,
                                                                      d = null;
                                                                    for (
                                                                      a =
                                                                        b.length -
                                                                        1;
                                                                      a > 0;
                                                                      a -= 1
                                                                    )
                                                                      (c =
                                                                        Math.floor(
                                                                          mazeSeeds[
                                                                            iteration
                                                                          ] *
                                                                            (a +
                                                                              1)
                                                                        )),
                                                                        (d =
                                                                          b[a]),
                                                                        (b[a] =
                                                                          b[c]),
                                                                        (b[c] =
                                                                          d);
                                                                    iteration++;
                                                                    mazeSeeds.push(
                                                                      c
                                                                    );
                                                                    return b;
                                                                  },
                                                              };
                                                            };
                                                        },
                                                        {},
                                                      ],
                                                    },
                                                    {},
                                                    [1]
                                                  )(1);
                                                });
                                              }).call(
                                                this,
                                                "undefined" != typeof d
                                                  ? d
                                                  : "undefined" != typeof self
                                                  ? self
                                                  : "undefined" != typeof window
                                                  ? window
                                                  : {}
                                              );
                                            },
                                            {},
                                          ],
                                        },
                                        {},
                                        [1]
                                      )(1);
                                    });
                                  }).call(
                                    this,
                                    "undefined" != typeof d
                                      ? d
                                      : "undefined" != typeof self
                                      ? self
                                      : "undefined" != typeof window
                                      ? window
                                      : {}
                                  );
                                },
                                {},
                              ],
                              3: [
                                function (a, c, e) {
                                  (function (d) {
                                    !(function (a) {
                                      if (
                                        "object" == typeof e &&
                                        "undefined" != typeof c
                                      )
                                        c.exports = a();
                                      else if ("function" == typeof b && b.amd)
                                        b([], a);
                                      else {
                                        var f;
                                        (f =
                                          "undefined" != typeof window
                                            ? window
                                            : "undefined" != typeof d
                                            ? d
                                            : "undefined" != typeof self
                                            ? self
                                            : this),
                                          ((
                                            f.MitchAllen || (f.MitchAllen = {})
                                          ).GridSquare = a());
                                      }
                                    })(function () {
                                      var b;
                                      return (function b(c, d, e) {
                                        function f(h, i) {
                                          if (!d[h]) {
                                            if (!c[h]) {
                                              var j =
                                                "function" == typeof a && a;
                                              if (!i && j) return j(h, !0);
                                              if (g) return g(h, !0);
                                              var k = new Error(
                                                "Cannot find module '" + h + "'"
                                              );
                                              throw (
                                                ((k.code = "MODULE_NOT_FOUND"),
                                                k)
                                              );
                                            }
                                            var l = (d[h] = {
                                              exports: {},
                                            });
                                            c[h][0].call(
                                              l.exports,
                                              function (a) {
                                                var b = c[h][1][a];
                                                return f(b ? b : a);
                                              },
                                              l,
                                              l.exports,
                                              b,
                                              c,
                                              d,
                                              e
                                            );
                                          }
                                          return d[h].exports;
                                        }
                                        for (
                                          var g = "function" == typeof a && a,
                                            h = 0;
                                          h < e.length;
                                          h++
                                        )
                                          f(e[h]);
                                        return f;
                                      })(
                                        {
                                          1: [
                                            function (a, b, c) {
                                              "use strict";
                                              var d = a(
                                                "@mitchallen/grid-core"
                                              );
                                              b.exports.create = function (a) {
                                                a = a || {};
                                                var b = a.x || 0,
                                                  c = a.y || 0;
                                                (b = Math.max(b, 0)),
                                                  (c = Math.max(c, 0));
                                                for (
                                                  var e = d.create({
                                                      rows: b,
                                                    }),
                                                    f = 0;
                                                  f < b;
                                                  f++
                                                )
                                                  for (var g = 0; g < c; g++)
                                                    e.set(f, g, 0);
                                                return (
                                                  Object.defineProperties(e, {
                                                    xSize: {
                                                      writeable: !1,
                                                      value: b,
                                                      enumerable: !0,
                                                    },
                                                    ySize: {
                                                      writeable: !1,
                                                      value: c,
                                                      enumerable: !0,
                                                    },
                                                  }),
                                                  e
                                                );
                                              };
                                            },
                                            {
                                              "@mitchallen/grid-core": 2,
                                            },
                                          ],
                                          2: [
                                            function (a, c, e) {
                                              (function (d) {
                                                !(function (a) {
                                                  if (
                                                    "object" == typeof e &&
                                                    "undefined" != typeof c
                                                  )
                                                    c.exports = a();
                                                  else if (
                                                    "function" == typeof b &&
                                                    b.amd
                                                  )
                                                    b([], a);
                                                  else {
                                                    var f;
                                                    (f =
                                                      "undefined" !=
                                                      typeof window
                                                        ? window
                                                        : "undefined" !=
                                                          typeof d
                                                        ? d
                                                        : "undefined" !=
                                                          typeof self
                                                        ? self
                                                        : this),
                                                      ((
                                                        f.MitchAllen ||
                                                        (f.MitchAllen = {})
                                                      ).GridCore = a());
                                                  }
                                                })(function () {
                                                  return (function b(c, d, e) {
                                                    function f(h, i) {
                                                      if (!d[h]) {
                                                        if (!c[h]) {
                                                          var j =
                                                            "function" ==
                                                              typeof a && a;
                                                          if (!i && j)
                                                            return j(h, !0);
                                                          if (g)
                                                            return g(h, !0);
                                                          var k = new Error(
                                                            "Cannot find module '" +
                                                              h +
                                                              "'"
                                                          );
                                                          throw (
                                                            ((k.code =
                                                              "MODULE_NOT_FOUND"),
                                                            k)
                                                          );
                                                        }
                                                        var l = (d[h] = {
                                                          exports: {},
                                                        });
                                                        c[h][0].call(
                                                          l.exports,
                                                          function (a) {
                                                            var b = c[h][1][a];
                                                            return f(b ? b : a);
                                                          },
                                                          l,
                                                          l.exports,
                                                          b,
                                                          c,
                                                          d,
                                                          e
                                                        );
                                                      }
                                                      return d[h].exports;
                                                    }
                                                    for (
                                                      var g =
                                                          "function" ==
                                                            typeof a && a,
                                                        h = 0;
                                                      h < e.length;
                                                      h++
                                                    )
                                                      f(e[h]);
                                                    return f;
                                                  })(
                                                    {
                                                      1: [
                                                        function (a, b, c) {
                                                          "use strict";
                                                          b.exports.create =
                                                            function (a) {
                                                              a = a || {};
                                                              var b =
                                                                a.rows || 0;
                                                              b = Math.max(
                                                                b,
                                                                0
                                                              );
                                                              for (
                                                                var c = [];
                                                                c.push([]) < b;

                                                              );
                                                              var d =
                                                                Object.create(
                                                                  {},
                                                                  {
                                                                    rows: {
                                                                      writeable:
                                                                        !1,
                                                                      value: b,
                                                                      enumerable:
                                                                        !0,
                                                                    },
                                                                  }
                                                                );
                                                              return Object.assign(
                                                                d,
                                                                {
                                                                  log: function () {
                                                                    console.log(
                                                                      "size: %d: ",
                                                                      b
                                                                    ),
                                                                      console.log(
                                                                        c
                                                                      );
                                                                  },
                                                                  rowSize:
                                                                    function (
                                                                      a
                                                                    ) {
                                                                      return a <
                                                                        0 ||
                                                                        a >= b
                                                                        ? 0
                                                                        : c[a]
                                                                            .length;
                                                                    },
                                                                  isCell:
                                                                    function (
                                                                      a,
                                                                      c
                                                                    ) {
                                                                      var d =
                                                                        this.rowSize(
                                                                          a
                                                                        );
                                                                      return (
                                                                        a >=
                                                                          0 &&
                                                                        a < b &&
                                                                        c >=
                                                                          0 &&
                                                                        c < d
                                                                      );
                                                                    },
                                                                  set: function (
                                                                    a,
                                                                    b,
                                                                    d
                                                                  ) {
                                                                    return (
                                                                      !(
                                                                        a < 0 ||
                                                                        b < 0
                                                                      ) &&
                                                                      ((c[a][
                                                                        b
                                                                      ] = d),
                                                                      !0)
                                                                    );
                                                                  },
                                                                  get: function (
                                                                    a,
                                                                    b
                                                                  ) {
                                                                    return this.isCell(
                                                                      a,
                                                                      b
                                                                    )
                                                                      ? c[a][b]
                                                                      : null;
                                                                  },
                                                                  fill: function (
                                                                    a
                                                                  ) {
                                                                    for (
                                                                      var d = 0;
                                                                      d < b;
                                                                      d++
                                                                    )
                                                                      for (
                                                                        var e =
                                                                            this.rowSize(
                                                                              d
                                                                            ),
                                                                          f = 0;
                                                                        f < e;
                                                                        f++
                                                                      )
                                                                        c[d][
                                                                          f
                                                                        ] = a;
                                                                  },
                                                                  cloneArray:
                                                                    function () {
                                                                      for (
                                                                        var a =
                                                                          [];
                                                                        a.push(
                                                                          []
                                                                        ) < b;

                                                                      );
                                                                      for (
                                                                        var d = 0;
                                                                        d < b;
                                                                        d++
                                                                      )
                                                                        for (
                                                                          var e =
                                                                              this.rowSize(
                                                                                d
                                                                              ),
                                                                            f = 0;
                                                                          f < e;
                                                                          f++
                                                                        )
                                                                          a[d][
                                                                            f
                                                                          ] =
                                                                            c[
                                                                              d
                                                                            ][
                                                                              f
                                                                            ];
                                                                      return a;
                                                                    },
                                                                }
                                                              );
                                                            };
                                                        },
                                                        {},
                                                      ],
                                                    },
                                                    {},
                                                    [1]
                                                  )(1);
                                                });
                                              }).call(
                                                this,
                                                "undefined" != typeof d
                                                  ? d
                                                  : "undefined" != typeof self
                                                  ? self
                                                  : "undefined" != typeof window
                                                  ? window
                                                  : {}
                                              );
                                            },
                                            {},
                                          ],
                                        },
                                        {},
                                        [1]
                                      )(1);
                                    });
                                  }).call(
                                    this,
                                    "undefined" != typeof d
                                      ? d
                                      : "undefined" != typeof self
                                      ? self
                                      : "undefined" != typeof window
                                      ? window
                                      : {}
                                  );
                                },
                                {},
                              ],
                            },
                            {},
                            [1]
                          )(1);
                        });
                      }).call(
                        this,
                        "undefined" != typeof d
                          ? d
                          : "undefined" != typeof self
                          ? self
                          : "undefined" != typeof window
                          ? window
                          : {}
                      );
                    },
                    {},
                  ],
                  3: [
                    function (a, c, e) {
                      (function (d) {
                        !(function (a) {
                          if ("object" == typeof e && "undefined" != typeof c)
                            c.exports = a();
                          else if ("function" == typeof b && b.amd) b([], a);
                          else {
                            var f;
                            (f =
                              "undefined" != typeof window
                                ? window
                                : "undefined" != typeof d
                                ? d
                                : "undefined" != typeof self
                                ? self
                                : this),
                              ((
                                f.MitchAllen || (f.MitchAllen = {})
                              ).MazeGeneratorCore = a());
                          }
                        })(function () {
                          return (function b(c, d, e) {
                            function f(h, i) {
                              if (!d[h]) {
                                if (!c[h]) {
                                  var j = "function" == typeof a && a;
                                  if (!i && j) return j(h, !0);
                                  if (g) return g(h, !0);
                                  var k = new Error(
                                    "Cannot find module '" + h + "'"
                                  );
                                  throw ((k.code = "MODULE_NOT_FOUND"), k);
                                }
                                var l = (d[h] = {
                                  exports: {},
                                });
                                c[h][0].call(
                                  l.exports,
                                  function (a) {
                                    var b = c[h][1][a];
                                    return f(b ? b : a);
                                  },
                                  l,
                                  l.exports,
                                  b,
                                  c,
                                  d,
                                  e
                                );
                              }
                              return d[h].exports;
                            }
                            for (
                              var g = "function" == typeof a && a, h = 0;
                              h < e.length;
                              h++
                            )
                              f(e[h]);
                            return f;
                          })(
                            {
                              1: [
                                function (a, b, c) {
                                  "use strict";
                                  b.exports.create = function (a) {
                                    a = a || {};
                                    var b = a.grid;
                                    return b
                                      ? Object.assign(b, {
                                          carveMaze: function (a, b, c, d) {
                                            if (c >= d)
                                              return void console.warn(
                                                "MAXIMUM DEPTH REACHED: %d",
                                                d
                                              );
                                            if (this.isCell(a, b)) {
                                              var e =
                                                this.getShuffledNeighborDirs(
                                                  a,
                                                  b
                                                );
                                              for (var f in e) {
                                                var g = e[f],
                                                  h = this.getNeighbor(a, b, g);
                                                null !== h &&
                                                  (this.isMasked(h.x, h.y) ||
                                                    (this.isCell(h.x, h.y) &&
                                                      !this.hasConnections(
                                                        h.x,
                                                        h.y
                                                      ) &&
                                                      (this.connectUndirected(
                                                        a,
                                                        b,
                                                        g
                                                      ),
                                                      this.carveMaze(
                                                        h.x,
                                                        h.y,
                                                        c + 1,
                                                        d
                                                      ))));
                                              }
                                            }
                                          },
                                          afterGenerate: function (a) {},
                                          generate: function (a) {
                                            a = a || {};
                                            var b = a.mask || [],
                                              c = a.start || {},
                                              d = c.c || 0,
                                              e = c.r || 0;
                                            this.fill(0);
                                            for (var f in b) {
                                              var g = b[f];
                                              this.mask(g.c, g.r);
                                            }
                                            var h = this.xSize * this.ySize;
                                            this.carveMaze(d, e, 0, h),
                                              this.afterGenerate(a);
                                          },
                                        })
                                      : null;
                                  };
                                },
                                {},
                              ],
                            },
                            {},
                            [1]
                          )(1);
                        });
                      }).call(
                        this,
                        "undefined" != typeof d
                          ? d
                          : "undefined" != typeof self
                          ? self
                          : "undefined" != typeof window
                          ? window
                          : {}
                      );
                    },
                    {},
                  ],
                },
                {},
                [1]
              )(1);
            });
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        {},
      ],
      4: [
        function (a, b, c) {
          b.exports = {
            name: "aframe-maze-component",
            version: "0.1.23",
            upcoming: {
              release: "patch",
              version: "0.1.24",
            },
          };
        },
        {},
      ],
    },
    {},
    [1]
  );

  console.log(mazeSeeds);
}
