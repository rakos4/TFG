#!/bin/bash

#variable que nos sirve para comprobar si la configuración ha sido realizada
config=`cat /tmp/configuracionCompletada.txt 2> /dev/null`


#funcion que da los permisos necesarios a la clave pública del SSH
function configuraSSH() {
 chmod 700 /root/.ssh/authorized_keys
 chown root:root /root/.ssh/authorized_keys
}

#si la configuracion esta realizada se inicia el agente de zabbix y el tomcat, por el contrario, se inicializa la configuración
if [[ $config == "1" ]]; then
	service ssh start
        sh bin/catalina.sh run
        
else
        echo "Iniciando configuración....."
	configuraSSH
	echo 1 > /tmp/configuracionCompletada.txt
fi
