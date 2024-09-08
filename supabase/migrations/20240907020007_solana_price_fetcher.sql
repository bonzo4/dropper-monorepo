

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_giveaway_sol_usd_value()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    response jsonb;
    price_usd numeric;
BEGIN
    -- Fetch data from the API
    SELECT content::jsonb INTO response
    FROM http_get('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');

    -- Check if the response contains pairs and if the priceUsd is a valid number
    IF response->'pairs' IS NOT NULL AND jsonb_typeof(response->'pairs'->0->'priceUsd') = 'string' THEN
        -- Attempt to convert the priceUsd to numeric
        BEGIN
            price_usd := (response->'pairs'->0->>'priceUsd')::numeric;
        EXCEPTION
            WHEN others THEN
                RAISE WARNING 'Failed to convert priceUsd to numeric: %', response->'pairs'->0->>'priceUsd';
                RETURN; -- Exit the function if conversion fails
        END;
    ELSE
        RAISE WARNING 'No valid pairs found in the response or priceUsd is not a string.';
        RETURN; -- Exit the function if no valid pairs
    END IF;

    -- Update ongoing giveaways without a token_address, where start_time and end_time are after now
    UPDATE public.giveaways
    SET usd_value = reward_amount * price_usd
    WHERE token_address IS NULL
      AND start_time < now()
      AND end_time > now();

    RAISE NOTICE 'Updated usd_value for ongoing giveaways without token_address, with start_time and end_time after now.';
END;
$function$
;

SELECT
  cron.schedule (
    'update-giveaway-sol-usd-value',
    '*/1 * * * * *',
    'SELECT update_giveaway_sol_usd_value();'
  );