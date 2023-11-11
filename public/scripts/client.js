/* global $ */
/* global document */
/* global timeago */


/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const loadTweets = function() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "/tweets",
      success: function(response) {
        resolve(response);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
};

const createTweetElement = function(tweet) {
  let timePassed = timeago.format(new Date(tweet.created_at));
  let $tweet = $(`
    <article class="tweet">
      <div class="tweet-card-header">
        <div class="profile">
          <img src="${tweet.user.avatars}" alt="Profile Picture" class="tweet-card-header-profile-img">
          <h2>${tweet.user.name}</h2>
        </div>
        <h3>${tweet.user.handle}</h3>
      </div>
      <p>${tweet.content.text}</p>
      <footer>
      <time datetime="${new Date(tweet.created_at).toISOString()}">
      ${timePassed}
      
        </time>
        <div>
          <button class="fa-solid fa-heart"></button>
          <button class="fa-solid fa-retweet"></button>
          <button class="fa-solid fa-flag"></button>
        </div>
      </footer>
    </article>
  `);
  return $tweet;
};

const renderTweets = function(tweets) {
  tweets.forEach(tweet => {
    const $tweetElement = createTweetElement(tweet);
    $('#tweets-container').append($tweetElement);
  });
};
const showError = function(message) {
  let error = document.getElementById('error-messages');
  error.innerHTML = message;
  error.style.display = 'block';
};

$(document).ready(function() {
  loadTweets().then(tweets => {
    renderTweets(tweets);
  });
});

$(document).ready(function() {
  
  $("#create-tweet-form").on("submit", (event) =>{
    event.preventDefault();
    const tweetText = $('#tweet-text').val();
    if (tweetText.length === 0) {
      showError("Your tweet cannot be empty!");
      return;
    } else if (tweetText.length > 140) {
      showError("Your tweet exceeds the limit!");
      return;
    }

    let formData = $("#create-tweet-form").serialize();
    
    $.ajax({
      type: "POST",
      url: "/tweets",
      data: formData,
    });

    loadTweets().then((tweets) => {
      let newtweets = [];
      newtweets.push(tweets.pop());
      
      renderTweets(newtweets);
    });



  });

});