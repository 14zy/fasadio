var prices = {
  "metallic": 3100,
  "glyanec": 3000,
  "matovaya": 2400,
  "frezerovka": 2000,
  "petlya": 35
};
var price = prices.metallic;

function genZakazNumber() {
  var date = new Date();
  return date.getMonth()+1 + "" +date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
}

var zakaz = {
  n: genZakazNumber(),
  date: getToday(),
  colorScheme: "RAL",
  color: "",
  texture: "",
  sizeMDF: "",
  scruglenieFasada: "",
  frezerovka: false,
  doublePaint: false,
  totalSquare: 0,
  detalirovka: [],
  petli: [],
  petliPrice : 0,
  totalPrice: 0,
  totalPriceFormatted: 0,
  radius: [],
  totalSquareRadius: 0,
  totalPriceRadius: 0,
  totalRadiusPriceFormatted: 0,
  srok: "14 дней",
  address: "г.Ростов-на-Дону, ул.Тролейбусная 12",
  phone: "",
  name: "",
  email: "",
  link: "",
  comment: ""
};

$('#zakazN').html(zakaz.n);

function watchRows() {
  $('.details-input').on('keyup change', function() {
    var row = $(this).data('row');
    var a = parseInt($('#a-' + row).val());
    var b = parseInt($('#b-' + row).val());
    var count = parseInt($('#count-' + row).val());
    var rowSquare = (a * b * count) / 1000000;
    if (isNaN(rowSquare)) {
      $('#total-' + row).html("");
      $('#total-price-' + row).html("");
    } else {
      $('#total-' + row).html(rowSquare.toFixed(2) + " м²");
      $('#total-price-' + row).html((price * rowSquare.toFixed(2)).toFixed(0) + " руб.");
    }
    updateDetalirovka();
    calculatePrice();
  });

  $('.radius-input').on('keyup change', function() {
    var row = $(this).data('radius-row');
    var a = parseInt($('#r-' + row).val());
    var count = parseInt($('#r-count-' + row).val());
    var rowSquare = (a * count) / 1000;

    var rowPrice = "";
    if (a <= "720") {
      rowPrice = price * count;
    } else {
      rowPrice = (a / (7.2)/100 ) * count * price;
    }

    if (isNaN(rowSquare)) {
      $('#radius-' + row).html("");
    } else {
      $('#radius-' + row).html(rowPrice.toFixed(0) + " руб.");
    }
    updateRadius();
    $('#totalPriceRadius').html(zakaz.totalPriceRadius);
    calculatePrice();
  });

  ////// Петли ///////
  $('.fs-petli-link').on('click', function() {
    window.petliRow = {};
    window.petliRow.id = this.id.split("-")[2]-1;
    window.petliRow.row = this.id.split("-")[2];
    window.petliRow.storona = this.id.split("-")[1];

    if ( zakaz.petli[window.petliRow.id] ) {
      //Прочитать сожержимое сохраненных petli и загрузить в модальное окно если есть
      // zakaz.petli[window.petliRow.id].petli.storona;
      if (zakaz.petli[window.petliRow.id].petli.otverstia == 2) {$('#otverstia-2')[0].checked = true;}
      if (zakaz.petli[window.petliRow.id].petli.otverstia == 3) {$('#otverstia-3')[0].checked = true;}
      if (zakaz.petli[window.petliRow.id].petli.otverstia == 4) {$('#otverstia-4')[0].checked = true;}
      if (zakaz.petli[window.petliRow.id].petli.otverstia == 5) {$('#otverstia-5')[0].checked = true;}
      if (zakaz.petli[window.petliRow.id].petli.otverstia == 6) {$('#otverstia-6')[0].checked = true;}
      $('#rasstCentraDoKraya').val(zakaz.petli[window.petliRow.id].petli.rasstCentraDoKraya);
      $('#rasstCentraDoKromki').val(zakaz.petli[window.petliRow.id].petli.rasstCentraDoKromki);
      $('#diametrSverla').val(zakaz.petli[window.petliRow.id].petli.diametrSverla);
      $('#glubinaOtverstia').val(zakaz.petli[window.petliRow.id].petli.glubinaOtverstia);
    } else {
      //Если нет, то сбросить все поля в значения по умолчанию
      $('#otverstia-2')[0].checked = true;
      $('#rasstCentraDoKraya').val("100");
      $('#rasstCentraDoKromki').val("22");
      $('#diametrSverla').val("35");
      $('#glubinaOtverstia').val("12");
    }
  });

}

