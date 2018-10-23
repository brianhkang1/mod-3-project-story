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

function patchOldPost(postId, newPostId, nextPostIds){
  if (!nextPostIds){
    body = {next_post_ids: `[${newPostId}]`}
  } else {
    debugger
    nextPostIds
  }

  body = {}

  return fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
    method: "PATCH",

    headers: {
      "Content-Type" : "application/json"
    },

    body: JSON.stringify({
      //START HERE TOMORROW
    })
  })
}
