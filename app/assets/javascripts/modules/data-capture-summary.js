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
    },
    {
      elementId: 'hardship_reasons_row',
      dataKey: 'hardship_application_status',
      dataValue: 'refused'
    }
  ],

  init: function() {
    var self = this;

    self.showFeeDeterminationAnswers();
    self.showDependentItems();
    self.showUploadedDocs();
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
        html += '<tr><td>';
        html += answers[x].question;
        html += '</td><td>';

        answer = answers[x].text;
        if(answers[x].val === 'other') {
          answer = moj.Modules.dataStore.getItem('other_dispute');
        } else if(answers[x].val === 'none_of_the_above') {
          answer = moj.Modules.dataStore.getItem('other_dispute_type');
        }
        html += answer;

        html += '</td>';

        html += (x === 0 ? '<td class="change-answer"><a href="#" data-alert="This functionality is not currently available in this demo">Change</a>' : '<td>&nbsp;');

        html += '</td></tr>';
      }

      $el.replaceWith(html);
    }
  },

  showUploadedDocs: function() {
    var $list = $('.uploaded-docs').eq(0),
        letter = moj.Modules.dataStore.getItem('doc_check_hmrc_letter'),
        review = moj.Modules.dataStore.getItem('doc_check_review_conclusion'),
        additional = moj.Modules.dataStore.getItem('additional_docs_info'),
        groundsFile = moj.Modules.dataStore.getItem('file_grounds_for_appeal'),
        hardshipFile = moj.Modules.dataStore.getItem('file_reasons_for_hardship'),
        proFormaFile = moj.Modules.dataStore.getItem('file_rep_pro_forma');

    if(letter || review || additional || groundsFile || proFormaFile || hardshipFile) {
      $list.empty();
    }

    if(proFormaFile) {
      $list.append('<li>Representative pro forma: ' + proFormaFile + '</li>');
    }
    if(letter) {
      $list.append('<li>' + letter + '</li>');
    }
    if(review) {
      $list.append('<li>' + review + '</li>');
    }
    if(additional) {
      $list.append('<li>' + additional + '</li>');
    }
    if(groundsFile) {
      $list.append('<li>Grounds for appeal: ' + groundsFile + '</li>');
      $('[data-key="grounds_for_appeal"]').after('<br>(File uploaded, see below)');
    }
    if(hardshipFile) {
      $list.append('<li>Reasons for hardship application: ' + hardshipFile + '</li>');
      $('[data-key="hmrc_reasons_to_allow_hardship"]').after('<br>(File uploaded, see below)');
    }
  }
};
