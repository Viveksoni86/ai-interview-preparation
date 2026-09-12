# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application (skipping tests for faster deployment)
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render will automatically inject the PORT environment variable)
EXPOSE 9080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
