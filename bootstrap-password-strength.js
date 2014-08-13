/*
 *  Bootstrap Password Strength
 *
 *  Copyright 2014 Damian Baćkowski
 *  Licensed under the MIT license
 */

(function($) {
  "use strict";

  var methods = {
    initialize: function(options) {
      var element = this;

      element.off();
      $(element).popover('destroy');

      var min_length = 6;
      var score;
      var enabledMatchers = [];

      if (options != undefined) {
        for (var matcher in options) {
          if (options[matcher]) {
            enabledMatchers.push(matcher);
          }
        }

        if (options.hasOwnProperty('min')) {
          min_length = parseInt(options['min']);
        }
      } else {
        for (var matcher in matchers) {
          if (element.data('password-' + matcher)) {
            enabledMatchers.push(matcher);
          }
        }

        if (element.data('password-min')) {
          min_length = parseInt(element.data('password-min'));
        }
      }

      if (enabledMatchers.indexOf('min') === -1) {
        enabledMatchers.push('min');
      }

      var matchers = {
        min: function(element_id, password) {
          if (password.length >= min_length) {
            score += 1;
            $('#' + element_id + 'min').removeClass('icon-remove');
            $('#' + element_id + 'min').addClass('icon-ok');
          } else {
            $('#' + element_id + 'min').addClass('icon-remove');
          }
        },
        capital: function (element_id, password) {
          if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
            score += 1;
            $('#' + element_id + 'capital').removeClass('icon-remove');
            $('#' + element_id + 'capital').addClass('icon-ok');
          } else {
            $('#' + element_id + 'capital').addClass('icon-remove');
          }
        },
        number: function(element_id, password) {
          if (password.match(/\d+/)) {
            score += 1;
            $('#' + element_id + 'number').removeClass('icon-remove');
            $('#' + element_id + 'number').addClass('icon-ok');
          } else {
            $('#' + element_id + 'number').addClass('icon-remove');
          }
        },
        special: function(element_id, password) {
          if (password.match(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
            score += 1;
            $('#' + element_id + 'special').removeClass('icon-remove');
            $('#' + element_id + 'special').addClass('icon-ok');
          } else {
            $('#' + element_id + 'special').addClass('icon-remove');
          }
        }
      };

      var checkPassword = function(element) {
        score = 0;

        for (matcher in matchers) {
          if (enabledMatchers.indexOf(matcher) != -1) {
            matchers[matcher].call(this, element.id, element.value);
          }
        }

        $('#' + element.id + '_password-strength').attr("style", "width: " + (score * 100 / enabledMatchers.length)  + '%');

        if ((score * 100 / enabledMatchers.length) == 100) {
          $("div.password-strength-bar").removeClass('progress-danger');
          $("div.password-strength-bar").addClass('progress-success');
        } else {
          $("div.password-strength-bar").addClass('progress-danger');
          $("div.password-strength-bar").removeClass('progress-success');
        }
      }

      var passwordStrengthView = function(element) {
        var content = '<div class="pull-left"><strong>Siła hasła:</strong></div>';
        content += '<div class="password-strength-bar progress progress-danger progress-striped active pull-left" style="width: 150px; margin-bottom: 0px; margin-top: 0px; margin-left: 5px;">';
        content += '<div class="bar" id="' + element.id + '_password-strength" style="width: 0%;"></div>';
        content += '</div>';

        content += '<div class="clearfix"></div>';
        content += '<div style="margin-top: 10px; margin-bottom: 0px;"><strong>Hasło zawiera:</strong></div>';

        content += '<div><i class="icon-remove" id="' + element.id + 'min"></i> minimum ' + min_length + ' znaków</div>';

        if (enabledMatchers.indexOf('capital') != -1) {
          content += '<div><i class="icon-remove" id="' + element.id + 'capital"></i> małe i duże litery</div>';
        }

        if (enabledMatchers.indexOf('number') != -1) {
          content += '<div><i class="icon-remove" id="' + element.id + 'number"></i> minimum jedna cyfra</div>';
        }

        if (enabledMatchers.indexOf('special') != -1) {
          content += '<div><i class="icon-remove" id="' + element.id + 'special"></i> minimum jeden znak specjalny</div>';
        }

        $(element).popover({
          'content' : content,
          'html' : true,
          'placement' : 'right',
          'container' : 'body',
          'trigger' : 'manual'
        });

        $(element).popover('show')
      }

      $(element).on('keyup', function() {
        checkPassword(this);
      });

      $(element).on('focus', function() {
        passwordStrengthView(this);
        checkPassword(this);
      });

      $(element).on('blur', function() {
        $(this).popover('destroy');
      });
    },

    destroy : function() {
      this.off();
      $(this).popover('destroy');
    }
  };

  jQuery.fn.passwordStrength = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, [].slice.call(arguments, 1));
    } else {
      return methods.initialize.apply(this, arguments);
    }
  };
})(window.jQuery);