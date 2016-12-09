'use strict';

moj.Modules.debug = {
  tools: [
    {
      text: 'log session vars',
      call: 'moj.Modules.dataStore.dumpData();'
    },
    {
      text: 'toggle validation',
      call: 'moj.Modules.formRoutes.toggleValidation()'
    }
  ],
  init: function() {
    var self = this;

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('keyup', function(e) {
      if(e.keyCode === 27) { // ESC
        if(!e.shiftKey) { // show debug panel
          self.debugPanel();
        } else { // shift+ESC shortcut to dump session vars to console
          moj.Modules.dataStore.dumpData();
        }
      }
    });

    $(document).on('click', '#debugPanel li.link' , function(e) {
      var $el = $(e.target),
          call = new Function($el.data('call'));

      return (call());
    });
  },

  debugPanel: function() {
    var self = this;

    if(!$('#debugPanel').length) {
      $('body').prepend('<div id="debugPanel"><h2>TOOLS</h2><ul></ul></div>');

      self.tools.forEach(function(tool) {
        $('#debugPanel ul').append('<li class="link" data-call="' + tool.call + '">' + tool.text + '</li>');
      });

      $('#debugPanel ul').before('<p>Validation: <span id="validationStatus">' + moj.Modules.formRoutes.validationOn + '</span></p>');
    } else {
      $('#debugPanel').toggle();
    }
  }
};
