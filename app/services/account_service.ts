import Address from "#models/address";
import User from "#models/user";
import { createNewAddress, updateUserAccount } from "#validators/account";
import { acconutPayload, addressPayload } from "@/types/index.js";

export class AccountService {
  // Your code here

  static async update(paylaod: acconutPayload, user: User): Promise<{ success: boolean, message: string }> {
    try {
      const data = await updateUserAccount.validate(paylaod)
      user.merge(data)
      await user.save()
      return { success: true, message: "Updated!" }
    }
    catch {
      return { success: false, message: "Faild to update user!" }

    }
  }

  static async createAddress(user: User, payload: addressPayload) {
    try {
      const data = await createNewAddress.validate(payload)
      if (data.primary) {
        await user.related('address').query().where('primary', 1).update({ primary: 0 })
      }
      await user.related('address').create(data)
      return { success: true, message: 'Successfully added new address!' }
    }
    catch (err) {
      return { success: false, message: "Faild to create new address" }
    }
  }

  static async deleteAddress(userId: number, addressId: number) {
    try {
      const address = await Address.find(addressId)
      if (!address) return { success: false, message: 'Cannot find address!' }
      if (address.userId != userId) return { success: false, message: "Faild to delete address" }
      await address.delete()
      return { success: true, message: 'Successfully deleted address' }
    }
    catch (err) {
      return { success: false, message: err }
    }
  }
}