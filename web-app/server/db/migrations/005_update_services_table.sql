-- Update services table to use vendor_id as a foreign key
ALTER TABLE services
    MODIFY COLUMN preferred_vendor VARCHAR(20),
    ADD CONSTRAINT fk_preferred_vendor
    FOREIGN KEY (preferred_vendor)
    REFERENCES vendors(vendor_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE; 