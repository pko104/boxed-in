class ItemsController < ApplicationController


def index
  @items = Item.all
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

def item_params
  params.require(:item).permit(:name,:price,:type_of_item,:image_url)
end


end
