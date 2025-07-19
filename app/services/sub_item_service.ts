import SubCategory from "#models/sub_category";
import ItemSubCategories from "#models/sub_category_item";
import { subItemsPayload } from "@/types/index.js";

export class SubItemService {
  static async getAllSubItems(): Promise<ItemSubCategories[]> {
    const items = await ItemSubCategories.query().preload('sub_categories')
    return items
  }

  static async create(payload: subItemsPayload): Promise<{ success: boolean, message: string }> {
    try {
      const subCategroy = await SubCategory.find(payload.subCategoryId)
      if (!subCategroy) return { success: false, message: 'Could not found sub category with given id!' }
      await ItemSubCategories.create({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
      return { success: true, message: 'Successfully created new item' }
    }
    catch {
      return { success: false, message: 'Something went wrong! please call the developer' }
    }
  }

  static async update(id: number, payload: subItemsPayload): Promise<{ success: boolean, message: string }> {
    try {
      const record = await ItemSubCategories.find(id)
      if (!record) return { success: false, message: 'Could not found item with given id' }
      record.merge({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
      await record.save()
      return { success: true, message: 'Successfully modfied the item!' }
    }
    catch {
      return { success: false, message: 'Something went wrong! please call the developer' }
    }
  }

  static async destroy(id: number): Promise<{ success: boolean, message: string }> {
    try {
      const record = await ItemSubCategories.find(id)
      if (!record) return { success: false, message: 'Could not found item with given id' }
      await record.delete()
      return { success: true, message: 'Successfully deleted  item!' }
    }
    catch {
      return { success: false, message: 'Something went wrong! please call the developer' }

    }
  }
}