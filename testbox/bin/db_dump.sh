DBH=172.11.11.11
DBU=root
DBP=root
DBN=testbox
FN="$DBN.sql"

mysqldump -h $DBH -u $DBU -p$DBP -c --add-drop-table $DBN > $FN  

