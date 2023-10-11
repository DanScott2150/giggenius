import { defineStore } from 'pinia';
import { getDatabase, ref as dbRef, get, set } from "firebase/database";

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
    }
    // populateJobs(newJobs){
    //   this.jobs = [];
    //   this.jobs = newJobs;
    // }
  }
});

