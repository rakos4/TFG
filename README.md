# TFG
Orquestación de entornos virtuales con docker, ansible y aplicación web

Esta rama corresponde al despliegue de Kubernetes y de Zabbix.

El repositorio consta de un archivo "Dockerfile" el cual es una imagen de docker basada en una imagen de tomcat.
Para utilizar este archivo tenemos que ejecutar el comando --> docker build -t tfg .
El comando anterior nos crea la imagen con el nombre de "tfg"

El siguiente archivo que encontramos es el "docker-compose.yaml". Este archivo crea una red de tipo macvlan para permitir que los contenedores se encuentren en la misma red que el servidor local. Por otro lado, despliega dos contenedores que utilizan la imagen que hemos creado con el Dockerfile y por último utiliza unos volumenes que permiten compartir archivos necesarios para realizar la configuración en estos contenedores.
Para utilizar el archivo docker-compose.yaml deberemos utilizar el comando --> docker-compose up -d
Este comando iniciará los contenedores, sin embargo, los contenedores al ejecutarse ejecutan un script de configuración que reinician el servidor tomcat y los contenedores se apagarán. Por lo tanto, una vez vez ejecutado el comando anterior deberemos ejecutar el comando siguiente para encender los contenedores
--> docker-compose start

Una vez ejecutados los comandos anteriores deberiamos de tener los contenedores funcionando y conectados al servidor zabbix.

En el repositorio podemos encontrar el directorio "scripts" que contiene dos archivos.

- InitialConfiguration.sh es el script que se ejecuta al iniciar los contenedores y es el que se encarga de realizar la configuración necesaria para que los tomcats se conecten al servidor Zabbix y puedan ser monitorizados.

- zabix_agentd.conf es un archivo de configuración que se copia en los contenedores tomcats donde se indican parámetros necesarios para que se conecten al servidor Zabbix.
