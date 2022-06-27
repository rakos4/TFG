<template>
  <!-- FORMULARIO PARA INSTALAR PAQUETES -->
  <form id="installPackages" class="row ms-auto" @submit.prevent="this.run">
    <label class="form-package sr-only" for="packet">Install packages</label>
    <div class="form-package col-11">
      <input v-model="this.packages" type="text" class="form-control mb-2 mr-sm-2" id="packet"
             placeholder="Some packet">
    </div>
    <div id="buttonPackage" class="col-1">
      <button type="submit" class="btn btn-primary mb-2">Install</button>
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
  name: "ansibleInstall",

  data() {
    return {
      packages: "",
      error: false,
      path:"",
      exec:false,
      errorMsg:"",
      dataExec:[]
    }
  },

  watch: {
    // COMPRUEBA SI EL CAMPO DE PAQUETES ESTA VACIO
    packages(newValue) {
      if (newValue.length !== 0){
        this.error = false
        this.exec=false
      }
    }
  },
  methods: {
    //METODO QUE ENVIA LA INFORMACIÓN RECIBIDA DEL FORMULARIO AL SERVIDOR MEDIANTE FETCH
    run: function () {
      if (this.packages.length === 0) {
        this.error = true
        this.errorMsg="El campo no puede estar vacío";
        this.exec=false
      } else {
        var packagesToInstall = this.packages.split(",");

        fetch('/installPackages',{
          method:'POST',
          body:JSON.stringify(packagesToInstall),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          this.showResult(data);
        })
      }
    },
    //METODO PARA MOSTRAR POR PANTALLA EL RESULTADO OBTENIDO
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
  },

}
</script>

<style scoped>

.form-package {
  padding-left: 0px;
}

#buttonPackage {
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