import { defineStore } from 'pinia';
import { getDatabase, ref as dbRef, get, set, query, limitToLast, orderByChild, onValue } from "firebase/database";

export const useProposalStore = defineStore('proposal', {
  state: () => {
    return {
      aboutMeText: '',
      targetJobText: '',
      outputText: '',
    }
  },
  actions: {

    /** Fetches the user's "about me" text from the Firebase database. */
    async fetchAboutMeText(){

      const db = getDatabase();
      const aboutMeTextRef = dbRef(db, 'users/u1/settings/aboutMeText');

      try {
        const snapshot = await get(aboutMeTextRef);
        if (snapshot.exists()) {
          this.aboutMeText = snapshot.val();
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching aboutMeText from Firebase: ", error);
      }
    },

    /** Save the user's "about me" text to the Firebase database */
    async saveAboutMeText(){

      const db = getDatabase();
      const aboutMeTextRef = dbRef(db, 'users/u1/settings/aboutMeText');

      try{
        await set(aboutMeTextRef, this.aboutMeText);
      } catch(error){
        console.error("Error saving aboutMeText to Firebase: ", error);
      }

    },

    setAboutMeText(newValue){
      this.aboutMeText = newValue;
    },
    setTargetJobText(newValue){
      this.targetJobText = newValue;
    },
    setOutputText(newValue){
      this.outputText = newValue;
    }
  }
});

export const useJobFeedStore = defineStore('jobFeed', {
  state: () => ({
      currentJobFeed: [],
  }),
  actions: {
    updateCurrentJobFeed(newJobFeed){
      this.currentJobFeed = newJobFeed;
    },
    addJobToCurrentJobFeed(newJob){
      this.currentJobFeed.push(newJob);
    },
    // If the currentJobFeed is empty, populate it with the most recent 10 entries from firebase
    async populateCurrentJobFeed(){
      return new Promise((resolve, reject) => {
        console.log("store.js populate current job feed");
        const db = getDatabase();
        const jobsRef = dbRef(db, 'users/u1/jobs');
        const recentJobsQuery = query(jobsRef, orderByChild('timestamp'), limitToLast(4));

        // Save jobs to vue store so we're not re-fetching them every time
        onValue(recentJobsQuery, snapshot => {
          console.log("onValue");
          const jobsArray = [];
          snapshot.forEach(childSnapshot => {
            const jobData = childSnapshot.val();
            const jobId = childSnapshot.key;
            jobData.id = jobId;
            jobsArray.push(jobData);
          });

        this.currentJobFeed = jobsArray;
        console.log(this.currentJobFeed)
        resolve();

        },
        error => {
          reject(error);
        });
    })
    .then(() => {
      console.log("promise resolved");
      this.generateAnalysis(this.currentJobFeed)
    })
    },


    async generateAnalysis(jobs) {
      console.log("store.js generate analysis");
      // console.log(job);
      // return;
      const url = "http://127.0.0.1:5000/generate-analysis";

      jobs.forEach(async job => {
        console.log("in job");
        console.log(job)
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jobText: job.description,
              aboutMeText: useProposalStore.aboutMeText,
              guid: job.guid
            })
          });

          const data = await response.json();
          console.log(data);

          // Update the job with the received analysis.
          const updatedJob = { ...job, decision: data.match_decision || "" };

          // Update the Firebase Realtime Database.
          const db = getDatabase();
          await set(ref(db, `users/u1/jobs/${job.guid}`), updatedJob);

          // Update the local state.
          const jobIndex = this.jobs.findIndex(j => j.guid === job.guid);
          this.jobs[jobIndex] = updatedJob;

        } catch (error) {
          console.error(error);
          // You might want to handle the error more gracefully, maybe update the job with an error status.
        }
      })
    }



    // populateJobs(newJobs){
    //   this.jobs = [];
    //   this.jobs = newJobs;
    // }
  }
});

