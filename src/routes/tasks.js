const express = require('express');
const router = express.Router();
const User = require('../models/User')
const database = require('../models/Database');
const {execSync} = require("child_process");
const fs = require('fs')
const multer = require('multer')

//METODO UTILIZADO PARA ALMACENAR FICHEROS EN EL SERVIDOR
const storage = multer.diskStorage({
    destination:'src/ansible',
    filename: function(req, file, callback){
        callback(null,file.originalname)
    }
})
const upload = multer({
    storage:storage
})

//METODO QUE SE UTILIZA CUANDO EL USUARIO QUIERE REALIZAR UN LOGIN
router.post('/login', async (req, res) => {

    // creamos un usuario con los valores recibidos del formulario
    const formUser = new User(req.body.username, req.body.password, true);
    //obtenemos el usuario de la base de datos
    const rows = await database('SELECT * FROM users');
    var bdUser = new User(rows[0].username, rows[0].password, false);
    //comprobamos si son iguales
    var iguales = formUser.compareUser(bdUser);

    res.json({
        status: iguales
    })
})

//METODO QUE SE UTILIZA PARA OBTENER Y ACTUALIZAR LOS HOSTS EN LA APLICACION
router.get('/getHosts', async (req, res) => {
    // se realiza la consulta a la base de datos obteniendo todos los hosts.
    const rows = await database('SELECT * FROM hosts');
    try {
        //se elimina el fichero hosts si existe
        //fs.unlinkSync("/etc/ansible/hosts")
        fs.writeFile('/etc/ansible/hosts','',function (){console.log("done")})
    } catch (e) {
        console.log(e)
    }
    //por cada host que obtenemos de la consulta lo insertamos en el nuevo archivo hosts.txt
    for (host in rows) {
        var ip = rows[host].ip
        fs.appendFile("/etc/ansible/hosts", ip + "\n", err => {
            if (err) {
                console.error(err);
            }
        });
    }

    res.json({
        hosts: rows
    })
})

//METODO QUE SE UTILIZA PARA AÑADIR UN NUEVO HOST EN LA APLICACION
router.post('/addHost', async (req, res) => {

    try {
        // realizamos un insert en la base de datos con los datos proporcionados por el cliente
        await database('INSERT INTO hosts (name,ip) VALUES("' + req.body.name + '","' + req.body.ip + '")');
        // si no hay error devolvemos true
        res.json({
            status: true
        })
    } catch (e) {
        // si hay error devolvemos false
        res.json({
            status: false
        })
    }
})

//METODO QUE SE UTILIZA PARA ELIMINAR UN HOST DE LA APLICACION
router.delete('/deleteHost', async (req, res) => {
    // se realiza un delete en la base de datos y devolvemos true si todo va bien o false si va mal
    try {
        await database('DELETE FROM hosts where ip="' + req.body.ip + '"')
        res.json({
            status: true
        })
    } catch (e) {
        console.log("Se ha producido un error: --> " + e);
        res.json({
            status: false
        })
    }
})

//EXECUTIONS OF ANSIBLE

//METODO PARA INSTALAR PAQUETES EN LOS SERVIDORES ASOCIADOS A LA APLICACION
router.post('/installPackages', async (req, res) => {
    // creamos el playbook que ejecuta las instrucciones
    createPlaybook("Install", req.body)
    var result;
    // ejecutamos el playbook y devolvemos el resultado al cliente
    try{
        var result1 = execSync('ansible-playbook -u root src/ansible/playbook.yml',{ encoding: 'utf-8' }).toString();
        result = result1.toString().split('\n')

    }catch (e){
        result=false
    }

    res.json({
        status:result
    })
});

//METODO PARA CAMBIAR EL ESTADO DE LOS SERVICIOS, FUNCIONA IGUAL QUE EL DE INSTALAR PAQUETES
router.post('/restartServices', async (req, res) => {

    createPlaybook(req.body.mode, req.body.packages)
    var result;
    try{
        var result1 = execSync('ansible-playbook  -u root src/ansible/playbook.yml',{ encoding: 'utf-8' }).toString();
        result = result1.toString().split('\n')

    }catch (e){
        result=false
    }

    res.json({
        status:result
    })
});

//METODO PARA EJECUTAR UN PLAYBOOK CUSTOMIZADO SOBRE LOS SERVIDORES DE LA APLICACION
router.post('/customAnsible',async(req,res) => {
    createPlaybook("custom",req.body.data)
    var result;
    try{
        var result1 = execSync('ansible-playbook  -u root src/ansible/playbook.yml',{ encoding: 'utf-8' }).toString();
        result = result1.toString().split('\n')
    }catch (e){
        console.log(e)
        result=false
    }
    res.json({
        status:result
    })

})

//METODO PARA SUBIR EL FICHERO AL SERVIDOR
router.post('/uploadFile',upload.single('file'),(req,res)=>{

    res.json({
        status:true
    })

})

//METODO PARA CREAR EL PLAYBOOK QUE SE EJECUTARÁ EN LOS SERVIDORES
//MODE PUEDE SER (INSTALL,RESTART,CUSTOM) SON LOS DIFERENTES MODOS DE EJECUCION QUE OFRECE LA APLICACION
//PACKAGES SON EL CONJUNTO DE PAQUETES O INSTRUCCIONES QUE SE VAN A EJECUTAR
function createPlaybook(mode, packages) {
    try {
        //primero se elimina el fichero si existe
        try {
            fs.unlinkSync("src/ansible/playbook.yml")
        } catch (e) {
            console.log("Error al eliminar el fichero")
        }
        // si el modo es diferente de custom
        if(mode !== "custom"){
            // crearemos el playbook con la modalidad de install o service
            var service;
            var state;
            if(mode==="Install"){
                service = "    apt";
                state = "present";
            }else{
                service = "    service";
                state = mode
            }
            // se añaden las cabeceras del fichero yaml
            fs.appendFileSync("src/ansible/playbook.yml", "---\n", err => console.log(err));
            fs.appendFileSync("src/ansible/playbook.yml", "- hosts: all\n", err => console.log(err));
            fs.appendFileSync("src/ansible/playbook.yml", "  tasks:\n", err => console.log(err));

            // por cada paquete creamos su modulo correspondiente en el fichero
            for (task in packages) {
                fs.appendFileSync("src/ansible/playbook.yml", "  - name: " + mode + " package " + packages[task] + "\n", err => console.log(err));
                fs.appendFileSync("src/ansible/playbook.yml", service + ": name=" + packages[task] + " state=" + state + "\n", err => console.log(err));
            }
        }else{
            // si el modo es custom simplemente creamos el fichero playbook con el contenido que hemos obtenido del formulario del cliente.
            fs.appendFileSync("src/ansible/playbook.yml", packages, err => console.log(err));
        }

    } catch (e) {
        console.log(e)
    }

}



module.exports = router;