var Background = function () {
  this.initialize.apply(this, arguments);
};

Background.prototype = {
  initialize: function () {
    this.friendsTimelineData = [];
    this.friendsTimeline();
  },

  friendsTimeline: function () {
    if (! localStorage.set) return;

    this.updateFriendsTimeline();

    var self = this;
    clearInterval(this.friendsTimelineTimer);
    this.friendsTimelineTimer = setInterval(function () {
      self.updateFriendsTimeline();
    }, localStorage.pollingInterval*60000);
  },

  updateFriendsTimeline: function (callback) {
    var self = this;
    chrome.browserAction.setBadgeBackgroundColor({ color: [133, 133, 133, 255] });
    chrome.browserAction.setBadgeText({ text: '?' });
    $.ajax({
      type: "GET",
      url: localStorage.apiUrl + 'statuses/friends_timeline.json',
      dataType: "json",
      beforeSend: function (xhr) {
        var auth = Base64.encode(localStorage.username + ":" + localStorage.password);
        xhr.setRequestHeader("Authorization", "Basic " + auth);
      },
      success: function (data, status) {
        self.friendsTimelineData = data;
				if (callback) callback();
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: '*' });
      },
      error: function (request, status, error) {
      }
    });
  },

  update: function (status, callback) {
    var self = this;
    $.ajax({
      type: "POST",
      url: localStorage.apiUrl + 'statuses/update.json',
      dataType: "json",
      data: { "status": $.trim(status) },
      beforeSend: function (xhr) {
        var auth = Base64.encode(localStorage.username + ":" + localStorage.password);
        xhr.setRequestHeader("Authorization", "Basic " + auth);
      },
      success: function (data, status) {
				self.updateFriendsTimeline(callback)
      },
      error: function (request, status, error) {
      }
    });
  }
};

var background;
$(document).ready(function () {
  background = new Background();
});