function updateDetalirovka() {
  zakaz.totalSquare = 0;
  zakaz.detalirovka = [];
  zakaz.petliPrice = 0;

  for (var index = 0; index <= window.totalRows; index++) {

    var thisRowSquare = parseFloat($("#total-"+(index+1)).text());

    if (!isNaN(thisRowSquare)) {
      zakaz.totalSquare = parseFloat((zakaz.totalSquare + thisRowSquare).toFixed(2));
      zakaz.detalirovka.push({
        a: $('#a-' + (index+1)).val(),
        b: $('#b-' + (index+1)).val(),
        count: parseInt($('#count-' + (index+1)).val()),
        vitrina: $('#vitrina-' + (index+1))[0].checked,
        square: thisRowSquare,
        price: (thisRowSquare*price).toFixed(0),
        row: index+1,
      });

      if (zakaz.petli[index]) {
        zakaz.petli[index].a = zakaz.detalirovka[zakaz.detalirovka.length - 1].a;
        zakaz.petli[index].b = zakaz.detalirovka[zakaz.detalirovka.length - 1].b;
        zakaz.petli[index].count = zakaz.detalirovka[zakaz.detalirovka.length - 1].count;
        zakaz.petli[index].square = zakaz.detalirovka[zakaz.detalirovka.length - 1].square;
        zakaz.petli[index].price = zakaz.detalirovka[zakaz.detalirovka.length - 1].price;
        zakaz.detalirovka[zakaz.detalirovka.length - 1].petli = zakaz.petli[index];

        petliPrice = zakaz.petli[index].petli.otverstia * prices.petlya;
        totalPriceWithPetli = parseInt(zakaz.detalirovka[zakaz.detalirovka.length - 1].price) + petliPrice;
        $('#total-price-' + (index+1)).html(totalPriceWithPetli + " руб.");
        zakaz.petliPrice = zakaz.petliPrice + petliPrice;
        zakaz.detalirovka[zakaz.detalirovka.length - 1].price = totalPriceWithPetli.toFixed(0);
        zakaz.petli[index].price = totalPriceWithPetli.toFixed(0);
      }

    }
  }
  // });
}

function updateRadius() {
  zakaz.totalPriceRadius = 0;
  zakaz.radius = [];
  $(".row-radius-total").each(function(index) {
    var thisRowPrice = parseFloat($(this).text());
    var thisRowType = "";
    if (!isNaN(thisRowPrice)) {
      if ($('#radios-'+(index+1)+'-vnesh')[0].checked === true) {
        thisRowType = "Внешний";
      }
      if ($('#radios-'+(index+1)+'-vnut')[0].checked === true) {
        thisRowType = "Внутренний";
      }
      zakaz.totalPriceRadius = parseFloat((zakaz.totalPriceRadius + thisRowPrice).toFixed(0));
      zakaz.radius.push({
        height: parseInt($('#r-' + (index+1)).val()),
        count: parseInt($('#r-count-' + (index+1)).val()),
        type: thisRowType,
        price: thisRowPrice
      });
    }
  });
}

