const errorMessages = {
  BadEmail: 'Неправильный формат почты',
  BadEmailOrPassword: 'Неправильные почта или пароль',
  BadUrl: 'Неправильный формат URL',
  DuplicateEmail: 'Ошибка: Пользователь с такой почтой уже зарегистрирован',
  BadRequestUser: 'Ошибка: Переданы некорректные данные',
  NotFoundUser: 'Ошибка: Пользователь не найден',
  UnauthorizedError: 'Неправильная почта или пароль',
  BadRequestError: 'Ошибка: Переданы некорректные данные при добавлении фильма',
  ForbiddenError: 'Ошибка: У вас нет прав на удаление данного фильма',
  NotFoundPage: 'Ресурс не найден',
  AuthorizationError: 'Необходимо авторизоваться',
  NotFoundError: 'Фильм не найден',
  SuccessDelete: 'Фильм успешно удален',
};

module.exports = errorMessages;
