'use strict';

moj.Modules.debug = {
  tools: [
    {
      text: 'log session vars',
      call: 'moj.Modules.dataStore.dumpData()'
    },
    {
      text: 'toggle validation',
      call: 'moj.Modules.formRoutes.toggleValidation()'
    },
    {
      text: 'skip to data capture (direct, Income tax, no hardship)',
      call: 'moj.Modules.debug.skipToDataCapture(0)'
    },
    {
      text: 'skip to data capture (indirect, VAT, hardship)',
      call: 'moj.Modules.debug.skipToDataCapture(1)'
    },
    {
      text: 'edit session var',
      call: 'moj.Modules.debug.editSessionVar()'
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
    var self = this,
        feesHTML = '';

    if(!$('#debugPanel').length) {
      $('body').prepend('<div id="debugPanel"><h2>TOOLS</h2><ul class="list list-bullet"></ul></div>');

      self.tools.forEach(function(tool) {
        $('#debugPanel ul').append('<li class="link" data-call="' + tool.call + '">' + tool.text + '</li>');
      });

      if(moj.Modules.dataStore.getItem('fees')) {
        feesHTML = '<br>Fees: <strong id="feesStatus">' + moj.Modules.dataStore.getItem('fees') + '</strong>';
      }

      $('#debugPanel ul').before('<p>Validation: <strong id="validationStatus">' + moj.Modules.formRoutes.validationOn + '</strong>' + feesHTML + '</p>');
    } else {
      $('#debugPanel').toggle();
    }
  },

  editSessionVar: function() {
    var key = window.prompt('name of session var to edit'),
        value = window.prompt('new value for "' + key + '"" (leave blank to delete it)');

    if(value) {
      moj.Modules.dataStore.storeItem(key, value);
      moj.log(key + ' = ' + value);
    } else {
      moj.Modules.dataStore.deleteItem(key);
      moj.log(key + ' deleted');
    }
  },

  skipToDataCapture: function(dataset) {
    var self = this;

    moj.Modules.dataStore.clearSessionData();

    moj.log('filling in dummy stuff for steps 1-2');

    for(var x in self.dummyData[dataset]) {
      moj.Modules.dataStore.storeItem(x, self.dummyData[dataset][x]);
    }

    document.location = '/task_list';
  },

  dummyData: [
    {
      task_determine_fee: 'complete',
      task_check_if_late: 'complete',
      application_is_late: 'no',
      direct: 'true',
      fee: '200',
      fees: 'yes',
      hardship: 'no',
      hmrc_challenge: 'yes',
      tax_amount: '3456',
      tax_type: 'Income tax',
      storedAnswers: [
        {
          "question": "What is your appeal about?",
          "text": "Income Tax",
          "val": "income_tax"
        },
        {
          "question": "What is your dispute about?",
          "text": "Amount of tax",
          "val": "amount_of_tax_owed"
        }
      ]
    },
    {
      task_determine_fee: 'complete',
      task_check_if_late: 'complete',
      application_is_late: 'no',
      direct: 'false',
      fee: '200',
      fees: 'yes',
      hardship: 'yes',
      hardship_application_status: 'refused',
      hardship_applied_for: 'yes',
      hmrc_challenge: 'yes',
      paid_disputed_tax: 'no',
      tax_amount: '5000',
      tax_type: 'VAT',
      storedAnswers: [
        {
          "question": "What is your appeal about?",
          "text": "Value Added Tax (VAT)",
          "val": "vat"
        },
        {
          "question": "What is your dispute about?",
          "text": "Amount of tax",
          "val": "amount_of_tax_owed"
        },
        {
          "question": "Have you paid the amount of tax involved in the dispute?",
          "text": "No",
          "val": "No"
        },
        {
          "question": "Have you asked to defer paying the tax because of hardship?",
          "text": "Yes",
          "val": "Yes"
        },
        {
          "question": "What is the status of your hardship application with HMRC?",
          "text": "Refused",
          "val": "Refused"
        }
      ]
    }
  ]
};
