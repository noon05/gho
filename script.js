$(document).ready(function() {
    var appleSize = 60; // Размер яблока
    var treeWidth = $('#game-container').width();
    var apples = []; // Массив для хранения яблок
    var score = 0; // Счет игрока
    var spawnInterval = 500; // Интервал спавна яблок по умолчанию

    // Функция для обновления счета
    function updateScore() {
        $('#score').text('Score: ' + score);
        // Проверяем, достигнут ли порог для уменьшения интервала спавна
        if (score % 5 === 0 && spawnInterval > 100) {
            // Уменьшаем интервал спавна на 10%, но не более чем на 70%
            var decreaseAmount = Math.min(spawnInterval * 0.1, spawnInterval * 0.7);
            spawnInterval -= decreaseAmount;
        }
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Функция для добавления яблок
    function spawnApple() {
        var apple = $('<div class="apple"></div>');
        var randomPosX = Math.floor(Math.random() * (treeWidth - appleSize));
        var fallSpeed = random(100, 500); // Случайное ускорение падения

        apple.css({
            top: 10,
            left: randomPosX
        });
        $('#game-container').append(apple);
        apples.push({ element: apple, speed: fallSpeed }); // Добавляем яблоко и его скорость в массив

        // Логика падения яблока
        var fallInterval = setInterval(function() {
            apples.forEach(function(appleData) {
                var appleTop = appleData.element.position().top;
                appleData.element.css({ top: appleTop + appleData.speed });

                if (appleTop > $('#game-container').height() + 10) {
                    appleData.element.remove();
                    apples.splice(apples.indexOf(appleData), 1); // Удаляем яблоко из массива
                    score -= 10; // Уменьшаем счет на 10 при пропущенном яблоке
                    updateScore(); // Обновляем счет на странице
                }
            });
        }, 50);

        apple.on('mousedown', function() {
            var audio = new Audio('catch.wav');
            audio.play();
            apple.remove();
            apples.splice(apples.findIndex(a => a.element.is(apple)), 1); // Удаляем яблоко из массива
            score += 1; // Увеличиваем счет на 1 при пойманном яблоке
            updateScore(); // Обновляем счет на странице
        });
         apple.on('touchstart', function(event) {
            event.preventDefault(); // Предотвращаем стандартное поведение по умолчанию (например, прокрутку страницы)
            var audio = new Audio('catch.wav');
            audio.play();
            apple.remove();
            apples.splice(apples.findIndex(a => a.element.is(apple)), 1); // Удаляем яблоко из массива
            score += 1; // Увеличиваем счет на 1 при пойманном яблоке
            updateScore(); // Обновляем счет на странице
        });
    }


    // Функция для спавна яблок с заданным интервалом
    function spawnApplesInterval(interval) {
        setInterval(function() {
            spawnApple();
        }, interval);
    }

    // Инициализация счетчика на странице
    $('#game-container').prepend('<div id="score">Score: 0</div>');

    // Запускаем спавн яблок сразу после загрузки страницы
    spawnApplesInterval(spawnInterval); // Спавним яблоки с учетом интервала
});