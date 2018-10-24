class Api::V1::DoodlesController < ApplicationController
  def index
    render json: Doodle.all
  end

  def show
    render json: Doodle.find(params[:id])
  end
end
