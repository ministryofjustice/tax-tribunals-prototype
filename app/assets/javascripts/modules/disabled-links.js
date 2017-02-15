'use strict';

moj.Modules.disabledLinks = {
  link_class: 'disabled',

  init: function() {
    var self = this;

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'a.' + self.link_class, function(e) {
      e.preventDefault();
    });
  }
};
