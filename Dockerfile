# Use a lightweight OpenJDK base image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from your target (Maven) or build/libs (Gradle) folder
# Replace 'your-app-name.jar' with your actual JAR filename
COPY target/*.jar app.jar

#Expose the port your app runs on
EXPOSE 8086

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]