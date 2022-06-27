<template>
  <!-- FORMULARIO PARA AÑADIR CODIGO PERSONALIZADO -->
  <form id="customAnsible" class="row ms-auto" @submit.prevent="this.run">
    <label class="form-package sr-only" for="packet">Create your Playbook</label>
    <div class="form-package col-11">
      <textarea v-model="this.ansibleProgram" class="form-control mb-2 mr-sm-2" id="packet" rows="7"></textarea>
    </div>
    <div id="buttonPackage" class="col-1">
      <button type="submit" class="btn btn-primary mb-2">Run</button>
    </div>

    <!-- FORMULARIO PARA SUBIR FICHEROS AL SERVIDOR -->
    <form id="uploadFiles" class="row" enctype="multipart/form-data" @submit.prevent="this.uploadFile">
      <div class="form-group">
        <label for="exampleFormControlFile1">Example file input </label>
        <input type="file" v-on:change="this.setFile" class="form-control-file" name="file"
               id="exampleFormControlFile1">
        <button type="submit" class="btn btn-primary">Upload</button>
      </div>
    </form>

    <!-- DIVS PARA MOSTRAR MENSAJES RESULTANTES (ERROR O EXITO) -->
    <div id="errorPackage" v-if="this.error" class="col-12 alert alert-danger" role="alert">
      <button type="button" class="close closeExec" aria-label="Close" @click="this.error=false">
        <span aria-hidden="true">&times;</span>
      </button>
      <p>{{ this.errorMsg }}</p>
    </div>
    <div id="resultExec" v-if="this.exec" class="alert alert-success col-12" :style="this.style" role="alert">
      <button type="button" class="close closeExec" aria-label="Close" @click="this.exec=false">
        <span aria-hidden="true">&times;</span>
      </button>
      <p v-for="p in this.dataExec">{{ p }}</p>
    </div>
  </form>
</template>

<script>
export default {
  name: "ansibleCustom",
  data() {
    return {
      ansibleProgram: "",
      error: false,
      exec: false,
      errorMsg: "",
      file: null,
      dataExec: [],
      style:""
    }
  },
  watch: {
    //COMPRUEBA SI EL VALOR DEL CAMPO ES NULO
    packages(newValue) {
      if (newValue.length !== 0) {
        this.error = false
        this.exec = false
      }
    }
  },
  methods: {
    //ASIGNA EL FICHERO QUE SE QUIERE SUBIR AL SERVIDOR A LA VARIABLE FILE
    setFile: function (e) {
      this.file = e.target.files[0]
    },
    //METODO PARA SUBIR EL FICHERO AL SERVIDOR, SE CREA UN OBJETO FORMDATA Y EN CASO DE EXITO O ERROR SE MUESTRA EL MENSAJE POR PANTALLA
    uploadFile: function () {
      var formData = new FormData()
      formData.append('file', this.file)
      fetch('/uploadFile', {
        method: 'POST',
        body: formData
      })
          .then(res => res.json())
          .then(data => {
            if(data.status){
              this.exec = true
              this.class = "alert alert-success col-12";
              this.style = ""
              this.dataExec = ["Fichero guardado correctamente"]
            }else{
              this.error = true
              this.errorMsg = "Error al guardar el fichero"
            }
          })

    },
    //METODO QUE EJECUTA EL CÓDIGO INTRODUCIDO EN EL MODULO, ENVIA LOS DATOS AL SERVER MEDIANTE FETCH
    run: function () {
      if (this.ansibleProgram.length === 0) {
        this.error = true
        this.errorMsg = "El campo no puede estar vacío";
        this.exec = false
      } else {

        fetch('/customAnsible', {
          method: 'POST',
          body: JSON.stringify({data:this.ansibleProgram}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(data => {
          this.showResult(data);
        })
      }
    },
    //METODO PARA MOSTRAR POR PANTALLA LOS RESULTADOS
    showResult: function (data) {
      console.log(data)

      if (data.status === false) {
        this.error = true
        this.errorMsg = "Error al instalar los paquetes"
      } else {
        this.exec = true
        this.class = "alert alert-success col-12";
        this.style = "height: 150px; overflow-y: scroll;"
        this.dataExec = data.status
      }
    }
  }
}
</script>

<style scoped>

#customAnsible > *:not(#buttonPackage,#errorPackage,#resultExec) {
  padding-left: 0px;
}

#buttonPackage {
  padding-right: 0px;
}

#buttonPackage button {
  width: 100%;
}

/**
#resultExec {
  height: 150px;
  overflow-y: scroll;
}
**/


.closeExec {
  position: absolute;
  right: 25px;
  background: none;
  border: none;
}

</style>