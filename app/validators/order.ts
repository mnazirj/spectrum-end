import vine from '@vinejs/vine'

export const createNewOrder = vine.compile(
    vine.array(
        vine.object({
            productId: vine.number(),
            quantity: vine.number(),
            size: vine.string().optional(),
            color: vine.string().optional(),
        })
    )
)