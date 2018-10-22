document.addEventListener("DOMContentLoaded", function(){
  renderStories();
})

function renderStories(){
  fetchAllStories().then(data => {
    data.forEach(renderStory)
  })
}

function renderStory(story){
  //add story div
  let storyDiv = document.createElement('div');
  storyDiv.classList.add(`story-div-${story.id}`);
  document.querySelector('.story-container').appendChild(storyDiv)

  //add story title
  let title = document.createElement('h2');
  title.innerText = story.title;
  storyDiv.appendChild(title);

  //add story content
  let opening = document.createElement('p');
  opening.innerText = `${story.posts[0].content}...`;
  opening.dataset.postId = story.posts[0].id
  storyDiv.appendChild(opening);
  document.querySelector(`.story-div-${story.id}`).addEventListener('click', firstPostListener)
}

function firstPostListener(){
  let postId = event.currentTarget.querySelector("p").dataset.postId
  fetchPost(postId)
  .then(post => {
    //select and enlarge story to follow
    document.querySelector('.story-container').innerHTML = "";
    let zoomStory = document.createElement('div');
    zoomStory.classList.add('zoom-story');
    document.querySelector('.story-container').appendChild(zoomStory)

    //add title
    // let title = document.createElement('h2');
    // title.innerText = post.story.title
    // zoomStory.appendChild(title);

    //add first line
    let opening = document.createElement('p');
    opening.innerText = post.content + "..."
    zoomStory.appendChild(opening);

    createButtons(post)
  })
}

function createButtons(post){
  let storySelector = document.querySelector(".zoom-story")

  if (post.next_post_ids){
    let forwardButton = document.createElement('button');
    forwardButton.innerText = "next page";
    forwardButton.dataset.storyId = post.story.id;
    forwardButton.dataset.previousPostId = post.id;
    storySelector.appendChild(forwardButton)
    forwardButton.addEventListener('click', nextPage)
  } else {
    let createNewPostButton = document.createElement('button');
    createNewPostButton.innerText = "Create New Post";
    createNewPostButton.dataset.storyId = post.story.id;
    createNewPostButton.dataset.previousPostId = post.id;
    createNewPostButton.dataset.nextPostIds = post.next_post_ids;
    storySelector.appendChild(createNewPostButton)
    createNewPostButton.addEventListener('click', newPost)
  }

  let backButton = document.createElement('button');
  backButton.innerText = "previous page";

  backButton.dataset.storyId = post.story.id;
  backButton.dataset.nextPostId = post.id;
  storySelector.appendChild(backButton)
  backButton.addEventListener('click', previousPage)
}


function nextPage(){
  debugger
}


function previousPage(){
debugger
}


function newPost(){

  let storyId = event.currentTarget.dataset.storyId;
  let previousPostId  = event.currentTarget.dataset.previousPostId;
  let nextPostIds = event.currentTarget.dataset.nextPostIds;

  let container = document.querySelector('.story-container')
  container.innerHTML = "";

  let form = document.createElement('form');
  let contentInput = document.createElement('input');
  form.appendChild(contentInput);

  let submit = document.createElement('input');
  submit.type = "submit";
  submit.dataset.storyId = storyId;
  submit.dataset.previousPostId = previousPostId;
  submit.dataset.nextPostIds = nextPostIds;
  form.appendChild(submit);
  form.addEventListener('submit', submitNewPost)

  container.appendChild(form);
}

function submitNewPost(){
  event.preventDefault()
  let input = event.currentTarget.children[0].value;
  let storyId = +event.currentTarget.children[1].dataset.storyId;
  let previousPostId = +event.currentTarget.children[1].dataset.previousPostId;
  let nextPostIds = event.currentTarget.children[1].dataset.nextPostIds;

  let body = {content: input, prev_post_id: previousPostId, story_id: storyId}

  postNewPost(body)
  .then(newPost => {
    patchOldPost(previousPostId, newPost.id, nextPostIds)
  })

}
