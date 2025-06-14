
insert into public.user_roles (user_id, role)
values ('43bcd10f-8349-4a7a-bb07-a189330df4f8', 'admin')
on conflict (user_id, role) do nothing;
