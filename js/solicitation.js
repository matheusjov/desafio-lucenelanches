$( document ).ready(function() {
  var lanches = {};
  var valorItens = 0;
  var valorTotal = 0;
  var auxPao;
  var auxPaoText;
  var auxQueijo;
  var auxQueijoText;
  var auxRecheio;
  var auxRecheioText;
  var auxSalada;
  var auxSaladaText;
  var aux = 0;
  var aux2 = 0;
  var auxLancheText;

  $('.obrigatorio').hide();
  $('#um-lanche').hide();
  $('#lb-valor-porcento').hide();

  $.ajax({
    type: "GET",
    async: false,
    url: 'https://private-anon-e1892d7b1a-lucenelanchesfrontend.apiary-mock.com/lanches',
    dataType : 'JSON',
    complete : function(data){
      var arr = JSON.parse(data.responseText);
      $.each(arr, function(index, item) {
        lanches[item.nome] = item.ingredientes;
        $('#lista').append(
          $("<option></option>")
          .text(item.nome)
          .val(item.nome)
        );
      })
    }
  });

  $.ajax({
    type: "GET",
    async: false,
    url: 'https://private-anon-e1892d7b1a-lucenelanchesfrontend.apiary-mock.com/ingredientes',
    dataType : 'JSON',
    complete : function(data) {
      var arr = JSON.parse(data.responseText);
      for (var i = 0; i < arr.length; i++) {
        if(arr[i].categoria == "Tipo de pão"){
          buildTipoPao(arr[i]);
        } else if (arr[i].categoria == "Queijos") {
          buildQueijo(arr[i]);
        } else if (arr[i].categoria == "Recheio") {
          buildRecheio(arr[i]);
        } else if (arr[i].categoria == "Saladas") {
          buildSaladas(arr[i]);
        } else if (arr[i].categoria == "Molhos") {
          buildMolhos(arr[i]);
        } else if (arr[i].categoria == "Temperos") {
          buildTemperos(arr[i]);
        }
      }
    }
  });

  $('.translate').click(function() {
    var lang = $(this).attr('id');
    translate(lang);
  });

  $( "#lista" ).change(function() {
    var arr = lanches[this.value];
    aux = 0;
    if(this.value != ""){
      for (var i = 0; i < arr.length; i++) {
        if(arr[i].categoria == "Tipo de pão"){
          $('#tipoPao').val(arr[i].valor);
          aux += arr[i].valor;
          auxPao = arr[i].valor;
          auxPaoText = arr[i].nome;
        } else if (arr[i].categoria == "Queijo") {
          $('#queijo').val(arr[i].valor);
          aux += arr[i].valor;
          auxQueijo = arr[i].valor;
          auxQueijoText = arr[i].nome;
        } else if (arr[i].categoria == "Recheio") {
          $('#recheio').val(arr[i].valor);
          aux += arr[i].valor;
          auxRecheio = arr[i].valor;
          auxRecheioText = arr[i].nome;
        } else if (arr[i].categoria == "Saladas") {
          aux += arr[i].valor;
          $('input[name=salada][value="'+arr[i].nome+'"]').prop( "checked", true );
        } else if (arr[i].categoria == "Molhos") {
          aux += arr[i].valor;
          $('input[name=molho][value="'+arr[i].nome+'"]').prop( "checked", true );
        } else if (arr[i].categoria == "Temperos") {
          aux += arr[i].valor;
          $('input[name=tempero][value="'+arr[i].nome+'"]').prop( "checked", true );
        }
      }
      valorItens -= aux2;
      valorItens += aux;
      $("#lb-valorPedido").text(formataValor(valorItens));
    } else {
      valorItens = 0;
      limpaCampos();
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
    aux2 = aux;
  });

  $("#tipoPao").change(function() {
    if (auxPaoText) {
      if (auxPaoText != $(this).find("option:selected").text()) {
        valorItens -= auxPao;
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }else{
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }
    } else {
      valorItens += Number(this.value);
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
    auxPaoText = $(this).find("option:selected").text();
    auxPao = Number(this.value);
  });

  $("#queijo").change(function() {
    if (auxQueijoText) {
      if (auxQueijoText != $(this).find("option:selected").text()) {
        valorItens -= auxQueijo;
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }else{
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }
    }else{
      valorItens += Number(this.value);
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
    auxQueijoText = $(this).find("option:selected").text();
    auxQueijo = Number(this.value);
  });

  $("#recheio").change(function() {
    if (auxRecheioText) {
      if (auxRecheioText != $(this).find("option:selected").text()) {
        valorItens -= auxRecheio;
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }else{
        valorItens += Number(this.value);
        $("#lb-valorPedido").text(formataValor(valorItens));
      }
    }else{
      valorItens += Number(this.value);
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
    auxRecheioText = $(this).find("option:selected").text();
    auxRecheio = Number(this.value);
  });

  $("input[type=radio][name^='salada']").click(function(){
    if (auxSaladaText) {
      if (auxSaladaText != this.value) {
        if($(this).is(":checked")){
          valorItens -= auxSalada;
          valorItens += Number($(this).data('valor'));
          $("#lb-valorPedido").text(formataValor(valorItens));
        }else{
          valorItens -= Number($(this).data('valor'));
          $("#lb-valorPedido").text(formataValor(valorItens));
        }
      }
    }else{
      valorItens += Number($(this).data('valor'));
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
    auxSalada = Number($(this).data('valor'));
    auxSaladaText = this.value;
  });

  $("input[type=checkbox][name^='molho[]']").click(function(){
    if($(this).is(":checked")){
      valorItens += Number($(this).data('valor'));
      $("#lb-valorPedido").text(formataValor(valorItens));
    }else{
      valorItens -= Number($(this).data('valor'));
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
  });

  $("input[type=checkbox][name^='tempero[]']").click(function(){
    if($(this).is(":checked")){
      valorItens += Number($(this).data('valor'));
      $("#lb-valorPedido").text(formataValor(valorItens));
    }else{
      valorItens -= Number($(this).data('valor'));
      $("#lb-valorPedido").text(formataValor(valorItens));
    }
  });

  $('#btn-salvar').click(function() {
    $('.obg-nome').hide();
    $('.obg-endereco').hide();
    $('.obg-pao').hide();
    $('.obg-salada').hide();
    if ($('#nome').val() != "" && $('#endereco').val() != "" && $('#tipoPao').val() != "" && $('input[name=salada]:checked').val() != undefined) {
      valorTotal += valorItens;
      $('#um-lanche').hide();
      adicinaLanche();
      valorItens = 0;
      aux2 = 0;
      $("#lb-valor-total").text(formataValor(valorTotal));
      $("#lb-valorPedido").text(formataValor(valorItens));
    } else {
      if ($('#nome').val() == "") {
        $('.obg-nome').show();
      } if ($('#endereco').val() == "") {
        $('.obg-endereco').show();
      } if ($('#tipoPao').val() == "") {
        $('.obg-pao').show();
      } if ($('input[name=salada]:checked').val() == undefined){
        $('.obg-salada').show();
      }
    }
  });

  $('#btn-finalizar').click(function() {
    if ($('#lista-de-lanches').find('li').length > 0) {
      $.post( "https://private-anon-e1892d7b1a-lucenelanchesfrontend.apiary-mock.com/lanches", {name:'teste'}, function( data ) {
        console.log(data);
      });
      $('#lb-nome').text($('#nome').val())
      $('#seu-pedido').text(formataValor(valorTotal));
      $('#valor-pedido').val(formataValor(valorTotal));
      $('.modal-title').find('span').text(nome);
      $('#myModal').modal('show');
    }else{
      $('#um-lanche').show();
    }
  });

  $('#quantidade-pessoas').change(function(){
    var valorpessoa = (valorTotal / this.value);
    $('#valor-pessoa').val(formataValor(valorpessoa));
    if ($('#lista-pessoas').find('div').length > 0) {
      $('#lista-pessoas').find('div').remove();
    }
    if (this.value > 0) {
      $('#lb-valor-porcento').show();
      var count = 1;
      for (var i = 0; i < this.value; i++) {
        $('#lista-pessoas').append('<div class="row">\
        <div class="form-group col-md-3">\
        <label class="modal-label lang" key="pessoa">Pessoa</label><br><p>'+count+'</p>\
        </div>\
        <div class="form-group col-md-4">\
        <input type="text" class="form-control" data-count="'+count+'" placeholder="R$ 0,00" id="valor-pedido_'+count+'" name="valor-pedido">\
        </div>\
        <div class="form-group col-md-4">\
        <input type="number" class="form-control" data-count="'+count+'" id="porcentagem-pedido_'+count+'" name="porcentagem-pedido">\
        </div>\
        </div>');
        count++;
      }
    }
    $("input[name=valor-pedido]").change(function() {
      var el = $('#valor-pedido_' +  $(this).data('count'));
      var rep = (el.val() * 100) / valorTotal
      $('#porcentagem-pedido_' + $(this).data('count')).val(rep.toFixed(2));
    });

    $("input[name=porcentagem-pedido]").change(function() {
      var el = $('#porcentagem-pedido_' +  $(this).data('count'));
      var rep = valorTotal * (el.val() / 100);
      $('#valor-pedido_' + $(this).data('count')).val(formataValor(rep));
    });
  });

});

var ordem = 1;
function adicinaLanche(){
  var molho = new Array();
  var tempero = new Array();
  var str = new Array();

  var nome = $('#nome').val();
  var endereco = $('#endereco').val();
  var lista = $('#lista').val();
  var pao = $('#tipoPao').val();
  var textPao = $("#tipoPao option:selected").text();
  var queijo = $('#queijo').val();
  var textQueijo = $("#queijo option:selected").text();
  var recheio = $('#recheio').val();
  var textRecheio = $("#recheio option:selected").text();
  var salada = $('input[name=salada]:checked').parent().text();

  $("input[type=checkbox][name='molho[]']:checked").each(function(){
    molho.push($(this).parent().text());
  });
  $("input[type=checkbox][name='tempero[]']:checked").each(function(){
    tempero.push($(this).parent().text());
  });

  if (textQueijo != 'Selecione...') {
    str.push(textQueijo);
  } if (textRecheio != 'Selecione...') {
    str.push(textRecheio);
  } if (salada) {
    str.push(salada);
  } if (molho.length > 0) {
    str.push(molho.join());
  } if (tempero.length > 0) {
    str.push(tempero.join());
  }

  var s = str.join().replace(/,/g,' - ');

  $("#lista-de-lanches").append("<li class='list-group-item'>" + ordem + " " + textPao + " - " +s+ "</li>");

  limpaCampos();
  ordem++;
}

function formataValor(v) {
  v=v.toFixed(2);
  v=v.toString();
  v=v.replace(/\D/g,"");
  v=v.replace(/(\d)(\d{8})$/,"$1.$2");
  v=v.replace(/(\d)(\d{5})$/,"$1.$2");
  v='R$ ' +v.replace(/(\d)(\d{2})$/,"$1,$2");
  return v;
}

function limpaCampos() {
  $('#lista').val("");
  $('#tipoPao').val("");
  $('#queijo').val("");
  $('#recheio').val("");
  $('input[name=salada]').prop( "checked", false );
  $("input[type=checkbox][name='molho[]']").prop( "checked", false );
  $("input[type=checkbox][name='tempero[]']").prop( "checked", false );
}

function buildTipoPao(obj) {
  $.each(obj.ingredientes, function(index, item) {
    $("#tipoPao").append(
      $("<option></option>")
      .text(item.nome)
      .val(item.valor)
    );
  })
}

function buildQueijo(obj) {
  $.each(obj.ingredientes, function(index, item) {
    $("#queijo").append(
      $("<option></option>")
      .text(item.nome)
      .val(item.valor)
    );
  })
}

function buildRecheio(obj) {
  $.each(obj.ingredientes, function(index, item) {
    $("#recheio").append(
      $("<option></option>")
      .text(item.nome)
      .val(item.valor)
    );
  })
}

function buildSaladas(obj) {
  $.each(obj.ingredientes, function(index, item){
    $('#saladas').append("<div class='row'><input type='radio' name='salada' class='checksalada' data-valor="+ item.valor +" value='" + item.nome + "'/><label class='lang' key='"+item.nome+"'>"+item.nome+"</label></div><br>");
  })
}

function buildMolhos(obj) {
  $.each(obj.ingredientes, function(index, item){
    $('#molhos').append("<div class='row'><input type='checkbox' name='molho[]' data-valor="+ item.valor +" value='" + item.nome + "'/><label class='lang' key='"+item.nome+"'>"+ item.nome +"</label></div><br>");
  })
}

function buildTemperos(obj) {
  $.each(obj.ingredientes, function(index, item){
    $('#temperos').append("<div class='row'><input type='checkbox' name='tempero[]' data-valor="+ item.valor +" value='" + item.nome + "'/><label class='lang' key='"+item.nome+"'>"+ item.nome +"</label></div><br>");
  })
}

function translate(lang){
  var arrLang = new Array();
  arrLang['pt'] = new Array();
  arrLang['en'] = new Array();
  // strings portugues
  arrLang['pt']['nome'] = 'Nome';
  arrLang['pt']['endereco'] = 'Endereço';
  arrLang['pt']['lista'] = 'Lista de Lanches';
  arrLang['pt']['tipoPao'] = 'Tipo de Pão';
  arrLang['pt']['queijo'] = 'Queijo';
  arrLang['pt']['recheio'] = 'Recheio';
  arrLang['pt']['salada'] = 'Salada';
  arrLang['pt']['molhos'] = 'Molhos';
  arrLang['pt']['temperos'] = 'Temperos';
  arrLang['pt']['Alface'] = 'Alface';
  arrLang['pt']['Rúcula'] = 'Rúcula';
  arrLang['pt']['Cebola'] = 'Cebola';
  arrLang['pt']['Cebola roxa'] = 'Cebola roxa';
  arrLang['pt']['Acelga'] = 'Acelga';
  arrLang['pt']['Mostarda e Mel'] = 'Mostarda e Mel';
  arrLang['pt']['Cebola Agridoce'] = 'Cebola Agridoce';
  arrLang['pt']['Barbecue'] = 'Barbecue';
  arrLang['pt']['Parmesão'] = 'Parmesão';
  arrLang['pt']['Maionese'] = 'Maionese';
  arrLang['pt']['Apimentado'] = 'Apimentado';
  arrLang['pt']['Italiano'] = 'Italiano';
  arrLang['pt']['Pimenta'] = 'Pimenta';
  arrLang['pt']['Sal'] = 'Sal';
  arrLang['pt']['Orégano'] = 'Orégano';
  arrLang['pt']['Pimenta calabresa'] = 'Pimenta calabresa';
  arrLang['pt']['credito'] = 'Crédito';
  arrLang['pt']['debito'] = 'Débito';
  arrLang['pt']['dinheiro'] = 'Dinheiro';
  arrLang['pt']['sim'] = 'Sim';
  arrLang['pt']['nao'] = 'Não';
  arrLang['pt']['valor'] = 'O valor total do seu pedido é de';
  arrLang['pt']['troco'] = 'Precisa de troco?';
  arrLang['pt']['formaPagamento'] = 'Qual a forma de pagamento?';
  arrLang['pt']['ola'] = 'Olá';
  arrLang['pt']['seupedido'] = 'Seu pedido já está em andamento';
  arrLang['pt']['calculadora'] = 'Use nossa calculadora caso queira dividir o valor';
  arrLang['pt']['valorPedido'] = 'Valor do pedido';
  arrLang['pt']['pessoas'] = 'Quantidade de pessoas';
  arrLang['pt']['valorPessoa'] = 'Valor por pessoa';
  arrLang['pt']['valorPedidoPessoa'] = 'Valor';
  arrLang['pt']['pessoa'] = 'Pessoa';
  arrLang['pt']['salvar'] = 'Salvar';
  arrLang['pt']['finalizar'] = 'Finalizar';
  arrLang['pt']['obrigatorio'] = 'Este campo é obrigatório.';
  arrLang['pt']['um-lanche'] = 'Ao menos um lanche deve ser selecionado para o pedido.';
  // strings ingles
  arrLang['en']['nome'] = 'Name';
  arrLang['en']['endereco'] = 'Address';
  arrLang['en']['lista'] = 'List of Snacks';
  arrLang['en']['tipoPao'] = 'Type of Bread';
  arrLang['en']['queijo'] = 'Cheese';
  arrLang['en']['recheio'] = 'Filling';
  arrLang['en']['salada'] = 'Salad';
  arrLang['en']['molhos'] = 'Sauces';
  arrLang['en']['temperos'] = 'Spices';
  arrLang['en']['Alface'] = 'Lettuce';
  arrLang['en']['Rúcula'] = 'Arugula';
  arrLang['en']['Cebola'] = 'Onion';
  arrLang['en']['Cebola roxa'] = 'Purple Onion';
  arrLang['en']['Acelga'] = 'Chard';
  arrLang['en']['Mostarda e Mel'] = 'Mustard and Honey';
  arrLang['en']['Cebola Agridoce'] = 'Sweet Onion';
  arrLang['en']['Barbecue'] = 'Barbecue';
  arrLang['en']['Parmesão'] = 'Parmesan';
  arrLang['en']['Maionese'] = 'Mayonnaise';
  arrLang['en']['Apimentado'] = 'Spicy';
  arrLang['en']['Italiano'] = 'Italian';
  arrLang['en']['Pimenta'] = 'Chili';
  arrLang['en']['Sal'] = 'Salt';
  arrLang['en']['Orégano'] = 'Oregano';
  arrLang['en']['Pimenta calabresa'] = 'Pepperoni pepper';
  arrLang['en']['credito'] = 'Credit';
  arrLang['en']['debito'] = 'Debit';
  arrLang['en']['dinheiro'] = 'Money';
  arrLang['en']['sim'] = 'Yes';
  arrLang['en']['nao'] = 'No';
  arrLang['en']['valor'] = 'The total value of your order is ';
  arrLang['en']['troco'] = 'Need change?';
  arrLang['en']['formaPagamento'] = 'What is the payment method?';
  arrLang['en']['ola'] = 'Hello ';
  arrLang['en']['seupedido'] = 'Your order is already in progress';
  arrLang['en']['calculadora'] = 'Use our calculator if you want to split the';
  arrLang['en']['valorPedido'] = 'Value of the order';
  arrLang['en']['pessoas'] = 'Amount of people';
  arrLang['en']['valorPessoa'] = 'Value per person';
  arrLang['en']['valorPedidoPessoa'] = 'Value';
  arrLang['en']['pessoa'] = 'People';
  arrLang['en']['salvar'] = 'Save';
  arrLang['en']['finalizar'] = 'Finish';
  arrLang['en']['obrigatorio'] = 'This fields is required.';
  arrLang['en']['um-lanche'] = 'At least one snack must be selected for the order.';

  $('.lang-placeholder').each(function(index, element) {
    $(this).attr("placeholder", arrLang[lang][$(this).attr('key')])
  });

  $('.lang').each(function(index, element) {
    $(this).text(arrLang[lang][$(this).attr('key')]);
  });
}
