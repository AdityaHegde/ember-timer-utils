import Ember from "ember";
import TimerConsts from "./TimerConsts";
import queMap from "./queMap";

/**
 * @class AsyncQue
 * @for EmberTimerUtils
 * @private
 */
export default Ember.Object.extend({
  init : function() {
    this._super();
    var that = this;
    Ember.run.later(function() {
      that.timerTimedout();
    }, that.get("timeout") || TimerConsts.TIMEOUT);
  },

  timerTimedout : function() {
    if(!this.get("resolved")) {
      var that = this;
      Ember.run(function() {
        delete queMap[that.get("key")];
        that.set("resolved", true);
        that.get("resolve")();
      });
    }
  },

  /**
   * native timer
   *
   * @property timer
   * @for AsyncQue
   * @type Number
   */
  timer : null,

  /**
   * unique identifier for the associated task
   *
   * @property key
   * @type String
   */
  key : "",

  /**
   * resolve function of the associated promise
   *
   * @property resolve
   * @type Function
   */
  resolve : null,

  /**
   * reject function of the associated promise
   *
   * @property reject
   * @type Function
   */
  reject : null,

  /**
   * boolean to indicate whether the associated promise has resolved
   *
   * @property resolved
   * @type boolean
   */
  resolved : false,

  /**
   * timeout after which the associated promise resolves
   *
   * @property reject
   * @type Number
   */
  timeout : TimerConsts.TIMEOUT,
});
