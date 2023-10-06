import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';

// Firebase
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';

// Vuetify UI
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/dist/vuetify.min.css';

// Top-level components
import App from './App.vue'
import JobFeed from './components/JobFeed.vue';
import GenerateProposal from './components/GenerateProposal.vue';

const app = createApp(App)

app.use(VueFire, { firebaseApp });

const vuetify = createVuetify({
    components,
    directives,
});

app.use( vuetify );

const routes = [
    { path: '/generate-proposal', component: GenerateProposal, name: 'Generate Proposal' },
    { path: '/', component: JobFeed, name: 'Job Feed' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.use(createPinia());
app.use(router);

app.mount('#app')
