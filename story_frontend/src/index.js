document.addEventListener("DOMContentLoaded", function(){
  fetchStories();
})

function fetchStories(){
  fetch(`http://localhost:3000/api/v1/stories`).
  then(res => res.json()).
  then(data => {
    data.forEach(renderStory)
  })
}

function renderStory(story){
  let storyDiv = document.createElement('div');
  storyDiv.classList.add(`story-div-${story.id}`);

  document.querySelector('.story-container').appendChild(storyDiv)

  let title = document.createElement('h2');
  title.innerText = story.title;
  storyDiv.appendChild(title);

  let opening = document.createElement('p');
  opening.id = story.posts[0].id;
  opening.innerText = `${story.posts[0].content}...`;
  storyDiv.appendChild(opening);

  storyDiv.addEventListener('click', storyHandler)
}

function storyHandler(){
  // zoom animation
  let storyId = event.currentTarget.className.split("-")[2];
  let postId = event.currentTarget.querySelector('p').id;

  document.querySelector('.story-container').innerHTML = "";
  let zoomStory = document.createElement('div');
  zoomStory.classList.add('zoom-story');
  document.querySelector('.story-container').appendChild(zoomStory)

  let title = document.createElement('h2');
  title.innerText = event.currentTarget.querySelector('h2').innerText
  zoomStory.appendChild(title);

  let opening = document.createElement('p');
  opening.innerText = event.currentTarget.querySelector('p').innerText
  zoomStory.appendChild(opening);

  let forwardButton = document.createElement('button');
  forwardButton.innerText = "next page";
  forwardButton.dataset.storyId = storyId;
  forwardButton.dataset.previousPostId = postId;
  zoomStory.appendChild(forwardButton)
  forwardButton.addEventListener('click', nextPage)

  let backButton = document.createElement('button');
  backButton.innerText = "previous page";

  backButton.dataset.storyId = storyId;
  backButton.dataset.nextPostId = postId;
  zoomStory.appendChild(backButton)
  backButton.addEventListener('click', previousPage)
}

function nextPage(){
  debugger
}

function previousPage(){

}
