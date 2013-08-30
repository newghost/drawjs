/*
Description: Custom d3 plugins for drawjs
Repository:  https://github.com/newghost/drawjs
*/
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

/*
Clone a d3 object, including the binding data;
TODO: There should be support d3.selectAll;
*/
d3.selection.prototype.clone = function() {
  var _this     = this
    , _newThis  = []
    , node      = _this[0][0]
    , datas     = _this.data()
    , newData   = [];

  //clone a new data for binding;
  datas.forEach(function(data) {
    newData.push(Object.create(data));
  });

  _newThis = d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
  _newThis.data(newData);

  return _newThis;
};

/*
Trigger event;
TODO: Do more testing
*/
d3.selection.prototype.trigger = function(evtName) {
  var el    = this[0][0]
    , event = d3.event;

  if (event.initMouseEvent) {     // all browsers except IE before version 9
      var mousedownEvent = document.createEvent ("MouseEvent");
      mousedownEvent.initMouseEvent(
          evtName, true, true, window, 0, 
          event.screenX, event.screenY, event.clientX, event.clientY, 
          event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 
          0, null
      );
      el.dispatchEvent(mousedownEvent);
  } else {
      if (document.createEventObject) {   // IE before version 9
          var mousedownEvent = document.createEventObject (window.event);
          mousedownEvent.button = 1;  // left button is down
          el.fireEvent(evtName, mousedownEvent);
      }
  }
};

/*
Find the matched elements from it's parent
TODO: support d3.selectAll
*/
d3.selection.prototype.closest = function(selector) {
  var nodes = this[0]
    , prefix = selector.charAt(0);

  for (var i = nodes.length; i-->0;) {
    var parent = nodes[i];
    while (parent = parent.parentNode) {
      if (parent.tagName == "BODY") break;

      var element = d3.select(parent);
      if (element.classed(selector)) {
        return element;
      }
    }
  }
  return d3.select();
};

/*
change translate of transofrm property
*/
d3.selection.prototype.translate = function(x, y) {
  var module = this
    , transform = module.attr("transform")
    , translate = "translate(" + [ x, y ] + ")";

  transform = transform.indexOf("translate") > -1
    ? transform.replace(/translate\([\.\,\ \-0-9]+\)/g, translate)
    : (transform + ", " + translate);

  module.attr("transform", transform);
};

/*
change scale of transofrm property
*/
d3.selection.prototype.scale = function(sx, sy) {
  var module = this
    , transform = module.attr("transform")
    , scaleExpr = "scale(" +  [ sx, sy ] + ")";

  transform = transform.indexOf("scale") > -1
    ? transform.replace(/scale\([\.\,\ \-0-9]+\)/g, scaleExpr)
    : (transform + ", " + scaleExpr);

  module.attr("transform", transform);
};

/*
Connect two d3 objects
*/
d3.select.prototype.equal = function(_d3) {
  return this[0][0] == _d3[0][0];
};
