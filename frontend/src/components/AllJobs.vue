<template>

	<header class="page-header">
	  <h2>All Jobs</h2>
	</header>

	<div style="margin-top:30px">

		<p>All jobs that have been fetched & saved from Upwork via your Job Feed.</p>

		<v-divider></v-divider>

		<div>
			<p>RSS URL: (url)</p>
			<p>Last Updated: (date)</p>
			<v-btn @click="fetchUpworkJobs">Fetch Fresh Upwork Jobs</v-btn>
    	</div>

		<v-divider></v-divider>

		<v-alert
			v-if="alertInfo.isVisible"
			type="success"
			closable
			@click="alertInfo.isVisible = false"
			style="margin-top:30px"
			class="px-5"
			>
			{{ alertInfo.message }}
		</v-alert>

		<JobDataTable
			:items="dbJobs"
			>
		</JobDataTable>

	</div>

</template>

<script setup>

import axios from 'axios';
import { ref } from 'vue';

// Setup connection to Firebase Realtime Database
import { ref as dbRef, get, push, getDatabase, update } from 'firebase/database';
import { useDatabase, useDatabaseList } from 'vuefire'
import { useJobFeedStore } from '@/stores/jobFeedStore';

import JobDataTable from './JobDataTable.vue';
import { useProposalStore } from '@/stores/proposalStore';

const alertInfo = ref({
	isVisible: false,
	message: ""
});

const jobFeed = useJobFeedStore();

const db = useDatabase();
const dbJobs = useDatabaseList(dbRef(db, 'users/u1/jobs' ));

/**
 * On user click, fetch the most recent 10 listings on upwork (via RSS)
 * And then add them to the current job feed (state)
 *
 */
 async function fetchUpworkJobs(){

	// Empty out existing currentJobFeed store
	jobFeed.currentJobFeed = [];

	const response = await axios.get('http://127.0.0.1:5000/fetch-upwork-jobs-rss');

	return new Promise((resolve, reject) => {

		try{
			const data = response.data;

			data.forEach((async (job) => {

			// convert date to more readable format
			const date = new Date(job.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

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

			jobFeed.addJobToCurrentJobFeed(jobInfo);

			// In addition to adding to currentFeed store, push job to firebase db for user
			const newJobId = await addJobForUser('u1', jobInfo );
			// alert(newJobId);
			generateAnalysis(newJobId, jobInfo);

			}));

			alertInfo.value.isVisible = true;
			alertInfo.value.message = `Jobs fetched successfully! Jobs fetched: ${data.length} `;

			resolve();

		} catch (error){
			console.error("Error fetching: ", error);
			reject(error);
		}
	})
}

/**
 * Add a job to firebase db for a given user. Should probably happen at store-level instead of in component
 */
async function addJobForUser(userId, newJob) {

	// const db = useDatabase();

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
	const newJobId = push(jobRef, newJob);

	console.log("new job ID:" + newJobId);

	return newJobId.key;

}

const generateAnalysis = async (id, job) => {

	const proposalStore = useProposalStore();
	const aboutMeText   = proposalStore.aboutMeText;
	// console.log(aboutMeText);

  console.log("analysis running...");
  console.log(job);
  console.log(aboutMeText);

  const url = "http://127.0.0.1:5000/generate-analysis";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobText: job.description,
        aboutMeText: aboutMeText,
        guid: job.guid
      })
    } );

    const data = await response.json();
    console.log(data);

    const analysis = data["match_summary"] || "Error generating output.";
    const match = data["match_decision"] || "";

    // Update DB with analysis
    const db    = getDatabase();
    const jobID = id;
    console.log(jobID);


    // Send new value to firebase database using update()
    update(dbRef(db, `users/u1/jobs/${jobID}`), {
      "aiAnalysis/summary": analysis,
      "aiAnalysis/decision": match
    })
    .then(() => {
      console.log("Data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating data: ", error);
    });

  } catch (error) {

    console.error(error);
    // analysis.value = "There was an error generating the analysis. Please try again.";
    // match.value = "";

  } finally {
    // isLoading.value = false;
  }
}

</script>
