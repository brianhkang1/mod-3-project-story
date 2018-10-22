class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    create_table :posts do |t|
      t.integer :story_id
      t.string :content
      t.integer :prev_post_id, :default => nil
      t.string :next_post_ids
      t.timestamps
    end
  end
end
