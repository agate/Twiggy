var Options = function () {
  this.initialize.apply(this, arguments);
};

Options.prototype = {
  DEFAULT_API_URL: 'http://twitter.com/',
  DEFAULT_POLLING_INTERVAL: 5,

  initialize: function () {
    this.initHTML();
    this.registerEvents();
    this.restore();
  },

  initHTML: function () {
    this.jqUsername             = $('#username');
    this.jqPassword             = $('#password');
    this.jqApiUrl               = $('#apiUrl');
    this.jqPollingInterval      = $('#pollingInterval');

    this.jqApiUrlReset          = $('#resetApiUrl');
    this.jqPollingIntervalReset = $('#resetPollingInterval');

    this.jqSave                 = $('#save');
  },

  registerEvents: function () {
    var self = this;

    this.jqApiUrlReset.click(function () {
      self.resetApiUrl();
    });
    this.jqPollingIntervalReset.click(function () {
      self.resetPollingInterval();
    });
    this.jqSave.click(function () {
      self.save();
    });
  },

  restore: function () {
    var username        = '';
    var password        = '';
    var apiUrl          = this.DEFAULT_API_URL;
    var pollingInterval = this.DEFAULT_POLLING_INTERVAL;

    if (localStorage.set) {
      username        = localStorage.username;
      password        = localStorage.password;
      apiUrl          = localStorage.apiUrl;
      pollingInterval = localStorage.pollingInterval;
    }

    this.jqUsername.val(username);
    this.jqPassword.val(password);
    this.jqApiUrl.val(apiUrl);
    this.jqPollingInterval.val(pollingInterval);
  },

  resetApiUrl: function () {
    this.jqApiUrl.val(this.DEFAULT_API_URL);
  },
  resetPollingInterval: function () {
    this.jqPollingInterval.val(this.DEFAULT_POLLING_INTERVAL);
  },
  save: function () {
    var username        = $.trim(this.jqUsername.val());
    var password        = $.trim(this.jqPassword.val());
    var apiUrl          = $.trim(this.jqApiUrl.val());
    var pollingInterval = $.trim(this.jqPollingInterval.val());

    if (username == '' || password == '') {
      alert('username or password can not be blank');
      return;
    }

    if (apiUrl == '') {
      apiUrl = this.DEFAULT_API_URL;
      this.jqApiUrl.val(apiUrl);
    }
    if (pollingInterval == '') {
      pollingInterval = this.DEFAULT_POLLING_INTERVAL;
      this.jqPollingInterval.val(pollingInterval);
    }

    localStorage.username        = username;
    localStorage.password        = password;
    localStorage.apiUrl          = apiUrl;
    localStorage.pollingInterval = pollingInterval;

    localStorage.set             = true;
  }
};

$(document).ready(function () {
  new Options();
});
