import Category from "#models/category";
import SubCategory from "#models/sub_category";
import { subCategroyPaylaod } from "@/types/index.js";
export class SubCategoryService {

  static async getAllSubCategories(): Promise<SubCategory[]> {
    const subCategories = await SubCategory.query().select('id', 'title', 'arName', 'categoryId')
      .preload('category', (q) => q.select('id', 'title', 'arName', 'description', 'arDescription'))

    return subCategories
  }

  static async create(payload: subCategroyPaylaod): Promise<{ success: boolean, message: string }> {
    const record = await SubCategory.findBy('title', payload.title)
    if (record) return { success: false, message: 'Cannot create existing sub category' }
    try {
      const category = await Category.find(payload.categoryId)
      if (!category) return { success: false, message: 'Could not found categroy with given id' }
      await SubCategory.create({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
      return { success: true, message: 'Successfully created new sub category!' }
    }
    catch {
      return { success: false, message: 'Something went wrong plese call the developer!' }
    }
  }

  static async update(id: number, payload: subCategroyPaylaod): Promise<{ success: boolean, message: string }> {
    try {
      const record = await SubCategory.find(id)
      if (!record) return { success: false, message: 'Could not found sub categroy with given id!' }
      record.merge({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
      await record.save()
      return { success: true, message: 'Successfully modified sub categroy!' }
    }
    catch {
      return { success: false, message: 'Something went wrong plese call the developer!' }
    }
  }

  static async destroy(id: number): Promise<{ success: boolean, message: string }> {
    try {
      const record = await SubCategory.find(id)
      if (!record) return { success: false, message: 'Could not found sub categroy with given id!' }
      await record.delete()
      return { success: true, message: 'Successfully deleted sub category' }
    }
    catch {
      return { success: false, message: 'Something went wrong please call the developer!' }
    }
  }
}