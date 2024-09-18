export const gt4 = () => {
  if ('undefined' == typeof window) throw new Error('Geetest requires browser environment');
  var document = window.document,
    Math = window.Math,
    head = document.getElementsByTagName('head')[0],
    TIMEOUT = 1e4;
  function _Object(t) {
    this._obj = t;
  }
  _Object.prototype = {
    _each: function (t) {
      var e,
        o = this._obj;
      for (e in o) o.hasOwnProperty(e) && t(e, o[e]);
      return this;
    },
    _extend: function (t) {
      var o = this;
      new _Object(t)._each(function (t, e) {
        o._obj[t] = e;
      });
    },
  };
  var uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (t) {
      var e = (16 * Math.random()) | 0;
      return ('x' === t ? e : (3 & e) | 8).toString(16);
    });
  };
  function Config(t) {
    var o = this;
    new _Object(t)._each(function (t, e) {
      o[t] = e;
    });
  }
  Config.prototype = {
    apiServers: ['gcaptcha4.geetest.com', 'gcaptcha4.geevisit.com'],
    staticServers: ['static.geetest.com', 'static.geevisit.com', 'dn-staticdown.qbox.me'],
    protocol: 'http://',
    typePath: '/load',
    fallback_config: {
      bypass: {
        staticServers: ['static.geetest.com', 'static.geevisit.com', 'dn-staticdown.qbox.me'],
        type: 'bypass',
        bypass: '/v4/bypass.js',
      },
    },
    _get_fallback_config: function () {
      var t = this;
      return isString(t.type) ? t.fallback_config[t.type] : t.fallback_config.bypass;
    },
    _extend: function (t) {
      var o = this;
      new _Object(t)._each(function (t, e) {
        o[t] = e;
      });
    },
  };
  var isNumber = function (t) {
      return 'number' == typeof t;
    },
    isString = function (t) {
      return 'string' == typeof t;
    },
    isBoolean = function (t) {
      return 'boolean' == typeof t;
    },
    isObject = function (t) {
      return 'object' == typeof t && null !== t;
    },
    isFunction = function (t) {
      return 'function' == typeof t;
    },
    MOBILE = /Mobi/i.test(navigator.userAgent),
    callbacks = {},
    status = {},
    random = function () {
      return parseInt(1e4 * Math.random()) + new Date().valueOf();
    },
    bind = function (e, o) {
      var n;
      if ('function' == typeof e)
        return (
          (n = Array.prototype.slice.call(arguments, 2)),
          Function.prototype.bind
            ? e.bind(o, n)
            : function () {
                var t = Array.prototype.slice.call(arguments);
                return e.apply(o, n.concat(t));
              }
        );
    },
    toString = Object.prototype.toString,
    _isFunction = function (t) {
      return 'function' == typeof t;
    },
    _isObject = function (t) {
      return t === Object(t);
    },
    _isArray = function (t) {
      return '[object Array]' == toString.call(t);
    },
    _isDate = function (t) {
      return '[object Date]' == toString.call(t);
    },
    _isRegExp = function (t) {
      return '[object RegExp]' == toString.call(t);
    },
    _isBoolean = function (t) {
      return '[object Boolean]' == toString.call(t);
    };
  function resolveKey(t) {
    return t.replace(/(\S)(_([a-zA-Z]))/g, function (t, e, o, n) {
      return e + n.toUpperCase() || '';
    });
  }
  function camelizeKeys(t, e) {
    if (!_isObject(t) || _isDate(t) || _isRegExp(t) || _isBoolean(t) || _isFunction(t)) return e ? resolveKey(t) : t;
    if (_isArray(t)) for (var o = [], n = 0; n < t.length; n++) o.push(camelizeKeys(t[n]));
    else {
      var r,
        o = {};
      for (r in t) t.hasOwnProperty(r) && (o[camelizeKeys(r, !0)] = camelizeKeys(t[r]));
    }
    return o;
  }
  var loadScript = function (t, e, o) {
      var n = document.createElement('script'),
        r =
          ((n.charset = 'UTF-8'),
          (n.async = !0),
          /static\.geetest\.com/g.test(t) && (n.crossOrigin = 'anonymous'),
          !(n.onerror = function () {
            e(!0), (r = !0);
          }));
      (n.onload = n.onreadystatechange =
        function () {
          r ||
            (n.readyState && 'loaded' !== n.readyState && 'complete' !== n.readyState) ||
            ((r = !0),
            setTimeout(function () {
              e(!1);
            }, 0));
        }),
        (n.src = t),
        head.appendChild(n),
        setTimeout(function () {
          r || ((n.onerror = n.onload = null), n.remove && n.remove(), e(!0));
        }, o || TIMEOUT);
    },
    normalizeDomain = function (t) {
      return t.replace(/^https?:\/\/|\/$/g, '');
    },
    normalizePath = function (t) {
      return (t = 0 !== (t = t.replace(/\/+/g, '/')).indexOf('/') ? '/' + t : t);
    },
    normalizeQuery = function (t) {
      var o;
      return t
        ? ((o = '?'),
          new _Object(t)._each(function (t, e) {
            (isString(e) || isNumber(e) || isBoolean(e)) && (o = o + encodeURIComponent(t) + '=' + encodeURIComponent(e) + '&');
          }),
          (o = '?' === o ? '' : o).replace(/&$/, ''))
        : '';
    },
    makeURL = function (t, e, o, n) {
      e = normalizeDomain(e);
      o = normalizePath(o) + normalizeQuery(n);
      return (o = e ? t + e + o : o);
    },
    load = function (n, r, a, c, i, s, l) {
      function u(e) {
        l && ((o = 'geetest_' + random()), (window[o] = bind(l, null, o)), (i.callback = o));
        var o,
          t = makeURL(r, a[e], c, i);
        loadScript(
          t,
          function (t) {
            if (t) {
              if (o)
                try {
                  window[o] = function () {
                    window[o] = null;
                  };
                } catch (t) {}
              e >= a.length - 1 ? s(!0) : u(e + 1);
            } else s(!1);
          },
          n.timeout
        );
      }
      u(0);
    },
    jsonp = function (t, e, o, n) {
      load(
        o,
        o.protocol,
        t,
        e,
        {
          captcha_id: o.captchaId,
          challenge: o.challenge || uuid(),
          client_type: MOBILE ? 'h5' : 'web',
          risk_type: o.riskType,
          call_type: o.callType,
          lang: o.language || ('Netscape' === navigator.appName ? navigator.language : navigator.userLanguage).toLowerCase(),
        },
        function (t) {
          t && 'function' == typeof o.offlineCb ? o.offlineCb() : t && n(o._get_fallback_config());
        },
        function (t, e) {
          'success' == e.status ? n(e.data) : (e.status, n(e)), (window[t] = void 0);
          try {
            delete window[t];
          } catch (t) {}
        }
      );
    },
    reportError = function (t, e) {
      load(
        t,
        t.protocol,
        ['monitor.geetest.com'],
        '/monitor/send',
        {
          time: Date.now().getTime(),
          captcha_id: t.gt,
          challenge: t.challenge,
          exception_url: e,
          error_code: t.error_code,
        },
        function (t) {}
      );
    },
    throwError = function (t, e, o) {
      if ('function' != typeof e.onError) throw new Error({ networkError: '网络错误', gtTypeError: 'gt字段不是字符串类型' }[t]);
      e.onError({ desc: o.desc, msg: o.msg, code: o.code });
    },
    detect = function () {
      return window.Geetest || document.getElementById('gt_lib');
    };
  detect() && (status.slide = 'loaded');
  const Geetest = function (t, n) {
    var c = new Config(t);
    t.https ? (c.protocol = 'https://') : t.protocol || (c.protocol = window.location.protocol + '//'),
      isObject(t.getType) && c._extend(t.getType),
      jsonp(c.apiServers, c.typePath, c, function (t) {
        if ('error' === (t = camelizeKeys(t)).status) return throwError('networkError', c, t);
        function e() {
          c._extend(t), n(new window.Geetest4(c));
        }
        var a = t.type,
          o = (c.debug && new _Object(t)._extend(c.debug), (callbacks[a] = callbacks[a] || []), status[a] || 'init');
        if ('init' === o)
          (status[a] = 'loading'),
            callbacks[a].push(e),
            t.gctPath &&
              load(c, c.protocol, (!Object.hasOwnProperty.call(c, 'staticServers') && t.staticServers) || c.staticServers, t.gctPath, null, function (t) {
                t &&
                  throwError('networkError', c, {
                    code: '60205',
                    msg: 'Network failure',
                    desc: { detail: 'gct resource load timeout' },
                  });
              }),
            load(c, c.protocol, (!Object.hasOwnProperty.call(c, 'staticServers') && t.staticServers) || c.staticServers, t.bypass || t.staticPath + t.js, null, function (t) {
              if (t)
                (status[a] = 'fail'),
                  throwError('networkError', c, {
                    code: '60204',
                    msg: 'Network failure',
                    desc: { detail: 'js resource load timeout' },
                  });
              else {
                status[a] = 'loaded';
                for (var e = callbacks[a], o = 0, n = e.length; o < n; o += 1) {
                  var r = e[o];
                  isFunction(r) && r();
                }
                callbacks[a] = [];
              }
            });
        else {
          if ('loaded' === o) return e();
          'fail' === o
            ? throwError('networkError', c, {
                code: '60204',
                msg: 'Network failure',
                desc: { detail: 'js resource load timeout' },
              })
            : 'loading' === o && callbacks[a].push(e);
        }
      });
  };

  return Geetest;
};
