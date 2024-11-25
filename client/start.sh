#!/bin/bash

# Get the current IP address
IP_ADDRESS=$(ipconfig getifaddr en0)

# Export the IP address as an environment variable
export HOSTNAME=$IP_ADDRESS

# Start Metro
npx expo start