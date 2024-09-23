-- Add a Supabase Vault secret called app_password
SELECT vault.create_secret(
    '123456',
    'giveaway_password'
);