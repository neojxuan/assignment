Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'tags/create'
      get 'tags/index'
      get 'tags/show'
      get 'tag/edit/:id', to: 'tags#edit'
      put 'tags/update/:id', to: 'tags#update'
      delete 'tags/delete/:id', to: 'tags#destroy'
    end
  end
  namespace :api do
    namespace :v1 do
      get 'tasks/index'
      post 'tasks/create'
      get '/show/:id', to: 'tasks#show'
      get '/edit/:id', to: 'tasks#edit'
      put 'tasks/update/:id', to: 'tasks#update'
      delete 'tasks/delete/:id', to: 'tasks#destroy'
      post 'tasks/search', to: 'tasks#search'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
