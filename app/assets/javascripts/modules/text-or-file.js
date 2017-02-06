'use strict';

moj.Modules.textOrFile = {
  init: function() {
    var self = this;

    if($('input[type="file"][data-textbox]').length > 0) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this;

    $(document).on('change', 'input[type="file"][data-textbox]', function(e) {
      var $field = $(e.target);

      if($field.data('textbox')) {
        var $textbox = $('#' + $field.data('textbox')),
            value = $field.val().replace('C:\\fakepath\\', '');

        $textbox.val('');

        if(value) {
          $textbox.val('See attached file: ' + value);
        }
      }
    });
  }
};
