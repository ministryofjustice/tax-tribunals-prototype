'use strict';

moj.Modules.dataStore = {
  init: function() {
    var self = this,
        storedLength = sessionStorage.length;

    for (var i = storedLength - 1; i >= 0; i--) {
      if($('body').hasClass('clear-session')) {
        self.deleteItem(sessionStorage.key(i));
      } else {
        moj.log('RETRIEVED: ' + sessionStorage.key(i) + ' = ' + sessionStorage.getItem(sessionStorage.key(i)));
      }
    }
  },

  storeItem: function(key, value) {
    moj.log('STORING: ' + key + '=' + value);
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  getItem: function(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },

  deleteItem: function(key) {
    moj.log('DELETING: ' + key);
    sessionStorage.removeItem(key);
  },

  checkForItemsToStore: function($form) {
    var self = this,
        radioEls = $form.find('input[type="radio"][data-store]:checked'),
        textEls = $form.find('input[type="text"][data-store], textarea[data-store]');

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

        self.storeItem(key, value);
      });
    }
  }
};
