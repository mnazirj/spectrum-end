import Gateway from "#models/gateway";
import { returnedPaymentGateway } from "@/types/index.js";
import axios from "axios";
import { OrderService } from "./order_service.js";
import db from "@adonisjs/lucid/services/db";

export class PaymentService {
  static BASE_URL = 'https://c7drkx2ege.execute-api.eu-west-2.amazonaws.com'
  static async initPaymentGateway(orderId: number, amount: number) {
    const response = await axios.post(`${this.BASE_URL}/payment/initiate`, {
      id: 'k3zaEwBeDnVG2agJQE05YrK7kPo6myZNnyZq9dw3zXjb4AeLRNMOlBxW15RNGmJL',
      amount: amount,
      phone: '0913632323',
      email: 'mohammed.nzer11@gmail.com',
      backend_url: 'http://publicws.spectrum.e-ibtikar.com/registerpayment',
      frontend_url: 'localhost:8080/home',
      custom_ref: 'order:' + orderId
    }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: 'Bearer StmJs5j5EAt3fRZYJakK4i3xJtzL8NHmLRfG8mjA',
      }
    }).catch((err) => {

      return err.response
    })

    return response.data.url
  }

  static async store(payload: returnedPaymentGateway) {
    const trx = await db.transaction()
    const status = await Gateway.create(payload, { client: trx })
    if (!status) return { success: false, message: 'Faild to save payment' }
    const orderId = payload.custom_ref.split(':')[1]
    const updateStatus = await OrderService.setOrderPayment(parseInt(orderId), payload.payment_method)
    if (!updateStatus.success) return { success: false, message: 'Faild to save payment' }
    trx.commit()
    return { success: true, message: 'Successfully saved payment' }
  }
}