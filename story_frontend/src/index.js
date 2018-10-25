document.addEventListener("DOMContentLoaded", function(){
  renderStories();
})

function renderStories(){
  //clear the screen, render the new-story-button, fetch all stories, and render each story
  document.querySelector('.story-container').innerHTML = ""
  let button  = document.getElementById('new-story-button');

  if (button !== null) {
    document.querySelector('.custom-header').removeChild(document.getElementById('new-story-button'))
  }
  renderNewStoryButton();
  fetchAllStories().then(data => {
    data.forEach(renderStory)
  })
}

function renderNewStoryButton(){
  //first create div
  let newDiv = document.createElement("div")
  newDiv.id = "new-story-button"

  //add button to create new story inside div
  let newStoryButton = document.createElement('img');
  newStoryButton.src = "./doodles/writing.svg";
  newStoryButton.addEventListener('click', newStoryHandler)
  newDiv.appendChild(newStoryButton);
  document.querySelector(".custom-header").appendChild(newDiv)

  let spanElement = document.createElement("span")
  spanElement.innerText = "Begin New Story"
  newDiv.appendChild(spanElement)

}

function newStoryHandler(){
  let container = document.querySelector('.story-container')
  container.innerHTML = "";

  //create general form
  let form = document.createElement('form');
  form.classList.add("center-screen")

  //add story title input field
  let titleInput = document.createElement('input');
  titleInput.placeholder = "title"
  form.appendChild(titleInput);

  //add story's first post input field
  let firstPostInput = document.createElement('input');
  firstPostInput.placeholder = "begin your story"
  form.appendChild(firstPostInput);

  //add story + first post's doodle field
  let imgInput = document.createElement('button');
  imgInput.innerText = "click to add image";
  imgInput.classList.add("page-button")
  imgInput.addEventListener('click', renderImageOptions)
  form.appendChild(imgInput);

  //add submit field
  let submit = document.createElement('input');
  submit.type = "submit";
  submit.classList.add("page-button")
  form.appendChild(submit);
  form.addEventListener('submit', newStoryListener)
  container.appendChild(form);
}

function renderImageOptions(e){
  e.preventDefault()
  e.stopPropagation()

  //remove doodle-container if previously rendered
  if (document.querySelector(".doodle-container")){
    document.querySelector(".doodle-container").remove()
  }

  //create doodle container and PREPEND it to form
  let doodleContainer = document.createElement("div")
  doodleContainer.classList.add("doodle-container")
  document.querySelector("form").prepend(doodleContainer)

  //fetch and show all doodles
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
  //when we click on a doodle, get its doodle id and set it as part of the dataset of the general form
  document.querySelector("form").dataset.doodleId = parseInt(e.currentTarget.dataset.doodleId)
  e.preventDefault()
  e.stopPropagation()
}

function newStoryListener(e){
  e.preventDefault();
  e.stopPropagation();

  //get story title, doodleId and story's first post to use as body when we POST to story and post
  let title = event.currentTarget.children[1].value;
  let newPostContent = event.currentTarget.children[2].value;
  let doodle_id = document.querySelector("form").dataset.doodleId

  //after we POST to story API, we then POST to post API. After that we render the new post
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
  let img = document.createElement('img')
  storyDiv.classList.add(`story-div-${story.id}`);
  document.querySelector('.story-container').appendChild(storyDiv)
  storyDiv.addEventListener("mouseover", function(){
    img.style.width = "75px"
    img.style.height = "75px"
  })
  storyDiv.addEventListener("mouseout", function(){
    img.style.width = "90px"
    img.style.height = "90px"
  })


  // add image
  img.classList.add("story-image");
  img.src = story.doodle.img_url;
  img.dataset.postId = story.posts.filter(post => {
    return post.prev_post_id === null})[0].id
  storyDiv.appendChild(img);

  //add story title
  let title = document.createElement('h4');
  title.innerText = story.title;
  storyDiv.appendChild(title);

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
  //clear screen and create div element
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
  opening.innerText = post.content
  zoomStory.appendChild(opening);

  //create previous, new post, and forward buttons
  createButtons(post)
}

