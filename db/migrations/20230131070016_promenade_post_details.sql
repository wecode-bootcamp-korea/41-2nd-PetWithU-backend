-- migrate:up
CREATE TABLE promenade_post_details (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content VARCHAR(1000) NULL,
  image_url VARCHAR(255) NOT NULL,
  map_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES promenade_posts (id)
);

-- migrate:down
DROP TABLE promenade_post_details;
