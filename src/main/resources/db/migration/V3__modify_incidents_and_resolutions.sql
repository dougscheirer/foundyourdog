ALTER TABLE incidents
    DROP COLUMN resolution_id
;

ALTER TABLE resolutions
    DROP COLUMN resolve_text,
    ADD  COLUMN reason text NOT NULL,
    ADD  COLUMN additional_info text
;