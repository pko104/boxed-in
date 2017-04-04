class ItemsImage < ActiveRecord::Migration[5.0]
  def change
    add_column :items, :image_url, :string
  end
end
