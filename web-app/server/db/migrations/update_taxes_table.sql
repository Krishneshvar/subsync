ALTER TABLE taxes
  ADD COLUMN IF NOT EXISTS tax_rates JSON DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS default_tax_preference JSON DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gst_settings JSON DEFAULT '{}';
