import vine from '@vinejs/vine'

export const updateUserAccount = vine.compile(
    vine.object({
        firstName: vine.string().minLength(2).optional(),
        lastName: vine.string().minLength(2).optional(),
        email: vine.string().email().optional(),
        password: vine.string().minLength(8).maxLength(32).optional(),
    })
)

export const createNewAddress = vine.compile(
    vine.object({
        firstName: vine.string().minLength(2),
        lastName: vine.string().minLength(2),
        country: vine.string(),
        phone: vine.string(),
        address: vine.string(),
        additional_address: vine.string(),
        city: vine.string(),
        area: vine.string(),
        primary: vine.boolean().optional(),
    })
)