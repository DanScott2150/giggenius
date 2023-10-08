import { defineStore } from 'pinia';

export const useProposalStore = defineStore('proposal', {
  state: () => {
    return {
      aboutMeText: 'I am a wordpress developer, focused on programming and creating custom-coded themes & plugins. I am an experienced developer not interested in basic wordpress tasks like content updates.',
      targetJobText: 'I need a piano player for my wedding',
      outputText: '',
    }
  },
  actions: {
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