$("input[type='radio'], input[type='checkbox'], select").change(function() {
  updateDetalirovka();
  updateRadius();
  calculatePrice();

  if ($('#selectColorRal')[0].checked === true) {
    zakaz.colorScheme="RAL";
    $('#colorLabel').html('Цвет RAL');
    $('#tableRAL').css('display', 'block');
    $('#tableSayerlack').css('display', 'none');
    if ($('#color')[0].value.length == 3) {
      $('#color')[0].value = "1000";
    }
  }
  if ($('#selectColorSayerlack')[0].checked === true) {
    zakaz.colorScheme="Sayerlack WCP";
    $('#colorLabel').html('Цвет Sayerlack WCP');
    $('#tableRAL').css('display', 'none');
    $('#tableSayerlack').css('display', 'block');
    if ($('#color')[0].value.length == 4) {
      $('#color')[0].value = "001";
    }
  }

  $('.details-input').keyup();
  $('.radius-input').keyup();
});

$('#color').on('change keyup',function() {
  updateCubeColor();
});


function updateCubeColor() {
  switch (zakaz.colorScheme) {
    case "RAL":
      try {
        zakaz.color = $('#color')[0].value;
        $('.main-sides-cube').css('background', ral["RAL"+$('#color')[0].value].hex);
        $('#colorName').html('RAL-' + $('#color')[0].value + ' "' + ral["RAL"+$('#color')[0].value].name + '"');
        if ($('#checkDoublePaint')[0].checked === true) {
          $('.back-cube').css('background', ral["RAL"+$('#color')[0].value].hex);
        } else {
          $('.back-cube').css('background', "#f5f5f5");
        }
      } catch (e) {
        $('.main-sides-cube').css('background', "#f5f5f5");
        $('.back-cube').css('background', "#f5f5f5");
        $('#colorName').html('<b style="color: red">Такого цвета RAL нет</b>');
      } finally {}
      break;
    case "Sayerlack WCP":
      try {
        zakaz.color = $('#color')[0].value;
        $('.main-sides-cube').css('background', wcp["WCP"+$('#color')[0].value].hex);
        $('#colorName').html('Sayerlack WCP' + zakaz.color);
        if ($('#checkDoublePaint')[0].checked === true) {
          $('.back-cube').css('background', wcp["WCP"+$('#color')[0].value].hex);
        } else {
          $('.back-cube').css('background', "#f5f5f5");
        }
      } catch (e) {
        $('.main-sides-cube').css('background', "#f5f5f5");
        $('.back-cube').css('background', "#f5f5f5");
        $('#colorName').html('<b style="color: red">Такого цвета Sayerlack WCP нет</b>');
      } finally {}
      break;
  }
}

function calculatePrice() {
  if ($('#optionMetallic')[0].checked === true) {
    price = prices.metallic;
    zakaz.texture="Металлик";
  }
  if ($('#optionGlyanec')[0].checked === true) {
    price = prices.glyanec;
    zakaz.texture="Глянец";
  }
  if ($('#optionMatovaya')[0].checked === true) {
    price = prices.matovaya;
    zakaz.texture="Матовый";
  }

  if ($('#checkDoublePaint')[0].checked === true) {
    price = (price * 2) - 200;
    updateCubeColor();
    zakaz.doublePaint = true;
    // console.log('Покраска с двух сторон ВКЛ');
  } else {
    updateCubeColor();
    zakaz.doublePaint = false;
    // console.log('Покраска с двух сторон ВЫКЛ');
  }

  if ($('#selectSizeMDF')[0].value == "19") {
    // console.log('Толщина МДФ 19мм');
    price = price + 200;
    zakaz.sizeMDF = "19 мм";
  } else {
    // console.log('Толщина МДФ 16мм');
    zakaz.sizeMDF = "16 мм";
  }

  zakaz.scruglenieFasada = $('#selectScruglenieFasada')[0].value + " мм";
  // console.log('Скругление фасада ' + zakaz.scruglenieFasada);

  if ($('#checkFrezerovka')[0].checked === true) {
    // console.log('Феризровка ВКЛ');
    price = price + prices.frezerovka;
    zakaz.frezerovka = true;
  } else {
    // console.log('Феризровка ВЫКЛ');
    zakaz.frezerovka = false;
  }

  updateRadius();
  updateDetalirovka();

  $('#totalSquare').html(zakaz.totalSquare);
  $('#totalSquarePrice').html((zakaz.petliPrice + (zakaz.totalSquare * price)).toFixed(0));

  zakaz.totalPrice = (zakaz.petliPrice + ((zakaz.totalSquare * price) + zakaz.totalPriceRadius)).toFixed(0);
  zakaz.totalPriceFormatted = parseInt(zakaz.totalPrice).formatMoney(0, '', ' ');
  $('.totalPrice').html(zakaz.totalPriceFormatted);

  zakaz.predoplata = (zakaz.totalPrice*0.3).toFixed(0);
  $('.predoplata').html( parseInt(zakaz.predoplata).formatMoney(0, '', ' ') );
}

