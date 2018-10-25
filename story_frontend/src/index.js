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

  //remove doodle-container if previously loaded
  if (document.querySelector(".doodle-container")){
    document.querySelector(".doodle-container").remove()
  }

  let doodleContainer = document.createElement("div")
  doodleContainer.classList.add("doodle-container")
  document.querySelector("form").prepend(doodleContainer)

  //fetch all the doodles
  fetchAllDoodles()
    .then(doodles => {
      doodles.forEach(renderDoodle)
    })
}

function renderDoodle(doodle){
  let doodleImg = document.createElement("img")
  let doodleButton = document.createElement('button')
  doodleImg.src = doodle.img_url
  doodleImg.dataset.doodleId = doodle.id
  doodleButton.classList.add("doodle-images");
  doodleButton.appendChild(doodleImg);
  document.querySelector(".doodle-container").appendChild(doodleButton)
  doodleImg.addEventListener("click", doodleHandler)

}

function doodleHandler(e){
  e.preventDefault();


  document.querySelector("form").dataset.doodleId = parseInt(e.currentTarget.dataset.doodleId)

}

function newStoryListener(e){
  e.preventDefault();
  e.stopPropagation();

  let title = event.currentTarget.children[1].value;
  let newPostContent = event.currentTarget.children[2].value;
  let doodle_id = document.querySelector("form").dataset.doodleId

  postNewStory(title, doodle_id).then(newStory => {

    let body = {
      content: newPostContent,
      story_id: newStory.id,
      doodle_id: doodle_id
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
  zoom_image.classList.add("post-image");
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
    backButton.classList.add('page-button')
    backButton.innerText = "previous page";
    backButton.classList.add('back-button')

    backButton.dataset.storyId = post.story.id;
    backButton.dataset.previousPostId = post.prev_post_id;
    backButton.dataset.nextPostId = post.id;
    storySelector.appendChild(backButton)
    backButton.addEventListener('click', previousPage)
  };

  if (post.next_post_ids === null) {
    let createNewPostButton = document.createElement('button');
    createNewPostButton.innerText = "Create New Post";
    createNewPostButton.classList.add('new-post-button', 'page-button');
    createNewPostButton.dataset.storyId = post.story.id;
    createNewPostButton.dataset.previousPostId = post.id;
    createNewPostButton.dataset.nextPostIds = post.next_post_ids;
    storySelector.appendChild(createNewPostButton)
    createNewPostButton.addEventListener('click', newPost)

    let theEndButton = document.createElement('button');
    theEndButton.innerText = "the end.";
    theEndButton.classList.add('page-button');
    theEndButton.dataset.finalPostId = post.id;
    theEndButton.addEventListener('click', theEnd)
    storySelector.appendChild(theEndButton)

  } else {

    let next_post_array = post.next_post_ids.slice(1, -1).split(",").map(num => parseInt(num));

    if (next_post_array.length < 3){

      let createNewPostButton = document.createElement('button');
      createNewPostButton.innerText = "Create New Post";
      createNewPostButton.classList.add('new-post-button', 'page-button')
      createNewPostButton.dataset.storyId = post.story.id;
      createNewPostButton.dataset.previousPostId = post.id;
      createNewPostButton.dataset.nextPostIds = post.next_post_ids;
      storySelector.appendChild(createNewPostButton)
      createNewPostButton.addEventListener('click', newPost)


      next_post_array.forEach(function(postId) {
        fetchPost(postId)
        .then(function(post){
          let forwardButton = document.createElement('button');

          storySelector.appendChild(forwardButton);
          forwardButton.classList.add('page-button')
          forwardButton.innerText = post.content;
          forwardButton.dataset.storyId = post.story.id;
          forwardButton.dataset.previousPostId = post.prev_post_id;
          forwardButton.dataset.currentPostId = post.id;
          forwardButton.addEventListener('click', nextPage)
        })
      })

    } else {

      next_post_array.forEach(function(postId) {
        fetchPost(postId)
        .then(function(post){
          let forwardButton = document.createElement('button');
          forwardButton.classList.add('page-button');

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

  let imgInput = document.createElement('button');
  imgInput.innerText = "click to add image";
  imgInput.classList.add('add-image-button', 'page-button')
  imgInput.addEventListener('click', renderImageOptions)
  form.appendChild(imgInput);


  let submit = document.createElement('input');
  submit.type = "submit";
  submit.classList.add('page-button');
  submit.dataset.storyId = storyId;
  submit.dataset.previousPostId = previousPostId;
  submit.dataset.nextPostIds = nextPostIds;
  form.appendChild(submit);
  form.addEventListener('submit', submitNewPost)

  container.appendChild(form);
}

function submitNewPost(event){

  event.preventDefault()
  let content = event.currentTarget.children[1].value;
  let storyId = +event.currentTarget.children[3].dataset.storyId;
  let previousPostId = +event.currentTarget.children[3].dataset.previousPostId;
  let nextPostIds = event.currentTarget.children[3].dataset.nextPostIds;
  let doodleId = +event.currentTarget.dataset.doodleId;

  let body = {content: content, prev_post_id: previousPostId, story_id: storyId, doodle_id: doodleId}

  postNewPost(body)
  .then(newPost => {
    renderZoomPost(newPost);
    patchOldPost(previousPostId, newPost.id, nextPostIds)
  })
}

let storyIdOrder;

function theEnd(){
  document.querySelector('.story-container').innerHTML = "";

  let playStoryButton = document.createElement('button');
  playStoryButton.innerText = "play story";
  playStoryButton.id = "play-story"
  playStoryButton.addEventListener('click', playStory)
  document.querySelector('.story-container').appendChild(playStoryButton);


  let lastPostId = parseInt(event.currentTarget.dataset.finalPostId);
  let penultimatePostId = parseInt(event.currentTarget.dataset.penultimatePostId);

  storyIdOrder = [];
  return recursivePostFetch(lastPostId)

}


function recursivePostFetch(lastPostId){
  fetchPost(lastPostId).then(post => {
    storyIdOrder.unshift(post.id);
    if (post.prev_post_id !== null){
      recursivePostFetch(post.prev_post_id)
    }
  })
  return storyIdOrder
}

function playStory(){
// still need to encorporate setInterval....ideally, but idk cuz of fetches
  document.querySelector('.story-container').innerHTML = "";

  for (let i = 0; i < storyIdOrder.length; i++){
    fetchPost(storyIdOrder[i]).then(post => {
      let content = document.createElement('p')
      content.innerText = post.content;
      content.classList.add('final-story')
      document.querySelector('.story-container').appendChild(content);

      let image = document.createElement('img');
      image.src = post.doodle.img_url;
      image.classList.add('final-image')
      document.querySelector('.story-container').appendChild(image);
    })
  }
  let theEnd = document.createElement('p');
  theEnd.id = "the-end"
  theEnd.innerText = "the end."
  document.querySelector('.story-container').appendChild(theEnd);

}
