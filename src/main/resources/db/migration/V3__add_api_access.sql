ALTER TYPE tp_user_role ADD VALUE 'Api';

ALTER TABLE destination ADD api_sync_last_article_synced timestamptz(6);
ALTER TABLE destination ADD api_sync_name VARCHAR(50);

CREATE UNIQUE INDEX idx_destination_api_sync_name ON destination (api_sync_name);
