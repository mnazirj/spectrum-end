import PromoCode from "#models/promo_code";
import { promoCodesPayload } from "@/types/index.js";
import { DateTime } from "luxon";

export class PromoService {

  static async index(): Promise<PromoCode[]> {
    const codes = await PromoCode.query()
    return codes;
  }

  static async create(payload: promoCodesPayload) {
    const code = await PromoCode.create(payload)
    if (code) return { success: true, message: "Successfully created new code" }
    return { success: false, message: 'Something went wrong!' }
  }

  static async check(code: string) {
    const record = await PromoCode.query()
      .where('code', code).where('capacity', '>', 0).where('expired_at', '>', DateTime.utc().toSQL()).first()
    if (record) return { vaild: true, value: record.value }
    return { vaild: false, value: 0 }
  }

  static async useCode(code: string) {
    const record = await PromoCode.findBy('code', code);
    if (!record) return;
    await record.capacity--;
    await record.save();
  }

  static async destroy(codeId: number): Promise<{ success: boolean, message: string }> {
    const code = await PromoCode.find(codeId)
    if (!code) return { success: false, message: 'Code not found!' }
    await code.delete()
    return { success: true, message: 'Successfully deleted code' }
  }
}