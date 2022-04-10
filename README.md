# TFG
Orquestación de entornos virtuales con docker, ansible y aplicación web

# TFG
Orquestación de entornos virtuales con docker, ansible y aplicación web

Esta rama corresponde al despliegue de Kubernetes, Zabbix y Ansible.

El repositorio consta de un archivo "Dockerfile" el cual es una imagen de docker basada en una imagen de tomcat.
Para utilizar este archivo tenemos que ejecutar el comando --> docker build -t tfg .
El comando anterior nos crea la imagen con el nombre de "tfg"

El siguiente archivo que encontramos es el "docker-compose.yaml". Este archivo crea una red de tipo macvlan para permitir que los contenedores se encuentren en la misma red que el servidor local. Por otro lado, despliega dos contenedores que utilizan la imagen que hemos creado con el Dockerfile y por último utiliza unos volumenes que permiten compartir archivos necesarios para realizar la configuración en estos contenedores.
Para utilizar el archivo docker-compose.yaml deberemos utilizar el comando --> docker-compose up -d
Este comando iniciará los contenedores, sin embargo, los contenedores al ejecutarse ejecutan un script de configuración que reinician el servidor tomcat y los contenedores se apagarán. Por lo tanto, una vez vez ejecutado el comando anterior deberemos ejecutar el comando siguiente para encender los contenedores
--> docker-compose start

Una vez ejecutados los comandos anteriores deberiamos de tener los contenedores funcionando con el servicio ssh configurado

- En el repositorio podemos encontrar el directorio "scripts" que contiene el script initialConfiguration.sh. Este es el script que se ejecuta al iniciar los contenedores y es el que se encarga de realizar la configuración necesaria para que los tomcats se puedan conectar mediante ssh al servidor local.

- Otro directorio que podemos encontrar es el de "clavesPublicas" que contiene la clave pública del servidor para que los contendores se la puedan copiar y no sea necesario introducir la contraseña cada vez que se realice una operación con Ansible.

- Finalmente encontramos el directorio "Ansible" el cual contiene los siguientes ficheros:
  - zabix_agentd.conf es un archivo de configuración que se copia en los contenedores tomcats donde se indican parámetros necesarios para que se conecten al servidor Zabbix.
  - configuration.yml es el archivo de configuracion de Ansible que realiza toda la configuración en los servidores tomcats permitiendo que se puedan monitorizar.
  - setenv.j2 es un template que se utilizará con Ansible para la configuración de los tomcats.


Una vez tenemos los contenedores funcionando solo tenemos que ejecutar el comando --> ansible-playbook configuration.yml para aplicar las configuraciones en todos los servidores de forma simultanea.


