require 'csv'

emails = 'email.csv'  

emails = CSV.read(emails, headers: true).by_col['email']               

emails.size
emails.first(10)  


nil_status_ids = Person.where(email: uniq_emails, cached_status: nil).pluck(:id)
cancelled_status_ids = Person.where(email: uniq_emails, cached_status: 'cancelled').pluck(:id)
active_status_ids = Person.where(email: uniq_emails, cached_status: 'active').pluck(:id)


active_count = Person.where(email: uniq_emails, cached_status: 'active').count
cancelled_count = Person.where(email: uniq_emails, cached_status: 'cancelled')

ids = []
cancelled_status_ids.each do |p|
  puts p.main_purchase.id

  ids << p.main_purchase.id
end
