

# SmartWash: an intelligent solution for managing campus laundries for universities

This project was created as a final degree project. It involves a mobile application built using React Native that communicates with a backend Node.js server and a smart plug. The purpose of the application is to assist students on a university campus in monitoring their laundry status and receiving notifications when their laundry is done.

## Overview

The application communicates with the washing machines through a smart plug, which sends information about the machines' status via MQTT to a Node-RED instance. The Node.js backend server, hosted on Google App Engine, receives this data and manages the communication between the app and the Node-RED instance hosted on Compute Engine. [Check out the Node-RED repo](https://github.com/botezatuemil/smart-washing-node-red)

The mobile application, deployed through Expo, allows students to check the status of their washing machines and receive notifications when their laundry is completed.

## Documentation

For more details on the system design, protocols, and implementation, refer to the technical documentation.

You can also check my short PowerPoint Presentation for a quick overview of the project.

## Contributing
This project is a final degree project and contributions are not being accepted.


## Features

- real-time notifications when a washing machine / dryer is done for alerting the students of the newly available device

- live preview of any device to see it's status (BUSY, FREE, NOT OPENED) from the menu with the user that used it last time

- ability to create a reservation and choose your desired time from a time slot that prevents any conflicts with the other students

- integrated chat with web sockets for communicating any problems

- deleting a reservation and rescheduling the other ones through knapsack problem using dynamic programming

- use the washing machine by scanning the QR code to prevent any false reservation

- cron jobs on backend that deletes any unused reservation

- stopping the washing machine or continuing the reservation 

- power of / power on the smart plug and ensuring that no ones use the device unauthorized

- history to see any incoming reservation

- inbox to store notifications

- personal profile

- authentication screen

- cloud hosted servers

- cross platform


## Tech Stack

**Programming Language:** TypeScript

**Client:** React Native, Zustand, react-query, Tamagui

**Server:** Node, Express, Node-RED, MQTT

**Database:** Supabase

**Cloud**: Google Cloud (App Engine & Compute Engine)

**Sensors**: Gosund SP111 Smart Plug


## Authors

- Botezatu Emil
- Dr. Lect. Anca Vasilescu

