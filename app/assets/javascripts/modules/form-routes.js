'use strict';

moj.Modules.formRoutes = {
  validationDefault: 'off',
  validationOn: null,

  init: function() {
    var self = this;

    self.checkValidationStatus();

    if($('form.js_route').length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
        $form = $('form.js_route').eq(0);

    $form.on('submit', function(e) {
      e.preventDefault();

      if($form.hasClass('js_store_answers')) {
        moj.Modules.recordAnswers.recordAnswer($form);
      }

      moj.Modules.dataStore.checkForItemsToStore($form);

      if(self.validationOn === 'on') {
        if(validate(e)) {
          self.checkRoute($form);
        }
      } else {
        self.checkRoute($form);
      }
    });
  },

  checkRoute: function($form) {
    var self = this,
        $checkedDestinationButton = $form.find('input[type="radio"][data-destination]:checked').last(),
        nextPage;

    if($checkedDestinationButton.length) {
      nextPage = $checkedDestinationButton.data('destination');
    } else {
      nextPage = $form.attr('action');
    }

    self.next(nextPage);
  },

  next: function(page) {
    var self = this,
        applicationType = moj.Modules.dataStore.getItem('application_type'),
        isDirect = moj.Modules.dataStore.getItem('direct'),
        hasChallenged = moj.Modules.dataStore.getItem('hmrc_challenge'),
        wasRedirected = moj.Modules.dataStore.getItem('challenge_redirect'),
        pageName = self.getPageName();

    // closures have a different path, need to skip certain pages/sections
    if(applicationType === 'closure') {
      if(isDirect === 'true') {
        if(['dispute_type', 'fee', 'penalty_detail'].includes(page)) {
          moj.Modules.dataStore.storeItem('fee', '50');
          self.go('/data_capture/who_are_you');
        } else if(page === 'grounds_for_appeal') {
          self.go('/closure/enquiry_details');
        } else {
          self.go(page);
        }
      } else {
        // cannot close if indirect
        self.go('/closure/cannot_close');
      }
    } else {
      // restoration case
      if(page === 'fee' && moj.Modules.dataStore.getItem('tax_type') === 'Restoration case' && moj.Modules.dataStore.getItem('hmrc_challenge') !== 'yes') {
        self.go('/restoration/must_challenge');
      } else if(isDirect === 'true' && hasChallenged === 'no' && pageName !== 'hmrc_must' && wasRedirected !== 'yes') {
        // go to Challenge HMRC page
        moj.Modules.dataStore.storeItem('challenge_redirect', 'yes');
        self.go('hmrc_must');
      } else {

        // can user apply for hardship?
        if(page === 'fee' && moj.Modules.dataStore.getItem('hardship') === 'yes' && !['hardship_paid', 'hardship_hmrc_status', 'hardship_hmrc_applied'].includes(pageName)) {
          self.go('hardship_paid');
        } else if(page === 'grounds_for_appeal' && moj.Modules.dataStore.getItem('hardship') === 'yes' && pageName !== 'hardship' && moj.Modules.dataStore.getItem('paid_disputed_tax') !== 'yes' && moj.Modules.dataStore.getItem('hardship_application_status') === 'refused') {
          self.go('hardship');
        } else {
          self.go(page);
        }
      }
    }
  },

  checkValidationStatus: function() {
    var self = this,
        validation = moj.Modules.dataStore.getItem('validationOn');

    if(!validation) {
      moj.Modules.dataStore.storeItem('validationOn', self.validationDefault);
      self.validationOn = self.validationDefault;
      moj.log('validation not stored, setting to default: ' + self.validationDefault);
    } else {
      self.validationOn = validation;
    }
  },

  toggleValidation: function() {
    var self = this;

    self.validationOn = (self.validationOn === 'on' ? 'off' : 'on');
    moj.Modules.dataStore.storeItem('validationOn', self.validationOn);
    $('#validationStatus').text(self.validationOn);

    moj.log('validation toggled to: ' + self.validationOn);
  },

  getPageName: function() {
    var locArr = document.location.href.split('/'),
        page = locArr[locArr.length - 1].split('.')[0];

    return page;
  },

  go: function(page) {
    document.location = page;
  }
};
