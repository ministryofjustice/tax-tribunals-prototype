'use strict';

moj.Modules.dataCaptureSummary = {
  hideClass: 'js-hidden',

  dependencies: [
    {
      elementId: 'representative_details',
      dataKey: 'appellant_has_representation',
      dataValue: 'yes'
    }
  ],

  init: function() {
    var self = this;

    self.showDependentItems();
  },

  showDependentItems: function() {
    var self = this;

    for(var x = 0; x < self.dependencies.length; x++) {
      var dep = self.dependencies[x];

      if(moj.Modules.dataStore.getItem(dep.dataKey) === dep.dataValue) {
        $('#' + dep.elementId).removeClass(self.hideClass);
      }
    }
  }
};
