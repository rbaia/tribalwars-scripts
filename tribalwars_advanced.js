(function( DEBUG ) {

// verifica se o script ja foi executado na página
if ( document.getElementById( 'TWA_MENU' ) ) {
	//return false;
}

var DATA;
var TRANSLATES;
var TEMPLATES;
var STYLES;

// numero de revisão
var rev = 1;
// token da página "mail"
var mailCsrf;
// elemento server date
var $sd;
// elemento server time
var $st;
// elemento tooltip
var $tooltip;
// objeto com as traduções da linguagem do usuário
var lang;
// historico de log
var logHistory = [];
// dados padrão do cache do script
var defaults = {
	'TWA DATA': { units: {}, builds: {}, settings: {}, villages: {}, players: {}, configs: { lang: 'en' }, rev: rev },
	'TWA AUTO_FARM MODELS': { 'Farm #1': { units: {}, coords: [], index: 0 } },
	'TWA COMMAND_PLANNER COMMANDS': [],
	'TWA COMMAND_PLANNER COMMANDS_SEND': [],
	'TWA AUTO_FARM ATTACK_LOG': [],
	'TWA AUTO_BUILD MAX_LEVELS': { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
	'TWA AUTO_BUILD MIN_LEVELS': { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
	'TWA AUTO_BUILD ORDERS': 5,
	'TWA TRANSLATES': {},
	'TWA TEMPLATES': {}
};

// regexp
var rcoords = /^\d{1,3}\|\d{1,3}$/;
var rvillage = /(.+)\s\((\d+)\|(\d+)\)\sK\d+$/;
var rtemplLang = /\{lang\.([^\}]+)\}/g;
var rtempl = /\{(\w+)\}/g;
var rdigit = /\d+/;
var rpngname = /\/([a-z]+)\.png/;
var rvid = /village=\d+/;
var rorder = /order=(\w+)/;

// APPS FUNCTIONS

/** COMMAND_PLANNER - Envia ataques/apoios em horários e unidades pré-definidas */
var COMMAND_PLANNER = function() {
	LOG( 'COMMAND_PLANNER()' );
	
	var commands = DEFAULTS( 'TWA COMMAND_PLANNER COMMANDS' );
	var commandsSend = DEFAULTS( 'TWA COMMAND_PLANNER COMMANDS_SEND' );
	
	// armazena todos os timeouts dos comandos da fila de espera
	var commandTimers = {};
	
	// inputs de entrada das unidades e icones
	var inputs = '';
	var header = '';
	
	// faz o loop em cada categoria de unidades para gerar uma
	// divisória para cada um na tabela
	jQuery.each([
		['spear', 'sword', 'axe', 'archer'],
		['spy', 'heavy', 'light', 'marcher'],
		['ram', 'catapult'],
		['knight', 'snob']
	], function() {
		inputs += '<td valign="top">';
		
		// loop em todas unidades da categoria em questão
		jQuery.each(this, function( i, unit ) {
			// verifica se a unidade existe no banco de configurações pois
			// existem mundos que não arqueiros e paladinos não são ativados
			if ( DATA.units[ unit ] ) {
				inputs += '<span><img src="http://cdn.tribalwars.com.br/graphic/unit/unit_' + unit + '.png"/> <input name="' + unit + '" class="TWA_UNITS" type="text" style="width:40px"> <input class="TWA_ALL" type="checkbox"></span>';
				header += '<th><img src="http://cdn.tribalwars.com.br/graphic/unit/unit_' + unit + '.png"/></th>';
			}
		});
		
		inputs += '</td>';
	});
	
	// adiciona a entrada do planeador no menu principal e gera a janela do app
	var app = INTERFACE.createApp(lang.command_planner.command_planner, TEMPLATES.command_planner.html, {
		inputs: inputs,
		header: header
	});
	
	// ao clicar no botão "Adicionar comando" é chamada a função ADD
	app.find( 'input[type=button]' ).click(function() {
		ADD.apply( window, PREPARE_ADD() );
	});
	
	// ao apertar a tecla "Enter" é chamada a função ADD
	app.find( 'form' ).keypress(function( event ) {
		if ( event.keyCode === 27 ) {
			ADD.apply( window, PREPARE_ADD() );
		}
	});
	
	// ao clicar no link "Atual" adiciona as coordenadas da aldeia atual no campo
	app.find( '.TWA_CURRENT' ).click(function() {
		jQuery( '[name=CMDPLANNER_FROM]' ).val( game_data.village.coord );
		return false;
	});
	
	// ao clicar no checkbox para ativar o "enviar todas"
	app.find( '.TWA_ALL' ).click(function() {
		var elem = jQuery( this );
		
		// caso a opção seja descelecionada, ativa o campo novavemte
		if ( !this.checked ) {
			return elem.prev().prop( 'disabled', false ).val('');
		}
		
		// coordendas da aldeia atacante
		var coords = jQuery( '[name=CMDPLANNER_FROM]' ).val();
		
		// caso a coordendas inserida não bata com o padrão
		if ( !rcoords.test( coords ) ) {
			// desativa novamente o checkbox
			elem.prop( 'checked', false );
			UI.InfoMessage( lang.command_planner.error_coords_from );
		} else {
			// desativa o campo
			var input = elem.prev().prop( 'disabled', true );
			
			// obtem todas unidades da aldeia em questão
			GET_VILLAGE_UNITS(coords, function( units ) {
				// insere as unidades no campo desativado
				input.val( units[ input.attr( 'name' ) ] );
			}, function() {
				// caso a aldeia atacante não seja do jogador da conta,
				// mostra uma mensagem informativa e ativa o campo novamente
				UI.InfoMessage( lang.command_planner.error_coord_own );
				
				input.prop( 'disabled', false );
				elem.prop( 'checked',  false );
			});
		}
		
		return true;
	});
	
	// limpa todo o log_history de comandos enviados.
	app.find( '.TWA_EMPTY_SENDED' ).click(function() {
		localStorage.removeItem( 'TWA COMMAND_PLANNER COMMANDS_SEND' );
		UPDATE();
		return false;
	});
	
	// carrega o plugin jquery.DateTimePicker
	jQuery.getScript('http://relaxeaza.aws.af.cm/TWA/jquery.datetimepicker.js', function() {
		app.find( '[name=CMDPLANNER_TIME]' ).datetimepicker({
			value: TIMESTAMP_FORMAT( CURRENT_TIME() ),
			format: 'H:i:s d/m/Y',
			formatDate: 'd/m/Y',
			formatTime: 'H:i',
			minDate: 0,
			step: 5
		});
	});
	
	/** COMMAND_PLANNER -> PREPARE_ADD - É gerado os argumentos da função ADD apartir das entradas com os dados do comando */
	function PREPARE_ADD() {
		LOG( 'COMMAND_PLANNER->PREPARE_ADD' );
		
		var data = app.find( 'form' ).serializeArray();
		var units = {};
		
		app.find( '.TWA_UNITS' ).each(function() {
			if ( this.disabled ) {
				units[ this.name ] = true;
			} else if ( this.value.length > 0 && !isNaN( this.value ) ) {
				units[ this.name ] = +this.value;
			}
		});
		
		return [ data[ 0 ].value, data[ 1 ].value, data[ 2 ].value, data[ 3 ].name === 'CMDPLANNER_SUPPORT', units ];
	}
	
	/** COMMAND_PLANNER -> ADD - Adiciona comandos a lista de espera.
	 * from {String} - coordenadas da aldeia de enviará o comando.
	 * to {String} - coordenadas da aldeia que receberá o comando.
	 * time {Number} - horário que o comando será enviado.
	 * support {Boolean} - define o comando como apoio.
	 * units {Object|Boolean} - unidades que seram enviadas no comando (true para enviar todas unidades). */
	function ADD( from, to, time, support, units ) {
		LOG( 'COMMAND_PLANNER->ADD()' );
		
		// transforma o tempo em milisegundos
		time = FORMAT_TIMESTAMP( time );
		
		// é verificado se os valores passados ao comando estão em ordem
		// para funcionar sem erros.
		
		// aldeia atacante
		if ( !rcoords.test( from ) ) {
			return UI.ErrorMessage( lang.command_planner.error_coords_from );
		// aldeia alvo
		} else if ( !rcoords.test( to ) ) {
			return UI.ErrorMessage( lang.command_planner.error_coords_to );
		// horário
		} else if ( time < CURRENT_TIME() ) {
			return UI.ErrorMessage( lang.command_planner.error_low_time );
		// unidades
		} else if ( jQuery.isEmptyObject(units) ) {
			return UI.ErrorMessage( lang.command_planner.error_no_units );
		}
		
		// transforma as coordenadas em Array e os valores em Number
		from = from.split( '|' );
		from[ 0 ] = +from[ 0 ];
		from[ 1 ] = +from[ 1 ];
		to = to.split( '|' );
		to[ 0 ] = +to[ 0 ];
		to[ 1 ] = +to[ 1 ];
		
		// salva o Array com os comandos no cache do navegado
		commands.push({ from: from, to: to, time: time, support: support, units: units });
		localStorage[ 'TWA COMMAND_PLANNER COMMANDS' ] = JSON.stringify( commands );
		
		// atualiza a lista de comandos na janela
		UPDATE();
	}
	
	/** COMMAND_PLANNER -> UPDATE - Atualiza a lista (HTML) de comandos na fila de espera. */
	function UPDATE() {
		LOG( 'COMMAND_PLANNER->UPDATE()' );
		
		// caso tenha algum comando na fila de espera é mostrado a table com o titulo na janela
		app.find( '.TWA_COMMANDS' )[ commands.length ? 'show' : 'hide' ]();
		app.find( '.TWA_COMMANDS_SEND' )[ commandsSend.length ? 'show' : 'hide' ]();
		
		// ordena os comandos por tempo
		commands = commands.sort(function( a, b ) {
			return a.time - b.time;
		});
		
		commandsSend = commandsSend.sort(function( a, b ) {
			return a.time - b.time;
		});
		
		var commandsTable = app.find( '.TWA_COMMANDS table' );
		var commandsSendTable = app.find( '.TWA_COMMANDS_SEND table' );
		var units;
		var amount;
		
		// remove todos os comandos da tabela de fila de espera
		commandsTable.find( 'tr:not(:first)' ).remove();
		commandsSendTable.find( 'tr:not(:first)' ).remove();
		
		// loop em todos comandos e jogado na janela um por um
		for ( var cmdi in commands ) {
			units = '';
			
			for ( var unit in DATA.units ) {
				amount = commands[ cmdi ].units[ unit ] || '0';
				units += '<td class="' + ( +amount > 0 ? '' : 'hidden' ) + '">' + ( amount === true ? 'x' : amount ) + '</td>';
			}
			
			commandsTable.append(FORMAT(TEMPLATES.command_planner.command, {
				from: commands[ cmdi ].from.join( '|' ),
				to: commands[ cmdi ].to.join( '|' ),
				time: TIMESTAMP_FORMAT( commands[ cmdi ].time ),
				type: '<img src="http://cdn.tribalwars.com.br/graphic/command/' + (commands[ cmdi ].support ? 'support' : 'attack') + '.png"/>', 
				units: units,
				cmdi: cmdi
			}));
		}
		
		// loop em todos comandos passados
		for ( cmdi in commandsSend ) {
			units = '';
			
			for ( unit in DATA.units ) {
				amount = commandsSend[ cmdi ].units[ unit ] || '0';
				units += '<td class="' + ( +amount > 0 ? '' : 'hidden' ) + '">' + ( amount === true ? 'x' : amount ) + '</td>';
			}
			
			commandsSendTable.append(FORMAT('<tr><td class="coord">{from}</td><td class="coord">{to}</td><td>{time}</td><td>{type}</td>{units}<td>{state}</td></tr>', {
				from: commandsSend[ cmdi ].from.join( '|' ),
				to: commandsSend[ cmdi ].to.join( '|' ),
				time: TIMESTAMP_FORMAT( commandsSend[ cmdi ].time ),
				type: '<img src="http://cdn.tribalwars.com.br/graphic/command/' + (commandsSend[ cmdi ].support ? 'support' : 'attack') + '.png"/>', 
				units: units,
				state: commandsSend[ cmdi ].state
			}));
		}
		
		// ao clicar no icone para remover o comando, remove e atualiza a lista
		app.find( '.TWA_DEL' ).click(function() {
			var index = jQuery( this ).parent().parent().data( 'cmdi' );
			REMOVE( index );
			UPDATE();
		});
		
		// atualiza todas coordenadas da lista de espera em links/nome de cada aldeia
		UPDATE_COORDS_INFO();
		CHECK_IN( true );
	}
	
	/** COMMAND_PLANNER -> UPDATE_COORDS_INFO - Substitui as coordenadas pelo nome/link das aldeias na lista de espera.
	 * elem {Element|Null} - Elemento que será atualizado individualmente. Quando nulo, é atualizado todos elementos da lista. */
	function UPDATE_COORDS_INFO( elem ) {
		LOG( 'COMMAND_PLANNER->UPDATE_COORDS_INFO()' );
		
		var village;
		
		app.find( '.coord' ).each(function( i, elem ) {
			if ( DATA.villages[ elem.innerHTML ] ) {
				village = DATA.villages[ elem.innerHTML ];
				
				elem.innerHTML = '<a href="' + URL( 'info_village&id=' + village.id ) + '">' + village.name + '</a>';
				TOOLTIP( elem, FORMAT( '{lang.command_planner.player}: <strong>{player}</strong>', { player: village.player_id == 0 ? lang.command_planner.abandoned : village.player_name } ) );
			} else {
				GET_VILLAGE_INFO(elem.innerHTML, function( data ) {
					if ( data.villages.length > 0 ) {
						village = data.villages[ 0 ];
						DATA.villages[ elem.innerHTML ] = village;
						localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
						
						elem.innerHTML = '<a href="' + URL( 'info_village&id=' + village.id ) + '">' + village.name + '</a>';
						TOOLTIP( elem, FORMAT( '{lang.command_planner.player}: <strong>{player}</strong>', { player: village.player_id == 0 ? lang.command_planner.abandoned : village.player_name } ) );
					}
				});
			}
		});
	}
	
	/** COMMAND_PLANNER -> REMOVE - Remove um comando da fila de espera.
	 * index {Number|Boolean} - Index do comando que será removido. Caso seja true, remove todos os comandos atrasados. */
	function REMOVE( index ) {
		LOG( 'COMMAND_PLANNER->REMOVE(' + index + ')' );
		
		// ordena os comandos por tempo
		commands = commands.sort(function( a, b ) {
			return a.time - b.time;
		});
		
		if ( index === true ) {
			var now = CURRENT_TIME();
			
			for ( var i = 0; i < commands.length; i++ ) {
				if ( now - 5000 > commands[i].time ) {
					commands.splice( i, 1 );
				}
			}
		} else {
			// remove o comando especificado e salva os dados no cache
			commands.splice( index, 1 );
		}
		
		SAVE();
		
		return false;
	}
		
	/** COMMAND_PLANNER -> CHECK_IN - Gera o timeout de cada comando. */
	function CHECK_IN( no_confirm ) {
		LOG( 'COMMAND_PLANNER->CHECK_IN()' );
		
		var now = CURRENT_TIME();
		var time;
		var min;
		var cmd;
		var j;
		var i;
		
		for ( i in commandTimers ) {
			clearTimeout( commandTimers[i] );
		}
		
		// loop em todos os comandos para gerar timeouts para cada um
		for ( i = 0; commands[i]; ) {
			commands[i].index = i;
			cmd = commands[ i++ ];
			
			// caso o comando esteja atrasado e a confirmação esteja ativada
			if ( !no_confirm && now - 5000 > cmd.time ) {
				// gera a confirmação para o usuario com as opções de enviar os comandos ou cancela-los
				min = ( now - cmd.time ) / 1000 / 60;
				
				// mostra a confirmação para o usuário
				CONFIRM(FORMAT( lang.command_planner.error_commands_late, { minutes: min } ), [{
					text: lang.command_planner.send,
					callback: function() {
						CHECK_IN( true );
					}
				}, {
					text: lang.command_planner.cancel,
					callback: function() {
						REMOVE( true );
						CHECK_IN( true );
					}
				}]);
				
				return false;
			}
			
			// gera o tempo com 7 segundos antes para preparar o comando
			// com antecedencia e não encher de requisições ajax em cima
			// da hora evitando atrasos indesejados no envio
			time = cmd.time - now - 7000;
			
			// setTimeout suporta apenas milisegundos menores que 2147483648
			// caso seja maior a função é executada na hora causando erros
			// no funcionamento do script 
			if ( time < 2147483648 ) {
				// gera o timeout
				commandTimers[i] = setTimeout(function() {
					// prepara o comando, remove da lista de espera e atualiza a lista
					PREPARE_COMMAND( cmd );
				}, time);
			}
		}
		
		return false;
	}
	
	/** COMMAND_PLANNER -> PREPARE_COMMAND - Remove um comando da fila de espera.
	 * cmd {Object} - Objeto com os dados necessários para preparar o envio do comando. */
	function PREPARE_COMMAND( cmd ) {
		LOG( 'COMMAND_PLANNER->PREPARE_COMMAND()' );
		
		// coordenadas da aldeia que enviará o comando
		var from = cmd.from.join( '|' );
		// gera os dados do comando
		var data = {
			x: cmd.to[ 0 ],
			y: cmd.to[ 1 ],
			template_id: '' // para simulação de formulario
		};
		
		// adiciona aos dados se o comando será um ataque ou apoio
		data[ cmd.support ? 'support' : 'attack' ] = true;
		
		GET_VILLAGE_UNITS(cmd.from.join( '|' ), function( units ) {
			// faz o loop em em todas unidades do comando, todas que estiverem
			// ativadas para enviar todas, será substituida pela quantidade
			// total que se encontra na aldeia
			for ( var unit in cmd.units ) {
				if ( cmd.units[ unit ] === true ) {
					data[ unit ] = units[ unit ];
				} else {
					data[ unit ] = cmd.units[ unit ];
				}
			}
			
			// pega os dados da aldeia que enviará o comando
			GET_VILLAGE_INFO(from, function( village ) {
				SEND( cmd, data, village.id );
			});
		});
	}
	
	/** COMMAND_PLANNER -> SEND - Envia a requisição ajax para realizar o envio do comando.
	 * cmd {Object} - Objeto do comando.
	 * data {Object} - Objeto com os dados necessários para realizar o comando.
	 * vid {Number} - ID da aldeia que realizará o comando. */
	function SEND( cmd, data, vid ) {
		LOG( 'COMMAND_PLANNER->SEND( ' + JSON.stringify( cmd ) + ' )' );
		
		// requisição 1/2 para o envio do comando
		jQuery.post(URL( 'place&try=confirm', vid ), data, function( html ) {
			// procura o elemento de erro na pagina carregada
			var error = jQuery( '.error_box', html );
			
			// caso o elemento exista, é mostrado o erro no LOG
			if ( error = error.text() ) {
				error = jQuery.trim( error );
				
				cmd.state = error;
				commandsSend.push( cmd );
				
				REMOVE( cmd.index );
				SAVE();
				UPDATE();
				
				return LOG( "COMMAND_PLANNER ERROR: " + error );
			}
			
			// seleciona o form da página
			var form = jQuery( 'form', html );
			// tempo em que falta para o comando ser enviado
			var freetime = cmd.time - CURRENT_TIME();
			
			setTimeout(function() {
				// requisição 2/2 para o envio do comando
				jQuery.post(form[ 0 ].action, form.serialize(), function() {
					cmd.state = lang.command_planner.sended;
					commandsSend.push( cmd );
					
					REMOVE( cmd.index );
					SAVE();
					UPDATE();
					
					LOG( 'COMMAND_PLANNER: ' + lang.command_planner.success_send );
				});
			}, freetime);
		});
	}
	
	/** SAVE - Salva os dados dos comandos no cache do navegador. */
	function SAVE() {
		LOG( 'COMMAND_PLANNER->SAVE()' );
		
		localStorage[ 'TWA COMMAND_PLANNER COMMANDS_SEND' ] = JSON.stringify( commandsSend );
		localStorage[ 'TWA COMMAND_PLANNER COMMANDS' ] = JSON.stringify( commands );
	}
	
	CHECK_IN();
	UPDATE();
	
	return false;
};

/** AUTO_FARM - Envia ataques em coordenadas e unidades pré-definidas em ciclos */
var AUTO_FARM = function() {
	LOG( 'AUTO_FARM()' );
	
	var models = DEFAULTS( 'TWA AUTO_FARM MODELS' );
	// histórico de ataques
	var attackLog = DEFAULTS( 'TWA AUTO_FARM ATTACK_LOG' );
	// autofarms armazena as instancias de cada modelo, para que possibilite
	// funcionar todos de forma sincronizada e individual
	var autofarms = {};
	// código unico enviado em cada requisição de comando
	var token = {};
	// elementos <th> da tabela com os icones das unidades
	var header = '';
	
	// carrega a praça de reunião e obtem o token
	jQuery.get(URL( 'place' ), function( html ) {
		var input = jQuery( '#units_form input:first', html )[0];
		token[ input.name ] = input.value;
	});
	
	// adiciona a entrada do farmador no menu principal e jera a janela do app
	var app = INTERFACE.createApp( lang.auto_farm.auto_farm, TEMPLATES.auto_farm.html );
	
	for ( var unit in DATA.units ) {
		header += '<th><img src="http://cdn.tribalwars.com.br/graphic/unit/unit_' + unit + '.png"/></th>';
	}
	
	// ao clicar no link para adicionar um novo modelo, adiciona
	app.find( '.TWA_ADDMODEL' ).click(function() {
		// nome que será dado ao modelo
		var mid = jQuery( '[name=TWA_MODELNAME]' ).val();
		
		// verifica se ja há algum modelo com o nome escolhido
		if ( models[ mid ] ) {
			return UI.ErrorMessage( lang.auto_farm.error_already_exists );
		// verifica se o nome tem menos de 3 letras
		} else if ( mid.length < 3 ) {
			return UI.ErrorMessage( lang.auto_farm.error_min_name );
		}
		
		// gera o objeto do modelo
		models[ mid ] = {
			units: {},
			coords: [],
			index: 0,
			stopNoUnits: false
		};
		
		// salva os dados e atualiza os modelos na janela
		SAVE();
		UPDATE();
		
		UI.SuccessMessage( FORMAT( lang.auto_farm.model_created, { name: mid } ) );
		
		return false;
	});
	
	// cria o modelo ao pressionar Enter
	app.find( '[name=TWA_MODELNAME]' ).keypress(function( event ) {
		if ( event.keyCode === 13 ) {
			app.find( '.TWA_ADDMODEL' ).trigger( 'click' );
			return false;
		}
	});
	
	// eventos dos modelos
	jQuery( document ).on('click', '.TWA_SAVE', function() {
		// pega o nome do modelo
		var mid = jQuery( this ).parent().data( 'mid' );
		// seleciona o form do modelo
		var form = jQuery( 'form[id="' + mid + '"]' );
		// pega os dados inserios no modelo
		var data = form.serializeArray();
		// caso a opção esteja ativada no formulario, é passado para "true" no loop
		models[ mid ].stopNoUnits = false;
		
		// faz o loop em cada dado
		for ( var i = 0; i < data.length; i++ ) {
			switch ( data[i].name ) {
				default:
					// trasforma a quantidade de unidades em Number
					models[ mid ].units[ data[i].name ] = data[i].value === 'x' ? 'x' : +data[i].value;
				break;
				case 'coords':
					// as coordenadas são cortadas pelos espaços (Array)
					models[ mid ].coords = jQuery.trim( data[i].value ).split( /\s+/ );
				break;
				case 'stop_no_units':
					models[ mid ].stopNoUnits = true;
				break;
			}
		}
		
		// salva os dados e atualiza os modelos na janela
		SAVE();
		UPDATE();
		
		UI.SuccessMessage( FORMAT( lang.auto_farm.model_saved, { name: name } ) );
	}).on('click', '.TWA_START', function() {
		var button = jQuery( this );
		// pega o nome do modelo
		var mid = button.parent().data( 'mid' );
		
		// caso o modelo estiver pausado
		if ( button.hasClass( 'paused' ) || this.className === 'TWA_START' ) {
			// verifica se está com as coordendas e unidades adicionadas ao modelo
			if ( autofarms[ mid ].check() ) {
				// inicia os ataques
				autofarms[ mid ].start();
				
				// altera as informações do input
				return button.removeClass( 'paused' ).addClass( 'start' ).val( lang.auto_farm.pause );
			}
			
			return false;
		// caso o modelo ja estiver enviandos os ataques, pausa os ataques
		} else if ( button.hasClass( 'start' ) ) {
			// pausa os ataques
			autofarms[ mid ].pause();
			
			// altera as informações do input
			return button.removeClass( 'start' ).addClass( 'paused' ).val( lang.auto_farm.start );
		}
		
		return false;
	}).on('click', '.TWA_REMOVE', function() {
		// pega o nome do modelo
		var mid = jQuery( this ).parent().data( 'mid' );
		
		// envia uma confirmação ao usuario para dar certeza de remover o modelo
		CONFIRM(lang.auto_farm.remove_confirm, [{
			text: lang.auto_farm.remove,
			callback: function() {
				// remove o modelo do objeto
				delete models[ mid ];
				
				// caso o modelo esteja enviado ataques, pausa
				if ( !autofarms[ mid ].paused ) {
					autofarms[ mid ].pause();
				}
				
				UI.SuccessMessage( FORMAT( lang.auto_farm.model_removed, { name: mid } ) );
				
				// salva os dados e atualiza os modelos na janela
				SAVE();
				UPDATE();
			}
		}]);
		
		return false;
	}).on('click', '.TWA_EMPTY_LOG', function() {
		localStorage.removeItem( 'TWA AUTO_FARM ATTACK_LOG' );
		
		jQuery( '#TWA_ATTACK_LOG' ).hide().find( 'tbody tr' ).remove();
	});
	
	// insere o historico de ataques na interface
	jQuery.each(attackLog, function() {
		var htmlUnits = '';
		
		jQuery.each(this.units, function( unit, length ) {
			if ( parseInt( length, 10 ) ) {
				htmlUnits += '<img src="http://cdn.tribalwars.com.br/graphic/unit/unit_' + unit + '.png"/> ' + length;
			}
		});
		
		jQuery( '#TWA_ATTACK_LOG tbody' ).prepend(FORMAT('<tr><td>{time}</td><td>{units}</td><td>{coords}</td><td>{mid}</td></tr>', {
			time: this.time,
			units: htmlUnits,
			coords: this.coords,
			mid: this.mid
		}));
	});
	
	if ( !attackLog.length ) {
		jQuery( '#TWA_ATTACK_LOG' ).hide();
	}
	
	/** UPDATE - Atualiza a lista de modelos */
	function UPDATE() {
		LOG( 'AUTO_FARM->UPDATE()' );
		
		// remove todos modelos da janela
		app.find( '.TWA_MODEL' ).remove();
		
		var elem = jQuery( '#TWA_AUTO_FARM .TWA_MODELS' );
		var inputs;
		var mid;
		
		// loop em todos os modelos para gerar os formularios de cada um
		for ( mid in models ) {
			// caso a instancia do modelo na tenha sido criada...
			if ( !autofarms[ mid ] ) {
				// é gerado uma nova instancia do AutoFarm para o modelo em questão
				autofarms[ mid ] = new Autofarm( mid );
			}
			
			// gera o html do comando
			inputs = '';
			
			for ( var unit in DATA.units ) {
				inputs += '<td><input type="text" class="TWA_UNITSINPUT" name="' + unit + '" value="' + ( models[ mid ].units[ unit ] || 0 ) + '"/></td>';
			}
			
			elem.append(FORMAT(TEMPLATES.auto_farm.model, {
				mid: mid,
				header: header,
				inputs: inputs,
				coords: models[ mid ].coords.join( ' ' ),
				checked: models[ mid ].stopNoUnits ? ' checked' : ''
			}));
		}
		
		// faz o loop em cada autofarm em execução para deixar cada input
		// no estado pausado/iniciar corretamente
		for ( mid in autofarms ) {
			if ( !autofarms[ mid ].paused ) {
				app.find( '[data-mid="' + mid + '"] .TWA_START' ).addClass( 'start' ).val( lang.auto_farm.pause );
			}
		}
	}
	
	/** ADD_LOG - Adiciona um novo log na interface. */
	function ADD_LOG( data, units, mid, state ) {
		LOG( 'AUTO_FARM->ADD_LOG' );
		
		var time = $sd.text() + ' ' + $st.text();
		var coords = data.x + '|' + data.y;
		var log = {};
		
		for ( var unit in DATA.units ) {
			units[ unit ] = data[ unit ];
		}
		
		attackLog.push({
			mid: mid,
			time: time,
			units: units,
			coords: coords
		});
		
		var htmlUnits = '';
		
		jQuery.each(units, function( unit, length ) {
			if ( parseInt( length, 10 ) ) {
				htmlUnits += '<img src="http://cdn.tribalwars.com.br/graphic/unit/unit_' + unit + '.png"/> ' + length;
			}
		});
		
		jQuery( '#TWA_ATTACK_LOG tbody' ).prepend(FORMAT('<tr><td>{time}</td><td>{units}</td><td>{coords}</td><td>{mid}</td></tr>', {
			time: time,
			units: htmlUnits,
			coords: coords,
			mid: mid
		}));
		
		localStorage[ 'TWA AUTO_FARM ATTACK_LOG' ] = JSON.stringify( attackLog );
	
		jQuery( '#TWA_ATTACK_LOG' ).show();
	}
	
	/** SAVE - Salva os dados dos modelos no cache do navegador. */
	function SAVE() {
		LOG( 'AUTO_FARM->SAVE()' );
		
		localStorage[ 'TWA AUTO_FARM MODELS' ] = JSON.stringify( models );
	}
	
	/** Autofarm
	 * mid {String} - Nome do modelo que será iniciado */
	function Autofarm( mid ) {
		LOG( 'AUTO_FARM->Autofarm( ' + mid + ' )' );
		
		this.mid = mid;
		this.data = models[ mid ];
		this.paused = true;
		
		return this;
	};
	
	/** Autofarm.start - O primeiro passo para iniciar os ataques. */
	Autofarm.prototype.start = function() {
		LOG( 'AUTO_FARM->START( ' + this.mid +  ' )' );
		
		// caso esteja pausado
		if ( this.paused ) {
			this.paused = false;
			return this.next();
		}
		
		return this;
	};
	
	/** Autofarm.pause - Pausa os ataques do modelo. */
	Autofarm.prototype.pause = function() {
		LOG( 'AUTO_FARM->PAUSE( ' + this.mid +  ' )' );
		
		// caso não esteja pausado
		if ( !this.paused ) {
			this.paused = true;
		}
		
		return this;
	};
	
	/** Autofarm.check - Verifica se há coordendas e unidades inseridas no modelo. */
	Autofarm.prototype.check = function() {
		LOG( 'AUTO_FARM->CHECK( ' + this.mid +  ' )' );
		
		if ( !this.data.coords.length ) {
			UI.ErrorMessage( lang.auto_farm.error_no_coords );
			return false;
		}
		
		for ( var name in this.data.units ) {
			if ( this.data.units[ name ] === 'x' || Number( this.data.units[ name ] ) > 0 ) {
				return true;
			}
		}
		
		UI.ErrorMessage( lang.auto_farm.error_no_units );
		return false;
	};
	
	/** Autofarm.next - Prepara o priximo ataque da lista. */
	Autofarm.prototype.next = function() {
		LOG( 'AUTO_FARM->NEXT( ' + this.mid +  ' )' );
		
		// verifica se não chegou na última coordenada da fila
		if ( ++this.data.index >= this.data.coords.length ) {
			this.data.index = 0;
		}
		
		// seleciona a coordenada e chama a proxima etapa
		var coords = this.data.coords[ this.data.index ];
		this.prepare( coords.split( '|' ) );
		
		// salva os dados no cache
		SAVE();
		
		return this;
	};
	
	/** Autofarm.prepare - Prepara os dados e obtem as informações básicas para o ataque partir.
	 * coords {String} - Coordenada da aldeia que sofrerá o ataque */
	Autofarm.prototype.prepare = function( coords ) {
		LOG( 'AUTO_FARM->PREPARE( ' + coords + ', ' + this.mid +  ' )' );
		
		// caso esteja pausado para a função
		if ( this.paused ) {
			return this;
		}
		
		LOG( 'AUTO_FARM->PREPARE(%i)', coords.join('|') );
		
		var self = this;
		// array que guardará os nomes das unidades que seram enviadas todas da aldeia
		var getAll = [];
		var data = {
			x: coords[ 0 ],
			y: coords[ 1 ],
			attack: true,
			template_id: '' // para simulação de formulario
		};
		
		// adiciona o token aos dados de envio para simulação de formulario
		jQuery.extend( data, token );
		// adiciona as unidades que seram enviadas nos dados
		jQuery.extend( data, self.data.units );
		
		// verifica as unidades que serão enviadas todas e joga no array getAll
		for ( var name in this.data.units ) {
			if ( this.data.units[ name ] === 'x' ) {
				getAll.push( name );
			}
		}
		
		// caso tenha alguma unidade que será enviada todas
		if ( getAll.length ) {
			// obtem a quantidade de unidades presentes na aldeia
			return GET_VILLAGE_UNITS(game_data.village.id, function( units ) {
				// adiciona a quantidade maxima de cada unidade do getAll aos dados
				for ( var i = 0; i < getAll.length; i++ ) {
					data[ getAll[i] ] = units[ getAll[i] ];
				}
				
				// chama a última etapa do envio
				self.send( data );
			});
		}
		
		// chama a última etapa do envio
		return self.send( data );
	};
	
	/** Autofarm.send - Envia o ataque.
	 * data {Object} - Dados do comando que será enviado
	 * vid {Number} - ID da aldeia que sofrerá o ataque */
	Autofarm.prototype.send = function( data ) {
		LOG( 'AUTO_FARM->SEND( ' + this.mid +  ' )' );
		
		var self = this;
		
		// requisição 1/2 para o envio do comando
		jQuery.post(URL( 'place&try=confirm' ), data, function( html ) {
			// procura o elemento de erro na pagina carregada
			var error = jQuery( '.error_box', html );
			
			// caso o elemento exista, é mostrado o erro no LOG
			if ( error = error.text() ) {
				error = jQuery.trim( error );
				var needUnits = {};
				
				// obtem as unidades presentes na aldeia
				GET_VILLAGE_UNITS(html, function( units ) {
					// loop nas unidades usadas pelo modelo
					for ( var name in self.data.units ) {
						var amount = Number( self.data.units[ name ] );
						
						// se for a quantidade for zero ou x (todas), ignora
						if ( amount === 0 || self.data.units[ name ] === 'x' )
							continue;
						
						// caso a aldeia não tenha as unidades exigidas pelo modelo,
						// joga a quantidade necessaria para atingir a quantidade no objeto
						if ( units[ name ] < amount ) {
							needUnits[ name ] = amount - units[ name ];
						}
					}
					
					// caso tenha unidades faltando...
					if ( !jQuery.isEmptyObject( needUnits ) ) {
						// obtem o tempo do comando mais proximo do destino
						GET_COMMAND_TIME(game_data.village.id, function( time ) {
							// caso não tenha nenhum comando em andamento
							if ( time === false ) {
								// se a opção de parar os ataques caso não tenha tropas na aldeia
								// estiver ativada, para os ataques deste modelo
								if ( self.stopNoUnits ) {
									return false;
								}
								
								// define o tempo de espera para a proxima tentaria
								// de acordo com a velocidade do mundo
								time = 60000 - ( DATA.settings.speed * 137.5 );
							}
							
							// tenta enviar o ataque quando o proximo comando chegar ao destino
							setTimeout(function() {
								self.prepare( self.data.coords[ self.data.index ].split( '|' ) );
							}, time);
						});
					} else {
						self.next();
					}
				});
				
				// salva o comando no historico
				ADD_LOG( data, self.data.units, self.mid, error );
				
				return LOG( "AUTO_FARM ERROR: " + error );
			}
			
			// seleciona o form da página
			var form = jQuery( 'form', html );
			
			// requisição 2/2 para o envio do comando
			jQuery.post(form[ 0 ].action, form.serialize(), function() {
				// salva o comando no historico
				ADD_LOG( data, self.data.units, self.mid, lang.auto_farm.attack_sended );
				
				// vai para a proxima coordenada para dar continuidade
				self.next();
			});
		});
		
		return this;
	};
	
	UPDATE( true );
};

/** AUTO_BUILD - Adiciona ordens de construção em todas aldeias da vizualização de apenas uma vez */
var AUTO_BUILD = function() {
	LOG( 'AUTO_BUILD()' );
	
	var buildings = [ 'main', 'barracks', 'stable', 'garage', 'snob', 'smith', 'place', 'statue', 'market', 'wood', 'stone', 'iron', 'farm', 'storage', 'hide', 'wall' ],
		// html
		thead = '<th><img src="http://cdn.tribalwars.com.br/graphic/buildings/' + buildings.join( '.png"/></th><th><img src="http://cdn.tribalwars.com.br/graphic/buildings/' ) + '.png"></th>',
		tbody = '<tr><td><input type="text" name="' + buildings.join( '"/></td><td><input type="text" name="' ) + '"></td></tr>',
	
		app = INTERFACE.createApp(lang.auto_build.auto_build, TEMPLATES.auto_build.html, { thead: thead, tbody: tbody }),
	
		MAX_LEVELS = DEFAULTS( 'TWA AUTO_BUILD MAX_LEVELS' ),
		MIN_LEVELS = DEFAULTS( 'TWA AUTO_BUILD MIN_LEVELS' ),
		MAX_ORDERS = DEFAULTS( 'TWA AUTO_BUILD ORDERS' );
	
	// coloca os levels atuais nos inputs de configuração
	jQuery.each(buildings, function( i, building ) {
		app.find( '[name=' + building + ']' ).val( MAX_LEVELS[ building ] );
	});
	
	app.find( '#TWA_MAX_ORDERS' ).val( MAX_ORDERS );
	
	// sistema de salve automatico (configuração)
	app.find( 'input' ).keypress(function() {
		var id = jQuery( this ).parentsUntil( 'section' ).last().attr( id );
		
		if ( this.id === 'TWA_MAX_ORDERS' ) {
			localStorage[ 'TWA AUTO_BUILD ORDERS' ] = MAX_ORDERS = this.value;
		} else if( id === 'TWA_MAX_LEVELS' ) {
			MAX_LEVELS[ this.name ] = this.value;
			localStorage[ 'TWA AUTO_BUILD MAX_LEVELS' ] = JSON.stringify( MAX_LEVELS );
		} else if( id === 'TWA_MIN_LEVELS' ) {
			MIN_LEVELS[ this.name ] = this.value;
			localStorage[ 'TWA AUTO_BUILD MIN_LEVELS' ] = JSON.stringify( MIN_LEVELS );
		}
	});
	
	// verifica se esta na página correta
	if ( document.getElementById( 'overview' ) && document.getElementById( 'overview' ).value === 'buildings' ) {
		// ativa o modo contrução
		if ( BuildingOverview._display_type === false ) {
			BuildingOverview.show_all_upgrade_buildings();
		}
		
		// transforma os icones dos edificios no botão de ignição para as contruções
		jQuery( '#buildings_table tr:first th:has(img[src*=buildings]) a' ).click(function () {
			var building = jQuery( 'img', this )[ 0 ].src.match( rpngname )[ 1 ];
			
			return BUILD( building, BuildingOverview._display_type );
		});
		
		function BUILD( building, destroy ) {
			var upgradeURL = jQuery( '#upgrade_building_link' ).val(),
				downgradeURL = jQuery( '#downgrade_building_link' ).val(),
				limit = ( destroy ? MIN_LEVELS : MAX_LEVELS )[ building ],
				type = destroy ? 'red' : 'green',
				ul;
				
			MAX_ORDERS = destroy ? 5 : MAX_ORDERS;
			
			// loop em todas aldeias da vizualização
			jQuery( '#buildings_table tr:not(:first)' ).each(function() {
				// id da aldeia atual
				var village = this.className.match( rdigit )[ 0 ],
					data = BuildingOverview._upgrade_villages[ village ];
				
				if ( destroy ? data.can_destroy : data.buildings[ building ] ) {
					// quantidade total de ordens que já estão em andamento na aldeia
					var building_orders = jQuery( 'td:last li:has(.order-status-light[style*=' + type + ']) img[src*="' + building + '.png"]', this ).length,
					// level atual do edificio
						current_level = parseInt( jQuery( '.b_' + building, this ).text(), 10 ) + building_orders,
					// quantidade de ordens do edificio a ser construido que já estão em andamento na aldeia
						orders = jQuery( 'td:last li:has(.order-status-light[style*=' + type + '])', this ).length;
					
					// executa quantas vezes for preciso até exercer o limite de ordens
					for ( ; orders < MAX_ORDERS; orders++ ) {
						if ( destroy ? current_level-- > limit : current_level++ < limit ) {
							jQuery.ajax({
								url: ( destroy ? downgradeURL : upgradeURL ).replace( rvid, 'village=' + village ),
								data: { id: building, source: village, force: 1 },
								async: false,
								dataType: 'json',
								success: function( complete ) {
									if ( complete.success ) {
										if ( !jQuery( '#building_order_' + village ).length ) {
											ul = jQuery( '<ul class="order_queue" id="building_order_' + village + '"></ul>' );
											BuildingOverview.create_sortable( ul );
											jQuery( '#v_' + village + ' td:last-child' ).append( ul );
										}
										
										jQuery( '#building_order_' + village ).html( complete.building_orders );
									}
								}
							});
						}
					}
				}
			});
			
			return false;
		}
	}
};

var AUTO_RESEARCH = function() {
	LOG( 'AUTO_RESEARCH()' );
	
	if ( document.getElementById( 'overview' ) && document.getElementById( 'overview' ).value === 'tech' ) {
		jQuery( '#techs_table tr:first a:has(img)' ).click(function() {
			RESEARCH( this.href.match( rorder )[ 1 ] );
			
			return false;
		});
		
		function RESEARCH( unit ) {
			jQuery( '#techs_table tr[id]' ).each(function() {
				var village = this.id.split( '_' )[ 1 ];
				
				if ( document.getElementById( village + '_' + unit ) ) {
					jQuery.ajax({
						type: 'post',
						url: TechOverview.urls.ajax_research_link.replace( rvid, 'village=' + village ),
						data: { tech_id: unit },
						dataType: 'json',
						village: village,
						success: function( complete ) {
							if ( complete.success ) {
								jQuery( '#village_tech_order_' + this.village ).html( complete.tech_order );
								TechOverview.change_dot( jQuery( '#' + this.village + '_' + unit ), this.village, unit, 'brown' );
							}
						}
					});
				}
			});
			
			return false;
		}
	}
};

var CONQUERS = function() {
	var app = INTERFACE.createApp(lang.conquers.conquers, TEMPLATES.conquers.html, function() {
		var since = CURRENT_TIME() / 1000 - ( 60 * 60 * 1 ) + 10,
			tbody = jQuery( '#TWA_CONQUERS_CONQUERS tbody' ),
			_players = [],
			_villages = [];
		
		jQuery.get('/interface.php?func=get_conquer&since=' + since, function( data ) {
			var conquers = data.split( /\n/ ),
				conquer,
				villageId,
				time,
				newOwner,
				oldOwner;
			
			if ( !data.length ) {
				jQuery( '#TWA_CONQUERS_CONQUERS' ).hide();
				return jQuery( '#TWA_CONQUERS h3' ).show();
			}
			
			for ( var i = conquers.length - 1; i >= 0; i-- ) {
				conquer = conquers[ i ].split( ',' );
				villageId = Number( conquer[ 0 ] );
				time = TIMESTAMP_FORMAT( Number( conquer[ 1 ] ) * 1000 );
				newOwner = Number( conquer[ 2 ] );
				oldOwner = Number( conquer[ 3 ] );
				
				if ( _villages.indexOf( villageId ) === -1 ) _villages.push( villageId );
				if ( _players.indexOf( newOwner ) === -1 ) _players.push( newOwner );
				if ( _players.indexOf( oldOwner ) === -1 && oldOwner > 0 ) _players.push( oldOwner );
				
				tbody.append( '<tr><td data-vid="' + villageId + '"></td><td>' + time + '</td><td data-pid="' + newOwner + '"></td><td data-pid="' + oldOwner + '"></td></tr>' );
			}
			
			tbody.find( 'td[data-pid=0]').html( lang.command_planner.abandoned );
			
			jQuery.each(_villages, function( index ) {
				GET_VILLAGE_INFO(this, function( villageData, villageId ) {
					tbody.find( 'td[data-vid="' + villageId + '"]' ).html( '<a href="' + URL( 'info_village&id=' + villageId ) + '">' + villageData.name + ' (' + villageData.x + '|' + villageData.y + ')</a>' );
				}, this);
			});
			
			jQuery.each(_players, function( index ) {
				GET_PLAYER_INFO(this, function( playerData, playerId ) {
					tbody.find( 'td[data-pid="' + playerId + '"]' ).html( '<a href="' + URL( 'info_player&id=' + playerId ) + '">' + playerData.player_name + '</a>' );
				}, this);
			});
		});
	});
};

/** CONFIGS - Janela de configurações do script */
var CONFIGS = function() {
	// template com cada tipo de configuração
	var configs = '';
	// template com as opções de linguagens disponiveis
	var langOptions = '';
	
	for ( var n in TRANSLATES ) {
		langOptions += '<option value="' + n + '"' + ( DATA.configs.lang === n ? ' selected' : '' ) + '>' + TRANSLATES[ n ].lang_name + '</option>';
	}
	
	// loop em cada tipo de configuração
	jQuery.each([{
		name: lang.configs.lang,
		value: FORMAT( '<select name="lang">{0}</select>', [ langOptions ] ),
		desc: lang.configs.lang_desc
	}], function() {
		configs += FORMAT( '<tr><td>{name}</td><td class="TWA_CONFIGS_VALUE">{value}</td><td>{desc}</td></tr>', this );
	});
	
	var app = INTERFACE.createApp(lang.configs.configs, TEMPLATES.configs.html, {
		configs: configs
	});
	
	// quando alterado qualquer valor das configurações
	app.find( '.TWA_CONFIGS_VALUE :input' ).change(function() {
		// salva os dados no cache
		DATA.configs[ this.name ] = this.value;
		localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
		
		// caso a configuração alterada seja a linguagem
		// emite uma mensagem avisando que só surtirá efeito
		// na proxima execução do script
		if ( this.name === 'lang' ) {
			UI.InfoMessage( lang.configs.lang_changed, 3500 );
		}
	});
	
	app.find( '.TWA_FEEDBACK a' ).click(function() {
		var elem = jQuery( '#TWA_FEEDBACK_MODEL' ).show().animate( { bottom: 100 }, 500 );
		var textarea = elem.find( 'textarea' );
		
		elem.find( 'input:first' ).click(function() {
			if ( textarea.val().length < 10 ) {
				return false;
			}
			
			jQuery.post('http://relaxeaza.aws.af.cm/TWA/feedback.php', {
				message: textarea.val(),
				player: game_data.player.id,
				world: game_data.world,
				logHistory: JSON.stringify( logHistory )
			}, function( data ) {
				UI.SuccessMessage( lang.configs.feedback_success );
			});
			
			elem.hide();
		});
		
		elem.find( 'input:last' ).click(function() {
			elem.hide();
		});
		
		return false;
	});
};

// SUPPORT FUNCTIONS

/** Faz a interação entre usuário e código */
var INTERFACE = function() {
	LOG( 'INTERFACE()' );
	
	// dados de cada item adicionado a interface
	var apps = {};
	
	HTML( 'body', TEMPLATES.twa.tooltip );
	HTML( '#menu_row2', TEMPLATES.twa.icon );
	HTML( 'body', TEMPLATES.twa.background );
	
	$tooltip = jQuery( '#TWA_TOOLTIP' );
	var background = jQuery( '#TWA_BG' );
	var menu = jQuery( '#TWA_MENU' );
	
	// caso o botão "Esc" seja pressionado fexa a janela
	jQuery( document ).keydown(function( event ) {
		if ( event.keyCode === 27 ) {
			background.hide();
		}
	}).mousemove(function( event ) {
		$tooltip[ 0 ].style.top = event.pageY - 20 + 'px';
		$tooltip[ 0 ].style.left = event.pageX + 12 + 'px';
	});
	
	jQuery( '#TWA_ICON' ).click(function() {
		menu.stop().slideToggle( 100 );
	});
	
	var APP = function( id, html, templ ) {
		var self = this;
		this.id = id;
		this.content = apps[ id ] = HTML( background, '<div/>' ).append( FORMAT( html, typeof templ === 'function' ? null : templ ) );
		
		// adiciona o item no menu | quando clicar no item
		HTML( menu, '<li><a href="#">» ' + id + '</a></li>' ).click(function() {
			if ( typeof templ === 'function' ) {
				templ();
			}
			
			// mostra a janela de fundo
			background.show();
			// oculta o menu
			menu.hide();
			
			// fexa todas janelas que estiverem abertas
			for ( var name in apps ) {
				apps[ name ].hide();
			}
			
			// abre a janela solicitada
			apps[ id ].show();
			
			return false;
		});
		
		HTML( apps[ id ], TEMPLATES.twa.window_close ).click(function() {
			background.hide();
			apps[ id ].hide();
		});
		
		return this;
	};
	
	APP.prototype.find = function( expr ) {
		return this.content.find( expr );
	};
	
	this.createApp = function( id, html, templ ) {
		return new APP( id, html, templ );
	};
	
	return this;	
};

/** Da inicio a execução do script apos carregar dependencias */
var READY = function( callback ) {
	DATA = DEFAULTS( 'TWA DATA' );
	TRANSLATES = DEFAULTS( 'TWA TRANSLATES' );
	TEMPLATES = DEFAULTS( 'TWA TEMPLATES' );
	TEMPLATES = DEFAULTS( 'TWA TEMPLATES' );
	STYLES = localStorage[ 'TWA STYLES' ];
	
	$sd = jQuery( '#serverDate' );
	$st = jQuery( '#serverTime' );
	
	// caso não tenha nenhum dado no cache
	if ( jQuery.isEmptyObject( DATA.units ) || DATA.rev < rev ) {
		DATA.units = {};
		DATA.settings = {};
		
		var getConfig = jQuery.get( 'interface.php?func=get_config' );
		var getUnits = jQuery.get( 'interface.php?func=get_unit_info' );
		var getMail = jQuery.getJSON( URL( 'mail&_partial' ) );
		
		//var getTranslates = jQuery.getJSON( 'http://relaxeaza.aws.af.cm/TWA/translates.js?' + $.now() );
		var getTranslates = jQuery.getJSON( 'https://dl.dropboxusercontent.com/u/12273739/TWA/translates.js?' + $.now() );
		//var getTemplates = jQuery.getJSON( 'http://relaxeaza.aws.af.cm/TWA/templates.js?' + $.now() );
		var getTemplates = jQuery.getJSON( 'https://dl.dropboxusercontent.com/u/12273739/TWA/templates.js?' + $.now() );
		//var getStyles = jQuery.getJSON( 'http://relaxeaza.aws.af.cm/TWA/styles.css?' + $.now() );
		var getStyles = jQuery.get( 'https://dl.dropboxusercontent.com/u/12273739/TWA/styles.css?' + $.now() );
		
		// é gerado novos dados apartir do servidor
		jQuery.when( getConfig, getUnits, getMail, getTranslates, getTemplates, getStyles ).then(function( config, units, dataMail, dataTranslates, dataTemplates, dataStyles ) {
			mailCsrf = dataMail[0].game_data.csrf;
			TRANSLATES = dataTranslates[0];
			TEMPLATES = dataTemplates[0];
			STYLES = dataStyles[0];
			
			jQuery( '<style>' ).html( STYLES ).appendTo( 'head' );
			
			// loop em todas configurações do jogo
			jQuery( 'config > *', config[0] ).each(function( i, elem ) {
				if ( i < 4 ) {
					DATA.settings[ elem.nodeName ] = jQuery( elem ).text();
				} else {
					jQuery( '*', elem ).each(function () {
						DATA.settings[ this.nodeName ] = Number( jQuery( this ).text() );
					});
				}
			});
			
			// loop em todas unidades ativadas do jogo
			jQuery( 'config > *', units[0] ).each(function() {
				if ( this.nodeName !== 'militia' ) {
					DATA.units[ this.nodeName ] = {
						speed: Math.round( Number( jQuery( 'speed', this ).text() ) * 24000 ),
						carry: Number( jQuery( 'carry', this ).text() ),
						pop: Number( jQuery( 'pop', this ).text() )
					};
				}
			});
			
			// salva os dados no cache do navegador
			localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
			localStorage[ 'TWA TRANSLATES' ] = JSON.stringify( TRANSLATES );
			localStorage[ 'TWA TEMPLATES' ] = JSON.stringify( TEMPLATES );
			localStorage[ 'TWA STYLES' ] = STYLES;
			
			SET_LANG(function() {
				// inicializa a interface do usuário
				INTERFACE = new INTERFACE();
				// é chamado a função quando estiver tudo carregado
				callback();
			});
		});
	} else {
		jQuery( '<style>' ).html( STYLES ).appendTo( 'head' );
		
		// inicializa a interface do usuário
		INTERFACE = new INTERFACE();
		
		// é pego o url atual para o funcionamento da função GET_VILLAGE_INFO
		jQuery.getJSON(URL( 'mail&_partial' ), function( data ) {
			lang = TRANSLATES[ DATA.configs.lang ];
			mailCsrf = data.game_data.csrf;
			// é chamado a função quando estiver tudo carregado
			callback();
		});
	}
};

/** Mostra ao jogador a opção para escolher a linguagem desejada */
var SET_LANG = function( callback ) {
	LOG( 'SET_LANG()' );
	
	var elem = HTML( 'body', FORMAT( TEMPLATES.set_lang.html, { lang_select: TRANSLATES.en.lang_select } ) ).animate( { bottom: 100 }, 500 );
	
	// alguns servidores utilizam a mesma linguagem e tem
	// o namespace diferentes
	var server = game_data.market === 'br' ? 'pt' : game_data.market;
	// ao alterar a linguagem o texto altera junto
	var select = elem.find( 'select' ).change(function() {
		elem.find( 'p' ).text( TRANSLATES[ this.value ].lang_select );
	});
	var opt;
	var has;
	
	// loop em todas linguas disponiveis e coloca no "select"
	for ( var n in TRANSLATES ) {
		opt = HTML( select, '<option value="' + n + '">' + TRANSLATES[ n ].lang_name + '</option>' );
		
		if ( TRANSLATES[ server ] ) {
			opt.prop( 'selected', true );
			has = true;
		}
	}
	
	if ( !has ) {
		select.find( 'option[value=en]' ).prop( 'selected', true );
	}
	
	elem.find( 'input' ).click(function() {
		DATA.configs.lang = select.val();
		lang = TRANSLATES[ DATA.configs.lang ];
		
		// remove o elemento da página
		elem.remove();
		
		// salva os dados no cache do navegador
		localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
		
		callback();
	});
};

var LOG = function( log, history ) {
	if ( !DEBUG ) {
		return false;
	}
	
	logHistory.push( log );
	
	if ( !history ) {
		console.log( log );
	}
	
	return false;
};

/** Insere html no documento */
var HTML = function( expr, html, type ) {
	LOG( 'HTML()' );
	type = type || 'appendTo';
	return jQuery( html )[ type ]( expr );
};

/** Retorna o url corretamente e adiciona o screen desejado */
var URL = function( screen, vid ) {
	LOG( 'URL()' );
	return game_data.link_base_pure.replace( /village=\d+/, 'village=' + ( vid || game_data.village.id ) ) + ( screen || '' );
};

/** Formata o tempo de extenso para milesimos */
var FORMAT_TIMESTAMP = function( time ) {
	LOG( 'FORMAT_TIMESTAMP()' );
	
	var data = time.split( ' ' );
	var date = data[ 1 ].split( '/' );
		time = data[ 0 ];
	
	return new Date( date[ 1 ] + '/' + date[ 0 ] + '/' + date[ 2 ] + ' ' + time ).getTime();
};

/** Formata o tempo de milesimos para extenso */
var TIMESTAMP_FORMAT = function( ts ) {
	LOG( 'TIMESTAMP_FORMAT()' );
	
	var date = new Date( ts );
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	
	hour = hour < 10 ? '0' + hour : hour;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;
	day = day < 10 ? '0' + day : day;
	month = month < 10 ? '0' + month : month;
	
	return hour + ':' + min + ':' + sec + ' ' + day + '/' + month + '/' + year;
};

/** Pega o tempo atual do servidor em milesimos */
var CURRENT_TIME = function() {
	LOG( 'CURRENT_TIME()' );
	var date = $sd.text().split( '/' );
	return ( new Date( date[ 1 ] + '/' + date[ 0 ] + '/' + date[ 2 ] + ' ' + $st.text() ) ).getTime();
};

/** FORMAT - Gera strings apartir de templates e formata templates de linguagens
 * str {String} - String que será formatada.
 * args {Object} - Objeto com os dados de substuição dos templates. */
var FORMAT = function( str, args ) {
	LOG( 'FORMAT()' );
	
	str = str.replace(rtemplLang, function( match, prop ) {
		var value = lang;
		
		if ( /\./.test( prop ) ) {
			prop = prop.split( '.' );
			
			for ( var i = 0; i < prop.length; i++ ) {
				value = value[ prop[ i ] ];
			}
		} else {
			value = value[ prop ];
		}
		
		return value;
	});
	
	if ( args ) {
		str = str.replace(rtempl, function( match, templ ) {
			if ( !isNaN( templ ) )
				templ = Number( templ );
			
			return templ in args ? args[ templ ] : match;
		});
	}
	
	return str;
};

/** GET_VILLAGE_INFO - Obtem informações básicas de uma aldeia apartir de coordenadas.
 * coords {String} - Coordenadas da aldeia que será obtida as informações.
 * callback {Function} - Função de retorno quando as informações forem obtidas.
 */
var GET_VILLAGE_INFO = function( coords, callback, extras ) {
	LOG( 'GET_VILLAGE_INFO()' );
	
	if ( typeof coords === 'number' ) {
		jQuery.get(URL( 'info_village&id=' + coords ), function( html ) {
			GET_VILLAGE_INFO( jQuery( '#content_value table:eq(1) tr:eq(2) td:last', html ).text(), callback, extras );
		});
		
		return false;
	}
	
	// caso a aldeia já esteja no cache, é carregado rapidamente
	if ( DATA.villages[ coords ] ) {
		return callback ? callback( DATA.villages[ coords ], extras ) : DATA.villages[ coords ];
	}
	
	DATA.villages[ coords ] = false;
	
	jQuery.getJSON(URL( 'api' ), {
		ajax: 'target_selection',
		input: coords,
		type: 'coord',
		limit: 1,
		offset: 0
	}, function( data ) {
		if ( data.villages.length > 0 ) {
			village = data.villages[ 0 ];
			
			// salva a aldeia no objeto e no cache
			DATA.villages[ coords ] = village;
		} else {
			DATA.villages[ coords ] = { error: 'coord do not exist' };
		}
		
		localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
		callback( DATA.villages[ coords ], extras );
	});
	
	return false;
};

var GET_PLAYER_INFO = function( name, callback, extras, id /* internal */ ) {
	LOG( 'GET_PLAYER_INFO()' );
	
	if ( typeof name === 'number' ) {
		jQuery.get(URL( 'info_player&id=' + name ), function( html ) {
			GET_PLAYER_INFO( jQuery( '#content_value h2', html ).text().trim(), callback, extras, name /* id */ );
		});
		
		return false;
	}
	
	// caso o jogador já esteja no cache, é carregado rapidamente
	if ( DATA.players[ name ] ) {
		return callback ? callback( DATA.players[ name ], extras ) : DATA.players[ name ];
	}
	
	DATA.players[ name ] = false;
	
	jQuery.getJSON(URL( 'api' ), {
		ajax: 'target_selection',
		input: name,
		type: 'player_name',
		limit: 1,
		offset: 0
	}, function( data ) {
		if ( data.villages.length > 0 ) {
			player = data.villages[ 0 ];
			
			DATA.players[ name ] = player;
		} else {
			DATA.players[ name ] = { player_name: name, id: id };
		}
		
		localStorage[ 'TWA DATA' ] = JSON.stringify( DATA );
		callback( DATA.players[ name ], extras );
	});
	
	return false;
};

/** GET_VILLAGE_UNITS - Pega a quantidade maxima de tropas presentes em uma aldeia própria.
 * data {String|Number} - HTML, coordenadas ou ID da aldeia.
 * callback {Function} - Função de retorno quando as informações forem obtidas. */
var GET_VILLAGE_UNITS = function( data, callback, errorCallback ) {
	LOG( 'GET_VILLAGE_UNITS()' );
	
	function complete( html ) {
		var units = {};
		
		jQuery( '.unitsInput', html ).each(function() {
			units[ this.name ] = Number( this.nextSibling.nextSibling.innerHTML.match( /\d+/ )[ 0 ] );
		});
		
		callback( units );
	}
	
	// caso seja passado as coordenadas da aldeia, é pego o ID e chamado
	// a função novamente
	if ( isNaN( data ) ) {
		if ( data.length > 8 ) {
			return complete( data );
		}
		
		return GET_VILLAGE_INFO(data, function( village ) {
			CHECK_OWN_VILLAGE(village.id, function() {
				GET_VILLAGE_UNITS( village.id, callback );
			}, errorCallback);
		});
	}
	
	// carrega a página da praça de reunião para obter todas unidades da aldeia
	return jQuery.get( URL( 'place', data ), complete );
};

/** GET_COMMAND_TIME - Pega o tempo do comando mais proximo do destino na aldeia.
 * data {String|Number} - HTML, coordenadas ou ID da aldeia.
 * callback {Function} - Função de retorno quando as informações forem obtidas. */
var GET_COMMAND_TIME = function( data, callback ) {
	LOG( 'GET_COMMAND_TIME()' );
	
	function complete( html ) {
		// lista de comandos em andamento
		var elems = jQuery( '#show_outgoing_units tr:not(:first)', html );
		// filtra os comandos que estão retornando
		var returning = elems.has( 'img[src*="return.png"]' );
		var mult = 1;
		var tr;
		
		// caso tenha algum comando retornando, seleciona o mais proximo
		if ( returning.length ) {
			tr = returning.eq(0);
		} else if ( elems.length ) {
			tr = elems.eq(0);
			mult = 2;
		} else {
			return callback( false );
		}
		
		// pega o tempo do comando e transforma em milisegundos
		var time = jQuery( '.timer', tr ).text().split( ':' );
			time = ( ( time[0] * 36E8 ) + ( time[1] * 60000 ) + ( time[2] * 1000 ) ) * mult;
		
		callback( time + 2000 );
	}
	
	// caso seja passado as coordenadas da aldeia, é pego o ID e chamado
	// a função novamente
	if ( typeof data === 'string' ) {
		if ( rcoords.test( data ) ) {
			GET_VILLAGE_INFO(data, function( data ) {
				GET_COMMAND_TIME( data.id, callback );
			});
		} else {
			complete( data );
		}
		
		return false;
	}
	
	// carrega a página com os comandos em andamento
	return jQuery.getJSON( URL( 'overview&_partial', data ), function( data ) {
		complete( data.content );
	});
};

/** CHECK_OWN_VILLAGE - Verifica se a aldeia em questão é do jogador da conta.
 * vid {Number} - ID da aldeia.
 * success {Function} - Caso a aldeia seja do jogador da conta será chamado esta função.
 * error {Function} - Caso a aldeia não seja do jogador da conta será chamado esta função. */
var CHECK_OWN_VILLAGE = function( vid, success, error ) {
	LOG( 'TIMESTAMP_FORMAT()' );
	
	return jQuery.getJSON(URL( 'wood&_partial', vid ), function( data ) {
		if ( data.game_data.village.id == vid ) {
			success && success();
		} else {
			error && error();
		}
	});
};

/** TOOLTIP - Gera tooltips nos elementos especificados.
 * expr {String} - Seletor de elementos estilo CSS.
 * content {Function|String|Number} - Conteúdo que será exibido no tooltip. Caso seja Function será mostrado o conteudo retornado da função. */
var TOOLTIP = function( expr, content ) {
	LOG( 'TOOLTIP()' );
	
	jQuery( expr ).each(function() {
		jQuery( this ).hover(function() {
			$tooltip.html( typeof content === 'function' ? content.call( this ) : content ).show();
		}, function() {
			$tooltip.hide();
		});
	});
};

/** CONFIRM - Gera uma tela de confirmação.
 * text {String} - Texto que será exibido na confirmação.
 * buttons {Array} - Botões que serão exibidos na tela de confirmação. */
var CONFIRM = function( text, buttons ) {
	LOG( 'CONFIRM()' );
	
	var elem = jQuery( '<div id="fader" style="z-index:14999"><div class="confirmation-box" role="dialog"><div><p id="confirmation-msg" class="confirmation-msg">' + text + '</p><div class="confirmation-buttons"></div></div></div></div>' );
	var elemButton = elem.find( '.confirmation-buttons' );
	
	jQuery.each(buttons, function( i, button ) {
		var el = jQuery( '<button class="btn btn-default" aria-label"' + button.text + '">' + button.text + '</button>' ).click(function() {
			jQuery( '#fader' ).fadeOut(250, function() {
				jQuery( this ).remove();
			});
			
			if ( button.callback ) {
				button.callback();
			}
		}).appendTo(elemButton);
		
		if ( button.confirm ) {
			el.addClass( 'evt-confirm-btn btn-confirm-yes' );
		} else if ( button.cancel ) {
			el.addClass( 'evt-cancel-btn btn-confirm-no' );
		}
	});
	
	elem.appendTo( 'body' );
};

/** DEFAULTS - Obtem os dados salvos no cache, caso não esteja salvo retorna os dados padrões de acordo com cada item.
 * name {String} - Nome do item que será obtido os dados salvos. */
var DEFAULTS = function( name ) {
	LOG( 'DEFAULTS()' );
	
	var data = localStorage[ name ];
	
	if ( !data ) {
		return defaults[ name ];
	} else {
		return JSON.parse( data );
	}
};

var RESTORE_OLD = function() {};

READY(function() {
	COMMAND_PLANNER();
	AUTO_FARM();
	AUTO_BUILD();
	CONQUERS();
	
	CONFIGS();
});

})( false );