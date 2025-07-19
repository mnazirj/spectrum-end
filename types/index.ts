
export interface subItemsPayload {
    title?: string,
    arName?: string,
    subCategoryId?: number,
}
export interface propretiesPayload {
    id?: number
    productId?: number,
    type?: string,
    value?: string,
    price?: number
}
export interface productPayload {
    name?: string,
    arName?: string,
    description?: string,
    arDescription?: string,
    ingredients?: string,
    arIngredients?: string,
    tips?: string,
    arTips?: string
    notes?: string,
    arNotes?: string,
    quantity?: number,
    price?: number,
    discount?: number,
    gender?: string,
    exclusive?: boolean,
    brandId?: number,
    categoryId?: number,
    subCategoryId?: number,
    itemsId?: number
    hasProprety?: boolean,
}



export interface orderItemsPayload {
    productId: number,
    quantity: number
    size?: string,
    color?: string,

}
export type OrderItemsPayload = orderItemsPayload[]

export interface subCategroyPaylaod { title?: string, arName?: string, categoryId?: number }//Changed to categoryId in front-end

export type OrderStatus = 'Pending' | 'Shipped' | 'Refunded'

export interface acconutPayload {
    email?: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    password?: string
}

export interface addressPayload {
    firstName?: string,
    lastName?: string,
    country?: string,
    phone?: string,
    address?: string,
    additional_address?: string,
    city?: string,
    area?: string,
    primary?: boolean,
}

export interface reviewPayload {
    title: string,
    content: string,
    stars: number
}

export interface returnedPaymentGateway {
    result: string,
    amount: number,
    store_id: string,
    our_ref: string,
    payment_method: string,
    customer_phone: string,
    custom_ref: string
}

export interface promoCodesPayload {
    code: string,
    value: number,
    capacity: number,
    expiredAt: Date,
}

