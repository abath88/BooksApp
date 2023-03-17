/* global Handlebars, utils, dataSource */ 
{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      form: '.filters'
    },
    book: {
      rating: '.book__rating__fill'
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class BooksList {
    constructor(){
      const thisBookList = this;

      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];

      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.render();
      thisBookList.initActions();
    }
    initData() {
      const thisBookList = this;
      thisBookList.data = dataSource.books;
    }
    getElements() {
      const thisBookList = this;

      thisBookList.dom = {};
      
      thisBookList.dom.booksContainer = document.querySelector(select.containerOf.books);
      thisBookList.dom.form = document.querySelector(select.containerOf.form);
    }
    initActions() {
      const thisBookList = this;

      thisBookList.dom.booksContainer.addEventListener('dblclick', function(event){
        event.preventDefault();
        const target = event.target.offsetParent;
        const dataId = target.getAttribute('data-id');

        if(target.classList.contains('book__image')){
          if(!thisBookList.favoriteBooks.includes(dataId)){
            target.classList.add('favorite');
            thisBookList.favoriteBooks.push(dataId);
          }else{
            target.classList.remove('favorite');
            thisBookList.favoriteBooks = thisBookList.favoriteBooks.filter( el => el !== dataId);
          }
        }
      });
      thisBookList.dom.booksContainer.addEventListener('click', function(event){
        event.preventDefault();
      });
      thisBookList.dom.form.addEventListener('click', function(event){
        const target = event.target;

        if(target.tagName === 'INPUT' && target.type === 'checkbox' && target.name === 'filter'){
          if(target.checked){
            thisBookList.filters.push(target.value);
          }else{
            thisBookList.filters = thisBookList.filters.filter( el => el !== target.value);
          }
        }
        thisBookList.filterBooks();
      });

    }
    filterBooks(){
      const thisBookList =  this;

      for(let book of dataSource.books){
        let shouldBeHidden = false;
        for(let filter of thisBookList.filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        const bookDOM = document.querySelector(`.book__image[data-id="${book.id}"]`);
        
        shouldBeHidden ?
          bookDOM.classList.add('hidden') :
          bookDOM.classList.remove('hidden');
      }
    }
    determineRatingBgc(rating) {
      if(rating < 6){
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      }if(rating >= 6 && rating <= 8){
        return'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }if(rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
    render(){
      const thisBookList = this;

      for(let book of dataSource.books){
        const ratingBgc = thisBookList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const genertedHTML = templates.book({...book, ratingBgc, ratingWidth});
        const element = utils.createDOMFromHTML(genertedHTML);
        thisBookList.dom.booksContainer.appendChild(element);
      }
    }
  }
  

  const app = new BooksList();
  console.log(app);
}