import Ember from "ember";
import EmberTimerUtils from "ember-timer-utils";
import { module, test } from "qunit";
import startApp from '../helpers/start-app';

module("timer : AsyncQue", {
  beforeEach : function(assert) {
    assert.application = startApp();
  },
  afterEach : function(assert) {
    Ember.run(assert.application, 'destroy');
  },
});

test("Sanity test", function(assert) {
  var run = false;
  EmberTimerUtils.addToQue("test-async").then(function() {
    run = true;
  });
  andThen(function() {
    assert.ok(!run, "Callback not run yet");
  });
  Ember.run.later(function() {
    assert.ok(run, "Callback ran after 500ms (aprox.)");
  }, 500);
});

test("With same keys", function(assert) {
  var queRunCount1st = 0, queRunCountTotal = 0;
  for(var i = 0; i < 5; i++) {
    /* jshint ignore:start */
    EmberTimerUtils.addToQue("test-async", 200).then(function() {
      queRunCount1st++;
      queRunCountTotal++;
    });
    /* jshint ignore:end */
  }
  Ember.run.later(function() {
    for(var i = 0; i < 5; i++) {
      /* jshint ignore:start */
      EmberTimerUtils.addToQue("test-async", 200).then(function() {
        queRunCountTotal++;
      });
      /* jshint ignore:end */
    }
  }, 250);
  wait();
  andThen(function() {
    assert.equal(queRunCount1st, 1, "Ran async que for 5 times within 200ms, callback executed once");
    assert.equal(queRunCountTotal, 2, "Ran async que for 5 times within 200ms after a 250ms wait from previous executions, callback excuted once, twice in total");
  });
});

test("With different keys", function(assert) {
  var queRunCount = 0;
  for(var i = 0; i < 5; i++) {
    /* jshint ignore:start */
    EmberTimerUtils.addToQue("test-async-"+i, 200).then(function() {
      queRunCount++;
    });
    /* jshint ignore:end */
  }
  wait();
  andThen(function() {
    assert.equal(queRunCount, 5, "Ran async que for 5 times within 200ms with different keys, callback executed five times");
  });
});
