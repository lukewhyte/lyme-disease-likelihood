# this script checks if the mongod is running, starts it if not

if pgrep -q mongod; then
    echo running;
else
    mongod;
fi

exit 0;