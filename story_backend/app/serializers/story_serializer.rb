class StorySerializer < ActiveModel::Serializer
  attributes :id, :title
  has_many :posts
  belongs_to :doodle
end
