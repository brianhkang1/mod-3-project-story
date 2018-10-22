class Api::V1::PostsController < ApplicationController

  before_action :find_post, only: [:show, :update]

  def index
    @posts = Post.all
    render json: @posts
  end

  def show
    render json: @post
  end

  def create
    render json: Post.create(post_params)
  end

  def update
    if @post.save
      @post.update(post_params)
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessible_entity
    end
  end

  private

  def post_params
    params.require(:post).permit(:content, :prev_post_id, :next_post_ids, :story_id)
  end

  def find_post
    @post = Post.find(params[:id])
  end

end
