CREATE OR REPLACE FUNCTION public.update_listing_trending_scores()
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    listing_record RECORD;
    views_rate numeric;
    comments_rate numeric;
    clicks_rate numeric;
    refreshes_rate numeric;
    score numeric;
BEGIN
    -- Loop through each active listing
    FOR listing_record IN
        SELECT l.id, ls.period_views, ls.period_comments, ls.period_link_clicks, ls.period_bumps
        FROM listings l
        JOIN listing_stats ls ON l.id = ls.listing_id
    LOOP
        -- Calculate the weighted score for each listing
        views_rate := listing_record.period_views * 0.2;
        comments_rate := listing_record.period_comments * 0.4;
        clicks_rate := listing_record.period_link_clicks * 0.3;
        refreshes_rate := listing_record.period_bumps * 0.5;

        -- Calculate the trending score as the sum of all weighted engagement metrics
        score := views_rate + comments_rate + clicks_rate + refreshes_rate;

        -- Update the trending score in the listing table
        UPDATE listings
        SET trending_score = score  -- You can choose to accumulate or just set it to trending_score
        WHERE id = listing_record.id;

        -- Optionally, you can reset the stats after every period
        UPDATE listing_stats
        SET period_views = 0,
            period_comments = 0,
            period_link_clicks = 0,
            period_bumps = 0
        WHERE listing_id = listing_record.id;
    END LOOP;
END;$function$