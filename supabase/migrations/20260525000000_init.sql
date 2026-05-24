-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. Businesses Table
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete cascade not null,
  name text not null,
  industry text,
  primary_channel text,
  country text,
  monthly_revenue text,
  age text,
  paid_ad_manager text,
  supplier_relationship_manager text,
  has_documented_sops text,
  exit_timeframe text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.businesses enable row level security;

-- Policies for Businesses
create policy "Users can view their own businesses"
  on public.businesses for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own businesses"
  on public.businesses for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own businesses"
  on public.businesses for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete their own businesses"
  on public.businesses for delete
  using (auth.uid() = owner_id);

-- 3. Valuation Data Table
create table public.valuation_data (
  business_id uuid references public.businesses on delete cascade primary key,
  exit_score integer default 0,
  valuation_low numeric default 0,
  valuation_mid numeric default 0,
  valuation_high numeric default 0,
  valuation_optimised numeric default 0,
  current_multiple numeric default 0,
  optimised_multiple numeric default 0,
  quick_sale numeric default 0,
  fair_market numeric default 0,
  optimised numeric default 0,
  adjusted_earnings numeric default 0,
  value_gap numeric default 0,
  repeat_rate numeric default 0,
  avg_order_value numeric default 0,
  roas numeric default 0,
  top_product_share numeric default 0,
  risk_score numeric default 0,
  total_value_lost numeric default 0,
  data_confidence numeric default 0,
  connected_sources text[] default '{}',
  missing_sources text[] default '{}',
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.valuation_data enable row level security;

-- Policies for Valuation Data
create policy "Users can view valuation data for their own businesses"
  on public.valuation_data for select
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.valuation_data.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can insert valuation data for their own businesses"
  on public.valuation_data for insert
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.valuation_data.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can update valuation data for their own businesses"
  on public.valuation_data for update
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.valuation_data.business_id
    and public.businesses.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.valuation_data.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can delete valuation data for their own businesses"
  on public.valuation_data for delete
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.valuation_data.business_id
    and public.businesses.owner_id = auth.uid()
  ));

-- 4. Risks Table
create table public.risks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses on delete cascade not null,
  title text not null,
  severity text not null,
  description text,
  impact numeric default 0,
  buyer_sees text,
  buyer_fears text,
  buyer_does text,
  recommendation text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.risks enable row level security;

-- Policies for Risks
create policy "Users can view risks for their own businesses"
  on public.risks for select
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.risks.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can insert risks for their own businesses"
  on public.risks for insert
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.risks.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can update risks for their own businesses"
  on public.risks for update
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.risks.business_id
    and public.businesses.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.risks.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can delete risks for their own businesses"
  on public.risks for delete
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.risks.business_id
    and public.businesses.owner_id = auth.uid()
  ));

-- 5. Actions Table
create table public.actions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses on delete cascade not null,
  title text not null,
  priority text not null,
  uplift numeric default 0,
  time text,
  problem text,
  steps text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.actions enable row level security;

-- Policies for Actions
create policy "Users can view actions for their own businesses"
  on public.actions for select
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.actions.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can insert actions for their own businesses"
  on public.actions for insert
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.actions.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can update actions for their own businesses"
  on public.actions for update
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.actions.business_id
    and public.businesses.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.actions.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can delete actions for their own businesses"
  on public.actions for delete
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.actions.business_id
    and public.businesses.owner_id = auth.uid()
  ));

-- 6. Documents Table
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses on delete cascade not null,
  category text not null,
  name text not null,
  uploaded boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.documents enable row level security;

-- Policies for Documents
create policy "Users can view documents for their own businesses"
  on public.documents for select
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.documents.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can insert documents for their own businesses"
  on public.documents for insert
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.documents.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can update documents for their own businesses"
  on public.documents for update
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.documents.business_id
    and public.businesses.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.businesses
    where public.businesses.id = public.documents.business_id
    and public.businesses.owner_id = auth.uid()
  ));

create policy "Users can delete documents for their own businesses"
  on public.documents for delete
  using (exists (
    select 1 from public.businesses
    where public.businesses.id = public.documents.business_id
    and public.businesses.owner_id = auth.uid()
  ));

