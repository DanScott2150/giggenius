import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';

import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase';

import App from './App.vue'
import JobFeed from './components/JobFeed.vue';
import GenerateProposal from './components/GenerateProposal.vue';

const app = createApp(App)

app.use(VueFire, { firebaseApp });

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
