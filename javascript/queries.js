// The id contains a timestamp, so sorting by id will sort by when they were entered to the database.
db.news.find().sort({_id:1})
db.news.find().sort({_id:-1})

// 2. Show them how to sort by an integer - numlegs:
db.news.find().sort({numlegs:1})
db.news.find().sort({numlegs:-1})


// 3. Show them how to sort by a string - class:
db.news.find().sort({class:1})
db.news.find().sort({class:-1})
