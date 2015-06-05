import Ember from "ember";
import TimerConsts from "./TimerConsts";

var
curTimer = null,
timers = Ember.A([]),
timerFunction = function() {
  Ember.run(function() {
    if(timers.length === 0) {
      clearTimeout(curTimer);
      curTimer = null;
    }
    else {
      for(var i = 0; i < timers.length;) {
        var timer = timers[i];
        timer.decrementProperty("ticks");
        if(timer.get("count") !== 0 && timer.get("ticks") === 0) {
          timer.set("ticks", Math.ceil(timer.get("timeout") / TimerConsts.TIMERTIMEOUT));
          timer.timerCallback();
          if(timer.get("count") > 0) {
            timer.decrementProperty("count");
          }
        }
        if(timer.get("count") === 0) {
          timers.removeAt(i);
          timer.endCallback();
          timer.get("resolve")();
        }
        else {
          i++;
        }
      }
    }
  });
};

/**
 * A timer module which executes a job periodically.
 *
 * @class TimerObj
 * @for EmberTimerUtils
 */
export default Ember.Object.extend({
  init : function() {
    this._super();
    timers.push(this);
    this.set("ticks", Math.ceil(this.get("timeout") / TimerConsts.TIMERTIMEOUT));
    if(!curTimer) {
      curTimer = setInterval(timerFunction, TimerConsts.TIMERTIMEOUT);
    }
    var that = this;
    this.set("promise", new Ember.RSVP.Promise(function(resolve, reject) {
      that.setProperties({
        resolve : resolve,
        reject : reject,
      });
    }));
  },

  /**
   * Periodic timeout after which the job should be executed.
   *
   * @property timeout
   * @type boolean
   * @default EmberTimerUtils.TIMERTIMEOUT
   */
  timeout : TimerConsts.TIMERTIMEOUT,

  /**
   * Number of times of EmberTimerUtils.TIMERTIMEOUT per period.
   *
   * @property ticks
   * @type Number
   * @default 1
   * @private
   */
  ticks : 1,

  /**
   * Number of times to execute the job. -1 to execute indefinitely.
   *
   * @property count
   * @type Number
   * @default -1
   */
  count : -1,

  /**
   * Callback executed every period. The job goes here.
   *
   * @method timerCallback
   */
  timerCallback : function() {
  },


  /**
   * Callback executed after the end of timer.
   *
   * @method endCallback
   */
  endCallback : function() {
  },

  promise : null,
  resolve : null,
  reject : null,

  /**
   * Stop the timer if not already competed.
   *
   * @method stopTimer
   */
  stopTimer : function() {
    this.set("count", 0);
  },
});
