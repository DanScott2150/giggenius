import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { getDatabase, ref as dbRef, get, query, limitToLast, orderByChild } from "firebase/database";


export const useJobFeedStore = defineStore('jobFeed', () => {

  const currentJobFeed = reactive([]);

  function addJobToCurrentJobFeed(newJob){
    this.currentJobFeed.push(newJob);
  }

  async function populateCurrentJobFeed() {

    return new Promise((resolve, reject) => {

      const db = getDatabase();
      const jobsRef = dbRef(db, 'users/u1/jobs');
      const recentJobsQuery = query(jobsRef, orderByChild('pubDate'), limitToLast(10));

      get(recentJobsQuery)
        .then(snapshot => {
          let jobsArray = [];
          snapshot.forEach(childSnapshot => {
            const jobData = childSnapshot.val();
            const jobId = childSnapshot.key;
            jobData.id = jobId;
            jobsArray.push(jobData);
          });

          this.currentJobFeed = jobsArray;
          resolve(this.currentJobFeed);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  return { currentJobFeed, addJobToCurrentJobFeed, populateCurrentJobFeed };

});
