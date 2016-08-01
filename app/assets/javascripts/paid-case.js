var paidCase = {
  form_id: 'case_requests',

  init: function() {
    var self = this;

    if($('form#' + self.form_id).length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
        $form = $('form#' + self.form_id);

    console.log('yus');

    $form.on('submit', function(e) {
      e.preventDefault();
      self.checkPaid($form);
    });
  },

  checkPaid: function($form) {
    var paid = false;

    $form.find('input').each(function(n, input) {
      if($(input).val() === 'paid') {
        paid = true;
      }
    });

    document.location = (paid ? $form.data('alt-url') : $form.attr('action'));
  }
};

$(function() {
  paidCase.init();
});
