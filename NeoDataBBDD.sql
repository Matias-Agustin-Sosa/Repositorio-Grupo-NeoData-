-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2026 a las 02:18:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
DROP DATABASE neodatashop;

CREATE DATABASE  neodatashop;

USE neodatashop;

--
-- Base de datos: `neodatashop`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `ID_Cliente` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) NOT NULL,
  `Apellido` varchar(30) NOT NULL,
  `DNI` varchar(15) NOT NULL,
  `Telefono` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Habilitado` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID_Cliente`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle`
--

CREATE TABLE `detalle` (
  `ID_Factura` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Producto` int(11) NOT NULL,
  PRIMARY KEY (`ID_Factura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `ID_Factura` int(11) NOT NULL AUTO_INCREMENT,
  `Fecha` date NOT NULL,
  `ID_Cliente` int(11) NOT NULL,
  `ID_MedioPago` int(11) NOT NULL,
  PRIMARY KEY (`ID_Factura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medio_pago`
--

CREATE TABLE `medio_pago` (
  `ID_MedioPago` int(11) NOT NULL AUTO_INCREMENT,
  `Modalidad` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_MedioPago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(20) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Marca` varchar(100) NOT NULL,
  `Category` varchar(100) NOT NULL,
  `Precio` decimal(60,0) NOT NULL,
  `Stock` int(10) NOT NULL,
  `Garanty` date NOT NULL,
  `Descuento` int(11) NOT NULL,
  `Ruta_Imagen` varchar(80) NOT NULL,
  PRIMARY KEY (`ID_Producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle`
--
ALTER TABLE `detalle`
  ADD CONSTRAINT `detalle_ibfk_1` FOREIGN KEY (`ID_Factura`) REFERENCES `factura` (`ID_Factura`),
  ADD CONSTRAINT `detalle_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`ID_Cliente`) REFERENCES `cliente` (`ID_Cliente`),
  ADD CONSTRAINT `factura_ibfk_2` FOREIGN KEY (`ID_MedioPago`) REFERENCES `medio_pago` (`ID_MedioPago`);

--
-- Agregamos datos
--

INSERT INTO `producto` ( `Nombre`, `Marca`, `Category`, `Precio`, `Stock`, `Garanty`, `Descuento`, `Ruta_Imagen`) 
VALUES ('Smartwatch', 'Xio', 'Accesorio', 50000, 3, '2026-07-07', 3, 'Smartwatch.png');

INSERT INTO `producto` ( `Nombre`, `Marca`, `Category`, `Precio`, `Stock`, `Garanty`, `Descuento`, `Ruta_Imagen`) 
VALUES ('Mouse Gamer', 'Red Dragon', 'Pc', 30000, 2, '2026-08-07', 4, 'Mouse.png');

INSERT INTO `producto` ( `Nombre`, `Marca`, `Category`, `Precio`, `Stock`, `Garanty`, `Descuento`, `Ruta_Imagen`) 
VALUES ('Celular A34', 'Samsung', 'Celular', 450000, 13, '2027-04-04', 10, 'Celular.png');

INSERT INTO `producto` ( `Nombre`, `Marca`, `Category`, `Precio`, `Stock`, `Garanty`, `Descuento`, `Ruta_Imagen`) 
VALUES ('Auriculares', 'JBL', 'Accesorio', 10000, 6, '2026-06-04', 1, 'Auriculares.png');

INSERT INTO `medio_pago` (`Modalidad`) 
VALUES ('Devito');

INSERT INTO `medio_pago` (`Modalidad`) 
VALUES ('Credito');