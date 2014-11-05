// Generated by CoffeeScript 1.8.0

/*
    This class handles all the buttons/controls on the player.
    - Play / Pause button
    - Mute Button
    - Playback speed button
    - Fullscreen button
    - Progress bar
    - Volume bar

    Additonal optional buttons:
    - video quality (240p -> 1080p)
    - captions (cc)
    - most watched sections
    - preview
 */
window.Html5Player || (window.Html5Player = {});

window.Html5Player.Controls = (function() {
  Controls.prototype.player = null;

  function Controls(player, $baseElement) {
    this.player = player;
    this.$controls = $baseElement.find('.controls');
    this.$playButton = $baseElement.find('.play');
    this.$muteButton = $baseElement.find('.mute');
    this.$hdButton = $baseElement.find('.hd');
    this.$chapterButton = $baseElement.find('.toc');
    this.$chapterContent = $baseElement.find('.chapterContent');
    this.$timer = $baseElement.find('.currentTime');
    this.$seeker = $baseElement.find('.progress');
    this.$seekSlider = $baseElement.find('.progress .slider');
    this.$bufferSlider = $baseElement.find('.progress .buffer');
    this.$volumeBar = $baseElement.find('.volumebar');
    this.$volume = $baseElement.find('.volume');
    this.$volumeSlider = $baseElement.find('.volume .slider');
    this.$fullscreenButton = $baseElement.find('.fullscreen');
    this.$playbackRateButton = $baseElement.find('.speed');
    this.$control = $baseElement.find('.control');
    this.$ccButton = $baseElement.find('.cc');
    this.$previewButton = $baseElement.find('.preview');
    this.$streamSelectionButton = $baseElement.find('.streamselection');
    this.$streamSelectionEntry = $baseElement.find('.streamselectionentry');
    $(this.player.videoA).on("play pause", (function(_this) {
      return function() {
        return _this.updatePlayButton();
      };
    })(this));
    $(this.player.videoA).on("ended", (function(_this) {
      return function() {
        return _this.setReplayButton();
      };
    })(this));
    $(this.player.videoA).on("progress", (function(_this) {
      return function() {
        return _this.updateSeek();
      };
    })(this));
    $(this.player.videoA).on("volumechange", (function(_this) {
      return function() {
        return _this.updateVolume();
      };
    })(this));
    $(this.player.videoA).on("timeupdate", (function(_this) {
      return function() {
        _this.updateSeek();
        _this.updateTime();
        if (_this.player.previewShown) {
          _this.player.preview.update();
        }
        if (_this.player.customPreviewIsShown) {
          return _this.player.customPreview.update();
        }
      };
    })(this));
    $(window).on("toggleFullscreen", (function(_this) {
      return function() {
        return _this.updateSeek();
      };
    })(this));
    $(this.$muteButton).on("hover", (function(_this) {
      return function() {
        return _this.hoverVolumeBox();
      };
    })(this));
    if (this.player.mediaController) {
      $(this.player.mediaController).on("play pause", (function(_this) {
        return function() {
          return _this.updatePlayButton();
        };
      })(this));
      $(this.player.mediaController).on("ended", (function(_this) {
        return function() {
          return _this.setReplayButton();
        };
      })(this));
      $(this.player.mediaController).on("volumechange", (function(_this) {
        return function() {
          return _this.updateVolume();
        };
      })(this));
    }
    this.updateTime();
    this.updateVolume();
    this.attachButtonHandlers();
    if (this.player.handleKeyboardEvents) {
      this.attachKeyboardHandlers();
    }
    this.rightClickActive = false;
    this.miniModeActive = false;
  }

  Controls.prototype.attachButtonHandlers = function() {
    this.$hdButton.click((function(_this) {
      return function() {
        if (_this.player.hd) {
          _this.player.hd = false;
          _this.$hdButton.find('i').removeClass('primary-color').addClass('white');
        } else {
          _this.player.hd = true;
          _this.$hdButton.find('i').removeClass('white').addClass('primary-color');
        }
        return _this.player.changeSource();
      };
    })(this));
    this.$playButton.click((function(_this) {
      return function() {
        if (_this.player.mediaController) {
          if (_this.player.mediaController.playbackState === "ended") {
            return _this.player.gototime(0);
          } else if (_this.player.mediaController.paused || _this.player.mediaController.playbackState === "waiting") {
            if (_this.player.mediaController.playbackState === "waiting" && !_this.player.mediaController.paused) {
              $(_this.player.mediaController).trigger("play");
            }
            return _this.player.gototime(_this.player.videoA.currentTime);
          } else {
            return _this.player.pause();
          }
        } else {
          if (_this.player.videoA.paused) {
            return _this.player.play();
          } else {
            return _this.player.pause();
          }
        }
      };
    })(this));
    this.$chapterButton.click((function(_this) {
      return function() {
        if (_this.$chapterContent.hasClass("visible")) {
          return _this.$chapterContent.removeClass("visible");
        } else {
          return _this.$chapterContent.addClass("visible");
        }
      };
    })(this));
    this.$muteButton.click((function(_this) {
      return function() {
        if (!_this.player.muted) {
          return _this.player.mute(true);
        } else {
          return _this.player.mute(false);
        }
      };
    })(this));
    this.$playbackRateButton.click((function(_this) {
      return function() {
        var playbackRate;
        playbackRate = (function() {
          switch (this.player.playbackRate) {
            case 1.0:
              return 1.5;
            case 1.5:
              return 0.7;
            case 0.7:
              return 1.0;
          }
        }).call(_this);
        _this.$playbackRateButton.children().html("" + (playbackRate.toFixed(1)) + "x");
        return _this.player.changeSpeed(playbackRate);
      };
    })(this));
    this.$fullscreenButton.click((function(_this) {
      return function() {
        _this.player.ui.toggleFullscreen();
        return _this.$fullscreenButton.find('i').toggleClass('icon-fullscreen-on').toggleClass('icon-fullscreen-off');
      };
    })(this));
    this.$seeker.click((function(_this) {
      return function(event) {
        var pos, sec, vid;
        vid = _this.player.videoA;
        pos = (event.pageX - _this.$seeker.get()[0].getBoundingClientRect().left) / _this.$seeker.width();
        sec = Math.round(pos * vid.duration);
        window.location.hash = sec;
        return _this.player.gototime(sec);
      };
    })(this));
    this.$volume.click((function(_this) {
      return function(event) {
        var diff, vol;
        if (_this.player.muted) {
          _this.player.mute(false);
        }
        diff = (_this.$volume.width() - (event.pageX - _this.$volume.get()[0].getBoundingClientRect().left)) / _this.$volume.width();
        if (diff <= 0) {
          diff = 0;
        }
        vol = 1 - diff;
        if (_this.player.mediaController) {
          return _this.player.mediaController.volume = vol;
        } else {
          return _this.player.videoA.volume = vol;
        }
      };
    })(this));
    this.$ccButton.click((function(_this) {
      return function() {
        if (_this.player.cc) {
          _this.player.cc = false;
          _this.$ccButton.find('i').removeClass('primary-color').addClass('white');
          return _this.player.setCaptionsVisibility('hidden');
        } else {
          _this.player.cc = true;
          _this.$ccButton.find('i').removeClass('white').addClass('primary-color');
          return _this.player.setCaptionsVisibility('showing');
        }
      };
    })(this));
    this.$previewButton.click((function(_this) {
      return function() {
        if (_this.player.previewShown) {
          _this.$previewButton.find('i').removeClass('primary-color').addClass('white');
          return _this.player.preview.stop();
        } else {
          _this.$previewButton.find('i').removeClass('white').addClass('primary-color');
          return _this.player.preview.show();
        }
      };
    })(this));
    this.$streamSelectionButton.click((function(_this) {
      return function() {
        var menu;
        menu = _this.$streamSelectionButton.find('.dropdown-menu');
        if (menu.css('display') === 'none') {
          return menu.css('display', 'block');
        } else {
          return menu.css('display', 'none');
        }
      };
    })(this));
    this.$streamSelectionEntry.click((function(_this) {
      return function(event) {
        var url;
        event.preventDefault();
        event.stopPropagation();
        url = $(event.currentTarget).data('videourl');
        if (url != null) {
          $(event.currentTarget).siblings().removeClass('selected');
          $(event.currentTarget).addClass('selected');
          _this.$streamSelectionButton.find('.dropdown-menu').css('display', 'none');
          return _this.player.changeSource(url);
        }
      };
    })(this));
    if (this.player.hasTaggingActive) {
      this.$seeker.on("mousedown", (function(_this) {
        return function(event) {
          var startPosition;
          if (event.which === 3) {
            _this.rightClickActive = true;
            startPosition = (event.pageX - _this.$seeker.get()[0].getBoundingClientRect().left) / _this.$seeker.width();
            if (startPosition < 0) {
              startPosition = 0;
            }
            if (startPosition > 1) {
              startPosition = 1;
            }
            _this.player.tagging.start(startPosition);
          }
          return event.preventDefault();
        };
      })(this)).on("contextmenu", (function(_this) {
        return function(event) {
          return event.preventDefault();
        };
      })(this));
      $(window).on("mousemove", (function(_this) {
        return function(event) {
          var endPosition;
          if (_this.rightClickActive) {
            endPosition = (event.pageX - _this.$seeker.get()[0].getBoundingClientRect().left) / _this.$seeker.width();
            if (endPosition < 0) {
              endPosition = 0;
            }
            if (endPosition > 1) {
              endPosition = 1;
            }
            _this.player.tagging.update(endPosition);
          }
          return event.preventDefault();
        };
      })(this));
      $(window).on("mouseup", (function(_this) {
        return function(event) {
          if (_this.rightClickActive) {
            _this.rightClickActive = false;
            _this.player.tagging.stop();
          }
          return event.preventDefault();
        };
      })(this));
    }
  };

  Controls.prototype.attachKeyboardHandlers = function() {
    var keyboardControlsPress, keyboardControlsUp;
    keyboardControlsUp = {
      37: (function(_this) {
        return function() {
          return _this.player.seekBack(10);
        };
      })(this),
      39: (function(_this) {
        return function() {
          return _this.player.seekForward(10);
        };
      })(this)
    };
    keyboardControlsPress = {
      112: (function(_this) {
        return function() {
          return _this.player.togglePlay();
        };
      })(this),
      102: (function(_this) {
        return function() {
          return _this.player.ui.toggleFullscreen();
        };
      })(this)
    };
    $(window).on("keyup", function(evt) {
      var callback, currentTag, key, keyCode, _results;
      _results = [];
      for (key in keyboardControlsUp) {
        callback = keyboardControlsUp[key];
        currentTag = $(document.activeElement).prop("tagName");
        if (!(currentTag === 'INPUT' || currentTag === 'TEXTAREA')) {
          keyCode = evt.keyCode || evt.charCode;
          if (keyCode.toString() === key) {
            _results.push(callback());
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    $(window).on("keypress", function(evt) {
      var callback, currentTag, key, keyCode, _results;
      _results = [];
      for (key in keyboardControlsPress) {
        callback = keyboardControlsPress[key];
        currentTag = $(document.activeElement).prop("tagName");
        if (!(currentTag === 'INPUT' || currentTag === 'TEXTAREA')) {
          keyCode = evt.keyCode || evt.charCode;
          if (keyCode.toString() === key) {
            _results.push(callback());
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  Controls.prototype.hoverVolumeBox = function() {
    return this.$volumeBar.toggleClass('hovering');
  };

  Controls.prototype.updatePlayButton = function() {
    if (this.player.videoA.paused || this.player.mediaController && this.player.mediaController.paused) {
      return this.$playButton.find('i').removeClass('icon-reload').removeClass('icon-pause').addClass('icon-play');
    } else {
      return this.$playButton.find('i').removeClass('icon-reload').removeClass('icon-play').addClass('icon-pause');
    }
  };

  Controls.prototype.setReplayButton = function() {
    return this.$playButton.find('i').removeClass('icon-pause').removeClass('icon-play').addClass('icon-reload');
  };

  Controls.prototype.updateSeek = function(progressWidth) {
    var bufId, bufferWidth, seekWidth, vid, vidbuf;
    vid = this.player.videoA;
    vidbuf = vid.buffered;
    bufId = vidbuf.length - 1;
    if (!progressWidth) {
      progressWidth = this.$seeker.width();
    }
    seekWidth = vid.currentTime / vid.duration * 100;
    if (vidbuf.length > 0) {
      bufferWidth = vidbuf.end(bufId) / vid.duration * 100;
      bufferWidth -= seekWidth;
    } else {
      bufferWidth = 0;
    }
    this.$bufferSlider.width("" + bufferWidth + "%");
    return this.$seekSlider.width("" + seekWidth + "%");
  };

  Controls.prototype.updateTime = function() {
    var time;
    time = this.player.durationToTime(this.player.videoA.currentTime);
    return this.$timer.text(time);
  };

  Controls.prototype.updateVolume = function() {
    if (this.player.muted) {
      this.$volumeSlider.width("0%");
      return this.$muteButton.find('i').removeClass('icon-volume-on').addClass('icon-volume-off');
    } else {
      if (this.player.mediaController) {
        this.$volumeSlider.width("" + (this.player.mediaController.volume * 100) + "%");
      } else {
        this.$volumeSlider.width("" + (this.player.videoA.volume * 100) + "%");
      }
      return this.$muteButton.find('i').removeClass('icon-volume-off').addClass('icon-volume-on');
    }
  };


  /*
  The current implementation for most watched sections is mocked/random.
  It is based on the length of the video which will be aggregated when the video is loaded
  and the metadata is present.
  Therefore the associated button will be added to the controls after the metadata is fully loaded
  and the sections are generated.
  This will later be replaced with just the click event handler.
   */

  Controls.prototype.addMostWatchedButton = function() {
    var mostWatchedButton;
    if (!this.miniModeActive) {
      if (!this.$controls.find('.most-watched.button').length) {
        mostWatchedButton = $('<td class="most-watched button"><i class="xikolo-icon icon-most-watched"></i></td>').insertAfter(this.$ccButton);
        return mostWatchedButton.click((function(_this) {
          return function() {
            if (_this.player.mostWatchedShown) {
              _this.player.mostWatchedShown = false;
              mostWatchedButton.find('i').removeClass('primary-color').addClass('white');
              return _this.$controls.find('.mostWatched').hide();
            } else {
              _this.player.mostWatchedShown = true;
              mostWatchedButton.find('i').removeClass('white').addClass('primary-color');
              return _this.$controls.find('.mostWatched').show();
            }
          };
        })(this));
      } else {
        this.$controls.find('.most-watched.button > i').removeClass('primary-color').addClass('white');
        return this.player.mostWatchedShown = false;
      }
    }
  };

  Controls.prototype.activateMiniMode = function() {
    this.$control.hide();
    this.$playbackRateButton.hide();
    this.$streamSelectionButton.hide();
    this.$controls.find('.most-watched.button').hide();
    this.$previewButton.hide();
    this.$volumeBar.hide();
    this.$fullscreenButton.hide();
    if (this.player.hasLoadingOverlay) {
      this.player.loadingOverlay.hidePreviewAction();
    }
    return this.miniModeActive = true;
  };

  Controls.prototype.deactivateMiniMode = function() {
    this.$control.show();
    this.$playbackRateButton.show();
    this.$streamSelectionButton.show();
    this.$controls.find('.most-watched.button').show();
    this.$previewButton.show();
    this.$volumeBar.show();
    this.$fullscreenButton.show();
    if (this.player.hasLoadingOverlay) {
      this.player.loadingOverlay.showPreviewAction();
    }
    return this.miniModeActive = false;
  };

  return Controls;

})();

//# sourceMappingURL=controls.js.js.map