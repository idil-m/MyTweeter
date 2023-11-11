/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1699430074581
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1699516474581
  }
];

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
}

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
    console.log("test", tweet)
    const $tweetElement = createTweetElement(tweet);
    $('#tweets-container').append($tweetElement);
  });
};

$(document).ready(function() {
  loadTweets().then(tweets => {
    renderTweets(tweets);
  }).catch(error => {
    console.error("Error loading tweets:", error);
  });
});

$(document).ready(function() {
  // Create tweet form
  $("#create-tweet-form").on("submit", (event) =>{
    event.preventDefault()
    const tweetText = $('#tweet-text').val();
    if (tweetText.length === 0) {
      alert("Your tweet cannot be empty!");
      return
    } else if (tweetText.length > 140) {
      alert("Your tweet exceeds the limit!");
      return 
    }

    let formData = $("#create-tweet-form").serialize();
    console.log(formData)
    $.ajax({
        type: "POST",
        url: "/tweets",
        data: formData, 
        success: function(response) {
            console.log("Tweet posted successfully");
        },
        error: function(xhr, status, error) {
            console.error("Error posting tweet");
            console.error(error)
        }
    });

    loadTweets().then((tweets) => { 
      let newtweets= []
      newtweets.push(tweets.pop())
      console.log(newtweets)
      renderTweets(newtweets);
    }).catch(error => {
      console.error("Error loading tweets:", error);
    });



  })

});