Dir.foreach("../story_frontend/doodles") do |doodle|
  next if (doodle == '.' || doodle == '..')
  Doodle.create(img_url: "./doodles/"+"#{doodle}")
end

Story.create(title: "Goldilocks", doodle_id: 3)
Story.create(title: "Peter Pan", doodle_id: 32)

Post.create(story_id: 1, content: "There once was a girl", next_post_ids: "[2]", doodle_id: 3)
Post.create(story_id: 1, content: "She went to the woods", prev_post_id: 1, doodle_id: 27)
Post.create(story_id: 1, content: "She hates bears", prev_post_id: 54)

Post.create(story_id: 2, content: "There was once a flying boy", doodle_id: 32)
