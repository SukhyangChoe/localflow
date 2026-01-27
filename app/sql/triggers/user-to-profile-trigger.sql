create function public.user_to_profile_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    -- create a anonymous profile for the user
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            insert into public.profiles (profile_id, username, role, join_path)
            values (new.id, 'mr.'||substr(md5(random()::text), 1, 8), 'traveler', 'email');
        end if;
    end if;
    return new;
end;
$$;

create trigger user_to_profile_trigger
after insert on auth.users 
for each row execute function public.user_to_profile_trigger();