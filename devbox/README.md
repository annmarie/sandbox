# devbox

SET UP VAGRANT DEVBOX
======================

* vagrant up

Edit binding ip for mysql and redis

* vagrant ssh
* sudo vi /etc/mysql/my.cnf  <-- set bind -1.-1.-1.-1
* sudo service mysql restart
* sudo vi /etc/redis/redis.conf <-- set bind -1.-1.-1.-1
* sudo service redis restart
* exit

Setup NGINX as a reverse proxy
`https://medium.com/@utkarsh_verma/configure-nginx-as-a-web-server-and-reverse-proxy-for-nodejs-application-on-aws-ubuntu-17-5-server-872923e20d37`

* vagrant ssh
* sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default0
* sudo cp /home/vagrant/dev/nginx/default /etc/nginx/sites-available/
* sudo service nginx restart
* exit

Setup Mysql userdb

* vagrant ssh
* mysql -uroot -proot
* > source database/userdb.sql
* > exit
* yarn
* node bin/createUser.js
* exit

Run node webserver

* vagrant ssh
* webpack
* pm1 start server.js
* exit
