<template>

  <v-app>

    <v-app-bar app height="100">
      <v-toolbar color="white" class="px-5">

        <v-toolbar-title>
          <div class="d-flex align-center">
            <v-avatar size="80">
              <v-img src="..\src\assets\logo.png" alt="GigGenius Logo"></v-img>
            </v-avatar>
            <h2 class="pl-5" style="font-size:42px; letter-spacing:2px;">GigGenius</h2>
          </div>
        </v-toolbar-title>

        <div style="font-size: 20px; margin-right:4em; color:darkgray">
          Login&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Sign up
        </div>

        <v-avatar color="grey" class="mr-5">
          <v-icon icon="mdi-account-circle"></v-icon>
        </v-avatar>

      </v-toolbar>
    </v-app-bar>

    <v-navigation-drawer width="275">

      <v-list class="py-5 px-3">

        <router-link to="/" class="nav-item" active-class="active-tab">
          <v-list-item link title="Current Job Feed" prepend-icon="mdi-format-list-bulleted"></v-list-item>
        </router-link>
        <router-link to="/all-jobs">
          <v-list-item link title="View All Jobs" prepend-icon="mdi-briefcase-outline"></v-list-item>
        </router-link>
        <router-link to="/generate-proposal">
          <v-list-item link title="Generate Proposal" prepend-icon="mdi-pencil-outline"></v-list-item>
        </router-link>

        <div class="py-5">
          <v-divider></v-divider>
        </div>

        <router-link to="/settings">
          <v-list-item link title="Settings" prepend-icon="mdi-cogs"></v-list-item>
        </router-link>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <div class="py-5 px-10">
        <router-view></router-view>
      </div>
    </v-main>

  </v-app>

</template>
