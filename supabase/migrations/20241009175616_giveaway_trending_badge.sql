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

        -- Check if there are at least 10 giveaways
    IF (SELECT COUNT(*) FROM giveaways WHERE NOW() BETWEEN start_time AND end_time) >= 10 THEN
        -- Find the giveaway with the highest trending score
        SELECT id INTO top_trending
        FROM giveaways
        WHERE NOW() BETWEEN start_time AND end_time
        ORDER BY trending_score DESC
        LIMIT (SELECT CEIL(COUNT(*) * 0.1) FROM giveaways WHERE NOW() BETWEEN start_time AND end_time);

        -- Append the 'TRENDING' badge if not already present
        IF top_trending IS NOT NULL THEN
            UPDATE giveaways
            SET badges = array_append(badges, 'TRENDING')
            WHERE id = top_trending.id
            AND 'TRENDING' != ALL(badges);  -- Ensure 'TRENDING' is not already in badges
        END IF;
    END IF;
END;
$function$
;