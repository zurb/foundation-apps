describe('Common Foundation Services', function() {
  beforeEach(module('foundation.core'));

  it('should exist', inject(function(FoundationApi) {
    expect(FoundationApi).not.toEqual(null);
  }));


  //testing listeners
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

  it('should modify and get settings', inject(function(FoundationApi) {
    var settings     = {};
    var testSettings = { testSettings: 1 };
    var newSettings  = { testSettings: 2 };

    FoundationApi.modifySettings(testSettings);

    settings = FoundationApi.getSettings();

    //make sure settings are empty
    expect(settings.testSettings).toEqual(1);

    //extend settings
    settings = FoundationApi.modifySettings(newSettings);

    expect(settings.testSettings).toEqual(2);
  }));

  it('should generate unique IDs', inject(function(FoundationApi) {
    var ids = [];
    var duplicates = [];

    for(var i = 0; i < 100; i++) {
      var generatedId = FoundationApi.generateUuid();
      if(ids.indexOf(generatedId) > -1) {
        duplicates.push(generatedId);
      }

      ids.push(generatedId);
    }

    expect(duplicates).toEqual([]);

  }));


  describe('utils factory', function() {
    it('should exist', inject(function(Utils){
      expect(Utils).not.toEqual(null);
    }));
  });
});
