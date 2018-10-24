document.addEventListener("DOMContentLoaded", function(){
  renderStories();
})

function renderStories(){
  let container = document.querySelector('.story-container')
  container.innerHTML = "";
  let button  = document.getElementById('new-story-button');
  if (button !== null) {
    document.querySelector('.custom-header').removeChild(document.getElementById('new-story-button'));}

  renderNewStoryButton();
  fetchAllStories().then(data => {
    data.forEach(renderStory)
  })
}

function renderNewStoryButton(){
  let newDiv = document.createElement("div")
  newDiv.id = "new-story-button";
  // newDiv.classList.add("col-3")
  let newStoryButton = document.createElement('img');
  newStoryButton.src = "./doodles/writing.svg";
  newStoryButton.addEventListener('click', newStoryHandler)
  newDiv.appendChild(newStoryButton);
  document.querySelector(".custom-header").appendChild(newDiv)
}

function newStoryHandler(){
  let container = document.querySelector('.story-container')
  container.innerHTML = "";

  let form = document.createElement('form');
  form.classList.add("center-screen")
  let titleInput = document.createElement('input');
  titleInput.placeholder = "title"
  form.appendChild(titleInput);


  let firstPostInput = document.createElement('input');
  firstPostInput.placeholder = "begin your story"
  form.appendChild(firstPostInput);

  let imgInput = document.createElement('button');
  imgInput.innerText = "click to add image";
  imgInput.addEventListener('click', renderImageOptions)
  form.appendChild(imgInput);

  let submit = document.createElement('input');
  submit.type = "submit";
  form.appendChild(submit);
  form.addEventListener('submit', newStoryListener)
  container.appendChild(form);
}

function renderImageOptions(e){
  e.preventDefault();

  let doodleDiv = document.createElement("div")
  //fetch all the doodles
  fetchAllDoodles().then(doodles => doodles.forEach(renderDoodle))
  //go thru and render each doodle inside this div

  //attach to beginning of story-container
  document.querySelector(".story-container").prepend(doodleDiv)
}

function renderDoodle(){
  debugger
}

function newStoryListener(e){
  e.preventDefault();
  e.stopPropagation();

  let title = event.currentTarget.children[0].value;
  let newPostContent = event.currentTarget.children[1].value;

  postNewStory(title).then(newStory => {
    let body = {
      content: newPostContent,
      story_id: newStory.id
    }
    postNewPost(body)
      .then(newPost => renderZoomPost(newPost))
  })
}

function renderStory(story){
  //add story div
  let storyDiv = document.createElement('div');
  storyDiv.classList.add(`story-div-${story.id}`);
  document.querySelector('.story-container').appendChild(storyDiv)

  // add image
  let img = document.createElement('img')
  img.classList.add("story-image");
  img.src = story.doodle.img_url;
  img.dataset.postId = story.posts.filter(post => {
    return post.prev_post_id === null})[0].id
  storyDiv.appendChild(img);

  //add story title
  let title = document.createElement('h4');
  title.innerText = story.title;
  storyDiv.appendChild(title);

  //add story content
  // let opening = document.createElement('p');
  // opening.innerText = `${story.posts[0].content}...`;
  // storyDiv.appendChild(opening);
  document.querySelector(`.story-div-${story.id}`).addEventListener('click', firstPostListener)
}

function firstPostListener(){

  let postId = event.currentTarget.querySelector("img").dataset.postId
  fetchPost(postId)
  .then(post => {
    renderZoomPost(post)
  })
}

function renderZoomPost(post){
  document.querySelector('.story-container').innerHTML = "";
  let zoomStory = document.createElement('div');
  zoomStory.classList.add('center-screen', 'zoom-story');
  document.querySelector('.story-container').appendChild(zoomStory)

  //add image
  let zoom_image = document.createElement('img');
  zoom_image.src = post.doodle.img_url
  zoomStory.appendChild(zoom_image);

  //add first line
  let opening = document.createElement('p');
  opening.innerText = post.content + "..."
  zoomStory.appendChild(opening);

  createButtons(post)
}

