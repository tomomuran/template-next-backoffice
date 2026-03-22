do $$
declare
  admin_user_id constant uuid := '11111111-1111-1111-1111-111111111111';
  member_user_id constant uuid := '22222222-2222-2222-2222-222222222222';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values
    (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('ChangeMe123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"display_name":"Template Admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      member_user_id,
      'authenticated',
      'authenticated',
      'member@example.com',
      crypt('ChangeMe123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"display_name":"Template Member"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
  on conflict (id) do update
  set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at
  )
  values
    (
      admin_user_id,
      admin_user_id,
      jsonb_build_object('sub', admin_user_id::text, 'email', 'admin@example.com'),
      'email',
      'admin@example.com',
      now(),
      now()
    ),
    (
      member_user_id,
      member_user_id,
      jsonb_build_object('sub', member_user_id::text, 'email', 'member@example.com'),
      'email',
      'member@example.com',
      now(),
      now()
    )
  on conflict (provider, provider_id) do update
  set
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.user_profiles (
    id,
    display_name,
    role,
    status,
    created_by,
    updated_by
  )
  values
    (
      admin_user_id,
      'Template Admin',
      'admin',
      'active',
      admin_user_id,
      admin_user_id
    ),
    (
      member_user_id,
      'Template Member',
      'member',
      'active',
      admin_user_id,
      admin_user_id
    )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    role = excluded.role,
    status = excluded.status,
    updated_by = excluded.updated_by,
    updated_at = now();
end
$$;

insert into public.contacts (
  first_name,
  last_name,
  company_name,
  email,
  phone,
  status,
  notes,
  created_by,
  updated_by
)
values
  (
    'Taro',
    'Template',
    'Open Field Inc.',
    'taro@example.com',
    '03-1234-5678',
    'lead',
    'Supabase local の初期データです',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Hanako',
    'Backoffice',
    'Northwind Parking',
    'hanako@example.com',
    '03-9876-5432',
    'active',
    'contacts サンプル feature の確認用データです',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111'
  )
on conflict do nothing;
