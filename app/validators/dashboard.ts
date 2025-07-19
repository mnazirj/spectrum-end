import vine from '@vinejs/vine'

//Validator for creating new category
export const createNewCatrgory = vine.compile(
  vine.object({
    title: vine.string(),
    arName: vine.string(),
    description: vine.string(),
    arDescription: vine.string(),
  })
)

//Validator for updating  category
export const updateCategory = vine.compile(
  vine.object({
    title: vine.string().optional(),
    arName: vine.string().optional(),
    description: vine.string().optional(),
    arDescription: vine.string().optional(),
  })
)

//Validator for creating new sub category
export const createNewSubCatrgory = vine.compile(
  vine.object({
    title: vine.string(),
    arName: vine.string(),
    categoryId: vine.number(),
  })
)
//Validator for updating  sub category
export const updateSubCategory = vine.compile(
  vine.object({
    title: vine.string().optional(),
    arName: vine.string().optional(),
    categoryId: vine.number().optional(),
  })
)

//Validator for creating new sub category items
export const createNewSubCatrgoryItem = vine.compile(
  vine.object({
    title: vine.string(),
    arName: vine.string(),
    subCategoryId: vine.number(),
  })
)

//Validator for update  sub category items
export const updateSubCategoryItem = vine.compile(
  vine.object({
    title: vine.string().optional(),
    arName: vine.string().optional(),
    subCategoryId: vine.number().optional(),
  })
)

//Validator for creating new sub category items
export const createNewBrand = vine.compile(
  vine.object({
    title: vine.string(),
    arName: vine.string(),
  })
)

//Validator for creating new sub category items
export const createNewProduct = vine.compile(
  vine.object({
    name: vine.string(),
    arName: vine.string(),
    description: vine.string(),
    arDescription: vine.string(),
    ingredients: vine.string(),
    arIngredients: vine.string(),
    tips: vine.string(),
    arTips: vine.string(),
    notes: vine.string(),
    arNotes: vine.string(),
    quantity: vine.number(),
    price: vine.number().optional(),
    discount: vine.number(),
    brandId: vine.number(),
    categoryId: vine.number(),
    subCategoryId: vine.number(),
    itemsId: vine.number(),
    gender: vine.string().optional(),
  })
)

//Validator for updating product
export const updateProduct = vine.compile(
  vine.object({
    name: vine.string().optional(),
    arName: vine.string().optional(),
    description: vine.string().optional(),
    arDescription: vine.string().optional(),
    ingredients: vine.string().optional(),
    arIngredients: vine.string().optional(),
    tips: vine.string().optional(),
    arTips: vine.string().optional(),
    notes: vine.string().optional(),
    arNotes: vine.string().optional(),
    quantity: vine.number().optional(),
    price: vine.number().optional(),
    discount: vine.number().optional(),
    brandId: vine.number().optional(),
    categoryId: vine.number().optional(),
    subCategoryId: vine.number().optional(),
    itemsId: vine.number().optional(),
    gender: vine.string().optional(),
    hasProprety: vine.boolean().optional(),
  })
)

//Validator for creating new sub category items
export const createNewProductPropreties = vine.compile(
  vine.array(
    vine.object({
      type: vine.string(),
      value: vine.any(),
      price: vine.number(),
    })
  )
)
