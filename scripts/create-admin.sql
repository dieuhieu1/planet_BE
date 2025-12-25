-- Script to create/update admin user for Planet8 application
-- Run this in your PostgreSQL database

-- Option 1: Update existing user to admin (replace with your user ID or email)
-- UPDATE "Users" SET role = 'admin' WHERE id = 1;
-- UPDATE "Users" SET role = 'admin' WHERE email = 'your-email@example.com';

-- Option 2: Check current roles of all users
SELECT id, username, email, role, "isVerified" 
FROM "Users" 
ORDER BY id;

-- Option 3: Promote first user to admin
UPDATE "Users" 
SET role = 'admin' 
WHERE id = (SELECT MIN(id) FROM "Users");

-- Verify the change
SELECT id, username, email, role 
FROM "Users" 
WHERE role = 'admin';
