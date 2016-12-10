'use strict';

const Game = (function() {

  const categories = {
    defs: ['chrome', 'codepen', 'css3', 'dribbble', 'edge', 'firefox', 'font-awesome', 'free-code-camp', 'github', 'github-alt', 'github-square', 'gitlab', 'google', 'html5', 'internet-explorer', 'jsfiddle', 'linux', 'opera'],
    arrows: ['angle-double-down', 'angle-double-left', 'angle-double-right', 'angle-double-up', 'arrow-circle-down', 'arrow-circle-left', 'arrow-circle-o-down', 'arrow-circle-o-left', 'arrow-circle-o-right', 'arrow-circle-o-up', 'arrow-circle-right', 'arrow-circle-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'chevron-circle-down', 'chevron-circle-left', 'chevron-circle-right', 'chevron-circle-up'],
    brands: ['bandcamp', 'eercast', 'etsy', 'free-code-camp', 'grav', 'imdb', 'meetup', 'quora', 'ravelry', 'wpexplorer', '500px', 'adn', 'amazon', 'android', 'angellist', 'apple', 'behance', 'behance-square', 'contao', 'dribbble', 'dropbox', 'empire', 'envira', 'facebook-square', 'flickr', 'forumbee', 'google-wallet', 'houzz', 'ioxhost', 'leanpub', 'medium', 'yelp', 'windows'],
    coding: ['bitbucket', 'bitbucket-square', 'bug', 'cloud', 'cloud-download', 'cloud-upload', 'code', 'code-fork', 'coffee', 'creative-commons', 'database', 'desktop', 'download', 'heart', 'laptop', 'lightbulb-o', 'photo', 'question', 'recycle', 'server', 'university', 'file-code-o', 'angellist', 'apple', 'behance', 'codepen', 'codiepie', 'css3', 'free-code-camp', 'git', 'git-square', 'github', 'github-alt', 'github-square', 'gitlab', 'html5', 'joomla', 'jsfiddle', 'linux', 'maxcdn', 'medium', 'safari', 'stack-exchange', 'stack-overflow', 'trello'],
    social: ['youtube', 'youtube-play', 'youtube-square', 'wordpress', 'digg', 'deviantart', 'delicious', 'facebook', 'facebook-official', 'facebook-square', 'flickr', 'foursquare', 'google-plus', 'google-plus-official', 'google-plus-square', 'instagram', 'linkedin', 'linkedin-square', 'pinterest', 'pinterest-p', 'pinterest-square', 'quora', 'reddit', 'reddit-alien', 'reddit-square', 'slack', 'slideshare', 'snapchat', 'snapchat-ghost', 'stumbleupon', 'stumbleupon-circle', 'tumblr', 'tumble-square', 'twitter', 'twitter-square', 'vimeo', 'vimeo-square', 'vine', 'vk']
  };

  const dom = {};
  let pairs = [];
  let clicks = [];
  let matches = [];
  let tries = 0;
  let category = '';
  let boardSize = 0;
console.log(categories)

  function init() {
    cacheDOM();
    bindEvents();
  }

  function cacheDOM() {
    dom.start = document.getElementById('start');
    dom.level = document.getElementById('level');
    dom.info = document.getElementById('info');
    dom.options = document.getElementById('options');
    dom.sizes = document.getElementById('sizes');
    dom.categories = document.getElementById('cats');
    dom.game = document.getElementById('game');
    dom.board = document.getElementById('board');
    dom.cards = document.getElementsByClassName('card'); // ???
    dom.gameover = document.getElementById('gameover');
  }

  function bindEvents() {
    dom.start.addEventListener('click', start);
    dom.board.addEventListener('click', flipCard);
    dom.level.addEventListener('click', openBoardOptions);
    dom.sizes.addEventListener('click', selectBoardSize);
  }

  function render() {
    dom.board.innerHTML = '';

    for (let i = 0; i < pairs.length; i++) {

      let card = createElem('li', 'card');
      card.dataset.figure = pairs[i];
      let flipper = createElem('div', 'flipper');
      let front = createElem('div', ['front', 'fa', 'fa-certificate']);
      let back = createElem('div', ['back', 'fa', 'fa-' + pairs[i]]);

      flipper.appendChild(front);
      flipper.appendChild(back);
      card.appendChild(flipper);
      dom.board.appendChild(card);
    }
  }

  function start() {
    boardSize = boardSize || 20;
    let keys = Object.keys(categories);
    category = category || keys[random(0, keys.length - 1)];

    createPairs();
    render();
    close(dom.options);
    close(dom.categories);

    wait(300)
    .then(_ => open(dom.game));
  }

  function flipCard(event) {

    if (!event.target.classList.contains('front')) {
      return;
    }

    const card = event.target.parentNode.parentNode;

    // when click on first, flip
    if (clicks.length === 0) {
      card.classList.add('flipped');
      clicks.push(card.dataset.figure);
      return;
    }



    // when click on second, check if it's a match
    card.classList.add('flipped');
    tries += 1;

    // if it's a match, add it to a matches array and leave it flipped
    if (isMatch(card)) {


      clicks = [];
      matches.push(card.dataset.figure);
      // some nice animation? :)

      // check if it's the last card
      if (matches.length * 2 === pairs.length) {
        console.log('Done');
      }
    }
    // if it's not matched, after half a sec flip them back
    else {
      // no click should be allowed!!! maybe it's because the clicks are deleted after a second
      clicks = [];

      wait(500)
      .then(_ => flipCardsBack());
    }
  }

  function isMatch(card) {
    return clicks.indexOf(card.dataset.figure) > -1;
  }

  function flipCardsBack() {
    for (let i = 0; i < dom.cards.length; i++) {
      if (matches.indexOf(dom.cards[i].dataset.figure) === -1) {
        dom.cards[i].classList.remove('flipped');
      }
    }
  }

  function openBoardOptions() {
    toggle(dom.options);
  }

  function selectBoardSize(event) {
    if (!event.target.dataset.size && !event.target.parentNode.dataset.size) {
      return;
    }

    boardSize = event.target.dataset.size ?
      event.target.dataset.size :
      event.target.parentNode.dataset.size;

    toggle(dom.options);
    // should show game, or?

  }

  function createPairs() {
    pairs = [];
    let cat = categories[category];
    // must be a better way...
    for (let i = 0; i < boardSize / 2; i++) {
      let e = cat[random(0, cat.length - 1)];

      if (pairs.indexOf(e) === -1)
        pairs.push(e);
      else
        i -= 1;
    }
    pairs = pairs.concat(pairs);
    return shuffle(pairs);
  }

  function createElem(type, className, id) {
    let el = document.createElement(type);
    if (Array.isArray(className)) {
      el.classList.add(...className);
    }
    else if (typeof className === 'string') {
      el.classList.add(className);
    }
    if (id) {
      el.id = id;
    }
    return el;
  }

  function toggle(elem) {
    elem.classList.toggle('active');
  }

  function open(elem) {
    elem.classList.add('active');
  }

  function close(elem) {
    elem.classList.remove('active');
  }

  function updateTimer() {
    time += 1;
    dom.timer.textContent = formatTime(time);
  }

  function formatTime(secs) {
    const mins = ('0' + Math.floor(secs / 60)).slice(-2);
    secs = ('0' + (secs % 60)).slice(-2);

    return `${mins}:${secs}`;
  }

  function shuffle(array) {

    let i = array.length;
    let temp;
    let random;

    while (i !== 0) {
      random = Math.floor(Math.random() * i);
      i -= 1;

      temp = array[i];
      array[i] = array[random];
      array[random] = temp;
    }

    return array;
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }


  return {
    init: init
  }
})();

Game.init();
