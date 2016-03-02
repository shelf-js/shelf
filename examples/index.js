// Schema 1 and 3 will share the same DB connection
// Schema 2 will use another DB connection

const MySchema = require('./schema')
const MySchema2 = require('./schema2')
const MySchema3 = require('./schema3')

const myModel = MySchema({prop1: 'Hello'})
const myModel2 = MySchema2({prop1: 'Hello2'})
const myModel3 = MySchema3({prop1: 'Hello3'})

myModel.save()

myModel2.save()

myModel3.save()
