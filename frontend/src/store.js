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
  state: () => {
    return {
      jobs: [
        {
          description: "We are looking for a skilled web developer/designer to assist with transferring our existing Blogspot/Blogger blog to a new website platform, which could be WordPress or a custom web application. We&#039;ll likely need to discuss specific features and requirements over a call - there are some essential features from our existing Blogspot blog that we&#039;d like to retain in the new website.<br /><br />\nKey Details:<br /><br />\nPlatform Selection: Determine the best platform (e.g., WordPress, custom web app) for the migration and discuss the pros and cons of each option.<br /><br />\nContent Transfer: Migrate all existing blog posts, images, and other content from the Blogspot blog to the new website while preserving formatting and SEO settings.<br /><br />\nFeature Discussion: We will discuss specific features and functionalities that are important to us during a call. Some of the features available on Blogspot are essential and should be retained or replicated on the new site.<br /><br />\nCustomization: Customize the new website&#039;s design, layout, and appearance to align with our brand and preferences.<br /><br />\nDomain Integration: If applicable, ensure seamless integration of our custom domain with the new website.<br /><br />\nSEO Considerations: Implement necessary SEO settings and redirects to maintain or improve our search engine rankings.<br /><br />\nTesting and Quality Assurance: Thoroughly test the new website to ensure functionality, responsiveness, and performance across different devices and browsers.<br /><br />\nUser Training: If required, provide training to our team on how to manage and update content on the new website.<br /><br />\nQualifications:<br />\nExperience in website migration and development.<br />\nProficiency with the chosen platform (e.g., WordPress, web app development).<br />\nExcellent communication skills for detailed feature discussions.<br /><br />\nBudget and Duration:<br />\nWe are open to discussing the budget based on the scope of work and features to be implemented. Please provide an estimate. The project&#039;s duration will depend on the complexity of the migration and customization.<br /><br />\nHow to Apply:<br />\nInterested freelancers are encouraged to apply with their relevant experience and a brief description of their approach to this project. Please include any portfolio examples that showcase similar website migration or development work.<br /><br /><br /><b>Budget</b>: $500\n<br /><b>Posted On</b>: September 16, 2023 23:57 UTC<br /><b>Category</b>: Full Stack Development<br /><b>Skills</b>:Web Development,     Web Design,     React,     HTML,     CSS,     JavaScript    \n<br /><b>Location Requirement</b>: Only freelancers located in the United States may apply.\n<br /><b>Country</b>: United States\n<br /><a href=\"https://www.upwork.com/jobs/Build-New-Webapp-must-incorporate-existing-Blogger-Blogspot-posts-and-features_%7E01f3272ed794c99168?source=rss\">click to apply</a>\n",
          guid: "https://www.upwork.com/jobs/Build-New-Webapp-must-incorporate-existing-Blogger-Blogspot-posts-and-features_%7E01f3272ed794c99168?source=rss",
          link: "https://www.upwork.com/jobs/Build-New-Webapp-must-incorporate-existing-Blogger-Blogspot-posts-and-features_%7E01f3272ed794c99168?source=rss",
          pubDate: "Sat, 16 Sep 2023 23:57:26 +0000",
          title: "Build New Webapp, must incorporate existing Blogger/Blogspot posts and features - Upwork"
        }
      ]
    }
  },
  actions: {
    populateJobs(newJobs){
      this.jobs = [];
      this.jobs = newJobs;
    }
  }
});

