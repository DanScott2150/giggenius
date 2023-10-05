<template>

  <header>
    <h1>GigGeniusAI</h1>
    <div>
      <ul>
        <li>Log In</li>
        <li>Sign Up</li>
      </ul>
      <img src="./assets/logo.png" alt="App Logo" />
    </div>
  </header>

  <div class="page-content">

    <nav class="nav-menu">
      <router-link to="/" class="tab" active-class="active-tab">Job Feed</router-link>
      <router-link to="/generate-proposal" class="tab" active-class="active-tab">Generate Proposal</router-link>
    </nav>

    <main>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </main>

  </div>

</template>


<style scoped>

  header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
    background-color: #fff;
    max-height: 80px;
  }

  header div{
    display: flex;
    align-items: center;
  }

  header ul{
    display: flex;
    margin-right: 50px;
    font-size: 28px;
    border-right: 1px solid #afb1b2;
  }

  header ul li{
    list-style-type: none;
    padding-right: 40px;
    color: #afb1b2
  }

  header img{
    max-width: 120px;
  }

  header h1 {
    font-size: 64px;
  }

  .page-content{
    padding-top: 20px;
  }

  main{
    background-color: #f6f7f6;
    padding-top: 20px;

  }
  .content-container {
    background-color: white;
    padding: 20px;
    margin: 0 auto;
    max-width: 1200px;
    border: 1px solid #eaeaea;
    border-radius: 10px;
  }

  /* Navigation Menu Styles */
  .nav-menu {
    display: flex;
    justify-content: center;
    border-bottom: 2px solid #e1e1e1;
  }
  .tab {
    padding: 10px 20px;
    margin: 0 10px;
    cursor: pointer;
    border: 2px solid #e1e1e1;
    border-bottom: none;
    background-color: #ffffff;
    transition: background-color 0.3s;
    font-size: 24px;
    font-family: 'Roboto', sans-serif;
    text-decoration: none;
    text-transform: uppercase;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: gray;
  }

  .active-tab {
    background-color: #f6f7f6;
    /* color: black; */
    color: #4e935b;
    font-weight: bold;
    border-color: #e1e1e1;
    margin-bottom: -2px;
  }

  .tab:hover {
    background-color: #f5f5f5;
  }
</style>
