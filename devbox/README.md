# devbox

SET UP VAGRANT DEVBOX
======================

* vagrant up

Edit binding ip for mysql and redis

* vagrant ssh
* sudo vi /etc/mysql/my.cnf  <-- set bind 0.0.0.0
* sudo service mysql restart
* sudo vi /etc/redis/redis.conf <-- set bind 0.0.0.0
* sudo service redis-server restart
* exit

Setup NGINX as a reverse proxy

* vagrant ssh
* sudo mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default0
* sudo cp /home/vagrant/dev/nginx/default /etc/nginx/sites-available/
* sudo service nginx restart
* exit

Setup Mysql sitedb

  <<< setup mysql db: use schema in `dev/mysql/sitedb.sql` <<<

Run node webserver

* vagrant ssh
  cd webapp
* yarn
* webpack
* pm1 start server.js
* node bin/createUser.js
* exit
