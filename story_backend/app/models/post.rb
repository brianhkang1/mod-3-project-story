class Post < ApplicationRecord
  belongs_to :story
  belongs_to :doodle
  validates :content, presence: true
  validates :doodle_id, presence: true
end
