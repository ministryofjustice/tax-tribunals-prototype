'use strict';

moj.Modules.taskDependencies = {
  tasks: [],
  $button: null,

  init: function() {
    var self = this,
        $button = $('.js-start-task');

    if($button.length) {
      self.$button = $button.eq(0);
      self.getTasks();
    }
  },

  getTasks: function() {
    var self = this,
        dependencies = self.$button.data('dependent-tasks');

    if(dependencies.length) {
      moj.Modules.taskList.getTasksRemotely(function(tasks) {
        self.tasks = tasks;
        self.checkMetDependencies(dependencies);
      });
    };
  },

  checkMetDependencies: function(dependencies) {
    var self = this,
        unmetDependencies = [];

    for(var x = 0; x < dependencies.length; x++) {
      if(moj.Modules.dataStore.getItem('task_'+self.tasks[x].text) !== 'complete') {
        unmetDependencies.push(dependencies[x]);
      }
    }

    if(unmetDependencies.length) {
      self.disableButton(unmetDependencies);
    }
  },

  disableButton: function(unmetDependencies) {
    var self = this,
        message = self.createMessage(unmetDependencies);

    self.$button.addClass('js-hidden').on('click', function(e) {
      e.preventDefault();
    }).before('<p class="disable-message">' + message + '</p><p><a class="link-back js-link-back" href="">Back</a></p>');
  },

  createMessage: function(unmetDependencies) {
    var self = this,
        message;

    switch(unmetDependencies.length) {
      case 1:
        message = '<a href="' + self.tasks[unmetDependencies[0] - 1].url + '">Please complete step ' + unmetDependencies[0] + ' first</a>'
        break;
      case 2:
        message = 'Please complete <a href="' + self.tasks[unmetDependencies[0] - 1].url + '">step ' + unmetDependencies[0] + '</a> and <a href="' + self.tasks[unmetDependencies[1] - 1].url + '">step ' + unmetDependencies[1] + '</a> first'
        break;
      default:
        message = 'Please complete '
        for(var x = 0; x < unmetDependencies.length - 1; x++) {
          message += '<a href="' + self.tasks[unmetDependencies[x] - 1].url + '">step ' + unmetDependencies[x] + '</a>, ';
        }
        message += ' and <a href="' + self.tasks[unmetDependencies[unmetDependencies.length - 1] - 1].url + '">step ' + unmetDependencies[unmetDependencies.length - 1] + '</a> first';
    }

    return message;
  }
};
