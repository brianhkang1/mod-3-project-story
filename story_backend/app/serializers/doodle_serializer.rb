class DoodleSerializer < ActiveModel::Serializer
  attributes :id, :img_url
  has_many :stories
  has_many :posts
end
