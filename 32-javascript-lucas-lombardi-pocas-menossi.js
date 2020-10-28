(function ($) {
  'use strict';

  /*
 Já temos as funcionalidades de adicionar e remover um carro. Agora, vamos persistir esses dados, 
 salvando-os temporariamente na memória de um servidor.
 Nesse diretório do `challenge-32` tem uma pasta `server`. É um servidor simples, em NodeJS, para 
 que possamos utilizar para salvar as informações dos nossos carros.
 Para utilizá-lo, você vai precisar fazer o seguinte:
 - Via terminal, acesse o diretório `server`;
 - execute o comando `npm install` para instalar as dependências;
 - execute `node app.js` para iniciar o servidor.
 Ele irá ser executado na porta 3000, que pode ser acessada via browser no endereço: 
 `http://localhost:3000`
 O seu projeto não precisa estar rodando junto com o servidor. Ele pode estar em outra porta.
 As mudanças que você irá precisar fazer no seu projeto são:
 - Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
 `http://localhost:3000/car`
 - Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
 os seguintes campos:
   - `image` com a URL da imagem do carro;
   - `brandModel`, com a marca e modelo do carro;
   - `year`, com o ano do carro;
   - `plate`, com a placa do carro;
   - `color`, com a cor do carro.
 Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.
 Crie uma branch `challenge-32` no seu projeto, envie um pull request lá e cole nesse arquivo a URL
 do pull request.
 */

  var app = (function () {
    return {

      init: function init() {
        this.companyInfo();
        this.initEvents();
        this.getCarsRegistered();
      },

      carInfo: function carInfo() {
        var carToAdd = {
          image: $('[data-js="image"]').get().value,
          brandModel: $('[data-js="brand-model"]').get().value,
          year: $('[data-js="year"]').get().value,
          plate: $('[data-js="plate"]').get().value,
          color: $('[data-js="color"]').get().value
        }
        return carToAdd;
      },

      registerNewCar: function registerNewCar() {
        var car = app.carInfo();
        var newCar = new XMLHttpRequest();
        newCar.open('POST', 'http://localhost:3000/car');
        newCar.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        newCar.send('image=' + car.image + '&brandModel=' + car.brandModel + '&year=' + car.year + '&plate=' + car.plate + '&color=' + car.color);
      },

      getCarsRegistered: function getCarsRegistered() {
        var getCars = new XMLHttpRequest();
        getCars.open('GET', 'http://localhost:3000/car');
        getCars.send();

        getCars.addEventListener('readystatechange', this.createNewCar, false);
      },

      createNewCar: function createNewCar() {
        if (this.readyState === 4) {
          var cars = JSON.parse(this.responseText);
          var $tableCar = $('[data-js="table-car"]').get();
          var $fragment = document.createDocumentFragment();

          cars.forEach(function (car) {
            var $tr = document.createElement('tr');
            var $tdImage = document.createElement('td');
            var $image = document.createElement('img');
            var $tdBrand = document.createElement('td');
            var $tdYear = document.createElement('td');
            var $tdPlate = document.createElement('td');
            var $tdColor = document.createElement('td');

            var $removeBtn = document.createElement('button');
            $removeBtn.innerHTML = '<p>Remover</p>'
            $removeBtn.addEventListener('click', function (e) {
              $tr.parentNode.removeChild($tr);
            }, false);

            $image.src = car.image;
            $tdImage.appendChild($image);

            $tdBrand.textContent = car.brandModel;
            $tdYear.textContent = car.year;
            $tdPlate.textContent = car.plate;
            $tdColor.textContent = car.color;

            $tr.appendChild($tdImage);
            $tr.appendChild($tdBrand);
            $tr.appendChild($tdYear);
            $tr.appendChild($tdPlate);
            $tr.appendChild($tdColor);
            $tr.appendChild($removeBtn);

            $fragment.appendChild($tr);
          })
          return $tableCar.appendChild($fragment);
        }
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();

        ajax.open('GET', '/company.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },

      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this))
          return;

        var data = JSON.parse(this.responseText);
        var $companyName = new $('[data-js="company-name"]').get();
        var $companyPhone = new $('[data-js="company-phone"]').get();
        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;
      },

      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },

      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        app.registerNewCar();
      },

    };
  })();

  app.init();

})(window.DOM);
