import vine from '@vinejs/vine'

export const createNewCodes = vine.compile(
    vine.object({
        code: vine.string(),
        value: vine.number(),
        capacity: vine.number(),
        expiredAt: vine.date(),
    })
)
