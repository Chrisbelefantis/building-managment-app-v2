-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Φιλοξενητής: 127.0.0.1
-- Χρόνος δημιουργίας: 26 Δεκ 2021 στις 16:48:14
-- Έκδοση διακομιστή: 10.4.17-MariaDB
-- Έκδοση PHP: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `building_managment`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `user_email` varchar(200) NOT NULL,
  `appartment_building` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `apartment_building`
--

CREATE TABLE `apartment_building` (
  `appartment_building_id` int(11) NOT NULL,
  `appartments` int(11) DEFAULT NULL,
  `location` varchar(250) DEFAULT NULL,
  `admin_email` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Άδειασμα δεδομένων του πίνακα `apartment_building`
--

INSERT INTO `apartment_building` (`appartment_building_id`, `appartments`, `location`, `admin_email`) VALUES
(1, 30, 'Παπαφλέσσα 36-38,26222 Πάτρα ', 'vaskar@yahoo.gr');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `appartment`
--

CREATE TABLE `appartment` (
  `appartment_id` int(11) NOT NULL,
  `appartment_building` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `dept`
--

CREATE TABLE `dept` (
  `dept_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `user` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `month` varchar(200) NOT NULL,
  `is_owner_expense` bit(1) NOT NULL,
  `appartment_building` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `user`
--

CREATE TABLE `user` (
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `isAppartmentBuildingAdmin` int(1) NOT NULL DEFAULT 0,
  `appartmentBuilding` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Άδειασμα δεδομένων του πίνακα `user`
--

INSERT INTO `user` (`username`, `password`, `email`, `isAppartmentBuildingAdmin`, `appartmentBuilding`) VALUES
('chrisbele', 'chrisbele', 'chrisbele@yahoo.gr', 0, 1),
('gournie', 'gournie', 'gournie@yahoo.gr', 1, 1),
('vaskar', 'vaskar', 'vaskar@yahoo.gr', 0, 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `user_appartment`
--

CREATE TABLE `user_appartment` (
  `user_email` varchar(200) NOT NULL,
  `appartment_id` int(11) NOT NULL,
  `relation_type` enum('owner','tenant') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`),
  ADD KEY `USER_BUILDING_MANAGMENT_FOREIGN_KEY` (`user_email`),
  ADD KEY `APPARTMENT_BUILDING_ANNOUNCEMENTS_FOREIGN_KEY` (`appartment_building`);

--
-- Ευρετήρια για πίνακα `apartment_building`
--
ALTER TABLE `apartment_building`
  ADD PRIMARY KEY (`appartment_building_id`);

--
-- Ευρετήρια για πίνακα `appartment`
--
ALTER TABLE `appartment`
  ADD PRIMARY KEY (`appartment_id`),
  ADD KEY `APPARMENT_BUILDING_KEY` (`appartment_building`);

--
-- Ευρετήρια για πίνακα `dept`
--
ALTER TABLE `dept`
  ADD PRIMARY KEY (`dept_id`),
  ADD KEY `USER_DEPT_FOREIGN_KEY` (`user`);

--
-- Ευρετήρια για πίνακα `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `APPARTMENT_BUILDING_FOREIGN_KEY` (`appartment_building`);

--
-- Ευρετήρια για πίνακα `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`email`),
  ADD KEY `USER_APPARTMENT_BUILDING_FOREIGN_KEY` (`appartmentBuilding`);

--
-- Ευρετήρια για πίνακα `user_appartment`
--
ALTER TABLE `user_appartment`
  ADD PRIMARY KEY (`user_email`,`appartment_id`),
  ADD KEY `APPARTMENT_FOREIGN_KEY` (`appartment_id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `apartment_building`
--
ALTER TABLE `apartment_building`
  MODIFY `appartment_building_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT για πίνακα `appartment`
--
ALTER TABLE `appartment`
  MODIFY `appartment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `dept`
--
ALTER TABLE `dept`
  MODIFY `dept_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `APPARTMENT_BUILDING_ANNOUNCEMENTS_FOREIGN_KEY` FOREIGN KEY (`appartment_building`) REFERENCES `apartment_building` (`appartment_building_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `USER_BUILDING_MANAGMENT_FOREIGN_KEY` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Περιορισμοί για πίνακα `appartment`
--
ALTER TABLE `appartment`
  ADD CONSTRAINT `APPARMENT_BUILDING_KEY` FOREIGN KEY (`appartment_building`) REFERENCES `apartment_building` (`appartment_building_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Περιορισμοί για πίνακα `dept`
--
ALTER TABLE `dept`
  ADD CONSTRAINT `USER_DEPT_FOREIGN_KEY` FOREIGN KEY (`user`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Περιορισμοί για πίνακα `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `APPARTMENT_BUILDING_FOREIGN_KEY` FOREIGN KEY (`appartment_building`) REFERENCES `apartment_building` (`appartment_building_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Περιορισμοί για πίνακα `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `USER_APPARTMENT_BUILDING_FOREIGN_KEY` FOREIGN KEY (`appartmentBuilding`) REFERENCES `apartment_building` (`appartment_building_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Περιορισμοί για πίνακα `user_appartment`
--
ALTER TABLE `user_appartment`
  ADD CONSTRAINT `APPARTMENT_FOREIGN_KEY` FOREIGN KEY (`appartment_id`) REFERENCES `appartment` (`appartment_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `USER_APPARTMENT_FOREIGN_KEY` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
