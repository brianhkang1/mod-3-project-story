class PostSerializer < ActiveModel::Serializer
  attributes :id, :content, :prev_post_id, :next_post_ids
  belongs_to :story
end
