/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { normalize, sep } from 'path'
import AuthController from '#controllers/auth_controller'
import InformationController from '#controllers/information_controller'
import CategoriesController from '#controllers/categories_controller'
import SubCategoriesController from '#controllers/sub_categories_controller'
import SubCategoryItemsController from '#controllers/sub_category_items_controller'
import BrandsController from '#controllers/brands_controller'
import ProductsController from '#controllers/products_controller'
import OrdersController from '#controllers/orders_controller'
import Brand from '#models/brand'
import ReivewsController from '#controllers/reivews_controller'
import PromosController from '#controllers/promos_controller'
import { PaymentService } from '#services/payment_service'


router
  .group(() => {
    router
      .group(() => {
        router.post('signin', [AuthController, 'CheckUser'])
        router.post('signup', [AuthController, 'NewAccount'])
        router.post('forgetpassword', [AuthController, 'forgetPassword'])
        router.post('reset-password', [AuthController, 'resetPassword'])
        router.post('getUser', [AuthController, 'getUser'])
        router.post('logout', [AuthController, 'logOut'])
      })
      .prefix('auth')

    router
      .group(() => {
        router
          .group(() => {
            router.get('category', [CategoriesController, 'index'])
            router.get('subcategory', [SubCategoriesController, 'index'])
            router.get('subitems', [SubCategoryItemsController, 'index'])
            router.get('brand', [BrandsController, 'index'])
            router.get('product', [ProductsController, 'index'])
            router.get('order', [OrdersController, 'index'])
            router.get('codes', [PromosController, 'index'])
          })
          .prefix('list')

        router
          .group(() => {
            router.post('category', [CategoriesController, 'create'])
            router.post('subcategory', [SubCategoriesController, 'create'])
            router.post('subitems', [SubCategoryItemsController, 'create'])
            router.post('brand', [BrandsController, 'create'])
            router.post('product', [ProductsController, 'create'])
            router.post('codes', [PromosController, 'create'])
          })
          .prefix('new')

        router
          .group(() => {
            router.put('category/:id', [CategoriesController, 'update'])
            router.put('subcategory/:id', [SubCategoriesController, 'update'])
            router.put('subitems/:id', [SubCategoryItemsController, 'update'])
            router.put('brand/:id', [BrandsController, 'update'])
            router.put('product/:id', [ProductsController, 'update'])
            router.put('order/:id', [OrdersController, 'updateOrderStatus'])
          })
          .prefix('modify')

        router
          .group(() => {
            router.delete('category/:id', [CategoriesController, 'destroy'])
            router.delete('subcategory/:id', [SubCategoriesController, 'destroy'])
            router.delete('subitems/:id', [SubCategoryItemsController, 'destroy'])
            router.delete('brand/:id', [BrandsController, 'destroy'])
            router.delete('product/:id', [ProductsController, 'destroy'])
            router.delete('order/:id', [OrdersController, 'deleteOrder'])
            router.delete('code/:id', [PromosController, 'deleteCode'])
          })
          .prefix('delete')
      })
      .prefix('control')
      .middleware(middleware.isAdmin())

    router
      .group(() => {
        router.get('projects', [InformationController, 'homePageInfo'])
        router.get('product/:slug', [ProductsController, 'getProductBySlug'])
        router.get('getProducts/:type/:slug', [InformationController, 'test'])
        router.get('getNewProduct', [InformationController, 'fetchNewProduct'])
      })
      .prefix('homepage')

    router
      .group(() => {
        router.get('myorders', [OrdersController, 'getOrdersByClient'])
        router.get('account', [InformationController, 'getAccountDetails'])
        router.put('updateInfo', [InformationController, 'updateAcconut'])
        router.post('createaddress', [InformationController, 'newAddress'])
        router.delete('deleteAddress/:id', [InformationController, 'destroy'])
        router.post('review/:slug', [ReivewsController, 'createReview'])
        router.post('code', [PromosController, 'checkCode'])
        router.post('order', [OrdersController, 'createOrder'])

      })
      .prefix('client')

    router.get('/group', async ({ response }) => {
      const brands = await Brand.query().orderBy('title', 'asc')

      // Step 1: Group into a dictionary first
      const grouped = brands.reduce((acc, brand) => {
        const firstLetter = brand.title.charAt(0).toUpperCase()

        // Only group A-Z letters
        const groupKey = firstLetter.match(/[A-Z]/) ? firstLetter : '#'

        if (!acc[groupKey]) {
          acc[groupKey] = []
        }

        acc[groupKey].push(brand.title)
        return acc
      }, {} as Record<string, string[]>)

      // Step 2: Convert to desired array format
      const result = Object.keys(grouped)
        .sort() // optional: sort A-Z
        .map((key) => ({
          group: key,
          list: grouped[key],
        }))

      return response.ok(result)
    })
  }).prefix('/api/')

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/
router.get('/images/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed Path')
  }

  const absoultePath = app.makePath('storage/products/images', normalizedPath)
  return response.download(absoultePath)
})

// router.get('/co', async ({ response }) => {
//   const items = [{
//     productId: 56,
//     quantity: 3,
//     color: 'Kiss'
//   },
//   {
//     productId: 56,
//     quantity: 2,
//     color: 'Remix'
//   }
//   ]
//   const record = await OrderService.create(1, 'Testing', items)
//   return response.ok(record)
// })

router.post('/registerpayment', [OrdersController, 'registerPayment'])

router.get('/payment', async ({ response }) => {
  const payment = await PaymentService.initPaymentGateway(2, 250)
  return response.ok(payment)
})










