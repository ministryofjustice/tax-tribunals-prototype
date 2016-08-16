'use strict';

moj.Modules.displayValues = {
  element_class: 'write-value',
  data_attribute: 'key',

  init: function() {
    var self = this,
        elements = $('.' + self.element_class);

    if(elements.length) {
      self.writeValues(elements);
    }
  },

  writeValues: function(elements) {
    var self = this;

    elements.each(function(n, element) {
      var $el = $(element),
          dataKey = $el.data(self.data_attribute),
          dataValue = moj.Modules.dataStore.getItem(dataKey);

      if(dataValue) {
        $el.text(dataValue);
      }
    });
  }
};
