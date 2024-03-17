'use server'

import Product from '../models/product.model'
import { connectToDB } from '../mongoose'
import { scrapeAmazonProduct } from '../scraper'
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils'
import { revalidatePath } from 'next/cache'

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return
  try {
    connectToDB()
    const scrapeProduct = await scrapeAmazonProduct(productUrl)

    if (!scrapeProduct) return
    let product = scrapeProduct
    const existingProduct = await Product.findOne({ url: scrapeProduct.url })

    if (existingProduct) {
      const updatePriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapeProduct.currentPrice },
      ]

      product = {
        ...scrapeProduct,
        priceHistory: updatePriceHistory,
        lowestPrice: getLowestPrice(updatePriceHistory),
        highestPrice: getHighestPrice(updatePriceHistory),
        averagePrice: getAveragePrice(updatePriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapeProduct.url },
      product,
      { upsert: true, new: true }
    )

    revalidatePath(`/products/${newProduct._id}`)
  } catch (error: any) {
    throw new Error(`Faild to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: String) {
  try {
    connectToDB()
    const product = await Product.findOne({ _id: productId })
    if (!product) return null

    return product
  } catch (error) {
    console.log(error)
  }
}
