ALTER TABLE usr ADD last_successful_login timestamptz(6);
ALTER TABLE usr ADD last_failed_login timestamptz(6);
ALTER TABLE usr ADD last_link_sent timestamptz(6);
ALTER TABLE usr ADD failed_login_attempts INT NOT NULL DEFAULT 0;

