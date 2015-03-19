
if [ ! -z `ls $1` ]; then
    # Create a database with that name
    mysqladmin -u root -h 172.12.12.12 -proot -f drop recibes
    mysqladmin -u root -h 172.12.12.12 -proot create recibes
    
    # Import the SQL into new database
    mysql -u root -f -h 172.12.12.12 -proot recibes < $1 
fi                      

