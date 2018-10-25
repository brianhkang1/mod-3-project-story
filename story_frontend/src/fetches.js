function fetchAllStories(){
  return fetch(`http://localhost:3000/api/v1/stories`).
  then(res => res.json())
}

function fetchPost(postId){
  return fetch(`http://localhost:3000/api/v1/posts/${postId}`)
  .then(res => res.json())
}

function fetchPlayStory(i){
  fetchPost(i)
  .then(post => {
    let newDiv = document.createElement('div')
    newDiv.classList.add("slideshowPost")
    let image = document.createElement('img');
    image.src = post.doodle.img_url;
    image.classList.add('final')
    newDiv.appendChild(image)
    document.querySelector("#playStoryDiv").appendChild(newDiv);

    if (post.next_post_ids === null){
      let content = document.createElement('p')
      content.innerText = post.content+".";
      content.classList.add('final')
      newDiv.appendChild(content)
      document.querySelector("#playStoryDiv").appendChild(newDiv);

      let theEnd = document.createElement('p');
      theEnd.classList.add("final")
      theEnd.id = "the-end"
      theEnd.innerText = "\n\nthe end."
      newDiv.appendChild(theEnd)
      document.querySelector("#playStoryDiv").appendChild(newDiv)

    }
    else {
      let content = document.createElement('p')
      content.innerText = post.content+"...";
      content.classList.add('final')
      newDiv.appendChild(content)
      document.querySelector("#playStoryDiv").appendChild(newDiv);

    }
    }
  )
}


function postNewPost(body){
  return fetch('http://localhost:3000/api/v1/posts/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json())
}

function postNewStory(title, doodle_id){
  return fetch('http://localhost:3000/api/v1/stories/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      title: title,
      doodle_id: doodle_id
    })
  }).then(res => {
    return res.json()})
}

function patchOldPost(postId, newPostId, nextPostIds){
  if (nextPostIds === "null"){
    body = {next_post_ids: `[${newPostId}]`}
  } else {
    var nextPostIds = nextPostIds.slice(1, -1).split(",").map(num => parseInt(num))
    nextPostIds.push(newPostId)

    body = {next_post_ids: `[${nextPostIds}]`}
  }

  return fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
    method: "PATCH",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(body)
  })
}

function fetchAllDoodles(){
  return fetch(`http://localhost:3000/api/v1/doodles`)
    .then(res => res.json())
}
