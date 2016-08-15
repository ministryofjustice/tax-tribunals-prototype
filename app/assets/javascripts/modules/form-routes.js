'use strict';

moj.Modules.formRoutes = {
  form_class: 'js_route',

  init: function() {
    var self = this;

    if($('form.' + self.form_class).length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
        $form = $('form.' + self.form_class).eq(0);

    $form.on('submit', function(e) {
      e.preventDefault();

      self.checkRoute($form);
    });
  },

  checkRoute: function($form) {
    var self = this,
        $checkedButton = $form.find('input[type="radio"]:checked'),
        nextPage;

    if($checkedButton.length && typeof $checkedButton.data('destination') !== 'undefined') {
      nextPage = $checkedButton.data('destination');
    } else {
      nextPage = $form.attr('action');
    }

    self.next(nextPage);
  },

  next: function(page) {
    document.location = page;
  }
};
