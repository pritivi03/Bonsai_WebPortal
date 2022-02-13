class CreateMacros < ActiveRecord::Migration[6.1]
  def change
    create_table :macros do |t|
      t.string :name
      t.timestamps
    end
  end
end
