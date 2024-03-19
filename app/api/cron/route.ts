import Product from '@/lib/models/product.model'
import { connectToDB } from '@/lib/mongoose'

export async function GET() {
  try {
    connectToDB()

    const product = await Product.find({})
    if (!product) throw new Error('No product found')
  } catch (error) {
    throw new Error(`Error in GET: ${error}`)
  }
}
