'use strict';

moj.Modules.docUploadDemo = {
  form_id: 'doc_upload_demo',
  $form: null,
  $fileList: $('.uploaded-files').eq(0),

  init: function() {
    var self = this,
        dzOptions;

    Dropzone.autoDiscover = false;

    self.$form = $('#' + self.form_id);
    dzOptions = {
      autoProcessQueue: true,
      addRemoveLinks: true,
      createImageThumbnails: true,
      uploadMultiple: false,
      forceFallback: false,
      accept: function(file, done) {
        done();
        self.addFileToList(file);
      },
      complete: function(file, done) {
        moj.log(file.name + ' complete');
      }
    };
    self.$form.dropzone(dzOptions);

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'li.file a', function(e) {
      e.preventDefault();
      self.removeFileFromList(e.target);
    });
  },

  addFileToList: function(file) {
    var self = this;

    window.setTimeout(function() {
      self.removeFilePreview(file);
    }, 1500);
  },

  removeFileFromList: function(link) {
    var self = this,
        $el = $(link).closest('li');

    $el.fadeOut(400, function() {
      $el.remove();

      if(!self.$fileList.find('.file').length) {
        self.$fileList.find('.no-files').show();
      }
    });
  },

  removeFilePreview: function(file) {
    var self = this;

    self.$fileList.find('.no-files').hide();
    self.$fileList.append('<li class="file"><strong>' + file.name + '</strong><a href="#">Remove</a></li>');
    $(file.previewElement).fadeOut(400, function() {
      $(file.previewElement).remove();
      if(!self.$form.find('.dz-preview').length) {
        self.$form.removeClass('dz-started dz-drag-hover');
      }
    });
  }
};
