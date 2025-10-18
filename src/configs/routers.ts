import HOME from '../pages/home.jsx';
import ORDER from '../pages/order.jsx';
import PROFILE from '../pages/profile.jsx';
import ORDERDETAIL from '../pages/orderDetail.jsx';
import AFTERSALE from '../pages/afterSale.jsx';
import ORDER_NEW from '../pages/order-new.jsx';
import PRODUCT_DETAIL from '../pages/product-detail.jsx';
import CHECKOUT from '../pages/checkout.jsx';
import ADDRESS from '../pages/address.jsx';
import ADDRESSFORM from '../pages/addressForm.jsx';
import AFTERSALEDETAIL from '../pages/afterSaleDetail.jsx';
import CART from '../pages/cart.jsx';
import ABOUT from '../pages/about.jsx';
import PROFILEEDIT from '../pages/profileEdit.jsx';
import GET_USER from '../pages/get_user.jsx';
export const routers = [{
  id: "home",
  component: HOME
}, {
  id: "order",
  component: ORDER
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "orderDetail",
  component: ORDERDETAIL
}, {
  id: "afterSale",
  component: AFTERSALE
}, {
  id: "order-new",
  component: ORDER_NEW
}, {
  id: "product-detail",
  component: PRODUCT_DETAIL
}, {
  id: "checkout",
  component: CHECKOUT
}, {
  id: "address",
  component: ADDRESS
}, {
  id: "addressForm",
  component: ADDRESSFORM
}, {
  id: "afterSaleDetail",
  component: AFTERSALEDETAIL
}, {
  id: "cart",
  component: CART
}, {
  id: "about",
  component: ABOUT
}, {
  id: "profileEdit",
  component: PROFILEEDIT
}, {
  id: "get_user",
  component: GET_USER
}]