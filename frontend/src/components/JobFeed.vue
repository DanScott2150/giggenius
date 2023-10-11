<template>

  <header class="page-header">
    <h2>Job Feed</h2>
  </header>

  <v-divider></v-divider>

  <div style="margin-top:30px">

    <div>
      <p>RSS URL: (url)</p>
      <p>Last Updated: (date)</p>
      <v-btn>Click to Refresh</v-btn>
    </div>

    <br/>
    <v-divider></v-divider>


  <div style="display:flex">
    <v-btn @click="fetchUpworkJobs">Fetch Upwork Jobs</v-btn>
    <!-- <v-btn @click="fetchUpworkJobs">Analyze Listings</v-btn> -->
  </div>
  <v-expansion-panels multiple>
    <v-expansion-panel
      color="light-green"
      v-for="job in currentJobFeed"
      :title="job.title"
      :key="job.guid"
    >
      <v-expansion-panel-text>
        <JobItem
          :guid="job.guid"
          :title="job.title"
          :link="job.link"
          :description="job.description"
          :pubDate="job.pubDate"
          :id="job.id"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>

  </v-expansion-panels>

  </div>

</template>

<script setup>
import axios from 'axios';
import JobItem from './JobItem.vue';
import { useJobFeedStore } from '../store';
import { ref, computed } from 'vue';


// Setup connection to Firebase Realtime Database
import { useDatabase } from 'vuefire'
import { useDatabaseList } from 'vuefire';
import { ref as dbRef, push, get, query } from 'firebase/database';

const db = useDatabase();
const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs'));


const jobFeedStore = useJobFeedStore();
const currentJobFeed = computed(() => jobFeedStore.currentJobFeed);
// const currentJobFeed = ref(jobFeedStore.currentJobFeed);

console.log(currentJobFeed.value);

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
        pubDate: job.pubDate
      }

      jobFeedStore.addJobToCurrentJobFeed(jobInfo);

      // Push new job to currentJobFeed store
      // currentJobFeed.value.push(jobInfo);

      addJobForUser('u1', jobInfo )

    }))

  } catch (error){
    console.error("Error fetching: ", error);
  }
}

async function addJobForUser(userId, newJob) {

  const jobRef = dbRef(db, `users/${userId}/jobs`);
  const snapshot = await get(jobRef);

  console.log(snapshot.val());

  // Check if any job has the same guid as the new job
  const existingJobs = snapshot.val() || {};

  for (let jobId in existingJobs) {
      if (existingJobs[jobId].guid === newJob.guid) {
          console.log("Job with this GUID already exists!");
          console.log(newJob.guid);
          return; // Exit the function if a matching GUID is found
      }
  }

  console.log("guid does not exist, let's add it");
  console.log(newJob.guid);
  push(jobRef, newJob);

}

</script>
