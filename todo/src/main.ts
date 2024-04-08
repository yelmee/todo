
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

declare namespace NodeJS {
    interface Process {
        env: {
            [key: string]: string | undefined;
        };
    }
}
declare let process: NodeJS.Process;

async function enableMocking() {

    if (process.env.NODE_ENV !== 'development') {
        return
    }

    const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.

    return worker.start()
}

enableMocking().then(() => {
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    app.mount('#app')

})