<template>

  <header class="page-header">
    <h2>Job Feed</h2>
  </header>

  <div style="display:flex">
    <button class="btn btn-primary" @click="fetchUpworkJobs">Fetch Upwork Jobs</button>
    <button class="btn btn-primary" @click="fetchUpworkJobs">Analyze Listings</button>
  </div>

  <hr/>

  <JobItem
    v-for="job in dbJobs"
    :key="job.guid"
    :guid="job.guid"
    :title="job.title"
    :link="job.link"
    :description="job.description"
    :pubDate="job.pubDate"
    :id="job.id"
  />

</template>

<script setup>
import axios from 'axios';
import JobItem from './JobItem.vue';
// import { useJobFeedStore } from '../store';
// import { ref } from 'vue';


// Setup connection to Firebase Realtime Database
import { useDatabase } from 'vuefire'
import { useDatabaseList } from 'vuefire';
import { ref as dbRef, push, get, query } from 'firebase/database';

const db = useDatabase();
const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs'));

// Fetch jobs from Upwork RSS feed and add them to our global 'state'
async function fetchUpworkJobs__old() {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = 'https://www.upwork.com/ab/feed/jobs/rss?api_params=1&contractor_tier=1,2,3&hourly_rate=50-&job_type=hourly,fixed&orgUid=872559107033931777&paging=0;5&q=wordpress&securityToken=de56b8790f403c07196293547743d7d0aa964c95b1ad8dbba549fb823dfdbf2ef9ca3f6cb441593ab02952d74ecd8bc19ccf63dd5173aea09e263182b98f2c55&sort=recency&userUid=742862918896668672&user_location_match=1';

  try {
    const response = await axios.get(proxyUrl + targetUrl);
    const data = new window.DOMParser().parseFromString(response.data, 'text/xml');
    const items = [...data.querySelectorAll('item')];

    items.forEach((job => {
      const guid = new URL(job.querySelector('guid').textContent);

      const jobInfo = {
        guid: encodeURIComponent(guid.pathname),
        aiAnalysis: {
          decision: "n/a",
          summary: "n/a"
        },
        budget: "TBD",
        description: job.querySelector('title').textContent,
        feedback: {},
        title: job.querySelector('title').textContent,
        url: job.querySelector('link').textContent,
        pubDate: job.querySelector('pubDate').textContent
      }

      addJobForUser('u1', jobInfo )

    }))

  } catch (error) {
    console.error('Error fetching the jobs:', error);
  }

}

async function fetchUpworkJobs(){
  try{
    const response = await axios.get('http://127.0.0.1:5000/fetch-upwork-jobs-rss')
    const data = response.data;

    data.forEach((job => {
      // const guid = new URL(job.querySelector('guid').textContent);

      const jobInfo = {
        guid: encodeURIComponent(job.guid),
        aiAnalysis: {
          decision: "n/a",
          summary: "n/a"
        },
        budget: "TBD",
        description: job.description,
        feedback: {},
        title: job.title,
        url: encodeURIComponent(job.url),
        pubDate: job.pubDate
      }

      addJobForUser('u1', jobInfo )

    }))

  } catch (error){
    console.error("Error fetching: ", error);
  }
}

async function addJobForUser(userId, newJob) {

  console.log("maybe add");

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
