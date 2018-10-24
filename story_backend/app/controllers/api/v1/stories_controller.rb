class Api::V1::StoriesController < ApplicationController

  before_action :find_story, only: [:show]

  def index
    @stories = Story.all
    render json: @stories
  end

  def show
    render json: @story
  end

  def create
    render json: Story.create(story_params)
  end

  private

  def story_params
    params.require(:story).permit(:title, :doodle_id)
  end

  def find_story
    @story = Story.find(params[:id])
  end

end
