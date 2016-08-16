'use strict';

moj.Modules.dataStore = {
  init: function() {
    var self = this,
        storedLength = sessionStorage.length;

    $('form').on('submit', function(e) {
      self.checkForItemsToStore($(e.target).closest('form'));
      e.preventDefault();
    });

    for (var i = storedLength - 1; i >= 0; i--) {
      if($('body').hasClass('start-before')) {
        moj.log('DELETED: ' + sessionStorage.key(i));
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
    sessionStorage.removeItem(key);
  },

  checkForItemsToStore: function($form) {
    var self = this,
        els = $form.find('input[type="radio"]:checked');

    if(els.length) {
      els.each(function(n, el) {
        var dataToStore = $(el).data('store'),
            pairs;

        if(dataToStore) {
          pairs = dataToStore.split(',');

          pairs.forEach(function(pair) {
            var key = pair.split('=')[0],
                value = pair.split('=')[1];

            self.storeItem(key, value);
          });
        }
      });
    }
  }
};
