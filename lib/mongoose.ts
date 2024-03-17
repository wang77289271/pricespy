import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strict', true)
  if (!process.env.MONGODB_URI) return console.log('MONGODB_RUI is not defind')

  if (isConnected) return console.log('=>using existing database connection')

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log('MongoDB is Connected')
  } catch (error) {
    console.log(error)
  }
}
