-- Drop the function if it exists to avoid conflicts
drop function if exists public.update_product_positions(jsonb);

-- Create a function to update product positions in batch
create or replace function public.update_product_positions(product_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i integer := 1;
  product_id uuid;
begin
  -- Start a transaction
  begin
    -- Update each product's position based on array order
    foreach product_id in array product_ids
    loop
      update public.products
      set position = i,
          updated_at = timezone('utc'::text, now())
      where id = product_id;
      i := i + 1;
    end loop;
  exception
    when others then
      -- Rollback the transaction on error
      raise exception 'Failed to update product positions: %', sqlerrm;
  end;
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.update_product_positions(uuid[]) to authenticated;

-- Add a trigger to ensure position is always set
create or replace function public.ensure_product_position()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If position is not set, set it to the max position + 1
  if new.position is null then
    select coalesce(max(position), 0) + 1 into new.position
    from public.products;
  end if;
  return new;
end;
$$;

-- Create the trigger
drop trigger if exists ensure_product_position_trigger on public.products;
create trigger ensure_product_position_trigger
  before insert on public.products
  for each row
  execute function public.ensure_product_position(); 