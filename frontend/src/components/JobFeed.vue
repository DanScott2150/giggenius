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

    <v-data-table
			v-model:expanded="expanded"
			:headers="jobTableHeaders"
			:items="currentJobFeed"
			item-value="title"
			show-expand
			class="elevation-1"
			:sort-by="[{ key: 'pubDate', order: 'asc' }]"
			>

			<!-- Modal Popup for row deletion confirmation -->
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>All Saved Jobs</v-toolbar-title>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
								<v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>

			<template v-slot:item.actions="{ item }">
				<v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
			</template>

			<template v-slot:expanded-row="{ columns, item }">
				<tr>
					<td :colspan="columns.length">
						<JobData
							:guid="item.guid"
							:title="item.title"
							:link="item.url"
							:description="item.description"
							:budget="item.budget"
							:pubDate="item.pubDate"
							:analysis="item.aiAnalysis"
							:id="item.id"
        		/>
					</td>
				</tr>
			</template>

		</v-data-table>

  </div>

</template>

<script setup>
import axios from 'axios';
import { useJobFeedStore } from '../store';
import { ref, computed, watch } from 'vue';
import JobData from './JobData.vue';

// Setup connection to Firebase Realtime Database
import { useDatabase } from 'vuefire'
import { useDatabaseList } from 'vuefire';
import { ref as dbRef, push, get, remove, query, limitToLast, orderByChild, onValue } from 'firebase/database';

const jobFeedStore = useJobFeedStore();
const currentJobFeed = computed(() => jobFeedStore.currentJobFeed);

// Check if currentJobFeed is empty. If so, fetch the 10 most recent jobs from firebase.
if (currentJobFeed.value.length === 0) {
  const db = useDatabase();
  const jobsRef = dbRef(db, 'users/u1/jobs');
  const recentJobsQuery = query(jobsRef, orderByChild('timestamp'), limitToLast(10));

  // Save jobs to vue store so we're not re-fetching them every time
  onValue(recentJobsQuery, snapshot => {
    const jobsArray = [];
    snapshot.forEach(childSnapshot => {
      const jobData = childSnapshot.val();
      const jobId = childSnapshot.key;
      jobData.id = jobId;
      jobsArray.push(jobData);
    });

    jobFeedStore.currentJobFeed = jobsArray;
  });
}

// Modal Popup for row deletion confirmation
const toDelete = ref({});
const expanded = ref([]);
const dialogDelete = ref(false);

const jobTableHeaders = ref([
  { title: '', key: 'data-table-expand' },
  { title: 'Job Title', align: 'start', sortable: false, key: 'title' },
  { title: 'Budget', key: 'budget' },
  { title: 'Post Date', key: 'pubDate' },
  { title: '', key: 'actions', sortable: false },
]);

watch(dialogDelete, (val) => {
  val || closeDelete();
});

const deleteItem = function(item) {
  toDelete.value = item;
  dialogDelete.value = true;
}

const deleteItemConfirm = function() {
  let jobRef = dbRef(db, `users/u1/jobs/${toDelete.value.id}`);
  remove(jobRef);
  closeDelete()
}

const closeDelete = function() {
  dialogDelete.value = false
}

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
