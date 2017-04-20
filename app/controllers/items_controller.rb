class ItemsController < ApplicationController

skip_before_action :verify_authenticity_token
require 'open-uri'


def index
  @items = Item.all()
end

def new
  @item = Item.new
end

def create
  @item = Item.new(item_params)

  if @item.save
    redirect_to new_item_url
  else
    render :new
  end
end

def item_sorted

  @choice = params[:sort_type].gsub! /"/, ''

  if @choice == 'Food' || @choice == 'Supplies'
    @items = Item.where(type_of_item:@choice)
  elsif @choice == 'Price'
    @items = Item.order(price: :desc)
  else
    @items = Item.order(name: :asc)
  end


  respond_to do |format|
    format.js
    format.html
  end

end


def sort_type
   @choice = params[:sort_type]


  if @choice
    render :json => @choice.to_json

  else
    render :json => [{ :error => "An error" }], :status => 304
  end
end

private

def item_params
  params.require(:item).permit(:name,:price,:type_of_item,:image_url,:sort_type)
end


end
