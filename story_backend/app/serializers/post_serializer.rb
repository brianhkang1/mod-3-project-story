class PostSerializer < ActiveModel::Serializer
  attributes :id, :content, :prev_post_id, :next_post_ids
  belongs_to :story
  belongs_to :doodle
end
