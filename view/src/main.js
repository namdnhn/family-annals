import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//import components
import BaseDialog from "./components/ui/BaseDialog.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import BaseList from "./components/ui/BaseList.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
    faArrowDown,
    faArrowRight,
    faArrowRightFromBracket,
    faArrowUp,
    faChevronDown,
    faCircleInfo,
    faFilter,
    faMagnifyingGlass,
    faUserSecret,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
    faUserSecret,
    faCircleInfo,
    faArrowRight,
    faArrowRightFromBracket,
    faChevronDown,
    faFilter,
    faMagnifyingGlass,
    faArrowUp,
    faArrowDown,
    faXmark
);

const app = createApp(App);
app.use(router);
app.use(store);

//use fontawesome
app.component("font-awesome-icon", FontAwesomeIcon);

//use component
app.component("BaseDialog", BaseDialog);
app.component("BaseSpinner", BaseSpinner);
app.component("BaseList", BaseList);

app.mount("#app");
