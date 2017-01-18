'use strict';

moj.Modules.dependentFields = {
  init: function() {
    var self = this,
        fields = $('[data-dependent]');

    if(fields.length) {
      self.checkDependentFields(fields);
    }
  },

  checkDependentFields: function(fields) {
    fields.each(function(n, field) {
      var $field = $(field),
          storedPair = $field.data('dependent'),
          key = storedPair.split('=')[0],
          values = storedPair.split('=')[1],
          show = false;

      if(values) {
        values = values.split(',');

        for(var x = 0; x < values.length; x++) {
          if(moj.Modules.dataStore.getItem(key) === values[x]) {
            show = true;
          }
        }
      } else {
        if(moj.Modules.dataStore.getItem(key)) {
          show = true;
        }
      }

      if(show) {
        $field.removeClass('js-hidden');
      } else {
        $field.addClass('js-hidden');
      }
    });
  }
};
