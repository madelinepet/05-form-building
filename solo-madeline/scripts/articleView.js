'use strict';

let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function(e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why?
//This function is called last because it depends on the other functions executing first.

articleView.initNewArticlePage = () => {
  $('.tab-content').show;

  $('#article-json').on('focus', function(){
    $(this).select();
    //copies on click
    document.execCommand('copy');
  });

  $('#new-article').on('change', 'input, textarea', articleView.create);
};

articleView.create = () => {
  $('#articles > *').remove();
  let articleObj = {
    title: $('#title').val(),
    category: $('#category').val(),
    author: $('#author').val(),
    authorUrl: $('#authorUrl').val(),
    body: $('#body').val()
  }
  //only says draft when there is no date. Make it so there is only a date if published.
  if ($('#publishedOn').is(':checked')){
    let dateObj = {
      publishedOn: new Date(),
      //daysAgo comes from article.js. It is underlined here because the linter does not realize that, but it is working in the JSON this produces.
      publishStatus: Article.publishedOn ? `published ${daysAgo} days ago` : '(draft)',
    }
    //if this condition is met, merge these two objects into one so that date displays when published. '(draft)' displays when unpublished.
    Object.assign(articleObj, dateObj);
  }
  let article = new Article(articleObj);

  $('#articles').append(article.toHtml());
  $('pre code').each();

  $('#article-json').val(JSON.stringify(article));
};

// COMMENT: Where is this function called? Why?
//This function is called as a callback in the event listener above the function. It is called there because it should only run on the occurance of the change event to the form fields.
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
