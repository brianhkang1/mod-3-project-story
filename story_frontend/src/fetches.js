function fetchAllStories(){
  return fetch(`http://localhost:3000/api/v1/stories`).
  then(res => res.json())
}

function fetchPost(postId){
  return fetch(`http://localhost:3000/api/v1/posts/${postId}`)
  .then(res => res.json())
}

function postNewPost(body){
  return fetch('http://localhost:3000/api/v1/posts/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => {
    return res.json()
  })
}

function postNewStory(title){

  return fetch('http://localhost:3000/api/v1/stories/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      title: title
    })
  }).then(res => {
    return res.json()})
}

function patchOldPost(postId, newPostId, nextPostIds){
  if (nextPostIds === "null"){

    body = {next_post_ids: `[${newPostId}]`}
  } else {

    var nextPostIds = nextPostIds.slice(1, -1).split(", ").map(num => parseInt(num))
    nextPostIds.push(newPostId)

    body = {next_post_ids: `[${nextPostIds}]`}
  }


  return fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
    method: "PATCH",

    headers: {
      "Content-Type" : "application/json"
    },

    body: JSON.stringify(body)
  })
}
