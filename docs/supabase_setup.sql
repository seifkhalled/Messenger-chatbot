-- SQL Setup for Supabase Leads Table
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS leads (
    psid TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Note: Since this is a server-side bot using an Anon Key (or Service Role), 
-- you may need to add a policy or disable RLS for the leads table 
-- if you are not using a Service Role key.
