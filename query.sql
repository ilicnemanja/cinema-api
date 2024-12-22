CREATE DATABASE IF NOT EXISTS `cinema`;

USE `cinema`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `movie` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255),
  `rating` varchar(255),
  `release_date` date NOT NULL,
  `duration` DECIMAL(4,2) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `genre` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `movie_genre` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `movie_id` varchar(255) NOT NULL,
  `genre_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`),
  FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hall` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `seats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `row_number` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `hall_id` int(11) NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`hall_id`) REFERENCES `hall`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `showtime` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `movie_id` varchar(255) NOT NULL,
  `hall_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `release_date` date NOT NULL,
  `isActive` bit NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`),
  FOREIGN KEY (`hall_id`) REFERENCES `hall`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `showtime_id` int(11) NOT NULL,
  `seat_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` enum('RESERVED', 'SOLD') NOT NULL DEFAULT 'RESERVED',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`showtime_id`) REFERENCES `showtime`(`id`),
  FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- select all available seats for showtime 
-- SELECT s.`row_number`, s.number, h.name
-- FROM seats s
-- JOIN hall h ON s.hall_id = h.id
-- JOIN showtime st ON st.hall_id = h.id
-- LEFT JOIN ticket t ON t.seat_id = s.id AND t.showtime_id = st.id
-- WHERE st.id = 2 AND s.status = 'AVAILABLE';