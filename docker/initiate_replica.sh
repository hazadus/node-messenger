#!/bin/bash

echo "Starting replica set initialization."
until mongosh --host mongodb1 --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished."
echo "Creating replica set..."
mongosh --host mongodb1 <<EOF
rs.initiate(
  {
    _id : 'rs0',
    members: [
      { _id : 0, host : "mongodb1:27017", priority: 3 },
      { _id : 1, host : "mongodb2:27017", priority: 2 },
      { _id : 2, host : "mongodb3:27017", priority: 1 }
    ]
  }
)
EOF
echo "Replica set created."