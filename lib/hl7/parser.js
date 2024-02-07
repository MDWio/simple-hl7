var component = require('./component');
var field     = require('./field');
var fs        = require('fs');
var header    = require('./header');
var message   = require('./message');
var segment   = require('./segment');

function parser(opts) {

  this.message = null;
  this.delimiters = {
    fieldSeparator: "|",
    componentSeparator: "^",
    subcomponentSeparator: "&",
    escapeCharacter: "\\",
    repititionCharacter: "~",
    segmentSeparator: opts ? opts.segmentSeparator : '\r'
  }

}

parser.prototype.parse = function(s) {
  this.message = new message();
  var segments = s.split(this.delimiters.segmentSeparator);

  for (var i = 0; i < segments.length; i++) {
    if (i == 0) {
      this.message.header = this.parseHeader(segments[i]);
    } else {
      if (segments[i].trim() != "") {
        this.message.segments.push(this.parseSegment(segments[i]));
      }
    }

  }

  return this.message;

}

parser.prototype.parseFile = function(path, callback) {
  var _p = this;
  fs.readFile(path, function(err, data) {
    return callback(_p.parse(data.toString()));
  });
}

parser.prototype.parseFileSync = function(path) {
  var _p = this;
  var data = fs.readFileSync(path);
  return _p.parse(data.toString())
}


parser.prototype.parseHeader = function(s) {
  var h = new header();
  var fields = s.split(this.delimiters.fieldSeparator);

  for (var i = 2; i < fields.length; i++ ) {
    h.fields.push(this.parseField(fields[i]));
  }

  return h;
}

parser.prototype.parseSegment = function(s) {
  var seg = new segment();
  var fields = s.split(this.delimiters.fieldSeparator);

  seg.name = fields[0];

  for (var i = 1; i < fields.length; i++ ) {
    seg.fields.push(this.parseField(fields[i]));
  }

  return seg
}

parser.prototype.parseField = function(s) {
  var f = new field();

  if (s.indexOf(this.delimiters.repititionCharacter) != -1) {
    var _fs = s.split(this.delimiters.repititionCharacter);
    for (var i = 0; i < _fs.length; i++) {
      f.value.push(this.parseField(_fs[i]));
    }
  } else {
    var components = s.split(this.delimiters.componentSeparator);
    var cs = []
    for (var i = 0; i < components.length; i++) {
      cs.push(this.parseComponent(components[i]));
    }
    f.value.push(cs);
  }

  return f;
}

parser.prototype.parseComponent = function(s) {
  var c = new component();
  if (s.indexOf(this.delimiters.repititionCharacter) != -1) {
    var cs = s.split(this.delimiters.repititionCharacter);
    for (var i = 0; i < cs.length; i++ ) {
      c.value.push(parseComponent(cs[i]));
    }
  } else {
    if (s.indexOf(this.delimiters.subcomponentSeparator) != -1) {
      var subcomponents = s.split(this.delimiters.subcomponentSeparator);
      var subs = [];
      for (var i = 0; i < subcomponents.length; i++) {
        subs.push(subcomponents[i]);
      }
      c.value.push(subs);
    } else {
      c.value.push(s)
    }
  }
  return c
}


module.exports = parser;
