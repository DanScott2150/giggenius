<template>

  <header class="page-header">
    <h2>Job Feed</h2>
  </header>

  <p>Your 10 most recent jobs that are deemed to be a strong match</p>

  <br/>
  <v-divider></v-divider>

  <div style="margin-top:30px">

    <div>
      <p>RSS URL: (url)</p>
      <p>Last Updated: (date)</p>
      <v-btn @click="fetchUpworkJobs">Fetch Fresh Upwork Jobs</v-btn>
    </div>

    <br/><br/>
    <v-divider></v-divider>

    <JobDataTable
			v-model:expanded="expanded"
			class="elevation-1"
			item-value="title"
			show-expand
			:headers="jobTableHeaders"
			:items="jobFeedStore.currentJobFeed"
			:sort-by="[{ key: 'pubDate', order: 'asc' }]"
			>
		</JobDataTable>

  </div>

</template>

<script setup>
import axios from 'axios';
import { useJobFeedStore } from '../store';
import { ref, computed, onMounted } from 'vue';
import JobDataTable from './JobDataTable.vue';

// Setup connection to Firebase Realtime Database
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, get, query, limitToLast, orderByChild, onValue } from 'firebase/database';

const jobFeedStore = useJobFeedStore();
const jobFeed = computed(() => jobFeedStore.currentJobFeed);

const db = useDatabase();
const jobsRef = dbRef(db, 'users/u1/jobs');

const expanded = ref([]);

const jobTableHeaders = ref([
  { title: '', key: 'data-table-expand' },
  { title: 'Job Title', align: 'start', sortable: false, key: 'title' },
  { title: 'Match', key: 'aiAnalysis.decision' },
  { title: 'Post Date', key: 'pubDate' },
  { title: '', key: 'actions', sortable: false },
]);


onMounted(async() => {
  console.log("mounted");
  if (jobFeedStore.currentJobFeed.length === 0) {
    console.log("empty");
    await jobFeedStore.populateCurrentJobFeed()
    console.log("JobFeed");
    console.log(jobFeedStore.currentJobFeed);
  }

  console.log(jobFeedStore.currentJobFeed);
});


/**
 * Fetch list of jobs from Upwork RSS feed.
 *
 * List of jobs are saved to currentJobFeed{} and displayed on this page,
 * and then are also saved to our firebaseDB for display on 'All Jobs' page.
 *
 */
async function fetchUpworkJobs(){
  try{
    const response = await axios.get('http://127.0.0.1:5000/fetch-upwork-jobs-rss')
    const data = response.data;

    // Empty out existing currentJobFeed store
    jobFeedStore.updateCurrentJobFeed([]);

    data.forEach((job => {

      // convert date to more readable format
      const date = new Date(job.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

      // @TODO this should probably happen server-side when we fetch the jobs
      const jobInfo = {
        guid: encodeURIComponent(job.guid),
        aiAnalysis: {
          decision: "",
          summary: ""
        },
        budget: job.budget,
        description: job.description,
        feedback: {},
        title: job.title,
        url: encodeURIComponent(job.url),
        pubDate: date
      }

      jobFeedStore.addJobToCurrentJobFeed(jobInfo);

      // In addition to adding to currentFeed store, push job to firebase db for user
      addJobForUser('u1', jobInfo )

    }))

  } catch (error){
    console.error("Error fetching: ", error);
  }
}

/**
 * Add a job to firebase db for a given user.
 */
async function addJobForUser(userId, newJob) {

  const jobRef = dbRef(db, `users/${userId}/jobs`);
  const snapshot = await get(jobRef);

  // Check if any job has the same guid as the new job
  const existingJobs = snapshot.val() || {};

  for (let jobId in existingJobs) {
      if (existingJobs[jobId].guid === newJob.guid) {
          // If this job already exists, don't add it
          return;
      }
  }

  console.log("guid does not exist, let's add it");
  console.log(newJob.guid);
  push(jobRef, newJob);

}

</script>
