// Generated by CoffeeScript 1.8.0

/*
    This class handles the overlay for the tags/keywords for a video.
    Tagging means that the user can right-click in the timeline and hold the mouse.
    When he releases the mouse the created range (a preview is shown in the timeline)
    will be used as additional information for a comment on the video (start and end time).
    It will fire an event when the users finishes the action.
 */
window.Html5Player || (window.Html5Player = {});

window.Html5Player.Tagging = (function() {
  function Tagging(player, $baseElement) {
    this.player = player;
    this.$seeker = $baseElement.find('.progress');
    this.startTime = -1;
    this.endTime = -1;
    this.startPosition = -1;
    this.endPosition = -1;
    this.addPreview();
  }

  Tagging.prototype.update = function(endPosition) {
    var diff;
    this.endPosition = endPosition;
    diff = this.endPosition - this.startPosition;
    if (diff < 0) {
      return this.$seeker.find('.taggingPreview').css({
        'left': (this.endPosition * 100) + '%',
        'width': (-diff * 100) + '%'
      });
    } else {
      return this.$seeker.find('.taggingPreview').css({
        'width': (diff * 100) + '%'
      });
    }
  };

  Tagging.prototype.start = function(startPosition) {
    this.startPosition = startPosition;
    return this.$seeker.find('.taggingPreview').css({
      'left': (startPosition * 100) + '%',
      'width': '0%'
    }).show();
  };

  Tagging.prototype.stop = function() {
    var event;
    if (this.endPosition < this.startPosition) {
      this.startTime = Math.floor(this.endPosition * this.player.videoA.duration);
      this.endTime = Math.floor(this.startPosition * this.player.videoA.duration);
    } else {
      this.startTime = Math.floor(this.startPosition * this.player.videoA.duration);
      this.endTime = Math.floor(this.endPosition * this.player.videoA.duration);
    }
    event = new CustomEvent("newTag", {
      "detail": {
        "startTime": this.startTime,
        "endTime": this.endTime,
        "totalTime": this.endTime - this.startTime,
        "time": new Date()
      },
      "bubbles": true,
      "cancelable": true
    });
    document.dispatchEvent(event);
  };

  Tagging.prototype.remove = function() {
    return this.$seeker.find('.taggingPreview').hide().css({
      'left': '0%',
      'width': '0%'
    });
  };

  Tagging.prototype.addPreview = function() {
    return this.$seeker.prepend($('<div class="taggingPreview" style="left:0%; width:0%; display:none;"></div>'));
  };

  return Tagging;

})();

//# sourceMappingURL=tagging.js.js.map