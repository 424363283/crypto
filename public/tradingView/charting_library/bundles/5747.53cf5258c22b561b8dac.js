(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [5747],
  {
    45966: e => {
      e.exports = {
        "default-drawer-min-top-distance": "100px",
        wrap: "wrap-yBUNQyVA",
        positionBottom: "positionBottom-yBUNQyVA",
        backdrop: "backdrop-yBUNQyVA",
        drawer: "drawer-yBUNQyVA",
        positionLeft: "positionLeft-yBUNQyVA"
      };
    },
    55498: e => {
      e.exports = {
        "tablet-small-breakpoint": "screen and (max-width: 430px)",
        item: "item-RhC5uhZw",
        hovered: "hovered-RhC5uhZw",
        isDisabled: "isDisabled-RhC5uhZw",
        isActive: "isActive-RhC5uhZw",
        shortcut: "shortcut-RhC5uhZw",
        toolbox: "toolbox-RhC5uhZw",
        withIcon: "withIcon-RhC5uhZw",
        icon: "icon-RhC5uhZw",
        labelRow: "labelRow-RhC5uhZw",
        label: "label-RhC5uhZw",
        showOnHover: "showOnHover-RhC5uhZw"
      };
    },
    90948: e => {
      e.exports = { icon: "icon-XIHzWm6B", dropped: "dropped-XIHzWm6B" };
    },
    90186: (e, t, o) => {
      "use strict";
      function r(e) {
        return i(e, a);
      }
      function n(e) {
        return i(e, s);
      }
      function i(e, t) {
        const o = Object.entries(e).filter(t),
          r = {};
        for (const [e, t] of o) r[e] = t;
        return r;
      }
      function a(e) {
        const [t, o] = e;
        return 0 === t.indexOf("data-") && "string" == typeof o;
      }
      function s(e) {
        return 0 === e[0].indexOf("aria-");
      }
      o.d(t, {
        filterDataProps: () => r,
        filterAriaProps: () => n,
        filterProps: () => i,
        isDataAttribute: () => a,
        isAriaAttribute: () => s
      });
    },
    39640: (e, t, o) => {
      "use strict";
      function r(e, t, o, r, n) {
        function i(n) {
          if (e > n.timeStamp) return;
          const i = n.target;
          void 0 !== o &&
            null !== t &&
            null !== i &&
            i.ownerDocument === r &&
            (t.contains(i) || o(n));
        }
        return (
          n.click && r.addEventListener("click", i, !1),
          n.mouseDown && r.addEventListener("mousedown", i, !1),
          n.touchEnd && r.addEventListener("touchend", i, !1),
          n.touchStart && r.addEventListener("touchstart", i, !1),
          () => {
            r.removeEventListener("click", i, !1),
              r.removeEventListener("mousedown", i, !1),
              r.removeEventListener("touchend", i, !1),
              r.removeEventListener("touchstart", i, !1);
          }
        );
      }
      o.d(t, { addOutsideEventListener: () => r });
    },
    37558: (e, t, o) => {
      "use strict";
      o.d(t, { DrawerManager: () => i, DrawerContext: () => a });
      var r = o(50959),
        n = o(99054);
      class i extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._isBodyFixed = !1),
            (this._addDrawer = e => {
              this.setState(t => ({ stack: [...t.stack, e] }));
            }),
            (this._removeDrawer = e => {
              this.setState(t => ({ stack: t.stack.filter(t => t !== e) }));
            }),
            (this.state = { stack: [] });
        }
        componentDidUpdate(e, t) {
          !t.stack.length &&
            this.state.stack.length &&
            ((0, n.setFixedBodyState)(!0), (this._isBodyFixed = !0)),
            t.stack.length &&
              !this.state.stack.length &&
              this._isBodyFixed &&
              ((0, n.setFixedBodyState)(!1), (this._isBodyFixed = !1));
        }
        componentWillUnmount() {
          this.state.stack.length &&
            this._isBodyFixed &&
            (0, n.setFixedBodyState)(!1);
        }
        render() {
          return r.createElement(
            a.Provider,
            {
              value: {
                addDrawer: this._addDrawer,
                removeDrawer: this._removeDrawer,
                currentDrawer: this.state.stack.length
                  ? this.state.stack[this.state.stack.length - 1]
                  : null
              }
            },
            this.props.children
          );
        }
      }
      const a = r.createContext(null);
    },
    41590: (e, t, o) => {
      "use strict";
      o.d(t, { Drawer: () => h });
      var r = o(50959),
        n = o(50151),
        i = o(97754),
        a = o(68671),
        s = o(65718),
        c = o(37558),
        l = o(29197),
        d = o(86656),
        u = o(45966);
      function h(e) {
        const {
            position: t = "Bottom",
            onClose: o,
            children: h,
            className: p,
            theme: m = u
          } = e,
          f = (0, n.ensureNotNull)((0, r.useContext)(c.DrawerContext)),
          [v] = (0, r.useState)(() => (0, a.randomHash)()),
          g = (0, r.useRef)(null),
          w = (0, r.useContext)(l.CloseDelegateContext);
        return (
          (0, r.useLayoutEffect)(
            () => (
              (0, n.ensureNotNull)(g.current).focus({ preventScroll: !0 }),
              w.subscribe(f, o),
              f.addDrawer(v),
              () => {
                f.removeDrawer(v), w.unsubscribe(f, o);
              }
            ),
            []
          ),
          r.createElement(
            s.Portal,
            null,
            r.createElement(
              "div",
              { className: i(u.wrap, u[`position${t}`]) },
              v === f.currentDrawer &&
                r.createElement("div", { className: u.backdrop, onClick: o }),
              r.createElement(
                d.TouchScrollContainer,
                {
                  className: i(u.drawer, m.drawer, u[`position${t}`], p),
                  tabIndex: -1,
                  ref: g,
                  "data-name": e["data-name"]
                },
                h
              )
            )
          )
        );
      }
    },
    16396: (e, t, o) => {
      "use strict";
      o.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => l,
        PopupMenuItem: () => u
      });
      var r = o(50959),
        n = o(97754),
        i = o(59064),
        a = o(51768),
        s = o(90186),
        c = o(55498);
      const l = c;
      function d(e) {
        e.stopPropagation();
      }
      function u(e) {
        const {
            id: t,
            role: o,
            "aria-label": l,
            "aria-selected": u,
            "aria-checked": h,
            className: p,
            title: m,
            labelRowClassName: f,
            labelClassName: v,
            shortcut: g,
            forceShowShortcuts: w,
            icon: b,
            isActive: C,
            isDisabled: D,
            isHovered: E,
            appearAsDisabled: k,
            label: O,
            link: x,
            showToolboxOnHover: N,
            target: B,
            rel: M,
            toolbox: T,
            reference: y,
            onMouseOut: A,
            onMouseOver: R,
            onKeyDown: _,
            suppressToolboxClick: L = !0,
            theme: H = c,
            tabIndex: P,
            tagName: W,
            renderComponent: F
          } = e,
          S = (0, s.filterDataProps)(e),
          z = (0, r.useRef)(null),
          I = (0, r.useMemo)(
            () =>
              (function (e) {
                function t(t) {
                  const { reference: o, ...n } = t,
                    i = null != e ? e : n.href ? "a" : "div",
                    a =
                      "a" === i
                        ? n
                        : (function (e) {
                            const {
                              download: t,
                              href: o,
                              hrefLang: r,
                              media: n,
                              ping: i,
                              rel: a,
                              target: s,
                              type: c,
                              referrerPolicy: l,
                              ...d
                            } = e;
                            return d;
                          })(n);
                  return r.createElement(i, { ...a, ref: o });
                }
                return (t.displayName = `DefaultComponent(${e})`), t;
              })(W),
            [W]
          ),
          U = null != F ? F : I;
        return r.createElement(
          U,
          {
            ...S,
            id: t,
            role: o,
            "aria-label": l,
            "aria-selected": u,
            "aria-checked": h,
            className: n(p, H.item, b && H.withIcon, {
              [H.isActive]: C,
              [H.isDisabled]: D || k,
              [H.hovered]: E
            }),
            title: m,
            href: x,
            target: B,
            rel: M,
            reference: function (e) {
              (z.current = e), "function" == typeof y && y(e);
              "object" == typeof y && (y.current = e);
            },
            onClick: function (t) {
              const {
                dontClosePopup: o,
                onClick: r,
                onClickArg: n,
                trackEventObject: s
              } = e;
              if (D) return;
              s && (0, a.trackEvent)(s.category, s.event, s.label);
              r && r(n, t);
              o || (0, i.globalCloseMenu)();
            },
            onContextMenu: function (t) {
              const { trackEventObject: o, trackRightClick: r } = e;
              o &&
                r &&
                (0, a.trackEvent)(o.category, o.event, `${o.label}_rightClick`);
            },
            onMouseUp: function (t) {
              const { trackEventObject: o, trackMouseWheelClick: r } = e;
              if (1 === t.button && x && o) {
                let e = o.label;
                r && (e += "_mouseWheelClick"),
                  (0, a.trackEvent)(o.category, o.event, e);
              }
            },
            onMouseOver: R,
            onMouseOut: A,
            onKeyDown: _,
            tabIndex: P
          },
          void 0 !== b &&
            r.createElement("span", {
              className: H.icon,
              dangerouslySetInnerHTML: { __html: b }
            }),
          r.createElement(
            "span",
            { className: n(H.labelRow, f) },
            r.createElement("span", { className: n(H.label, v) }, O)
          ),
          (void 0 !== g || w) &&
            r.createElement(
              "span",
              { className: H.shortcut },
              (V = g) && V.split("+").join(" + ")
            ),
          void 0 !== T &&
            r.createElement(
              "span",
              {
                onClick: L ? d : void 0,
                className: n(H.toolbox, { [H.showOnHover]: N })
              },
              T
            )
        );
        var V;
      }
    },
    50628: (e, t, o) => {
      "use strict";
      o.d(t, { PopupMenu: () => d });
      var r = o(50959),
        n = o(962),
        i = o(62942),
        a = o(65718),
        s = o(27317),
        c = o(29197),
        l = o(58095);
      function d(e) {
        const {
            controller: t,
            children: o,
            isOpened: d,
            closeOnClickOutside: u = !0,
            doNotCloseOn: h,
            onClickOutside: p,
            onClose: m,
            onKeyboardClose: f,
            "data-name": v = "popup-menu-container",
            ...g
          } = e,
          w = (0, r.useContext)(c.CloseDelegateContext),
          b = (0, l.useOutsideEvent)({
            handler: function (e) {
              p && p(e);
              if (!u) return;
              const t = (0, i.default)(h) ? h() : h;
              if (t && e.target instanceof Node) {
                const o = n.findDOMNode(t);
                if (o instanceof Node && o.contains(e.target)) return;
              }
              m();
            },
            mouseDown: !0,
            touchStart: !0
          });
        return d
          ? r.createElement(
              a.Portal,
              {
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                pointerEvents: "none"
              },
              r.createElement(
                "span",
                { ref: b, style: { pointerEvents: "auto" } },
                r.createElement(
                  s.Menu,
                  {
                    ...g,
                    onClose: m,
                    onKeyboardClose: f,
                    onScroll: function (t) {
                      const { onScroll: o } = e;
                      o && o(t);
                    },
                    customCloseDelegate: w,
                    ref: t,
                    "data-name": v
                  },
                  o
                )
              )
            )
          : null;
      }
    },
    41890: (e, t, o) => {
      "use strict";
      o.d(t, { ToolWidgetCaret: () => c });
      var r = o(50959),
        n = o(97754),
        i = o(9745),
        a = o(90948),
        s = o(43313);
      function c(e) {
        const { dropped: t, className: o } = e;
        return r.createElement(i.Icon, {
          className: n(o, a.icon, { [a.dropped]: t }),
          icon: s
        });
      }
    },
    86656: (e, t, o) => {
      "use strict";
      o.d(t, { TouchScrollContainer: () => s });
      var r = o(50959),
        n = o(59142),
        i = o(50151),
        a = o(49483);
      const s = (0, r.forwardRef)((e, t) => {
        const { children: o, ...i } = e,
          s = (0, r.useRef)(null);
        return (
          (0, r.useImperativeHandle)(t, () => s.current),
          (0, r.useLayoutEffect)(() => {
            if (a.CheckMobile.iOS())
              return (
                null !== s.current &&
                  (0, n.disableBodyScroll)(s.current, { allowTouchMove: c(s) }),
                () => {
                  null !== s.current && (0, n.enableBodyScroll)(s.current);
                }
              );
          }, []),
          r.createElement("div", { ref: s, ...i }, o)
        );
      });
      function c(e) {
        return t => {
          const o = (0, i.ensureNotNull)(e.current),
            r = document.activeElement;
          return (
            !o.contains(t) || (null !== r && o.contains(r) && r.contains(t))
          );
        };
      }
    },
    35194: e => {
      e.exports = {
        button: "button-uO7HM85b",
        hover: "hover-uO7HM85b",
        isInteractive: "isInteractive-uO7HM85b",
        isGrouped: "isGrouped-uO7HM85b",
        isActive: "isActive-uO7HM85b",
        isOpened: "isOpened-uO7HM85b",
        isDisabled: "isDisabled-uO7HM85b",
        text: "text-uO7HM85b",
        icon: "icon-uO7HM85b"
      };
    },
    17049: e => {
      e.exports = {
        button: "button-reABrhVR",
        hover: "hover-reABrhVR",
        arrow: "arrow-reABrhVR",
        arrowWrap: "arrowWrap-reABrhVR",
        isOpened: "isOpened-reABrhVR"
      };
    },
    39313: (e, t, o) => {
      "use strict";
      o.d(t, {
        VerticalAttachEdge: () => r,
        HorizontalAttachEdge: () => n,
        VerticalDropDirection: () => i,
        HorizontalDropDirection: () => a,
        getPopupPositioner: () => l
      });
      var r,
        n,
        i,
        a,
        s = o(50151);
      !(function (e) {
        (e[(e.Top = 0)] = "Top"), (e[(e.Bottom = 1)] = "Bottom");
      })(r || (r = {})),
        (function (e) {
          (e[(e.Left = 0)] = "Left"), (e[(e.Right = 1)] = "Right");
        })(n || (n = {})),
        (function (e) {
          (e[(e.FromTopToBottom = 0)] = "FromTopToBottom"),
            (e[(e.FromBottomToTop = 1)] = "FromBottomToTop");
        })(i || (i = {})),
        (function (e) {
          (e[(e.FromLeftToRight = 0)] = "FromLeftToRight"),
            (e[(e.FromRightToLeft = 1)] = "FromRightToLeft");
        })(a || (a = {}));
      const c = {
        verticalAttachEdge: r.Bottom,
        horizontalAttachEdge: n.Left,
        verticalDropDirection: i.FromTopToBottom,
        horizontalDropDirection: a.FromLeftToRight,
        verticalMargin: 0,
        horizontalMargin: 0,
        matchButtonAndListboxWidths: !1
      };
      function l(e, t) {
        return (o, l) => {
          const d = (0, s.ensureNotNull)(e).getBoundingClientRect(),
            {
              verticalAttachEdge: u = c.verticalAttachEdge,
              verticalDropDirection: h = c.verticalDropDirection,
              horizontalAttachEdge: p = c.horizontalAttachEdge,
              horizontalDropDirection: m = c.horizontalDropDirection,
              horizontalMargin: f = c.horizontalMargin,
              verticalMargin: v = c.verticalMargin,
              matchButtonAndListboxWidths: g = c.matchButtonAndListboxWidths
            } = t,
            w = u === r.Top ? -1 * v : v,
            b = p === n.Right ? d.right : d.left,
            C = u === r.Top ? d.top : d.bottom,
            D = {
              x: b - (m === a.FromRightToLeft ? o : 0) + f,
              y: C - (h === i.FromBottomToTop ? l : 0) + w
            };
          return g && (D.overrideWidth = d.width), D;
        };
      }
    },
    94206: (e, t, o) => {
      "use strict";
      o.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => c
      });
      var r = o(50959),
        n = o(97754),
        i = o(9745),
        a = o(35194);
      const s = a,
        c = r.forwardRef((e, t) => {
          const {
              icon: o,
              isActive: s,
              isOpened: c,
              isDisabled: l,
              isGrouped: d,
              isHovered: u,
              onClick: h,
              text: p,
              textBeforeIcon: m,
              title: f,
              theme: v = a,
              className: g,
              forceInteractive: w,
              "data-name": b,
              ...C
            } = e,
            D = n(g, v.button, f && "apply-common-tooltip", {
              [v.isActive]: s,
              [v.isOpened]: c,
              [v.isInteractive]: (w || Boolean(h)) && !l,
              [v.isDisabled]: l,
              [v.isGrouped]: d,
              [v.hover]: u
            }),
            E =
              o &&
              ("string" == typeof o
                ? r.createElement(i.Icon, { className: v.icon, icon: o })
                : r.cloneElement(o, {
                    className: n(v.icon, o.props.className)
                  }));
          return r.createElement(
            "div",
            {
              ...C,
              ref: t,
              "data-role": "button",
              className: D,
              onClick: l ? void 0 : h,
              title: f,
              "data-name": b
            },
            m &&
              p &&
              r.createElement(
                "div",
                { className: n("js-button-text", v.text) },
                p
              ),
            E,
            !m &&
              p &&
              r.createElement(
                "div",
                { className: n("js-button-text", v.text) },
                p
              )
          );
        });
    },
    37536: (e, t, o) => {
      "use strict";
      o.d(t, { ToolWidgetMenu: () => p });
      var r = o(50959),
        n = o(97754),
        i = o(50628),
        a = o(41890),
        s = o(90186),
        c = o(37558),
        l = o(41590),
        d = o(39313),
        u = o(90692),
        h = o(17049);
      class p extends r.PureComponent {
        constructor(e) {
          super(e),
            (this._wrapperRef = null),
            (this._controller = r.createRef()),
            (this._handleWrapperRef = e => {
              (this._wrapperRef = e),
                this.props.reference && this.props.reference(e);
            }),
            (this._handleClick = e => {
              e.target instanceof Node &&
                e.currentTarget.contains(e.target) &&
                (this._handleToggleDropdown(),
                this.props.onClick &&
                  this.props.onClick(e, !this.state.isOpened));
            }),
            (this._handleToggleDropdown = e => {
              const { onClose: t, onOpen: o } = this.props,
                { isOpened: r } = this.state,
                n = "boolean" == typeof e ? e : !r;
              this.setState({ isOpened: n }), n && o && o(), !n && t && t();
            }),
            (this._handleClose = () => {
              this.close();
            }),
            (this.state = { isOpened: !1 });
        }
        render() {
          const {
              id: e,
              arrow: t,
              content: o,
              isDisabled: i,
              isDrawer: c,
              isShowTooltip: l,
              title: d,
              className: h,
              hotKey: p,
              theme: m,
              drawerBreakpoint: f
            } = this.props,
            { isOpened: v } = this.state,
            g = n(h, m.button, {
              "apply-common-tooltip": l || !i,
              [m.isDisabled]: i,
              [m.isOpened]: v
            });
          return r.createElement(
            "div",
            {
              id: e,
              className: g,
              onClick: i ? void 0 : this._handleClick,
              title: d,
              "data-tooltip-hotkey": p,
              ref: this._handleWrapperRef,
              "data-role": "button",
              ...(0, s.filterDataProps)(this.props)
            },
            o,
            t &&
              r.createElement(
                "div",
                { className: m.arrow },
                r.createElement(
                  "div",
                  { className: m.arrowWrap },
                  r.createElement(a.ToolWidgetCaret, { dropped: v })
                )
              ),
            this.state.isOpened &&
              (f
                ? r.createElement(u.MatchMedia, { rule: f }, e =>
                    this._renderContent(e)
                  )
                : this._renderContent(c))
          );
        }
        close() {
          this._handleToggleDropdown(!1);
        }
        update() {
          null !== this._controller.current &&
            this._controller.current.update();
        }
        _renderContent(e) {
          const {
              menuDataName: t,
              minWidth: o,
              menuClassName: n,
              maxHeight: a,
              drawerPosition: s = "Bottom",
              children: u
            } = this.props,
            { isOpened: h } = this.state,
            p = {
              horizontalMargin: this.props.horizontalMargin || 0,
              verticalMargin: this.props.verticalMargin || 2,
              verticalAttachEdge: this.props.verticalAttachEdge,
              horizontalAttachEdge: this.props.horizontalAttachEdge,
              verticalDropDirection: this.props.verticalDropDirection,
              horizontalDropDirection: this.props.horizontalDropDirection,
              matchButtonAndListboxWidths:
                this.props.matchButtonAndListboxWidths
            },
            m = Boolean(h && e && s),
            f = (function (e) {
              return "function" == typeof e;
            })(u)
              ? u({ isDrawer: m })
              : u;
          return m
            ? r.createElement(
                c.DrawerManager,
                null,
                r.createElement(
                  l.Drawer,
                  { onClose: this._handleClose, position: s, "data-name": t },
                  f
                )
              )
            : r.createElement(
                i.PopupMenu,
                {
                  controller: this._controller,
                  closeOnClickOutside: this.props.closeOnClickOutside,
                  doNotCloseOn: this,
                  isOpened: h,
                  minWidth: o,
                  onClose: this._handleClose,
                  position: (0, d.getPopupPositioner)(this._wrapperRef, p),
                  className: n,
                  maxHeight: a,
                  "data-name": t
                },
                f
              );
        }
      }
      p.defaultProps = { arrow: !0, closeOnClickOutside: !0, theme: h };
    },
    43313: e => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    }
  }
]);
