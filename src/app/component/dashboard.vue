<template>
  <div id="container">
    <div class="row">
      <div class="col-2">
        <div class="row">
          <img id="logo" src="../../img/logo_uab.png"/>
        </div>
        <div id="hora" class="row">
          <h2>{{ this.hora }}</h2>
        </div>
      </div>
      <div id="titulo" class="col-8">
        <h1>Orquestador de servidores mediante Ansible</h1>
      </div>
      <div id="logout" class="col-2">
        <button type="button" class="btn btn-danger" @click="this.logout">Logout</button>
      </div>
    </div>
    <panelHosts @hostsUpdated="this.updateHost=false"></panelHosts>
  </div>
</template>

<script>

import host from './host.vue';
import panelHosts from "./panelHosts.vue";

export default {
  name: "dashboard",
  data() {
    return {
      updateHost: false,
      hora: null,
      modalOpen: false
    }
  },
  // ACTUALIZA LA HORA CADA MINUTO
  created() {
    var date = new Date()
    this.hora = date.getHours() + ":" + date.getMinutes()
    setInterval(this.setHour, 60000);

  },
  methods: {
    setHour: function () {
      var date = new Date()
      this.hora = date.getHours() + ":" + date.getMinutes()
    },
    logout: function(){
      this.$router.push('/login')
    }
  },
  components: {host, panelHosts}
}
</script>

<style scoped>

#logo {
  width: 100%;
}

#hora {
  text-align: center;
  padding: 10px;
}


button {
  margin-top: 10px;
  padding: 12px;
}

#logout{
  text-align: right;
}
#titulo{
  text-align: center;
}
</style>