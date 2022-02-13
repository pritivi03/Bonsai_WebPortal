class AddStripeIdToAccounts < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :stripe_id, :string
  end
end
