# Double Agent Locator
Spring Boot + Leaflet.js app to visualize double agents listed in a csv document

##Setup
Make sure you have gradle and node installed.
See which versions of gradle are compatible with Spring Boot [here](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html)

You should also need to install the [Spring Boot CLI](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-installing-the-cli)

Clone the repository and run:
```
npm install && npm run build
```
The application will look for the data set in a file called `cc-maps-data-set.csv` in the project root directory.

Start the server:
```
gradle bootRun
```

Then navigate to the host running on port 8080 in your browser

