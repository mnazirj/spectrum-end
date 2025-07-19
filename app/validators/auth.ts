import vine from '@vinejs/vine'

/**
 * Validates the register's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(2),
    lastName: vine.string().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

/**
 * Validates the login's action
 */
export const userLoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)
