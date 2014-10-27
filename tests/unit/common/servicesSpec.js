describe('Common Foundation Services', function() {
  beforeEach(module('foundation.common.services'));

  it('should exist', inject(function(FoundationApi) {
    expect(FoundationApi).not.toEqual(null);
  }));

  it('should subscribe and fire a new listener', inject(function(FoundationApi) {
    var response = '';
    var listenerName = 'testListener';
    var listener = function() {
      response = 'fired';
      return true;
    };

    FoundationApi.subscribe(listenerName, listener);

    //make sure cb didn't get fired
    expect(response).toEqual('');

    FoundationApi.publish(listenerName, '');

    expect(response).toEqual('fired');

  }));

  it('should pass on a message', inject(function(FoundationApi) {
    var response = '';
    var listenerName = 'testListener';
    var listener = function(msg) {
      response = msg;
      return true;
    };

    FoundationApi.subscribe(listenerName, listener);

    //make sure cb didn't get fired
    expect(response).toEqual('');

    //fire a listener
    FoundationApi.publish(listenerName, 'fired');

    expect(response).toEqual('fired');

    //make sure response changes with each message
    FoundationApi.publish(listenerName, 'fired again');

    expect(response).toEqual('fired again');

  }));

  it('should fire all subscribed listeners', inject(function(FoundationApi) {
    var response = '';
    var response2 = '';
    var listenerName = 'testListener';
    var listener = function(msg) {
      response = msg;
      return true;
    };

    var listener2 = function(msg) {
      response2 = msg;
      return true;
    };

    FoundationApi.subscribe(listenerName, listener);
    FoundationApi.subscribe(listenerName, listener2);

    //make sure cb didn't get fired
    expect(response).toEqual('');
    expect(response2).toEqual('');

    //fire a listener
    FoundationApi.publish(listenerName, 'fired');

    expect(response).toEqual('fired');
    expect(response2).toEqual('fired');
  }));

});
