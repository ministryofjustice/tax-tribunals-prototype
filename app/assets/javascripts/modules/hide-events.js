'use strict';

moj.Modules.hideEvents = {
  init: function() {
    var self = this;

    $(document).on('hide', 'div', function() {
      moj.log('jhfhghfh');
    });
  }
};
