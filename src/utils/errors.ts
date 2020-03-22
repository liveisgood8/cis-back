export enum Errors {
  /** Неизвестная ошибка */
  UNKNOWN_ERROR = 1,
  /** Маршрут не существует */
  PATH_NOT_FOUND,
  /** Ошибка в работе сервиса */
  SERVICE_ERROR,
  /** Некорректный данные в запросе */
  REQUEST_VALIDATE_ERROR,
  /** Ошибка при добавлении данных в базу данных */
  INSERT_ENTITY_ERROR,
  /** Ошибка при обновлении данных в базе данных */
  UPDATE_ENTITY_ERROR,
  /** Пользователь с указанными логином не найден */
  AUTH_USER_NOT_FOUND,
  /** Пользователь с указанным логином уже существует */
  REGISTER_USER_IS_EXIST,
  /** Неверный пароль пользователя */
  AUTH_WRONG_PASSWORD,
  /** Ошибка при загрузке файла на сервер */
  FILE_UPLOAD_ERROR,
  /** Неизвестный идентификатор права */
  UNKNOWN_PERMISSION_ID,
  /** Нет прав для доступа к данном ресурсу */
  NO_PERMISSION_FOR_RESOURCE,
}
