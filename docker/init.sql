-- Create application database
CREATE DATABASE pulltabs;
CREATE DATABASE pulltabs_test;

-- Create application user
CREATE USER pulltabs_user WITH PASSWORD 'pulltabs_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pulltabs TO pulltabs_user;
GRANT ALL PRIVILEGES ON DATABASE pulltabs_test TO pulltabs_user;

-- Connect to pulltabs database
\c pulltabs;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO pulltabs_user;

-- Connect to test database
\c pulltabs_test;

-- Grant schema permissions for test database
GRANT ALL ON SCHEMA public TO pulltabs_user;