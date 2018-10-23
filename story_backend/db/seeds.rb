# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Story.create(title: "Goldilocks", img_url: "./doodles/girl.svg")
Story.create(title: "Peter Pan", img_url: "./doodles/boy.svg")

Post.create(story_id: 1, content: "There once was a girl", next_post_ids: "[2, 3]")
Post.create(story_id: 1, content: "She went to the woods", prev_post_id: 1)
Post.create(story_id: 1, content: "She hates bears", prev_post_id: 1)

Post.create(story_id:2, content: "There was once a flying boy")
