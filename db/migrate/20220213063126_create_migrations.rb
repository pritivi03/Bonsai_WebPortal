class CreateMigrations < ActiveRecord::Migration[6.1]
  def change
    create_table :migrations do |t|
      t.string :CreateMacros

      t.timestamps
    end
  end
end
