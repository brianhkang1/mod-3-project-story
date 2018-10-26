Dir.foreach("../story_frontend/doodles") do |doodle|
  next if (doodle == '.' || doodle == '..')
  Doodle.create(img_url: "./doodles/"+"#{doodle}")
end

Story.create(title: "Goldilocks", doodle_id: 3)
Post.create(story_id: 1, content: "There once was a girl", next_post_ids: "[2]", doodle_id: 3)
Post.create(story_id: 1, content: "She went to the woods", prev_post_id: 1, doodle_id: 27)

Story.create(title: "Peter Pan", doodle_id: 33)
Post.create(story_id: 2, content: "There was once a flying boy", doodle_id: 33)

Story.create(title: "Real Men Cry: An Autobiography of John Cena", doodle_id: 56)
Post.create(story_id: 3, content: "You can't see me", doodle_id: 56)

Story.create(title: "Doggo the dawg", doodle_id: 24)
Post.create(story_id: 4, content: "It was the eve of 1870", doodle_id: 24)

Story.create(title: "I scream", doodle_id: 45)
Post.create(story_id: 5, content: "I like ice cream. The end", doodle_id: 45)

Story.create(title: "A Tale of Two Tandem Bike Riders", doodle_id: 9)
Post.create(story_id: 6, content: "It was the best of times, it was the worst of times", doodle_id: 9)

Story.create(title: "Fright Club", doodle_id: 37)
Post.create(story_id: 7, content: "The first rule of Fright Club is: You do NOT talk about Fright Club", doodle_id: 37)

Story.create(title: "Rude girls", doodle_id: 14)
Post.create(story_id: 8, content: "Get in loser. We're going shopping", doodle_id: 14)

Story.create(title: "Sk8ter Boi", doodle_id: 20)
Post.create(story_id: 9, content: "He was a boy", doodle_id: 33, next_post_ids: "[11]")
Post.create(story_id: 9, content: "She was a girl", doodle_id: 3, prev_post_id: 10, next_post_ids: "[12]")
Post.create(story_id: 9, content: "Can I make it anymore obvious", doodle_id: 18, prev_post_id: 11)

Story.create(title: "Jebron Lames", doodle_id: 31)
Post.create(story_id: 10, content: "The restless King made his Decision: it was time to take his talents to the West Coast", doodle_id: 31)

Story.create(title: "Game of Groans", doodle_id: 6)
Post.create(story_id: 11, content: "AUGH... why does everyone die in this book", doodle_id: 6)

Story.create(title: "Shower muses", doodle_id: 25)
Post.create(story_id: 12, content: "What happens when we die?", doodle_id: 25)

Story.create(title: "Birdman", doodle_id: 32)
Post.create(story_id: 13, content: "This was no ordinary electric scooter. This little fella had big plans for the world", doodle_id: 32)
