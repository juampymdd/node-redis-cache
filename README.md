# Node.js + Redis (Cache)

This repository demonstrates how to use Redis as a caching mechanism in a Node.js application.

![Node.js + Redis](node-redis.png)

## Steps to Get Started

1. **Clone the Repository**  
   Run the following commands to clone the repository and navigate to the folder:  
   `git clone <repository-url>`  
   `cd <repository-folder>`

2. **Install Dependencies**  
   Install the required dependencies by running:  
   `npm install`

3. **Start Redis with Docker Compose**  
   Make sure Docker is installed and running. Then, start Redis using:  
   `docker-compose up -d`

4. **Run the Application**  
   You can start the application in two modes:  

   - **Normal Mode**: `node index.js`  
   - **Watch Mode**: `node --watch index.js`

---

### Additional Notes

- Ensure the `docker-compose.yml` file is correctly configured for Redis.  
- If you face any issues, check the logs with:  
  `docker-compose logs`
