class AddRelationTagsTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tags_tasks, id: false do |t|
      t.belongs_to :tag
      t.belongs_to :task
    end
  end
end

