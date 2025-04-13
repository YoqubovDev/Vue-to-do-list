import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import {createApp} from "vue";
import App from "./App.vue";

// Configure vue-toastification options
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
};

const app = createApp(App)
app.use(Toast, toastOptions)
app.mount("#app")
