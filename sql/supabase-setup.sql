create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text not null,
  tags text[] default '{}',
  file_url text,
  file_path text,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
on public.projects
for select
using (true);

drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
on public.projects
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read project files" on storage.objects;
create policy "Public can read project files"
on storage.objects
for select
using (bucket_id = 'project-files');

drop policy if exists "Authenticated users can upload project files" on storage.objects;
create policy "Authenticated users can upload project files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-files');

drop policy if exists "Authenticated users can update project files" on storage.objects;
create policy "Authenticated users can update project files"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-files')
with check (bucket_id = 'project-files');

drop policy if exists "Authenticated users can delete project files" on storage.objects;
create policy "Authenticated users can delete project files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-files');

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  slot_number int not null unique check (slot_number between 1 and 10),
  title text not null,
  subject text,
  description text not null,
  link_url text,
  file_url text,
  file_path text,
  created_at timestamptz default now()
);

alter table public.assignments enable row level security;

drop policy if exists "Public can read assignments" on public.assignments;
create policy "Public can read assignments"
on public.assignments
for select
using (true);

drop policy if exists "Authenticated users can insert assignments" on public.assignments;
create policy "Authenticated users can insert assignments"
on public.assignments
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update assignments" on public.assignments;
create policy "Authenticated users can update assignments"
on public.assignments
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete assignments" on public.assignments;
create policy "Authenticated users can delete assignments"
on public.assignments
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('assignment-files', 'assignment-files', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read assignment files" on storage.objects;
create policy "Public can read assignment files"
on storage.objects
for select
using (bucket_id = 'assignment-files');

drop policy if exists "Authenticated users can upload assignment files" on storage.objects;
create policy "Authenticated users can upload assignment files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'assignment-files');

drop policy if exists "Authenticated users can update assignment files" on storage.objects;
create policy "Authenticated users can update assignment files"
on storage.objects
for update
to authenticated
using (bucket_id = 'assignment-files')
with check (bucket_id = 'assignment-files');

drop policy if exists "Authenticated users can delete assignment files" on storage.objects;
create policy "Authenticated users can delete assignment files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'assignment-files');
