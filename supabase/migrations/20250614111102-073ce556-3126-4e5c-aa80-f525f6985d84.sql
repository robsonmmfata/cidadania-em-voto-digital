
-- Pegue o user_id do usuário pelo e-mail
insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'robsonalexmmfata@gmail.com'
on conflict (user_id, role) do nothing;
