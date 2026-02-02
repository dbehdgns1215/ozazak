
ALTER TABLE recruitment ADD COLUMN category_id INTEGER;
ALTER TABLE recruitment ADD CONSTRAINT fk_recruitment_category FOREIGN KEY (category_id) REFERENCES category(id);
