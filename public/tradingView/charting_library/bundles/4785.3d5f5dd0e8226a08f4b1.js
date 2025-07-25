"use strict";
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4785],
  {
    19402: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getCoordinateXMetaInfo: () => w,
          getCoordinateYMetaInfo: () => f,
          getCoordinatesPropertiesDefinitions: () => m,
          getSelectionCoordinatesPropertyDefinition: () => T
        });
      var n = i(50151),
        o = i(44352),
        r = i(47539),
        s = i(71733);
      class l extends s.UndoCommand {
        constructor({ lineToolId: e, chartModel: t, newPositionPoints: i }) {
          super(null),
            (this._pointState = null),
            (this._lineToolId = e),
            (this._model = t),
            (this._newPositionPoints = i);
        }
        redo() {
          const e = (0, n.ensureNotNull)(
            this._model.dataSourceForId(this._lineToolId)
          );
          (this._pointState = [e.normalizedPoints(), e.points()]),
            e.startChanging(),
            e.moveLineTool(this._newPositionPoints),
            this._model.updateSource(e),
            e.syncMultichartState(e.endChanging(!0, !1));
        }
        undo() {
          if (this._pointState) {
            const e = (0, n.ensureNotNull)(
              this._model.dataSourceForId(this._lineToolId)
            );
            e.startChanging(),
              e.restorePoints(...this._pointState),
              this._model.updateSource(e),
              e.syncMultichartState(e.endChanging(!0, !1));
          }
        }
      }
      var a = i(65279),
        d = i(40549),
        c = i.n(d),
        p = i(26220),
        u = i.n(p),
        h = i(10381);
      const y = new r.TranslatedString(
          "change price Y coordinate",
          o.t(null, void 0, i(66266))
        ),
        P = new r.TranslatedString(
          "change bar X coordinate",
          o.t(null, void 0, i(23723))
        ),
        g = new r.TranslatedString(
          "move drawings",
          o.t(null, void 0, i(72223))
        );
      function f(e, t, i) {
        return {
          property: (0, a.convertToDefinitionProperty)(e, t.price, y),
          info: { typeY: 1, stepY: i }
        };
      }
      function w(e, t) {
        return {
          property: (0, a.convertToDefinitionProperty)(e, t.bar, P),
          info: {
            typeX: 0,
            minX: new (c())(-5e4),
            maxX: new (c())(15e3),
            stepX: new (c())(1)
          }
        };
      }
      function m(e, t, i, n, o, r) {
        const s = w(e, t),
          l = f(e, t, n);
        return (0, a.createCoordinatesPropertyDefinition)(
          { x: s.property, y: l.property },
          {
            id: (0, h.removeSpaces)(`${r}Coordinates${o}`),
            title: o,
            ...s.info,
            ...l.info
          }
        );
      }
      const v = /^([+*\-\/]?)((?:\d*)|(?:\d+\.\d*))$/;
      function _(e, t, i) {
        const o = new (u())(""),
          r = (0, a.makeProxyDefinitionProperty)(o);
        return (
          (r.setValue = r => {
            try {
              const s = r.match(v);
              if (!s) return;
              const [, a, d] = s;
              if (!d.length) return;
              const c = i(parseFloat(d));
              if ("/" === a && (0 === c.price || 0 === c.index)) return;
              t.withMacro(g, () => {
                e.forEach(e => {
                  const i = e.points();
                  let o;
                  switch (a) {
                    case "": {
                      const e = (0, n.ensureDefined)(i[0]);
                      let { index: t = e.index, price: r = e.price } = c;
                      (r -= e.price),
                        (t -= e.index),
                        (o = i.map(e => ({
                          ...e,
                          index: e.index + t,
                          price: e.price + r
                        })));
                      break;
                    }
                    case "-":
                    case "+": {
                      let { index: e = 0, price: t = 0 } = c;
                      "-" === a && ((e *= -1), (t *= -1)),
                        (o = i.map(i => ({
                          ...i,
                          index: i.index + e,
                          price: i.price + t
                        })));
                      break;
                    }
                    case "*": {
                      const { index: e = 1, price: t = 1 } = c;
                      o = i.map(i => ({
                        ...i,
                        index: i.index * e,
                        price: i.price * t
                      }));
                      break;
                    }
                    case "/": {
                      const { index: e = 1, price: t = 1 } = c;
                      o = i.map(i => ({
                        ...i,
                        index: i.index / e,
                        price: i.price / t
                      }));
                      break;
                    }
                  }
                  t.undoHistory().pushUndoCommand(
                    new l({
                      lineToolId: e.id(),
                      chartModel: t.model(),
                      newPositionPoints: o
                    })
                  );
                });
              });
            } finally {
              o.setValue("", !0);
            }
          }),
          r
        );
      }
      function T(e, t) {
        const n = _(e, t, e => ({ index: e })),
          r = _(e, t, e => ({ price: e }));
        return (0, a.createSelectionCoordinatesPropertyDefinition)(
          { x: n, y: r },
          {
            id: "SourcesCoordinates",
            title: o.t(null, void 0, i(37067)),
            mathOperationsX: "+",
            mathOperationsY: "+/*",
            modeX: "integer",
            modeY: "float"
          }
        );
      }
    },
    20196: (e, t, i) => {
      i.r(t),
        i.d(t, {
          getIntervalsVisibilitiesPropertiesDefinitions: () => de,
          getSelectionIntervalsVisibilitiesPropertiesDefinition: () => ce
        });
      var n = i(44352),
        o = i(47539),
        r = i(2484),
        s = i(65279),
        l = i(40549),
        a = i.n(l),
        d = i(92133),
        c = i(75862),
        p = i(85804);
      const u = new o.TranslatedString(
          "change {title} visibility on ticks",
          n.t(null, void 0, i(30810))
        ),
        h = new o.TranslatedString(
          "change {title} visibility on seconds",
          n.t(null, void 0, i(46948))
        ),
        y = new o.TranslatedString(
          "change {title} seconds from",
          n.t(null, void 0, i(2822))
        ),
        P = new o.TranslatedString(
          "change {title} seconds to",
          n.t(null, void 0, i(66161))
        ),
        g = new o.TranslatedString(
          "change {title} visibility on minutes",
          n.t(null, void 0, i(64370))
        ),
        f = new o.TranslatedString(
          "change {title} minutes from",
          n.t(null, void 0, i(15106))
        ),
        w = new o.TranslatedString(
          "change {title} minutes to",
          n.t(null, void 0, i(91633))
        ),
        m = new o.TranslatedString(
          "change {title} visibility on hours",
          n.t(null, void 0, i(68971))
        ),
        v = new o.TranslatedString(
          "change {title} hours from",
          n.t(null, void 0, i(35388))
        ),
        _ = new o.TranslatedString(
          "change {title} hours to",
          n.t(null, void 0, i(78586))
        ),
        T = new o.TranslatedString(
          "change {title} visibility on days",
          n.t(null, void 0, i(29088))
        ),
        b = new o.TranslatedString(
          "change {title} days from",
          n.t(null, void 0, i(41377))
        ),
        S = new o.TranslatedString(
          "change {title} days to",
          n.t(null, void 0, i(13355))
        ),
        C = new o.TranslatedString(
          "change {title} visibility on weeks",
          n.t(null, void 0, i(24941))
        ),
        D = new o.TranslatedString(
          "change {title} weeks from",
          n.t(null, void 0, i(21339))
        ),
        k = new o.TranslatedString(
          "change {title} weeks to",
          n.t(null, void 0, i(68643))
        ),
        V = new o.TranslatedString(
          "change {title} visibility on months",
          n.t(null, void 0, i(6659))
        ),
        x = new o.TranslatedString(
          "change {title} months from",
          n.t(null, void 0, i(59635))
        ),
        W = new o.TranslatedString(
          "change {title} months to",
          n.t(null, void 0, i(74266))
        ),
        I =
          (new o.TranslatedString(
            "change {title} visibility on ranges",
            n.t(null, void 0, i(29091))
          ),
          n.t(null, void 0, i(30973))),
        M = n.t(null, void 0, i(71129)),
        U = n.t(null, void 0, i(28134)),
        A = n.t(null, void 0, i(63099)),
        L = n.t(null, void 0, i(22192)),
        F = n.t(null, void 0, i(21594)),
        N = n.t(null, void 0, i(95543)),
        R =
          (n.t(null, void 0, i(86672)),
          new o.TranslatedString("ticks", n.t(null, void 0, i(59523)))),
        Y = new o.TranslatedString("seconds", n.t(null, void 0, i(32925))),
        E = new o.TranslatedString("seconds from", n.t(null, void 0, i(6049))),
        X = new o.TranslatedString("seconds to", n.t(null, void 0, i(39017))),
        H = new o.TranslatedString("minutes", n.t(null, void 0, i(16465))),
        j = new o.TranslatedString("minutes from", n.t(null, void 0, i(25586))),
        $ = new o.TranslatedString("minutes to", n.t(null, void 0, i(72317))),
        K = new o.TranslatedString("hours", n.t(null, void 0, i(3143))),
        O = new o.TranslatedString("hours from", n.t(null, void 0, i(84775))),
        z = new o.TranslatedString("hours to", n.t(null, void 0, i(11255))),
        q = new o.TranslatedString("days", n.t(null, void 0, i(82211))),
        B = new o.TranslatedString("days from", n.t(null, void 0, i(14077))),
        G = new o.TranslatedString("days to", n.t(null, void 0, i(33486))),
        J = new o.TranslatedString("weeks", n.t(null, void 0, i(93016))),
        Q = new o.TranslatedString("weeks from", n.t(null, void 0, i(32002))),
        Z = new o.TranslatedString("weeks to", n.t(null, void 0, i(28091))),
        ee = new o.TranslatedString("months", n.t(null, void 0, i(58964))),
        te = new o.TranslatedString("months from", n.t(null, void 0, i(71770))),
        ie = new o.TranslatedString("months to", n.t(null, void 0, i(37179))),
        ne =
          (new o.TranslatedString("ranges", n.t(null, void 0, i(13604))),
          [1, 59]),
        oe = [1, 59],
        re = [1, 24],
        se = [1, 366],
        le = [1, 52],
        ae = [1, 12];
      function de(e, t, i) {
        const n = [];
        if (r.enabled("tick_resolution")) {
          const o = (0, s.createCheckablePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.ticks,
                u.format({ title: i })
              )
            },
            { id: "IntervalsVisibilitiesTicks", title: I }
          );
          n.push(o);
        }
        if ((0, d.isSecondsEnabled)()) {
          const o = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.seconds,
                h.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.secondsFrom,
                y.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.secondsTo,
                P.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesSecond",
              title: M,
              min: new (a())(ne[0]),
              max: new (a())(ne[1])
            }
          );
          n.push(o);
        }
        const o = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.minutes,
                g.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.minutesFrom,
                f.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.minutesTo,
                w.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesMinutes",
              title: U,
              min: new (a())(oe[0]),
              max: new (a())(oe[1])
            }
          ),
          l = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.hours,
                m.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.hoursFrom,
                v.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.hoursTo,
                _.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesHours",
              title: A,
              min: new (a())(re[0]),
              max: new (a())(re[1])
            }
          ),
          c = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.days,
                T.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.daysFrom,
                b.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.daysTo,
                S.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesDays",
              title: L,
              min: new (a())(se[0]),
              max: new (a())(se[1])
            }
          );
        n.push(o, l, c);
        const p = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.weeks,
                C.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.weeksFrom,
                D.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.weeksTo,
                k.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesWeeks",
              title: F,
              min: new (a())(le[0]),
              max: new (a())(le[1])
            }
          ),
          R = (0, s.createRangePropertyDefinition)(
            {
              checked: (0, s.convertToDefinitionProperty)(
                e,
                t.months,
                V.format({ title: i })
              ),
              from: (0, s.convertToDefinitionProperty)(
                e,
                t.monthsFrom,
                x.format({ title: i })
              ),
              to: (0, s.convertToDefinitionProperty)(
                e,
                t.monthsTo,
                W.format({ title: i })
              )
            },
            {
              id: "IntervalsVisibilitiesMonths",
              title: N,
              min: new (a())(ae[0]),
              max: new (a())(ae[1])
            }
          );
        return n.push(p, R), { definitions: n };
      }
      function ce(e, t) {
        const i = [];
        if (r.enabled("tick_resolution")) {
          const n = (0, s.createCheckablePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.ticks),
                R,
                t
              )
            },
            { id: "IntervalsVisibilitiesTicks", title: I }
          );
          i.push(n);
        }
        if ((0, d.isSecondsEnabled)()) {
          const n = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.seconds),
                Y,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsFrom),
                E,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.secondsTo),
                X,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesSecond",
              title: M,
              min: new (a())(ne[0]),
              max: new (a())(ne[1])
            }
          );
          i.push(n);
        }
        const n = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutes),
                H,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesFrom),
                j,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.minutesTo),
                $,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesMinutes",
              title: U,
              min: new (a())(oe[0]),
              max: new (a())(oe[1])
            }
          ),
          o = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hours),
                K,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursFrom),
                O,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.hoursTo),
                z,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesHours",
              title: A,
              min: new (a())(re[0]),
              max: new (a())(re[1])
            }
          ),
          l = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.days),
                q,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysFrom),
                B,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.daysTo),
                G,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesDays",
              title: L,
              min: new (a())(se[0]),
              max: new (a())(se[1])
            }
          );
        i.push(n, o, l);
        const u = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeks),
                J,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksFrom),
                Q,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.weeksTo),
                Z,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesWeeks",
              title: F,
              min: new (a())(le[0]),
              max: new (a())(le[1])
            }
          ),
          h = (0, s.createRangePropertyDefinition)(
            {
              checked: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.months),
                ee,
                t
              ),
              from: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsFrom),
                te,
                t
              ),
              to: new p.CollectiblePropertyUndoWrapper(
                new c.LineToolCollectedProperty(e.monthsTo),
                ie,
                t
              )
            },
            {
              id: "IntervalsVisibilitiesMonths",
              title: N,
              min: new (a())(ae[0]),
              max: new (a())(ae[1])
            }
          );
        return i.push(u, h), { definitions: i };
      }
    },
    44785: (e, t, i) => {
      i.r(t), i.d(t, { LineDataSourceDefinitionsViewModel: () => v });
      var n = i(50151),
        o = i(44352),
        r = i(47539),
        s = (i(93731), i(65279)),
        l = i(82623),
        a = i(40549),
        d = i.n(a),
        c = i(20196),
        p = i(19402),
        u = i(23378),
        h = i(46627);
      const y = o.t(null, void 0, i(21852)),
        P = o.t(null, void 0, i(4639)),
        g = o.t(null, void 0, i(32733)),
        f = o.t(null, void 0, i(37229)),
        w = o.t(null, void 0, i(66304)),
        m = o.t(null, { context: "linetool point" }, i(9671));
      class v {
        constructor(e, t) {
          (this._yCoordinateStepWV = null),
            (this._propertyPages = []),
            (this._lineToolsDoNotAffectChartInvalidation =
              new h.FeatureToggleWatchedValue(
                "do_not_invalidate_chart_on_changing_line_tools",
                !1
              )),
            (this._source = t),
            (this._undoModel = e),
            (this._ownerSource = (0, n.ensureNotNull)(
              this._source.ownerSource()
            )),
            (this._propertyApplier = new u.PropertyApplierWithoutSavingChart(
              () => e,
              this._lineToolsDoNotAffectChartInvalidation
            )),
            this._createPropertyRages();
        }
        destroy() {
          null !== this._yCoordinateStepWV &&
            (this._source.ownerSourceChanged().unsubscribeAll(this),
            this._ownerSource.priceStepChanged().unsubscribeAll(this)),
            this._source.pointAdded().unsubscribeAll(this),
            this._propertyPages.forEach(e => {
              (0, s.destroyDefinitions)(e.definitions.value());
            }),
            this._lineToolsDoNotAffectChartInvalidation.destroy();
        }
        propertyPages() {
          return Promise.resolve(this._propertyPages);
        }
        _createPropertyRages() {
          this._propertyPages = [];
          const e = this._createInputsPropertyPage();
          null !== e && this._propertyPages.push(e);
          const t = this._createStylePropertyPage();
          null !== t && this._propertyPages.push(t);
          const i = this._createTextPropertyPage();
          if (
            (null !== i && this._propertyPages.push(i),
            this._source.hasEditableCoordinates())
          ) {
            const e = this._createCoordinatesPropertyPage();
            null !== e && this._propertyPages.push(e);
          }
          const n = this._createVisibilitiesPropertyPage();
          this._propertyPages.push(n);
        }
        _createVisibilitiesPropertyPage() {
          const e = this._source
            .properties()
            .childs()
            .intervalsVisibilities.childs();
          return (0, l.createPropertyPage)(
            (0, c.getIntervalsVisibilitiesPropertiesDefinitions)(
              this._undoModel,
              e,
              new r.TranslatedString(
                this._source.name(),
                this._source.title(!0)
              )
            ),
            "visibility",
            y
          );
        }
        _createCoordinatesPropertyPage() {
          const e = this._coordinatesPropertyDefinitions();
          return null !== e
            ? (e.definitions.length < this._source.pointsCount() &&
                this._source
                  .pointAdded()
                  .subscribe(this, this._updateCoordinatesPropertyDefinitons),
              (0, l.createPropertyPage)(e, "coordinates", P))
            : null;
        }
        _getYCoordinateStepWV() {
          return (
            null === this._yCoordinateStepWV &&
              ((this._yCoordinateStepWV = new (d())(
                (function (e) {
                  if (null !== e) {
                    const t = e.priceStep();
                    if (null !== t) return t;
                  }
                  return 1;
                })(this._source.ownerSource())
              )),
              this._ownerSource
                .priceStepChanged()
                .subscribe(this, () => this._updateYCoordinateStep()),
              this._source.ownerSourceChanged().subscribe(this, () => {
                this._ownerSource.priceStepChanged().unsubscribeAll(this),
                  (this._ownerSource = (0, n.ensureNotNull)(
                    this._source.ownerSource()
                  )),
                  this._ownerSource
                    .priceStepChanged()
                    .subscribe(this, () => this._updateYCoordinateStep());
              })),
            this._yCoordinateStepWV
          );
        }
        _coordinatesPropertyDefinitions() {
          const e = this._source.points(),
            t = this._source.pointsProperty().childs().points,
            i = [],
            n = this._getYCoordinateStepWV();
          return (
            e.forEach((e, o) => {
              const r = t[o].childs();
              r &&
                i.push(
                  (0, p.getCoordinatesPropertiesDefinitions)(
                    this._propertyApplier,
                    r,
                    e,
                    n,
                    m.format({ count: (o + 1).toString() }),
                    this._source.name()
                  )
                );
            }),
            { definitions: i }
          );
        }
        _createStylePropertyPage() {
          const e = this._stylePropertyDefinitions();
          return null !== e ? (0, l.createPropertyPage)(e, "style", g) : null;
        }
        _stylePropertyDefinitions() {
          return null;
        }
        _createTextPropertyPage() {
          const e = this._textPropertyDefinitions();
          return null !== e ? (0, l.createPropertyPage)(e, "text", f) : null;
        }
        _textPropertyDefinitions() {
          return null;
        }
        _createInputsPropertyPage() {
          const e = this._inputsPropertyDefinitions();
          return null !== e ? (0, l.createPropertyPage)(e, "inputs", w) : null;
        }
        _inputsPropertyDefinitions() {
          return null;
        }
        _updateYCoordinateStep() {
          const e = this._ownerSource.priceStep();
          this._getYCoordinateStepWV().setValue(e || 1);
        }
        _updateCoordinatesPropertyDefinitons() {
          const e = this._coordinatesPropertyDefinitions();
          if (null !== e) {
            (0, n.ensureDefined)(
              this._propertyPages.find(e => "coordinates" === e.id)
            ).definitions.setValue(e.definitions),
              this._source.points().length === this._source.pointsCount() &&
                this._source.pointAdded().unsubscribeAll(this);
          }
        }
      }
    },
    85804: (e, t, i) => {
      i.d(t, { CollectiblePropertyUndoWrapper: () => d });
      var n = i(50151),
        o = i(44352),
        r = i(47539),
        s = i(26220),
        l = i.n(s);
      const a = new r.TranslatedString(
        "change {propertyName} property",
        o.t(null, void 0, i(18567))
      );
      class d extends l() {
        constructor(e, t, i) {
          super(),
            (this._isProcess = !1),
            (this._listenersMappers = []),
            (this._valueApplier = {
              applyValue: (e, t) => {
                this._propertyApplier.setProperty(e, t, a);
              }
            }),
            (this._baseProperty = e),
            (this._propertyApplier = i),
            (this._propertyName = t);
        }
        destroy() {
          this._baseProperty.destroy();
        }
        value() {
          return this._baseProperty.value();
        }
        setValue(e, t) {
          this._propertyApplier.beginUndoMacro(
            a.format({ propertyName: this._propertyName })
          ),
            (this._isProcess = !0),
            this._baseProperty.setValue(e, void 0, this._valueApplier),
            (this._isProcess = !1),
            this._propertyApplier.endUndoMacro(),
            this._listenersMappers.forEach(e => {
              e.method.call(e.obj, this);
            });
        }
        subscribe(e, t) {
          const i = () => {
            this._isProcess || t.call(e, this);
          };
          this._listenersMappers.push({ obj: e, method: t, callback: i }),
            this._baseProperty.subscribe(e, i);
        }
        unsubscribe(e, t) {
          var i;
          const o = (0, n.ensureDefined)(
            null ===
              (i = this._listenersMappers.find(
                i => i.obj === e && i.method === t
              )) || void 0 === i
              ? void 0
              : i.callback
          );
          this._baseProperty.unsubscribe(e, o);
        }
        unsubscribeAll(e) {
          this._baseProperty.unsubscribeAll(e);
        }
      }
    },
    23378: (e, t, i) => {
      i.d(t, { PropertyApplierWithoutSavingChart: () => n });
      class n {
        constructor(e, t) {
          (this._undoModelSupplier = e), (this._featureToggle = t);
        }
        setProperty(e, t, i) {
          this._undoModelSupplier().setProperty(
            e,
            t,
            i,
            this._featureToggle.value()
          );
        }
        beginUndoMacro(e) {
          return this._undoModelSupplier().beginUndoMacro(
            e,
            this._shouldWeKeepChartValidated()
          );
        }
        endUndoMacro() {
          this._undoModelSupplier().endUndoMacro();
        }
        setWatchedValue(e, t, i) {
          this._undoModelSupplier().undoHistory().setWatchedValue(e, t, i, !0);
        }
        _shouldWeKeepChartValidated() {
          const e = this._undoModelSupplier()
            .model()
            .isAutoSaveEnabled()
            .value();
          return this._featureToggle.value() && e;
        }
      }
    }
  }
]);
