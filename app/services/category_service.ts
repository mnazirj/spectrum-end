import Category from "#models/category";

interface categroyPayload { title?: string, arName?: string, description?: string, arDescription?: string }
export class CategoryService {

  static async getAllCategories(): Promise<Category[]> {
    const cateogries = await Category.query().select('id', 'title', 'arName', 'description', 'arDescription')
    return cateogries
  }

  static async create(payload: categroyPayload): Promise<{ success: boolean, message: string }> {
    const record = await Category.findBy('title', payload.title)
    if (record) return { success: false, message: 'Cannot create existing category' }
    try {
      await Category.create({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
      return { success: true, message: 'Successfully created new category !' }
    }
    catch {
      return { success: false, message: 'Faild to create new category' }
    }
  }

  static async update(id: number, payload: categroyPayload): Promise<{ success: boolean, message: string }> {
    const record = await Category.find(id)
    if (!record) return { success: false, message: 'Could not found category with given id' }
    record.merge({ ...payload, slug: payload.title?.replaceAll(' ', '_').toLocaleLowerCase() })
    await record.save()
    return { success: true, message: 'Successfully modified category !' }
  }

  static async destroy(id: number): Promise<{ success: boolean, message: string }> {
    const record = await Category.find(id)
    if (!record) return { success: false, message: 'Could not found category with given id' }
    await record.delete()
    return { success: true, message: 'Successfully deleted category !' }
  }
}