import { errorHandler } from 'middlewares';
import { PingRouter, AdminRouter, CustomerRouter, RestaurantRouter, OrderRouter } from 'routers';

export default function registerRouters(app) {
	app.use('/admin', AdminRouter);
	app.use('/customer', CustomerRouter);
	app.use('/restaurant', RestaurantRouter);
	app.use('/order', OrderRouter);
	app.use('/ping', PingRouter);

	app.use(errorHandler);
}
