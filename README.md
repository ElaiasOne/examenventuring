EXAMEN TECNICO VENTURING.


Para correr el proyecto es necesario tener instalado nodejs. https://nodejs.org/es

El sistema cuenta con un backend en nodejs con express y un frontend con reactjs.

Para inicializarlo se debe crear una base de datos mysql con el nombre "movies_db" o configurar un nuevo nombre en server.js.

Correr la siguiente consulta SQL para crear la tabla movies:

CREATE TABLE `movies_db`.`movies` (`id` INT NOT NULL AUTO_INCREMENT , `title` VARCHAR(255) NOT NULL , `description` VARCHAR(255) NOT NULL , `year` INT(10) NOT NULL , PRIMARY KEY (`id`), UNIQUE `title` (`title`)) ENGINE = InnoDB;


Ubicarse en frontend y usar el comando : npm install , luego npm start para iniciar el front en el puerto 3000.
Ubicarse en backend y usar el comando : npm install , luego npm start para iniciar el backend en el puerto 3005.