import restaurantDocs from './restaurant';
import customerDocs from './customer';
import adminDocs from './admin';
import orderDocs from './order';

export default { ...adminDocs, ...restaurantDocs, ...customerDocs, ...orderDocs };