$('#btnDetailsAdd').click(function() {
  for (var i = 0; i < 3; i++) {
    window.totalRows = window.totalRows + 1;
    $('#details').append('<div class="form-group"><div class="col-sm-2"><input data-row="'+window.totalRows+'" id="a-'+window.totalRows+'" class="form-control details-input" type="number"><a id="petli-a-'+window.totalRows+'" class="fs-petli-link" data-toggle="modal" data-target="#petli-modal">+ петли</a></div><div class="col-sm-2"><input data-row="'+window.totalRows+'" id="b-'+window.totalRows+'" class="form-control details-input" type="number"><a id="petli-b-'+window.totalRows+'" class="fs-petli-link" data-toggle="modal" data-target="#petli-modal">+ петли</a></div><div class="col-sm-2"><div class="input-group"><input data-row="'+window.totalRows+'" id="count-'+window.totalRows+'" class="form-control details-input" type="number" placeholder="0"><span class="input-group-addon">шт.</span></div></div><div class="col-sm-2 text-center"><label><input class="details-input" type="checkbox" id="vitrina-'+window.totalRows+'"> да</label></div><div class="col-sm-2 text-center"><text class="row-total" id="total-'+window.totalRows+'"></text></div><div class="col-sm-2 text-center"><text class="price-total" id="total-price-'+window.totalRows+'"></text></div></div>');
  }

  watchRows();
});

$('#btnRadiusAdd').click(function() {
  // alert('Функция в разработке');
  watchRows();
});

payMandarin = function() {
  zakaz.phone = $('#inputPhone').val();
  // zakaz.name = $('#inputName').val();
  zakaz.email = $('#inputEmail').val();
  zakaz.comment = $('#comment').val();
  if (zakaz.email.length > 2 &&
    zakaz.phone.length >= 10 &&
    zakaz.totalPrice > 0) {
    $('#btnPay').attr('disabled',true);
    $('#btnPay').html('Идет загрузка...');
    zakaz.link = "http://birja-kuhon.ru/mandarinpay.php?price=" + zakaz.predoplata + "&orderId=" + zakaz.phone + "&email=" + zakaz.email;
    yaCounter44669668.reachGoal('btnPay');
    sendReceipt();
  } else {
    alert('Пожалуйста, корректно заполните все необходимые поля');
    yaCounter44669668.reachGoal('errorPay');
  }
};