-- 7. Auto-Seeding Trigger & Profiles Trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_business_id uuid;
begin
  -- A. Insert user profile
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  -- B. Insert default business (NovaSkin Co.)
  insert into public.businesses (
    owner_id, name, industry, primary_channel, country, monthly_revenue, age,
    paid_ad_manager, supplier_relationship_manager, has_documented_sops, exit_timeframe
  )
  values (
    new.id,
    'NovaSkin Co.',
    'Beauty & Skincare',
    'Shopify',
    'United Kingdom',
    '£25k–£50k',
    '2–3 years',
    'Me',
    'Me',
    'Partially',
    '12 months'
  )
  returning id into new_business_id;

  -- C. Insert default valuation metrics
  insert into public.valuation_data (
    business_id, exit_score, valuation_low, valuation_mid, valuation_high, valuation_optimised,
    current_multiple, optimised_multiple, quick_sale, fair_market, optimised, adjusted_earnings,
    value_gap, repeat_rate, avg_order_value, roas, top_product_share, risk_score, total_value_lost,
    data_confidence, connected_sources, missing_sources
  )
  values (
    new_business_id,
    62, 180000, 220000, 260000, 340000,
    1.6, 2.4, 90000, 220000, 340000, 100000,
    80000, 0.24, 68, 2.8, 0.72, 48, 120000,
    72,
    array['shopify', 'meta_ads', 'google_ads'],
    array['ga4', 'pl_upload', 'stripe']
  );

  -- D. Insert default risks
  insert into public.risks (business_id, title, severity, description, impact, buyer_sees, buyer_fears, buyer_does, recommendation)
  values
    (
      new_business_id,
      'Product Concentration',
      'high',
      '72% of revenue comes from a single SKU.',
      -45000,
      'A single-product business with no resilience to category shifts or supplier issues.',
      'If demand for the hero SKU softens by 20%, valuation collapses.',
      'Lower offer by 0.3x or insert a 24-month earnout tied to product diversification.',
      'Launch 2 adjacent SKUs within 90 days and rebalance ad spend to drive trial.'
    ),
    (
      new_business_id,
      'Founder Dependency',
      'high',
      'Founder personally manages ads, ops and supplier relationships.',
      -35000,
      'A job, not a transferable asset. The business is the founder.',
      'Operations stall the moment the founder steps away post-close.',
      'Demand a 6-12 month transition agreement or walk away.',
      'Document SOPs across the 5 highest-leverage workflows and assign deputies.'
    ),
    (
      new_business_id,
      'Marketing Channel Risk',
      'medium',
      '85% of acquisition is paid Meta, with no organic moat.',
      -40000,
      'A business renting attention, not owning it.',
      'iOS, algorithm or auction shifts erase margin overnight.',
      'Discount EBITDA multiple or require channel diversification proof.',
      'Stand up an SEO content engine and email/SMS lifecycle in 60 days.'
    );

  -- E. Insert default actions
  insert into public.actions (business_id, title, priority, uplift, time, problem, steps)
  values
    (
      new_business_id,
      'Reduce Product Concentration',
      'high',
      45000,
      '2–6 weeks',
      '72% of revenue from 1 product suppresses multiple by 0.3x.',
      array[
        'Identify 2 adjacent SKUs with overlapping customer intent.',
        'Allocate 25% of monthly ad budget to launch trials.',
        'Track per-SKU contribution margin weekly for 90 days.'
      ]
    ),
    (
      new_business_id,
      'Document SOPs & Reduce Founder Dependency',
      'high',
      35000,
      '3–6 weeks',
      'Founder is the single point of failure across ads, ops and suppliers.',
      array[
        'Map the 10 most repeated workflows owned by founder.',
        'Record loom-based SOPs for each and store in the data room.',
        'Assign a deputy for each workflow and shadow for two weeks.'
      ]
    ),
    (
      new_business_id,
      'Diversify Marketing Channels',
      'medium',
      40000,
      '4–8 weeks',
      '85% paid acquisition with no organic moat suppresses defensibility.',
      array[
        'Stand up a 12-piece SEO content roadmap targeting category intent.',
        'Launch a 6-step email lifecycle covering welcome, browse, post-purchase.',
        'Open a TikTok organic channel with 4 posts/week to build owned audience.'
      ]
    );

  -- F. Insert default documents
  insert into public.documents (business_id, category, name, uploaded)
  values
    (new_business_id, 'Financial Documents', 'Profit & Loss Statement (12 months)', true),
    (new_business_id, 'Financial Documents', 'Revenue by Channel', true),
    (new_business_id, 'Financial Documents', 'Ad Spend Report', true),
    (new_business_id, 'Financial Documents', 'Balance Sheet', false),
    (new_business_id, 'Financial Documents', 'Bank Statements (3 months)', false),
    (new_business_id, 'Financial Documents', 'Tax Returns', false),
    (new_business_id, 'Financial Documents', 'COGS Documentation', false),
    (new_business_id, 'Operations Documents', 'Product Catalog', true),
    (new_business_id, 'Operations Documents', 'Supplier Contracts', false),
    (new_business_id, 'Operations Documents', 'SOP Documentation', false),
    (new_business_id, 'Operations Documents', 'Team Structure', false),
    (new_business_id, 'Operations Documents', 'Technology Stack Overview', false),
    (new_business_id, 'Marketing Evidence', 'Meta Ads Performance', true),
    (new_business_id, 'Marketing Evidence', 'Google Ads Performance', true),
    (new_business_id, 'Marketing Evidence', 'Shopify Analytics Export', true),
    (new_business_id, 'Marketing Evidence', 'Email Marketing Stats', false),
    (new_business_id, 'Legal Documents', 'Articles of Incorporation', false),
    (new_business_id, 'Legal Documents', 'Trademark Registrations', false),
    (new_business_id, 'Legal Documents', 'Material Contracts', false);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to fire on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
