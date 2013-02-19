(function() {

if ( typeof TWA !== 'undefined' ) {
	return TWA;
}

// adiciona o botão para mostrar/ocutar o menu.
var menuButton = jQuery( '<td class="icon-box"><div id="twa-menuOpen">twa</div></td>' ).appendTo( '#menu_row2' ),
// elemento do tempo atual do jogo
$serverTime = jQuery( '#serverTime' ),
// elemento da data atual do jogo
$serverDate = jQuery( '#serverDate' ),
// conteudo da página atual do jogo
$contentValue = jQuery( '#content_value' ),
// pega o "modo" que esta na página de visualização de aldeias
overview = ( document.getElementById( 'overview' ) || { value: 'production' }).value,
// elemento do tooltip usado no script
$tooltip = jQuery( '<div id="twa-tooltip"/>' ).appendTo( 'body' ),
// tabela com as funções utilizadas na visualização de aldeias
$overviewTools;
window.TWA = { version: '1.6.2' };

TWA.assistentfarm = {
	id: 0,
	init: function() {
		return alert( 'Essa ferramenta estará disponivel na proxima atualização...' );
		
		jQuery( 'h3:first' ).append( ' <span id="twa-assistentfarm">(' + lang.assistentfarm.auto + ')</span>' );
		jQuery( '#farm_units' ).parent().after( '<div class="vis" style="overflow:auto;height:100px"><table style="width:100%"><tr id="twa-assistent-log"><th><h4>' + lang.assistentfarm.log + '</h4></th></tr></table></div>' );
		TWA.assistentfarm.prepare();
	},
	log: function( log, error ) {
		jQuery( '#twa-assistent-log' ).after( '<tr><td>' + ( TWA.assistentfarm.id++ ) + ': <img src="' + ( error ? '/graphic/delete_small.png' : '/graphic/command/attack.png' ) + '"/> ' + log + '</td></tr>' );
	},
	prepare: function() {
		var elems = [];
		var index = 0;
		
		jQuery.get(location.href, function( html ) {
			jQuery( '#am_widget_Farm table tr[class]', html ).each(function() {
				elems.push( this );
			});
			
			setInterval(function() {
				TWA.assistentfarm.attack( elems[ index ] );
				
				if ( ++index === elems.length ) {
					index = 0;
				}
			}, 5000);
		});
	},
	attackHandler: {
		sendUnits: function( village, template, name ) {
			jQuery.ajax({
				type: 'post',
				url: Accountmanager.send_units_link,
				data: {
					target: village,
					template_id: template
				},
				village: name,
				success: function( complete ) {
					complete = JSON.parse( complete );
					
					if ( complete.success ) {
						TWA.assistentfarm.log( complete.success.replace( '\n', ' ' ) + ' ' + lang.assistentfarm.onvillage + ' ' + this.village );
					} else if ( complete.error ) {
						TWA.assistentfarm.log( complete.error + ' ' + lang.assistentfarm.onvillage + ' ' + this.village, true );
					}
				}
			});
		},
		reportAttack: function( village, report, name ) {
			jQuery.ajax({
				type: 'post',
				url: Accountmanager.send_units_link_from_report,
				data: { report_id: report },
				village: name,
				success: function( complete ) {
					complete = JSON.parse( complete );
					
					if ( complete.success ) {
						TWA.assistentfarm.log( complete.success.replace( '\n', ' ' ) + ' ' + lang.assistentfarm.onvillage + ' ' + this.village );
					} else if ( complete.error ) {
						TWA.assistentfarm.log( complete.error + ' ' + lang.assistentfarm.onvillage + ' ' + this.village, true );
					}
				}
			});
		}
	},
	attack: function( elem ) {
		var icon_a = jQuery( '.farm_icon_a:not(.farm_icon_disabled)', elem );
		var icon_b = jQuery( '.farm_icon_b:not(.farm_icon_disabled)', elem );
		var icon_c = jQuery( '.farm_icon_c:not(.farm_icon_disabled)', elem );
		var index = icon_c.length ? 10 : icon_a.length ? 8 : icon_b.length ? 9 : 0;
		var data = jQuery( 'td:eq(' + index + ') a', elem ).attr( 'onclick' ).toString().match( /(\d+), (\d+)/ );
		
		TWA.assistentfarm.attackHandler[ index === 10 ? 'reportAttack' : 'sendUnits' ]( data[ 1 ], data[ 2 ], jQuery( 'td:eq(3) a', elem ).html() );
	}
};

TWA.attackplanner = {
	villages: {},
	edit: false,
	init: function() {
		var inputUnits = '';
		
		for ( var name in TWA.data.units ) {
			inputUnits += '<td><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png" style="margin-bottom:-4px"/> <input unit="' + name + '" class="units twaInput"/></td>';
		}
		
		Menu.add('attackplanner', lang.attackplanner.attackplanner, ( '<h3>' + lang.attackplanner.addcommand + '</h3><table class="twa-table"><tr><th colspan="4">' + lang.attackplanner.attacker + '</th><th colspan="4">' + lang.attackplanner.target + '</th><th colspan="4">' + lang.attackplanner.time + '</th><th colspan="4">' + lang.attackplanner.support + '</th></tr><tr><td colspan="4"><input tooltip="xxx|yyy" name="from" class="twaInput"/> (<a href="#" id="twaCurrent">' + lang.attackplanner.current + '</a>)</td><td colspan="4"><input tooltip="xxx|yyy" name="to" class="twaInput"/></td><td colspan="4"><input name="time" tooltip="hh:mm:ss dd/mm/yyyy" class="twaInput" value="' + TWA.data.attackplanner.lastTime + '"/> (<a href="#" id="twaNow">' + lang.attackplanner.now + '</a>)</td><td><input name="support" type="checkbox"/></td></tr></table><table class="twa-table"><tr><th colspan="12">' + lang.attackplanner.troops + '</th></tr><tr>__inputUnits</tr></table><h3>' + lang.attackplanner.commands + '</h3><table class="commands twa-table"><tr><th>' + lang.attackplanner.attacker + '</th><th>' + lang.attackplanner.target + '</th><th>' + lang.attackplanner.time + '</th><th>' + lang.attackplanner.type + '</th><th>' + lang.attackplanner.troops + '</th><th>' + lang.attackplanner.options + '</th></tr></table><h3>' + lang.attackplanner.commandssended + '</h3><div style="overflow:auto;height:150px"><table class="log twa-table"><tr><th>' + lang.attackplanner.attacker + '</th><th>' + lang.attackplanner.target + '</th><th>' + lang.attackplanner.time + '</th><th>' + lang.attackplanner.type + '</th></tr></table></div>' ).replace( '__inputUnits', inputUnits ), function() {
			this.find( 'input[type=checkbox]' ).checkStyle();
			
			jQuery( '#twaNow' ).click(function() {
				jQuery( '.attackplanner input[name=time]' ).val( $serverTime.text() + ' ' + $serverDate.text() );
				return false;
			});
			
			jQuery( '#twaCurrent' ).click(function() {
				jQuery( '.attackplanner input[name=from]' ).val( game_data.village.coord );
				return false;
			});
			
			Style.add('attackplanner', {
				'.attackplanner .units': { width: 33 },
				'.attackplanner input': { width: 90, height: 20, 'text-align': 'center' },
				'.attackplanner [name="time"]': { width: 200, border: '1px solid #aaa' },
				'.attackplanner .cmdUnits': { display: 'inline-block', 'text-align': 'center', margin: '0 3px' },
				'.attackplanner .cmdUnits img': { margin: '0 -3px -3px 1px', width: 15 },
				'.attackplanner .error': { border: '1px solid red' }
			});
			
			// ao iniciar o Attack Planner e adiciona os comandos na tabela
			TWA.attackplanner.update();
			
			var valid = { from: false, to: false, time: validTime( TWA.data.attackplanner.lastTime ) },
				timeout;
			
			this.find( '[name=from], [name=to]' ).acceptOnly('num | enter', function( event ) {
				event.keyCode === 13 && valid.from && valid.to && valid.time && TWA.attackplanner.add();
				
				jQuery( this )[ valid[ this.name ] = /^\d{1,3}\|\d{1,3}$/.test( this.value ) ? 'removeClass' : 'addClass' ]( 'error' );
				
				// pega as tropas atuais da aldeia e adiciona nas entradas
				// das unidades que serão usadas no ataque/apoio
				if ( this.name === 'from' ) {
					if ( !valid.from ) {
						return true;
					}
					
					var coords = this.value;
					clearTimeout( timeout );
					
					timeout = setTimeout(function() {
						// envia requisição ajax para pegar as informações da aldeia
						TWA.attackplanner.villageInfo(coords, function( data, coords ) {
							jQuery.get(TWA.url( 'place', data.id ), function( html ) {
								var units = jQuery( '.attackplanner .units' );
								
								// loop em todos as inputs de unidades na praça de reunião e
								// adiciona aos inputs do a Attack Planner.
								jQuery( '.unitsInput', html ).each(function( i ) {
									var unit = Number( this.nextElementSibling.innerHTML.match( /\d+/ )[ 0 ] );
									units[ i ].value = unit > 0 ? unit : '';
								});
							});
						});
					}, 500);
				}
			});
			
			this.find( '[name=time]' ).acceptOnly('space num : / enter', function( event ) {
				event.keyCode === 13 && valid.from && valid.to && valid.time && TWA.attackplanner.add();
				
				jQuery( this )[ valid.time = validTime( this.value ) ? 'removeClass' : 'addClass' ]( 'error' );
				
				if ( event.keyCode === 38 || event.keyCode === 40 ) {
					if ( /^\d+\:\d+\:\d+\s\d+\/\d+\/\d{4}$/.test( this.value ) ) {
						var fix = this.value.split( ' ' ),
							date = fix[ 1 ].split( '/' ),
							time = fix[ 0 ].split( ':' ),
							maxByType = [ 23, 59, 59, 0, 12, 2050 ],
							posByType = [],
							pos = this.selectionStart,
							leftSpace = 19 - this.value.length,
							format = [],
							current,
							max,
							min,
							all;
						
						all = time.concat( date ).map(function( num, i ) {
							posByType[ i ] = num.length + ( i ? posByType[ i - 1 ] + 1 : 0 );
							
							return parseInt( num, 10 );
						});
						
						posByType.every(function( item, i ) {
							if ( pos <= item ) {
								current = i;
								return false;
							}
							
							return true;
						});
						
						if ( event.keyCode === 38 ) {
							max = maxByType[ current ];
							
							if ( current === 3 ) {
								max = ( new Date( date[ 2 ], date[ 1 ], 0 ) ).getDate();
							}
							
							if ( ++all[ current ] > max ) {
								all[ current ] = max;
							}
						} else {
							min = current > 2 ? 1 : 0;
							
							if ( --all[ current ] < min ) {
								all[ current ] = min;
							}
						}
						
						all.every(function( item, i ) {
							format.push( String( item ).length < 2 && item < 10 ? '0' + item : item );
							format.push( i < 2 ? ':' : i < 3 ? ' ' : i < 5 ? '/' : '' );
							
							return true;
						});
						
						this.value = format.join( '' );
						this.selectionStart = this.selectionEnd = leftSpace + pos;
						
						jQuery( this )[ valid.time = validTime( this.value ) ? 'removeClass' : 'addClass' ]( 'error' );
					}
					
					return false;
				}
			});
			
			this.find( '.units' ).acceptOnly('num enter', function( event ) {
				event.keyCode === 13 && valid.from && valid.to && valid.time && TWA.attackplanner.add();
				
				jQuery( this )[ valid[ this.name ] = /^\d*$/.test( this.value ) ? 'removeClass' : 'addClass' ]( 'error' );
			});
			
			// caso a entrada com o tempo e data esteja invalida, arruma a borda do input
			if ( !valid.time ) {
				jQuery( '.attackplanner [name=time]' ).addClass( 'error' );
			}
		});
		
		setInterval(function() {
			TWA.attackplanner.checkAttacks();
		}, 500);
	},
	// adiciona os comandos na lista de espera
	add: function() {
		var inputs = jQuery( '.attackplanner input' );
		
		// salva o horario usado para usa-lo na proxima utilização do Attack Planner
		TWA.data.attackplanner.lastTime = inputs[ 2 ].value = jQuery.trim( inputs[ 2 ].value );
		
		// caso as entradas das coordenadas seja iguais, envia um erro
		if ( inputs[ 0 ].value === inputs[ 1 ].value ) {
			return alert( lang.attackplanner.errorequal );
		}
		
		var inserted = false,
		// objeto com os dados do comando
		attackData = {
			target: inputs[ 1 ].value,
			village: inputs[ 0 ].value,
			time: formatToTime( inputs[ 2 ].value ),
			units: {},
			support: inputs[ 3 ].checked
		};
		
		for ( var i = 4; i < inputs.length; i++ ) {
			if ( Number( inputs[ i ].value ) ) {
				attackData.units[ inputs[ i ].getAttribute( 'unit' ) ] = Number( inputs[ i ].value );
				inserted = true;
			}
		}
		
		if ( !inserted ) {
			return alert( lang.attackplanner.errorunits );
		}
		
		if ( TWA.attackplanner.edit ) {
			// edita o comando
			TWA.data.attackplanner.commands[ TWA.attackplanner.edit ] = attackData;
			TWA.attackplanner.edit = false;
		} else {
			// adiciona o comando na lista de espera
			TWA.data.attackplanner.commands.push( attackData );
		}
		
		// atualiza a tabela
		TWA.attackplanner.update();
		TWA.storage( true, null, 'data' );
	},
	// faz a atualização da tabela que mostras os comandos que serão enviados.
	// é executado sempre que um comando é adicionado, removido ou enviado.
	update: function( callback, onlyOne ) {
		if ( !TWA.attackplanner.mailLink ) {
			// pega o codigo "csrf" para usar nas requisições de previsão de mensagem,
			// metodo usado para obter informações das coordenadas.
			jQuery.get(TWA.url( 'mail' ), function( html ) {
				TWA.attackplanner.mailLink = this.url + '&mode=new&action=send&h=' + html.match( /"csrf":"(\w+)"/ )[ 1 ];
				TWA.attackplanner.update( callback );
			});
		}
		
		// caso tenha comandos para atualizar...
		if ( TWA.data.attackplanner.commands.length ) {
			// pega todos os comandos e ordena por tempo
			var commands = TWA.data.attackplanner.commands.sort(function( a, b ) {
				return a.time - b.time;
			}),
			commandList = jQuery( '.commands' );
			// remove todos os comandos da tabela
			commandList.find( 'tr:not(:first)' ).remove();
			
			// html usado em cada comando na tabela
			var html = '<tr id="__id"><td class="coord __from"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td class="coord __target"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td>__time</td><td><img src="/graphic/command/__type.png"/></td><td>__units</td><td><a href="#" class="remove"><img src="/graphic/delete.png"/></a> <a href="#" class="editCommand"><img src="/graphic/edit.png"/></a></td></tr>';
			
			// loop em todos os comandos
			for ( var i = 0; i < commands.length; i++ ) {
				var units = [];
				
				for ( var unit in commands[ i ].units ) {
					units.push( '<span class="cmdUnits"><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + unit + '.png"/><br/><span class="' + unit + '">' + commands[ i ].units[ unit ] + '</span></span>' );
				}
				
				// ao clicar remove comando da lista de espera e remove o elemento da tabela
				var tr = jQuery(html.replace( '__id', i )
				.replace( '__from', commands[ i ].village )
				.replace( '__target', commands[ i ].target )
				.replace( '__time', timeFormat( commands[ i ].time ) )
				.replace( '__type', commands[ i ].support ? 'support' : 'attack' )
				.replace( '__units', units.join( '' ) )).appendTo( commandList );
				
				tr.find( '.remove' ).click(function() {
					var elem = this.parentNode.parentNode;
					TWA.data.attackplanner.commands.remove( Number( elem.id ) );
					TWA.attackplanner.update();
					
					if ( TWA.attackplanner.edit && TWA.attackplanner.edit == elem.id ) {
						TWA.attackplanner.edit = false;
					}
					
					TWA.storage( true, null, 'data' );
					
					return false;
				});
				
				tr.find( '.editCommand' ).click(function() {
					var inputs = jQuery( '.attackplanner input' ),
						elem = this.parentNode.parentNode,
						tds = elem.getElementsByTagName( 'td' );
					
					inputs[ 0 ].value = tds[ 0 ].className.split( ' ' )[ 1 ];
					inputs[ 1 ].value = tds[ 1 ].className.split( ' ' )[ 1 ];
					inputs[ 2 ].value = tds[ 2 ].innerHTML;
					inputs[ 3 ].checked = TWA.data.attackplanner.commands[ elem.id ].support;
					inputs.filter( '.units' ).val( '' );
					
					jQuery( 'span', tds[ 4 ] ).each(function() {
						inputs.filter( '[unit=' + this.className + ']' ).val( this.innerHTML );
					});
					
					inputs.trigger( 'keyup' );
					TWA.attackplanner.edit = elem.id;
					
					return false;
				});
			}
			
			// loop em todas as coordenadas dos comandos na tabela
			commandList.find( '.coord' ).each(function() {
				var coords = this.className.split( ' ' )[ 1 ];
				
				// caso ja tenha pegado as informações da coordenada, insere na tabela
				if ( TWA.attackplanner.villages[ coords ] ) {
					if ( TWA.attackplanner.villages[ coords ].error ) {
						this.innerHTML = lang.attackplanner.errorcoords.springf( coords );
						
						return true;
					}
					
					this.innerHTML = '<a href="' + TWA.url( 'info_village&id=' + TWA.attackplanner.villages[ coords ].id ) + '">' + TWA.attackplanner.villages[ coords ].name + '</a>';
				// caso nao tenha pegado as informações ainda...
				} else {
					var elem = this;
					
					// pegas as informações e joga na tabela
					TWA.attackplanner.villageInfo(coords, function( data, coords ) {
						if ( data.error ) {
							elem.innerHTML = lang.attackplanner.errorcoords.springf( coords );
							
							return true;
						}
						
						elem.innerHTML = '<a href="' + TWA.url( 'info_village&id=' + data.id ) + '">' + data.name + '</a>';
					});
				}
			});
		// caso nao tenha comandos, limpa a tabela
		} else {
			jQuery( '.commands tr:not(:first)' ).remove();
		}
		
		callback && callback();
	},
	// obtem nome e id apartir de uma coordenada
	villageInfo: function( coords, callback ) {
		// caso já tenha pegado as informações apenas as retorna
		if ( TWA.attackplanner.villages[ coords ] ) {
			if ( callback ) {
				return callback( TWA.attackplanner.villages[ coords ] );
			} else {
				return TWA.attackplanner.villages[ coords ];
			}
		} else {
			TWA.attackplanner.villages[ coords ] = false;
		}
		
		// envia requisição para o preview da mensagem
		jQuery.post(TWA.attackplanner.mailLink, {
			extended: 0,
			preview: 1,
			to: game_data.player.name,
			subject: '0',
			text: '[coord]' + coords + '[/coord]'
		}, function( html ) {
			var elem = jQuery( 'td[style="background-color: white; border: solid 1px black;"] a', html );
			
			TWA.attackplanner.villages[ coords ] = elem.length ? {
				error: false,
				name: elem.text(),
				id: elem.attr( 'href' ).match( /id=(\d+)/ )[ 1 ]
			} :
			{ error: true };
			
			callback( TWA.attackplanner.villages[ coords ], coords );
		});
	},
	// verifica o tempo dos comandos, caso esteja no horario, envia.
	checkAttacks: function() {
		if ( !TWA.data.attackplanner.commands[ 0 ] ) {
			return false;
		}
		
		// data atual do jogo
		var now = formatToTime( $serverDate.text(), $serverTime.text() ),
			length = TWA.data.attackplanner.commands.length,
			attacks = [];
		
		while ( TWA.data.attackplanner.commands[ 0 ] ) {
			// caso o horario programado para o envio ja tenha passado, envia.
			if ( now > TWA.data.attackplanner.commands[ 0 ].time - 1000 ) {
				attacks.push( TWA.data.attackplanner.commands.shift() );
			} else {
				break;
			}
		}
		
		// verifica se teve alguma alteração na lista de comandos
		if ( length !== TWA.data.attackplanner.commands.length ) {
			TWA.attackplanner.update();
			
			time = new Date().getTime();
			
			(function sendAttack() {
				setTimeout(function() {
					TWA.attackplanner.attack( attacks.shift(), time );
					attacks.shift();
					attacks.length && sendAttack();
				}, 300);
			})();
			
			// salva os dados
			TWA.storage( true, null, 'data' );
		}
	},
	// envia os comandos
	attack: function( command, time ) {
		// antes de enviar os comandos sempre é pegado o "id" da aldeia
		TWA.attackplanner.villageInfo(command.village, function( village ) {
			// coordenadas da aldeia alvo
			var targetCoords = command.target.split( '|' ),
				// objeto com os dados de envio do comando
				data = jQuery.extend({
					x: targetCoords[ 0 ],
					y: targetCoords[ 1 ]
				}, command.units),
				// nome da aldeia usada para o comando
				village = TWA.attackplanner.villages[ command.village ],
				// nome da aldeia alvo
				target = TWA.attackplanner.villages[ command.target ],
				log = jQuery( '.attackplanner .log' ),
				units = '';
			
			// verifica se o comando é um ataque ou apoio e adiciona ao objeto de dados
			data[ command.support ? 'support' : 'attack' ] = true;
			time = timeFormat( time );
			
			for ( var name in command.units ) {
				units += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png" style="margin:0px -3px -3px;width:15px"/> ' + command.units[ name ] + ' ';
			}
			
			// envia a requisição ajax para enviar o comando
			jQuery.post(TWA.url( 'place&try=confirm', village.id ), data, function( html ) {
				// pega o elemento de erro do comando
				var error = jQuery( '#error', html );
				
				// caso tenha algum erro, adiciona ao log e para o comando
				if ( error.text() ) {
					return log.append( '<tr><td colspan="5">' + time + ' - ' + error.text() + '</td></tr>' );
				}
				
				var form = jQuery( 'form', html );
				
				// confirma e envia o ataque e adiciona ao log
				jQuery.post(form[ 0 ].action, form.serialize(), function() {
					log.append( '<tr><td><a href="' + TWA.url( 'info_village&id=' + village.id ) + '">' + village.name + '</a></td><td><a href="' + TWA.url( 'info_village&id=' + target.id ) + '">' + target.name + '</a></td><td><strong>' + time + '</strong></td><td><img src="/graphic/command/' + ( command.support ? 'support' : 'attack' ) + '.png"/></td><td>' + units + '</td></tr>' );
				});
			});
		});
	}
};

TWA.autofarm = {
	data: { attack: true },
	coord: [],
	nolog: false,
	stop: true,
	init: function() {
		Menu.add('autofarm', lang.autofarm.autofarm, '<h2>' + lang.autofarm.autofarm + '</h2><table><tr><th>' + lang.autofarm.units + '</th></tr><tr><td class="units"></td></tr><tr><th>' + lang.autofarm.coords + '</th></tr><tr><td><textarea name="coords" class="twaInput">' + TWA.settings._autofarm.coords.join(' ') + '</textarea></td></tr><tr><th>' + lang.autofarm.options + '</th></tr><tr><td><label><input type="checkbox" name="protect"/><span>' + lang.autofarm.protect + '</span></label><label><input type="checkbox" name="random"/><span>' + lang.autofarm.random + '</span></label><button class="twaButton">' + lang.autofarm.start + '</button></td></tr></table>', function() {
			Style.add('autofarm', {
				'.autofarm .units input': { width: 40, height: 20, 'text-align': 'center', 'margin-bottom': -4 },
				'.autofarm img': { margin: '0 3px -4px 10px' },
				'.autofarm [name="coords"]': { width: 584, height: 90, 'font-size': 12 },
				'.autofarm table': { width: '100%' },
				'.autofarm table th': { background: '-special-linear-gradient(right, #EEE 30%, #DDD 100%) !important', 'border-radius': '5px 0px 0px 5px', padding: 10, 'font-size': 13 },
				'.autofarm table td': { background: 'none', padding: 10 },
				'.autofarm label': { display: 'block', height: 25, 'line-height': 20 },
				'.autofarm label span': { 'margin-left': 5 },
				'.autofarm .log': { 'overflow-y': 'scroll', height: 150 },
				'.autofarm .log td': { padding: 2, 'border-bottom': '1px solid #DADADA' }
			});
			
			var units = jQuery( '.autofarm .units' ),
				timeout;
				
			for ( var name in TWA.data.units ) {
				units[ 0 ].innerHTML += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input name="' + name + '" class="twaInput"/>';
			}
			
			jQuery( '.autofarm .units input' ).acceptOnly('num', function() {
				var elem = this;
				
				clearTimeout( timeout );
				timeout = setTimeout(function() {
					TWA.settings._autofarm.units[ elem.name ] = TWA.autofarm.data[ elem.name ] = Number( elem.value );
					console.log();
					TWA.storage( true );
				}, 500);
			}).each(function() {
				if ( Number( TWA.settings._autofarm.units[ this.name ] ) ) {
					this.value = Number( TWA.settings._autofarm.units[ this.name ] );
				}
			});
			
			jQuery( '.autofarm [name=coords]' ).acceptOnly('num space |', function() {
				var elem = this;
				
				clearTimeout( timeout );
				timeout = setTimeout(function() {
					var coords = elem.value.split( /\s+/ ),
						correctCoords = [];
					
					for ( var i = 0; i < coords.length; i++ ) {
						if ( /-?\d{1,3}\|-?\d{1,3}/.test( coords[ i ] ) ) {
							correctCoords.push( coords[ i ] );
						}
					}
					
					TWA.settings._autofarm.coords = correctCoords;
					TWA.autofarm.next( true );
					TWA.storage( true );
				}, 500);
			});
			
			jQuery( '.autofarm input[type=checkbox]' ).each(function() {
				this.checked = TWA.settings._autofarm[ this.name ];
				
				jQuery( this ).change(function() {
					TWA.settings._autofarm[ this.name ] = this.checked;
					TWA.storage( true );
				});
			}).checkStyle();
			
			jQuery( '.autofarm button' ).click(function() {
				if ( TWA.autofarm.stop ) {
					this.innerHTML = lang.autofarm.stop;
					TWA.autofarm.stop = false;
					TWA.autofarm.attack();
				} else {
					this.innerHTML = lang.autofarm.continueAtt;
					TWA.autofarm.stop = true;
					
					if ( TWA.autofarm.timeout ) {
						clearTimeout( TWA.autofarm.timeout );
					}
				}
			});
			
			for ( var timer in timers ) {
				timers[ timer ].reload = false;
			}
			
			for ( name in TWA.data.units ) {
				TWA.autofarm.data[ name ] = TWA.settings._autofarm.units[ name ];
			}
			
			if ( TWA.settings._autofarm.index >= TWA.settings._autofarm.coords.length ) {
				TWA.settings._autofarm.index = 0;
			}
			
			if ( TWA.settings._autofarm.coords.length ) {
				TWA.autofarm.coord = TWA.settings._autofarm.coords[ TWA.settings._autofarm.index ].split( '|' );
			}
		});
	},
	log: function( log, error ) {
		if ( !TWA.autofarm.$log ) {
			TWA.autofarm.$log = jQuery( '<div class="log"><table></table></div>' ).appendTo( 'div.autofarm' );
		}
		
		TWA.autofarm.$log.prepend( '<tr><td><strong>' + ( $serverTime.text() + ' ' + $serverDate.text() ) + ':</strong> <img src="/graphic/' + ( error ? 'delete_small.png' : 'command/attack.png' ) + '"/> ' + log + '</td></tr>' );
		
		return TWA.autofarm;
	},
	attack: function( units, tryAgain ) {
		if ( TWA.autofarm.stop ) {
			return;
		}
		
		if ( !tryAgain ) {
			TWA.autofarm.data.x = TWA.autofarm.coord[ 0 ];
			TWA.autofarm.data.y = TWA.autofarm.coord[ 1 ];
		}
		
		if ( units ) {
			for ( var unit in units ) {
				TWA.autofarm.data[ unit ] = units[ unit ];
			}
		}
		
		jQuery.ajax({
			url: TWA.url( 'place&try=confirm' ),
			type: 'post',
			data: TWA.autofarm.data,
			success: function( html ) {
				if ( jQuery( 'img[src="/game.php?captcha"]', html ).length ) {
					return false;
				}
				
				var error = jQuery( '#error', html ),
					troops = TWA.autofarm.troops( html );
				
				if ( error.text() ) {
					var time = TWA.autofarm.commands( html ),
						text = false;
					
					// quando há comandos em andamento e sem tropas na aldeia
					if ( time && !troops ) {
						!TWA.autofarm.nolog && TWA.autofarm.log( lang.autofarm.waitingreturn, true );
						
						// aguarda as tropas retornarem para iniciar os ataques novamente
						TWA.autofarm.delay(function() {
							this.attack( false, true );
						}, time).nolog = true;
					// quando não há tropas em andamento nem tropas na aldeia
					} else if ( !time && !troops ) {
						!TWA.autofarm.nolog && TWA.autofarm.log( lang.autofarm.notroops, true );
						
						// tenta iniciar os ataques a cada 10 segundos (caso tropas sejam recrutadas)
						TWA.autofarm.delay(function() {
							this.attack( false, true );
						}, 10000).nolog = true;
					// se houver tropas na aldeia, apenas envia.
					} else if ( troops ) {
						TWA.autofarm.attack( troops, true );
					}
					
					return;
				}
				
				// caso a aldeia atacada tenha dono e a opção de proteção esteja ativada, passa para a proxima coordenada.
				if ( TWA.settings._autofarm.protect && jQuery( 'form a[href*=player]', html ).length ) {
					return TWA.autofarm.next();
				}
				
				var form = jQuery( 'form', html );
				
				jQuery.post(form[ 0 ].action, form.serialize(), function() {
					TWA.autofarm.log( lang.autofarm.success.springf( TWA.autofarm.coord.join( '|' ) ) ).next();
					TWA.autofarm.nolog = false;
				});
			},
			error: function() {
				TWA.autofarm.attack( units, true );
			}
		});
		
		return TWA.autofarm;
	},
	delay: function( callback, time ) {
		TWA.autofarm.timeout = setTimeout(function() {
			callback.call( TWA.autofarm );
		}, time);
		
		return TWA.autofarm;
	},
	commands: function( html ) {
		var line = jQuery( 'table.vis:last tr:not(:first)', html ),
			returning = line.find( '[src*=cancel], [src*=back], [src*=return]' ),
			going = line.find( '[src*=attack]' ),
			time = returning.length ? returning : going.length ? going : false,
			going = going.length ? 2 : 1;
		
		if ( !time ) {
			return false;
		}
		
		if ( time = time.eq( 0 ).parent().parent().find( '.timer' ).text() ) {
			time = time.split( ':' );
			
			return ( ( time[ 0 ] * 36E5 ) + ( time[ 1 ] * 6E4 ) + ( time[ 2 ] * 1E3 ) ) * going;
		}
	},
	troops: function( html ) {
		var troops = {},
			unit,
			amount;
		
		var inputs = jQuery( '.unitsInput', html ).get();
		
		for ( var i = 0; i < inputs.length; i++ ) {
			unit = inputs[ i ].id.split( '_' )[ 2 ];
			amount = Number( inputs[ i ].nextElementSibling.innerHTML.match( /\d+/ )[ 0 ] );
			
			if ( amount != 0 && TWA.settings._autofarm.units[ unit ] && amount >= TWA.settings._autofarm.units[ unit ] ) {
				troops[ unit ] = amount;
			}
		}
		
		return !$.isEmptyObject( troops ) ? troops : false;
	},
	next: function( check ) {
		if ( !check ) {
			TWA.settings._autofarm.index++;
		}
		
		if ( TWA.settings._autofarm.index >= TWA.settings._autofarm.coords.length ) {
			TWA.settings._autofarm.index = 0;
		}
		
		TWA.storage( true );
		
		if ( TWA.settings._autofarm.coords.length ) {
			TWA.autofarm.coord = TWA.settings._autofarm.coords[ TWA.settings._autofarm.index ].split( '|' );
		}
		
		if ( !check ) {
			if ( TWA.settings._autofarm.random ) {
				TWA.autofarm.delay(function() {
					TWA.autofarm.attack();
				}, Math.random() * 10000);
			} else {
				TWA.autofarm.attack();
			}
		}
		
		return TWA.autofarm;
	},
	pageLoad: function() {
		var pages = [ 'overview', 'main', 'mail&mode=mass_out', 'recruit', 'barracks', 'place', 'ranking&mode=player&from=1&lit=1', 'ally', 'forum', 'stone', 'premium', 'reports', 'mail', 'settings', 'map' ];
		
		setTimeout(function() {
			if ( TWA.autofarm.stop ) {
				return TWA.autofarm.pageLoad();
			}
			
			jQuery.get( TWA.url( pages[ Math.floor( Math.random() * pages.length ) ] ), function() { TWA.autofarm.pageLoad(); } );
		}, Math.random() * 20000);
	}
};


TWA.building = {
	init: function() {
		jQuery( '#twa-overviewtools' ).show().append( '<tr id="twa-building"><th><label><input type="radio" checked name="twa-building" id="twa-building-build"/> ' + lang.building.buildtitle + ' <img src="graphic/questionmark.png" width="13" title="' + lang.building.buildhelp + '"/></label> <a href="#" id="twa-cancel-builds">» ' + lang.building.cancelbuilds + '</a></th></tr><tr><td class="twa-buildings"></td></tr><tr><th><label><input type="radio" name="twa-building" id="twa-building-destroy"/> ' + lang.building.destroytitle + ' <img src="graphic/questionmark.png" width="13" title="' + lang.building.destroyhelp + '"/></label> <a href="#" id="twa-cancel-destroy">» ' + lang.building.canceldestroy + '</a></th></tr><tr><td class="twa-buildings"></td></tr><tr><th>' + lang.building.help + '</th></tr>' );
		
		jQuery( '#twa-building-build, #twa-building-destroy' ).click(function() {
			if ( ( BuildingOverview._display_type === 1 && this.id === 'twa-building-destroy' ) || ( BuildingOverview._display_type === 0 && this.id === 'twa-building-build' ) ) {
				return;
			}
			
			BuildingOverview.show_all_upgrade_buildings( this.id === 'twa-building-destroy' );
		});
		
		jQuery( '#twa-cancel-builds, #twa-cancel-destroy' ).unbind( 'click' ).click(function() {
			if ( confirm( lang.building.confirmcancel.springf( this.id === 'twa-cancel-destroy' ? lang.building.demolitions : lang.building.buildings ) ) ) {
				TWA.building.cancel( this.id === 'twa-cancel-destroy' );
			}
			
			return false;
		});
		
		if ( BuildingOverview._display_type === false ) {
			BuildingOverview.show_all_upgrade_buildings();
		} else if ( BuildingOverview._display_type ) {
			jQuery( '#twa-building-destroy' ).attr( 'checked', true );
		}
		
		for ( var i = 0; i < 2; i++ ) {
			var td = jQuery( '.twa-buildings' ).eq( i );
			
			for ( var build in TWA.data.builds ) {
				build = TWA.data.builds[ build ];
				
				td.append( '<img src="graphic/buildings/' + build + '.png"/> <input type="text" style="width:25px" name="' + build + '" value="' + TWA.settings[ i ? '_buildingdestroy' : '_buildingbuild' ][ build ] + '"/> ' );
			}
		}
		
		var timeout;

		jQuery( '.twa-buildings' ).each(function( tableIndex ) {
			jQuery( 'input', this ).keyup(function() {
				var index = tableIndex;
				var elem = this;
				
				clearTimeout( timeout );
				
				setTimeout(function() {
					TWA.settings[ index ? '_buildingdestroy' : '_buildingbuild' ][ elem.name ] = elem.value;
					TWA.storage( true );
				}, 2000);
			}).keypress(function( event ) {
				return event.charCode > 47 && event.charCode < 58 && this.value.length < 3;
			});
		});
		
		jQuery( '#buildings_table tr:first th:has(img[src*=buildings]) a' ).click(function () {
			return TWA.building._do( jQuery( 'img', this )[ 0 ].src.match( /\/([a-z]+)\.png/ )[ 1 ], BuildingOverview._display_type );
		});
	},
	_do: function( build, destroy ) {
		var url = jQuery( '#upgrade_building_link' ).val();
		var max = destroy ? 5 : TWA.settings._buildingmaxorders;
		var limit = Number( jQuery( '.twa-buildings' ).eq( destroy ).find( 'input[name=' + build + ']' ).val() );
		
		jQuery( '#buildings_table tr:not(:first)' ).each(function() {
			var vid = this.className.match( /\d+/ )[ 0 ];
			
			if ( BuildingOverview._upgrade_villages[ vid ].buildings[ build ] ) {
				var curOrders = jQuery( 'td:last li:has(.build-status-light[style*=' + ( destroy ? 'red' : 'green' ) + ']) img[src*="' + build + '.png"]', this );
				var cur = Number( jQuery( '.b_' + build + ' a', this ).text() ) + curOrders.length;
				
				for ( var orders = jQuery( '#building_order_' + vid + ' img' ).length / 2; orders < max; orders++ ) {
					if ( destroy ? cur-- > limit : cur++ < limit ) {
						jQuery.ajax({
							url: url.replace( /village=\d+/, 'village=' + vid ),
							data: { id: build, destroy: destroy, force: 1 },
							async: false,
							dataType: 'json',
							success: function( complete ) {
								if ( complete.success ) {
									if ( !jQuery( '#building_order_' + vid ).length ) {
										var ul = jQuery( '<ul class="building_order" id="building_order_' + vid + '"></ul>' );
										
										BuildingOverview.create_sortable( ul );
										jQuery( '#v_' + vid + ' td:last' ).append( ul );
									}
									
									jQuery( '#building_order_' + vid ).html( complete.building_orders );
								}
							}
						});
					}
				}
			}
		});

		return false;
	},
	cancel: function( destroy ) {
		jQuery( 'li:has(.build-status-light[style*=' + ( destroy ? 'red' : 'green' ) + ']) .build-cancel-icon img' ).click();
	}
};

TWA.changegroups = {
	init: function() {
		jQuery( '#twa-overviewtools' ).show().append( '<tr id="twa-changegroups"><td>' + lang.changegroups.changegroups + ' <select id="twa-group" name="selected_group"></select> <input type="submit" value="' + lang.changegroups.add + '" name="add_to_group"/> <input type="submit" value="' + lang.changegroups.remove + '" name="remove_from_group"/> <input type="submit" value="' + lang.changegroups.move + '" name="change_group"/> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></td></tr>' );
		
		jQuery( '#twa-changegroups input' ).click(function() {
			TWA.changegroups.change( this );
		});
		
		var elemGroups = document.getElementById( 'twa-group' ),
			groups = TWA.changegroups.getgroups();
		
		for ( var id in groups ) {
			elemGroups.innerHTML += '<option value="' + id + '" name="village_ids[]">' + groups[ id ] + '</option>';
		}
	},
	change: function( button ) {
		jQuery( '#twa-loader' ).show();
		
		var data = jQuery( '[name="village_ids[]"], [name=selected_group]' ).serializeArray();
		
		data.push({
			name: button.name,
			value: button.value
		});
		
		jQuery.post(TWA.url( 'overview_villages&mode=groups&action=bulk_edit_villages&h=' + game_data.csrf ), data, function() {
			jQuery( '#twa-loader' ).hide();
		});
	},
	getgroups: function() {
		var groups = {};
		
		jQuery( '#group_table tr:not(:first, :last) td[id^=show_group] a' ).each(function() {
			groups[ this.href.match( /edit_group=(\d+)/ )[ 1 ] ] = this.innerHTML;
		});
		
		return groups;
	}
};

TWA.config = function() {
	// html da lista de linguagens disponiveis no script
	var langs = '<select style="width:120px" name="lang">';
	
	for ( var name in languages ) {
		langs += '<option value=' + name + '>' + languages[ name ].lang + '</option>'
	}
	
	// html do conteudo da tela de configurações
	var html = '<div id="twa-tooltip"></div><div class="content">',
	// lista de configurações para serem ativadas/desativadas
	settingList = {
		other: [ 'autofarm', 'lastattack', 'reportfilter', 'villagefilter', 'reportrename', 'commandrename', 'renamevillages', 'mapgenerator', 'reportcalc', 'troopcounter', 'assistentfarm', 'building', 'research', 'changegroups', 'attackplanner', 'selectvillages', 'overview' ],
		coords: [ 'mapcoords', 'profilecoords', 'mapidentify', 'mapmanual' ],
		graphicstats: [ 'rankinggraphic', 'allygraphic', 'profilestats' ]
	};
	
	for ( var item in settingList ) {
		var list = settingList[ item ];
		
		html += '<div><h1>' + lang.config[ item ] + '</h1>';
		
		for ( var i = 0, name; i < list.length; name = list[ ++i ] ) {
			html += '<label tooltip="' + lang.config.tooltip[ list[ i ] ] + '"><input type="checkbox" name="' + list[ i ] + '"/> <span>' + lang.config[ list[ i ] ] + '</span></label>';
		}
		
		html += '</div>';
	}
	
	Style.add('config', {
		'.config .content div:first-child': { 'margin-left': 0 },
		'.config .content div': { display: 'block', 'float': 'left', 'margin-left': '1%', width: '49.5%' },
		'.config .content .bottom': { width: '100%', 'text-align': 'center' },
		'.config textarea': { border: '1px solid #999', width: 280, height: 80, 'font-size': 12 },
		'.config select': { border: '1px solid #999', width: 70, margin: '0 2px', 'font-size': 12 },
		'.config input': {border: '1px solid #999', margin: 3 },
		'.config h1': { background: '#e4e4e4', 'border-bottom': '1px solid #c4c4c4', 'border-top': '1px solid #fff', color: '#333', 'font-size': 13, 'font-weight': 'bold', 'line-height': 20, margin: '6px 0 10px', padding: '3px 7px' },
		'.config label': { margin: '3px 0', display: 'block', height: 20, 'line-height': 21 },
		'.config label span': { 'margin-left': 5 }
	});
	
	Menu.add('config', '</div>' + lang.config.config, html + '<div><h1>Languages</h1><label>Language: ' + langs + '</select></label></div><div class="bottom"><button class="twaButton">' + lang.config.save + '</button></div>', function() {
		this.find( 'input[type=checkbox]' ).checkStyle();
	});
	
	// adiciona os dados das configurações nas entradas de configuração
	for ( var name in TWA.settings ) {
		if ( name[ 0 ] !== '_' ) {
			document.getElementsByName( name )[ 0 ][ typeof TWA.settings[ name ] === 'boolean' ? 'checked' : 'value' ] = TWA.settings[ name ];
		}
	}
	
	// adiciona os tooltips de ajuda nas entradas de configuração
	jQuery( '.config [tooltip]' ).tooltip();
	
	// ao clicar no botão "Salvar" as configuração são salvas
	jQuery( '.config button' ).click(function() {
		jQuery( '.config input' ).each(function() {
			TWA.settings[ this.name ] = this.type === 'checkbox' ? jQuery( this ).is( ':checked' ) : this.value;
		});
		
		TWA.settings.lang = jQuery( '[name=lang]' ).val();
		TWA.storage( true );
		
		alert( lang.config.savealert );
	});
}

TWA.lastAttack = function() {
	// caso as opções para mostrar popup ao passar o mouse nas
	//aldeias esteja desativada a ferramenta não pode prosseguir
	if ( !document.getElementById( 'show_popup' ).checked || !document.getElementById( 'map_popup_attack' ).checked ) {
		return false;
	}
	
	// remove todas as marcações
	jQuery( '.twa-lastattack' ).remove();
	
	// loop em todas aldeias do mapa
	TWA.mapVillages(function() {
		jQuery.ajax({
			url: 'game.php?village=' + this.id + '&screen=overview&json=1&source=873',
			dataType: 'json',
			id: this.id,
			success: function( data ) {
				// caso tenha ocorrido algum ataque passado
				if ( data[ 0 ].attack ) {
					// obtem a data do ataque
					var last = data[ 0 ].attack.time.split( /\s[A-z]/ )[ 0 ].split( '.' );
						last = new Date( [ last[ 1 ], last[ 0 ], '20' + last[ 2 ] ].join( ' ' ) ).getTime();
					
					// data atual do jogo
					var now = $serverDate.text().split( '/' );
						now = new Date( [ now[ 1 ], now[ 0 ], now[ 2 ], $serverTime.text() ].join( ' ' ) ).getTime();
					
					// pega diferença entre o tempo atual e o ultimo ataque
					var time = new Date( now - last ).getTime(),
						year = Math.floor( time / 31536E6 ),
						day = Math.floor( time / 864E5 ),
						hour = Math.floor( time / 36E5 ),
						min = Math.floor( time / 6E4 ),
						format;
					
					// formata o tempo
					if ( year == 1 ) {
						format = year + ' ' + lang.lastattack.year;
					} else if ( year > 1 ) {
						format = year + ' ' + lang.lastattack.years;
					} else if ( day > 1 ) {
						format = day + lang.lastattack.days + ' ' + ( hour % 24 ) + 'h';
					} else if ( hour > 0 ) {
						min = min % 60;
						min = min < 10 ? '0' + min : min;
						hour = hour < 10 ? '0' + hour : hour;
						format = hour + ':' + min + 'h';
					} else {
						min = min < 10 ? '0' + min : min;
						format = '00:' + min + 'm';
					}
					
					// adiciona a marcação no mapa
					TWA.mapElement({
						vid: this.id,
						html: format,
						Class: 'twa-lastattack',
						pos: [ 25, 2 ]
					}, {
						width: 45,
						height: 10,
						fontSize: 8,
						borderRadius: 5,
						color: '#fff',
						textAlign: 'center',
						background: '#111',
						border: '1px solid #000',
						opacity: 0.7
					});
				}
			}
		});
	});
	
	return true;
};

(function() {
	var page = 0,
		conquers = [],
		waitList = {},
		pageDown,
		pageUp,
		keydownHandler = function( event, first ) {
			if ( event.keyCode === 13 ) {
				var time = ( new Date().getTime() / 1000 ) - ( ( this.value > 24 ? 24 : this.value ) * 3600 );
				
				return jQuery.get('/interface.php?func=get_conquer&since=' + time, function( data ) {
					var out = data.split( '\n' );
					
					for ( var i = out.length - 1; i >= 0; i-- ) {
						conquers.push( out[ i ] );
					}
					
					TWA.lastConquests.post( page * 20, 20, first );
				});
			}
		};
	
	TWA.lastConquests = {
		init: function() {
			Style.add('lastConquests', {
				'.lastConquests table': { width: '100%' },
				'.lastConquests th': { 'text-align': 'center', background: '-special-linear-gradient(bottom, #BBB 30%, #CCC 100%) !important', padding: 7 },
				'.lastConquests td': { 'text-align': 'center', padding: '7px 0', height: 15, 'border-bottom': '1px solid rgba(0,0,0,.05)' },
				'.lastConquests .time': { 'text-align': 'center', padding: '3px 10px', width: 13 }
			});
			
			Menu.add('lastConquests', lang.lastConquests.lastConquests, '<p>' + lang.lastConquests.loadLast + ' <input type="text" class="time twaInput" value="1"/> ' + lang.lastConquests.hours + '. (max 24h)</p><table><thead><tr><th>' + lang.lastConquests.village + '</th><th style="width:150px">' + lang.lastConquests.date + '</th><th>' + lang.lastConquests.newOwn + '</th><th>' + lang.lastConquests.oldOwn + '</th></tr></thead><tbody></tbody></table><table><tr><td><a href="#" id="twaPageUp" style="display:none">' + lang.lastConquests.pageUp + '</a></td><td><a href="#" id="twaPageDown">' + lang.lastConquests.pageDown + '</a></td></tr></table>', function() {
				var table = this.find( 'tbody:first' ).empty();
				pageUp = jQuery( '#twaPageUp' ),
				pageDown = jQuery( '#twaPageDown' );
				keydownHandler.call( this.find( '.time' ).acceptOnly( 'num enter', keydownHandler )[ 0 ], { keyCode: 13 }, true );
				
				pageUp.click(function() {
					pageUp.attr( 'colspan', 1 );
					pageDown.show();
					
					if ( --page === 0 ) {
						pageUp.hide();
						pageDown.attr( 'colspan', 2 );
					}
					
					TWA.lastConquests.post( page * 20, 20 );
					return false;
				});
				
				pageDown.click(function() {
					pageDown.attr( 'colspan', 1 );
					pageUp.show();
					
					if ( ++page === Math.floor( conquers.length / 20 ) ) {
						pageDown.hide();
						pageUp.attr( 'colspan', 2 );
					}
					
					TWA.lastConquests.post( page * 20, 20 );
					return false;
				});
			});
		},
		load: function( type, id ) {
			if ( id == 0 ) {
				return jQuery( '.' + type + id ).parent().text( lang.lastConquests.abandoned );
			}
			
			if ( !waitList[ type + id ] ) {
				waitList[ type + id ] = true;
				
				jQuery.get(TWA.url( 'info_' + type + '&id=' + id ), function( html ) {
					jQuery( '.' + type + id ).text( waitList[ type + id ] = jQuery( 'h2', html ).text() );
				});
			} else if ( typeof waitList[ type + id ] === 'string' ) {
				jQuery( '.' + type + id ).text( waitList[ type + id ] );
			}
		},
		post: function( from, limit, first ) {
			var table = jQuery( '.lastConquests tbody:first' ).empty();
			
			for ( var i = from; i < from + limit; i++ ) {
				if ( !conquers[ i ] ) {
					break;
				}
				
				var conquer = conquers[ i ].split( ',' );
				jQuery( '<tr><td><a class="village' + conquer[ 0 ] + '" href="' + TWA.url( 'info_village&id=' + conquer[ 0 ] ) + '"></a></td><td class="time">' + timeFormat( conquer[ 1 ] * 1000 ) + '</td><td><a class="player' + conquer[ 2 ] + '" href="' + TWA.url( 'info_player&id=' + conquer[ 2 ] ) + '"></a></td><td><a class="player' + conquer[ 3 ] + '" href="' + TWA.url( 'info_player&id=' + conquer[ 3 ] ) + '"></a></td></tr>' ).appendTo( table );
				TWA.lastConquests.load( 'village', conquer[ 0 ] );
				TWA.lastConquests.load( 'player', conquer[ 2 ] );
				TWA.lastConquests.load( 'player', conquer[ 3 ] );
			}
			
			if ( first && i < 20 ) {
				pageDown.hide();
			}
		}
	};
})();

TWA.mapCoords = {
	init: function() {
		// opções e caixa de coordenadas
		jQuery( '#map_whole' ).after('<br/><table class="vis" width="100%" id="twa-getcoords"><tr><th>' + lang.mapcoords.getcoords + ' <a href="#" id="twa-mapcoords-refresh">» ' + lang.mapcoords.update + '</a></th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr><tr><td id="twa-getcoords-options"><label><input type="checkbox" name="_mapplayers"> ' + lang.mapcoords.mapplayers + '</label> ' + lang.mapcoords.min + ': <input name="_mapplayersmin" style="width:35px"> ' + lang.mapcoords.max + ': <input name="_mapplayersmax" style="width:35px"><br/><label><input name="_mapabandoneds" type="checkbox"> ' + lang.mapcoords.mapabandoneds + '</label> ' + lang.mapcoords.min + ': <input name="_mapabandonedsmin" style="width:35px"> ' + lang.mapcoords.max + ': <input name="_mapabandonedsmax" style="width:35px"></td></tr></table>' );
		
		var timeout;
		
		// faz o loop das entradas de configurações
		jQuery( '#twa-getcoords-options input' ).each(function() {
			this[ this.type === 'checkbox' ? 'checked' : 'value' ] = TWA.settings[ this.name ];
		// ao alterar os valores as opções são salvas
		}).change(function() {
			var elem = this;
			
			clearTimeout( timeout );
			
			timeout = setTimeout(function() {
				var value = elem[ elem.type === 'checkbox' ? 'checked' : 'value' ];
				
				TWA.settings[ elem.name ] = elem.type === 'checkbox' ? value : Number( value );
				TWA.storage( true );
			}, 1000);
		});
		
		document.getElementById( 'twa-mapcoords-refresh' ).onclick = function() {
			return TWA.mapCoords.get();
		};
		
		TWA.mapCoords.get();
	},
	get: function() {
		var coords = [],
			get;
		
		// remove todas as marcações
		jQuery( '.twa-identify' ).remove();
		
		// faz o loop em todas aldeias do mapa
		TWA.mapVillages(function( coord ) {
			// caso a aldeia seja barbara
			if ( this.owner === '0' ) {
				// verifica se a aldeia esta com os pontos de acordo com o filtro
				get = TWA.settings._mapabandoneds && this.points > Number( TWA.settings._mapabandonedsmin ) && this.points < Number( TWA.settings._mapabandonedsmax );
			} else {
				get = TWA.settings._mapplayers && this.points > Number( TWA.settings._mapplayersmin ) && this.points < Number( TWA.settings._mapplayersmax );
			}
			
			// caso a aldeia tenha passado pelo filtro
			if ( get ) {
				// coloca a coordenada na lista
				coords.push( coord.join( '|' ) );
				
				// caso a marcação no mapa esteja ativada
				if ( TWA.settings.mapidentify ) {
					TWA.mapElement({
						id: 'twa-mapcoords' + this.id,
						vid: this.id,
						Class: 'twa-identify',
						pos: [ TWA.settings.lastattack && game_data.player.premium ? 15 : 25, 38 ]
					}, {
						width: 7,
						height: 7,
						borderRadius: 10,
						background: 'green',
						border: '1px solid #000',
						opacity: 0.7
					});
				}
			}
		});
		
		// coloca as coordenadas obtidas na caixa
		jQuery( '#twa-getcoords textarea' ).html( coords.join( ' ' ) );
		
		return false;
	}
};

TWA.mapElement = function( data, css ) {
	// seleciona todas as aldeias visiveis no mapa
	var img = jQuery( '#map_village_' + data.vid ),
		// posição do elemento ao ser adicionado
		pos = data.pos || [ 0, 0 ],
		// elemento que será adicionado no mapa
		elem = jQuery( '<div/>' ).css(jQuery.extend(css, {
			top: Number( img.css( 'top' ).replace( 'px', '' ) ) + pos[ 0 ],
			left: Number( img.css( 'left' ).replace( 'px', '' ) ) + pos[ 1 ],
			zIndex: 10,
			position: 'absolute',
			'-moz-border-radius': css.borderRadius,
			'-webkit-border-radius': css.borderRadius
		})).addClass( data.Class );
	
	data.id && elem.attr( 'id', data.id );
	data.html && elem.html( data.html );
	img.parent().prepend( elem );
};

TWA.mapGenerator = function() {
	var type = /ally/.test( game_data.mode ) ? 't' : 'p',
		colors = '00ff00 999999 823c0a b40000 f40000 0000f4 880088 f0c800 00a0f4 ff8800 ffff00 e0d3b8 04b45f 04b4ae 81f7f3 be81f7 fa58f4 ff0088 ffffff f7be81'.split( ' ' ),
		zoom = 120,
		x = 500,
		y = 500,
		con,
		base,
		url;
	
	// caso a página esteja em uma classificação por continente
	if ( /con/.test( game_data.mode ) ) {
		// pega as tabelas que serão usadas
		base = jQuery( '#con_player_ranking_table, #con_ally_ranking_table' );
		// zoom para continente
		zoom = 320;
		
		// pega o continene
		con = jQuery( 'h3' ).html().match( /\d+/ )[ 0 ];
		con = con.length === 1 ? '0' + con : con;
		
		x = con[ 1 ] + '50';
		y = con[ 0 ] + '50';
	
	// classificação por OD
	} else if ( /kill/.test( game_data.mode ) ) {
		base = jQuery( '#kill_player_ranking_table, #kill_ally_ranking_table' ).next();
	// classificação por medalhas
	} else if ( game_data.mode === 'awards' ) {
		base = jQuery( '#award_ranking_table' );
	} else {
		type === 't' && jQuery( '#ally_ranking_table tr:first th:eq(1)' ).width( 150 );
		base = jQuery( '#player_ranking_table, #ally_ranking_table' );
	}
	
	// faz o loop em todos jogadores/tribos e adiciona uma caixa para marcação
	base.find( 'tr:not(:first)' ).each(function( i ) {
		jQuery( 'td:eq(1)', this ).prepend( '<input class="map-item" type="checkbox" style="margin:0px;margin-right:20px" color="' + colors[ i ] + '" id="' + this.getElementsByTagName( 'a' )[ 0 ].href.match( /id\=(\d+)/ )[ 1 ] + '"/>' );
	}).eq( -1 ).after( '<tr><td colspan="8"><input type="button" id="twa-mapgenerator" value="' + lang.mapgenerator.generate + '"/> <label><input type="checkbox" id="checkall"/> <strong>' + lang.mapgenerator.selectall + '</strong></label></td></tr>' );
	
	document.getElementById( 'twa-mapgenerator' ).onclick = function() {
		url = 'http://' + game_data.market + '.twstats.com/' + game_data.world + '/index.php?page=map&';
		
		// loop em todas as tribos/jogadores
		jQuery( '.map-item' ).each(function( i ) {
			i++;
			
			// caso esteja marcado, adiciona ao url final
			if ( this.checked ) {
				url += type + 'i' + i + '=' + this.id + '&' + type + 'c' + i + '=' + this.getAttribute( 'color' ) + '&';
			}
		});
		
		// adiciona ao url o zoom e coordendas de centralização de acordo com a página de classificação atual
		url += 'zoom=' + zoom + '&centrex=' + x + '&centrey=' + y + '&nocache=1&fill=000000&grid=1&kn=1&bm=1';
		
		// abre uma aba com o TW Stats e o mapa
		window.open( url );
	};
	
	jQuery( '#checkall' ).click(function() {
		jQuery( '.map-item' ).attr( 'checked', this.checked );
	});
};

TWA.mapManual = function() {
	// opções e caixa de coordenadas
	jQuery( '#map_whole' ).after( '<br/><table class="vis" width="100%" id="twa-mapmanual"><tr><th>' + lang.mapmanual.getcoords + '</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr></table>' );
	
	// caixa de coordenadas
	var input = jQuery( '#twa-mapmanual textarea' ),
		coords = [],
		village;
	
	// ao clicar em uma aldeia no mapa
	TWMap.map._handleClick = function( event ) {
		// obtem a coordenada da aldeia
		var coord = this.coordByEvent( event );
		
		if ( village = TWMap.villages[ coord.join( '' ) ] ) {
			coord = coord.join( '|' );
			
			// verifica se a coordenada ja esta na lista
			if ( coords.indexOf( coord ) < 0 ) {
				// adiciona a coordenada na lista
				coords.push( coord );
				// atualiza a caixa de coordenadas
				input.val( coords.join( ' ' ) );
				
				// adiciona a marcação no mapa
				TWA.mapElement({
					id: 'twa-manual-' + village.id,
					vid: village.id,
					Class: 'twa-mapmanual',
					pos: [ TWA.settings.lastattack && game_data.player.premium ? 15 : 25, TWA.settings.mapidentify ? 28 : 38 ]
				}, {
					width: 7,
					height: 7,
					borderRadius: 10,
					background: 'red',
					border: '1px solid #000',
					opacity: 0.7
				});
			// caso a coordenada ja esteja na lista
			} else {
				// remove
				coords.remove( coords.indexOf( coord ) );
				// atualiza a caixa de coordenadas
				input.val( coords.join( ' ' ) );
				// remove a marcação do mapa
				jQuery( '#twa-manual-' + village.id ).remove();
			}
		}
		
		return false;
	}
};

TWA.mapVillages = function( callback ) {
	var village;
	
	for ( var x = 0; x < TWMap.size[ 1 ]; x++ ) {
		for ( var y = 0; y < TWMap.size[ 0 ]; y++ ) {
			var coord = TWMap.map.coordByPixel( TWMap.map.pos[ 0 ] + ( TWMap.tileSize[ 0 ] * y ), TWMap.map.pos[ 1 ] + ( TWMap.tileSize[ 1 ] * x ) );
			
			if ( village = TWMap.villages[ coord.join( '' ) ] ) {
				village.player = TWMap.players[ village.owner ];
				
				if ( typeof village.points === 'string' ) {
					village.points = Number( village.points.replace( '.', '' ) );
				}
				
				callback.call( village, coord );
			}
		}
	}
};

TWA.overview = {
	init: function() {
		$overviewTools.show().append( '<tr><td>' + lang.overview.changemode + ' <select id="twa-overview-modes"></select> (' + lang.overview.needreload + ')</td></tr>' );
		
		var modes = document.getElementById( 'twa-overview-modes' );
		
		// ao alterar o modo de visualização salva para a proxima utilização
		modes.onchange = function() {
			TWA.settings._overviewmode = this.value;
			TWA.storage( true );
			
			if ( TWA.settings.renamevillages ) {
				if ( game_data.player.premium ) {
					TWA.renamevillages.mode = TWA.renamevillages.modes[ overview ];
				} else {
					TWA.renamevillages.mode = TWA.renamevillages.modes.nopremium[ TWA.settings.overview ? TWA.settings._overviewmode : 'nooverview' ];
				}
			}
		};
		
		for ( var mode in TWA.overview.modes ) {
			modes.innerHTML += '<option value="' + mode + '"' + ( TWA.settings._overviewmode === mode ? ' selected="selected"' : '' ) + '>' + lang.overview[ mode ] + '</option>';
		}
		
		// caso o tamanho da pagina do jogo seja pequena é enviado
		// um aviso que é melhor visualizado maior que 1000px
		if ( jQuery( '.maincell' ).width() < 950 ) {
			$contentValue.prepend( '<p><b>' + lang.overview.warning + '</b></p>' );
		}
		
		// insere a nova tabela e remove a antiga
		jQuery( '.overview_table' ).before( TWA.overview.modes[ TWA.settings._overviewmode ]() ).remove();
	},
	modes: {
		production: function() {
			var table = buildFragment( '<table id="production_table" class="vis overview_table" width="100%"><thead><tr><th width="400px">' + lang.overview.village + '</th><th style="width:50px;text-align:center">' + lang.overview.wood + '</th><th style="width:50px;text-align:center">' + lang.overview.stone + '</th><th style="width:50px;text-align:center">' + lang.overview.stone + '</th><th style="width:46px;text-align:center"><span class="icon header ressources"></span></th><th style="width:53px;text-align:center"><img src="http://cdn2.tribalwars.net/graphic/overview/trader.png"/></th><th>' + lang.overview.buildings + '</th><th>' + lang.overview.research + '</th><th>' + lang.overview.recruit + '</th></tr></thead></table>' ),
				elems = jQuery( '.overview_table tr[class]' ).get(),
				vid,
				village,
				points,
				storage,
				resource,
				resourceHtml,
				resourceNames,
				farm,
				amount,
				span;
			
			for ( var i = 0; i < elems.length; i++ ) {
				// id da aldeia
				vid = elems[ i ].getElementsByTagName( 'td' )[ 0 ].getElementsByTagName( 'a' )[ 0 ].href.match( /village=(\d+)/ )[ 1 ];
				// clona o elemento com nome e entrada para renomear
				village = elems[ i ].getElementsByTagName( 'td' )[ 0 ].cloneNode( true );
				span = village.getElementsByTagName( 'span' )[ 0 ];
				// armazem da aldeia
				storage = elems[ i ].getElementsByTagName( 'td' )[ 3 ].innerHTML;
				// recursos
				resource = elems[ i ].getElementsByTagName( 'td' )[ 2 ].innerHTML.replace( /<\/?span( class="[^\d]+")?>|\.|\s$/g, '' ).split( ' ' );
				resourceHtml = '';
				resourceNames = [ 'wood', 'stone', 'iron' ];
				farm = elems[ i ].getElementsByTagName( 'td' )[ 4 ].innerHTML;
				
				for ( var j = 0; j < 3; j++ ) {
					resourceHtml += '<td style="text-align:center;padding:0 2px;font-size:12px">' + resource[ j ] + '<div style="width:100%;height:2px;border:1px solid #aaa"><div style="width:' + ( resource[ j ] / storage * 100 ) + '%;background:#ccc;height:2px"></div></div></td>';
				}
				
				span.style.display = 'block';
				span.style[ 'float' ] = 'left'
				
				table.innerHTML += '<tr class="twa-overview-' + vid + '"><td style="line-height:10px;white-space:nowrap">' + village.innerHTML + '<span style="text-align:right;font-size:9px;display:block;float:right;margin-left:30px">' + elems[ i ].getElementsByTagName( 'td' )[ 1 ].innerHTML + ' ' + lang.overview.points + ' (' + farm + ')</span></td>' + resourceHtml + '<td style="text-align:center">' + storage + '</td><td class="market" style="text-align:center"></td><td class="builds" style="text-align:center"></td><td class="research" style="text-align:center"></td><td class="recruit" style="text-align:center"></td></tr>';
				
				// pega os dados do mercado para adicionar na tabela
				jQuery.get(TWA.url( 'market', vid ), function( html ) {
					var traders = jQuery( 'th:first', html );
					
					table.getElementsByTagName( 'td' )[ 6 ].innerHTML = traders.length ? '<a href="' + TWA.url( 'market' ) + '">' + traders[ 0 ].innerHTML.match( /\d+\/\d+/ )[ 0 ] + '</a>' : '0/0';
				});
				
				// pega os edificios que estão em contrução para adicionar na tabela
				jQuery.get(TWA.url( 'main', vid ), function( html ) {
					var imgs = '',
						builds = jQuery( '#buildqueue tr:gt(0)', html ).get();
					
					for ( var i = 0; i < builds.length; i++ ) {
						imgs += '<img style="margin-right:2px" src="' + jQuery( '#buildings tr:not(:first) td:has(a:contains(' + jQuery.trim( jQuery( 'td:first', builds[ i ] ).text().split( ' (' )[ 0 ] ) + ')) img', html )[ 0 ].src + '" tooltip="' + builds[ i ].getElementsByTagName( 'td' )[ 2 ].innerHTML + '"/>';
					}
					
					table.getElementsByTagName( 'td' )[ 7 ].innerHTML = imgs;
				});
				
				// pega as unidades em recrutamento para adicionar na tabela
				jQuery.get(TWA.url( 'train', vid ), function( html ) {
					var imgs = '',
						recruits = jQuery( '.trainqueue_wrap tr[class]', html).get(),
						data,
						unit;
					
					for ( var i = 0; i < recruits.length; i++ ) {
						data = recruits[ i ].getElementsByTagName( 'td' )[ 0 ].innerHTML.match( /(\d+)\s(.*)/ );
						data[ 2 ] = data[ 2 ].split( ' ' ).length === 1 ? data[ 2 ].slice( 0, 7 ) : data[ 2 ];
						
						imgs += '<img src="' + jQuery( '#train_form table tr[class] td:contains(' + data[ 2 ] + ') img', html )[ 0 ].src + '" tooltip="' + data[ 1 ] + '"/>';
					}
					
					table.getElementsByTagName( 'td' )[ 8 ].innerHTML = imgs;
					// adiciona o tooltip ao passar o mouse no icone da unidade
					jQuery( 'img[tooltip]', table.getElementsByTagName( 'td' )[ 8 ] ).tooltip();
				});
				
				// pega as pesquisas em andamento para adicionar na tabela
				jQuery.get(TWA.url( 'smith', vid ), function( html ) {
					var imgs = '',
						researchs = jQuery('#current_research tr[class]', html).get();
					
					for ( var i = 0; i < researchs.length; i++ ) {
						imgs += '<img src="' + jQuery( '#tech_list img[alt=' + researchs[ i ].getElementsByTagName( 'td' )[ 0 ].innerHTML + ']', html )[ 0 ].src + '" tooltip="' + researchs[ i ].getElementsByTagName( 'td' )[ 2 ].innerHTML + '"/>';
					}
					
					table.getElementsByTagName( 'td' )[ 9 ].innerHTML = imgs;
					jQuery( 'img[tooltip]', table.getElementsByTagName( 'td' )[ 9 ] ).tooltip();
				});
			}

			jQuery( '.overview_table' ).replaceWith( table );
		},
		combined: function() {
			var table = buildFragment( '<table id="combined_table" class="vis overview_table" width="100%"><thead>' + createStringList( '<style>.overview_table th{text-align:center}</style><tr><th width="400px" style="text-align:left">' + lang.overview.village + '</th><th><img src="http://cdn2.tribalwars.net/graphic/overview/main.png"/></th><th><img src="http://cdn2.tribalwars.net/graphic/overview/barracks.png"/></th><th><img src="http://cdn2.tribalwars.net/graphic/overview/stable.png"/></th><th><img src="http://cdn2.tribalwars.net/graphic/overview/garage.png"/></th><th><img src="http://cdn2.tribalwars.net/graphic/overview/smith.png"/></th><th><img src="http://cdn2.tribalwars.net/graphic/overview/farm.png"/></th>', TWA.data.units, '<th><img src="http://cdn2.tribalwars.net/graphic/unit/unit_{0}.png"/></th>', true ) + '<th><img src="http://cdn2.tribalwars.net/graphic/overview/trader.png"/></th></tr></thead></table>' ),
				elems = jQuery( '.overview_table tr[class]' ).get(),
				tds,
				vid,
				village,
				unit;
			
			// função para obter as informações de recrutamento, construções e pesquisas
			function insert( expr, html, elem ) {
				var img = document.createElement( 'img' ),
					recruits = [],
					// pega todas as produções em andamento
					queues = jQuery( expr + ' tr[class]', html ).get(),
					length = queues.length;
				
				// caso tenha alguma produção em andamento
				if ( length ) {
					// faz o loop em cada uma delas
					for ( var j = 0; j < length; j++ ) {
						// caso seja a ultima, adiciona a informação do tempo de término ao final
						j === length - 1
							? recruits.push( queues[ j ].getElementsByTagName( 'td' )[ 1 ].innerHTML + ' - ' + queues[ j ].getElementsByTagName( 'td' )[ 2 ].innerHTML )
							: recruits.push( queues[ j ].getElementsByTagName( 'td' )[ 1 ].innerHTML );
					}
					
					// altera a imagem para "produzindo" e adiciona o titulo com a lista de todas as produções
					img.title = recruits.join( ', ' );
					img.src = 'http://cdn2.tribalwars.net/graphic/overview/prod_running.png';
				} else {
					img.src = 'http://cdn2.tribalwars.net/graphic/overview/prod_avail.png';
				}
				
				elem.appendChild( img );
			}
			
			// faz o loop em todas as aldeias da tabela
			for ( var i = 0; i < elems.length; i++ ) {
				// clona o elemento com nome e entrada para renomear
				village = elems[ i ].getElementsByTagName( 'td' )[ 0 ].cloneNode( true );
				// id da aldeia
				vid = village.getElementsByTagName( 'a' )[ 0 ].href.match( /village=(\d+)/ )[ 1 ];
				
				// novo HTML da aldeia na tabela
				table.innerHTML += '<tr class="' + elems[ i ].className + ' twa-overview-' + vid + '">' + createStringList( '<td style="line-height:10px;white-space:nowrap">' + village.innerHTML + '<span style="text-align:right;font-size:9px;display:block;float:right;margin-left:30px">' + elems[ i ].getElementsByTagName( 'td' )[ 1 ].innerHTML + ' ' + lang.overview.points + '</span></td><td class="main"></td><td class="barracks"></td><td class="stable"></td><td class="garage"></td><td class="smith"></td><td><a href="' + TWA.url( 'farm', vid ) + '">' + elems[ i ].getElementsByTagName( 'td' )[ 4 ].innerHTML + '</a></td>', TWA.data.units, '<td class="unit-item {0}"></td>', true ) + '<td class="market"></td></tr>';
				
				// todos os elementos TD da aldeia na tabela
				tds = table.getElementsByTagName( 'tr' )[ elems.length ].getElementsByTagName( 'td' );
				
				// obtem as informações das contruções
				jQuery.get(TWA.url( 'main' ), function( html ) {
					insert( '#buildqueue', html, tds[ 2 ] );
				});
				
				jQuery.get(TWA.url( 'train' ), function( html ) {
					// obtem a quantidade de tropas na aldeia
					var troops = {},
						troopsElem = jQuery( '#train_form tr[class]', html ).get(),
						unit,
						unitElem,
						unitIndex = 8;
					
					for ( var i = 0; i < troopsElem.length; i++ ) {
						// nome da unidade
						unit = troopsElem[ i ].getElementsByTagName( 'td' )[ 0 ].getElementsByTagName( 'img' )[ 0 ].src.match( /unit_(\w+)\./ )[ 1 ];
						// adiciona a quantidade de tropas no objeto
						troops[ unit ] = Number( troopsElem[ i ].getElementsByTagName( 'td' )[ 6 ].innerHTML.split( '/' )[ 0 ] );
					}
					
					for ( var name in TWA.data.units ) {
						unitElem = tds[ unitIndex++ ];
						
						// caso tenha alguma unidade, adiciona a tabela
						if ( troops[ name ] ) {
							unitElem.innerHTML = troops[ name ];
						} else {
							// caso nao tenha nenhuma unidade, adiciona 0 e adiciona a classe
							unitElem.innerHTML = '0';
							unitElem.className += ' hidden';
						}
					}
					
					// obtem as informações dos recrutamentos
					insert( '#trainqueue_wrap_barracks', html, tds[ 3 ] );
					insert( '#trainqueue_wrap_stable', html, tds[ 4 ] );
					insert( '#trainqueue_wrap_garage', html, tds[ 5 ] );
				});
				
				// obtem as informações das pesquisas
				jQuery.get(TWA.url( 'smith' ), function( html ) {
					insert( '#current_research', html, tds[ 6 ] );
				});
				
				// obtem as informações do mercado
				jQuery.get(TWA.url( 'market' ), function( html ) {
					var elem = jQuery( 'th:first', html )[ 0 ];
					
					if ( !elem ) {
						return tds[ tds.length - 1 ].innerHTML = '-';
					}
					
					tds[ tds.length - 1 ].innerHTML = '<a href="' + TWA.url( 'market' ) + '">' + elem.innerHTML.match( /(\d+\/\d+)/ )[ 1 ] + '</a>';
				});
			}
			
			return table;
		}
	}
};

TWA.profileCoords = function() {
	var // lista de aldeias
		tr = document.getElementById( 'villages_list' ).getElementsByTagName( 'tr' ),
		coords = [],
		points,
		timeout;
	
	// faz o loop em todas aldeias
	for ( var i = 1; i < tr.length - 1; i++ ) {
		// pontos da aldeia
		points = Number( tr[ i ].getElementsByTagName( 'td' )[ 2 ].innerHTML.replace( '<span class="grey">.</span>', '' ) );
		
		// verifica se os pontos da aldeia passa pelo filtro de pontos maximos/minimos
		if ( points > TWA.settings._profilecoordsmin && points < TWA.settings._profilecoordsmax ) {
			// adiciona coordenada na lista
			coords.push( tr[ i ].getElementsByTagName( 'td' )[ 1 ].innerHTML );
		}
	}
	
	// adiciona opções e caixa de coordenadas
	jQuery( '#villages_list' ).before( '<table class="vis" id="twa-profilecoords" width="100%"><tr><th>' + lang.profilecoords.everycoords + '</th></tr><tr><td><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px">' + coords.join(' ') + '</textarea></td></tr><tr><td><label><input style="width:40px" name="_profilecoordsmin"/> ' + lang.profilecoords.min + '</label><br/><label><input style="width:40px" name="_profilecoordsmax"/> ' + lang.profilecoords.max + '</label></td></tr></table><br/>' );
	
	// faz o loop nas opções adicionando os valores de configuração atual
	jQuery( '#twa-profilecoords input ').each(function() {
		this.value = TWA.settings[ this.name ];
	
	// ao alterar os valores as configurações são salvas
	}).change(function() {
		var elem = this;
		
		clearTimeout( timeout );
		
		timeout = setTimeout(function () {
			TWA.settings[ elem.name ] = Number( elem.value );
			TWA.storage( true );
		}, 1000);
	});
};

TWA.profileGraphic = function() {
	// pega o id do jogador/tribo
	var id = location.search.match( /id=(\d+)/ )[ 1 ],
		// verifica se o perfil é de jogador ou tribo
		mode = game_data.screen === 'info_player' ? 'player' : 'tribe',
		// cria o url com o id do jogador e server
		url = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/',
		// url do grafico de pontos
		points = url + 'graph/p_' + mode + '/' + id,
		// url do grafico de oda
		oda = url + 'graph/oda_' + mode + '/' + id,
		// url do grafico de odd
		odd = url + 'graph/odd_' + mode + '/' + id,
		// html que será adiciona no perfil com os graficos
		html = '<table class="vis" width="100%" id="twa-graphic"><tr><th><a href="' + url + 'history/' + mode + '/' + id + '">' + lang.profilegraphic.stats + ' <img src="http://www.hhs.gov/web/images/exit_disclaimer.png"/></a></th></tr><tr><td style="text-align:center"><p><img src="' + points + '"/></p><img src="' + oda + '"/><p><img src="' + odd + '"/></p></td></tr></table>';
	
	mode === 'player'
		? jQuery( '.vis:not([id^=twa]):eq(2)' ).after( '<br/>' + html )
		: jQuery( '#content_value > table tr:first' ).append( '<td valign="top">' + html + '</td>' );
};

TWA.ready = function( callback ) {
	function success( builds, world, units ) {
		var args = arguments;
		
		if ( jQuery( '#hide_completed:checked', builds[ 0 ] ).length ) {
			return jQuery.post(jQuery( '#hide_completed', builds[ 0 ] ).attr( 'onclick' ).toString().split( "'" )[ 1 ], {
				hide_completed: false
			}, function() {
				success.apply( window, args );
			});
		}
		
		// loop em todos ativados no jogo
		jQuery( '#buildings a:has(img[src*=buildings])', builds[ 0 ] ).each(function() {
			// salva o nome na linguagem do servidor e universal
			TWA.data.builds[ jQuery( this ).text().trim() ] = this.href.match( /\=(\w+)$/ )[ 1 ];
		});
		
		// loop em todas configurações do jogo
		jQuery( 'config > *', world[ 0 ] ).each(function( i, elem ) {
			if ( i < 4 ) {
				TWA.data.world[ elem.nodeName ] = jQuery( elem ).text();
			} else {
				jQuery( '*', elem ).each(function () {
					TWA.data.world[ this.nodeName ] = Number( jQuery( this ).text() );
				});
			}
		});
		
		// loop em todas unidades ativadas do jogo
		jQuery( 'config > *', units[ 0 ] ).each(function() {
			if ( this.nodeName !== 'militia' ) {
				console.log();
				TWA.data.units[ this.nodeName ] = {
					speed: Math.round( Number( jQuery( 'speed', this ).text() ) * 24000 ),
					carry: Number( jQuery( 'carry', this ).text() ),
					pop: Number( jQuery( 'pop', this ).text() )
				};
			}
		});
		
		TWA.storage( true, null, 'data' );
		callback();
	}
	
	if ( !TWA.data.builds ) {
		TWA.data.builds = {};
		TWA.data.world = {};
		TWA.data.units = {};
		
		jQuery.when( jQuery.get( TWA.url( 'main' ) ), jQuery.get( 'interface.php?func=get_config' ), jQuery.get( 'interface.php?func=get_unit_info' ) ).done( success );
	} else {
		callback();
	}
};

TWA.rename = {
	init: function( expr, type, id ) {
		var elem = jQuery( expr );
		
		if ( expr !== '.overview_table' ) {
			elem = elem.parent();
		}
		
		elem.before( '<table class="vis" width="100%"><tr><th>' + lang.rename.rename + ' ' + type + ': <input type="text" id="twa-' + id + '" style="padding:1px 2px;border:1px solid red;border-radius:2px;border-radius:2px;height:15px"/> <input type="button" value="' + lang.rename.rename + '"/><label><input type="checkbox" id="twa-onlyselected"/> ' + lang.rename.only + ' ' + type + ' ' + lang.rename.selected + '</label> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr></table>' );
	},
	reports: function() {
		TWA.rename.init( '#report_list', lang.rename.report, 'reportrename' );
		
		TWA.rename._do({
			entry: '#twa-reportrename',
			input: '#report_list tr:not(:first, :last):visible input:not([type=checkbox])',
			inputChecked: '#report_list tr:not(:first, :last):visible:has(input:checked) input:not([type=checkbox])'
		});
	},
	commands: function() {
		TWA.rename.init('.overview_table', lang.rename.commands, 'commandrename', 'o');
		jQuery('.overview_table input[type=checkbox]').removeAttr('disabled');

		TWA.rename._do({
			entry: '#twa-commandrename',
			input: '.overview_table tr:not(:first, :last):visible input[id^=editInput]',
			inputChecked: '.overview_table tr:not(:first, :last):visible:has(input:checked) input[id^=editInput]'
		});
	},
	_do: function( o ) {
		function handle( go ) {
			if ( !this.val() || this.val().length < ( o.min || 1 ) || this.val().length > ( o.max || 255 ) ) {
				return this.css( 'border', '1px solid red' );
			} else {
				this.css( 'border', '1px solid silver' );
			}
			
			if ( !go ) {
				return;
			}
			
			jQuery( jQuery( '#twa-onlyselected:checked' ).length ? o.inputChecked : o.input ).val( this.val() ).next().click();
		}
		
		jQuery( o.entry ).keyup(function( event ) {
			handle.call( jQuery( this ), event.keyCode === 13 );
			return false;
		}).keypress(function( event ) {
			return event.keyCode !== 13;
		});
		
		jQuery( o.entry ).next().click(function () {
			handle.call( jQuery( this ).prev(), true );
		});
	}
};

TWA.renamevillages = {
	init: function() {
		$overviewTools.show().append( '<tr><td>' + lang.renamevillages.renamevillages + ': <input type="text" id="twa-renamevillages" style="padding:1px 2px;border:1px solid red;border-radius:2px;border-radius:2px;height:15px"/> <a href="http://code.google.com/p/tribalwars-scripts/wiki/Renomeador_de_Aldeias" target="_blank">(' + lang.renamevillages.mask + ')</a> <label><input type="checkbox" id="twa-onlyselected"/> ' + lang.renamevillages.onlySelected + '.</label></td></tr>');
		
		// ao digitar verifica se é possivel renomear, caso seja, altera a
		// cor da borda no input, caso precine "Enter" é renomeado as aldeias
		document.getElementById( 'twa-renamevillages' ).onkeyup = function( event ) {
			if ( !this.value || this.value.length < 3 ) {
				this.style.border = '1px solid red';
			}
			
			this.style.border = '1px solid silver';
			
			if ( event.keyCode === 13 ) {
				TWA.renamevillages.newname = this.value;
				TWA.renamevillages.prepare( document.getElementById( 'twa-onlyselected' ).checked );
				
				return false;
			}
		};
		
		// pega a chave "crsf" para poder ser usado na requisição de
		// renomear caso o usuario não seja premium
		jQuery.get(TWA.url( 'main' ), function( html ) {
			TWA.renamevillages.hkey = jQuery( 'form', html )[ 0 ].action.match( /h=(\w+)/ )[ 1 ];
		});
		
		// caso o jogador tenha premium, apenas adiciona a entrada para renomear todas aldeias
		if ( game_data.player.premium ) {
			TWA.renamevillages.mode = TWA.renamevillages.modes[ overview ];
		// caso não tenha premium...
		} else {
			// adiciona a opção de renomear aldeias individualmente
			TWA.renamevillages.individual();
			// pega o modo usado para usar na informações repassadas pelas mascaras ao renomear
			TWA.renamevillages.mode = TWA.renamevillages.modes.nopremium[ TWA.settings.overview ? TWA.settings._overviewmode : 'nooverview' ];
		}
	},
	// substitue as mascaras pelas informações corretas
	replace: function( name, elem ) {
		// {nome}, {nome()}, {nome( ... )}
		return name.replace(/\{([^}]+)\}/g, function( part, name ) {
			// pegas os dados dentro da mascara passado
			name = name.match(/([^(]+)(?:\s?\(([^)]+)\))?/);
			
			// nome da função passado pela mascara
			var fn = name[1].toLowerCase(),
				args = [];
			
			// verifica se foi passado argumentos
			if ( name[ 2 ] ) {
				// divide os argumentos pelas virgulas
				args = jQuery.trim( name[ 2 ] ).split( /\s*,\s*/ );
			}
			
			// verifica se a função passada existe nas funções que funcionam em qualquer modo
			if ( TWA.renamevillages.modes.all[ fn ] ) {
				return TWA.renamevillages.modes.all[ fn ].apply( this, args );
			// verifica se a função passada existe na lista de funções do modo atual
			} else if ( TWA.renamevillages.mode[ fn ] ) {
				return TWA.renamevillages.mode[ fn ].apply( jQuery( elem ), args );
			// caso não exista função a passada retorna a mascara inteira
			} else {
				return part;
			}
		});
	},
	prepare: function( selected ) {
		var elems = jQuery( '.overview_table tr[class]' + ( selected ? ':has(.addcheckbox:checked)' : '' ) ).get(),
			index = overview === 'groups' ? 3 : 2,
			elem,
			name,
			vid;
		
		for ( var i = 0; i < elems.length; i++ ) {
			vid = elems[ i ].getElementsByTagName( 'span' )[ 0 ].id.split( '_' )[ 1 ];
			// substitue as mascaras
			name = TWA.renamevillages.replace( TWA.renamevillages.newname, elems[ i ] );
			// chama função para renomear a aldeia
			TWA.renamevillages.rename( vid, name );
		}
	},
	rename: function( vid, name ) {
		// envia requisição ajax para renomear a aldeia
		jQuery.post(TWA.url( 'main&action=change_name&h=' + TWA.renamevillages.hkey, vid ), { name: name }, function( html ) {
			// pega o id da aldeia
			var vid = this.url.match( /village=(\d+)/ )[ 1 ],
				elem = document.getElementById( 'label_text_' + vid );
			
			elem.innerHTML = name + elem.innerHTML.match( /\s\(\d+\|\d+\)\s\w+$/ )[ 0 ];
		});
	},
	individual: function() {
		// pega todas as aldeias da tabela
		var elems = jQuery( '.overview_table tr[class]' ).get(),
			vid,
			span;
		
		for ( var i = 0; i < elems.length; i++ ) {
			span = elems[ i ].getElementsByTagName( 'span' )[ 0 ];
			// id da aldeia
			vid = span.id.split( '_' )[ 1 ];
			
			// ao clicar no botão de renomear, renomeia
			elems[ i ].getElementsByTagName( 'input' )[ 1 ].onclick = function() {
				if ( game_data.player.premium ) {
					var elem = document.getElementById( 'edit_input_' + vid );
					
					elem.value = TWA.renamevillages.replace( elem.value, elems[ i ] );
					elem.nextElementSibling.click();
				} else {
					TWA.renamevillages.rename( vid, TWA.renamevillages.replace( document.getElementById( 'edit_input_' + vid ).value, elems[ i ] ) );
					
					document.getElementById( 'edit_' + vid ).style.display = 'none';
					document.getElementById( 'label_' + vid ).style.display = '';
				}
			};
			
			// cria o icone para clicar e mostrar o campo para pesquisa
			jQuery( '<a>' ).addClass( 'rename-icon' ).click(function() {
				document.getElementById( 'edit_' + vid ).style.display = '';
				document.getElementById( 'label_' + vid ).style.display = 'none';
			}).appendTo( span );
		}
	},
	modes: {
		// funções usadas em visualização sem conta premium
		nopremium: {
			// funções usadas na visualização basica do jogo
			nooverview: {
				points: function() { return this.find( 'td:eq(2)' ).text(); },
				wood: function() { return this.find( 'td:eq(3)' ).text().split( ' ' )[ 0 ]; },
				stone: function() { return this.find( 'td:eq(3)' ).text().split( ' ' )[ 1 ]; },
				iron: function() { return this.find( 'td:eq(3)' ).text().split( ' ' )[ 2 ]; },
				storage: function() { return this.find( 'td:eq(4)' ).text(); },
				farmused: function() { return this.find( 'td:eq(5)' ).text().split( '/' )[ 0 ]; },
				farmtotal: function() { return this.find( 'td:eq(5)' ).text().split( '/' )[ 1 ]; },
				current: function() { return jQuery.trim( this.find( 'td:first' ).text() ).match( /(.*) \(\d+\|\d+\)\s\w{3}.?$/ )[ 1 ]; },
				x: function() { return jQuery.trim( this.find( 'td:eq(1)' ).text() ).match( /.* \((\d+)\|\d+\)\s\w{3}.?$/ )[ 1 ]; },
				y: function() { return jQuery.trim( this.find( 'td:eq(1)' ).text() ).match( /.* \(\d+\|(\d+)\)\s\w{3}.?$/ )[ 1 ]; }
			},
			// funções usadas na visualização Produção do proprio script
			production: {
				points: function() { return this.find( 'td:eq(1) span:last' ).text().split( ' ' )[ 0 ]; },
				wood: function() { return this.find( 'td:eq(2)' ).text(); },
				stone: function() { return this.find( 'td:eq(3)' ).text(); },
				iron: function() { return this.find( 'td:eq(4)' ).text(); },
				storage: function() { return this.find( 'td:eq(5)' ).text(); },
				farmused: function() { return this.find( 'td:eq(1) span:last' ).html().match( /\((\d+)/ )[ 1 ]; },
				farmtotal: function() { return this.find( 'td:eq(1) span:last' ).html().match( /\/(\d+)\)/ )[ 1 ]; },
				current: function() { return $.trim(this.find( 'td:eq(1) a:first' ).text()).match( /(.*) \(\d+\|\d+\)\s\w{3}.?$/ )[ 1 ] },
				x: function() { return $.trim(this.find( 'td:eq(1) a:first' ).text()).match( /.* \((\d+)\|\d+\)\s\w{3}.?$/ )[ 1 ]; },
				y: function() { return $.trim(this.find( 'td:eq(1) a:first' ).text()).match( /.* \(\d+\|(\d+)\)\s\w{3}.?$/ )[ 1 ]; }
			},
			// funções usadas na visualização Combinada do proprio script
			combined: {
				points: function() { return this.find( 'td:eq(1) span:last' ).text().split( ' ' )[ 0 ]; },
				farmused: function() { return this.find( 'td:eq(7) a' ).text().split( '/' )[ 0 ]; },
				farmtotal: function() { return this.find( 'td:eq(7) a' ).text().split( '/' )[ 1 ]; },
				current: function() { return jQuery.trim( this.find( 'td:eq(1) a:first' ).text() ).match( /(.*) \(\d+\|\d+\)\s\w{3}.?$/ )[ 1 ] },
				x: function() { return jQuery.trim( this.find( 'td:eq(1) a:first' ).text() ).match( /.* \((\d+)\|\d+\)\s\w{3}.?$/ )[ 1 ]; },
				y: function() { return jQuery.trim( this.find( 'td:eq(1) a:first' ).text() ).match( /.* \(\d+\|(\d+)\)\s\w{3}.?$/ )[ 1 ]; },
				unit: function( unit ) {
					if ( !TWA.data.units[ unit ] ) {
						UI.ErrorMessage( 'Renomeador de Aldeias - Argumento inválido: {unit(' + unit + ')} Correto: {unit(UNIDADE)}' );
						return '{unit(ERROR)}';
					}
					
					var index = TWA.renamevillages.modes.nopremium.combined.unit.cache;
					
					if ( !index ) {
						index = {};
						
						jQuery( '.overview_table tr:first th' ).each(function( i ) {
							var img = jQuery( 'img[src*=unit_]', this );
							
							if ( img.length ) {
								index[ img[ 0 ].src.match( /unit_(\w+)\./)[ 1 ] ] = i;
							}
						});
						
						TWA.renamevillages.modes.nopremium.combined.unit.cache = index;
					}
					
					return this[ 0 ].getElementsByTagName( 'td' )[ index[ unit ] ].innerHTML;
				}
			}
		},
		// funções que podem ser usadas em qualquer modo
		all: {
			random: function( min, max ) {
				min = Number( min || 0 );
				max = Number( max || 10000 );
				
				if ( isNaN( min ) || isNaN( max ) ) {
					UI.ErrorMessage( lang.renamevillages.renamevillages + ' - ' + lang.renamevillages.argumentError + ': {random(' + min + ', ' + max + ')} ' + lang.renamevillages.correct + ': {random( NUM, NUM )}' );
					return '{random(ERROR)}';
				}
				
				return Math.floor( Math.random() * ( max - min + 1 ) + min );
			}
		}
	}
};

TWA.reportCalc = function() {
	var remove = { spy: true, catapult: true, ram: true, snob: true },
		necessaryUnits = {},
		options = TWA.settings._reportcalc,
		attackButton;
	
	// caso não tenha executado a função antes...
	if ( !document.getElementById( 'twaReportCalc' ) ) {
		Style.add('reportCalc', {
			'#twaReportCalc': { width: 475, background: '#eee', 'border-radius': 4, border: '1px solid rgba(0,0,0,0.2)', 'margin-bottom': 15 },
			'#twaReportCalc td': { 'text-align': 'center' },
			'#twa-spy, #twa-ram': { width: 30, 'text-align': 'center' },
			'.twaUnits': { margin: '-1px -2px -2px' },
			'#twa-attack': { display: 'none' },
			'#twa-results td': { border: '1px solid #ddd', 'border-radius': 5, background: '#fff', height: 20 }
		});
		
		var inputs = '',
			unitsAttack = '',
			colspan = 0;
		
		for ( var name in TWA.data.units ) {
			if ( !remove[ name ] ) {
				colspan++;
				inputs += '<td><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input type="checkbox" class="twaUnits" unit="' + name + '" ' + ( options.actives.indexOf( name ) >= 0 ? 'checked="true"' : '' ) + '/></td>';
				unitsAttack += '<td name="' + name + '"></td>';
			}
		}
		
		jQuery( 'table[width=470]' ).before( ( '<div id="twaReportCalc"><table class="twa-table"><tr><th colspan="__colspan">' + lang.reportcalc.unitscalc + '</th></tr><tr><td style="text-align:left" colspan="__colspan"><label><input type="checkbox" id="twa-currentVillage"> ' + lang.reportcalc.currentvillage + '</label></td></tr><tr><td style="text-align:left" colspan="__colspan"><label><input class="twaInput" id="twa-spy" value="' + this.settings._reportcalc.spy + '"/> ' + lang.reportcalc.sendSpy + '.</label></td></tr><tr><td style="text-align:left" colspan="__colspan"><label><input class="twaInput" id="twa-ram" value="' + this.settings._reportcalc.ram + '"/> ' + lang.reportcalc.sendRam + '.</label></td></tr><tr>__inputs</tr><tr id="twa-results">__unitsAttack</tr></table><div style="margin:5px"><a href="#" id="twa-attack">» ' + lang.reportcalc.attack + '</a></div></div>' ).replace( '__inputs', inputs ).replace( '__unitsAttack', unitsAttack ).replace( /__colspan/g, colspan ) );
		
		attackButton = jQuery( '#twa-attack' );
		
		// ao alterar as opções executa a função novamente com os novos paramentros
		jQuery( '.twaUnits, #twa-spy, #twa-ram, #twa-currentVillage' ).change(function() {
			if ( this.id === 'twa-spy' ) {
				options.spy = isNaN( this.value ) ? 0 : Number( this.value );
			} else if ( this.id === 'twa-ram' ) {
				options.ram = isNaN( this.value ) ? 0 : Number( this.value );
			} else if ( this.id === 'twa-currentVillage' ) {
				options.currentVillage = this.checked;
			} else {
				options.actives = [];
				
				jQuery( '.twaUnits:checked' ).each(function() {
					options.actives.push( this.getAttribute( 'unit' ) );
				});
			}
			
			TWA.settings._reportcalc = options;
			TWA.storage( true );
			attackButton.hide();
			TWA.reportCalc();
		});
		
		// ao clicar no botão para enviar ataque...
		attackButton.click(function() {
			jQuery.post(TWA.url( 'place&try=confirm', vid ), jQuery.extend({
				x: coords[ 0 ],
				y: coords[ 1 ],
				attack: true
			}, necessaryUnits), function( html ) {
				var error = jQuery( '#error', html );
				
				// caso tenha algum erro no ataque...
				if ( error.text() ) {
					return alert( lang.reportcalc.error + ' ' + error.text() );
				}
				
				var form = jQuery( 'form', html );
				
				// confirma o ataque e envia
				jQuery.post(form[ 0 ].action, form.serialize(), function() {
					alert( lang.reportcalc.success );
				});
			});
			
			return false;
		});
	} else {
		attackButton = jQuery( '#twa-attack' );
	}
	
	jQuery( '#twa-results td' ).html( '' );
	
	var necessary2farm = 0,
	// recursos descobertos na aldeia
	discovery = jQuery( '#attack_spy tr:first td' ).text().trim().replace( /\./g, '' ).split( '  ' ),
	// leveis dos edificios da aldeia
	buildsLvl = jQuery( '#attack_spy tr:eq(1) td:last' ).text().replace( /\t/g, '' ).split( '\n' ),
	builds = {};
	buildsLvl = buildsLvl.splice( 1, buildsLvl.length - 2 );
	
	for ( var i = 0; i < buildsLvl.length; i++ ) {
		var build = buildsLvl[ i ].split( /\s\(/ ),
			level = build[ 1 ].match( /\d+/ );
		
		builds[ TWA.data.builds[ build[ 0 ] ] ] = Number( level );
	}
	
	// calcula o tanto que o esconderijo protege
	var hideSize = builds.hide === 0 ? 0 : Math.round( 150 * Math.pow( 40 / 3, ( builds.hide - 1 ) / 9 ) ),
	// calcula o tamanho do armazem
	storageSize = ( builds.storage === 0 ? 1000 : Math.round( 1000 * Math.pow( 400, ( builds.storage - 1 ) / 29 ) ) ),
	// coordenadas da aldeia atacante
	attCoords = jQuery( '#attack_info_att tr:eq(1) a' ).text().match( /\s\((\d+)\|(\d+)\)\s\w+$/ ),
	// coordenadas da aldeia que será farmada
	defCoords = jQuery( '#attack_info_def tr:eq(1) a' ).text().match( /\s\((\d+)\|(\d+)\)\s\w+$/ ),
	// calcula a distancia entre as aldeias
	distance = Math.sqrt( Math.pow( Number( attCoords[ 1 ] ) - Number( defCoords[ 1 ] ), 2 ) + Math.pow( Number( attCoords[ 2 ] ) - Number( defCoords[ 2 ] ), 2 ) ),
	// leveis das minas
	resLvl = [ builds.wood || 0, builds.stone || 0, builds.iron || 0 ],
	farthest = 0;
	
	// calcula o tempo que as tropas levariam para chegar na aldeia
	for ( var i = 0; i < options.actives.length; i++ ) {
		if ( TWA.data.units[ options.actives[ i ] ] ) {
			var time = Math.round( TWA.data.units[ options.actives[ i ] ].speed * ( distance / TWA.data.world.unit_speed ) / TWA.data.world.speed );
			
			if ( time > farthest ) {
				farthest = time;
			}
		}
	}
	
	// calcula a quantidade de recursos que a aldeia produzira enquanto as tropas chegam
	discovery.map(function( item, i ) {
		var prod = ( resLvl[ i ] === 0 ? 5 * TWA.data.world.speed : Math.round( 30 * Math.pow( 80, ( resLvl[ i ] - 1 ) / 29 ) ) * TWA.data.world.speed ) / 3600;
		
		item = Number( item ) + ( farthest * prod );
		if ( item > storageSize ) {
			item = storageSize;
		}
		necessary2farm += item;
	});
	
	necessary2farm -= hideSize;
	
	// id do jogador atacante
	var attpid = jQuery( '#attack_info_att a:first' ).attr( 'href' ).match( /id=(\d+)/ )[ 1 ],
	// id da aldeia atacante
	attvid = jQuery( '#attack_info_att tr:eq(1) a' ).attr( 'href' ).match( /id=(\d+)/ )[ 1 ],
	// coordenadas da aldeia atacante
	coords = jQuery( '#attack_info_def a[href*=info_village]' ).text().match( /.*\((\d+)\|(\d+)\)\sK\d{1,2}/ ).slice( 1, 3 ),
	vid = game_data.village.id,
	showButton = false;
	
	// se o atacante for voce mesmo...
	if ( attpid === game_data.player.id ) {
		// caso esteja para atacar a aldeia atual, ira seleciona-la, se não, usará a aldeia atacante para atacar novamente
		vid = jQuery( '#twa-currentVillage:checked' ).length ? game_data.village.id : attvid;
	}
	
	// carrega a pagina do praça de reunião para obter as tropas atuais da aldeia
	jQuery.get(this.url( 'place', vid ), function( html ) {
		var units = {};
		
		// pega a quantidade de unidades
		for ( var unit in TWA.data.units ) {
			units[ unit ] = Number( jQuery( '[name=' + unit + ']', html ).next().text().match( /\d+/ )[ 0 ] );
		}
		
		// faz o loop em todas unidades que podem ser usadas para farmar
		for ( var i = 0; i < TWA.settings._reportcalc.actives.length; i++ ) {
			// nome da unidade
			var unit = TWA.settings._reportcalc.actives[ i ],
			// capacidade de farm da unidade
			carry = TWA.data.units[ unit ].carry,
			// capacidade que todas unidades juntas podem farmar
			carryLimit = units[ unit ] * carry;
			
			// caso possa farmar alguma coisa...
			if ( carryLimit ) {
				showButton = true;
				
				// se as unidades podem farmar mais do que é preciso...
				if ( carryLimit >= necessary2farm ) {
					// calcula quantas unidades são necessarias para farmar 100% e pula para a etapa de enviar o ataque
					necessaryUnits[ unit ] = Math.ceil( necessary2farm / carry );
					
					break;
				// se não há unidades sulficientes para farmar tudo...
				} else {
					// adiciona todas as unidades
					necessaryUnits[ unit ] = units[ unit ];
					// reduz a quantidade de unidades necessarias para calcular com a proxima unidade...
					necessary2farm -= carryLimit;
				}
			}
		}
		
		if ( showButton ) {
			for ( var unit in necessaryUnits ) {
				document.getElementsByName( unit )[ 0 ].innerHTML = necessaryUnits[ unit ];
			}
			
			if ( options.ram && units.ram >= options.ram ) {
				necessaryUnits.ram = options.ram;
			}
			
			if ( options.spy && units.spy >= options.spy ) {
				necessaryUnits.spy = options.spy;
			}
			
			attackButton.show();
		} else {
			attackButton.hide();
		}
	});
};

TWA.reportFilter = function() {
	jQuery( '#report_list' ).before( '<table class="vis" width="100%"><tr><th>' + lang.reportfilter.search + ' <input type="text" id="twa-reportfinder" style="padding:1px 2px;border:1px solid silver;border-radius:2px;height:15px"/></th></tr></table>' );
	
	jQuery( '#twa-reportfinder' ).keyup(function() {
		var param = this.value.toLowerCase();
		
		jQuery( '#report_list tr:not(:first, :last)' ).each(function() {
			this.style.display = jQuery( this ).text().toLowerCase().indexOf( param ) < 0 ? 'none' : 'block';
		});
	});
	
	selectAll = function( form, checked ) {
		jQuery( '#report_list tr:not(:first, :last):visible input[type=checkbox]' ).attr( 'checked', checked );
	};
};

TWA.research = {
	init: function() {
		jQuery( '.overview_table' ).before( '<table class="vis" width="100%" id="twa-research"><tr><th>' + lang.research.help + ' <a href="#" id="twa-research-cancel">» ' + lang.research.cancel + '</a></th></tr></table>' );
		
		jQuery( '#twa-research-cancel' ).click(function() {
			if ( confirm( lang.research.confirmcancel ) ) {
				TWA.research.cancel();
			}
			
			return false;
		});
		
		jQuery( '#techs_table tr:first a:has(img)' ).click(function() {
			return TWA.research._do( this.href.match( /order=(\w+)/ )[ 1 ] );
		});
	},
	_do: function( unit ) {
		var villages = document.getElementById( 'techs_table' ).getElementsByTagName( 'tr' );
		
		for ( var i = 1; i < villages.length; i++ ) {
			var vid = villages[ i ].id.split( '_' )[ 1 ];
			
			if ( document.getElementById( vid + '_' + unit ) ) {
				jQuery.ajax({
					type: 'post',
					url: TechOverview.urls.ajax_research_link.replace( /village=\d+/, 'village=' + vid ),
					data: { tech_id: unit },
					dataType: 'json',
					vid: vid,
					success: function( complete ) {
						if ( complete.success ) {
							document.getElementById( 'village_tech_order_' + this.vid ).innerHTML = complete.tech_order;
							TechOverview.change_dot( jQuery( '#' + this.vid + '_' + unit ), this.vid, unit, 'brown' );
							
							if ( game_data.village.id == this.vid ) {
								jQuery( '#wood' ).html( complete.resources[ 0 ] );
								jQuery( '#stone' ).html( complete.resources[ 1 ] );
								jQuery( '#iron' ).html( complete.resources[ 2 ] );
								startTimer();
							}
						}
					}
				});
			}
		}
		
		return false;
	},
	cancel: function() {
		jQuery( '#techs_table div.tech-cancel-icon img' ).each(function() {
			var data = this.onclick.toString().match( /cancel_research_order\((\d+), (\d+), '(\w+)'\)/ );
			
			jQuery.ajax({
				url: TechOverview.urls.ajax_cancel_tech_order_link.replace( /village=\d+/, 'village=' + data[ 1 ] ),
				dataType: 'json',
				type: 'post',
				data: { tech_order_id: data[ 2 ] },
				name: data[ 3 ],
				vid: data[ 1 ],
				success: function( complete ) {
					if ( complete.success ) {
						document.getElementById( 'village_tech_order_' + this.vid ).innerHTML = complete.tech_order;
						TechOverview.restore_dot( this.vid, this.name );
					}
				}
			});
		});
	}
};

TWA.selectVillages = {
	init: function() {
		// todos os modos
		var modes = TWA.selectVillages.modes;
			ready = false;
		
		// verifica se tem existe algum filtro para o visualização atual
		for ( var name in modes ) {
			if ( overview === modes[ name ][ 0 ] ) {
				ready = true;
			}
		}
		
		// caso tenha, adiciona o menu com as opções
		if ( ready ) {
			jQuery( '#twa-overviewtools' ).show().append( '<tr><td>' + lang.selectvillages.selectvillages + ' <span id="twa-selectvillages"></span></td></tr>' );
		}
		
		// pega a ordem das unidades
		jQuery( '#combined_table tr:first th:has(img[src*="unit/unit"]) img' ).each(function() {
			TWA.selectVillages.tools.unitsorder.push( this.src.match( /unit_(\w+)/ )[ 1 ] );
		});
		
		// executa todos os fitros possiveis para a visualização atual
		for ( var name in modes ) {
			if ( overview === modes[ name ][ 0 ] ) {
				modes[ name ][ 1 ]();
			}
		}
	},
	modes: {
		// seleciona aldeias com tropas de ataque
		unitsattack: ['combined', function() {
			// todas as aldeias da tabela
			var villages = jQuery( '#combined_table tr:gt(0)' );
			
			// cria o checkbox
			// ao alterar seleciona/deseleciona as aldeias com ataque
			jQuery( '<input type="checkbox" id="twa-selectvillages-unitsattack"/>' ).change(function() {
				var i,
					units,
					popatt,
					popdef;
				
				// loop em todas aldeias
				for( i = 0; i < villages.length; i++) {
					// pega todas unidades da aldeia
					units = TWA.selectVillages.tools.getunits( villages[ i ] );
					// pega a quantidade de tropas de ataque da aldeias
					popatt = TWA.selectVillages.tools.getpop( 'att', units );
					// pega a quantidade de tropas de defesa da aldeias
					popdef = TWA.selectVillages.tools.getpop( 'def', units );
					
					if ( popatt > popdef ) {
						jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
					}
				}
			// adiciona label ao checkbox e envia elementos para o menu
			}).add( ' <label for="twa-selectvillages-unitsattack">' + lang.selectvillages.unitsattack + '</label>' ).appendTo( '#twa-selectvillages' );
		}],
		unitsdefence: ['combined', function() {
			// todas as aldeias da tabela
			var villages = jQuery( '#combined_table tr:gt(0)' );
			
			// cria o checkbox
			// ao alterar seleciona/deseleciona as aldeias com defesa
			jQuery( '<input type="checkbox" id="twa-selectvillages-unitsdefence"/>' ).change(function() {
				var i,
					units,
					popatt,
					popdef;
				
				// loop em todas aldeias
				for( i = 0; i < villages.length; i++) {
					// pega todas unidades da aldeia
					units = TWA.selectVillages.tools.getunits( villages[ i ] );
					// pega a quantidade de tropas de ataque da aldeias
					popatt = TWA.selectVillages.tools.getpop( 'att', units );
					// pega a quantidade de tropas de defesa da aldeias
					popdef = TWA.selectVillages.tools.getpop( 'def', units );
					
					if ( popatt < popdef ) {
						jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
					}
				}
			// adiciona label ao checkbox e envia elementos para o menu
			}).add( ' <label for="twa-selectvillages-unitsdefence">' + lang.selectvillages.unitsdefence + '</label>' ).appendTo( '#twa-selectvillages' );
		}],
		unitsnob: ['combined', function() {
			// todas as aldeias da tabela
			var villages = jQuery( '#combined_table tr:not(:first)' );
			
			// cria o checkbox
			// ao alterar seleciona/deseleciona as aldeias com nobres
			jQuery( '<input type="checkbox" id="twa-selectvillages-unitsnob">' ).change(function() {
				var units,
					i;
				
				// loop em todas aldeias
				for ( i = 0; i < villages.length; i++ ) {
					// pega todas unidades da aldeia
					units = TWA.selectVillages.tools.getunits( villages[ i ] );
					
					// verifica se tem nobres na aldeia, se tiver, seleciona
					if ( units.snob > 0 ) {
						jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
					}
				}
			// adiciona label ao checkbox e envia elementos para o menu
			}).add( ' <label for="twa-selectvillages-unitsnob">' + lang.selectvillages.unitsnob + '</label>' ).appendTo( '#twa-selectvillages' );
		}]
	},
	tools: {
		// pega todas tropas da aldeia
		getunits: function( village ) {
			var elems = jQuery('.unit-item', village),
				units = {};
			
			elems = elems.add(elems.next().last());
			
			for ( var i = 0; i < TWA.selectVillages.tools.unitsorder.length; i++ ) {
				units[ TWA.selectVillages.tools.unitsorder[ i ] ] = Number( elems.eq( i ).text() );
			}
			
			return units;
		},
		// pega a população usada pegas unidades passadas
		getpop: function( type, units ) {
			var pop = 0,
				unit,
				i = 0;
			
			switch( type ) {
				case 'att':
					for ( ; i < TWA.selectVillages.tools.unitsatt.length; i++ ) {
						unit = TWA.selectVillages.tools.unitsatt[ i ];
						
						if ( TWA.data.units[ unit ] ) {
							pop += units[ unit ] * TWA.data.units[ unit ].pop;
						}
					}
				break;
				case 'def':
					for ( ; i < TWA.selectVillages.tools.unitsdef.length; i++ ) {
						unit = TWA.selectVillages.tools.unitsdef[ i ];
						
						if ( TWA.data.units[ unit ] ) {
							pop += units[ unit ] * TWA.data.units[ unit ].pop;
						}
					}
				break;
				case 'all':
					for ( i in units ) {
						if ( TWA.data.units[ units[ i ] ] ) {
							pop += units[ i ] * TWA.data.units[ units[ i ] ].pop;
						}
					}
				break;
			}
			
			return pop;
		},
		unitsatt: [ 'axe', 'light', 'marcher', 'ram', 'catapult', 'knight' ],
		unitsdef: [ 'spear', 'sword', 'archer', 'heavy' ],
		unitsorder: []
	}
};

TWA.storage = function( props, value, type ) {
	var name = type ? memory[ type ] : memory.settings;
	type = type ? 'data' : 'settings';
	
	if ( props === true ) {
		localStorage[ name ] = JSON.stringify( TWA[ type ] );
	} else if ( typeof props === 'string' ) {
		if ( !value ) {
			return TWA[ type ][ props ];
		} else {
			TWA[ type ][ props ] = value;
			localStorage[ name ] = JSON.stringify( TWA[ type ] );
			
			return value;
		}
	}
	
	return true;
};

TWA.tooltipGraphic = function() {
	jQuery( '<input type="hidden" id="twa-tooltipgraphic" />' ).appendTo( 'body' );
	
	jQuery( '#content_value a[href*=info_player], #content_value a[href*=info_ally]' ).each(function() {
		if ( /id=\d+/.test( this.href ) ) {
			var src = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/graph/p_' + ( /info_player/.test( this.href ) ? 'player' : 'tribe' ) + '/' + this.href.match( /id=(\d+)/ )[ 1 ];
			
			new Image().src = src;
			this.setAttribute( 'tooltip', '<img src="' + src + '">' );
			
			jQuery.tooltip( this );
		}
	});
};

TWA.troopCounter = function() {
	jQuery( '#units_table' ).after( '<table id="twa-troopcounter" class="vis" style="width:100%;margin:0 auto"><thead>' + jQuery( '#units_table thead' ).html() + '</thead><tbody>' + jQuery( '#units_table tbody:first' ).html() + '</tbody></table>' );
	
	var units = {},
		table = document.getElementById( 'twa-troopcounter' ),
		img = document.getElementById( 'units_table' ).getElementsByTagName( 'tr' )[ 0 ].getElementsByTagName( 'img' ),
		tbody = document.getElementById( 'units_table' ).getElementsByTagName( 'tbody' ),
		mytr = table.getElementsByTagName( 'tbody' )[ 0 ].getElementsByTagName( 'tr' );
	
	for ( var i = 0; i < img.length; i++ ) {
		units[ img[ i ].src.match( /_(\w+)\.png/ )[ 1 ] ] = [
			[ i + 2, 0 ],
			[ i + 1, 0 ],
			[ i + 1, 0 ],
			[ i + 1, 0 ]
		];
	}
	
	for ( var i = 0; i < tbody.length; i++ ) {
		var tr = tbody[ i ].getElementsByTagName( 'tr' );
		
		for ( var j = 0; j < tr.length; j++ ) {
			for ( var name in units ) {
				units[ name ][ j ][ 1 ] += Number( tr[ j ].getElementsByTagName( 'td' )[ units[ name ][ j ][ 0 ] ].innerHTML );
			}
		}
	}
	
	jQuery( 'td:first', table ).empty().width( jQuery( '#units_table td:first' ).width() );
	jQuery( 'th:first', table ).html( 'Contagem de Tropas:' );
	jQuery( 'th:last, td:has(a)', table ).remove();
	
	for ( var i = 0; i < mytr.length; i++ ) {
		for ( var name in units ) {
			var td = mytr[ i ].getElementsByTagName( 'td' )[ units[ name ][ i ][ 0 ] ];
			
			td.className = 'unit-item' + ( units[ name ][ i ][ 1 ] == 0 ? ' hidden' : '' );
			td.innerHTML = units[ name ][ i ][ 1 ];
		}
	}
};

TWA.url = function( screen, vid ) {
	return game_data.link_base_pure.replace( /village=\d+/, 'village=' + ( vid || game_data.village.id ) ) + screen;
};

TWA.villageFilter = function() {
	var villagesExpr = '.overview_table tr:not(:first)';
	var nameExpr = 'span[id^=label_text]';
	var timeout;
	
	if ( overview === 'units' ) {
		villagesExpr = '.overview_table tbody';
	} else if ( overview === 'commands' || overview === 'incomings' ) {
		villagesExpr = '.overview_table tr.nowrap';
		nameExpr = 'span[id^=labelText]';
	}
	
	var villages = jQuery( villagesExpr ).get();
	
	jQuery( '#twa-overviewtools' ).show().append( '<tr><td>' + lang.villagefilter.search + ' <input type="text" id="twa-villagefilter" style="padding:1px 2px;border:1px solid silver;border-radius:2px;height:15px"/></td></tr>' );
	
	jQuery( '#twa-villagefilter' ).keyup(function () {
		var param = this.value.toLowerCase();
		
		clearTimeout( timeout );
		
		timeout = setTimeout(function() {
			for ( var i = 0; i < villages.length; i++ ) {
				villages[ i ].style.display = villages[ i ].getElementsByTagName( 'span' )[ 1 ].innerHTML.toLowerCase().indexOf( param ) < 0 ? 'none' : '';
			}
		}, 200);
	});
	
	selectAll = function( form, checked ) {
		jQuery( '.overview_table tr.nowrap:visible input[type=checkbox]' ).attr( 'checked', checked );
	};
};


// remove um item de um array
Array.prototype.remove = function( from, to ) {
	var rest = this.slice( ( to || from ) + 1 || this.length );
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply( this, rest );
};

// furmata um numero de milesimos para hh:mm:ss
Number.prototype.format = function() {
	var hours = Math.floor( this / 36E5 ),
		min = Math.floor( this / 6E4 ) % 60,
		sec = ( this / 1000 ) % 60,
		str = hours + ':';
	
	if ( min < 10 ) {
		str += '0';
	}
	
	str += min + ':';
	
	if ( sec < 10 ) {
		str += '0';
	}
	
	return str += sec;
};

// substitue partes do string pelos argumentos passados
String.prototype.springf = function() {
	var args = arguments;
	
	return this.replace(/{(\d+)}/g, function( match, number ) {
		return typeof args[ number ] != 'undefined' ? args[ number ] : match;
	});
};

// permite apenas numeros, barras, espaços
jQuery.fn.onlyNumbers = function( type ) {
	return this.keydown(function( e ) {
		var key = e.charCode || e.keyCode || 0;
		
		if ( e.ctrlKey ) {
			return true;
		}
		
		return ( key == 8 || key == 9 || key == 46 || key == 32 || ( type === 'coords' && e.shiftKey && key == 226 ) || ( key >= 37 && key <= 40 ) || ( key >= 48 && key <= 57 ) || ( key >= 96 && key <= 105 ) );
	});
};

// adiciona um tooltip a um elemento que tem o atributo "tooltip"
jQuery.fn.tooltip = jQuery.tooltip = function( elems ) {
	( this.jquery ? this : jQuery( elems ) ).hover(function( e ) {
		$tooltip.html( this.getAttribute( 'tooltip' ) );
		$tooltip.css({ top: e.pageY + 25, left: e.pageX + 15 }).show();
	}, function() {
		$tooltip.hide();
	}).mousemove(function( e ) {
		$tooltip.css({
			top: event.pageY + 25,
			left: event.pageX + 15
		});
	});
};

// facilita criar strings que vão arrays inteiros no meio
function createStringList( start, object, springf, key ) {
	var str = start || '', i, n, val;
	
	if ( object.length ) {
		for ( i = 0; i < object.length; i++ ) {
			str += springf ? springf.springf( object[ i ] ) : object[ i ];
		}
	} else {
		for ( n in object ) {
			val = key ? n : object[ n ];
			str += springf ? springf.springf( val ) : val;
		}
	}
	
	return str;
}

// extrai os elementos apartir de uma string
function buildFragment( html ) {
	var elem = document.createElement( 'div' );
	elem.innerHTML = html;
	
	return elem.firstElementChild;
}

// pega os milesegundos de um tempo formatado
function formatToTime( _date, _time ) {
	var data, date;
	
	if ( _time ) {
		date = _date.split( '/' );
	} else {
		data = _date.split( ' ' );
		date = data[ 1 ].split( '/' );
	}
	
	return new Date( date[ 1 ] + '/' + date[ 0 ] + '/' + date[ 2 ] + ' ' + ( _time || data[ 0 ] ) ).getTime();
}

// formata o tempo (milisegundos)
function timeFormat( value ) {
	var date = new Date( value ),
	hour = date.getHours(),
	min = date.getMinutes(),
	sec = date.getSeconds(),
	day = date.getDate(),
	month = date.getMonth() + 1,
	year = date.getFullYear(),
	units = [];
	
	hour = hour < 10 ? '0' + hour : hour;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;
	day = day < 10 ? '0' + day : day;
	month = month < 10 ? '0' + month : month;
	
	return hour + ':' + min + ':' + sec + ' ' + day + '/' + month + '/' + year;
}

// verifica se um tempo é maior que o tempo atual do jogo
function validTime( dateTime ) {
	var valid = false;
	
	if ( /^\d+\:\d+\:\d+\s\d+\/\d+\/\d{4}$/.test( dateTime ) ) {
		var data = dateTime.split( ' ' ),
			inputDate = data[ 1 ].split( '/' ),
			currentDate = $serverDate.text().split( '/' );
		
		valid = ( new Date( inputDate[ 1 ] + '/' + inputDate[ 0 ] + '/' + inputDate[ 2 ] + ' ' + data[ 0 ] ) ) > ( new Date( currentDate[ 1 ] + '/' + currentDate[ 0 ] + '/' + currentDate[ 2 ] + ' ' + $serverTime.text() ) );
	}
	
	return valid;
}

// manipulado de estilos css
var Style = (function() {
	var rspecial = /^-special-/,
		special = jQuery.browser.mozilla ? '-moz-' : jQuery.browser.webkit ? '-webkit-' : jQuery.browser.opera ? '-o-' : '';
	
	function Style() {
		this._styles = {};
		return this;
	}
	
	Style.prototype = {
		add: function( name, css ) {
			if ( this._styles[ name ] ) {
				this._styles[ name ].css = jQuery.extend( this._styles[ name ].css, this.compatibility( css ) );
				this._styles[ name ].elem.html( this.stringfy( this._styles[ name ].css ) );
				return this;
			} else {
				this._styles[ name ] = {};
				this._styles[ name ].css = this.compatibility( css );
				this._styles[ name ].elem = jQuery( '<style>' ).html( this.stringfy( this._styles[ name ].css ) ).appendTo( 'head' );
				return this;
			}
		},
		stringfy: function( css ) {
			var styles = [];
			
			for ( var selector in css ) {
				var props = [];
				
				for ( var prop in css[ selector ] ) {
					var val = css[ selector ][ prop ];
					if ( typeof val === 'number' ) { val += 'px'; }
					props.push( prop + ':' + val );
				}
				
				styles.push( selector + '{' + props.join( ';' ) + '}' );
			}
			
			return styles.join( '' );
		},
		compatibility: function( css ) {
			var out = {};
			
			for ( var selector in css ) {
				var props = {};
				
				for ( var prop in css[ selector ] ) {
					if ( rspecial.test( css[ selector ][ prop ] ) ) {
						css[ selector ][ prop ] = css[ selector ][ prop ].replace( '-special-', special );
					}
					
					props[ prop ] = css[ selector ][ prop ];
				}
				
				out[ selector ] = props;
			}
			
			return out;
		}
	};
	
	return new Style();
})();

// estilos CSS gerais
Style.add('twa', {
	'#twa-menuOpen': { margin: '0px 6px 0px 2px', 'border-radius': 4, padding: '0px 3px 2px 3px', 'font-family': 'courier new', border: '1px solid rgba(0,0,0,0.25)', background: '-special-linear-gradient(bottom, #e7e7e7 100%, #c5c5c5 0%)', cursor: 'pointer' },
	'#twa-tooltip': { position: 'absolute', display: 'none', 'z-index': '999999', background: 'rgba(0,0,0,.8)', width: 300, color: '#ccc', padding: 4, 'border-radius': 2, 'box-shadow': '1px 1px 3px #333' },
	'.twaInput': { background: '#F3F3F3', 'border-radius': 6, 'box-shadow': '0 1px 4px rgba(0,0,0,0.2) inset', 'font-family': 'courier new', border: '1px solid #bbb', color: '#555' },
	'.twaButton': { 'border-radius': 3, margin: 10, padding: '7px 20px', background: '-special-linear-gradient(bottom, #CCC 0%, white 100%)', border: '1px solid #AAA', 'font-weight': 'bold' },
	'.checkStyle': { display: 'block', 'float': 'left', background: 'url(http://i.imgur.com/MhppaVe.png) top left no-repeat', 'background-position': '-4px -5px', width: 21, height: 20 },
	'.checkStyle.checked': { 'background-position': '-4px -65px' },
	// table
	'.twa-table': { width: '100%' },
	'.twa-table th': { 'text-align': 'center', background: '-special-linear-gradient(bottom, #BBB 30%, #CCC 100%) !important', padding: '7px !important' },
	'.twa-table td': { 'text-align': 'center', padding: '7px 0' },
	// menu
	'.twa-menu': { display: 'none', 'z-index': '12000', position: 'absolute', top: 130, 'font-family': 'Helvetica', 'font-size': 12, width: 1020, background: '#eee', color: '#333', border: 'solid 1px rgba(0,0,0,0.2)', 'border-radius': 4, 'box-shadow': '3px 3px 5px rgba(0,0,0,0.2)', margin: '0 auto 30px' },
	'.twa-menu a': { 'font-weight': '700' },
	'.twa-menu .head': { 'text-align': 'center', height: 25, 'border-bottom': '1px solid #ddd' },
	'.twa-menu .head ul': { 'line-height': 15, padding: 0 },
	'.twa-menu .head li': { 'list-style': 'none', display: 'inline', 'border-right': '1px solid #bbb', padding: '0 13px' },
	'.twa-menu .head li:last-child': { border: 'none' },
	'.twa-menu .head li a': { color: '#666', 'text-decoration': 'none', padding: 8, 'font-size': 13, 'border-radius': 10 },
	'.twa-menu .head li a.active': { 'box-shadow': '0 0 5px #AAA inset' },
	'.twa-menu .body': { padding: 10 }
});

// menu com ferramentas/configurações
var Menu = (function() {
	function center( elem ) {
		var $win = jQuery( window );
		return elem.css( 'left', Math.max( 0, ( ( $win.width() - elem.outerWidth() ) / 2 ) + $win.scrollLeft() ) );
	}
	
	var Menu = function( pos ) {
		this.opened = false;
		this._menus = {};
		this._active = 'autofarm';
		this.menu = jQuery( '<div class="twa-menu"><div class="head"><ul></ul></div><div class="body"></div></div>' ).appendTo( 'body' );
		
		if ( !pos ) {
			this.menu = center( this.menu );
		} else {
			this.menu.css({ top: pos[ 0 ], left: pos[ 1 ] });
		}
		
		return this;
	};
	
	Menu.prototype = {
		add: function( name, display, content, onload ) {
			var self = this;
			
			this._menus[ name ] = [jQuery( '<li/>' ).append(jQuery( '<a href="#" class="' + name + '">' + display + '</a>' ).click(function() {
				return self.select( name );
			})).appendTo( jQuery( '.head ul', this.menu ) ), jQuery( '<div style="display:none" class="' + name + '"/>' ).append( content ).appendTo( jQuery( '.body', this.menu ) ), onload];
			
			if ( this._active === name ) {
				this.select( name, true );
			}
			
			return this;
		},
		select: function( name, first ) {
			if ( first || this._active !== name ) {
				if ( this._active && this._menus[ this._active ] ) {
					this._menus[ this._active ][ 1 ].hide();
				}
				
				jQuery( '.head a', this.menu ).removeClass( 'active' );
				jQuery( '.head .' + name, this.menu ).addClass( 'active' );
				this._active = name;
				this._menus[ name ][ 1 ].show();
				
				if ( this._menus[ name ][ 2 ] ) {
					if ( this.opened ) {
						this._menus[ name ][ 2 ].call( this._menus[ name ][ 1 ] );
						this._menus[ name ][ 2 ] = false;
					} else {
						this.open = function() {
							this._menus[ name ][ 2 ].call( this._menus[ name ][ 1 ] );
							this._menus[ name ][ 2 ] = false;
						};
					}
				}
			}
			
			return false;
		},
		show: function() {
			return this.menu.show( 300 );
		},
		hide: function() {
			return this.menu.hide( 300 );
		}
	};
	
	return new Menu();
})();

// jQuery( checkbox ).checkStyle()
// adiciona estilos nos checkbox.
jQuery.fn.checkStyle = function() {
	this.hide().each(function() {
		var checked,
		input = jQuery( this ),
		elem = jQuery( '<a class="checkStyle"></a>' ).click(function() {
			elem = jQuery( this );
			var checked = elem.hasClass( 'checked' );
			elem[ elem.hasClass( 'checked' ) ? 'removeClass' : 'addClass' ]( 'checked' );
			input.attr( 'checked', !checked );
			
			return false;
		}).insertAfter( this );
		
		if ( input.is( ':checked' ) ) {
			elem.addClass( 'checked' );
		}
		
		if ( this.parentElement.nodeName.toLowerCase() === 'label' ) {
			jQuery( this ).click(function() {
				elem.trigger( 'click' );
			});
		}
	});
};

// jQuery( elem ).acceptOnly()
(function() {
	var codes = {
		num: function( event ) { return event.keyCode > 47 && event.keyCode < 58; },
		space: function( event ) { return event.keyCode === 32 },
		enter: function( event ) { return event.keyCode === 13 },
		tab: function( event ) { return event.keyCode === 9 },
		'|': function( event ) { return event.keyCode === 226 && event.shiftKey },
		':': function( event ) { return event.keyCode === 191 && event.shiftKey },
		'/': function( event ) { return ( event.keyCode === 193 || event.keyCode === 81 ) && event.altKey && !event.shiftKey }
	};
	
	function parse( props, event ) {
		var pass = false;
		props = props.split( ' ' );
		
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39) || ((event.keyCode === 67 || event.keyCode === 86 || event.keyCode === 88) && event.ctrlKey)) {
			return true;
		}
		
		for ( var i = 0; i < props.length; i++ ) {
			if ( codes[ props[ i ] ]( event ) ) {
				return props[ i ];
			}
		}
		
		return false;
	}
	
	jQuery.fn.acceptOnly = function( props, callback ) {
		return this.keydown(function( event ) {
			var prop = parse( props, event );
			if ( prop ) {
				callback.call( this, event, prop );
				return true;
			} else {
				return event.preventDefault();
			}
		});
	};
})();

function addCheckbox() {
	var stop = [ 'trader', 'groups', 'commands', 'incomings' ],
		table, tr;
	
	if ( stop.indexOf( overview ) >= 0 ) {
		return;
	} else if ( overview == 'units' ) {
		table = document.getElementById( 'units_table' );
		
		var tbody = table.getElementsByTagName( 'tbody' ),
			th = table.getElementsByTagName( 'th' )[ 0 ],
			tbodyTr;
		
		th.innerHTML = '<input type="checkbox" style="margin:0px" id="twa-selectAll"/> ' + th.innerHTML;
		
		for ( var i = 0; i < tbody.length; i++ ) {
			tbodyTr = tbody[ i ].getElementsByTagName( 'tr' )[ 0 ];
			tbodyTr.getElementsByTagName( 'td' )[ 0 ].innerHTML = '<input type="checkbox" name="village_ids[]" class="addcheckbox" style="margin:0px" value="' + jQuery( 'a[href*="village="]:first', tbody[ i ] )[ 0 ].href.match( /village=(\d+)/ )[ 1 ] + '"/>' + tbodyTr.getElementsByTagName( 'td' )[ 0 ].innerHTML;
		}
	} else {
		tr = jQuery( '.overview_table' )[ 0 ].getElementsByTagName( 'tr' );
		
		for ( var i = 0; i < tr.length; i++ ) {
			tr[ i ].innerHTML = ( !i ? '<th><input type="checkbox" id="twa-selectAll"/></th>' : '<td><input type="checkbox" name="village_ids[]" class="addcheckbox" value="' + jQuery( 'a[href*="village="]:first', tr[ i ] )[ 0 ].href.match( /village=(\d+)/ )[ 1 ] + '"/></td>' ) + tr[ i ].innerHTML;
		}
	}
	
	jQuery( '#twa-selectAll' ).click(function() {
		jQuery( '.addcheckbox:visible' ).attr( 'checked', this.checked );
	});
}

menuButton.click(function() {
	if ( !Menu.opened ) {
		Menu.open();
		Menu.opened = true;
	}
	
	Menu[ Menu.menu.is( ':visible' ) ? 'hide' : 'show' ]();
});

// nome do items salvos em localStorage
var memory = { settings: 'TWASettings' + game_data.player.id, data: 'TWAData' + game_data.player.id },
// servidor atual do jogo
market = game_data.market === 'br' ? 'pt' : game_data.market,
newVersion = false;

// configurações e dados salvos
TWA.settings = localStorage[ memory.settings ] ? JSON.parse( localStorage[ memory.settings ] ) : false;
TWA.data = localStorage[ memory.data ] ? JSON.parse( localStorage[ memory.data ] ) : false;

// caso não esteja na versão atual do script ou o script
// não tenha sido executado nenhum vez ainda cria uma nova
// configuração padrão para o script
if((function() {
	// caso não exista as configurações ou os dados salvos
	// cria nova configuração
	if ( !TWA.settings || !TWA.data ) {
		return true;
	// caso a versão usada não seja a atual do script
	// cria novas configurações
	} else if ( TWA.data.version !== TWA.version ) {
		TWA.data.version = TWA.version;
		// salva as configurações e dados antigos para serem
		// repassados ao novo e não perdelas
		TWA.oldSettings = TWA.settings;
		TWA.oldData = TWA.data;
		newVersion = true;
		
		return true;
	}
})()) {
	localStorage[ memory.settings ] = JSON.stringify(TWA.settings = jQuery.extend({
		mapcoords: true,
		profilecoords: true,
		_profilecoordsmin: 0,
		_profilecoordsmax: 12500,
		_mapplayers: true,
		_mapplayersmin: 0,
		_mapplayersmax: 1000,
		_mapabandoneds: true,
		_mapabandonedsmin: 0,
		_mapabandonedsmax: 12500,
		mapidentify: true,
		mapmanual: true,
		lastattack: true,
		rankinggraphic: true,
		allygraphic: true,
		profilestats: true,
		reportfilter: true,
		villagefilter: true,
		reportrename: true,
		commandrename: true,
		troopcounter: true,
		mapgenerator: true,
		reportcalc: true,
		_reportcalc: { actives: [ 'knight', 'light', 'marcher', 'spear' ], spy: 5, ram: 5, currentVillage: false },
		assistentfarm: true,
		autofarm: true,
		_autofarm: { protect: true, index: 0, units: {}, coords: [], random: true },
		building: true,
		_buildingbuild: { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
		_buildingdestroy: { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
		_buildingmaxorders: 5,
		research: true,
		changegroups: true,
		attackplanner: true,
		selectvillages: true,
		overview: true,
		_overviewmode: 'production',
		renamevillages: true,
		lang: market
	}, TWA.oldSettings || {}));
	
	localStorage[memory.data] = JSON.stringify(TWA.data = jQuery.extend({
		version: TWA.version,
		attackplanner: {
			commands: [],
			lastTime: $serverTime.text() + ' ' + $serverDate.text()
		}
	}, TWA.oldData || {}));
}

var languages = {};

languages.en = {
	lang: 'English',
	config: {
		config: 'Settings',
		tooltip: {
			autofarm: 'Allows farm several villages automatically.',
			mapcoords: 'Allow to obtain map coords.',
			profilecoords: 'Allow to obtain village coords from player profile.',
			mapidentify: 'Add a mark in the villages that were obtained coordinates.',
			mapmanual: 'Allows you to obtain coordinates of villages from the map just clicking them.',
			rankinggraphic: 'Shows a pontuation graph on ranking page on hover over the name of player/tribe.',
			allygraphic: 'Shows a pontuation graph on members tribe on hover over the name of any player.',
			profilestats: 'Shows an area with multiple charts of a player/tribe in the same profile.',
			lastattack: 'Shows how much time has passed since the last attack on the map.',
			reportfilter: 'Shows a search field by title on report page.',
			villagefilter: 'Shows a field of search on overview page to search villages by name.',
			reportrename: 'Shows a field of search on report page to rename reports.',
			commandrename: 'Shows a field to rename commands on overview.',
			villagerename: 'Shows a field to rename villages on overview.',
			mapgenerator: 'Generate TW Stats maps from ranking page allowing select players or tribes that will be included on the map.',
			reportcalc: 'Makes calculating the amount of resources they currently have in starting a village of a spy report and shows the amount of troops needed to farm.',
			troopcounter: 'Makes the calculation of the amount of troops that has all the villages visible in views> troops. The amount is shown on the bottom.',
			assistentfarm: 'Make automatic attacks from the Assistent Farm page.',
			building: 'Mass constructions and demolitions in overview of buildings.',
			research: 'Mass research on overview page (just simple blacksmith, for now).',
			changegroups: 'Allows change in mass groups from any page of views.',
			attackplanner: 'Attacks with scheduled time automatically. Note: You must leave a tab with the script running in the game for the attacks being made??!',
			selectvillages: 'Function to select specific villages in overview, as villages with troops attack, defense, and with noble etc ...',
			overview: 'Add premium options on overview page for users without premium account.',
			renamevillages: 'Allow rename mass village on overview.'
		},
		title: 'Relaxeaza TWAdvanced v{0}',
		coords: 'Coords',
		autofarm: 'Auto Farmer.',
		mapcoords: 'Get map coords.',
		profilecoords: 'Get profile player coords.',
		mapidentify: 'Identify on get coords',
		mapmanual: 'Obtain coordinates manually',
		graphicstats: 'Graphics and Statistics',
		rankinggraphic: 'Ponctuation graphic on ranking.',
		allygraphic: 'Ponctuation graphic on members tribe.',
		profilestats: 'Shows stats of a player on player/trible profile.',
		lastattack: 'Show time of last attack on map.',
		reportfilter: 'Search field on reports.',
		villagefilter: 'Search villages on overview.',
		reportrename: 'Rename field to rename reports.',
		commandrename: 'Rename field to rename commands on overview.',
		villagerename: 'Field to rename villages on overview.',
		mapgenerator: 'Generate map from ranking page.',
		reportcalc: 'Calculate amount of resources in a village.',
		troopcounter: 'Calculate amount of troops.',
		assistentfarm: 'Auto-Farm Assistent',
		building: 'Mass builder/demolition.',
		research: 'Massive search Units',
		changegroups: 'Change groups on overview.',
		attackplanner: 'Attack planner',
		selectvillages: 'Village picker.',
		overview: 'Advanced overview.',
		savealert: 'Settings have been saved!',
		save: 'Save',
		other: 'Other options',
		renamevillages: 'Village renamer.'
	},
	mapcoords: {
		getcoords: 'Coords obtained',
		update: 'Update',
		mapplayers: 'Obtain player coords.',
		min: 'Min',
		max: 'Max',
		mapabandoneds: 'Obtain abandoneds coords.'
	},
	mapmanual: {
		getcoords: 'Coords obtained manually'
	},
	profilecoords: {
		everycoords: 'All coords',
		min: 'Min points.',
		max: 'Max points.'
	},
	profilegraphic: {
		stats: 'Stats'
	},
	lastattack: {
		year: 'year',
		years: 'years',
		days: 'd'
	},
	mapgenerator: {
		generate: 'Generate map',
		selectall: 'Select all'
	},
	reportfilter: {
		search: 'Report search:'
	},
	villagefilter: {
		search: 'Village search:'
	},
	reportcalc: {
		neededunits: 'Necessary units',
		currentvillage: 'Use troops of current village',
		unitscalc: 'Units calculated:',
		attack: 'Attack with these troops ',
		error: 'An error occurred on send attack:',
		success: 'Attack successfully sent!',
		sendSpy: 'Send spys',
		sendRam: 'Send rams'
	},
	selectvillages: {
		selectvillages: 'Select villages:',
		unitsattack: 'with offense troops',
		unitsdefence: 'with deffense troops',
		unitsnob: 'with nobles'
	},
	rename: {
		rename: 'Rename',
		only: 'Only',
		selected: 'selected',
		report: 'reports',
		villages: 'villages',
		commands: 'commands'
	},
	assistentfarm: {
		auto: 'Auto',
		log: 'Assistent Farm Log',
		onvillage: 'on village'
	},
	autofarm: {
		farm: 'Farmer',
		autofarm: 'Auto-Farmer',
		coords: 'Coordinates:',
		protect: 'Protection - Don\'t send attack if village has an owner.',
		random: 'Random Time - Attacks are sent at a time between 0-10 seconds. (To complicate the detection of Auto Farm)',
		start: 'Start attacks',
		stop: 'Stop attacks',
		continueAtt: 'Continue attacks',
		units: 'Units',
		options: 'Options',
		log: 'Attacks log',
		waitingreturn: 'There is no troops on the village right now. Waiting for troops come back!',
		notroops: 'There is no troops on the village.',
		success: 'Attacks sent in village {0}.'
	},
	building: {
		buildtitle: 'Mass Builder - Buildings',
		buildhelp: 'The buildings will be built to level indicated below!',
		cancelbuilds: 'Cancel all builders',
		destroytitle: 'Mass Demolition - Buildings',
		destroyhelp: 'The buildings will be demolished to the level indicated below!',
		canceldestroy: 'Cancel all demolitions',
		help: 'Click on the icon below the buildings to start construction on the building mass clicked.',
		demolitions: 'demolitions',
		buildings: 'builders',
		confirmcancel: 'Are you sure cancel all {0}?'
	},
	research: {
		help: 'Click the icon of the units below to start searching mass unit clicked.',
		cancel: 'Cancel all researches?',
		confirmcancel: 'Ara you sure cancel all researches?'
	},
	changegroups: {
		changegroups: 'Change groups of selected villages:',
		add: 'Add',
		remove: 'Remove',
		move: 'Move'
	},
	attackplanner: {
		planner: 'Planner',
		attackplanner: 'Attack planner',
		addcommand: 'Add comand',
		attacker: 'Attacker village',
		target: 'Village target',
		time: 'Send time',
		support: 'Support',
		attack: 'Attack',
		troops: 'Troops',
		commands: 'Commands',
		type: 'Type',
		options: 'Options',
		commandssended: 'Commands sent',
		errorequal: 'The coordinates of the village attacker can not be the same fate of the village!',
		errorunits: 'You aren\'t entered any unit!',
		errorcoords: 'Coords {0} doesn\'t exist.',
		success: '{0} send on village {1} to village {2} with the troops: {3}',
		current: 'Current',
		now: 'Now'
	},
	overview: {
		warning: '* The advanced visualization is best viewed with the window width above 1000px. (Settings -> Settings)',
		combined: 'Combined',
		production: 'Production',
		changemode: 'Change overview mode',
		needreload: 'You need to refresh page',
		village: 'Village',
		wood: 'Wood',
		stone: 'Stone',
		iron: 'Iron',
		buildings: 'Buildings',
		research: 'Researchs',
		recruit: 'Recruitment',
		points: 'points'
	},
	lastConquests: {
		lastConquests: 'Last ennoblements',
		loadLast: 'Load ennoblement in the last',
		hours: 'hours',
		village: 'Village',
		date: 'Date',
		newOwn: 'New Owner',
		oldOwn: 'Old Owner',
		pageUp: '<<< page up',
		pageDown: 'page down >>>',
		abandoned: 'Abandoned village'
	},
	renamevillages: {
		renamevillages: 'Rename villages',
		mask: 'Masks',
		onlySelected: 'Only selected villages',
		argumentError: 'Invalid argument',
		correct: 'Correct'
	}
}
languages.pt = {
	lang: 'Português',
	config: {
		config: 'Configurações',
		tooltip: {
			autofarm: 'Permite farmar várias aldeias automaticamente.',
			mapcoords: 'Permite obter coordenadas do mapa.',
			profilecoords: 'Permite obter coordenadas de aldeias apartir do perfil de um jogador.',
			mapidentify: 'Adiciona uma marcação nas aldeias que foram obtidas coordenadas.',
			mapmanual: 'Permite obter coordenadas de aldeias no mapa clicando nelas.',
			rankinggraphic: 'Mostra um gráfico de pontuação na classificação ao passar o mouse sobre o nome de algum jogador ou tribo.',
			allygraphic: 'Mostra um gráfico de pontuação na página de membros de uma tribo ao passar o mouse sobre o nome de algum jogador.',
			profilestats: 'Mostra uma área com vários gráficos de um jogador ou uma tribo no perfil do mesmo.',
			lastattack: 'Mostra quanto tempo se passou desde o último ataque no mapa.',
			reportfilter: 'Mostra um campo de pesquisa por título na página de relatórios.',
			villagefilter: 'Mostra um campo de pesquisa na visualização para pesquisar aldeias por nome.',
			reportrename: 'Mostra um campo na página de relatórios para renomear todos ou apenas os selecionados.',
			commandrename: 'Mostra um campo na visualização para renomear todas os comandos de apenas uma vez.',
			villagerename: 'Mostra um campo na visualização das aldeias para renomear todas as aldeias de apenas uma vez.',
			mapgenerator: 'Gera mapas do TW Stats direto da classificação permitindo selecionar os jogadores ou tribos que estaram incluidos no mapa.',
			reportcalc: 'Faz o calculo da quantidade de recursos que tem atualmente em uma aldeia apartir de um relatório de espionagem e mostra a quantidade de tropas necessárias para farmar.',
			troopcounter: 'Faz o calculo da quantidade de tropas que tempo todas as aldeias visiveis em visualizações > tropas. A quantidade é mostrada no final da página.',
			assistentfarm: 'Faz ataques automáticos apartir da página do Assistente de Farm.',
			building: 'Faz construções e demolições em massa na visualização dos edifícios.',
			research: 'Faz pesquisas em massa apartir da página de visualização de pesquisas (apenas ferreiro simples, por enquanto).',
			changegroups: 'Permite alterar grupos em massa apartir de qualquer página das visualizações.',
			attackplanner: 'Faz ataques programados com horário automaticamente. Obs.: é preciso deixar uma aba com o script rodando no jogo para os ataques serem efetuados!',
			selectvillages: 'Função para selecionar aldeias especificas na visualização, como aldeias com tropas de ataque, defesa, com nobres e etc...',
			overview: 'Adiciona opções premium na página de visualização para usuários sem conta premium.',
			renamevillages: 'Permite renomear aldeias em massa e individuais na visualização de aldeias.'
		},
		title: 'Relaxeaza TWAdvanced v{0}',
		coords: 'Coordenadas',
		autofarm: 'Farmador automático.',
		mapcoords: 'Obter coordenadas do mapa.',
		profilecoords: 'Obter coordenadas por perfil.',
		mapidentify: 'Identificar ao obter coordenadas',
		mapmanual: 'Obter coordenadas manualmente',
		graphicstats: 'Gráficos & Estatísticas',
		rankinggraphic: 'Gráfico de pontuação na classificação.',
		allygraphic: 'Gráfico de pontuação em membros da tribo.',
		profilestats: 'Mostrar estatísticas de um jogador/tribo no perfil.',
		lastattack: 'Mostrar tempo do último ataque no mapa.',
		reportfilter: 'Campo de pesquisa nos relatórios.',
		villagefilter: 'Pesquisa de aldeias na visualização.',
		reportrename: 'Campo para renomear relatórios.',
		commandrename: 'Campo para renomear comandos na visualização.',
		villagerename: 'Campo para renomear aldeias na visualização.',
		mapgenerator: 'Gerar mapa apartir da classificão.',
		reportcalc: 'Calcula recursos exatas em uma aldeia.',
		troopcounter: 'Calcula a quantidade de tropas.',
		assistentfarm: 'Assistente de Farm automático.',
		building: 'Construção/demolição em massa.',
		research: 'Pesquisa em massa.',
		changegroups: 'Alterar grupos na visualização.',
		attackplanner: 'Planeador de ataques.',
		selectvillages: 'Selecionador de aldeias.',
		overview: 'Visualização avançada.',
		savealert: 'As configurações foram salvas!',
		save: 'Salvar',
		other: 'Outras opções',
		renamevillages: 'Renomeador de aldeias'
	},
	mapcoords: {
		getcoords: 'Coordenadas obtidas',
		update: 'Atualizar',
		mapplayers: 'Obter coordenadas de jogadores.',
		min: 'Mínimo',
		max: 'Máximo',
		mapabandoneds: 'Obter coordenadas de abandonadas.'
	},
	mapmanual: {
		getcoords: 'Coordenadas obtidas manualmente'
	},
	profilecoords: {
		everycoords: 'Todas coordenadas',
		min: 'Pontuação mínima.',
		max: 'Pontuação máxima.'
	},
	profilegraphic: {
		stats: 'Estatísticas'
	},
	lastattack: {
		year: 'ano',
		years: 'anos',
		days: 'd'
	},
	mapgenerator: {
		generate: 'Gerar mapa',
		selectall: 'Selecionar todos'
	},
	reportfilter: {
		search: 'Pesquisar relatórios:'
	},
	villagefilter: {
		search: 'Pesquisar aldeias:'
	},
	reportcalc: {
		neededunits: 'Unidades necessárias:',
		currentvillage: 'Usar tropas da aldeia atual',
		unitscalc: 'Unidades calculadas:',
		attack: 'Atacar com essas tropas',
		error: 'Ocorreu o seguinte erro ao enviar o ataque:',
		success: 'Ataque enviado com sucesso!',
		sendSpy: 'Enviar exploradores',
		sendRam: 'Enviar arietes'
	},
	selectvillages: {
		selectvillages: 'Selecionar aldeias:',
		unitsattack: 'com tropas de ataque',
		unitsdefence: 'com tropas de defesa',
		unitsnob: 'com nobres'
	},
	rename: {
		rename: 'Renomear',
		only: 'Apenas',
		selected: 'selecionados',
		report: 'relatórios',
		villages: 'aldeias',
		commands: 'comandos'
	},
	assistentfarm: {
		auto: 'Automático',
		log: 'Farm Assistent Log',
		onvillage: 'na aldeia'
	},
	autofarm: {
		farm: 'Farmador',
		autofarm: 'Farmador Automático',
		coords: 'Coordenadas:',
		protect: 'Proteção - Não enviar ataques caso a aldeia tenha dono.',
		random: 'Tempo Aleatório - Os ataques são enviados em um tempo entre 0-10 segundos. (Para dificultar a detecção do Auto Farm)',
		start: 'Iniciar ataques',
		stop: 'Parar ataques',
		continueAtt: 'Continuar ataques',
		log: 'Log de ataques:',
		waitingreturn: 'Não há tropas na aldeia no momento. Aguardando tropas retornarem!',
		notroops: 'Não existem tropas na aldeia.',
		success: 'Ataque enviado na aldeia {0}.',
		units: 'Unidades',
		options: 'Opções'
	},
	building: {
		buildtitle: 'Construção em Massa - Edifícios',
		buildhelp: 'Os edifícios serão construidos até o nível indicado abaixo!',
		cancelbuilds: 'Cancelar todas as contruções',
		destroytitle: 'Demolição em Massa - Edifícios',
		destroyhelp: 'Os edifícios serão demolidos até o nível indicado abaixo!',
		canceldestroy: 'Cancelar todas as demolições',
		help: 'Clique no icone dos edifícios abaixo para iniciar a construção em massa do edifício clicado.',
		demolitions: 'demolições',
		buildings: 'construções',
		confirmcancel: 'Tem certeza que deseja cancelar todas as {0}?'
	},
	research: {
		help: 'Clique no icone das unidades abaixo para iniciar a pesquisa em massa da unidade clicada.',
		cancel: 'Cancelar todas as pesquisas',
		confirmcancel: 'Tem certeza que deseja cancelar todas as pesquisas?'
	},
	changegroups: {
		changegroups: 'Alterar grupos das aldeias selecionadas:',
		add: 'Adicionar',
		remove: 'Remover',
		move: 'Mover'
	},
	attackplanner: {
		planner: 'Planeador',
		attackplanner: 'Planeador de ataque',
		addcommand: 'Adicionar comando',
		attacker: 'Aldeia atacante',
		target: 'Aldeia alvo',
		time: 'Horário de envio',
		support: 'Apoio',
		attack: 'Ataque',
		troops: 'Tropas',
		commands: 'Comandos',
		type: 'Tipo',
		options: 'Opções',
		commandssended: 'Comandos enviados',
		errorequal: 'As coordenadas da aldeia atacante não pode ser a mesma da aldeia de destino!',
		errorunits: 'Você não inseriu nenhuma unidade!',
		errorcoords: 'A coordenada {0} não existe.',
		success: '<td>{1}</td><td>{2}</td> com as seguintes tropas: {3}',
		current: 'Atual',
		now: 'Agora'
	},
	overview: {
		warning: '* A visualização avançada é melhor visualizada com a largura da janela acima de 1000px. (Configurações -> Configurações)',
		combined: 'Combinado',
		production: 'Produção',
		changemode: 'Alterar modo de visualização',
		needreload: 'Necessita atualizar página',
		village: 'Aldeia',
		wood: 'Madeira',
		stone: 'Argila',
		iron: 'Ferro',
		buildings: 'Contruções',
		research: 'Pesquisas',
		recruit: 'Recrutamento',
		points: 'pontos'
	},
	lastConquests: {
		lastConquests: 'Últimas Conquistas',
		loadLast: 'Carregar conquistas nas últimas',
		hours: 'horas',
		village: 'Aldeia',
		date: 'Data',
		newOwn: 'Novo dono',
		oldOwn: 'Antigo dono',
		pageUp: '<<< para cima',
		pageDown: 'para baixo >>>',
		abandoned: 'Aldeia abandonada'
	},
	renamevillages: {
		renamevillages: 'Renomear aldeias',
		mask: 'Máscaras',
		onlySelected: 'Apenas aldeias selecionadas',
		argumentError: 'Argumento inválido',
		correct: 'Correto'
	}
}
languages.sk = {
	lang: 'Slovak',
	config: {
		config: 'Nastavenie',
		tooltip: {
			autofarm: 'Umožňuje niekoľko dedín poľnohospodár automaticky',
			mapcoords: 'Umožòuje zobrazi súradníce na mape.',
			profilecoords: 'Umožòuje zobrazi súradnice všetkých dedín hráèa.',
			mapidentify: 'Pridá udalos v dedinách, kde boli získané súradnice.',
			mapmanual: 'Umožòuje získa súradnice dedín v mape kliknutím na ne.',
			rankinggraphic: 'Ukazuje graf rastu v tabu¾ke každého hráèa alebo kmeòa.',
			allygraphic: 'Zobrazuje štatistiky vybraného kmeòa.',
			profilestats: 'Zobrazuje štatistiky vybraného hráèa.',
			lastattack: 'Ukazuje, ko¾ko èasu uplynulo od posledného útoku na mape.',
			reportfilter: 'Filter oznámení.',
			villagefilter: 'Filter dedín.',
			reportrename: 'Premenováva všetky alebo len vybrané oznámenia.',
			commandrename: 'Premenováva vybrané útoky.',
			villagerename: 'Premenováva vybrané dediny.',
			mapgenerator: 'TW Stats vygeneruje mapu vybraného hráèa alebo kmeòa.',
			reportcalc: 'Automaticky vypoèíta ko¾ko vojakov treba posla na kompletné vyfarmenie barbarky (potrebný špeh v predchádzajúcom útoku). ',
			troopcounter: 'Spoèítavá vojská. Zobrazenie> Jednotky. Suma sa zobrazí v dolnej èasti.',
			assistentfarm: 'Automaticky odosiela útoky v náh¾ade.',
			building: 'Stavia a búra budovy v náh¾ade.',
			research: 'Automaticky vyskúma všetky výskumy (zatia¾ len pre jednoduchý výskum).',
			changegroups: 'Umožnuje zmeni skupinu pre skupinu jednotlivých dedín.',
			attackplanner: 'Napadá dediny automaticky. Poznámka: Musíte opusti kartu a skript necha spustený!',
			selectvillages: 'Funkcia pre výber konkrétnej dediny v zobrazení, ako napr. útoèná dedina, obranná, šåachtic ...',
			overview: 'Pridat prémiové možnosti na stránke náhladu pre užívatelov bez premium úctu.',
			renamevillages: 'Premenovanie dedín v individuálnej a hromadnej prezeranie dedín.'
		},
		title: 'Relaxeaza TWAdvanced v{0}',
		coords: 'Súradnice',
		autofarm: 'Automatické Farma.',
		mapcoords: 'Získa súradnice na mape.',
		profilecoords: 'Získa súradnice z profilu hráèa.',
		mapidentify: 'Identifikova k získaniu súradníc',
		mapmanual: 'Zada súradnice ruène.',
		graphicstats: 'Grafy a štatistiky.',
		rankinggraphic: 'Bodový graf',
		allygraphic: 'Bodový graf kmeòa.',
		profilestats: 'Zobrazi štatistiky pre hráèa / kmeò.',
		lastattack: 'Zobrazi èas posledného útoku na mape.',
		reportfilter: 'Filter oznámenii.',
		villagefilter: 'Filter dediny v náh¾ade.',
		reportrename: 'Premenováva oznámenie.',
		commandrename: 'Premenováva útoky.',
		villagerename: 'Premenováva dediny.',
		mapgenerator: 'Generator mapy pod¾a predvolených bodov',
		reportcalc: 'Poèíta presne suroviny v dedine.',
		troopcounter: 'Vypoèítava množstvo vojakov.',
		assistentfarm: 'Autofarmiaci pomocník.',
		building: 'Stavanie / búranie budov.',
		research: 'Výskum.',
		changegroups: 'Zmena skupín v náh¾ade.',
		attackplanner: 'Plánovaè útokov.',
		selectvillages: 'Výber dedín.',
		overview: 'Advanced vizualizácie.',
		savealert: 'Nastavenia boli uložené!',
		save: 'Uložit',
		other: 'Dalšie možnosti',
		renamevillages: 'Renamer dediny'
	},
	mapcoords: {
		getcoords: 'Súradnice získané.',
		update: 'Aktualizova.',
		mapplayers: 'Získáva súradníce hráèov.',
		min: 'Minimálna.',
		max: 'Maximálna.',
		mapabandoneds: 'Súradnice barbariek získané.'
	},
	mapmanual: {
		getcoords: 'Suradnice, zadané ruène'
	},
	profilecoords: {
		everycoords: 'Všetky súradnice.',
		min: 'Minimálne hranica bodov.',
		max: 'Maximálna hranica bodov.'
	},
	profilegraphic: {
		stats: 'Štatistika.'
	},
	lastattack: {
		year: 'rok',
		years: 'rokov',
		days: 'd'
	},
	mapgenerator: {
		generate: 'Generova mapu',
		selectall: 'Vybra všetko'
	},
	reportfilter: {
		search: 'H¾ada oznámenia:'
	},
	villagefilter: {
		search: 'H¾ada dediny:'
	},
	reportcalc: {
		neededunits: 'Požadované vojsko:',
		currentvillage: 'Použitie vojska z aktuálnej dediny.',
		unitscalc: 'Vojsko vypoèíta:',
		attack: 'Útoèi s týmito vojakmi',
		error: 'Chyba!',
		success: 'Útok úspešne odoslaný!',
		sendSpy: 'Odoslať prieskumníci',
		sendRam: 'Odoslať barany'
	},
	selectvillages: {
		selectvillages: 'Vybra dediny:',
		unitsattack: 'Vojská útoèia',
		unitsdefence: 'S obrannými jednotkami',
		unitsnob: 'So š¾achtami'
	},
	rename: {
		rename: 'Premenova',
		only: 'Iba',
		selected: 'Vybraný',
		report: 'Oznámenie',
		villages: 'Dediny',
		commands: 'Povely'
	},
	assistentfarm: {
		auto: 'Automatický',
		log: 'Logy',
		onvillage: 'Dedina'
	},
	autofarm: {
		farm: 'Farmenie',
		autofarm: 'Automatické farmenie',
		coords: 'Súradnice:',
		protect: 'Ochrana - Nebudú posielané útoky ak má dedina majite¾a.',
		random: 'Random Time - Útoky sú odosielané v čase medzi 0-10 sekúnd. (To komplikuje detekciu Auto Farm)',
		start: 'Štart útoky',
		stop: 'Zastavenie útokov',
		continueAtt: 'Pokračovať útoky',
		units: 'Jednotky',
		options: 'Možnosti',
		log: 'Logy:',
		waitingreturn: 'Nie sú žiadne jednotky v dedine.Èaká sa na vracajúcich sa vojakov!',
		notroops: 'V dedine nie sú žiadne jednotky.',
		success: 'Útoky na dedinu odoslané {0}.'
	},
	building: {
		buildtitle: 'Hromadné stavenie - Budovy',
		buildhelp: 'Budovy budú postavené na úroveò uvedenú nižšie!',
		cancelbuilds: 'Zruši všetky príkazy na stavbu',
		destroytitle: 'Hromadné búranie - Budovy',
		destroyhelp: 'Budovy budú zbúrané na úroveò uvedenú nižšie!',
		canceldestroy: 'Zruši všetky demolácie',
		help: 'Kliknite na ikonu budovy, pre zaèatie automatického stavania.',
		demolitions: 'Búranie',
		buildings: 'Budovy',
		confirmcancel: 'Ste si istí, že chcete zruši všetky {0}?'
	},
	research: {
		help: 'Kliknite na ikonu výskum pre zaèatie hromadného skúmania',
		cancel: 'Zruši všetky skúmania',
		confirmcancel: 'Ste si istí, že chcete zruši všetky skúmania?'
	},
	changegroups: {
		changegroups: 'Zmena skupiny vybraných dedín:',
		add: 'Prida',
		remove: 'Odstráni',
		move: 'Pohyb'
	},
	attackplanner: {
		planner: 'Plánovaè',
		attackplanner: 'Plánovaè útokov',
		addcommand: 'Prida príkaz',
		attacker: 'Útoèiaca dedina',
		target: 'Cie¾',
		time: 'Doba dopadu',
		support: 'Podpora',
		attack: 'Útok',
		troops: 'Jednotky',
		commands: 'Príkazy',
		type: 'Typ',
		options: 'Možnosti',
		commandssended: 'Odoslané útoky',
		errorequal: 'Súradnice dediny útoènika nemožu by rovnaké ako súradnice dediny cie¾a!',
		errorunits: 'Nezadali ste žiadnu jednotku!',
		errorcoords: 'Cie¾ {0} neexistuje!',
		success: '{0} Poslané z dedine {1} do dediny {2} s nasledujucími vojakmi {3}',
		current: 'Prúd',
		now: 'Teraz'
	},
	overview: {
		warning: '* Pokroèilá vizualizácia je optimalizovaná pre šírku okna nad 1000px. (Nastavenia -> Nastavenia)',
		combined: 'Kombinovaný',
		production: 'Produkcia',
		changemode: 'Zmena režimu zobrazenia',
		needreload: 'Potrebujete aktualizova stránku',
		village: 'Obec',
		wood: 'Drevo',
		stone: 'Íl',
		iron: 'žehlička',
		buildings: 'Stavby',
		research: 'Vyhľadávanie',
		recruit: 'Nábor',
		points: 'body'
	},
	lastConquests: {
		lastConquests: 'Najnovšie úspechy',
		loadLast: 'Vložte úspechy v posledných',
		hours: 'hodiny',
		village: 'Obec',
		date: 'Dátum',
		newOwn: 'Nový vlastník',
		oldOwn: 'Bývalý majiteľ',
		pageUp: '<<< hore',
		pageDown: 'dole >>>',
		abandoned: 'Opustené dediny'
	},
	renamevillages: {
		renamevillages: 'Premenovanie dedín',
		mask: 'Masky',
		onlySelected: 'Len vybrané obce',
		argumentError: 'Neplatný argument',
		correct: 'Opraviť'
	}
}

var lang = !languages[ TWA.settings.lang ] ? languages.pt : languages[ TWA.settings.lang ];

if ( newVersion ) {
	Style.add('newVirsion', { '#newVersion span': { display: 'block', 'margin-bottom': 6, 'font-size': 11 } });
	
	UI.SuccessMessage( '<div id="newVersion"><b>Relaxeaza Tribal Wars Advanced - Version ' + TWA.version + '. </b><p>Alterações/Changes<br/> <span><b>Adicionado:</b> Ferramenta para mostrar as últimas conquistas do mundo.</span><span><b>Adicionado:</b> Agora é possivel trocar o tempo do planeador de ataques apenas apertando para cima/baixo.</span><span><b>Resolvido:</b> Problema ao renomear vários ataques de uma vez.</span><span><b>Resolvido:</b> Problema que fazia ataques do autofarm parar sozinho (ainda pode acontecer).</span><span><b>Adicionado:</b> Algumas traduções para o inglês/eslovaco estavam faltando.</span><span><b>Resolvido:</b> Ferramenta para calcular recursos e farmar aldeias pelo relatório foi reparado.</span><span><b>Adicionado:</b> Opção para enviar arietes diretamente do relatório de espionagem.</span><span><b>Resolvido:</b> Opção para selecinar apenas aldeias de ataque/defasa na visualização foi reparado.</span><span>Mais informações <a href="https://github.com/relaxeaza/twadvanced/wiki/Tribal-Wars-Advanced">aqui</a></span></p></div>', 60000 );
}

TWA.ready(function() {
	switch( game_data.screen ) {
		case 'map':
			( TWA.settings._mapplayers || TWA.settings._mapabandoneds ) && TWA.mapCoords.init();
			TWA.settings.mapmanual && TWA.mapManual();
			TWA.settings.lastattack && game_data.player.premium && TWA.lastAttack();
		break;
		case 'info_player':
			TWA.settings.profilecoords && TWA.profileCoords();
			TWA.settings.profilestats && TWA.profileGraphic();
		break;
		case 'info_ally':
			TWA.settings.profilestats && TWA.profileGraphic();
		break;
		case 'info_member':
			TWA.settings.allygraphic && game_data.screen === 'info_member' && TWA.tooltipGraphic();
		break;
		case 'ranking':
			TWA.settings.mapgenerator && game_data.mode !== 'awards' && game_data.mode !== 'wars' && game_data.mode !== 'secrets' && TWA.mapGenerator();
			TWA.settings.rankinggraphic && TWA.tooltipGraphic();
		break;
		case 'overview_villages':
			$overviewTools = jQuery( '<table class="vis" id="twa-overviewtools" style="display:none" width="100%"><tr><th>Tribal Wars Advanced</th></tr></table>' ).insertBefore( '.overview_table' );
			
			addCheckbox();
			TWA.settings.overview && !game_data.player.premium && TWA.overview.init();
			TWA.settings.renamevillages && TWA.renamevillages.init();
			TWA.settings.commandrename && overview === 'commands' && TWA.rename.commands();
			TWA.settings.villagefilter && overview !== 'trader' && TWA.villageFilter();
			TWA.settings.troopcounter && overview === 'units' && TWA.troopCounter();
			TWA.settings.changegroups && game_data.player.premium && overview !== 'groups' && overview !== 'trader' && TWA.changegroups.init();
			TWA.settings.building && overview === 'buildings' && TWA.building.init();
			TWA.settings.research && overview === 'tech' && TWA.research.init();
			TWA.settings.selectvillages && game_data.player.premium && TWA.selectVillages.init();
		break;
		case 'report':
			TWA.settings.reportcalc && /view\=\d+/.test( location.href ) && TWA.reportCalc();
			TWA.settings.reportfilter && TWA.reportFilter();
			TWA.settings.reportrename && game_data.player.premium && TWA.rename.reports();
		break;
		case 'am_farm':
			TWA.settings.assistentfarm && game_data.player.farm_manager && !document.getElementsByClassName( 'error' ).length && TWA.assistentfarm.init();
		break;
	}
	
	TWA.settings.attackplanner && TWA.attackplanner.init();
	TWA.settings.autofarm && TWA.autofarm.init();
	TWA.config();
	TWA.lastConquests.init();
});

})();