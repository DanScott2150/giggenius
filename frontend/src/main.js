import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';

// Firebase
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';

// Vuetify UI
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/VDataTable';
import 'vuetify/dist/vuetify.min.css';

// Top-level (page) components
import App from './App.vue'
import JobFeed from './components/JobFeed.vue';
import AllJobs from './components/AllJobs.vue';
import GenerateProposal from './components/GenerateProposal.vue';
import SettingsPage from './components/SettingsPage.vue';

const app = createApp(App)

app.use(VueFire, { firebaseApp });

// VDataTable is via Vuetify Labs, not included by default. Need to import it manually.
const vuetify = createVuetify({
    components: {
        ...components,
        VDataTable,
      },
    directives,
});


app.use( vuetify );

const routes = [
    { path: '/generate-proposal', component: GenerateProposal, name: 'Generate Proposal' },
    { path: '/all-jobs', component: AllJobs, name: 'All Jobs' },
    { path: '/settings', component: SettingsPage, name: 'Settings' },
    { path: '/', component: JobFeed, name: 'Job Feed' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.use(createPinia());
app.use(router);

app.mount('#app')
