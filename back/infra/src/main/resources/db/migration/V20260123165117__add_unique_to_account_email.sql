-- Add UNIQUE constraint to account.email
ALTER TABLE account ADD CONSTRAINT uk_account_email UNIQUE (email);
