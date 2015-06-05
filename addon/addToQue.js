import Ember from "ember";
import TimerConsts from "./TimerConsts";
import queMap from "./queMap";
import AsyncQue from "./AsyncQue";

/**
 * Public API to create a job into async que.
 * 
 * @method addToQue
 * @for EmberTimerUtils
 * @return {Class} Promise created for the async-que.
 * @param {String} key Unique identifier for the job.
 * @param {Number} [timeout=EmberTimerUtils.TIMEOUT] timeout after which the job should be run.
 */
export default function(key, timeout) {
  if(queMap[key]) {
    queMap[key].set("resolved", true);
    queMap[key].get("reject")();
  }
  var promise;
  Ember.run(function() {
    promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var asyncQue = AsyncQue.create({key : key, resolve : resolve, reject : reject, timeout : timeout || TimerConsts.TIMEOUT});
      queMap[key] = asyncQue;
    });
  });
  return promise;
}
