import Ember from "ember";
import EmberTimerUtils from "ember-timer-utils";
import { module, test } from "qunit";
import startApp from '../helpers/start-app';

module("timer : TimerObj", {
  beforeEach : function(assert) {
    assert.application = startApp();
  },
  afterEach : function(assert) {
    Ember.run(assert.application, 'destroy');
  },
});

function closeTo(pt, err, dur) {
  var elapsed = new Date().getTime() - pt;
  return elapsed >= dur - err && elapsed <= dur + err;
}

test("Sanity Test", function(assert) {
  var runCount = 0, end = 0,
      d, timingWasAsExpected = true;
  Ember.run(function() {
    d = new Date().getTime();
    EmberTimerUtils.TimerObj.create({
      count : 5,
      timerCallback : function() {
        runCount++;
        timingWasAsExpected &= closeTo(d, 20, EmberTimerUtils.TimerConsts.TIMERTIMEOUT);
        d = new Date().getTime();
      },
      endCallback : function() {
        end = 1;
      },
    });
    Ember.run.later(function() {}, 1500);
  });
  wait();
  andThen(function() {
    assert.equal(runCount, 5, "Timer ran for 5 times!");
    assert.equal(end, 1, "Timer endCallback was called");
    assert.ok(timingWasAsExpected, "timerCallback was called at the right intervals");
  });
});

test("Different period.", function(assert) {
  var runCount = 0, end = 0,
      d, timingWasAsExpected = true;
  Ember.run(function() {
    d = new Date().getTime();
    EmberTimerUtils.TimerObj.create({
      count : 3,
      timeout : 750,
      timerCallback : function() {
        runCount++;
        timingWasAsExpected &= closeTo(d, 20, 750);
        d = new Date().getTime();
      },
      endCallback : function() {
        end = 1;
      },
    });
    Ember.run.later(function() {}, 2500);
  });
  wait();
  andThen(function() {
    assert.equal(runCount, 3, "Timer ran for 3 times!");
    assert.equal(end, 1, "Timer endCallback was called");
    assert.ok(timingWasAsExpected, "timerCallback was called at the right intervals");
  });
});
