import vine from '@vinejs/vine'

export const createNewReview = vine.compile(
    vine.object({
        title: vine.string(),
        content: vine.string(),
        stars: vine.number(),
    })
)