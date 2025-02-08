var chokidar     = require('chokidar');
var EventEmitter = require('events').EventEmitter;
var fs           = require('fs');
var Parser       = require('../hl7/parser.js');
var util         = require('util');

function FileServer(options, handler) {
  EventEmitter.call(this);

  if (!handler) {
    handler = options;
    options = {};
  }

  this.watcher = null;
  this.handler = handler;
  this.parser = options.parser || new Parser();
}

util.inherits(FileServer, EventEmitter);

function Req(msg, f) {
  this.file = f;
  this.msg = msg;
  this.sender = msg.header.getField(1).length == 1 ?
    msg.header.getField(1).toString() :
    msg.header.getField(1);

  this.facility = msg.header.getField(2).length == 1 ?
    msg.header.getField(2).toString() :
    msg.header.getField(2);

  this.type = msg.header.getComponent(7, 1).toString();
  this.event = msg.header.getComponent(7, 2).toString();
}

function Res() {

}

FileServer.prototype.start = function(src) {
  var self = this;
  var createdFiles = [];

  this.watcher = chokidar
    .watch(src, {
      usePolling: true,
      interval: 100,
      awaitWriteFinish: {
        stabilityThreshold: 1, // consider file as ready, if filesize wasn't changed for n seconds
        pollInterval: 100,
      },
    })
    .on('add', async (f) => {
      if (createdFiles.indexOf(f) == -1) {
        createdFiles.push(f);

        fs.readFile(f, function(err, data) {
          if (err) {
            self.handler(err);
            return;
          }

          try {
            var hl7 = self.parser.parse(data.toString());
            var req = new Req(hl7, f);
            var res = new Res();
            self.handler(null, req, res);
          } catch (e) {
            self.handler(e);
          }
        });
      }
    });
}

FileServer.prototype.stop = function() {
  this.watcher.close()
}


module.exports = FileServer;
