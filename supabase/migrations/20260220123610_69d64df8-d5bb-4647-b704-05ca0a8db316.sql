
-- Create island-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('island-images', 'island-images', true);

-- Allow public read access
CREATE POLICY "Island images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'island-images');

-- Allow service role to upload
CREATE POLICY "Service role can upload island images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'island-images');

CREATE POLICY "Service role can update island images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'island-images');
