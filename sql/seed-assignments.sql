-- Seed 10 assignment slots (slot_number 1..10)
-- Run this after `supabase-setup.sql` has created the assignments table.

INSERT INTO public.assignments (slot_number, title, subject, description, link_url, file_url, file_path)
VALUES
(1, 'Slot 1 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(2, 'Slot 2 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(3, 'Slot 3 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(4, 'Slot 4 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(5, 'Slot 5 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(6, 'Slot 6 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(7, 'Slot 7 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(8, 'Slot 8 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(9, 'Slot 9 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL),
(10, 'Slot 10 (empty)', 'Placeholder', 'Add title/description and optionally upload files.', '', NULL, NULL)
ON CONFLICT (slot_number) DO UPDATE
SET title = EXCLUDED.title,
    subject = EXCLUDED.subject,
    description = EXCLUDED.description,
    link_url = EXCLUDED.link_url,
    file_url = EXCLUDED.file_url,
    file_path = EXCLUDED.file_path;
