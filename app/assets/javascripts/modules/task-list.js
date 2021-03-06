'use strict';

moj.Modules.taskList = {
  tasks: [],

  init: function() {
    var self = this,
        $list = $('[data-task-list]').eq(0);

    if($list.length) {
      self.tasks = self.getTasks($list);
      self.bindEvents();
      self.checkCompletedItems($list);
    }
  },

  bindEvents: function() {
    var self = this;

    $('a.reset-task-list').on('click', function(e) {
      e.preventDefault();

      self.resetTaskList();
    });
  },

  getTasks: function($list) {
    var self = this,
        tasks = [];

    $list.find('[data-task]').each(function(n, link) {
      var text = $(link).data('task'),
          url = $(link).siblings('.button-start').attr('href');

      tasks.push({
        text: text,
        url: url
      });
    });

    return tasks;
  },

  checkCompletedItems: function($list) {
    var self = this,
        completedTasks = 0;

    for(var x = 0; x < self.tasks.length; x++) {
      var task = self.tasks[x],
          $el = $('span[data-task="' + task.text + '"]');

      if(moj.Modules.dataStore.getItem('task_' + task.text) === 'complete') {
        $el.removeClass('js-hidden');
        completedTasks++;
      } else {
        $el.addClass('js-hidden');
      }
    }

    $list.find('li').eq(completedTasks).find('.button-start').removeClass('js-hidden');
  },

  resetTaskList: function() {
    var self = this;

    for(var x = 0; x < self.tasks.length; x++) {
      moj.Modules.dataStore.deleteItem('task_' + self.tasks[x].text);
    }

    self.checkCompletedItems();
  },

  getTasksRemotely: function(callback) {
    var self = this;

    $.get('/task_list', function(data) {
      var $list = $(data).find('[data-task-list]'),
          tasks = self.getTasks($list);

      callback(tasks);
    });
  }
};