function createButtons(post){

  let storySelector = document.querySelector(".zoom-story");

  if (post.prev_post_id){
    let backButton = document.createElement('button');
    backButton.innerText = "previous page";

    backButton.dataset.storyId = post.story.id;
    backButton.dataset.previousPostId = post.prev_post_id;
    backButton.dataset.nextPostId = post.id;
    storySelector.appendChild(backButton)
    backButton.addEventListener('click', previousPage)
  };

  if (post.next_post_ids === null) {
    let createNewPostButton = document.createElement('button');
    createNewPostButton.innerText = "Create New Post";
    createNewPostButton.dataset.storyId = post.story.id;
    createNewPostButton.dataset.previousPostId = post.id;
    createNewPostButton.dataset.nextPostIds = post.next_post_ids;
    storySelector.appendChild(createNewPostButton)
    createNewPostButton.addEventListener('click', newPost)

  } else {

    let next_post_array = post.next_post_ids.slice(1, -1).split(", ").map(num => parseInt(num));

    if (next_post_array.length < 3){
      let createNewPostButton = document.createElement('button');
      createNewPostButton.innerText = "Create New Post";
      createNewPostButton.dataset.storyId = post.story.id;
      createNewPostButton.dataset.previousPostId = post.id;
      createNewPostButton.dataset.nextPostIds = post.next_post_ids;
      storySelector.appendChild(createNewPostButton)
      createNewPostButton.addEventListener('click', newPost)

      next_post_array.forEach(function(postId) {
        fetchPost(postId)
        .then(function(post){
          let forwardButton = document.createElement('button');
          forwardButton.innerText = post.content;
          forwardButton.dataset.storyId = post.story.id;
          forwardButton.dataset.previousPostId = post.prev_post_id;
          forwardButton.dataset.currentPostId = post.id;
          storySelector.appendChild(forwardButton)
          forwardButton.addEventListener('click', nextPage)
        })
      })

    } else {
      next_post_array.forEach(function(postId) {
        fetchPost(postId)
        .then(function(post){
          let forwardButton = document.createElement('button');
          forwardButton.innerText = post.content;
          forwardButton.dataset.storyId = post.story.id;
          forwardButton.dataset.previousPostId = post.prev_post_id;
          forwardButton.dataset.currentPostId = post.id;
          storySelector.appendChild(forwardButton)
          forwardButton.addEventListener('click', nextPage)
        })
      })
    }
  }
  }

function nextPage(){
  fetchPost(event.currentTarget.dataset.currentPostId)
    .then(post => renderZoomPost(post))
}


function previousPage(){
  let postId = parseInt(event.currentTarget.dataset.previousPostId);

  fetchPost(postId).then(post => renderZoomPost(post))
}


function newPost(){
  let storyId = event.currentTarget.dataset.storyId;
  let previousPostId  = event.currentTarget.dataset.previousPostId;
  let nextPostIds = event.currentTarget.dataset.nextPostIds;

  let container = document.querySelector('.story-container')
  container.innerHTML = "";

  let form = document.createElement('form');
  form.classList.add("center-screen")
  let contentInput = document.createElement('input');
  contentInput.placeholder = "Continue story"
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

function submitNewPost(event){
  event.preventDefault()
  let input = event.currentTarget.children[0].value;
  let storyId = +event.currentTarget.children[1].dataset.storyId;
  let previousPostId = +event.currentTarget.children[1].dataset.previousPostId;
  let nextPostIds = event.currentTarget.children[1].dataset.nextPostIds;

  let body = {content: input, prev_post_id: previousPostId, story_id: storyId}

  postNewPost(body)
  .then(newPost => {
    renderZoomPost(newPost);
    patchOldPost(previousPostId, newPost.id, nextPostIds)
  })

}
