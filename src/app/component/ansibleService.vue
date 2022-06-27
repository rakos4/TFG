<template>
  <!-- FORMULARIO PARA CAMBIAR EL ESTADO DE LOS SERVICIOS -->
  <form id="servicePackages" class="row ms-auto" @submit.prevent="this.run">
    <label class="form-package sr-only" for="packet">Modify service state</label>
    <div class="form-package col-9">
      <input v-model="this.packages" type="text" class="form-control mb-2 mr-sm-2" id="packet"
             placeholder="Some packet">
    </div>
    <div class="form-package col-2">
      <select class="form-control" v-model="selected">
        <option value="started">Start</option>
        <option value="stopped">Stop</option>
        <option value="restarted">Restart</option>
      </select>
    </div>
    <div id="buttonPackage" class="col-1">
      <button type="submit" class="btn btn-primary mb-2">Go</button>
    </div>
    <div id="errorPackage" v-if="this.error" class="col-12 alert alert-danger" role="alert">
      <button type="button" class="close closeExec"  aria-label="Close" @click="this.error=false">
        <span aria-hidden="true">&times;</span>
      </button>
      <p>{{ this.errorMsg }}</p>
    </div>
    <div id="resultExec" v-if="this.exec" class="alert alert-success col-12"  role="alert">
      <button type="button" class="close closeExec"  aria-label="Close" @click="this.exec=false">
        <span aria-hidden="true">&times;</span>
      </button>
      <p v-for="p in this.dataExec">{{p}}</p>
    </div>
  </form>
</template>

<script>
export default {
  name: "ansibleService",
  data() {
    return {
      packages: "",
      error: false,
      exec:false,
      errorMsg:"",
      selected:"started",
      dataExec:[]
    }
  },
  watch: {
    //COMPRUEBA QUE EL PAQUETE NO SEA NULO
    packages(newValue) {
      if (newValue.length !== 0){
        this.error = false
        this.exec=false
      }
    }
  },
  methods:{
    //METODO QUE ENVIA LA INFORMACION AL SERVIDOR CON UNA LLAMADA FETCH
    run: function () {
      if (this.packages.length === 0) {
        this.error = true
        this.errorMsg="El campo no puede estar vacío";
        this.exec=false
      } else {
        var packagesToChange = this.packages.split(",");
        var data = {
          packages: packagesToChange,
          mode: this.selected
        }

        fetch('/restartServices',{
          method:'POST',
          body:JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          this.showResult(data);
        })
      }
    },
    //METODO QUE MUESTRA EL RESULTADO OBTENIDO POR PANTALLA
    showResult:function(data){
      if(data.status===false){
        this.error=true
        this.errorMsg="Error al instalar los paquetes"
      }else{
        this.exec=true
        this.class="alert alert-success col-12";
        this.style="height: 150px; overflow-y: scroll;"
        this.dataExec=data.status
      }
    }
  }
}
</script>

<style scoped>
#servicePackages > *:not(#buttonPackage,#errorPackage,#resultExec) {
  padding-left: 0px;
}

#buttonPackage{
  padding-right: 0px;
}
#buttonPackage button {
  width: 100%;
}

#resultExec{
  height: 150px;
  overflow-y: scroll;
}

.closeExec{
  position: absolute;
  right: 25px;
  background: none;
  border: none;
}

</style>