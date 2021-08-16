import pingDocs from './ping';
import restaurantDocs from './restaurant';
import customerDocs from './customer';

export default { ...pingDocs, ...restaurantDocs, ...customerDocs };