function sendReceipt() {
  emailText = "Здравствуйте!<br>";
  emailText +="Спасибо за использование онлайн системы заказа мебельных фасадов Fasadio.ru";
  emailText += "<br><br>";
  emailText += "<b>Заказ №" + zakaz.n + "</b><br><br>";
  emailText += "Дата: " + zakaz.date + "<br>";
  emailText += "Цвет фасада: " + zakaz.colorScheme + zakaz.color + "<br>";

  emailText += "Текстура: " + zakaz.texture + "<br>";
  emailText += "Толщина МДФ: " + zakaz.sizeMDF + "<br>";
  emailText += "Скругление фаски фасада: " + zakaz.scruglenieFasada + "<br>";

  emailText += "Фасады с фрезеровкой: ";
  if (zakaz.frezerovka) {emailText += "Да";} else {emailText += "Нет";}
  emailText += "<br>";
  emailText += "Покраска с двух сторон: ";
  if (zakaz.doublePaint) {emailText += "Да";} else {emailText += "Нет";}
  emailText += "<br>";

  emailText += "<br>Деталировка: ";
  emailText += "<ul>";
  for (var i = 0; i < zakaz.detalirovka.length; i++) {
    emailText += "Деталь " + (i+1) + ":";
    emailText += "<li>" + zakaz.detalirovka[i].a + "x" + zakaz.detalirovka[i].b + " мм, " + zakaz.detalirovka[i].count +" шт</li>";
    emailText += "<li>Витрина – ";
    if (zakaz.detalirovka[i].vitrina) {emailText += "Да";} else {emailText += "Нет";}
    emailText += "</li>";
    emailText += "<li>Площадь – " + zakaz.detalirovka[i].square + " м²</li>";

    if (zakaz.detalirovka[i].petli) {
      emailText += "<li><em>Сверление под петли по стороне " + zakaz.detalirovka[i][zakaz.detalirovka[i].petli.petli.storona] + " мм, " + zakaz.detalirovka[i].petli.petli.otverstia + " шт:</em></li>";
      emailText += "<ul>";
      emailText += "<li>Расстояние центра отверстия от края – " + zakaz.detalirovka[i].petli.petli.rasstCentraDoKraya + " мм</li>";
      emailText += "<li>Диаметр сверла – " + zakaz.detalirovka[i].petli.petli.diametrSverla + " мм</li>";
      emailText += "<li>Расстояние центра отверстия до кромки – " + zakaz.detalirovka[i].petli.petli.rasstCentraDoKromki + " мм</li>";
      emailText += "<li>Глубина отверстия – " + zakaz.detalirovka[i].petli.petli.glubinaOtverstia + " мм</li>";
      emailText += "</ul>";
    }

    emailText += "<li>Цена – " + zakaz.detalirovka[i].price + " руб.</li>";
    emailText +=  "<br>";
  }

  emailText += "</ul>";

  emailText += "Общая площадь прямых деталей: " + zakaz.totalSquare + " м²<br><br>";

  if (zakaz.radius.length > 0) {
    emailText += "Радиусные фасады: ";
    emailText += "<br><ul>";
    for (var r = 0; r < zakaz.radius.length; r++) {
      emailText += "Деталь " + (r+1) + ":";
      emailText += "<li>" + zakaz.radius[r].height + " мм, " + zakaz.radius[r].count +" шт</li>";
      emailText += "<li>Тип " + zakaz.radius[r].type;
      emailText += "</li>";
      emailText += "<li>Цена " + zakaz.radius[r].price + " руб.";
      emailText += "</li><br>";
    }
    emailText += "</ul>";
  }

  if (zakaz.comment) {
    emailText += "Комментарий к заказу: " + zakaz.comment + "<br><br>";
  }

  emailText += "Срок изготовления: " + zakaz.srok + "<br>";
  emailText += "Пункт выдачи: " + zakaz.address + "<br>";
  emailText += "<br>";
  emailText += "Телефон клиента: " + zakaz.phone + "<br>";
  emailText += "E-mail: " + zakaz.email + "<br>";
  emailText += "<br>";
  emailText += "<b>Сумма заказа: " + zakaz.totalPriceFormatted + " руб.</b><br>";
  emailText += "<b>Предоплата 30%: " + parseInt(zakaz.predoplata).formatMoney(0, '', ' ') + " руб.</b><br>";
  emailText += "Ссылка для оплаты: <a href='" + zakaz.link + "'>Безопасно внести предоплату картой VISA/MASTERCARD</a><br>";
  emailText += "<br>";
  emailText += "По любым вопросам вы можете позвонить нам по телефону +7 (950) 843-06-92";
  emailText += "<br><br>";
  emailText +="С уважением,<br>";
  emailText +="Команда <a href='http://fasadio.ru'>Fasadio.ru</a>";

  // console.log(emailText);

  jQuery.ajax({
    type: "POST",
    url: "https://mandrillapp.com/api/1.0/messages/send.json",
    data: {
      'key': 'pyL7NQYaVCP7PkkLq0BnSQ',
      'message': {
        'from_email': 'zakaz@fasadio.ru',
        'from_name': 'Fasadio.ru',
        'to': [{
          'email': zakaz.email,
          'type': 'to'
        }],
        'autotext': 'true',
        'subject': "Ваш заказ в Fasadio.ru от " + zakaz.date,
        'html': emailText
      }
    }
  }).done(function(response) {
    jQuery.ajax({
      type: "POST",
      url: "https://mandrillapp.com/api/1.0/messages/send.json",
      data: {
        'key': 'pyL7NQYaVCP7PkkLq0BnSQ',
        'message': {
          'from_email': 'robot@fasadio.ru',
          'from_name': 'Robot Fasadio',
          'to': [{
            'email': "zakaz@fasadio.ru",
            'type': 'to'
          }],
          'autotext': 'true',
          'subject': "Заказ в Fasadio.ru от " + zakaz.date,
          'html': emailText
        }
      }
    }).done(function(response) {
      document.location.href = zakaz.link;
      // window.open(zakaz.link,'_blank');
      return true;
    }).fail(function(error) {
      // alert('Не удалось отправить письмо, проверьте правильность написания E-mail');
      // $('#btnPay').attr('disabled',false);
      console.log(error);
      return false;
    });

    return true;
  }).fail(function(error) {
    alert('Не удалось отправить письмо, проверьте правильность написания E-mail');
    yaCounter44669668.reachGoal('errorEmail');
    $('#btnPay').attr('disabled',false);
    console.log(error);
    return false;
  });

}

