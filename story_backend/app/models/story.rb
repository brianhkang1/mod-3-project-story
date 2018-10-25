class Story < ApplicationRecord
  has_many :posts
  belongs_to :doodle
  validates :title, presence: true
  validates :doodle_id, presence: true
end
