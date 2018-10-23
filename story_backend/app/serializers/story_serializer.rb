class StorySerializer < ActiveModel::Serializer
  attributes :id, :title, :img_url
  has_many :posts
end
