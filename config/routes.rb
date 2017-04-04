Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root :to => 'items#index'

  resources :items, only: [:index, :create, :new] do
    collection do
      post 'sort_type'
      get 'item_sorted'
    end
  end

end
