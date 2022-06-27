<template>
<div class="row host">
  <div class="col-4">
    <span>{{name}}</span>
  </div>
  <div class="col-6">
    <span>{{ip}}</span>
  </div>
  <div id="deleteHost" class="col-2" @click="this.delete">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  </div>
</div>
</template>

<script>

import Host from '../../models/Host';
export default {
  name: "host",
  props:['name','ip'],
  emits:['updatePanelHosts'],
  methods:{
    //METODO PARA ELIMINAR UN HOST DE LA APLICACION, REALIZA UNA LLAMADA AL SERVIDOR Y ESTE REALIZA LOS CAMBIOS
    delete: function (){
      fetch('/deleteHost',{
        method:'DELETE',
        body: JSON.stringify(new Host(this.name,this.ip)),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.$emit('updatePanelHosts')
      })
    }
  }
}
</script>

<style scoped>
#state{
  background-color: #22e822;
  border-radius: 65px;
  width: 25px;
  height: 25px;
}

.host{
  padding: 20px 0px;
  background-color: #2ccb95;
  color: white;
  border: 3px solid;
  border-color: #ebf0ec;
  border-radius: 6px;
}

#deleteHost{
  cursor: pointer;
}

</style>