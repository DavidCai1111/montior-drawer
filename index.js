/**
 * Module dependencies
 * @private
 */

var os = require('os');
var sleep = require('sleep');
var cluster = require('cluster');

/**
 * Module exports
 * @public
 */

exports.line = line;
exports.mid = mid;
exports.wave = wave;
exports.cliff = cliff;

/**
 * Basic function for drawing
 * @param  {number} busy busyTime
 * @param  {number} idle idleTime
 * @private
 */

function _draw (busy, idle) {
  var busy = busy;
  var idle = idle;
  var startTime = 0;
  while (!end) {
    startTime = os.uptime();
    while ((os.uptime() - startTime)/1000 <= busy) {
      ;
    }
    sleep.usleep(idle * 1000);
  }
}

/**
 * Draw a line
 * @public
 */

function line () {
  _draw(10, 10);
}

/**
 * Draw a line at the middle of the monitor
 * @public
 */

function mid () {
  if (cluster.isMaster) {
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    line();
  }
}

/**
 * Draw a wave
 * @public
 */

function wave () {
  var amplitude = 300 / 2;
  var incr = 2 / 200;
  var radian = 0;
  var points = [];
  var startTime = 0;

  for (var i = 0; i < 200; i++) {
    points.push(amplitude + Math.sin(Math.PI * radian) * amplitude);
    radian += incr;
  }

  for (var j = 0; ; j = (j + 1) % 200) {
    startTime = os.uptime();
    while ((os.uptime() - startTime) <= points[j] / 10) {
      ;
    }
    sleep.sleep(Math.ceil((300 / 10 - points[j] / 10)));
  }
}

/**
 * Draw a cliff， 7s is nearly a tick of OS X's monitor
 * @public
 */
function cliff () {
  _draw(7 * 1000, 7 * 1000);
}
