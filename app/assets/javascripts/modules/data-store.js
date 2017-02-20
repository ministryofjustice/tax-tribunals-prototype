'use strict';

moj.Modules.dataStore = {
  init: function() {
    var self = this;

    if($('body').hasClass('clear-session')) {
      self.clearSessionData();
    }

    self.fillStoredData();
  },

  clearSessionData: function() {
    var self = this,
        storedLength = localStorage.length;

    moj.log('wiping session vars');

    for (var i = storedLength - 1; i >= 0; i--) {
      self.deleteItem(localStorage.key(i));
    }
  },

  dumpData: function() {
    var self = this,
        storedLength = localStorage.length;

    moj.log('*** session vars ***');
    for(var i = 0; i < storedLength; i++) {
      moj.log(localStorage.key(i) + ' = ' + localStorage.getItem(localStorage.key(i)));
    }
    moj.log('*** END session vars ***');
  },

  storeItem: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  deleteItem: function(key) {
    localStorage.removeItem(key);
  },

  checkForItemsToStore: function($form) {
    var self = this,
        fileEls = $form.find('input[type="file"][data-store]'),
        checkboxEls = $form.find('input[type="checkbox"][data-store]'),
        radioEls = $form.find('input[type="radio"][data-store]:checked'),
        textEls = $form.find('input[type="text"][data-store]:visible, input[type="password"][data-store]:visible, input[type="number"][data-store]:visible, input[type="hidden"][data-store], textarea[data-store]:visible');

    if(fileEls.length) {
      fileEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            value = $el.val(),
            valueArr;

        if(value) {
          valueArr = value.split('\\');
          value = valueArr[valueArr.length - 1];
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }

    if(radioEls.length) {
      radioEls.each(function(n, el) {
        var dataToStore = $(el).data('store'),
            pairs;

        pairs = dataToStore.split(',');

        pairs.forEach(function(pair) {
          var key = pair.split('=')[0],
              value = pair.split('=')[1];

          self.storeItem(key, value);
        });
      });
    }

    if(textEls.length) {
      textEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            value = $el.val();

        if(value && ($el.is(':visible') || $el.attr('type') === 'hidden')) {
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }

    if(checkboxEls.length) {
      checkboxEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            checked = $el.is(':checked'),
            value = $el.val();

        if(checked) {
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }
  },

  fillStoredData: function() {
    var self = this,
        $form = $('form.js_route').eq(0),
        checkboxEls = $form.find('input[type="checkbox"][data-store]'),
        radioEls = $form.find('input[type="radio"][data-store]'),
        textAndFileEls = $form.find('input[type="text"][data-store], input[type="number"][data-store], textarea[data-store], input[type="file"][data-store]'),
        radioGroups = [];

    textAndFileEls.each(function(n, el) {
      var $el = $(el),
          key = $el.attr('id'),
          storedVal = self.getItem(key);

      if(storedVal) {
        $el.val(storedVal);
      }
    });

    radioEls.each(function(n, el) {
      var groupName = $(el).attr('name');

      if(!radioGroups.includes(groupName)) {
        radioGroups.push(groupName);
      }
    });

    radioGroups.forEach(function(group) {
      var storedVal = self.getItem(group),
          storedAnswers = self.getItem('storedAnswers');

      if(storedVal) {
        radioEls.filter('[name="' + group + '"]').each(function(n, el) {
          var text = $(el).closest('label').text().toLowerCase().trim(),
              val = $(el).val().toLowerCase();

          if(val.indexOf(storedVal.toLowerCase()) === 0) {
            $(el).trigger('click');
          }
        });
      }

      if(storedAnswers && storedAnswers.length) {
        storedAnswers.forEach(function(answer) {
          var $el = $('input[value="' + answer.val + '"]'),
              $label = $el.closest('label'),
              text = $label.text().toLowerCase().trim();

          if(text.indexOf(answer.text.toLowerCase()) === 0 && $el.val() === answer.val) {
            $el.trigger('click');
            if($label.data('target')) {
              $('#' + $label.data('target')).removeClass('js-hidden').attr('aria-hidden', 'false');
              $el.attr('aria-expanded', 'true');
            }
          }
        });
      }
    });

  }
};
