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
      "Content-Type" : "application/json"
    },

    body: JSON.stringify(body)
  }).then(res => res.json())
}

function patchOldPost(postId, newPostId, newPostIds){
  debugger


  return fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
    method: "PATCH",

    headers: {
      "Content-Type" : "application/json"
    },

    body: JSON.stringify({
      // next_post_ids: +=
    })
  })
}
