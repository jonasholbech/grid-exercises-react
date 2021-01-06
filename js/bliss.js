!(function () {
  "use strict";
  function t(e, n, i) {
    return (
      (n = void 0 === n ? 1 : n),
      (i = i || n + 1),
      i - n <= 1
        ? function () {
            if (arguments.length <= n || "string" === r.type(arguments[n]))
              return e.apply(this, arguments);
            var t,
              i = arguments[n];
            for (var o in i) {
              var s = Array.prototype.slice.call(arguments);
              s.splice(n, 1, o, i[o]), (t = e.apply(this, s));
            }
            return t;
          }
        : t(t(e, n + 1, i), n, i - 1)
    );
  }
  function e(t, r, i) {
    var o = n(i);
    if ("string" === o) {
      var s = Object.getOwnPropertyDescriptor(r, i);
      !s || (s.writable && s.configurable && s.enumerable && !s.get && !s.set)
        ? (t[i] = r[i])
        : (delete t[i], Object.defineProperty(t, i, s));
    } else if ("array" === o)
      i.forEach(function (n) {
        n in r && e(t, r, n);
      });
    else
      for (var a in r)
        (i &&
          (("regexp" === o && !i.test(a)) ||
            ("function" === o && !i.call(r, a)))) ||
          e(t, r, a);
    return t;
  }
  function n(t) {
    if (null === t) return "null";
    if (void 0 === t) return "undefined";
    var e = (
      Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1] || ""
    ).toLowerCase();
    return "number" == e && isNaN(t) ? "nan" : e;
  }
  var r = (self.Bliss = e(function (t, e) {
    return (2 == arguments.length && !e) || !t
      ? null
      : "string" === r.type(t)
      ? (e || document).querySelector(t)
      : t || null;
  }, self.Bliss));
  e(r, {
    extend: e,
    overload: t,
    type: n,
    property: r.property || "_",
    listeners: self.WeakMap ? new WeakMap() : new Map(),
    original: {
      addEventListener: (self.EventTarget || Node).prototype.addEventListener,
      removeEventListener: (self.EventTarget || Node).prototype
        .removeEventListener,
    },
    sources: {},
    noop: function () {},
    $: function (t, e) {
      return t instanceof Node || t instanceof Window
        ? [t]
        : 2 != arguments.length || e
        ? Array.prototype.slice.call(
            "string" == typeof t ? (e || document).querySelectorAll(t) : t || []
          )
        : [];
    },
    defined: function () {
      for (var t = 0; t < arguments.length; t++)
        if (void 0 !== arguments[t]) return arguments[t];
    },
    create: function (t, e) {
      return t instanceof Node
        ? r.set(t, e)
        : (1 === arguments.length &&
            ("string" === r.type(t)
              ? (e = {})
              : ((e = t),
                (t = e.tag),
                (e = r.extend({}, e, function (t) {
                  return "tag" !== t;
                })))),
          r.set(document.createElement(t || "div"), e));
    },
    each: function (t, e, n) {
      n = n || {};
      for (var r in t) n[r] = e.call(t, r, t[r]);
      return n;
    },
    ready: function (t, e, n) {
      if (
        ("function" != typeof t || e || ((e = t), (t = void 0)),
        (t = t || document),
        e &&
          ("loading" !== t.readyState
            ? e()
            : r.once(t, "DOMContentLoaded", function () {
                e();
              })),
        !n)
      )
        return new Promise(function (e) {
          r.ready(t, e, !0);
        });
    },
    Class: function (t) {
      var e,
        n = ["constructor", "extends", "abstract", "static"].concat(
          Object.keys(r.classProps)
        ),
        i = t.hasOwnProperty("constructor") ? t.constructor : r.noop;
      2 == arguments.length
        ? ((e = arguments[0]), (t = arguments[1]))
        : ((e = function () {
            if (this.constructor.__abstract && this.constructor === e)
              throw new Error(
                "Abstract classes cannot be directly instantiated."
              );
            e["super"] && e["super"].apply(this, arguments),
              i.apply(this, arguments);
          }),
          (e["super"] = t["extends"] || null),
          (e.prototype = r.extend(
            Object.create(e["super"] ? e["super"].prototype : Object),
            { constructor: e }
          )),
          (e.prototype["super"] = e["super"] ? e["super"].prototype : null),
          (e.__abstract = !!t["abstract"]));
      var o = function (t) {
        return this.hasOwnProperty(t) && n.indexOf(t) === -1;
      };
      if (t["static"]) {
        r.extend(e, t["static"], o);
        for (var s in r.classProps)
          s in t["static"] && r.classProps[s](e, t["static"][s]);
      }
      r.extend(e.prototype, t, o);
      for (var s in r.classProps) s in t && r.classProps[s](e.prototype, t[s]);
      return e;
    },
    classProps: {
      lazy: t(function (t, e, n) {
        return (
          Object.defineProperty(t, e, {
            get: function () {
              var t = n.call(this);
              return (
                Object.defineProperty(this, e, {
                  value: t,
                  configurable: !0,
                  enumerable: !0,
                  writable: !0,
                }),
                t
              );
            },
            set: function (t) {
              Object.defineProperty(this, e, {
                value: t,
                configurable: !0,
                enumerable: !0,
                writable: !0,
              });
            },
            configurable: !0,
            enumerable: !0,
          }),
          t
        );
      }),
      live: t(function (t, e, n) {
        return (
          "function" === r.type(n) && (n = { set: n }),
          Object.defineProperty(t, e, {
            get: function () {
              var t = this["_" + e],
                r = n.get && n.get.call(this, t);
              return void 0 !== r ? r : t;
            },
            set: function (t) {
              var r = this["_" + e],
                i = n.set && n.set.call(this, t, r);
              this["_" + e] = void 0 !== i ? i : t;
            },
            configurable: n.configurable,
            enumerable: n.enumerable,
          }),
          t
        );
      }),
    },
    include: function () {
      var t = arguments[arguments.length - 1],
        e = 2 === arguments.length && arguments[0],
        n = document.createElement("script");
      return e
        ? Promise.resolve()
        : new Promise(function (e, i) {
            r.set(n, {
              async: !0,
              onload: function () {
                e(n), n.parentNode && n.parentNode.removeChild(n);
              },
              onerror: function () {
                i(n);
              },
              src: t,
              inside: document.head,
            });
          });
    },
    load: function o(t, e) {
      (e = e ? new URL(e, location.href) : location.href), (t = new URL(t, e));
      var n = (o.loading = o.loading || {});
      return n[t + ""]
        ? n[t + ""]
        : /\.css$/.test(t.pathname)
        ? (n[t + ""] = new Promise(function (e, n) {
            var i = r.create("link", {
              href: t,
              rel: "stylesheet",
              inside: document.head,
              onload: function () {
                e(i);
              },
              onerror: function () {
                n(i);
              },
            });
          }))
        : (n[t + ""] = r.include(t));
    },
    fetch: function (t, n) {
      if (!t)
        throw new TypeError("URL parameter is mandatory and cannot be " + t);
      var i = e(
        {
          url: new URL(t, location),
          data: "",
          method: "GET",
          headers: {},
          xhr: new XMLHttpRequest(),
        },
        n
      );
      (i.method = i.method.toUpperCase()),
        r.hooks.run("fetch-args", i),
        "GET" === i.method && i.data && (i.url.search += i.data),
        document.body.setAttribute("data-loading", i.url),
        i.xhr.open(i.method, i.url.href, i.async !== !1, i.user, i.password);
      for (var o in n)
        if ("upload" === o)
          i.xhr.upload &&
            "object" == typeof n[o] &&
            r.extend(i.xhr.upload, n[o]);
        else if (o in i.xhr)
          try {
            i.xhr[o] = n[o];
          } catch (s) {
            self.console && console.error(s);
          }
      var a = Object.keys(i.headers).map(function (t) {
        return t.toLowerCase();
      });
      "GET" !== i.method &&
        a.indexOf("content-type") === -1 &&
        i.xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
      for (var c in i.headers)
        void 0 !== i.headers[c] && i.xhr.setRequestHeader(c, i.headers[c]);
      var u = new Promise(function (t, e) {
        (i.xhr.onload = function () {
          document.body.removeAttribute("data-loading"),
            0 === i.xhr.status ||
            (i.xhr.status >= 200 && i.xhr.status < 300) ||
            304 === i.xhr.status
              ? t(i.xhr)
              : e(
                  r.extend(Error(i.xhr.statusText), {
                    xhr: i.xhr,
                    get status() {
                      return this.xhr.status;
                    },
                  })
                );
        }),
          (i.xhr.onerror = function () {
            document.body.removeAttribute("data-loading"),
              e(r.extend(Error("Network Error"), { xhr: i.xhr }));
          }),
          (i.xhr.ontimeout = function () {
            document.body.removeAttribute("data-loading"),
              e(r.extend(Error("Network Timeout"), { xhr: i.xhr }));
          }),
          i.xhr.send("GET" === i.method ? null : i.data);
      });
      return (u.xhr = i.xhr), u;
    },
    value: function (t) {
      var e = "string" != typeof t;
      return r
        .$(arguments)
        .slice(+e)
        .reduce(
          function (t, e) {
            return t && t[e];
          },
          e ? t : self
        );
    },
  }),
    (r.Hooks = new r.Class({
      add: function (t, e, n) {
        if ("string" == typeof arguments[0])
          (Array.isArray(t) ? t : [t]).forEach(function (t) {
            (this[t] = this[t] || []), e && this[t][n ? "unshift" : "push"](e);
          }, this);
        else
          for (var t in arguments[0])
            this.add(t, arguments[0][t], arguments[1]);
      },
      run: function (t, e) {
        (this[t] = this[t] || []),
          this[t].forEach(function (t) {
            t.call(e && e.context ? e.context : e, e);
          });
      },
    })),
    (r.hooks = new r.Hooks());
  r.property;
  (r.Element = function (t) {
    (this.subject = t), (this.data = {}), (this.bliss = {});
  }),
    (r.Element.prototype = {
      set: t(function (t, e) {
        t in r.setProps
          ? r.setProps[t].call(this, e)
          : t in this
          ? (this[t] = e)
          : this.setAttribute(t, e);
      }, 0),
      transition: function (t, e) {
        return new Promise(
          function (n, i) {
            if ("transition" in this.style && 0 !== e) {
              var o = r.extend(
                {},
                this.style,
                /^transition(Duration|Property)$/
              );
              r.style(this, {
                transitionDuration: (e || 400) + "ms",
                transitionProperty: Object.keys(t).join(", "),
              }),
                r.once(this, "transitionend", function () {
                  clearTimeout(s), r.style(this, o), n(this);
                });
              var s = setTimeout(n, e + 50, this);
              r.style(this, t);
            } else r.style(this, t), n(this);
          }.bind(this)
        );
      },
      fire: function (t, e) {
        var n = document.createEvent("HTMLEvents");
        return n.initEvent(t, !0, !0), this.dispatchEvent(r.extend(n, e));
      },
      bind: t(function (t, e) {
        if (
          arguments.length > 1 &&
          ("function" === r.type(e) || e.handleEvent)
        ) {
          var n = e;
          (e =
            "object" === r.type(arguments[2])
              ? arguments[2]
              : { capture: !!arguments[2] }),
            (e.callback = n);
        }
        var i = r.listeners.get(this) || {};
        t
          .trim()
          .split(/\s+/)
          .forEach(function (t) {
            if (t.indexOf(".") > -1) {
              t = t.split(".");
              var n = t[1];
              t = t[0];
            }
            (i[t] = i[t] || []),
              0 ===
                i[t].filter(function (t) {
                  return t.callback === e.callback && t.capture == e.capture;
                }).length && i[t].push(r.extend({ className: n }, e)),
              r.original.addEventListener.call(this, t, e.callback, e);
          }, this),
          r.listeners.set(this, i);
      }, 0),
      unbind: t(function (t, e) {
        if (e && ("function" === r.type(e) || e.handleEvent)) {
          var n = e;
          e = arguments[2];
        }
        "boolean" == r.type(e) && (e = { capture: e }),
          (e = e || {}),
          (e.callback = e.callback || n);
        var i = r.listeners.get(this);
        (t || "")
          .trim()
          .split(/\s+/)
          .forEach(function (t) {
            if (t.indexOf(".") > -1) {
              t = t.split(".");
              var n = t[1];
              t = t[0];
            }
            if (i) {
              for (var o in i)
                if (!t || o === t)
                  for (var s, a = 0; (s = i[o][a]); a++)
                    (n && n !== s.className) ||
                      (e.callback && e.callback !== s.callback) ||
                      (!!e.capture != !!s.capture &&
                        (t || e.callback || void 0 !== e.capture)) ||
                      (i[o].splice(a, 1),
                      r.original.removeEventListener.call(
                        this,
                        o,
                        s.callback,
                        s.capture
                      ),
                      a--);
            } else if (t && e.callback) return r.original.removeEventListener.call(this, t, e.callback, e.capture);
          }, this);
      }, 0),
      when: function (t, e) {
        var n = this;
        return new Promise(function (r) {
          n.addEventListener(t, function i(n) {
            (e && !e.call(this, n)) || (this.removeEventListener(t, i), r(n));
          });
        });
      },
      toggleAttribute: function (t, e, n) {
        arguments.length < 3 && (n = null !== e),
          n ? this.setAttribute(t, e) : this.removeAttribute(t);
      },
    }),
    (r.setProps = {
      style: function (t) {
        for (var e in t)
          e in this.style
            ? (this.style[e] = t[e])
            : this.style.setProperty(e, t[e]);
      },
      attributes: function (t) {
        for (var e in t) this.setAttribute(e, t[e]);
      },
      properties: function (t) {
        r.extend(this, t);
      },
      events: function (t) {
        if (1 != arguments.length || !t || !t.addEventListener)
          return r.bind.apply(this, [this].concat(r.$(arguments)));
        var e = this;
        if (r.listeners) {
          var n = r.listeners.get(t);
          for (var i in n)
            n[i].forEach(function (t) {
              r.bind(e, i, t.callback, t.capture);
            });
        }
        for (var o in t) 0 === o.indexOf("on") && (this[o] = t[o]);
      },
      once: t(function (t, e) {
        var n = this,
          i = function () {
            return r.unbind(n, t, i), e.apply(n, arguments);
          };
        r.bind(this, t, i, { once: !0 });
      }, 0),
      delegate: t(
        function (t, e, n) {
          r.bind(this, t, function (t) {
            t.target.closest(e) && n.call(this, t);
          });
        },
        0,
        2
      ),
      contents: function (t) {
        (t || 0 === t) &&
          (Array.isArray(t) ? t : [t]).forEach(function (t) {
            var e = r.type(t);
            /^(string|number)$/.test(e)
              ? (t = document.createTextNode(t + ""))
              : "object" === e && (t = r.create(t)),
              t instanceof Node && this.appendChild(t);
          }, this);
      },
      inside: function (t) {
        t && t.appendChild(this);
      },
      before: function (t) {
        t && t.parentNode.insertBefore(this, t);
      },
      after: function (t) {
        t && t.parentNode.insertBefore(this, t.nextSibling);
      },
      start: function (t) {
        t && t.insertBefore(this, t.firstChild);
      },
      around: function (t) {
        t && t.parentNode && r.before(this, t), this.appendChild(t);
      },
    }),
    (r.Array = function (t) {
      this.subject = t;
    }),
    (r.Array.prototype = {
      all: function (t) {
        var e = r.$(arguments).slice(1);
        return this[t].apply(this, e);
      },
    }),
    (r.add = t(function (t, e, n, i) {
      (n = r.extend({ $: !0, element: !0, array: !0 }, n)),
        "function" == r.type(e) &&
          (!n.element ||
            (t in r.Element.prototype && i) ||
            (r.Element.prototype[t] = function () {
              return (
                this.subject &&
                r.defined(e.apply(this.subject, arguments), this.subject)
              );
            }),
          !n.array ||
            (t in r.Array.prototype && i) ||
            (r.Array.prototype[t] = function () {
              var t = arguments;
              return this.subject.map(function (n) {
                return n && r.defined(e.apply(n, t), n);
              });
            }),
          n.$ &&
            ((r.sources[t] = r[t] = e),
            (n.array || n.element) &&
              (r[t] = function () {
                var e = [].slice.apply(arguments),
                  i = e.shift(),
                  o = n.array && Array.isArray(i) ? "Array" : "Element";
                return r[o].prototype[t].apply({ subject: i }, e);
              })));
    }, 0)),
    r.add(r.Array.prototype, { element: !1 }),
    r.add(r.Element.prototype),
    r.add(r.setProps),
    r.add(r.classProps, { element: !1, array: !1 });
  var i = document.createElement("_");
  r.add(
    r.extend({}, HTMLElement.prototype, function (t) {
      return "function" === r.type(i[t]);
    }),
    null,
    !0
  );
})();
