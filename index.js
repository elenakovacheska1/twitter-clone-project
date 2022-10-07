import { tweetsDataOne } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetsData = JSON.parse(localStorage.getItem("tweetsData"));

function addDataToLocalStorage() {
  localStorage.setItem("tweetsData", JSON.stringify(tweetsDataOne));
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.ownreplies) {
    handleOwnRepliesClick(e.target.dataset.ownreplies);
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete);
  } else if (e.target === document.querySelector("body")) {
    render();
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function handleOwnRepliesClick(repliesId) {
  const replyInputEl = document.getElementById("reply-text");
  if (replyInputEl.value) {
    const tweetObj = tweetsData.filter(function (tweet) {
      return tweet.uuid === repliesId;
    })[0];
    tweetObj.replies.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyInputEl.value,
    });
    render();
    replyInputEl.value = "";
  }
}

function handleDeleteClick(deleteId) {
  tweetsData.forEach(function (tweet, index) {
    if (tweet.uuid === deleteId) {
      tweetsData.splice(index, 1);
      render();
    }
  });
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let deleteClass = "";
    if (tweet.handle === `@Scrimba`) {
      deleteClass = "";
    } else {
      deleteClass = "hidden";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                  <button class="${deleteClass} deleteBtn" id="delete-btn" data-delete="${tweet.uuid}">Delete</button>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <textarea placeholder="add a reply" id="reply-text" class="replyText"></textarea>
        <button class="replyBtn" data-ownreplies="${tweet.uuid}">Reply</button>
        ${repliesHtml}
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

addDataToLocalStorage();
render();
