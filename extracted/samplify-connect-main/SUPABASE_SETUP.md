
# Supabase Setup Guide

This guide will help you set up your Supabase project for the SamplifyCare application.

## Setup Steps

1. **Create a Supabase Project**:
   - The app is currently configured to use the following Supabase project:
     ```
     SUPABASE_URL=https://kbpajbqktyojbkgdzjwu.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticGFqYnFrdHlvamJrZ2R6and1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTkzMzgsImV4cCI6MjA1ODYzNTMzOH0.-C7YSeO2zFcsfbJxowvjJlTSpGwDkyb0Oxh0svqUDGQ
     ```
   - If you want to use your own project, go to [Supabase](https://supabase.com) and sign in or create an account.
   - Create a new project and note your project URL and anon key.

2. **Set Up Database Tables**:
   - Navigate to the SQL Editor in your Supabase dashboard.
   - Create a new query.
   - Copy the contents of `src/lib/supabase/schema.sql` and paste them into the query editor.
   - Run the query to create all necessary tables and sample data.

3. **Configure Authentication**:
   - Go to Authentication settings in your Supabase dashboard.
   - Enable Email authentication.
   - Configure any additional authentication providers if desired.

4. **Update Environment Variables** (if using your own project):
   - Update the environment variables in your application:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Testing Your Setup**:
   - You can test the setup by registering a new user using the application.
   - Or you can use the sample credentials:
     - Professional: doctor@example.com (you'll need to set a password via "Forgot Password")
     - Patient: patient@example.com (you'll need to set a password via "Forgot Password")

## Database Schema

The application uses the following tables:

- `users`: Stores basic user information
- `patients`: Stores patient-specific information
- `professionals`: Stores healthcare professional information
- `appointments`: Manages appointments between patients and professionals
- `consultations`: Records of completed consultations
- `medical_results`: Stores medical test results

## Troubleshooting

- **Authentication Issues**: Ensure that email authentication is enabled in your Supabase project.
- **Database Errors**: Check the SQL Editor logs for any errors during table creation.
- **Connection Issues**: Verify that your environment variables are set correctly.
