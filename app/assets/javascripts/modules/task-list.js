'use strict';

moj.Modules.taskList = {
  tasks: [],

  init: function() {
    var self = this,
        list = $('[data-task-list]').eq(0);

    if(list.length) {
      self.getTasks(list);
      self.bindEvents();
      self.checkCompletedItems();
    }
  },

  bindEvents: function() {
    var self = this;

    $('a.reset-task-list').on('click', function(e) {
      e.preventDefault();

      self.resetTaskList();
    });
  },

  getTasks: function(list) {
    var self = this;

    $(list).find('[data-task]').each(function(n, link) {
      self.tasks[self.tasks.length] = $(link).data('task');
    });
  },

  checkCompletedItems: function() {
    var self = this;

    for(var x = 0; x < self.tasks.length; x++) {
      var task = self.tasks[x];

      if(moj.Modules.dataStore.getItem('task_' + task) === 'complete') {
        $('span[data-task="' + task + '"]').show();
      } else {
        $('span[data-task="' + task + '"]').hide();
      }
    }
  },

  resetTaskList: function() {
    var self = this;

    for(var x = 0; x < self.tasks.length; x++) {
      moj.Modules.dataStore.deleteItem('task_' + self.tasks[x]);
    }

    self.checkCompletedItems();
  }
};
