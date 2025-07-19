import Brand from "#models/brand";

interface BrandPayload {
  title: string
  arName: string
}

export class BrandService {
  static async getAllBrands(): Promise<Brand[]> {
    return await Brand.query();
  }

  static async create(payload: BrandPayload): Promise<{ success: boolean, message: string }> {
    try {
      await Brand.create({ ...payload, slug: payload.title.replaceAll(' ', '_').toLocaleLowerCase() })
      return { success: true, message: 'Successfully created new brand!' }
    }
    catch {
      return { success: false, message: 'Sorry brand already exsit!' }
    }
  }

  static async update(id: number, payload: BrandPayload): Promise<{ success: boolean, message: string }> {
    const record = await Brand.find(id)
    if (!record) return { success: false, message: 'Could not find record with given id' }
    record.merge({ ...payload, slug: payload.title.replaceAll(' ', '_').toLocaleLowerCase() })
    await record.save()

    return { success: true, message: 'Successfully changed brand!' }
  }

  static async destroy(id: number): Promise<{ success: boolean, message: string }> {
    const record = await Brand.find(id)
    if (!record) return { success: false, message: 'Could not found record with given id!' }
    await record.delete()
    return { success: true, message: 'Successfully deleted brand!' }
  }
}