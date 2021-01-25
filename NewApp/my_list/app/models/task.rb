class Task < ApplicationRecord
    validates :title, presence: true
    # validates :details, presence: true
    has_and_belongs_to_many :tags
end
