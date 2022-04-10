#!/bin/bash

#variable que nos sirve para comprobar si la configuración ha sido realizada
config=`cat /tmp/configuracionCompletada.txt 2> /dev/null`

#funcion para configurar el tomcat, lo que hace es copiar la aplicacion en el directorio webapps y generar el archivo setenv.sh que es necesario para monitorizar el tomcat desde zabbix
function configuraTomcat(){
 cp -R webapps.dist/* webapps/
 IP=`ifconfig eth0| grep inet | cut -f10 -d' '`
 
 echo export CATALINA_OPTS='"$CATALINA_OPTS -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=12345 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname='"$IP"' -Dcom.sun.management.jmxremote.rmi.port=10052 -Djava.net.preferIPv4Stack=true"' > /usr/local/tomcat/bin/setenv.sh

 chmod +x /usr/local/tomcat/bin/setenv.sh
 sh bin/setenv.sh
 sh bin/catalina.sh start
}

#funcion que configura el agente de zabbix, en este caso utiliza el fichero que compartimos mediante un volumen y lo copia ya configurado
function configuraAgenteZabbix(){
 cp /usr/share/scripts/zabbix_agentd.conf /etc/zabbix/zabbix_agentd.conf
}

#si la configuracion esta realizada se inicia el agente de zabbix y el tomcat, por el contrario, se inicializa la configuración
if [[ $config == "1" ]]; then
	service zabbix-agent start
        sh bin/catalina.sh run
        
else
        echo "Iniciando configuración....."
	configuraTomcat
	configuraAgenteZabbix
	echo 1 > /tmp/configuracionCompletada.txt
fi
