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
    self.$form.sticky({topSpacing: 0, zIndex: 100});

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'li.file a', function(e) {
      e.preventDefault();
      self.removeFileFromList(e.target);
    });

    $(document).on('click', 'a.remove-file', function(e) {
      e.preventDefault();
      self.removeSupportingDocument(e.target);
    });

    $('a.add-file').on('click', function(e) {
      e.preventDefault();
      this.blur();
      self.addSupportingDocument();
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
  },

  addSupportingDocument: function() {
    var self = this,
        file = $('#supporting_doc').val();

    if(file !== '') {
      $('.supporting_docs_list').removeClass('js-hidden').append('<li><span class="filename">' + file + '</span><a class="remove-file" href="#">Remove</a></li>');
      $('#supporting_doc').val('');
    }
  },

  removeSupportingDocument: function($el) {
    $el.closest('li').remove();

    if(!$('.supporting_docs_list li').length) {
      $('.supporting_docs_list').addClass('js-hidden');
    }
  }
};
