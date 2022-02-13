class CreateCreateMacros < ActiveRecord::Migration[6.1]
  def change
    create_table :create_macros do |t|

      t.timestamps
    end
  end
end
