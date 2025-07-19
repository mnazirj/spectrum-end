import { OrderService } from '#services/order_service';
import { PaymentService } from '#services/payment_service';
import { createNewOrder } from '#validators/order';
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {

    async index({ response }: HttpContext): Promise<void> {
        const orders = await OrderService.getAllOrders()
        return response.ok(orders);
    }

    async createOrder({ auth, request, response }: HttpContext): Promise<void> {
        const user = await auth.authenticate()
        if (!user) return response.unauthorized({ message: 'Please log in before' })
        const payload = await createNewOrder.validate(request.input('items'))
        const code = request.input('code')
        const status = await OrderService.create(user.id, 'Pending', payload, code)
        if (!status) return response.badRequest({ message: 'Faild to create order' })
        const paymentURL = await PaymentService.initPaymentGateway(status.id, status.total)
        return response.created({ message: 'Created !', order: status, gateway: paymentURL })
    }

    async getOrdersByClient({ auth, response }: HttpContext): Promise<void> {
        const user = await auth.authenticate()
        const orders = await OrderService.getUserOrder(user.id)
        return response.ok(orders);
    }

    async updateOrderStatus({ request, response }: HttpContext): Promise<void> {
        const orderId = request.params().id
        const payload = request.only(['status'])
        const status = await OrderService.updateOrderStatus(orderId, payload.status)
        if (!status.success) return response.badRequest({ message: status.message });
        return response.ok({ message: status.message })
    }

    async registerPayment({ request, response }: HttpContext) {
        const payload = request.only(['result', 'amount', 'store_id', 'our_ref', 'payment_method', 'customer_phone', 'custom_ref'])
        const status = await PaymentService.store(payload)
        if (!status.success) return response.badRequest({ message: status.message })
        return response.ok({ message: status.message })
    }

    async deleteOrder({ request, response }: HttpContext): Promise<void> {
        const orderId = request.params().id
        const status = await OrderService.destroy(orderId)
        if (!status.success) return response.badRequest({ message: status.message });
        return response.ok({ message: status.message })
    }
}