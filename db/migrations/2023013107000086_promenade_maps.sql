-- migrate:up
CREATE TABLE promenade_maps (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  location_id INT NOT NULL,
  latitude DECIMAL (18, 15) NULL,
  longitude DECIMAL (18, 15) NULL,
  text VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES promenade_posts (id)
);

-- migrate:down
DROP TABLE promenade_maps;