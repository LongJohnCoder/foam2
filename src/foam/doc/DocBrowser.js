/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
foam.CLASS({
  package: 'foam.doc',
  name: 'DocBorder',
  extends: 'foam.u2.Element',

  documentation: 'Titled raised View border used by the DocBrowser.',

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        ^ {
             border-radius: 3px;
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.38);
             display: inline-block;
             width:100%;
        }
        ^title { padding: 6px; align-content: center; background: #c8e2f9; }
        ^info { float: right; font-size: smaller; }
        ^content { padding: 6px; min-width: 220px; height: 100%; background: white; }
      */}
    })
  ],

  properties: [
    'title',
    'info'
  ],

  methods: [
    function init() {
      this.
        addClass(this.myClass()).
        start('div').
          addClass(this.myClass('title')).
          add(this.title$).
          start('span').
            addClass(this.myClass('info')).
            add(this.info$).
          end().
        end().
        start('div', null, this.content$).
          addClass(this.myClass('content')).
        end();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'AxiomInfo',
  ids: ['name'],

  requires: [
    'foam.doc.ClassLink'
  ],

  properties: [
    {
      name: 'axiom',
      hidden: true
    },
    {
      name: 'cls',
      label: 'Source',
      tableCellView: function(o, e) {
        return foam.doc.LinkView.create({data: o.cls}, e.__subSubContext__);
      },
      tableCellFormatter: function(value, obj, axiom) {
        this.tag(foam.doc.LinkView, { data: value });
      }
    },
    {
      name: 'type',
      tableCellView: function(o, e) {
        return o.type ?
          foam.doc.LinkView.create({data: foam.doc.Link.create({path: o.type.id, label: o.type.name})}, e.__subSubContext__) :
          'anonymous';
      },
      tableCellFormatter: function(value, obj, axiom) {
        if ( value ) {
          this.tag(foam.doc.LinkView, { data: foam.doc.Link.create({ path: value.id, label: value.name }) });
          return;
        }
        this.add('anonymous');
      }
    },
    {
      name: 'name',
      tableCellFormatter: function(value, obj, axiom) {
        if ( obj.type === foam.core.Requires ) {
          this.tag(obj.ClassLink, {data: obj.axiom.path, showPackage: true});
        } else if ( obj.type === foam.core.Implements ) {
          this.tag(obj.ClassLink, {data: obj.axiom.path, showPackage: true});
        } else {
          this.add(value);
        }
      }
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassList',
  extends: 'foam.u2.View',

  requires: [
    'foam.doc.DocBorder',
    'foam.doc.ClassLink'
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        ^ a {
          display: inline-block;
          padding: 2px;
          width: 200px;
        }
        ^package {
          font-weight: 700;
        }
        ^indent {
          margin-left: 30px;
        }
      */}
    })
  ],

  properties: [
    'title',
    {
      name: 'info',
      expression: function (data) {
        return data && data.length;
      }
    },
    {
      of: 'Boolean',
      name: 'showPackage',
      value: true
    },
    {
      of: 'Boolean',
      name: 'showSummary'
    }
  ],

  methods: [
    function initE() {
      this.SUPER();
      var self = this;
      var pkg = '';
      this.
        addClass(this.myClass()).
        start(this.DocBorder, {title: this.title, info$: this.info$}).
          start('div').
            add(this.slot(function (data) {
              return self.E('span').forEach(data, function(d) {
                if ( ! this.showPackage ) {
                  if ( d.package !== pkg ) {
                    pkg = d.package;
                    this.start('div').addClass(self.myClass('package')).add(pkg).end();
                  }
                }

                this.start('div')
                  .start(self.ClassLink, {data: d, showPackage: this.showPackage}).
                    addClass(this.showPackage ? null : self.myClass('indent')).
                  end().
                  call(function(f) {
                    if ( self.showSummary ) {
                      this.add(' ', self.summarize(d.model_.documentation));
                    }
                  }).
                end();
              });
            })).
          end().
        end();
    },

    function summarize(txt) {
      if ( ! txt ) return null;
      var i = txt.indexOf('.');
      if ( i < 60 ) return txt.substring(0, i+1);
      return txt.substring(0, 56) + ' ...';
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassDocView',
  extends: 'foam.u2.View',

  requires: [
    'foam.doc.Link',
    'foam.doc.ClassLink',
    'foam.doc.AxiomInfo',
    'foam.u2.view.TableView',
    'foam.dao.ArrayDAO'
  ],

  imports: [
    'selectedAxiom',
    'showInherited'
  ],

  methods: [
    function initE() {
      this.SUPER();

      var data = this.data;

      this.
          start('b').add(data.id).end().
          start('span').style({float:'right','font-size':'smaller'}).add(data.count_, ' created').end().br().
          add('extends: ');

      var cls = data;
      for ( var i = 0 ; cls ; i++ ) {
        cls = this.lookup(cls.model_.extends, true);
        if ( i ) this.add(' : ');
        this.start(this.ClassLink, {data: cls}).end();
        if ( cls === foam.core.FObject ) break;
      }
      this.br();
      this.start(foam.u2.HTMLElement).add(data.model_.documentation).end();

      this.add(this.slot(function (showInherited) {
        // TODO: hide 'Source Class' column if showInherited is false
        var axs = [];
        for ( var key in data.axiomMap_ ) {
          if ( showInherited || Object.hasOwnProperty.call(data.axiomMap_, key) ) {
            var a  = data.axiomMap_[key];
            var ai = foam.doc.AxiomInfo.create({
              axiom: a,
              type: a.cls_,
              cls: this.Link.create({
                path: a.sourceCls_.id,
                label: a.sourceCls_.name
              }),
              name: a.name
            });
            axs.push(ai);
          }
        }

        return this.TableView.create({
          of: this.AxiomInfo,
          data: this.ArrayDAO.create({array: axs}),
          hoverSelection$: this.selectedAxiom$
        });
      }));
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'Link',

  properties: [
    'path',
    'label'
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'LinkView',
  extends: 'foam.u2.View',

  imports: [ 'browserPath' ],

  methods: [
    function initE() {
      this.SUPER();

      this.setNodeName('a').
        on('click', this.click).
        attrs({href: this.data.path}).
        add(this.data.label);
    }
  ],

  listeners: [
    function click(e) {
      this.browserPath$.set(this.data.path);
      e.preventDefault();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassLink',
  extends: 'foam.u2.View',

  imports: [ 'browserPath' ],

  properties: [
    {
      class: 'Class',
      name: 'data'
    },
    {
      class: 'Boolean',
      name: 'showPackage'
    }
  ],

  methods: [
    function initE() {
      this.SUPER();

      this.setNodeName('a').
        on('click', this.click).
        attrs({href: this.data.id}).
        add(this.showPackage ? this.data.id : this.data.name);
    }
  ],

  listeners: [
    function click(e) {
      this.browserPath$.set(this.data.id);
      e.preventDefault();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'DocBrowser',
  extends: 'foam.u2.Element',

  documentation: 'FOAM documentation browser.',

  requires: [
    'foam.doc.DocBorder',
    'foam.doc.ClassList',
    'foam.doc.ClassDocView',
    'foam.doc.UMLDiagram'
  ],

  exports: [
    'as data',
    'path as browserPath',
    'axiom as selectedAxiom',
    'showInherited'
  ],

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        ^ {
          font-family: roboto, arial;
          color: #555;
        }
        ^ th {
          color: #555;
        }
        ^ td {
          padding-right: 12px;
        }
      */}
    })
  ],

  constants: {
    MODEL_COMPARATOR: foam.compare.compound([foam.core.Model.PACKAGE, foam.core.Model.NAME]).compare
  },

  properties: [
    'path',
    {
      name: 'selectedClass',
      expression: function (path) {
        return this.lookup(path, true);
      }
    },
    {
      class: 'Boolean',
      name: 'showInherited',
      value: true
    },
    {
      class: 'FObjectProperty',
      name: 'axiom',
      view: { class: 'foam.u2.DetailView' }
    },
    {
      name: 'subClasses',
      expression: function (path) {
        return Object.values(foam.USED).
            filter(function(cls) { return cls.model_.extends == path || 'foam.core.' + cls.model_.extends == path; }).
          sort(this.MODEL_COMPARATOR);
      }
    },
    {
      name: 'requiredByClasses',
      expression: function (path) {
        return Object.values(foam.USED).
            filter(function(cls) {
              return cls.model_.requires && cls.model_.requires.map(
                  function(r) { return r.path; }).includes(path);
            }).
            sort(this.MODEL_COMPARATOR);
      }
    },
    {
      name: 'relationshipClasses',
      expression: function (path) {
        return [];
      }
    },
    'subClassCount'
  ],

  methods: [
    function initE() {
      this.SUPER();

      this.
        addClass(this.myClass()).
        tag(this.PATH, {displayWidth: 80}).
          start('span').
            style({'margin-left': '12px', 'font-size':'small'}).
            add('  Show Inherited Axioms: ').
          end().
          tag(this.SHOW_INHERITED, {data$: this.showInherited$}).
        br().br().
        start('table').
          start('tr').
            start('td').
              style({'vertical-align': 'top'}).
              start(this.DocBorder, {
                title: 'UML ++',
                info$: this.slot(function(selectedClass) {
                  return selectedClass.getOwnAxioms().length + ' / ' + selectedClass.getAxioms().length;
                })
              }).
              add(this.slot(function(selectedClass) {
                if (!selectedClass) return '';
                return this.UMLDiagram.create({
                  data: selectedClass
                });
              })).
              end().
              end().
              start('td').
                style({'vertical-align': 'top'}).
              tag(this.ClassList, {title: 'Class List', showPackages: false, showSummary: true, data: Object.values(foam.USED).sort(this.MODEL_COMPARATOR)}).
            end().
            start('td').
              style({'vertical-align': 'top'}).
          start(this.DocBorder, {title: 'Class Definition', info$: this.slot(function(selectedClass) { return selectedClass.getOwnAxioms().length + ' / ' + selectedClass.getAxioms().length; })}).
                add(this.slot(function(selectedClass) {
                  if ( ! selectedClass ) return '';
                  return this.ClassDocView.create({data: selectedClass});
                })).
              end().
            end().
              start('td').
              style({
                'vertical-align': 'top'
              }).
              tag(this.ClassList, {
                title: 'Class List',
                showPackages: false,
                showSummary: true,
                data: Object.values(foam.USED).sort(this.MODEL_COMPARATOR)
              }).
              end().
              start('td').
              tag(this.ClassList, {title: 'Sub-Classes', data$: this.subClasses$}).
              br().
              tag(this.ClassList, {title: 'Required-By', data$: this.requiredByClasses$}).
              br().
              tag(this.ClassList, {title: 'Relationships', data$: this.relationshipClasses$}).
            end().
            start('td').
              style({'vertical-align': 'top'}).
              start(this.DocBorder, {title: 'Axiom Definition'}).
                add(this.slot(function (axiom) { return axiom && foam.u2.DetailView.create({data: axiom.axiom}); })).
              end().
            end().
          end().
        end();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'DocBrowserWindow',

  requires: [
    'foam.doc.DocBrowser',
    'foam.core.Window'
  ],

  imports: [ 'window' ],

  properties: [
    'initialClass'
  ],

  methods: [
    function init() {
      // TODO: There should be some helper support to make this easier
      var w = this.window.open('', '', 'width=700, heigh=1000');
      var window = foam.core.Window.create({window: w});
      var browser = this.DocBrowser.create({path: this.initialClass}, window.__subContext__);
      w.document.body.insertAdjacentHTML('beforeend', browser.outerHTML);
      browser.load();
    }
  ]
});


foam.debug.doc = function(opt_obj, showUnused) {
  if ( showUnused ) {
    for ( var key in foam.UNUSED ) foam.lookup(key);
  }

  foam.doc.DocBrowserWindow.create({
    initialClass: foam.core.FObject.isSubClass(opt_obj) ?
      opt_obj.id :
      ( opt_obj && opt_obj.cls_ ) ? opt_obj.cls_.id :
      'foam.core.FObject' });
};


// TODO:
//    remove LinkView


foam.CLASS({
  package: 'foam.doc',
  name: 'UMLDiagram',
  extends: 'foam.u2.Element',

  implements: ['foam.memento.MementoMgr'],
  imports: ['browserPath'],
  requires: [
    'foam.doc.DocBorder',
    'foam.graphics.Label',
    'foam.graphics.Box',
    'foam.u2.PopupView',
    'foam.doc.Link',
    'foam.doc.ClassLink',
    'foam.graphics.Transform'
  ],

  exports: ['as data'],

  constants: {
    SELECTED_COLOR: 'white', //#ddd',
    UNSELECTED_COLOR: '#FFFFCC'
  },

  axioms: [
    // TODO: remove '-' after ActionView when CSS naming fixed
    foam.u2.CSS.create({
      code: function() {
        /*
               ^ { width:1200px; margin: 20px; }
               ^ canvas { border: 1px solid black; }
               ^ .foam-u2-ActionView- { margin: 10px; }
               ^ input[type='range'] { width: 400px; }
               */
      }
    })
  ],

  properties: [
    'feedback_',
    {
      name: 'selected',
      postSet: function(o, n) {
        if (o) o.color = this.UNSELECTED_COLOR;
        if (n) n.color = this.SELECTED_COLOR;
      }
    },
    {
      name: 'canvas',
      factory: function() {
        return this.Box.create({
          width: 1200,
          height: 1000,
          color: '#f3f3f3'
        });
      }
    },
    {
      class: 'String',
      name: 'className',
      value: 'className',
    },
    {
      name: 'elementMap'
    },
    {
      class: 'String',
      name: 'prop',
      value: 'propName',
    },
    {
      name: 'triangleSize',
      value: 5,
    },
    {
      name: 'dashedstep',
      value: 10,
    },
    'data'
  ],

  methods: [
    function initE() {
      var data = this.data;
      this.className = this.data.name;
      this.elementMap = new Map();

      var widthCenterBox = 200;
      var heightCenterBox = 30;

      this.addModel(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addExtends(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addImplements(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addRequires(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addRequiredBy(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addSubClasses(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      /*this.addImports(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addExports(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);*/
      this.addRelatedto(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addRelatedFrom(this.canvas.width / 2 - widthCenterBox / 2, this.canvas.height / 2 - heightCenterBox * 2);
      this.addLegend();

      this.
      addClass(this.myClass()).
      start('center').
      tag('br').
      start(this.canvas).
      on('click', this.onClick).
      end().
      end();
    },

    function sign(ex, sx) {
      if (ex - sx > 0) {
        return 1;
      } else if (ex - sx < 0) {
        return -1;
      } else {
        return 0;
      }
    },

    function dashedLine(d, sx, sy, ex, ey) {
      var dashedLine, changeX = 0,
        changeY = 0;
      changeX = this.sign(ex, sx);
      changeY = this.sign(ey, sy);

      for (var i = 0; i < d - this.dashedstep; i = i + (this.dashedstep * 2)) {
        dashedLine = foam.graphics.Line.create({
          startX: sx + i * (changeX),
          startY: sy + i * (changeY),
          endX: sx + i * (changeX) + this.dashedstep * (changeX),
          endY: sy + i * (changeY) + this.dashedstep * (changeY),
          color: 'black',
          lineWidth: 2
        });
        this.selected = this.canvas.addChildren(dashedLine);
      }
    },

    function triangle(ptX, ptY, ang) {
      return foam.graphics.Polygon.create({
        xCoordinates: [ptX + this.triangleSize * Math.sin(ang), ptX + this.triangleSize * Math.cos(ang), ptX - this.triangleSize * Math.cos(ang), ptX + this.triangleSize * Math.sin(ang)],
        yCoordinates: [ptY, ptY + this.triangleSize * Math.sin(ang) + this.triangleSize * Math.cos(ang), ptY - this.triangleSize * Math.sin(ang) + this.triangleSize * Math.cos(ang), ptY],
        color: 'black'
      });
    },

    function addLegend(x, y, w, h) {
      var startX = 180;
      var startY = 20;
      var d = 120;

      var marge = 4;
      var cls = this.data;
      var legendBox = this.Box.create({
        x: x || 0,
        y: y || 0,
        width: w || 350,
        height: h || 160,
        color: '#ffffe0' || this.UNSELECTED_COLOR,
        border: 'black'
      });

      var legendLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 75,
        y: y - marge || 0,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Legend'
      });

      var ExtendsNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y || startY,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Extends'
      });

      var extendsLinkLine = foam.graphics.Line.create({
        startX: x - 510 || startX,
        startY: y - 570 || startY * 2,
        endX: x + 530 || startX + d,
        endY: y + 530 || startY * 2,
        color: 'black',
        lineWidth: 2
      });

      var triangleEnd = this.triangle(extendsLinkLine.endX, extendsLinkLine.endY, Math.PI / 2);

      this.selected = this.canvas.addChildren(legendBox, legendLabel, extendsLinkLine, triangleEnd, ExtendsNameLabel);

      var dashedLine = this.dashedLine(d, startX, startY * 3, startX + d, startY * 3);

      var triangleEndImplement = this.triangle(startX + d, startY * 3, Math.PI / 2);

      var ImplementNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y - marge || startY * 2,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Implement'
      });

      this.selected = this.canvas.addChildren(ImplementNameLabel, triangleEndImplement);

      requiredLine = foam.graphics.Line.create({
        startX: x - 510 || startX,
        startY: y - 570 || startY * 4,
        endX: x + 530 || startX + d,
        endY: y + 530 + this.triangleSize || startY * 4,
        color: 'black',
        lineWidth: 2
      });

      var requiredConnectorEnd = foam.graphics.Circle.create({
        x: requiredLine.endX,
        y: requiredLine.endY,
        radius: marge,
        border: 'black',
        color: 'white'
      });

      var requiredNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y - marge || startY * 4,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Required By'
      });

      this.selected = this.canvas.addChildren(requiredLine, requiredConnectorEnd, requiredNameLabel);

      requiresLink = foam.graphics.Line.create({
        startX: x - 510 || startX,
        startY: y - 570 || startY * 5,
        endX: x + 530 || startX + d,
        endY: y + 530 || startY * 5,
        color: 'black',
        lineWidth: 2
      });

      var requiresConnectorCircle = foam.graphics.Circle.create({
        x: requiresLink.endX,
        y: requiresLink.endY,
        start: Math.PI / 2,
        end: -Math.PI / 2,
        radius: marge,
        border: 'black',
        color: 'white'
      });

      var RequiresNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y - marge || startY * 3,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Requires'
      });
      this.selected = this.canvas.addChildren(requiresLink, requiresConnectorCircle, RequiresNameLabel);

      var RelatedToNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y || startY * 5,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Related To'
      });

      var RelatedToLinkLine = foam.graphics.Line.create({
        startX: x - 510 || startX,
        startY: y - 570 || startY * 6,
        endX: x + 530 || startX + d,
        endY: y + 530 || startY * 6,
        color: 'black',
        lineWidth: 2
      });
      var arrowRelatedto = this.arrowEnd(RelatedToLinkLine.endX, RelatedToLinkLine.endY, 3 * Math.PI / 2); //3*Math.PI/2
      this.selected = this.canvas.addChildren(RelatedToNameLabel, RelatedToLinkLine, arrowRelatedto); //, RequiresNameLabel

      var RelatedFromNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x || 0,
        y: y || startY * 6,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: 'Related From'
      });

      var RelatedFromLinkLine = foam.graphics.Line.create({
        startX: x - 510 || startX,
        startY: y - 570 || startY * 7,
        endX: x + 530 || startX + d,
        endY: y + 530 || startY * 7,
        color: 'black',
        lineWidth: 2
      });
      var arrowRelatedFrom = this.arrowEnd(RelatedFromLinkLine.startX, RelatedFromLinkLine.startY, Math.PI / 2);

      this.selected = this.canvas.addChildren(RelatedFromNameLabel, RelatedFromLinkLine, arrowRelatedFrom);
    },

    function addModel(x, y, w, h) {
      var marge = 5;
      var step = 30;
      var cls = this.data;
      var modelBox = this.Box.create({
        x: x,
        y: y,
        width: w || 200,
        height: h || 30,
        color: '#ffffe0', //this.UNSELECTED_COLOR
        border: 'black'
      });

      var modelNameLabel = foam.graphics.Label.create({
        align: 'center',
        x: x,
        y: y - marge,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: this.className
      });

      var propertyBox = this.Box.create({
        x: x,
        y: y + step,
        width: w || 200,
        height: h || step * 5,
        color: '#ffffe0', //this.UNSELECTED_COLOR
        border: 'black',
        text: this.prop
      });

      var propertyNameLabel = foam.graphics.Label.create({
        align: 'left',
        x: x - 160,
        y: y + step,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: cls.model_.properties !== undefined ? 'Properties: ' + cls.model_.properties.length : 'Properties: ' + 0
      });

      var methodsNameLabel = foam.graphics.Label.create({
        align: 'left',
        x: x - 160,
        y: y + step * 2,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: cls.model_.methods !== undefined ? 'Methods : ' + cls.model_.methods.length : 'Methods : ' + 0
      });

      var actionsNameLabel = foam.graphics.Label.create({
        align: 'left',
        x: x - 160,
        y: y + step * 3,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: cls.getAxiomsByClass(foam.core.Action) !== undefined ? 'Action : ' + cls.getAxiomsByClass(foam.core.Action).length : 'Actions : ' + 0
      });

      var listenersNameLabel = foam.graphics.Label.create({
        align: 'left',
        x: x - 160,
        y: y + step * 4,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: cls.getAxiomsByClass(foam.core.Listener) !== undefined ? 'Listener : ' + cls.getAxiomsByClass(foam.core.Listener).length : 'Listener : ' + 0
      });

      var RelationshipNameLabel = foam.graphics.Label.create({
        align: 'left',
        x: x - 160,
        y: y + step * 5,
        color: 'black',
        font: '20px Arial',
        width: w || 200,
        height: h || 30,
        text: cls.getAxiomsByClass(foam.dao.Relationship) !== undefined ? 'Relationship : ' + cls.getAxiomsByClass(foam.dao.Relationship).length : 'Relationship : ' + 0
      });

      this.selected = this.canvas.addChildren(modelBox, modelNameLabel, propertyBox, propertyNameLabel, methodsNameLabel, actionsNameLabel, listenersNameLabel,RelationshipNameLabel); //TODO , RelationshipNameLabel
    },    

    function setData(mapDataX, mapDataY, cls) {
      this.elementMap.set({
        x: mapDataX,
        y: mapDataY
      }, cls);
    },

    function addExtends(x, y, w, h) {
      var marge = 5;
      var d = 90;
      var cls = this.data;

      for (var i = 0; cls; i++) {
        cls = this.lookup(cls.model_.extends, true);
        var extendsBox = this.Box.create({
          x: x,
          y: y - ((i + 1) * d),
          width: w || 200,
          height: h || 30,
          color: '#ffffe0', //this.UNSELECTED_COLOR
          border: 'black'
        });

        this.setData(extendsBox.x, extendsBox.y, cls.id);

        var extendsNameLabel = foam.graphics.Label.create({
          align: 'center',
          x: x,
          y: y - ((i + 1) * d) - marge,
          color: 'black',
          font: '20px Arial',
          width: w || 200,
          height: h || 30,
          text: cls.name
        });

        extendsLine = foam.graphics.Line.create({
          startX: x + extendsBox.width / 2 || 0,
          startY: y - (d * i),
          endX: x + extendsBox.width / 2 || 0,
          endY: y - (d * i) - (extendsBox.height * 2) + this.triangleSize,
          color: 'black',
          lineWidth: 2
        });

        var triangleEndExtends = this.triangle(x + extendsBox.width / 2, y - (d * i) - (extendsBox.height * 2),0);

        this.selected = this.canvas.addChildren(extendsBox, extendsNameLabel, extendsLine, triangleEndExtends);

        this.setData(extendsBox.x, extendsBox.y, cls);

        if (cls === foam.core.FObject) break;
      }
    },

    function addImplements(x, y, w, h) {
      var marge = 5;
      var sideY = 150; //d
      var sideX = -250;
      var cls = this.data;

      if (cls.model_.implements !== undefined) {
        for (var key in cls.model_.implements) {
          var a = cls.model_.implements[key];
          if (a.path !== undefined) {
            var implementsName = this.Box.create({
              x: x - sideX,
              y: y - sideY,
              width: w || 200,
              height: h || 30,
              color: '#ffffe0', //this.UNSELECTED_COLOR
              border: 'black'
            });

            this.setData(implementsName.x, implementsName.y, a.path);

            var implementsNameLabel = foam.graphics.Label.create({
              align: 'center',
              x: x - sideX + this.dashedstep,
              y: y - sideY - marge,
              color: 'black',
              font: '20px Arial',
              width: w || 200,
              height: h || 30,
              text: a.path
            });

            var dashedLine = this.dashedLine(sideY, x + implementsName.width * 3 / 4 + this.dashedstep, y - this.dashedstep, x + sideY + (implementsName.width * 3 / 4) - implementsName.height, y - sideY + implementsName.height);

            var triangleEndImplement = this.triangle(x + sideY + implementsName.width * 3 / 4 - implementsName.height, y - sideY + implementsName.height,0);

            this.selected = this.canvas.addChildren(implementsName, implementsNameLabel, triangleEndImplement);
          }
        }
      }
    },

    function addRequires(x, y, w, h) {
      var triangleSize = 5;
      var marge = 5;
      var d = 300;
      var cls = this.data;
      if (cls.model_.requires !== undefined) {
        for (var key in cls.model_.requires) {
          var a = cls.model_.requires[key];
          var requiresName = this.Box.create({
            x: x + d,
            y: y + triangleSize * (key + 1),
            width: w || 200,
            height: h || 30,
            color: '#ffffe0', //this.UNSELECTED_COLOR
            border: 'black'
          });

          this.setData(requiresName.x, requiresName.y, a.path);

          var requiresNameLabel = foam.graphics.Label.create({
            align: 'center',
            x: x + d,
            y: y + triangleSize * (key + 1) - marge,
            color: 'black',
            font: '20px Arial',
            width: w || 200,
            height: h || 30,
            text: a.name
          });

          requiresLine = foam.graphics.Line.create({
            startX: x + requiresName.width || 0,
            startY: y + requiresName.height / 2 || 0,
            endX: x + d || 0,
            endY: y + triangleSize * (key + 1) + requiresName.height / 2 || 0,
            color: 'black',
            lineWidth: 2
          });

          var requiresConnectorCircle = foam.graphics.Circle.create({
            x: x + d,
            y: y + triangleSize * (key + 1) + requiresName.height / 2,
            radius: marge,
            border: 'black',
            color: 'white'
          });
          this.selected = this.canvas.addChildren(requiresLine, requiresConnectorCircle, requiresName, requiresNameLabel);
        }
      }
    },

    function addRequiredBy(x, y, w, h) {
      var triangleSize = 5;
      var marge = 5;
      var d = 300;
      var cls = this.data;
      if (cls !== undefined) {
        var path = cls.id;
        var req = Object.values(foam.USED).
        filter(function(cls) {
          return cls.model_.requires && cls.model_.requires.map(
            function(r) {
              return r.path;
            }).includes(path);
        });

        for (var key in req) {
          var a = req[key];
          var requiresByName = this.Box.create({
            x: x - d,
            y: y + triangleSize * (key + 1),
            width: w || 200,
            height: h || 30,
            color: '#ffffe0', //this.UNSELECTED_COLOR
            border: 'black'
          });

          this.setData(requiresByName.x, requiresByName.y, a.id);

          var requiresByNameLabel = foam.graphics.Label.create({
            align: 'center',
            x: x - d,
            y: y + triangleSize * (key + 1) - marge,
            color: 'black',
            font: '20px Arial',
            width: w || 200,
            height: h || 30,
            text: a.name
          });

          requiresByLine = foam.graphics.Line.create({
            startX: x - d + requiresByName.width + requiresByName.width / 2 || 0,
            startY: y + requiresByName.height / 2 || 0,
            endX: x - d + requiresByName.width + marge || 0,
            endY: y + triangleSize * (key + 1) + requiresByName.height / 2 || 0,
            color: 'black',
            lineWidth: 2
          });
          var requiresByconnector = foam.graphics.Circle.create({
            x: x - d + requiresByName.width,
            y: y + triangleSize * (key + 1) + requiresByName.height / 2,
            radius: marge,
            border: 'black',
            color: 'white'
          });
          this.selected = this.canvas.addChildren(requiresByName, requiresByNameLabel, requiresByLine, requiresByconnector);
        }
      }
    },

    function addSubClasses(x, y, w, h) {
      var marge = 4;
      var d = 300;      
      var boxLarge = 35;
      var endPtD = 180;

      var cls = this.data;

      if (cls !== undefined) {
        var path = cls.id;
        var req = Object.values(foam.USED).
        filter(function(cls) {
          return cls.model_.extends == path || 'foam.core.' + cls.model_.extends == path;
        }).sort(this.MODEL_COMPARATOR);
      };

      var nbr = Math.trunc(req.length / 2);
      x = x - ((nbr) * boxLarge);

      for (var key in req) {
        var a = req[key];
        var subClassesName = this.Box.create({
          x: x + 210 * (key - nbr) + ((nbr) * boxLarge),
          y: y + d,
          width: w || 200,
          height: h || 30,
          color: '#ffffe0', //this.UNSELECTED_COLOR
          border: 'black'
        });

        this.setData(subClassesName.x, subClassesName.y, a.id);

        var subClassesNameLabel = foam.graphics.Label.create({
          align: 'center',
          x: x + 210 * (key - nbr) + ((nbr) * boxLarge),
          y: y + d - marge,
          color: 'black',
          font: '20px Arial',
          width: w || 200,
          height: h || 30,
          text: a.name
        });

        subClassesLine = foam.graphics.Line.create({
          startX: x + subClassesName.width / 2 + ((nbr) * boxLarge) || 0,
          startY: y + endPtD + this.triangleSize || 0,
          endX: x + subClassesName.width / 2 + ((nbr) * boxLarge) + 210 * (key - nbr) || 0,
          endY: y + d || 0,
          color: 'black',
          lineWidth: 2
        });

        var triangleEndSubClasses = this.triangle(x + subClassesName.width / 2 + ((nbr) * boxLarge), y + endPtD, 0);

        this.selected = this.canvas.addChildren(subClassesName, subClassesNameLabel, subClassesLine, triangleEndSubClasses);
      }
    },

    function arrowEnd(ptX, ptY, ang) {
      return foam.graphics.Polygon.create({
        xCoordinates: [ptX + this.triangleSize * Math.sin(ang) - this.triangleSize * Math.cos(ang), ptX, ptX + this.triangleSize * Math.sin(ang) + this.triangleSize * Math.cos(ang)],
        yCoordinates: [ptY + this.triangleSize * Math.sin(ang) + this.triangleSize * Math.cos(ang), ptY, ptY - this.triangleSize * Math.sin(ang) + this.triangleSize * Math.cos(ang)],
        color: 'black'
      });
    },

    function addRelatedto(x, y, w, h) {

      var d = 300;
      var d1 = 200;
      var cls = this.data;

      if (cls.getAxioms(foam.dao.Relationship) !== undefined) {

        for (var key in cls.getAxiomsByClass(foam.dao.Relationship)) {
          var a = cls.getAxiomsByClass(foam.dao.Relationship)[key];
          if (a.targetModel === cls.id) {

            var relatedtoName = this.Box.create({
              x: x + d,
              y: y + d1 + 5 * (key + 1),
              width: w || 200,
              height: h || 30,
              color: '#ffffe0', //this.UNSELECTED_COLOR
              border: 'black'
            });

            this.setData(relatedtoName.x, relatedtoName.y, a.sourceModel);

            var relatedtoNameLabel = foam.graphics.Label.create({
              align: 'center',
              x: x + d,
              y: y + d1 + 5 * (key + 1),
              color: 'black',
              font: '20px Arial',
              width: w || 200,
              height: h || 30,
              text: eval(a.sourceModel).name
            });

            relatedtoline = foam.graphics.Line.create({
              startX: x + relatedtoName.width || 0,
              startY: y + relatedtoName.height || 0,
              endX: x + d || 0,
              endY: y + d1 + 5 * (key + 1) + relatedtoName.height * 1 / 3 || 0,
              color: 'black',
              lineWidth: 2
            });

            var arrowRelatedto = this.arrowEnd(relatedtoline.endX, relatedtoline.endY, Math.PI);

            var cardinalityToNameLabel;
            if (a.cardinality !== 'undefined') {
              cardinalityToNameLabel = foam.graphics.Label.create({
                align: 'center',
                x: relatedtoline.endX - relatedtoName.width / 2 - 25,
                y: relatedtoline.endY - relatedtoName.height * 1 / 3,
                color: 'black',
                font: '20px Arial',
                width: w || 200,
                height: h || 30,
                text: a.cardinality
              });
              this.selected = this.canvas.addChildren(relatedtoName, relatedtoNameLabel, relatedtoline, arrowRelatedto, cardinalityToNameLabel);
            } else {
              this.selected = this.canvas.addChildren(relatedtoName, relatedtoNameLabel, relatedtoline, arrowRelatedto);
            }
          }
        }
      }
    },

    function addRelatedFrom(x, y, w, h) {
      
      var marge = 45;
      var d = -300;
      var d1 = 210;
      var cls = this.data;

      var axeX = x + d;
      var axeY = y + d1;

      var req = Object.values(foam.USED)
        .forEach(function(key11) {
          return key11.getAxioms(foam.dao.Relationship);

        }, this);
      var fruits = [];

      for (var key1 in Object.values(foam.USED)) {
        for (var key in Object.values(foam.USED)[key1].getAxiomsByClass(foam.dao.Relationship)) {
          var a = Object.values(foam.USED)[key1].getAxiomsByClass(foam.dao.Relationship)[key];
          reteive = false;
          for (var key11 in fruits) {
            if (fruits[key11].sourceModel == a.sourceModel && fruits[key11].targetModel == a.targetModel) {
              reteive = true;
              break;
            }
          }
          if (!reteive) {
            fruits.push(a);
          }
        }
      }

      for (var k in fruits) {
        var a = fruits[k];
        if (a.sourceModel === cls.id) {
          axeY = axeY + marge;

          var RelatedFromName = foam.graphics.Box.create({
            x: axeX,
            y: axeY,
            width: w || 200,
            height: h || 30,
            color: '#ffffe0', //this.UNSELECTED_COLOR
            border: 'black'
          });

          this.setData(RelatedFromName.x, RelatedFromName.y, a.targetModel);

          var RelatedFromNameLabel = foam.graphics.Label.create({
            align: 'center',
            x: axeX,            
            y: axeY,
            color: 'black',
            font: '20px Arial',
            width: w || 200,
            height: h || 30,
            text: eval(a.targetModel).name
          });

          RelatedFromLine = foam.graphics.Line.create({
            startX: axeX + RelatedFromName.width + RelatedFromName.width / 2 || 0,
            startY: y + RelatedFromName.height || 0,

            endX: axeX + RelatedFromName.width || 0,
            endY: axeY + RelatedFromName.height / 2 || 0,
            color: 'black',
            lineWidth: 2
          });

          var arrowRelatedFrom = this.arrowEnd(RelatedFromLine.startX, RelatedFromLine.startY, 0);

          var cardinalityFromNameLabel;
          if (a.cardinality !== 'undefined') {
            cardinalityFromNameLabel = foam.graphics.Label.create({
              align: 'center',
              x: RelatedFromLine.endX - RelatedFromName.width / 2 + 25,
              y: RelatedFromLine.endY - RelatedFromName.height / 2,              
              color: 'black',
              font: '20px Arial',
              width: w || 200,
              height: h || 30,
              text: a.cardinality
            });
            this.selected = this.canvas.addChildren(RelatedFromName, RelatedFromNameLabel, RelatedFromLine, arrowRelatedFrom, cardinalityFromNameLabel);
          } else {
            this.selected = this.canvas.addChildren(RelatedFromName, RelatedFromNameLabel, RelatedFromLine, arrowRelatedFrom);
          }
		  
        }
      }
    },
    //************** not supported yet **************************

    function addExports(x, y, w, h) {
      var d = 100;
      var cls = this.data;
      if (cls.model_.exports !== undefined) {
        for (var key in cls.model_.exports) {
          var a = cls.model_.exports[key];
          var exportsName = this.Box.create({
            x: x + d,
            y: y + 5 * (key + 1),
            width: w || 200,
            height: h || 30,
            color: '#ffffe0', //this.UNSELECTED_COLOR
            border: 'black'
          });

          this.setData(exportsName.x, exportsName.y, a.id);

          var exportsNameLabel = foam.graphics.Label.create({
            align: 'center',
            x: x + d,
            y: y + 5 * (key + 1),
            color: 'black',
            font: '20px Arial',
            width: w || 200,
            height: h || 30,
            text: a.name
          });

          exportsLine = foam.graphics.Line.create({
            startX: x + exportsName.width / 2 || 0,
            startY: y || 0,
            endX: x + exportsName.width / 2 || 0,
            endY: y - d + exportsName.height || 0,
            color: 'black',
            lineWidth: 2
          });

          this.selected = this.canvas.addChildren(exportsName, exportsNameLabel); // TODO add the link
        }
      }
    },

    function addImports(x, y, w, h) {
      var d = 100;
      var cls = this.data;
      if (cls.model_.imports !== undefined) {
        for (var key in cls.model_.imports) {
          var a = cls.model_.imports[key];
          var importsName = this.Box.create({
            x: x + d,
            y: y + 5 * (key + 1),
            width: w || 200,
            height: h || 30,
            color: '#ffffe0', //this.UNSELECTED_COLOR
            border: 'black'
          });

          var importsNameLabel = foam.graphics.Label.create({
            align: 'center',
            x: x + d,
            y: y + 5 * (key + 1),
            color: 'black',
            font: '20px Arial',
            width: w || 200,
            height: h || 30,
            text: a.name
          });

          importsLine = foam.graphics.Line.create({
            startX: x + importsName.width / 2 || 0,
            startY: y || 0,
            endX: x + importsName.width / 2 || 0,
            endY: y - d + importsName.height || 0,
            color: 'black',
            lineWidth: 2
          });

          this.selected = this.canvas.addChildren(importsName, importsNameLabel); //TODO add the link
        }
      }
    }
  ],

  listeners: [
    function onClick(evt) {
      var x = evt.offsetX,
        y = evt.offsetY;
      var c = this.canvas.findFirstChildAt(x, y);
      var xc = c.instance_.x;
      var yc = c.instance_.y;

      for (var [key, value] of this.elementMap.entries()) {
        if (key.x === xc && key.y === yc) {
          this.browserPath$.set(value);
          evt.preventDefault();
        }
      }
    }
  ]
});
