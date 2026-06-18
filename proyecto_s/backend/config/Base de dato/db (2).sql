-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-06-2026 a las 00:20:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alineaciones`
--

CREATE TABLE `alineaciones` (
  `id_alineacion` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alineaciones`
--

INSERT INTO `alineaciones` (`id_alineacion`, `id_equipo`, `nombre`, `activa`) VALUES
(1, 3, 'Alineación 16/6/2026, 16:55:20', 1),
(2, 3, 'Alineación 16/6/2026, 17:12:30', 1),
(3, 3, 'Alineación 17/6/2026, 14:50:43', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alineacion_jugadores`
--

CREATE TABLE `alineacion_jugadores` (
  `id` int(11) NOT NULL,
  `id_alineacion` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `posicion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alineacion_jugadores`
--

INSERT INTO `alineacion_jugadores` (`id`, `id_alineacion`, `id_jugador`, `posicion`) VALUES
(12, 2, 1, 'a-por-1'),
(13, 2, 7, 'a-def-1'),
(14, 2, 2, 'a-def-2'),
(15, 2, 3, 'a-def-3'),
(16, 2, 8, 'a-def-4'),
(17, 2, 4, 'a-def-5'),
(18, 2, 6, 'a-piv-1'),
(19, 2, 5, 'a-piv-3'),
(20, 2, 11, 'a-del-3'),
(21, 2, 9, 'a-del-4'),
(22, 2, 10, 'a-med-2'),
(23, 3, 1, 'a-por-1'),
(24, 3, 7, 'a-def-1'),
(25, 3, 2, 'a-def-2'),
(26, 3, 8, 'a-def-4'),
(27, 3, 4, 'a-def-5'),
(28, 3, 6, 'a-piv-1'),
(29, 3, 5, 'a-piv-3'),
(30, 3, 3, 'a-med-3'),
(31, 3, 10, 'a-med-1'),
(32, 3, 11, 'a-del-5'),
(33, 3, 9, 'a-del-2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cronologias`
--

CREATE TABLE `cronologias` (
  `id_cronologia` int(11) NOT NULL,
  `id_encuentro` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `evento` enum('Gol','Amarilla','Roja') NOT NULL,
  `minuto` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cronologias`
--

INSERT INTO `cronologias` (`id_cronologia`, `id_encuentro`, `id_jugador`, `evento`, `minuto`) VALUES
(1, 1, 1, 'Gol', 12),
(2, 1, 2, 'Amarilla', 25),
(3, 1, 3, 'Gol', 40),
(4, 2, 4, 'Gol', 15),
(5, 2, 5, 'Roja', 33),
(6, 3, 6, 'Roja', 10),
(7, 3, 7, 'Amarilla', 22),
(8, 4, 8, 'Gol', 55),
(13, 1, 1, 'Gol', 100),
(14, 2, 8, 'Gol', 27),
(15, 26, 8, 'Gol', 70);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuentros`
--

CREATE TABLE `encuentros` (
  `id_encuentro` int(11) NOT NULL,
  `id_torneo` int(11) NOT NULL,
  `id_equipo_local` int(11) NOT NULL,
  `id_equipo_visitante` int(11) NOT NULL,
  `jornada` int(3) NOT NULL,
  `lugar` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('Pendiente','Jugando','Finalizado','Aplazado') NOT NULL DEFAULT 'Pendiente',
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `encuentros`
--

INSERT INTO `encuentros` (`id_encuentro`, `id_torneo`, `id_equipo_local`, `id_equipo_visitante`, `jornada`, `lugar`, `fecha`, `hora`, `estado`, `activo`) VALUES
(1, 1, 1, 2, 1, 'Estadio Central', '2026-05-01', '18:00:00', 'Finalizado', 1),
(2, 1, 3, 4, 1, 'Estadio Central', '2026-05-02', '18:00:00', 'Finalizado', 1),
(3, 1, 5, 6, 1, 'Estadio Central', '2026-05-03', '18:00:00', 'Finalizado', 1),
(4, 1, 7, 8, 1, 'Estadio Central', '2026-05-04', '18:00:00', 'Finalizado', 1),
(6, 2, 1, 3, 1, 'Estadio Norte', '2026-06-01', '16:00:00', 'Finalizado', 1),
(7, 2, 2, 4, 1, 'Estadio Norte', '2026-06-02', '16:00:00', 'Finalizado', 1),
(8, 2, 5, 7, 1, 'Estadio Norte', '2026-06-03', '16:00:00', 'Finalizado', 1),
(11, 1, 4, 5, 1, 'bosa centro', '2026-04-24', '00:00:00', 'Finalizado', 0),
(12, 1, 1, 6, 1, 'Por definir', '2026-05-26', '12:00:00', 'Finalizado', 1),
(13, 1, 2, 5, 1, 'Por definir', '2026-05-26', '12:00:00', 'Finalizado', 1),
(14, 1, 3, 4, 1, 'Por definir', '2026-05-26', '12:00:00', 'Finalizado', 1),
(15, 1, 1, 5, 2, 'Por definir', '2026-05-27', '12:00:00', 'Finalizado', 1),
(16, 1, 6, 4, 2, 'Por definir', '2026-05-27', '12:00:00', 'Finalizado', 1),
(17, 1, 2, 3, 2, 'Por definir', '2026-05-27', '12:00:00', 'Finalizado', 1),
(18, 1, 1, 4, 3, 'Por definir', '2026-05-28', '12:00:00', 'Finalizado', 1),
(19, 1, 5, 3, 3, 'Por definir', '2026-05-28', '12:00:00', 'Finalizado', 1),
(20, 1, 6, 2, 3, 'Por definir', '2026-05-28', '12:00:00', 'Finalizado', 1),
(21, 1, 1, 3, 4, 'Por definir', '2026-05-29', '12:00:00', 'Finalizado', 1),
(22, 1, 4, 2, 4, 'Por definir', '2026-05-29', '12:00:00', 'Finalizado', 1),
(23, 1, 5, 6, 4, 'Por definir', '2026-05-29', '12:00:00', 'Finalizado', 1),
(24, 1, 1, 2, 5, 'Por definir', '2026-05-30', '12:00:00', 'Finalizado', 1),
(25, 1, 3, 6, 5, 'Por definir', '2026-05-30', '12:00:00', 'Finalizado', 1),
(26, 1, 4, 5, 5, 'Por definir', '2026-05-30', '12:00:00', 'Finalizado', 1),
(27, 2, 2, 3, 2, 'mngtyujh', '2026-05-29', '13:30:00', 'Finalizado', 1),
(54, 15, 1, 6, 1, 'Por definir', '2026-06-03', '12:00:00', 'Finalizado', 1),
(55, 15, 2, 5, 1, 'parque de los principes', '2026-06-03', '12:00:00', 'Aplazado', 1),
(56, 15, 3, 4, 1, 'el campin', '2026-06-03', '12:00:00', 'Finalizado', 1),
(57, 15, 1, 5, 2, 'Por definir', '2026-06-04', '12:00:00', 'Finalizado', 1),
(58, 15, 6, 4, 2, 'Por definir', '2026-06-04', '12:00:00', 'Finalizado', 1),
(59, 15, 2, 3, 2, 'Por definir', '2026-06-04', '12:00:00', 'Finalizado', 1),
(60, 15, 1, 4, 3, 'Por definir', '2026-06-05', '12:00:00', 'Finalizado', 1),
(61, 15, 5, 3, 3, 'Por definir', '2026-06-05', '12:00:00', 'Finalizado', 1),
(62, 15, 6, 2, 3, 'Por definir', '2026-06-05', '12:00:00', 'Finalizado', 1),
(63, 15, 1, 3, 4, 'Por definir', '2026-06-06', '12:00:00', 'Finalizado', 1),
(64, 15, 4, 2, 4, 'Por definir', '2026-06-06', '12:00:00', 'Finalizado', 1),
(65, 15, 5, 6, 4, 'Por definir', '2026-06-06', '12:00:00', 'Finalizado', 1),
(66, 15, 1, 2, 5, 'Por definir', '2026-06-07', '12:00:00', 'Finalizado', 1),
(67, 15, 3, 6, 5, 'Por definir', '2026-06-07', '12:00:00', 'Finalizado', 1),
(68, 15, 4, 5, 5, 'Por definir', '2026-06-07', '12:00:00', 'Pendiente', 0),
(69, 15, 2, 5, 5, 'el campin', '2026-06-04', '19:30:00', 'Finalizado', 1),
(70, 15, 2, 4, 6, 'el metro', '2026-06-12', '17:24:00', 'Finalizado', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `escudo` varchar(255) NOT NULL,
  `nombre_equipo` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id_equipo`, `id_usuario`, `escudo`, `nombre_equipo`, `activo`) VALUES
(1, 19, 'escudo1.png', 'Millonarios', 1),
(2, 19, 'escudo2.png', 'Nacional', 1),
(3, 19, 'escudo3.png', 'America de Cali', 1),
(4, 19, 'escudo4.png', 'Junior', 1),
(5, 19, 'escudo5.png', 'Tolima', 1),
(6, 19, 'escudo6.png', 'Santa Fe', 1),
(7, 19, 'escudo7.png', 'Once Caldas', 1),
(8, 19, 'escudo8.png', 'Pasto', 1),
(9, 19, 'escudo9.png', 'Medellin a', 1),
(11, 19, 'wertyu', 'los maolos que no ganan', 0),
(12, 19, 'wdbieq', 'las mechas de jeus ', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcionesequipos`
--

CREATE TABLE `inscripcionesequipos` (
  `id_inscripcion_e` int(11) NOT NULL,
  `id_torneo` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `fecha_ins_equipo` datetime DEFAULT current_timestamp(),
  `estado` enum('Pendiente','Inscrito','Cancelado') NOT NULL DEFAULT 'Pendiente',
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripcionesequipos`
--

INSERT INTO `inscripcionesequipos` (`id_inscripcion_e`, `id_torneo`, `id_equipo`, `fecha_ins_equipo`, `estado`, `activo`) VALUES
(59, 1, 9, '2026-05-19 17:41:21', 'Inscrito', 1),
(61, 2, 1, '2026-05-19 17:41:21', 'Inscrito', 1),
(62, 2, 2, '2026-05-19 17:41:21', 'Pendiente', 1),
(63, 2, 3, '2026-05-19 17:41:21', 'Inscrito', 1),
(64, 2, 4, '2026-05-19 17:41:21', 'Inscrito', 1),
(65, 2, 5, '2026-05-19 17:41:21', 'Pendiente', 1),
(66, 2, 6, '2026-05-19 17:41:21', 'Inscrito', 1),
(67, 2, 7, '2026-05-19 17:41:21', 'Inscrito', 1),
(68, 2, 8, '2026-05-19 17:41:21', 'Pendiente', 1),
(69, 2, 9, '2026-05-19 17:41:21', 'Inscrito', 1),
(71, 3, 1, '2026-05-19 17:41:21', 'Pendiente', 1),
(72, 3, 2, '2026-05-19 17:41:21', 'Inscrito', 1),
(73, 3, 3, '2026-05-19 17:41:21', 'Inscrito', 1),
(74, 3, 4, '2026-05-19 17:41:21', 'Inscrito', 1),
(75, 3, 5, '2026-05-19 17:41:21', 'Pendiente', 1),
(76, 3, 6, '2026-05-19 17:41:21', 'Inscrito', 1),
(77, 3, 7, '2026-05-19 17:41:21', 'Pendiente', 1),
(78, 3, 8, '2026-05-19 17:41:21', 'Inscrito', 1),
(79, 3, 9, '2026-05-19 17:41:21', 'Inscrito', 1),
(81, 4, 1, '2026-05-19 17:41:21', 'Inscrito', 1),
(82, 4, 2, '2026-05-19 17:41:21', 'Inscrito', 1),
(83, 4, 3, '2026-05-19 17:41:21', 'Pendiente', 1),
(84, 4, 4, '2026-05-19 17:41:21', 'Inscrito', 1),
(85, 4, 5, '2026-05-19 17:41:21', 'Inscrito', 1),
(86, 4, 6, '2026-05-19 17:41:21', 'Pendiente', 1),
(87, 4, 7, '2026-05-19 17:41:21', 'Inscrito', 1),
(88, 4, 8, '2026-05-19 17:41:21', 'Inscrito', 1),
(89, 4, 9, '2026-05-19 17:41:21', 'Pendiente', 1),
(91, 5, 1, '2026-05-19 17:41:21', 'Inscrito', 1),
(92, 5, 2, '2026-05-19 17:41:21', 'Pendiente', 1),
(93, 5, 3, '2026-05-19 17:41:21', 'Inscrito', 1),
(94, 5, 4, '2026-05-19 17:41:21', 'Inscrito', 1),
(95, 5, 5, '2026-05-19 17:41:21', 'Inscrito', 1),
(96, 5, 6, '2026-05-19 17:41:21', 'Pendiente', 1),
(97, 5, 7, '2026-05-19 17:41:21', 'Inscrito', 1),
(98, 5, 8, '2026-05-19 17:41:21', 'Pendiente', 1),
(99, 5, 9, '2026-05-19 17:41:21', 'Inscrito', 1),
(105, 1, 4, '2026-05-22 12:29:54', 'Pendiente', 1),
(106, 1, 2, '2026-05-22 12:44:37', 'Pendiente', 1),
(107, 1, 6, '2026-05-22 12:47:44', 'Pendiente', 1),
(108, 1, 7, '2026-05-22 12:48:54', 'Pendiente', 1),
(109, 1, 11, '2026-05-22 14:20:05', 'Pendiente', 1),
(110, 3, 12, '2026-05-22 15:48:08', 'Pendiente', 1),
(111, 2, 11, '2026-05-27 17:01:17', 'Pendiente', 1),
(112, 15, 2, '2026-05-29 04:00:08', 'Inscrito', 1),
(113, 15, 4, '2026-05-29 04:00:17', 'Inscrito', 1),
(114, 15, 1, '2026-06-02 15:20:04', 'Inscrito', 1),
(115, 15, 5, '2026-06-02 15:20:25', 'Inscrito', 1),
(116, 15, 6, '2026-06-02 15:20:41', 'Inscrito', 1),
(117, 15, 3, '2026-06-02 15:52:31', 'Inscrito', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripcionesjugadores`
--

CREATE TABLE `inscripcionesjugadores` (
  `id_inscripcion_j` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('Pendiente','Inscrito','Cancelado') NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripcionesjugadores`
--

INSERT INTO `inscripcionesjugadores` (`id_inscripcion_j`, `id_equipo`, `id_jugador`, `fecha_inscripcion`, `estado`, `activo`) VALUES
(1, 1, 1, '2026-05-19 17:30:51', 'Inscrito', 0),
(2, 1, 2, '2026-05-19 17:30:51', 'Inscrito', 1),
(3, 2, 3, '2026-05-19 17:30:51', 'Inscrito', 1),
(4, 2, 4, '2026-05-19 17:30:51', 'Pendiente', 1),
(5, 3, 5, '2026-05-19 17:30:51', 'Inscrito', 1),
(6, 3, 6, '2026-05-19 17:30:51', 'Inscrito', 1),
(7, 4, 7, '2026-05-19 17:30:51', 'Pendiente', 1),
(8, 4, 8, '2026-05-19 17:30:51', 'Inscrito', 1),
(9, 5, 9, '2026-05-19 17:30:51', 'Inscrito', 1),
(10, 5, 10, '2026-05-19 17:30:51', 'Pendiente', 1),
(11, 4, 11, '2026-05-25 03:58:27', 'Inscrito', 0),
(12, 1, 13, '2026-05-27 17:11:44', 'Pendiente', 1),
(13, 4, 13, '2026-05-27 17:13:44', 'Inscrito', 1),
(14, 3, 1, '2026-06-08 22:20:15', 'Inscrito', 1),
(15, 3, 2, '2026-06-09 00:15:30', 'Inscrito', 1),
(16, 3, 3, '2026-06-09 00:16:04', 'Inscrito', 1),
(17, 3, 4, '2026-06-09 00:16:04', 'Inscrito', 1),
(18, 3, 7, '2026-06-09 00:16:31', 'Inscrito', 1),
(19, 3, 8, '2026-06-09 00:16:31', 'Inscrito', 1),
(29, 3, 11, '2026-06-09 00:19:42', 'Inscrito', 1),
(30, 3, 13, '2026-06-09 00:19:54', 'Inscrito', 1),
(38, 3, 9, '2026-06-09 00:22:59', 'Inscrito', 1),
(41, 3, 10, '2026-06-09 00:23:24', 'Inscrito', 1),
(55, 3, 16, '2026-06-09 00:33:39', 'Inscrito', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id_jugador` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `posicion` enum('Portero','Defensa','Centrocampista','Delantero') NOT NULL,
  `numero_camiseta` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id_jugador`, `id_usuario`, `posicion`, `numero_camiseta`, `activo`) VALUES
(1, 1, 'Portero', 1, 1),
(2, 2, 'Defensa', 4, 1),
(3, 3, 'Defensa', 5, 1),
(4, 4, 'Centrocampista', 8, 1),
(5, 5, 'Centrocampista', 10, 1),
(6, 6, 'Delantero', 9, 1),
(7, 7, 'Defensa', 3, 1),
(8, 8, 'Centrocampista', 6, 1),
(9, 9, 'Delantero', 11, 1),
(10, 10, 'Portero', 12, 1),
(11, 19, 'Portero', 10, 1),
(13, 16, 'Centrocampista', 11, 0),
(16, 17, 'Centrocampista', 20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_emisor` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('torneo','partido','equipo','invitacion','general') DEFAULT 'general',
  `id_referencia` int(11) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id_resultado` int(11) NOT NULL,
  `id_encuentro` int(11) NOT NULL,
  `goles_local` int(2) NOT NULL DEFAULT 0,
  `goles_visitante` int(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resultados`
--

INSERT INTO `resultados` (`id_resultado`, `id_encuentro`, `goles_local`, `goles_visitante`) VALUES
(1, 1, 2, 9),
(2, 2, 0, 0),
(3, 3, 3, 2),
(4, 4, 1, 4),
(6, 6, 1, 0),
(7, 7, 0, 3),
(13, 17, 8, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(100) NOT NULL,
  `activo` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`, `activo`) VALUES
(1, 'Administrador', 1),
(2, 'Organisador', 1),
(3, 'Usuario', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `torneos`
--

CREATE TABLE `torneos` (
  `id_torneo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_torneo` varchar(255) NOT NULL,
  `categoria` enum('Amateur','Profesional','Semiprofesional','Sub 20','Sub 17','Sub 15','Pony') NOT NULL DEFAULT 'Amateur',
  `tipo_torneo` enum('Liga','Grupos','Eliminacion Directa') NOT NULL DEFAULT 'Liga',
  `ciudad` varchar(255) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Inscripciones Abiertas','Comenzo','Finalizado') NOT NULL DEFAULT 'Inscripciones Abiertas',
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `torneos`
--

INSERT INTO `torneos` (`id_torneo`, `id_usuario`, `nombre_torneo`, `categoria`, `tipo_torneo`, `ciudad`, `fecha_inicio`, `fecha_fin`, `estado`, `activo`) VALUES
(1, 1, 'Liga Profesional Tolima', 'Profesional', 'Liga', 'Ibague', '2026-05-01', '2026-08-31', 'Comenzo', 1),
(2, 2, 'Copa Juvenil Sub 20', 'Sub 20', 'Grupos', 'Bogota', '2026-06-10', '2026-07-20', 'Inscripciones Abiertas', 1),
(3, 3, 'Torneo Regional', 'Semiprofesional', 'Eliminacion Directa', 'Cali', '2026-04-20', '2026-06-15', 'Comenzo', 1),
(4, 4, 'Liga Amateur Medellin', 'Semiprofesional', 'Liga', 'Medellin', '2026-03-01', '2026-05-31', 'Comenzo', 1),
(5, 5, 'Copa Final Nacional', 'Profesional', 'Eliminacion Directa', 'Barranquilla', '2026-07-01', '2026-09-01', 'Inscripciones Abiertas', 1),
(6, 17, 'sdfgh', 'Profesional', 'Liga', 'sdfgh', '2026-05-19', '2026-05-30', 'Inscripciones Abiertas', 0),
(7, 17, 'sdfghjfghjqwerthbvcxserf', 'Profesional', 'Grupos', 'xcvbnawsedrftghb vc', '2026-05-20', '2026-05-30', 'Inscripciones Abiertas', 0),
(8, 17, 'sdfgh', 'Amateur', 'Liga', 'xcvbn', '2026-05-20', '2026-05-21', 'Inscripciones Abiertas', 0),
(9, 17, 'xwecvrbtnymumunbvrecwxce', 'Amateur', 'Liga', 'asertghbvcd', '2026-05-19', '2026-05-30', 'Comenzo', 0),
(10, 17, 'wertyhvdswe4rtyhvdsertg', 'Amateur', 'Liga', 'xcgtrdsxcv', '2026-05-01', '2026-05-18', 'Finalizado', 0),
(11, 17, 'asdefrgtyum', 'Amateur', 'Liga', 'xcrvtbynum', '2026-05-25', '2026-05-31', 'Inscripciones Abiertas', 0),
(12, 17, 'q', 'Amateur', 'Liga', 'w', '2026-05-21', '2026-05-27', 'Comenzo', 0),
(13, 17, 'd', 'Amateur', 'Liga', 'g', '2026-05-23', '2026-05-31', 'Inscripciones Abiertas', 0),
(14, 17, 'anchoa', 'Semiprofesional', 'Grupos', 'bogota ', '2026-05-25', '2026-06-26', 'Inscripciones Abiertas', 1),
(15, 19, 'mi primer torneo', 'Semiprofesional', 'Liga', 'bogota', '2026-06-01', '2026-12-20', 'Inscripciones Abiertas', 1),
(16, 19, 'segundo torneo', 'Profesional', 'Eliminacion Directa', 'cali', '2026-06-05', '2026-11-30', 'Inscripciones Abiertas', 1),
(17, 19, 'tercer torneo', 'Sub 20', 'Liga', 'barranca', '2026-06-05', '2027-01-31', 'Inscripciones Abiertas', 1),
(18, 19, 'zdfrgthyj', 'Amateur', 'Liga', 'dwefgrthyju', '2026-06-01', '2026-11-03', 'Inscripciones Abiertas', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `apellido_usuario` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre_usuario`, `apellido_usuario`, `fecha_nacimiento`, `telefono`, `email`, `password`, `activo`) VALUES
(1, 1, 'Carlos', 'Ramirez', '1995-03-12', '30012', 'carlos@gmail.com', '123456', 0),
(2, 2, 'Anastacio', 'Gomez', '1998-07-25', '3012345678', 'ana@gmail.com', '123456', 0),
(3, 2, 'Luis', 'Martinez', '1992-11-05', '3023456789', 'luis@gmail.com', '123456', 0),
(4, 3, 'Maria', 'Lopez', '2000-01-18', '3034567890', 'maria@gmail.com', '123456', 1),
(5, 1, 'Jorge', 'Hernandez', '1991-09-30', '3045678901', 'jorge@gmail.com', '123456', 1),
(6, 2, 'Sofia', 'Torr', '1997-06-14', '3056789012', 'sofia@gmail.com', '123456', 1),
(7, 3, 'Diego', 'Castro', '1994-12-22', '3067890123', 'diego@gmail.com', '123456', 1),
(8, 2, 'Laura', 'Vargas', '1999-04-09', '3078901234', 'laura@gmail.com', '123456', 1),
(9, 1, 'Andres', 'Morales', '1993-08-17', '3089012345', 'andres@gmail.com', '123456', 1),
(10, 3, 'Paula', 'Rojas', '1996-02-28', '3090123456', 'paula@gmail.com', '123456', 1),
(16, 3, 'k', 'cerpa', '2026-04-02', '3', 'kkk@gmail.com', '$2b$10$451eH9UUmNmRCg1N.WrnR.5J5XLjcn1TKo3842vObLyoI6ZnzZ4Vi', 1),
(17, 1, 'kevin', 'cerpa granados', '2026-04-01', '1', 'k@gmail.com', '$2b$10$FM58xnRDqpT9TEwDuNJtwugqFHlzI7H6Hvu4oSbAGlfHWAUI1NOYq', 1),
(19, 2, 'kevin', 'granados', '2026-04-01', '2', 'kk@gmail.com', '$2b$10$Kja2UyjE9IyvwIuqZ0vrYOl88TMWgCrHjBXkbdE/WX2CqmwpLsAVe', 1),
(26, 3, '', '', '0000-00-00', '', '', '$2b$10$OSQeWQIZwHaZBTRMp5y.GepQjW5cHwi3vrVtQnJCMrymgb.u8lIxW', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alineaciones`
--
ALTER TABLE `alineaciones`
  ADD PRIMARY KEY (`id_alineacion`),
  ADD KEY `id_equipo` (`id_equipo`);

--
-- Indices de la tabla `alineacion_jugadores`
--
ALTER TABLE `alineacion_jugadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_alineacion` (`id_alineacion`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `cronologias`
--
ALTER TABLE `cronologias`
  ADD PRIMARY KEY (`id_cronologia`),
  ADD KEY `id_encuentro` (`id_encuentro`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `encuentros`
--
ALTER TABLE `encuentros`
  ADD PRIMARY KEY (`id_encuentro`),
  ADD KEY `id_torneo` (`id_torneo`),
  ADD KEY `id_equipo_local` (`id_equipo_local`),
  ADD KEY `id_equipo_visitante` (`id_equipo_visitante`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id_equipo`),
  ADD KEY `fk_equipo_usuario` (`id_usuario`);

--
-- Indices de la tabla `inscripcionesequipos`
--
ALTER TABLE `inscripcionesequipos`
  ADD PRIMARY KEY (`id_inscripcion_e`),
  ADD UNIQUE KEY `unique_torneo_equipo` (`id_torneo`,`id_equipo`),
  ADD KEY `fk_ie_equipo` (`id_equipo`);

--
-- Indices de la tabla `inscripcionesjugadores`
--
ALTER TABLE `inscripcionesjugadores`
  ADD PRIMARY KEY (`id_inscripcion_j`),
  ADD UNIQUE KEY `unique_equipo_jugador` (`id_equipo`,`id_jugador`),
  ADD KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_equipo` (`id_equipo`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id_jugador`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`id_usuario`),
  ADD KEY `id_emisor` (`id_emisor`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id_resultado`),
  ADD UNIQUE KEY `unique_encuentro` (`id_encuentro`),
  ADD KEY `id_encuentro` (`id_encuentro`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD PRIMARY KEY (`id_torneo`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alineaciones`
--
ALTER TABLE `alineaciones`
  MODIFY `id_alineacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `alineacion_jugadores`
--
ALTER TABLE `alineacion_jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `cronologias`
--
ALTER TABLE `cronologias`
  MODIFY `id_cronologia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `encuentros`
--
ALTER TABLE `encuentros`
  MODIFY `id_encuentro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `inscripcionesequipos`
--
ALTER TABLE `inscripcionesequipos`
  MODIFY `id_inscripcion_e` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `inscripcionesjugadores`
--
ALTER TABLE `inscripcionesjugadores`
  MODIFY `id_inscripcion_j` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id_resultado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `torneos`
--
ALTER TABLE `torneos`
  MODIFY `id_torneo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alineaciones`
--
ALTER TABLE `alineaciones`
  ADD CONSTRAINT `alineaciones_ibfk_1` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `alineacion_jugadores`
--
ALTER TABLE `alineacion_jugadores`
  ADD CONSTRAINT `alineacion_jugadores_ibfk_1` FOREIGN KEY (`id_alineacion`) REFERENCES `alineaciones` (`id_alineacion`) ON DELETE CASCADE,
  ADD CONSTRAINT `alineacion_jugadores_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cronologias`
--
ALTER TABLE `cronologias`
  ADD CONSTRAINT `cronologias_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id_jugador`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cronologias_ibfk_2` FOREIGN KEY (`id_encuentro`) REFERENCES `encuentros` (`id_encuentro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `encuentros`
--
ALTER TABLE `encuentros`
  ADD CONSTRAINT `encuentros_ibfk_1` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `encuentros_ibfk_2` FOREIGN KEY (`id_equipo_local`) REFERENCES `equipos` (`id_equipo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `encuentros_ibfk_3` FOREIGN KEY (`id_equipo_visitante`) REFERENCES `equipos` (`id_equipo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `fk_equipo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `inscripcionesequipos`
--
ALTER TABLE `inscripcionesequipos`
  ADD CONSTRAINT `fk_ie_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ie_torneo` FOREIGN KEY (`id_torneo`) REFERENCES `torneos` (`id_torneo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `inscripcionesjugadores`
--
ALTER TABLE `inscripcionesjugadores`
  ADD CONSTRAINT `fk_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_jugador` FOREIGN KEY (`id_jugador`) REFERENCES `jugadores` (`id_jugador`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`id_encuentro`) REFERENCES `encuentros` (`id_encuentro`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD CONSTRAINT `torneos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
