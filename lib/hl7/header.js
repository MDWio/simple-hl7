var field = require('./field');
var delimiters = require('./delimiters');
var segment = require('./segment');

function header() {

  this.name = "MSH";
  this.delimiters = {
    fieldSeparator: "|",
    componentSeparator: "^",
    subcomponentSeparator: "&",
    escapeCharacter: "\\",
    repititionCharacter: "~",
    segmentSeparator: '\r'
  };

  this.fields = [];

  if (arguments.length > 1) {

    for (var i = 0; i < arguments.length; i++) {

      if (Array.isArray(arguments[i])) {
        var fields = new Array();
        for (var ii = 0; ii < arguments[i].length; ii++) {
          fields.push(new field(arguments[i][ii]));
        }
        this.fields.push(fields);
      } else {
        for (var i = 0; i < arguments.length; i++) {
          this.fields.push(new field(arguments[i]));
        }
      }
    }
  }
}

header.prototype.addField = segment.prototype.addField;

header.prototype.setField = segment.prototype.setField;

header.prototype.removeField = segment.prototype.removeField;

header.prototype.getField = segment.prototype.getField;

header.prototype.getComponent = segment.prototype.getComponent;

header.prototype.toString = function() {
  var returnString =
    this.name +
    this.delimiters.fieldSeparator +
    this.delimiters.componentSeparator +
    this.delimiters.repititionCharacter +
    this.delimiters.escapeCharacter +
    this.delimiters.subcomponentSeparator +
    this.delimiters.fieldSeparator

    for (var i = 0; i < this.fields.length; i++) {
      returnString += this.fields[i].toString(this.delimiters);

      if (i != this.fields.length - 1) returnString += this.delimiters.fieldSeparator

    }
    return returnString;
}

module.exports = header;