$(function() {
  $('[data-toggle="tooltip"]').tooltip();
  watchRows();
  updateCubeColor();
});

$('form').submit(function() {
  return false;
});



function petliSave() {
  //прочитать все поля на странице и записать в переменные
  var otverstia = "";
  if ($('#otverstia-2')[0].checked === true) {otverstia = 2;}
  if ($('#otverstia-3')[0].checked === true) {otverstia = 3;}
  if ($('#otverstia-4')[0].checked === true) {otverstia = 4;}
  if ($('#otverstia-5')[0].checked === true) {otverstia = 5;}
  if ($('#otverstia-6')[0].checked === true) {otverstia = 6;}
  zakaz.detalirovka[ window.petliRow.id ].petli = {
    row: window.petliRow.id+1,
    storona : window.petliRow.storona,
    otverstia: otverstia,
    rasstCentraDoKraya: $('#rasstCentraDoKraya').val(),
    rasstCentraDoKromki: $('#rasstCentraDoKromki').val(),
    diametrSverla: $('#diametrSverla').val(),
    glubinaOtverstia: $('#glubinaOtverstia').val()
  };

  zakaz.petli[window.petliRow.id] = zakaz.detalirovka[ window.petliRow.id ];

  var hidePetliStorona = "";
  if (window.petliRow.storona == "a"){hidePetliStorona = "b";}
  if (window.petliRow.storona == "b"){hidePetliStorona = "a";}

  $("#petli-"+hidePetliStorona+"-" + window.petliRow.row).css('display','none');
  $("#petli-"+window.petliRow.storona+"-" + window.petliRow.row).html(otverstia + ' отверстия');
  updateDetalirovka();
  calculatePrice();
}

function scrollPay() {
  $('html, body').animate({
    scrollTop: $( "#fs-pay-section" ).offset().top
  }, 800);
  setTimeout(function () {
    $('#payWidget').animateCss('fadeOutRight');
  }, 700);
  setTimeout(function () {
    $('#payWidget').css('display','none');
  }, 1200);
}
