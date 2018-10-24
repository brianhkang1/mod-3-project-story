class Post < ApplicationRecord
  belongs_to :story
  belongs_to :doodle
end
