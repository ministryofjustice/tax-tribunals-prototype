'use strict';

moj.Modules.docUpload = {
  zone_id: 'doc_upload_zone',
  $zone: null,
  $fileList: $('.uploaded-files').eq(0),

  init: function() {
    var self = this,
        dzOptions;

    Dropzone.autoDiscover = false;

    self.$zone = $('#' + self.zone_id);
    dzOptions = {
      autoProcessQueue: true,
      addRemoveLinks: true,
      createImageThumbnails: true,
      uploadMultiple: false,
      forceFallback: false,
      url: 'send_files',
      accept: function(file, done) {
        done();
        self.addFileToList(file);
      },
      complete: function(file, done) {
        moj.log(file.name + ' complete');
      }
    };

    self.$zone.dropzone(dzOptions);
    self.$zone.sticky({topSpacing: 0, zIndex: 100});

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
    self.$fileList.append('<li class="file">' + file.name + '<a href="#">Remove</a></li>');
    $(file.previewElement).fadeOut(400, function() {
      $(file.previewElement).remove();
      if(!self.$zone.find('.dz-preview').length) {
        self.$zone.removeClass('dz-started dz-drag-hover');
      }
    });
  }
};
