'use strict';

moj.Modules.saveAndReturn = {
  link_class: 'save-link',
  destination: '/save_and_return/create_account',

  init: function() {
    var self = this;

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'a.' + self.link_class, function(e) {
      var $link = $(e.target),
          $form = $link.closest('form');

      e.preventDefault();
      moj.Modules.dataStore.storeItem('saving', 'true');
      moj.Modules.dataStore.storeItem('return_page', self.getPage());
      $form.attr('action', self.destination).trigger('submit');
    });
  },

  getPage: function() {
    return document.location.pathname;
  }
};
