'use strict';

moj.Modules.dataCaptureSummary = {
  hideClass: 'js-hidden',

  dependencies: [
    {
      elementId: 'representative_details_row',
      dataKey: 'appellant_has_representation',
      dataValue: 'yes'
    },
    {
      elementId: 'closure_notice_row',
      dataKey: 'dispute_type',
      dataValue: 'closure'
    },
    {
      elementId: 'application_is_late_row',
      dataKey: 'hmrc_challenge',
      dataValue: 'yes'
    },
    {
      elementId: 'reasons_for_late_application_row',
      dataKey: 'application_is_late',
      dataValue: 'yes'
    }
  ],

  init: function() {
    var self = this;

    self.showFeeDeterminationAnswers();
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
  },

  showFeeDeterminationAnswers: function() {
    var $el = $('.js_fee-determination-details').eq(0),
        html = '',
        answers = moj.Modules.dataStore.getItem('storedAnswers'),
        answer = '';

    if(answers) {
      for(var x = 0; x < answers.length; x++) {
        html += '<li>';

        answer = answers[x].text;
        if(answers[x].val === 'other') {
          answer = moj.Modules.dataStore.getItem('other_dispute');
        } else if(answers[x].val === 'none_of_the_above') {
          answer = moj.Modules.dataStore.getItem('other_dispute_type');
        }
        html += answer;

        html += '</li>';
      }

      $el.html(html);
    }
  }
};
