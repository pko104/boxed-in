class Items < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.string :name, null: false
      t.decimal :price,:precision => 8, :scale => 2, null: false
      t.string :type_of_item, null: false
    end
  end
end