function createButtons(post){
  let storySelector = document.querySelector(".zoom-story");

  //if this post has a previous post id, then show a PREVIOUS BUTTON
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

  //if this post doesn't have next-post-id's, then create a new post buton
  if (post.next_post_ids === null) {
    let createNewPostButton = document.createElement('button');
    createNewPostButton.innerText = "write what happens next";
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
    //get the next-post-id's and put them in an array
    let next_post_array = post.next_post_ids.slice(1, -1).split(",").map(num => parseInt(num));

    //if there are less than three posts branching off have both new post button and each post branching off:
    if (next_post_array.length < 3){
      let createNewPostButton = document.createElement('button');
      createNewPostButton.innerText = "write what happens next";
      createNewPostButton.classList.add('new-post-button', 'page-button')
      createNewPostButton.dataset.storyId = post.story.id;
      createNewPostButton.dataset.previousPostId = post.id;
      createNewPostButton.dataset.nextPostIds = post.next_post_ids;
      storySelector.appendChild(createNewPostButton)
      createNewPostButton.addEventListener('click', newPost)

      //for each post branching off, create a button
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
      //if there are more than three posts branching off, then only show the next posts, DON'T have new post button
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

//when the next post is clicked, then fetch that post and render it
function nextPage(){
  fetchPost(event.currentTarget.dataset.currentPostId)
    .then(post => renderZoomPost(post))
}

//when a previous post is clicked, then fetch that post and render it
function previousPage(){
  let postId = parseInt(event.currentTarget.dataset.previousPostId);
  fetchPost(postId).then(post => renderZoomPost(post))
}


function newPost(){
  //clear screen, show form to create a new post
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

function submitNewPost(e){
  //when we click on submit new post, get necessary info, POST new post, and PATCH old post (it's nextPostId)
  e.preventDefault()
  e.stopPropagation()

  let content = event.currentTarget.children[1].value;
  let storyId = +event.currentTarget.children[3].dataset.storyId;
  let previousPostId = +event.currentTarget.children[3].dataset.previousPostId;
  let nextPostIds = event.currentTarget.children[3].dataset.nextPostIds;
  let doodleId = +event.currentTarget.dataset.doodleId;

  let body = {content: content, prev_post_id: previousPostId, story_id: storyId, doodle_id: doodleId}

  postNewPost(body)
  .then(newPost => {
    renderZoomPost(newPost)
    patchOldPost(previousPostId, newPost.id, nextPostIds)
  })
}

// let storyIdOrder;

function theEnd(){
  document.querySelector('.story-container').innerHTML = "";

  let playStoryButton = document.createElement('button');
  playStoryButton.innerText = "play story";
  playStoryButton.id = "play-story"
  playStoryButton.addEventListener('click', playStory)
  document.querySelector('.story-container').appendChild(playStoryButton);

  let lastPostId = parseInt(event.currentTarget.dataset.finalPostId);
  // let penultimatePostId = parseInt(event.currentTarget.dataset.penultimatePostId);

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
}

function playStory(){
// still need to encorporate setInterval....ideally, but idk cuz of fetches
  document.querySelector('.story-container').innerHTML = "";
  let newDiv = document.createElement("div")
  newDiv.id = "playStoryDiv"
  newDiv.classList.add("horizontal-center")
  document.querySelector('.story-container').appendChild(newDiv)
  // setInterval(fetchPlayStory, 2000)
  for (const i in storyIdOrder){
    setTimeout(function(){
      fetchPlayStory(storyIdOrder[i])
    }, i * 2000)
  }

    // fetchPost(storyIdOrder[i])
    //   .then(post => {
    //     postSlideShow(post){
    //     let image = document.createElement('img');
    //     image.src = post.doodle.img_url;
    //     image.classList.add('final')
    //     newDiv.appendChild(image);
    //
    //     let content = document.createElement('p')
    //     content.innerText = post.content;
    //     content.classList.add('final')
    //     newDiv.appendChild(content);
    //
    //     if (post.next_post_ids === null){
    //       let theEnd = document.createElement('p');
    //       theEnd.classList.add("final")
    //       theEnd.id = "the-end"
    //       theEnd.innerText = "the end."
    //       newDiv.appendChild(theEnd)
    //     }
    //   }
    // )
    // }
  }
