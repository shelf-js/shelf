const MySchema = require('./schema')

const myModel = MySchema({prop1: 'Hello'})

myModel.save()

myModel.del()
