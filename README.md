# wpi_rbe_vt
Virtual Tour Map for Robotics Program Engineering at WPI. Contains office and lab locations as well info overlays.

## Test Run
In order to host the website in a local address:
  * Install (npm)[https://www.npmjs.com/]
  * Clone or download this repository. 
  * cd into the folder, initialzie node.js workspace
  * Install http-server
  
  ```
  cd wpi_rbe_vt
  npm init
  npm install -g http-server
  ```
  
Google Maps API key for testing is set for any IP adress 127.0.0.1 for now.
  * Start the server
```htpp-server -p 8001 #p:port number to host```

Access from `127.0.01:8001`, replace the ip with the host IP for remote access

![overview](https://raw.githubusercontent.com/oakyildiz/wpi_rbe_vt/master/res/main.png)
