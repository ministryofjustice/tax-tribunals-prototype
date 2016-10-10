'use strict';

moj.Modules.challengeHMRC = {
  init: function() {
    var self = this,
        isDirect = moj.Modules.dataStore.getItem('direct'),
        hasChallenged = moj.Modules.dataStore.getItem('hmrc_challenge'),
        wasRedirected = moj.Modules.dataStore.getItem('challenge_redirect'),
        pageName = self.getPageName();

    if(isDirect === 'true' && hasChallenged === 'no' && pageName !== 'hmrc_must') {
      moj.Modules.dataStore.storeItem('challenge_redirect', 'yes');
      document.location = 'hmrc_must.html';
    }
  },

  getPageName: function() {
    var locArr = document.location.href.split('/'),
        page = locArr[locArr.length - 1].split('.')[0];

    return page;
  }
};
