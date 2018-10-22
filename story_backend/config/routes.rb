Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :stories, only: [:index, :show, :create]
      resources :posts, only: [:index, :show, :create, :update]
        end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
