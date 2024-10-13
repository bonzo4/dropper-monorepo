-- Add a Supabase Vault secret called app_password
SELECT vault.create_secret(
    '123456',
    'giveaway_password'
);

SELECT vault.create_secret(
    '654321',
    'listing_password'
);

SELECT vault.create_secret(
    'http://host.docker.internal:3000',
    'app_url'
);

SELECT vault.create_secret(
    'telegram',
    'telegram_password'
);