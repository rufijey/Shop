// SessionService.js
import orderStore from '../store/OrderStore';
import authStore from "../store/AuthStore";

class Session {
    resetSession() {
        orderStore.resetOrder();
        authStore.resetUser()
    }
}

const session = new session();
export default session;
