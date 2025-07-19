import Product from "#models/product";
import Review from "#models/review";
import { reviewPayload } from "@/types/index.js";

export class ReviewService {

  static async create(payload: reviewPayload, userId: number, productSlug: string): Promise<{ success: boolean, message: string }> {
    try {
      const product = await Product.findBy('slug', productSlug)
      if (!product) return { success: false, message: 'Cannot find product!' }
      const review = await Review.query().where('userId', userId).where('productId', product.id).first()
      if (review) return { success: false, message: "You already reviewed this product" }
      await Review.create({
        title: payload.title,
        content: payload.content,
        stars: payload.stars,
        productId: product.id,
        userId
      })
      return { success: true, message: "Thanks for reivewing product !" }
    }
    catch (err) {
      return { success: false, message: "Faild to create review" }
    }
  }
}