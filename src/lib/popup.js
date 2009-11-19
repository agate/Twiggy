var Popup = function () {
  this.initialize.apply(this, arguments);
};

Popup.prototype = {
  initialize: function () {
    this.initHTML();
    this.registerEvents();
    this.loadFriendsTimeline();
  },

  initHTML: function () {
    this.jqOptions         = $('#options');
    this.jqStatus          = $('#status');
    this.jqFriendsTimeline = $('#friendsTimeline');
    this.jqUpdate          = $('#update');

    this.background        = chrome.extension.getBackgroundPage().background;
  },

  registerEvents: function () {
    var self = this;
    this.jqOptions.click(function () {
      self.openOptions();
    });
    this.jqUpdate.keydown(function (e) {
      if (e.keyCode == 13) self.update();
    });
  },

  loadFriendsTimeline: function () {
    var html  = '';
    var data  = this.background.friendsTimelineData;
    var error = this.background.error;

    if (data.length > 0) {
      this.jqStatus.hide();
      this.jqUpdate.show();

      chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 255] });
      chrome.browserAction.setBadgeText({ text: '0' });
    } else {
      this.jqStatus.show();
      this.jqUpdate.hide();

      if (! localStorage.set) {
        this.jqStatus.html('please set username and password first!');
      } else {
        this.jqStatus.html('loading...');
        var self = this;
        this.loadingTimer = setTimeout(function () {
          self.loadFriendsTimeline();
        }, 500);
      }
      return;
    }

    for (var i=0,item; item=data[i]; i++) {
      html += '<li title="' + item.text + '">' +
              '<img src="' + item.user.profile_image_url + '" />' +
              '<strong>' + item.user.name + '</strong><br/>' +
              item.text +
              '<span class="from">From: ' + item.source + '</span>' +
              '</li>';
    }

    this.jqFriendsTimeline.html(html);
  },

  openOptions: function () {
    chrome.tabs.create({url: 'options.html'});
  },

  update: function () {
    var self = this;
    this.jqUpdate.attr('disabled', true);
    this.background.update(this.jqUpdate.val(), function () {
      self.loadFriendsTimeline();
      self.jqUpdate.val('').attr('disabled', false);
    });
  }
};

var popup;
$(document).ready(function () {
  popup = new Popup();
});
