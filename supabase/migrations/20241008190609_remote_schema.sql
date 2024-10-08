set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_giveaway_trending_scores()
 RETURNS void
 LANGUAGE plpgsql
AS $function$

DECLARE
    giveaway_record RECORD;
    total_duration_minutes bigint;
    time_remaining_minutes bigint;
    view_rate numeric;
    entries_rate numeric;
    clicks_rate numeric;
    normalized_trending_score numeric;
    interval_minutes numeric;

BEGIN
    -- Loop through giveaways that match specific time intervals for evaluation
    FOR giveaway_record IN
        SELECT g.id, g.start_time, g.end_time, 
               gs.period_views, gs.period_entries, gs.period_link_clicks,
               EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60 AS minutes_since_start
        FROM giveaways g
        JOIN giveaway_stats gs ON g.id = gs.giveaway_id
        WHERE NOW() BETWEEN g.start_time AND g.end_time
        AND (
            -- Every 15 minutes interval
            MOD(EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60, 15) = 0
            OR
            -- Every 30 minutes interval
            MOD(EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60, 30) = 0
            OR
            -- Every 1 hour interval
            MOD(EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60, 60) = 0
            OR
            -- Every 2 hours interval
            MOD(EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60, 120) = 0
            OR
            -- Every 3 hours interval
            MOD(EXTRACT(EPOCH FROM (NOW() - g.start_time)) / 60, 180) = 0
        )
    LOOP
        total_duration_minutes := EXTRACT(EPOCH FROM (giveaway_record.end_time - giveaway_record.start_time)) / 60;
        time_remaining_minutes := EXTRACT(EPOCH FROM (giveaway_record.end_time - NOW())) / 60;

        -- Determine the interval based on the total duration and remaining time
        IF total_duration_minutes <= 360 THEN  -- Less than 6 hours
            IF time_remaining_minutes <= 30 THEN
                interval_minutes := 15;
            ELSIF time_remaining_minutes <= (total_duration_minutes / 2) THEN
                interval_minutes := 30;
            ELSE
                interval_minutes := 60;
            END IF;
        ELSIF total_duration_minutes <= 720 THEN  -- Between 6 to 12 hours
            IF time_remaining_minutes <= 60 THEN
                interval_minutes := 30;
            ELSIF time_remaining_minutes <= (total_duration_minutes / 2) THEN
                interval_minutes := 60;
            ELSE
                interval_minutes := 120;
            END IF;
        ELSE  -- Greater than 12 hours
            IF time_remaining_minutes <= 120 THEN
                interval_minutes := 15;
            ELSIF time_remaining_minutes <= (total_duration_minutes / 3) THEN
                interval_minutes := 60;
            ELSE
                interval_minutes := 180;
            END IF;
        END IF;

        -- Calculate view rate, entries rate, and clicks rate per interval
        view_rate := (giveaway_record.period_views / interval_minutes) * 60;  -- Views per hour
        entries_rate := (giveaway_record.period_entries / interval_minutes) * 60;  -- Entries per hour
        clicks_rate := (giveaway_record.period_link_clicks / interval_minutes) * 60;  -- Clicks per hour

        -- Calculate normalized trending score
        normalized_trending_score := (view_rate * 0.15) + 
                                     (entries_rate * 0.6) + 
                                     (clicks_rate * 0.25);

        -- Update the trending score for the giveaway
        UPDATE giveaways 
        SET trending_score = trending_score + normalized_trending_score,
            total_views = 0,   -- Reset views
            total_entries = 0, -- Reset entries
            total_link_clicks = 0 -- Reset link clicks
        WHERE id = giveaway_record.id;

    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_trending_scores()
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    listing_record RECORD;
    views_rate numeric;
    comments_rate numeric;
    clicks_rate numeric;
    refreshes_rate numeric;
    trending_score numeric;
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
        trending_score := views_rate + comments_rate + clicks_rate + refreshes_rate;

        -- Update the trending score in the listing table
        UPDATE listings
        SET trending_score = trending_score  -- You can choose to accumulate or just set it to trending_score
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
;


