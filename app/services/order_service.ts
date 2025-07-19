import Order from "#models/order";
import OrderItem from "#models/order_item";
import Product from "#models/product";
import { OrderItemsPayload, OrderStatus } from "@/types/index.js";
import db from "@adonisjs/lucid/services/db";
import { PromoService } from "./promo_service.js";

export class OrderService {
  static #formatData(payload: Order[]): {} {
    return payload.map((order: Order) => ({
      id: order.id,
      first_name: order.user.firstName,
      last_name: order.user.lastName,
      address: order.user.address,
      product: this.#formatProducts(order.products),
      status: order.status,
      method: order.paymentMethod,
      total: order.total,
      date: order.createdAt,
    }))

  }

  static #formatProducts(products: Product[]): any[] {
    return products.map((p: Product) => {
      const matchedProp = p.propreties?.find(
        (prop) => p.$extras?.pivot_size === prop.value
      );

      return {
        name: p.name,
        arName: p.arName,
        brand: p.brand?.title ?? '',
        qty: p.$extras?.pivot_quantity ?? 0,
        price: matchedProp?.price ?? p.price,
        size: p.$extras?.pivot_size ?? '',
        images: p.images?.[0]?.image ?? '',
      };
    });
  }

  static async getAllOrders(): Promise<{}> {
    const orders = await Order.query()
      .preload('user', (q) => q.preload('address'))
      .preload('products', (q) => q.preload('images').preload('brand').preload('propreties'))
    return this.#formatData(orders)
  }

  static async getUserOrder(id: number) {
    const orders = await Order.query().where('userId', id)
      .preload('user', (q) => q.preload('address'))
      .preload('products', (q) => q.preload('images').preload('brand'))


    return this.#formatData(orders)
  }

  static async create(userId: number, status: string, items: OrderItemsPayload, code?: string) {
    let trx = await db.transaction()
    const order = await Order.create({ userId, status }, { client: trx })
    var sum = 0
    for (var item of items) {
      const product = await (await Product.query().where('id', item.productId).preload('propreties')).pop()
      if (!product) return;
      if (item.size) {//calculating price based if product sized or not
        for (var prop of product.propreties) {
          if (prop.value == item.size) {
            sum += prop.price * item.quantity
          }

        }
      }
      else if (item.color) {
        for (var prop of product.propreties) {
          if (prop.value == item.color) {
            sum += prop.price * item.quantity
          }
        }
      }
      else {
        sum += product.price * item.quantity
      }
      //Creating item manually to avoid productId duplication drop due to product size
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size ? item.size : item.color
      }, { client: trx })
    }
    //Handle Discount if found
    if (code) {
      const status = await PromoService.check(code)
      if (status.vaild) {
        sum = sum - ((sum * status.value) / 100)
      }
      await PromoService.useCode(code)
    }
    order.total = sum
    order.paymentMethod = 'NOT SET YET'
    await order.save()

    // Commit transaction
    await trx.commit()
    return order
  }

  static async updateOrderStatus(orderId: number, status: OrderStatus): Promise<{ success: boolean, message: string }> {
    const record = await Order.find(orderId)
    if (!record) return { success: false, message: "Cannot find order!" };
    record.status = status
    await record.save()
    return { success: true, message: "Successfully updated order!" }
  }

  static async setOrderPayment(orderId: number, method: string) {
    const record = await Order.find(orderId)
    if (!record) return { success: false, message: 'Cannot find order!' }
    record.paymentMethod = method
    await record.save()
    return { success: true, message: 'Successfully updated order' }
  }

  static async destroy(orderId: number): Promise<{ success: boolean, message: string }> {
    const record = await Order.find(orderId)
    if (!record) return { success: false, message: "Cannot find order!" };
    await record.delete()
    return { success: true, message: "Successfully deleted order!" }

  }

}