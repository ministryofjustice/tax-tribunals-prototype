'use strict';

moj.Modules.recordAnswers = {
  init: function() {
    var self = this;

    if($('form[data-number]').length) {
      self.checkForSubseqeuentAnswers();
    }

    if($('ul.your-answers').length) {
      self.listAnswers();
      self.trimTable();
    }
  },

  recordAnswer: function($form) {
    var storedAnswers = moj.Modules.dataStore.getItem('storedAnswers'),
        answer = {},
        $selectedRadio,
        previouslyAnswered = false;

    if(!storedAnswers) {
      storedAnswers = [];
    }

    answer.question = $('main h1').eq(0).text();

    $selectedRadio = $('main input[type="radio"]:checked').last();

    if($selectedRadio.siblings('strong').length) {
      answer.text = $selectedRadio.siblings('strong').text();
    } else {
      answer.text = $selectedRadio.closest('label').text().trim();
    }

    answer.val = $selectedRadio.val();

    for(var x = 0; x < storedAnswers.length; x++) {
      if(storedAnswers[x].question === answer.question) {
        previouslyAnswered = true;
        storedAnswers[x] = answer;
      }
    }

    if(!previouslyAnswered) {
      storedAnswers[storedAnswers.length] = answer;
    }

    moj.Modules.dataStore.storeItem('storedAnswers', storedAnswers);
  },

  checkForSubseqeuentAnswers: function() {
    var max = $('form').eq(0).data('number'),
        storedAnswers = moj.Modules.dataStore.getItem('storedAnswers'),
        newArray = [];

    if(storedAnswers && storedAnswers.length > max) {
      for(var x = 0; x < max; x++) {
        newArray[newArray.length] = storedAnswers[x];
      }

      moj.Modules.dataStore.storeItem('storedAnswers', newArray);
    }
  },

  listAnswers: function() {
    var storedAnswers = moj.Modules.dataStore.getItem('storedAnswers');

    if(storedAnswers.length) {
      var $list = $('ul.your-answers').eq(0);

      $list.empty();

      for(var x = 0; x < storedAnswers.length; x++) {
        var html = '';

        html += '<li>';
        html += storedAnswers[x].question;
        html += ': ';
        html += storedAnswers[x].text;
        html += '</li>';

        $list.append(html);
      }
    }
  },

  trimTable: function() {
    var fee = moj.Modules.dataStore.getItem('fee');

    if(fee) {
      $('table.expandable-demo tbody tr').hide();
      $('table.expandable-demo tbody tr.fee-' + fee).show();
    }
  }
};
