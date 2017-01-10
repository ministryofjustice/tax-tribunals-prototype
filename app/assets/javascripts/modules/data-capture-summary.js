'use strict';

moj.Modules.dataCaptureSummary = {
  hideClass: 'js-hidden',

  dependencies: [
    {
      elementId: 'appellant_name',
      dataKey: 'appellant_type',
      dataValue: 'individual'
    },
    {
      elementId: 'appellant_company_name',
      dataKey: 'appellant_type',
      dataValue: 'company'
    },
    {
      elementId: 'appellant_organisation_name',
      dataKey: 'appellant_type',
      dataValue: 'organisation'
    },
    {
      elementId: 'appellant_email',
      dataKey: 'who_are_you',
      dataValue: 'taxpayer'
    },
    {
      elementId: 'representative_details_row',
      dataKey: 'appellant_has_representation',
      dataValue: 'yes'
    },
    {
      elementId: 'representative_name',
      dataKey: 'representative_type',
      dataValue: 'individual'
    },
    {
      elementId: 'representative_company_name',
      dataKey: 'representative_type',
      dataValue: 'company'
    },
    {
      elementId: 'representative_organisation_name',
      dataKey: 'representative_type',
      dataValue: 'organisation'
    },
    {
      elementId: 'appeal_timeliness_section',
      dataKey: 'application_type',
      dataValue: 'appeal'
    },
    {
      elementId: 'closure_section',
      dataKey: 'application_type',
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
    },
    {
      elementId: 'outcome_row',
      dataKey: 'application_type',
      dataValue: '!closure'
    },
    {
      elementId: 'grounds_row',
      dataKey: 'application_type',
      dataValue: '!closure'
    },
    {
      elementId: 'documents_row',
      dataKey: 'application_type',
      dataValue: '!closure'
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
      var dep = self.dependencies[x],
          val = moj.Modules.dataStore.getItem(dep.dataKey);

      if(dep.dataValue.charAt(0) === '!') {
        if(val === dep.dataValue.slice(1)) {
          self.hideItem(dep.elementId);
        } else {
          self.showItem(dep.elementId);
        }
      } else {
        if(val === dep.dataValue) {
          self.showItem(dep.elementId);
        } else {
          self.hideItem(dep.elementId);
        }
      }
    }
  },

  showItem: function(id) {
    var self = this;

    $('#' + id).removeClass(self.hideClass);
  },

  hideItem: function(id) {
    var self = this;

    $('#' + id).addClass(self.hideClass);
  },

  showFeeDeterminationAnswers: function() {
    var $el = $('.js_fee-determination-details').eq(0),
        html = '',
        row,
        answers = moj.Modules.dataStore.getItem('storedAnswers'),
        answer = '';

    if(answers) {
      for(var x = 0; x < answers.length; x++) {
        row = '';

        row += '<tr><td>';
        row += answers[x].question;
        row += '</td><td>';

        answer = answers[x].text;
        if(answers[x].val === 'other') {
          answer = moj.Modules.dataStore.getItem('other_dispute');
        } else if(answers[x].val === 'none_of_the_above') {
          answer = moj.Modules.dataStore.getItem('other_dispute_type');
        }
        row += answer;

        row += '</td>';

        row += (x === 0 ? '<td class="change-answer"><a href="#" data-alert="This functionality is not currently available in this demo">Change</a>' : '<td>&nbsp;');

        row += '</td></tr>';

        if(answers[x].val === 'other' && !moj.Modules.dataStore.getItem('other_dispute')) {
          row = '';
        }

        html += row;
      }

      $el.replaceWith(html);
    }
  },

  showUploadedDocs: function() {
    var $list = $('.uploaded-docs').eq(0),
        letter = moj.Modules.dataStore.getItem('doc_check_hmrc_letter'),
        review = moj.Modules.dataStore.getItem('doc_check_review_conclusion'),
        groundsFile = moj.Modules.dataStore.getItem('file_grounds_for_appeal'),
        hardshipFile = moj.Modules.dataStore.getItem('file_reasons_for_hardship'),
        proFormaFile = moj.Modules.dataStore.getItem('file_rep_pro_forma');

    if(letter || review || groundsFile || proFormaFile || hardshipFile) {
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
