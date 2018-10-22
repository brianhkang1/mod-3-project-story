function fetchAllStories(){
  return fetch(`http://localhost:3000/api/v1/stories`).
  then(res => res.json())
}

function fetchPost(postId){
  return fetch(`http://localhost:3000/api/v1/posts/${postId}`)
  .then(res => res.json())
}
