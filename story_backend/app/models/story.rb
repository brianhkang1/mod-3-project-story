class Story < ApplicationRecord
  has_many :posts
  belongs_to :doodle
end
