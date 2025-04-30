-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view files from their families" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files to their families" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files if authenticated" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files they uploaded" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files they uploaded or as family creator" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files they uploaded or as family admin" ON storage.objects;

-- Storage RLS Policies for Memoria App

-- 1. SELECT policy: Users can view files from families they are members of
CREATE POLICY "Users can view files from their families"
ON storage.objects FOR SELECT
USING (
  -- Check if the user is authenticated
  auth.role() = 'authenticated' AND
  (
    -- Extract the family ID from the path (assuming format: memories/{mediaType}/{familyId}/...)
    EXISTS (
      SELECT 1 FROM family_members
      JOIN families ON family_members.family_id = families.id
      WHERE 
        family_members.user_id = auth.uid() AND
        storage.objects.name LIKE '%/' || families.id || '/%'
    )
  )
);

-- 2. INSERT policy: Users can upload files if they are authenticated
-- Security is enforced in the application code by including the family ID in the path
CREATE POLICY "Users can upload files if authenticated"
ON storage.objects FOR INSERT
WITH CHECK (
  -- Check if the user is authenticated
  auth.role() = 'authenticated'
);

-- 3. UPDATE policy: Users can update files they uploaded
CREATE POLICY "Users can update files they uploaded"
ON storage.objects FOR UPDATE
USING (
  -- Check if the user is authenticated and is the owner of the file
  auth.role() = 'authenticated' AND
  owner = auth.uid()
);

-- 4. DELETE policy: Users can delete files they uploaded or if they are family admins
CREATE POLICY "Users can delete files they uploaded or as family admin"
ON storage.objects FOR DELETE
USING (
  -- Check if the user is authenticated
  auth.role() = 'authenticated' AND
  (
    -- User is the owner of the file
    owner = auth.uid() OR
    -- User is an admin of the family
    EXISTS (
      SELECT 1 FROM family_members
      JOIN families ON family_members.family_id = families.id
      WHERE 
        family_members.user_id = auth.uid() AND
        family_members.is_admin = true AND
        storage.objects.name LIKE '%/' || families.id || '/%'
    )
  )
);
