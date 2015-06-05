import Ember from "ember";
import TimerConsts from "./TimerConsts";
import AsyncQue from "./AsyncQue";
import addToQue from "./addToQue";
import TimerObj from "./TimerObj";

/**
 * Timer module with stuff related to timers.
 *
 * @module timer
 */

/**
 * @class EmberTimerUtils
 */
var EmberTimerUtils = Ember.Namespace.create();

EmberTimerUtils.TimerConsts = TimerConsts;
EmberTimerUtils.AsyncQue = AsyncQue;
EmberTimerUtils.addToQue = addToQue;
EmberTimerUtils.TimerObj = TimerObj;

export default EmberTimerUtils;
