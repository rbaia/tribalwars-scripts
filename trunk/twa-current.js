/*!
 * Relaxeaza Tribal Wars Advanced v1.4.2
 * Release 24/05/12.
 * relaxeaza.tw@gmail.com
 *
 * v1.1
 * novo: Função para renomear relatórios.
 * novo: Função para renomear comandos na visualização.
 * alterado: Largura do display de configuração aumentada para melhor visualização.
 * bugfix: Erros de digitação na ajuda no display de configuração.
 * novo: Adicionada checkboxes para poder renomear apenas aldeias selecionadas.
 * novo: Filtro de aldeias na visualização.
 * novo: Contador de tropas em visualizações > tropas.
 * novo: Função para calcular recursos exatos em uma aldeia apartir de um relatório de espionagem.
 *
 * v1.2
 * novo: Assistente de Farm automático.
 * alterado: Algumas melhoras na performance do script.
 *
 * v1.3
 * novo: Construção e demolição em massa.
 * novo: Função para cancelar todas as construções/demolições.
 * novo: Farmador automatico.
 * bugfix: Bug ao mostrar a pontuação mínima/máxima da função de obter coordenadas.
 * novo: Atalho para ataque direto na função de calcular recursos.
 * novo: Imagem indicando que o script está trabalhando ao renomear aldeias/relatórios/comandos.
 * novo: Função para selecionar aldeias por rácio de tropas de ataque e defesa.
 * novo: Pesquisa em Massa.
 * novo: Opção para cancelar todas as pesquisas.
 *
 * v1.3.1
 * alterado: Os ataques começam mais rapido quando o Assistente de Farm é iniciado.
 * novo: Log de ataques no Assistente de Farm.
 * bugfix: Erro em algumas funções quando usado apartir do Modo de Férias
 *
 * v1.3.2
 * alterado: Layout do tooltip de ajuda no display configurações.
 * novo: Função de lembrete.
 * alterado: Cores dos identificadores de coletor de coordenadas foram alteradas para melhor visualização.
 * alterado: Agora as configurações de pontuação mínima e máxima das funções de obter coordenadas no mapa e no perfil de jogadores são configuradas na própria página.
 * novo: Agora é possivel alterar os grupos das aldeias em qualquer modo de visualização
 * novo: Planeador de ataques - envio de ataques em horários programados.
 * alterado: Agora o assistent de farm também usa a opção C quando disponível.
 *
 * v1.4
 * novo: Função para selecionar aldeias especificas na visualização, como aldeias com tropas de ataque, defesa, etc.
 * novo: Area para troca de mensagens com o desenvolvedor. (perguntas, sugestões...)
 *
 * v1.4.1
 * alterado: Forma para troca de mensagens com o desenvolvedor foi melhorada.
 */
 
 (function( window, undefined ) {
Array.prototype.remove = function( from, to ) {
	var rest = this.slice( ( to || from ) + 1 || this.length );
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply( this, rest );
};

	var twa = {
		/**
		 * @name storage
		 * @desc armazena informações no navegador para serem resgatadas mais tarde.
		 */
		storage: function( props, value, data ) {
			var name = data ? memory.data : memory.settings;
				data = data ? 'data' : 'settings';
			
			if ( props === true ) {
				localStorage[ name ] = JSON.stringify( twa[ data ] );
			} else if ( typeof props === 'string' ) {
				if ( value === undefined ) {
					return twa[ data ][ props ];
				} else {
					twa[ data ][ props ] = value;
					localStorage[ name ] = JSON.stringify( twa[ data ] );
				}
			} else if ( jQuery.isPlainObject( props ) ) {
				localStorage[ name ] = JSON.stringify( jQuery.extend( twa[ data ], props ) );
			}
			
			return true;
		},
		/**
		 * @name linkbase
		 * @descretorna o link do jogo com a aldeia atual.
		 */
		linkbase: function( screen ) {
			return game_data.link_base_pure.replace( 'screen=', 'screen=' + screen );
		},
		/**
		 * @name ready
		 * @descpega as informações necessárias para o funcionamento do script e o extecuta ao terminar.
		 */
		ready: function( callback ) {
			var inits = 0;
			var completes = 0;
			
			function ready() {
				if ( completes === inits ) {
					inits ? twa.storage( true, null, 'data' ) : 0;
					callback();
				}
			}
			
			if ( !twa.data.builds && ++inits ) {
				function buildNames () {
					twa.data.builds = {};
						jQuery.get(twa.linkbase( 'main' ), function( html ) {
						if ( jQuery( '#hide_completed:checked', html ).length ) {
							return jQuery.post( jQuery( '#hide_completed', html ).attr( 'onclick' ).toString().split( "'" )[ 1 ], {
								hide_completed: false
							}, buildNames);
						}
							jQuery( '#buildings a:has(img[src*=buildings])', html ).each(function() {
							twa.data.builds[ jQuery( this ).text().trim() ] = this.href.match( /\=(\w+)$/ )[ 1 ];
						});
							ready( ++completes );
					});
				}
					buildNames();
			}
			
			if ( !twa.data.world && ++inits ) {
				twa.data.world = {};
				
				jQuery.get('interface.php?func=get_config', function( xml ) {
					jQuery( 'config > *', xml).each(function( i, elem ) {
						if ( i < 4 ) {
							twa.data.world[ elem.nodeName ] = jQuery( elem ).text();
						} else {
							jQuery( '*', elem ).each(function() {
								twa.data.world[ this.nodeName ] = Number( jQuery( this ).text() );
							});
						}
					});
						ready( ++completes );
				});
			}
			
			if ( !twa.data.units && ++inits ) {
				twa.data.units = {};
				
				jQuery.get('interface.php?func=get_unit_info', function( xml ) {
					jQuery( 'config > *', xml ).each(function() {
						if ( this.nodeName !== 'militia' ) {
							twa.data.units[ this.nodeName ] = {
								speed: Math.round( Number( jQuery( 'speed', this ).text() ) ) * 60,
								carry: Number( jQuery( 'carry', this ).text() ),
								pop: Number( jQuery( 'pop', this ).text() )
							};
						}
					});
					
					ready( ++completes );
				});
			}
		
			ready();
		},
		/**
		 * @name config
		 * @descmostra tela de configuração do script
		 */
		config: function() {
			console.log( 'TribalWarsAdvanced->config()' );
			
			jQuery( 'head' ).append('<style>' +
				'#di textarea {border:1px solid #999;width:280px;height:80px;font-size:12px}' +
				'#di input[type="text"],#di select {border:1px solid #999;width:70px;margin:0 2px;font-size:12px}' +
				'#di button {border:1px solid #999;margin:3px}' +
				'#di {background:#c1d9ff;border:1px solid #3a5774;font-family:arial;font-size:12px;padding:4px;position:absolute;right:150px;top:150px;z-index:999}' +
				'#di .di {background:#fff;padding:5px}' +
				'#di a {color:blue;font-weight:400;text-decoration:underline}' +
				'#di h1 {background:#e4e4e4;border-bottom:1px solid #c4c4c4;border-top:1px solid #fff;color:#333;font-size:13px;font-weight:700;line-height:20px;margin:0;padding:0 7px}' +
				'#di p,#di label {margin:3px 0;display:block}' +
				'#he {background:#e0edfe;cursor:move;font-size:14px;font-weight:700;padding: 4px 20px 4px 10px}' +
				'#twa-tooltip{display:none;position:absolute;width:300px;padding:4px 4px 3px;background:#000;opacity:0.8;color:#fff;font-size:12px;border:1px solid #000;-moz-border-radius:2px;-webkit-border-radius:2px;border-radius:2px}' +
			'</style>');
			
			jQuery( 'body' ).append('<div id="di" style="width:400px">' +
				'<div id="twa-tooltip"></div>' +
				'<div id="he">Relaxeaza TWAdvanced v' + twa.data.version + '</div>' +
				'<div id="co">' +
					'<h1>Coordenadas</h1>' +
					'<div class="di">' +	
						'<label tooltip="Permite obter coordenadas do mapa.">' +
							'<input type="checkbox" name="mapcoords"/> Obter coordenadas do mapa.' +
						'</label>' +
						'<label tooltip="Permite obter coordenadas de aldeias apartir do perfil de um jogador.">' +
							'<input type="checkbox" name="profilecoords"/> Obter coordenadas por perfil.' +
						'</label>' +
						'<label tooltip="Adiciona uma marcação nas aldeias que foram obtidas coordenadas.">' +
							'<input type="checkbox" name="mapidentify"/> Identificar ao obter coordenadas' +
						'</label>' +
						'<label tooltip="Permite obter coordenadas de aldeias no mapa clicando nelas.">' +
							'<input type="checkbox" name="mapmanual"/> Obter coordenadas manualmente' +
						'</label>' +
					'</div>' +
					'<h1>Gráficos & Estatísticas</h1>' +
					'<div class="di">' +
						'<label tooltip="Mostra um gráfico de pontuação na classificação ao passar o mouse sobre o nome de algum jogador ou tribo.">' +
							'<input type="checkbox" name="rankinggraphic"/> Gráfico de pontuação na classificação.' +
						'</label>' +
						'<label tooltip="Mostra um gráfico de pontuação na página de membros de uma tribo ao passar o mouse sobre o nome de algum jogador.">' +
							'<input type="checkbox" name="allygraphic"/> Gráfico de pontuação em membros da tribo.' +
						'</label>' +
						'<label tooltip="Mostra uma área com vários gráficos de um jogador ou uma tribo no perfil do mesmo.">' +
							'<input type="checkbox" name="profilestats"/> Mostrar estatísticas de um jogador/tribo no perfil.' +
						'</label>' +
					'</div>' +
					'<h1>Outras Opções</h1>' +
					'<div class="di">' +
						'<label tooltip="Mostra quanto tempo se passou desde o último ataque no mapa.">' +
							'<input type="checkbox" name="lastattack"/> Mostrar tempo do último ataque no mapa.' +
						'</label>' +
						'<label tooltip="Mostra um campo de pesquisa por título na página de relatórios.">' +
							'<input type="checkbox" name="reportfilter"/> Campo de pesquisa nos relatórios.' +
						'</label>' +
						'<label tooltip="Mostra um campo de pesquisa na visualização para pesquisar aldeias por nome.">' +
							'<input type="checkbox" name="villagefilter"/> Pesquisa de aldeias na visualização.' +
						'</label>' +
						'<label tooltip="Mostra um campo na página de relatórios para renomear todos ou apenas os selecionados.">' +
							'<input type="checkbox" name="reportrename"/> Campo para renomear relatórios.' +
						'</label>' +
						'<label tooltip="Mostra um campo na visualização para renomear todas os comandos de apenas uma vez.">' +
							'<input type="checkbox" name="commandrename"/> Campo para renomear comandos na visualização.' +
						'</label>' +
						'<label tooltip="Mostra um campo na visualização das aldeias para renomear todas as aldeias de apenas uma vez.">' +
							'<input type="checkbox" name="villagerename"/> Campo para renomear aldeias na visualização.' +
						'</label>' +
						'<label tooltip="Gera mapas do TW Stats direto da classificação permitindo selecionar os jogadores ou tribos que estaram incluidos no mapa.">' +
							'<input type="checkbox" name="mapgenerator"/> Gerar mapa apartir da classificão.' +
						'</label>' +
						'<label tooltip="Faz o calculo da quantidade de recursos que tem atualmente em uma aldeia apartir de um relatório de espionagem e mostra a quantidade de tropas necessárias para farmar.">' +
							'<input type="checkbox" name="reportcalc"/> Calcula recursos exatas em uma aldeia.' +
						'</label>' +
						'<label tooltip="Faz o calculo da quantidade de tropas que tempo todas as aldeias visiveis em visualizações > tropas. A quantidade é mostrada no final da página.">' +
							'<input type="checkbox" name="troopcounter"/> Calcula a quantidade de tropas.' +
						'</label>' +
						'<label tooltip="Faz ataques automáticos apartir da página do Assistente de Farm.">' +
							'<input type="checkbox" name="assistentfarm"/> Assistente de Farm automático.' +
						'</label>' +
						'<label tooltip="Faz construções e demolições em massa na visualização dos edifícios.">' +
							'<input type="checkbox" name="building"/> Construção/demolição em massa.' +
						'</label>' +
						'<label tooltip="Permite enviar ataques a coordenadas pre-programadas automáticamente. Caso mantenha essa função desativada ou não a use, não correrá perigo de ser banido!">' +
							'<input type="checkbox" name="placefarm"/> Farmador Automático.' +
						'</label>' +
						'<label tooltip="Faz pesquisas em massa apartir da página de visualização de pesquisas (apenas ferreiro simples, por enquanto).">' +
							'<input type="checkbox" name="research"/> Pesquisa em massa.' +
						'</label>' +
						'<label tooltip="Permite alterar grupos em massa apartir de qualquer página das visualizações.">' +
							'<input type="checkbox" name="changegroups"/> Alterar grupos na visualização.' +
						'</label>' +
						'<label tooltip="Mostra area para lembretes na página.">' +
							'<input type="checkbox" name="memo"/> Lembrete.' +
						'</label>' +
						'<label tooltip="Faz ataques programados com horário automaticamente. Obs.: é preciso deixar uma aba com o script rodando no jogo para os ataques serem efetuados!">' +
							'<input type="checkbox" name="attackplanner"/> Planeador de ataques.' +
						'</label>' +
						'<label tooltip="Função para selecionar aldeias especificas na visualização, como aldeias com tropas de ataque, defesa, com nobres e etc...">' +
							'<input type="checkbox" name="selectvillages"/> Selecionador de aldeias.' +
						'</label>' +
					'</div>' +
					'<h1 style="text-align:center"><button id="sa">Salvar</button></h1>' +
				'</div>' +
			'</div>');

			for ( var name in twa.settings ) {
				if ( name[ 0 ] !== '_' ) {
					document.getElementsByName( name )[ 0 ][ typeof twa.settings[ name ] === 'boolean' ? 'checked' : 'value' ] = twa.settings[ name ];
				}
			}
			
			var tooltip = jQuery( '#twa-tooltip' );
				
			jQuery( '#di [tooltip]' ).mouseenter(function() {
				tooltip.html( jQuery( this ).attr( 'tooltip' ) );
				var css = jQuery( this ).position();
				css.top -= tooltip.height() + 10;
				css.left += 23;
				tooltip.css( css ).show();
			}).mouseout(function() {
				tooltip.hide();
			});
			
			jQuery( '#di' ).draggable({
				handle: '#he',
				containment: 'body'
			});

			jQuery( '#sa' ).click(function() {
				jQuery( '#di input' ).each(function() {
					twa.settings[ this.name ] = this.type === 'checkbox'
						? this.checked
						: this.value;
				});

				twa.storage( true );

				alert( 'As configurações foram salvas!' );
			});
		},
		/**
		 * @name mapelement
		 * @desc cria elementos fixos e modelaveis em qualquer area do mapa
		 */
		mapelement: function( o, css ) {
			var img = jQuery( '#map_village_' + o.id );
			var pos = o.pos || [ 0, 0 ];
			var elem = jQuery( '<div/>' ).css(jQuery.extend(css, {
				top: Number( img.css( 'top' ).replace( 'px', '' ) ) + pos[ 0 ],
				left: Number( img.css( 'left' ).replace( 'px', '' ) ) + pos[ 1 ],
				zIndex: 10,
				position: 'absolute'
			}));
				
			o.html ? elem.html( o.html ) : 0;
			o.Class ? elem.addClass( o.Class ) : 0;
			css.borderRadius ? elem.attr( 'style', elem.attr( 'style' ) + '-moz-border-radius:' + css.borderRadius + 'px;-webkit-border-radius:' + css.borderRadius + 'px' ) : 0;

			img.parent().prepend( elem );
		},
		/**
		 * @name mapvillages
		 * @desc faz um loop em todas aldeias visiveis no mapa
		 */
		mapvillages: function( callback ) {
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
		},
		/**
		 * @name currentunits
		 * @desc pega as tropas atuais de uma aldeia
		 */
		currentunits: function( html ) {
			html = html || document;

			var units = {};

			for ( var unit in twa.data.units ) {
				units[ unit ] = Number( jQuery( '[name=' + unit + ']', html ).next().text().match( /\d+/ )[ 0 ] );
			}

			return units;
		},
		/**
		 * @name mapcoords
		 * @desc pega cooredenadas de aldeias no mapa de acordo com as configurações de pontuação mínima, máxima e abandonadas.
		 */
		mapcoords: {
			init: function() {
				console.log( 'TribalWarsAdvanced->mapcoords()' );
					
				jQuery( '#map_whole').after( '<br/><table class="vis" width="100%" id="twa-getcoords"><tr><th>Coordenadas obtidas <a href="#" id="twa-mapcoords-refresh">» Atualizar</a></th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr><tr><td id="twa-getcoords-options"><label><input type="checkbox" name="_mapplayers"> Obter coordenadas de jogadores.</label> Mínimo: <input name="_mapplayersmin" style="width:35px"> Máximo: <input name="_mapplayersmax" style="width:35px"><br/><label><input name="_mapabandoneds" type="checkbox"> Obter coordenadas de abandonadas.</label> Mínimo: <input name="_mapabandonedsmin" style="width:35px"> Máximo: <input name="_mapabandonedsmax" style="width:35px"></td></tr></table>' );
					
				var timeout;
					
				jQuery( '#twa-getcoords-options input' ).each(function() {
					this[ this.type === 'checkbox' ? 'checked' : 'value' ] = twa.settings[ this.name ];
				}).change(function() {
					var elem = this;
					
					clearTimeout( timeout );
						
					timeout = setTimeout(function() {
						var value = elem[ elem.type === 'checkbox' ? 'checked' : 'value' ];
							
						twa.settings[ elem.name ] = elem.type === 'checkbox' ? value : Number( value );
						twa.storage( true );
					}, 1000);
				});
					
				jQuery( '#twa-mapcoords-refresh' ).click(function() {
					return twa.mapcoords._do();
				});

				twa.mapcoords._do();
			},
			_do: function() {
				var get;
				var coords = [];

				jQuery( '.twa-identify' ).remove();

				twa.mapvillages(function( coord ) {
					if ( this.owner === '0' ) {
						get = twa.settings._mapabandoneds && this.points > Number( twa.settings._mapabandonedsmin ) && this.points < Number( twa.settings._mapabandonedsmax );
					} else {
						get = twa.settings._mapplayers && this.points > Number( twa.settings._mapplayersmin ) && this.points < Number( twa.settings._mapplayersmax );
					}

					if ( get ) {
						coords.push( coord.join( '|' ) );

						if ( twa.settings.mapidentify ) {
							twa.mapelement({
								id: this.id,
								Class: 'twa-identify',
								pos: [ twa.settings.lastattack && game_data.player.premium ? 15 : 25, 38 ]
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

				jQuery( '#twa-getcoords textarea' ).html( coords.join( ' ' ) );

				return false;
			}
		},
		/** OK
		 * @name mapmanual
		 * @desc permite obter coordenadas do mapa clicando sobre as aldeias
		 */
		mapmanual: function() {
			console.log( 'TribalWarsAdvanced->mapmanual()' );
				
			jQuery( '#map_whole' ).after( '<br/><table class="vis" width="100%" id="twa-coordsmanual"><tr><th>Coordenadas obtidas manualmente</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr></table>' );
				
			var input = jQuery( '#twa-coordsmanual textarea' );
			var coords = [];
			var village;

			TWMap.map._handleClick = function( event ) {
				var coord = this.coordByEvent(event);

				if ( village = TWMap.villages[ coord.join( '' ) ] ) {
					coord = coord.join( '|' );

					if ( coords.indexOf( coord ) < 0 ) {
						coords.push( coord );
						input.val( coords.join( ' ' ) );

						twa.mapelement({
							id: village.id,
							Class: 'twa-coordsmanual',
							pos: [ twa.settings.lastattack && game_data.player.premium ? 15 : 25, twa.settings.mapidentify ? 28 : 38 ]
						}, {
							width: 7,
							height: 7,
							borderRadius: 10,
							background: 'red',
							border: '1px solid #000',
							opacity: 0.7
						});
					}
				}

				return false;
			}
		},
		/** OK
		 * @name profilecoords
		 * @desc pega as coordenadas de todas as aldeias pelo perfil de um jogador
		 * 
		 * @suggest remover coordenadas da lista ao clicar em uma aldeia que ja foi selecionada...
		 */
		profilecoords: function() {
			console.log( 'TribalWarsAdvanced->profilecoords()' );
				
			var points;
			var coords = [];
			var tr = document.getElementById('villages_list').getElementsByTagName('tr');

			for ( var i = 1; i < tr.length; i++ ) {
				if ( i + 1 === tr.length && !tr[ i ].getElementsByTagName( 'td' )[ 2 ] ) {
					break;
				}
					
				points = Number( tr[ i ].getElementsByTagName( 'td' )[ 2 ].innerHTML.replace( '<span class="grey">.</span>', '' ) );

				if ( points > twa.settings._profilecoordsmin && points < twa.settings._profilecoordsmax ) {
					coords.push( tr[ i ].getElementsByTagName( 'td' )[ 1 ].innerHTML );
				}
			}
				
			jQuery( '#villages_list' ).before( '<table class="vis" id="twa-profilecoords" width="100%"><tr><th>Todas coordenadas</th></tr><tr><td><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px">' + coords.join(' ') + '</textarea></td></tr><tr><td><label><input style="width:40px" name="_profilecoordsmin"/> Pontuação mínima.</label><br/><label><input style="width:40px" name="_profilecoordsmax"/> Pontuação máxima.</label></td></tr></table><br/>' );
				
			var timeout;
				
			jQuery( '#twa-profilecoords input' ).each(function() {
				this.value = twa.settings[ this.name ];
			}).change(function() {
				var elem = this;
				
				clearTimeout( timeout );
				
				timeout = setTimeout(function() {
					twa.settings[ elem.name ] = Number( elem.value );
					twa.storage( true );
				}, 1000);
			});
		},
		/** OK
		 * @name profilegraphic
		 * @desc mostra graficos da evolução de um jogador no pefil
		 */
		profilegraphic: function() {
			console.log( 'TribalWarsAdvanced->profilegraphic()' );
			
			var id = location.search.match( /\d+$/ )[ 0 ];
			var mode = game_data.screen === 'info_player' ? 'player' : 'tribe';
			var url = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/';
			var points = url + 'graph/p_' + mode + '/' + id;
			var oda = url + 'graph/oda_' + mode + '/' + id;
			var odd = url + 'graph/odd_' + mode + '/' + id;
			var html = '<table class="vis" width="100%" id="twa-graphic"><tr><th><a href="' + url + 'history/' + mode + '/' + id + '">Estatísticas <img src="http://www.hhs.gov/web/images/exit_disclaimer.png"/></a></th></tr><tr><td style="text-align:center"><p><img src="' + points + '"/></p><img src="' + oda + '"/><p><img src="' + odd + '"/></p></td></tr></table>';
				mode === 'player'
				? jQuery( '.vis:not([id^=twa]):eq(2)' ).after( '<br/>' + html )
				: jQuery( '#content_value > table tr:first' ).append( '<td valign="top">' + html + '</td>' );
		},
		/** OK
		 * @name lastattack
		 * @desc mostra a quanto tempo se passou desde o ultimo ataque em todas aldeias visiveis do mapa
		 */
		lastattack: function() {
			console.log( 'TribalWarsAdvanced->lastattack()' );
		
			jQuery( '.twa-lastattack' ).remove();
		
			twa.mapvillages(function() {
				jQuery.ajax({
					url: 'game.php?village=' + this.id + '&screen=overview&json=1&source=873',
					dataType: 'json',
					id: this.id,
					success: function( data ) {
						if ( data[0].attack ) {
							var last = data[ 0 ].attack.time.split( /\s[A-z]/ )[ 0 ].split( '.' );
								last = new Date( [ last[ 1 ], last[ 0 ], '20' + last[ 2 ] ].join( ' ' ) ).getTime();

							var now = jQuery( '#serverDate' ).text().split( '/' );
								now = new Date( [ now[ 1 ], now[ 0 ], now[ 2 ], jQuery( '#serverTime' ).text() ].join( ' ' ) ).getTime();

							var time = new Date( now - last ).getTime();
							var year = Math.floor( time / 31536E6 );
							var day = Math.floor( time / 864E5 );
							var hour = Math.floor( time / 36E5 );
							var min = Math.floor( time / 6E4 );
							var format;
							
							if ( year >= 1 ) {
								format = year + 'Ano';
							} else if ( day >= 2 ) {
								format = day + 'd' + ( hour % 24 ) + 'h';
							} else if ( hour >= 1 ) {
								min = min % 60;
								min = min < 10 ? '0' + min : min;
								hour = hour < 10 ? '0' + hour : hour;
								format = hour + ':' + min + 'h';
							} else {
								min = min < 10 ? '0' + min : min;
								format = '00:' + min + 'm';
							}

							twa.mapelement({
								id: this.id,
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
		},
		/**
		 * @name mapgenerator
		 * @desc gera mapas no TWStats apartir de qualquer lista de classificação
		 */
		mapgenerator: function() {
			console.log( 'TribalWarsAdvanced->mapgenerator()' );
			
			var base;
			var type = /ally/.test(game_data.mode) ? 't' : 'p';
			var colors = '00ff00 999999 823c0a b40000 f40000 0000f4 880088 f0c800 00a0f4 ff8800 ffff00 e0d3b8 04b45f 04b4ae 81f7f3 be81f7 fa58f4 ff0088 ffffff f7be81'.split(' ');
			var zoom = 120;
			var x = 500;
			var y = 500;

			if ( /con/.test( game_data.mode ) ) {
				base = jQuery( '#con_player_ranking_table, #con_ally_ranking_table' );
				zoom = 320;
				
				var con = jQuery( 'h3' ).html().match( /\d+/ )[ 0 ];
					con = con.length === 1 ? '0' + con : con;
				
				x = con[1] + '50';
				y = con[0] + '50';
			} else if ( /kill/.test( game_data.mode ) ) {
				base = jQuery( '#kill_player_ranking_table, #kill_ally_ranking_table' ).next();
			} else if ( game_data.mode === 'awards' ) {
				base = jQuery( '#award_ranking_table' );
			} else {
				type === 't' ? jQuery( '#ally_ranking_table tr:first th:eq(1)' ).width( 150 ) : 0;
				base = jQuery( '#player_ranking_table, #ally_ranking_table' );
			}

			base.find( 'tr:not(:first)' ).each(function( index ) {
				jQuery( 'td:eq(1)', this ).prepend( '<input class="map-item" type="checkbox" style="margin:0px;margin-right:20px" color="' + colors[ index ] + '" id="' + jQuery( 'a', this ).attr( 'href' ).match( /\d+$/ )[ 0 ] + '"/>' );
			}).eq( -1 ).after( '<tr><td colspan="8"><input type="button" id="twa-mapgenerator" value="Gerar mapa"/> <label><input type="checkbox" id="checkall"/> <strong>Selecionar todos</strong></label></td></tr>' );

			jQuery( '#twa-mapgenerator' ).click(function() {
				var url = 'http://' + game_data.market + '.twstats.com/' + game_data.world + '/index.php?page=map&';

				jQuery( '.map-item' ).each(function( index ) {
					index++;

					if ( jQuery( this ).is( ':checked' ) ) {
						url += type + 'i' + index + '=' + this.id + '&' + type + 'c' + index + '=' + jQuery( this ).attr( 'color' ) + '&';
					}
				});

				url += 'zoom=' + zoom + '&centrex=' + x + '&centrey=' + y + '&nocache=1&fill=000000&grid=1&kn=1&bm=1';

				window.open( url );
			});

			jQuery( '#checkall' ).click(function() {
				jQuery( '.map-item' ).attr( 'checked', this.checked );
			});
		},
		/** OK
		 * @name tooltipgraphic
		 * @desc mostra um tooltip quandos e passa o mouse em cima de nomes de jogadores
		 */
		tooltipgraphic: function() {
			console.log( 'TribalWarsAdvanced->tooltipgraphic()' );
			
			jQuery( '#content_value a[href*=info_player], #content_value a[href*=info_ally]' ).each(function() {
				if ( this.href.match( /\d+$/ ) ) {
					var src = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/graph/p_' + (/info_player/.test( this.href ) ? 'player' : 'tribe' ) + '/' + this.href.match( /\d+$/ )[ 0 ];

					new Image().src = src;
					this.title = '<img src="' + src + '">';

					jQuery( this ).tooltip({
						track: true,
						showURL: false
					});
				}
			});

			jQuery( '#tooltip').css('max-width', 323).addClass('twa-tooltipgraphic');
		},
		/** OK
		 * @name reportfilter
		 * @desc filtra relatorios por nome
		 */
		reportfilter: function() {
			console.log( 'TribalWarsAdvanced->reportfilter()' );
			
			jQuery( '#report_list' ).before( '<table class="vis" width="100%"><tr><th>Pesquisar relatórios: <input type="text" id="twa-reportfinder" style="padding:1px 2px;border:1px solid silver;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/></th></tr></table>' );

			jQuery( '#twa-reportfinder').keyup(function() {
				var param = this.value.toLowerCase();

				jQuery( '#report_list tr:not(:first, :last)' ).each(function() {
					jQuery( this )[ jQuery( this ).text().toLowerCase().indexOf( param ) < 0 ? 'hide' : 'show' ]();
				});
			});

			selectAll = function( form, checked ) {
				jQuery( '#report_list tr:not(:first, :last):visible input[type=checkbox]' ).attr( 'checked', checked );
			};
		},
		/**
		 * @name villagefilter
		 * @desc filtra aldeias por nome na pagina de visualização
		 */
		villagefilter: function() {
			console.log( 'TribalWarsAdvanced->villagefilter()' );
			
			var villagesExpr = '.overview_table tr:not(:first)';
			var nameExpr = 'span[id^=label_text]';

			switch( jQuery( '#overview' ).val() ) {
				case 'units':
					villagesExpr = '.overview_table tbody';
				break;
				case 'commands':
				case 'incomings':
					villagesExpr = '.overview_table tr.nowrap';
					nameExpr = 'span[id^=labelText]';
				break;
			}

			jQuery( '.overview_table' ).before( '<table class="vis" width="100%"><tr><th>Pesquisar aldeias: <input type="text" id="twa-villagefilter" style="padding:1px 2px;border:1px solid silver;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/></th></tr></table>' );

			jQuery( '#twa-villagefilter').keyup(function() {
				var param = this.value.toLowerCase();

				jQuery( villagesExpr).each(function() {
					jQuery( this )[ jQuery( nameExpr, this ).text().toLowerCase().indexOf( param ) < 0 ? 'hide' : 'show']();
				});
			});

			window.selectAll = function( form, checked) {
				jQuery( '.overview_table tr.nowrap:visible input[type=checkbox]' ).attr( 'checked', checked );
			};
		},
		/**
		 * @name troopcounter
		 * @desc faz a contagem de tropas na visualização tropas
		 */
		troopcounter: function() {
			console.log( 'TribalWarsAdvanced->troopcounter()' );
			
			jQuery( '#units_table' ).after( '<table id="twa-troopcounter" class="vis" style="width:100%;margin:0 auto"><thead>' + jQuery( '#units_table thead' ).html() + '</thead><tbody>' + jQuery( '#units_table tbody:first' ).html() + '</tbody></table>' );

			var units = {};
			var table = document.getElementById( 'twa-troopcounter' );
			var img = document.getElementById( 'units_table' ).getElementsByTagName( 'tr' )[ 0 ].getElementsByTagName( 'img' );
			var tbody = document.getElementById( 'units_table' ).getElementsByTagName( 'tbody' );
			var mytr = table.getElementsByTagName( 'tbody' )[ 0 ].getElementsByTagName( 'tr' );
			
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

			jQuery( 'td:first', table ).empty().width(jQuery( '#units_table td:first' ).width() );
			jQuery( 'th:first', table ).html( 'Contagem de Tropas:' );
			jQuery( 'th:last, td:has(a)', table ).remove();

			for ( var i = 0; i < mytr.length; i++ ) {
				for ( var name in units ) {
					var td = mytr[ i ].getElementsByTagName( 'td' )[ units[ name ][ i ][ 0 ] ];

					td.className = 'unit-item' + ( units[ name ][ i ][ 1 ] == 0 ? ' hidden' : '' );
					td.innerHTML = units[ name ][ i ][ 1 ];
				}
			}
		},
		/**
		 * @name reportcalc
		 * @desc calcula os recursos exatos que tem ne uma aldeia em
		 * um relatório de espionagem e envia um ataque com as
		 * tropas necessarias para farmar tudo.
		 */
		reportcalc: function() {
			console.log( 'TribalWarsAdvanced->reportcalc()' );
			
			if ( !jQuery( '#twa-reportcalc' ).length ) {
				jQuery( 'table[width=470]' ).before( '<table class="vis" width="470" id="twa-reportcalc"><tbody><tr><th>Unidades necessárias:</th></tr><tr><td align="center"><label><input type="checkbox" id="twa-currentvillage"> Usar unidades da aldeia atual</label></td></tr><tr><td align="center" id="twa-units"></td></tr><tr><th>Unidades calculadas: <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr><tr><td align="center" id="twa-unitscalc" style="font-weight:bold"></td></tr><tr><td align="center" id="twa-attack"><a href="#">» Atacar com essas tropas</a></td></tr></tbody></table>' );

				jQuery( document ).ajaxStart(function() {
					jQuery( '#twa-loader' ).show();
				}).ajaxStop(function() {
					jQuery( '#twa-loader' ).hide();
				});

				jQuery( '#twa-units input' ).change(function() {
					jQuery( '#twa-unitscalc > span, #twa-attack' ).hide();

					twa.reportcalc();
				});

				var unitscalc = document.getElementById( 'twa-unitscalc' );
				var unitsoptions = document.getElementById( 'twa-units' );

				for ( var name in twa.data.units ) {
					unitscalc.innerHTML += '<span id="twa-' + name + '"><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <span></span></span> ';
					unitsoptions.innerHTML += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"q><input type="checkbox"' + (name === 'spear' || name === 'archer' || name === 'spy' || name === 'ligth' || name === 'marcher' || name === 'knight' ? ' checked="true"' : '') + ' class="' + name + '"/>';
				}

				jQuery( '#twa-unitscalc > span, #twa-attack' ).hide().last().click(function() {
					jQuery.post(game_data.link_base_pure.replace( 'en=', 'en=place&try=confirm' ).replace( /village=\d+/, 'village=' + vid ), jQuery.extend({
						x: coords[ 0 ],
						y: coords[ 1 ],
						attack: true
					}, necessaryUnits), function( html ) {
						var error = jQuery( '#error', html );

						if ( error.text() ) {
							return alert( 'Ocorreu o seguinte erro ao enviar o ataque: ' + error.text() );
						}

						var form = jQuery( 'form', html );

						jQuery.post(form[ 0 ].action, form.serialize(), function() {
							alert( 'Ataque enviado com sucesso!' );
						});
					});

					return false;
				});
			}

			var discovery = jQuery( '#attack_spy tr:first td' ).text().trim().replace( /\./g, '' ).split( ' ' );
			var buildsLvl = jQuery( '#attack_spy tr:eq(1) td' ).text().replace( /\t/g, '' ).split( '\n' );
				buildsLvl = buildsLvl.splice( 1, buildsLvl.length - 2 );
			var builds = {};
			
			jQuery.each(buildsLvl, function() {
				var build = this.split( /\s\(/ );
				var level = build[1].match( /\d+/ );

				builds[ twa.data.builds[ build[ 0 ] ] ] = Number( level );
			});

			var hideSize = builds.hide === 0 ? 0 : Math.round( 150 * Math.pow( 40 / 3, ( builds.hide - 1 ) / 9 ) );
			var storageSize = ( builds.storage === 0 ? 1000 : Math.round( 1000 * Math.pow( 400, ( builds.storage - 1 ) / 29 ) ) ) - hideSize;
			var date = jQuery( '.nopad table:eq(1) tr:eq(1) td:last' ).text().split( '.' );
				date = new Date( [ date[ 1 ], date[ 0 ], '20' + date[ 2 ] ].join( ' ' ) ).getTime();            
			var now = jQuery( '#serverDate' ).text().split( '/' );
				now = new Date( [ now[ 1 ], now[ 0 ], now[ 2 ], jQuery( '#serverTime' ).text() ].join( ' ' ) ).getTime();
			var time = new Date( now - date ).getTime();
			var hour = Math.floor( time / ( 60 * 60 * 1000 ) );
			var min = Math.floor(time / ( 1000 * 60 ) ) % 60;
			var attCoords = jQuery( '#attack_info_att tr:eq(1) a' ).text().match( / \((\d+)\|(\d+)\) \w+ $/ );
			var defCoords = jQuery( '#attack_info_def tr:eq(1) a' ).text().match( / \((\d+)\|(\d+)\) \w+ $/ );
			var distance = Math.sqrt( Math.pow( Number( attCoords[ 1 ] ) - Number( defCoords[ 1 ] ), 2 ) + Math.pow( Number( attCoords[ 2 ] ) - Number( defCoords[ 2 ] ), 2 ) );
			var necessary2farm = 0;
			var necessaryUnits = {};
			var resLvl = [ builds.wood, builds.stone, builds.iron ];
			var orderUnits = [ 'knight', 'light', 'marcher', 'heavy', 'spear', 'axe', 'archer', 'sword' ];
			var farthest = 0;

			for ( var i = 0; i < orderUnits.length; i++ ) {
				if ( twa.data.units[ orderUnits[ i ] ] ) {
					var time = twa.data.units[ orderUnits[ i ] ].speed * ( distance / twa.data.world.unit_speed );
					var hour = Math.floor( time / 3600 );
					var min = Math.floor( ( time - ( hour * 3600 ) ) / 60 );
					var times = parseFloat( hour + '.' + min );
					
					if ( times > farthest ) {
						farthest = times;
					}
				}
			}

			var timeCommand = String( farthest ).split( '.' );

			discovery.map(function ( item, i ) {
				var prod = resLvl[ i ] === 0 ? 5 * twa.data.world.speed : Math.round( 30 * Math.pow( 80, ( resLvl[ i ] - 1 ) / 29 ) ) * twa.data.world.speed;

				item = Number( item );
				item += ( hour * prod ) + min * ( prod / 60 ) + ( timeCommand[ 0 ] * prod ) + ( timeCommand[ 1 ] * ( prod / 60 ) );

				if ( item > storageSize ) {
					item = storageSize;
				}

				necessary2farm += item;
			});

			var attpid = jQuery( '#attack_info_att a:first' ).attr( 'href' ).match( /\d+/ );
			var attvid = jQuery( '#attack_info_att tr:eq(1) a' ).attr( 'href' ).match( /\d+$/ );
			var coords = jQuery( '#attack_info_def a[href*=info_village]' ).text().match( /.*\((\d+)\|(\d+)\)\sK\d{1,2}/ ).slice( 1, 3 );
			var vid = game_data.village.id;

			if ( attpid === game_data.player.id ) {
				vid = jQuery( '#twa-currentvillage:checked' ).length ? curvid : attvid;
			}

			jQuery.get(game_data.link_base_pure.replace( /village=\d+/, 'village=' + vid ) + 'place', function( html ) {
				var units = twa.currentunits( html );

				for ( var i = 0; i < orderUnits.length; i++ ) {
					var unit = orderUnits[ i ];

					if ( twa.data.units[ unit ] && jQuery( '#twa-units .' + unit + ':checked' ).length ) {
						var carry = twa.data.units[ unit ].carry,
							carryLimit = units[ unit ] * carry;

						if ( units[unit] !== 0 ) {
							if ( carryLimit >= necessary2farm ) {
								necessaryUnits[ unit ] = necessary2farm / carry;
								break;
							} else {
								necessaryUnits[ unit ] = carryLimit > necessary2farm ? carry / necessary2farm : units[ unit ];
								necessary2farm -= carryLimit;
							}
						}

						if ( !necessaryUnits.spy && jQuery( '.twa-units input[value=spy]:checked' ).length && units.spy > 0 ) {
							necessaryUnits.spy = units.spy > 4 ? 5 : units.spy;
						}
					}
				}

				for ( var unit in necessaryUnits ) {
					jQuery( '#twa-' + unit ).show().find( 'span' ).html( necessaryUnits[ unit ] );
				}

				jQuery( '#twa-attack' )[ jQuery.isEmptyObject( necessaryUnits ) ? 'hide' : 'show' ]();
			});
		},
		/**
		 * @name addcheckbox
		 * @desc adiciona caixas de seleção em nomes na classificação/aldeias nas visualizações
		 */
		addcheckbox: function() {
			console.log( 'TribalWarsAdvanced->addcheckbox()' );
			
			jQuery( '.overview_table tr' ).each(function( index ) {
				if ( !index ) {
					jQuery( this ).prepend( '<th></th>' );
					
					return;
				}
				
				var vid = jQuery( 'a[href*="village="]:first', this ).attr( 'href' ).match( /village=(\d+)/ )[ 1 ];
				
				jQuery( this ).prepend( '<td><input type="checkbox" name="village_ids[]" class="addcheckbox" value="' + vid + '"/></td>' );
			});
		},
		/**
		 * @name selectvillages
		 * @desc seleciona aldeias na visualização (usando a função .addcheckbox()) de acordo com a opção desejada
		 * 
		 * Opções
		 * - Aldeias com mais tropas de ataque
		 * - Aldeias com mais tropas de defesa
		 * - Aldeias com nobres
		 * 
		 * podem ser adicionados mais tipos de configurações em .selectvillages->modes
		 */
		selectvillages: {
			init: function() {
				console.log( 'TribalWarsAdvanced->selectvillages()' );
				
				var mode = jQuery( '#overview' ).val() || 'default';
				var modes = twa.selectvillages.modes;
				var ready = false;
				
				for ( var name in modes ) {
					if ( mode === modes[ name ][ 0 ] ) {
						ready = true;
					}
				}
				
				if ( ready ) {
					jQuery( '.overview_table' ).before( '<table class="vis" width="100%"><tr><th>Selecionar aldeias: <span id="twa-selectvillages"></span></th></tr></table>' );
				}
				
				jQuery( '#combined_table tr:first th:has(img[src*="unit/unit"]) img' ).each(function() {
					twa.selectvillages.tools.unitsorder.push( this.src.match( /unit_(\w+)/ )[ 1 ] );
				});
				
				for ( var name in modes ) {
					if ( mode === modes[ name ][ 0 ] ) {
						modes[ name ][ 1 ]();
					}
				}
			},
			modes: {
				unitsattack: ['combined', function() {
					var villages = jQuery( '#combined_table tr:not(:first)' );
					
					jQuery( '<input type="checkbox" id="twa-selectvillages-unitsattack">' ).change(function() {
						for ( var i = 0; i < villages.length; i++ ) {
							var units = twa.selectvillages.tools.getunits( villages[ i ] );
							var popatt = twa.selectvillages.tools.getpop( 'att', units );
							var popdef = twa.selectvillages.tools.getpop( 'def', units );
							
							if ( popatt > popdef ) {
								jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
							}
						}
					}).add( ' <label for="twa-selectvillages-unitsattack">com tropas de ataque</label>' ).appendTo( '#twa-selectvillages' );
				}],
				unitsdefence: ['combined', function() {
					var villages = jQuery( '#combined_table tr:not(:first)' );
					
					jQuery( '<input type="checkbox" id="twa-selectvillages-unitsdefence">' ).change(function() {
						for ( var i = 0; i < villages.length; i++ ) {
							var units = twa.selectvillages.tools.getunits( villages[ i ] );
							var popatt = twa.selectvillages.tools.getpop( 'att', units );
							var popdef = twa.selectvillages.tools.getpop( 'def', units );
							
							if ( popatt < popdef ) {
								jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
							}
						}
					}).add( ' <label for="twa-selectvillages-unitsdefence">com tropas de defesa</label>' ).appendTo( '#twa-selectvillages' );
				}],
				unitsnob: ['combined', function() {
					var villages = jQuery( '#combined_table tr:not(:first)' );
					
					jQuery( '<input type="checkbox" id="twa-selectvillages-unitsnob">' ).change(function() {
						for ( var i = 0; i < villages.length; i++ ) {
							var units = twa.selectvillages.tools.getunits( villages[ i ] );
							
							if ( units.snob > 0 ) {
								jQuery( '.addcheckbox', villages[ i ] ).attr( 'checked', this.checked );
							}
						}
					}).add( ' <label for="twa-selectvillages-unitsnob">com nobres</label>' ).appendTo( '#twa-selectvillages' );
				}]
			},
			tools: {
				getunits: function( village ) {
					var elems = jQuery( '.unit-item', village );
					var units = {};
					
					elems = elems.add( elems.next().last() );
					
					for ( var i = 0; i < twa.selectvillages.tools.unitsorder.length; i++ ) {
						units[ twa.selectvillages.tools.unitsorder[ i ] ] = Number( elems.eq( i ).text() );
					}
					
					return units;
				},
				getpop: function( type, units ) {
					var pop = 0;
					
					switch ( type ) {
						case 'att':
							for ( var i = 0; i < twa.selectvillages.tools.unitsatt.length; i++ ) {
								var unit = twa.selectvillages.tools.unitsatt[ i ];
								
								pop += units[ unit ] * twa.data.units[ unit ].pop;
							}
						break;
						case 'def':
							for ( var i = 0; i < twa.selectvillages.tools.unitsdef.length; i++ ) {
								var unit = twa.selectvillages.tools.unitsdef[ i ];
								
								pop += units[ unit ] * twa.data.units[ unit ].pop;
							}
						break;
						case 'all':
							for ( var i in units ) {
								pop += units[ i ] * twa.data.units[ units[ i ] ].pop;
							}
						break;
					}
					
					return pop;
				},
				unitsatt: [ 'axe', 'light', 'marcher', 'ram', 'catapult', 'knight', 'snob' ],
				unitsdef: [ 'light', 'sword', 'archer', 'heavy' ],
				unitsorder: []
			}
		},
		
		rename: {
			init: function ( expr, type, id, l ) {
				console.log( 'TribalWarsAdvanced->rename()' );
				
				var elem = jQuery( expr );
				
				if ( expr !== '.overview_table' ) {
					elem = elem.parent();
				}
				
				elem.before( '<table class="vis" width="100%"><tr><th>Renomear ' + type + ': <input type="text" id="twa-' + id + '" style="padding:1px 2px;border:1px solid red;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/> <input type="button" value="Renomear"/><label><input type="checkbox" id="twa-onlyselected"/> Apenas ' + type + ' selecionad' + l + 's</label> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr></table>' );

				jQuery( document ).ajaxStart(function() {
					jQuery( '#twa-loader' ).show();
				}).ajaxStop(function() {
					jQuery( '#twa-loader' ).hide();
				});
			},
			reports: function() {
				twa.rename.init( '#report_list', 'relatórios', 'reportrename', 'o' );

				twa.rename._do({
					entry: '#twa-reportrename',
					input: '#report_list tr:not(:first, :last):visible input:not([type=checkbox])',
					inputChecked: '#report_list tr:not(:first, :last):visible:has(input:checked) input:not([type=checkbox])'
				});
			},
			commands: function() {
				twa.rename.init('.overview_table', 'comandos', 'commandrename', 'o');
				jQuery( '.overview_table input[type=checkbox]').removeAttr('disabled');

				twa.rename._do({
					entry: '#twa-commandrename',
					input: '.overview_table tr:not(:first, :last):visible input[id^=editInput]',
					inputChecked: '.overview_table tr:not(:first, :last):visible:has(input:checked) input[id^=editInput]'
				});
			},
			villages: function() {
				twa.rename.init( '.overview_table', 'aldeias', 'villagerename', 'a' );
				
				twa.rename._do({
					entry: '#twa-villagerename',
					input: '.overview_table tr:not(:first):visible input[id^=edit_input]',
					inputChecked: '.overview_table tr:not(:first):visible:has(input:checked) input[id^=edit_input]',
					min: 3,
					max: 32
				});
			},
			_do: function ( o ) {
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

				jQuery( o.entry ).next().click(function() {
					handle.call( jQuery( this ).prev(), true );
				});
			}
		},
		
		farm: {
			assistent: {
				id: 0,
				init: function() {
					console.log( 'TribalWarsAdvanced->farm->assistent()' );
					
					jQuery( 'h3:first' ).append( ' <span id="twa-assistentfarm">(Automático)</span>' );

					jQuery( '#farm_units' ).parent().after( '<div class="vis" style="overflow:auto;height:100px"><table style="width:100%"><tr id="twa-assistent-log"><th><h4>Farm Assistent Log</h4></th></tr></table></div>' );
					
					twa.farm.assistent.prepare();
				},
				log: function ( log, error ) {
					jQuery( '#twa-assistent-log' ).after( '<tr><td>' + ( twa.farm.assistent.id++ ) + ': <img src="' + ( error ? '/graphic/delete_small.png' : '/graphic/command/attack.png' ) + '"/> ' + log + '</td></tr>' );
				},
				prepare: function() {
					var elems = [];
					var index = 0;
					
					jQuery.get(location.href, function( html ) {
						jQuery( '#am_widget_Farm table tr[class]', html ).each(function() {
							elems.push( this );
						});
						
						setInterval(function() {
							twa.farm.assistent.attack( elems[ index ] );
							
							if ( ++index === elems.length ) {
								index = 0;
							}
						}, 5000);
					});
				},
				attackHandler: {
					sendUnits: function( village, template, name ) {
						jQuery.ajax({
							type: 'POST',
							url: Accountmanager.send_units_link,
							data: { target: village, template_id: template },
							village: name,
							success: function( complete ) {
								complete = JSON.parse( complete );
								
								if ( complete.success ) {
									twa.farm.assistent.log( complete.success.replace( '\n', ' ' ) + ' na aldeia ' + this.village );
								} else if ( complete.error ) {
									twa.farm.assistent.log( complete.error + ' na aldeia ' + this.village, true );
								}
							}
						});
					},
					reportAttack: function( village, report, name ) {
						jQuery.ajax({
							type: 'POST',
							url: Accountmanager.send_units_link_from_report,
							data: { report_id: report },
							village: name,
							success: function( complete ) {
								complete = JSON.parse( complete );
								
								if ( complete.success ) {
									twa.farm.assistent.log( complete.success.replace( '\n', ' ' ) + ' na aldeia ' + this.village );
								} else if ( complete.error ) {
									twa.farm.assistent.log( complete.error + ' na aldeia ' + this.village, true );
								}
							}
						});
					}
				},
				attack: function ( elem ) {
					var icon_a = jQuery( '.farm_icon_a:not(.farm_icon_disabled)', elem ),
						icon_b = jQuery( '.farm_icon_b:not(.farm_icon_disabled)', elem ),
						icon_c = jQuery( '.farm_icon_c:not(.farm_icon_disabled)', elem ),
						index = icon_c.length ? 10 : icon_a.length ? 8 : icon_b.length ? 9 : 0;
					
					var data = jQuery( 'td:eq(' + index + ') a', elem ).attr( 'onclick' ).toString().match( /(\d+), (\d+)/ );
					
					twa.farm.assistent.attackHandler[ index === 10 ? 'reportAttack' : 'sendUnits' ]( data[ 1 ], data[ 2 ], jQuery( 'td:eq(3) a', elem ).html() );
				}
			},
			place: {
				init: function() {
					console.log( 'TribalWarsAdvanced->farm->place()' );
					
					jQuery( '#content_value').prepend( '<table class="vis" id="twa-farm" width="100%"><tr><td><h3 style="margin-bottom:5px">Farmador Automático</h3><table width="100%" class="vis"><tbody><tr><td id="twa-farm-units"></td></tr></tbody></table><p style="margin-top:0px"><label><input type="checkbox" class="twa-farm-options" name="_placefarmprotect"/> Não enviar ataques caso a aldeia tenha dono.</label><br/><label><input type="checkbox" class="twa-farm-options" name="_placefarmreplace"/> Caso não tenha tropas sulficientes usar o que tiver.</label><p><strong>Coordenadas:</strong><br/><textarea class="twa-farm-options" style="width:340px;height:90px">' + twa.settings._placefarmcoords.join( ' ' ) + '</textarea></p></p><input type="button" value="Iniciar ataques" id="twa-farm-switch"/></td></tr></table>' );

					var elems = document.getElementById('twa-farm-units');
					var timeout = false;

					for ( var name in twa.data.units ) {
						elems.innerHTML += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input name="' + name + '" style="width:30px" class="twa-farm-options"/> ';
					}

					jQuery( '.twa-farm-options' ).each(function() {
						if ( this.type === 'text' || jQuery.nodeName( this, 'textarea' ) ) {
							if ( this.type === 'text' ) {
								this.value = twa.settings._placefarmunits[ this.name ] || 0;
							} else {
								this.value = twa.settings._placefarmcoords.join( ' ' );
							}

							jQuery( this ).keyup(function() {
								var elem = this;
								
								this.value = this.value.replace( /[^0-9\|\s]/g, '' ).replace( /\s+/, ' ' );
								
								clearTimeout( timeout );
								
								timeout = setTimeout(function() {
									if ( elem.type === 'text' ) {
										twa.settings._placefarmunits[ elem.name ] = twa.farm.place.data[ elem.name ] = elem.value;
									} else {
										var coords = elem.value.split(/\s+/);
										var correctCoords = [];
										
										for ( var i = 0; i < coords.length; i++ ) {
											if ( /-?\d{1,3}\|-?\d{1,3}/.test( coords[ i ] ) ) {
												correctCoords.push( coords[ i ] );
											}
										}

										twa.settings._placefarmcoords = correctCoords;
										twa.farm.place.next( true );
									}

									twa.storage( true );
								}, 1000);
							});
						} else {
							jQuery( this ).change(function() {
								twa.settings[ this.name ] = this.checked;
								twa.storage( true );
							});
						}
					});

					jQuery( '#twa-farm-switch' ).click(function() {
						twa.farm.place.stop = !twa.farm.place.stop;
						this.value = twa.farm.place.stop ? 'Continuar ataques' : 'Pausar ataques';
						!twa.farm.place.stop ? twa.farm.place.attack() : 0;
					});

					for ( var timer in timers ) {
						timers[ timer ].reload = false;
					}
					
					for ( name in twa.data.units ) {
						twa.farm.place.data[ name ] = twa.settings._placefarmunits[ name ];
					}

					if ( twa.settings._placefarmindex >= twa.settings._placefarmcoords.length ) {
						twa.settings._placefarmindex = 0;
					}

					if ( twa.settings._placefarmcoords.length ) {
						twa.farm.place.coord = twa.settings._placefarmcoords[ twa.settings._placefarmindex ].split( '|' );
					}
				},
				attack: function( units ) {
					if ( !twa.farm.place.stop ) {
						if ( !twa.farm.place.wait ) {
							twa.farm.place.data.x = twa.farm.place.coord[0];
							twa.farm.place.data.y = twa.farm.place.coord[1];

							if ( units) {
								for ( var unit in units ) {
									twa.farm.place.data[ unit ] = units[ unit ];
								}
							}

							jQuery.post(game_data.link_base_pure.replace('en=', 'en=place&try=confirm'), twa.farm.place.data, function( html) {
								var error = jQuery( html).find('#error');

								if ( error.text()) {
									var time = twa.farm.place.nextReturn(html);
									var troops = twa.farm.place.currentunits(html);

									if ( time && !troops) {
										setTimeout(function() {
											twa.farm.place.wait = false;
											twa.farm.place.attack();
										}, time);

										twa.farm.place.wait = true;
									} else if ( !time && !troops ) {
										twa.farm.place.wait = true;
									} else {
										twa.farm.place.attack( troops );
									}

									return;
								}

								if ( twa.settings._placefarmprotect && jQuery( html ).find( 'form a[href*=player]' ).length ) {
									return twa.farm.place.next();
								}

								var form = jQuery( html ).find( 'form' );

								jQuery.post(form[ 0 ].action, form.serialize(), function() {
									twa.farm.place.next();
								});
							});
						}
					} else {
						var id = setInterval(function() {
							if ( !twa.farm.place.stop) {
								twa.farm.place.attack();
								clearInterval(id);
							}
						}, 500);
					}
				},
				nextReturn: function( html ) {
					var line = jQuery( 'table.vis:last tr:not(:first)', html );
					var returning = line.find( '[src*=cancel], [src*=back], [src*=return]' );
					var going = line.find( '[src*=attack]' );
					var time = returning.length ? returning : going.length ? going : false;
					var going = going.length ? 2 : 1;

					if ( !time ) {
						return false;
					}

					if ( time = time.eq( 0 ).parent().parent().find( '.timer' ).text() ) {
						time = time.split( ':' );

						return time[ 0 ] * 36E5 + time[ 1 ] * 6E4 + time[ 2 ] * 1E3 * going;
					}
				},
				currentunits: function( html ) {
					var troops = {};

					if ( twa.settings._placefarmreplace ) {
						jQuery( '.unitsInput', html ).each(function() {
							var unit = this.id.match( /_(\w+)$/ )[ 1 ];
							var amount = jQuery( this ).next().text().match( /\d+/ )[ 0 ];

							if ( twa.settings._placefarmunits[ unit ] && twa.settings._placefarmunits[ unit ] > amount ) {
								troops[ unit ] = amount;
							}
						});
					}

					return !jQuery.isEmptyObject( troops ) ? troops : false;
				},
				next: function( check ) {
					if ( !check ) {
						twa.settings._placefarmindex++;
					}

					if ( twa.settings._placefarmindex >= twa.settings._placefarmcoords.length ) {
						twa.settings._placefarmindex = 0;
					}

					twa.storage( true );

					if ( twa.settings._placefarmcoords.length ) {
						twa.farm.place.coord = twa.settings._placefarmcoords[ twa.settings._placefarmindex ].split( '|' );
					}

					if ( !check ) {
						twa.farm.place.attack();
					}
				},
				stop: true,
				wait: false,
				data: { attack: true },
				coord: []
			}
		},
		
		building: {
			init: function() {
				console.log( 'TribalWarsAdvanced->building()' );
				
				jQuery( '.overview_table' ).before( '<table class="vis" id="twa-building" width="100%"><tr><th><label><input type="radio" checked name="twa-building" id="twa-building-build"/> Construção em Massa - Edifícios <img src="graphic/questionmark.png" width="13" title="Os edifícios serão construidos até o nível indicado abaixo!"/></label> <a href="#" id="twa-cancel-builds">» Cancelar todas as contruções</a></th></tr><tr><td class="twa-buildings"></td></tr><tr><th><label><input type="radio" name="twa-building" id="twa-building-destroy"/> Demolição em Massa - Edifícios <img src="graphic/questionmark.png" width="13" title="Os edifícios serão demolidos até o nível indicado abaixo!"/></label> <a href="#" id="twa-cancel-destroy">» Cancelar todas as demolições</a></th></tr><tr><td class="twa-buildings"></td></tr></table><table class="vis" width="100%"><tr><th>Clique no icone dos edifícios abaixo para iniciar a construção em massa do edifício clicado.</th></tr></table>' );

				jQuery( '#twa-building-build, #twa-building-destroy' ).click(function() {
					if ( ( BuildingOverview._display_type === 1 && this.id === 'twa-building-destroy' ) || ( BuildingOverview._display_type === 0 && this.id === 'twa-building-build' ) ) {
						return;
					}

					BuildingOverview.show_all_upgrade_buildings( this.id === 'twa-building-destroy' );
				});

				jQuery( '#twa-cancel-builds, #twa-cancel-destroy' ).click(function() {
					if ( confirm( 'Tem certeza que deseja cancelar todas as ' + ( this.id === 'twa-cancel-destroy' ? 'demolições' : 'construções' ) + '?' ) ) {
						twa.building.cancel( this.id === 'twa-cancel-destroy' );
					}

					return false;
				});

				if ( BuildingOverview._display_type === false ) {
					BuildingOverview.show_all_upgrade_buildings();
				} else if ( BuildingOverview._display_type ) {
					jQuery( '#twa-building-destroy' ).attr( 'checked', true );
				}

				for ( var i = 0; i < 2; i++ ) {
					var td = jQuery( '.twa-buildings').eq(i);

					for ( var build in twa.data.builds ) {
						build = twa.data.builds[ build ];

						td.append( '<img src="graphic/buildings/' + build + '.png"/> <input type="text" style="width:25px" name="' + build + '" value="' + twa.settings[ i ? '_buildingdestroy' : '_buildingbuild' ][ build ] + '"/> ' );
					}
				}
				
				var timeout;

				jQuery( '.twa-buildings' ).each(function( tableIndex ) {
					jQuery( 'input', this ).keyup(function() {
						var index = tableIndex;
						var elem = this;

						clearTimeout( timeout );
						
						setTimeout(function() {
							twa.settings[ index ? '_buildingdestroy' : '_buildingbuild' ][ elem.name ] = elem.value;
							twa.storage( true );
						}, 2000);
					}).keypress(function( event ) {
						return event.charCode > 47 && event.charCode < 58 && this.value.length < 3;
					});
				});

				jQuery( '#buildings_table tr:first th:has(img[src*=buildings]) a' ).click(function() {
					return twa.building._do( jQuery( 'img', this )[ 0 ].src.match( /\/([a-z]+)\.png/ )[ 1 ], BuildingOverview._display_type );
				});
			},
			_do: function( build, destroy ) {
				var url = document.getElementById( 'upgrade_building_link' ).value;
				var max = destroy ? 5 : twa.settings._buildingmaxorders;
				var limit = jQuery( '.twa-buildings' ).eq( destroy ).find( 'input[name=' + build + ']' ).val();

				jQuery( '#buildings_table tr:not(:first)' ).each(function() {
					var villageid = this.className.match( /\d+/ )[ 0 ];

					if ( BuildingOverview._upgrade_villages[ villageid ].buildings[ build ] ) {
						var currentOrders = jQuery( 'td:last li:has(.build-status-light[style*=' + ( destroy ? 'red' : 'green' ) + ']) img[src*="' + build + '.png"]', this );
						var current = Number( jQuery( '.b_' + build + ' a', this ).text() ) + currentOrders.length;

						currentOrders.parent().parent().find( '.build-cancel-icon img' ).click();

						for ( var orders = jQuery( '#building_order_' + villageid + ' img' ).length; orders < max; orders++ ) {
							if ( destroy ? current-- > limit : current++ < limit ) {
								jQuery.getJSON(url.replace( /village=\d+/, 'village=' + villageid ), {
									id: build,
									destroy: destroy,
									force: 1
								}, function( complete ) {
									if ( complete.success ) {
										if ( !document.getElementById( 'building_order_' + villageid ) ) {
											var ul = jQuery( '<ul class="building_order" id="building_order_' + villageid + '"></ul>' );

											BuildingOverview.create_sortable( ul );
											jQuery( '#v_' + villageid + ' td:last' ).append( ul );
										}

										jQuery( '#building_order_' + villageid ).html( complete.building_orders );
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
		},
		
		research: {
			init: function() {
				console.log( 'TribalWarsAdvanced->research()' );
				
				jQuery( '.overview_table' ).before( '<table class="vis" width="100%" id="twa-research"><tr><th>Clique no icone das unidades abaixo para iniciar a pesquisa em massa da unidade clicada. <a href="#" id="twa-research-cancel">» Cancelar todas as pesquisas</a></th></tr></table>' );

				jQuery( '#twa-research-cancel' ).click(function() {
					if ( confirm( 'Tem certeza que deseja cancelar todas as pesquisas?' ) ) {
						twa.research.cancel();
					}

					return false;
				});

				jQuery( '#techs_table tr:first a:has(img)' ).click(function() {
					return twa.research._do( this.href.match( /order=(\w+)/ )[ 1 ] );
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
		},
		
		memo: {
			init: function() {
				console.log( 'TribalWarsAdvanced->memo()' );
				
				jQuery( 'body' ).append( '<div id="twa-memo-content" class="popup_content" style="padding:5px;border: 2px solid #840;z-index:999;display:none;position:absolute"><textarea style="width:400px;height:150px"></textarea><br/><input type="button" value="Salvar"/> <span id="twa-memo-time" style="font-style:italic;font-size:10px"></span> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px"/></div>' );
				jQuery( '#header_info td:first' ).after( '<td class="topAlign"><table class="header-border" style="margin-left:5px"><tbody><tr><td><table class="box menu nowrap"><tbody><tr id="menu_row2"><td class="box-item" style="height: 22px;"><img src="http://cdn.tribalwars.net/graphic/overview/note.png" style="position:absolute"/> <a style="margin-left:17px" href="#" id="twa-memo">Lembrete</a></td></tr></tbody></table></td></tr><tr class="newStyleOnly"><td class="shadow"><div class="leftshadow"> </div><div class="rightshadow"> </div></td></tr></tbody></table></td>' );
				
				twa.memo.content = jQuery( '#twa-memo-content' );
				
				var css = jQuery( '#twa-memo' ).click(function() {
					twa.memo.content.toggle();

					return false;
				}).position();

				css.top += 25;
				
				twa.memo.content.css( css ).find( 'input' ).click(function() {
					if ( !twa.memo.content.find( 'img' ).is( ':visible' ) ) {
						twa.memo.edit();
					}
				});
				
				twa.memo.getContent(function( note, time ) {
					jQuery( '#twa-memo-time' ).html( 'Última alteração: ' + ( time || 'nunca.' ) );
					twa.memo.content.find( 'textarea' ).val( note );
					twa.memo.content.find( 'img' ).hide();
				});
			},
			getElement: function( callback ) {
				var elem;
				
				jQuery.get(twa.linkbase( 'memo' ), function( html ) {
					if ( twa.settings._memoid && jQuery( '#' + twa.settings._memoid, html ).length ) {
						elem = jQuery( '#' + twa.settings._memoid, html );
					} else {
						var lower = 60000;

						jQuery( '.memo_container', html ).each(function() {
							var textarea = jQuery( 'textarea', this );

							if ( textarea.val().length < lower ) {
								lower = textarea.val().length;
								elem = textarea;
							}
						});
						
						twa.storage( '_memoid', elem[ 0 ].id );
					}
					
					callback( elem );
				});
			},
			getContent: function( callback ) {
				twa.memo.getElement(function( elem ) {
					var match = elem.val().match( /\[twanote\]([^]+)\[\/twanote\-([0-9:\/\s]+)\]/ );
					
					callback.apply( window, match && match[ 1 ] ? [ match[ 1 ], match[ 2 ] ] : [] );
				});
			},
			edit: function() {
				twa.memo.content.find( 'img' ).show();
				
				twa.memo.getElement(function( elem ) {
					var elemTime = jQuery( '.server_info span' );
					var time = elemTime[ 0 ].innerHTML + ' ' + elemTime[ 1 ].innerHTML;
					
					if ( /\[twanote\]([^]+)\[\/twanote\-[0-9:\/\s]+\]/.test( elem.val() ) ) {
						elem.val( elem.val().replace( /\[twanote\]([^]+)\[\/twanote\-[0-9:\/\s]+\]/, '[twanote]' + twa.memo.content.find( 'textarea' ).val() + '[/twanote-' + time + ']' ) );
					} else {
						elem.val( elem.val() + '\n\n[twanote]' + twa.memo.content.find( 'textarea' ).val() + '[/twanote-' + time + ']' );
					}
					
					jQuery( '#twa-memo-time' ).html( 'Última alteração: ' + time );
					
					var form = elem.parentsUntil( '.memo_script' ).last();
					
					jQuery.post(form[ 0 ].action, form.serialize(), function() {
						twa.memo.content.find( 'img' ).hide();
					});
				});
			}
		},
		
		changegroups: {
			init: function() {
				console.log( 'TribalWarsAdvanced->changegroups()' );
				
				jQuery( '.overview_table' ).before( '<table class="vis" width="100%" id="twa-changegroups"><tr><th>Alterar grupos das aldeias selecionadas: <select id="twa-group" name="selected_group"></select> <input type="submit" value="Adicionar" name="add_to_group"/> <input type="submit" value="Remover" name="remove_from_group"/> <input type="submit" value="Mover" name="change_group"/> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr></table>' );

				jQuery( '#twa-changegroups input' ).click(function() {
					twa.changegroups.change( this );
				});
				
				var elemGroups = document.getElementById( 'twa-group' );
				var groups = twa.changegroups.getgroups();
				
				for ( var id in groups ) {
					elemGroups.innerHTML += '<option value="' + id + '" name="village_ids[]">' + groups[ id ] + '</option>';
				}
				
				jQuery( '#combined_table tr.nowrap' )
			},
			change: function( button ) {
				jQuery( '#twa-loader' ).show();
				
				var data = jQuery( '[name="village_ids[]"], [name=selected_group]' ).serializeArray();
					data.push( { name: button.name, value: button.value } );
				
				console.log( data );
				
				jQuery.post(twa.linkbase( 'overview_villages' ) + '&mode=groups&action=bulk_edit_villages&h=' + game_data.csrf, data, function() {
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
		},
		
		attackplanner: {
			villages: {},
			init: function() {
				console.log( 'TribalWarsAdvanced->attackplanner()' );
				
				jQuery( '#header_info td:first' ).after( '<td class="topAlign"><table class="header-border" style="margin-left:5px"><tbody><tr><td><table class="box menu nowrap"><tbody><tr id="menu_row2"><td class="box-item" style="height: 22px;"><img style="position:absolute" src="http://cdn.tribalwars.com.br/graphic/command/attack.png"> <a id="twa-attackplanner" href="#" style="margin-left: 17px;">Planeador</a></td></tr></tbody></table></td></tr><tr class="newStyleOnly"><td class="shadow"><div class="leftshadow"> </div><div class="rightshadow"> </div></td></tr></tbody></table></td>' );
				jQuery( 'body' ).append( '<div id="twa-attackplanner-content" class="popup_content" style="width:' + jQuery( '#content_value' ).width() + 'px;padding:5px;border:2px solid #840;z-index:999;display:none;position:absolute"><style>#twa-attackplanner-content td{padding:3px}</style><h2>Planeador de ataque</h2><h3>Adicionar comando</h3><table class="vis" width="100%"><tr><th colspan="4">Aldeia atacante</th><th colspan="4">Aldeia alvo</th><th colspan="4">Horário de envio</th></tr><tr><td colspan="4"><input value="xxx|yyy" style="width:90px;border:1px solid red" name="from"/></td><td colspan="4"><input style="width:90px;border:1px solid red" value="xxx|yyy" name="to"/></td><td colspan="4"><input name="time" value="hh:mm:ss dd/mm/yyyy" style="color:#ccc;font-style:italic;width:200px;border:1px solid red"/></td></tr><tr><th colspan="12">Tropas</th></tr><tr id="twa-units"></tr><tr><td colspan="12"><button name="add">Adicionar comando</button></td></tr></table><h3>Comandos</h3><table class="vis" width="100%" id="twa-commands"><tr><th>Aldeia atacante</th><th>Aldeia alvo</th><th>Horário de envio</th><th>Tropas</th><th>Remover</th></tr></table></div>' );
				
				jQuery
				
				var content = jQuery( '#twa-attackplanner-content' ).center().css( 'top', jQuery( '#content_value' ).offset().top );
				var unitsContent = document.getElementById( 'twa-units' );
				var inputs = content.find( 'input' ).css({
					fontStyle: 'italic',
					color: '#ccc',
					textAlign: 'center'
				}).focus(function() {
					if ( ( ( this.name === 'from' || this.name === 'to' ) && this.value === 'xxx|yyy' ) || this.name === 'time' && this.value === 'hh:mm:ss dd/mm/yyyy' ) {
						this.value = '';
						jQuery( this ).css( { fontStyle: 'normal', color: 'black' } );
					}
				}).blur(function() {
					if ( this.value !== '' ) return;
					this.value = this.name === 'time' ? 'hh:mm:ss dd/mm/yyyy' : 'xxx|yyy';
					jQuery( this ).css( { fontStyle: 'italic', color: '#ccc' } );
				});
				
				var ctime = jQuery( '.server_info:last span' );
				
				jQuery( '#twa-attackplanner' ).click(function() {
					content.toggle();
					return false;
				});
				
				for ( var name in twa.data.units ) {
					unitsContent.innerHTML += '<td><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input style="width:33px;border:1px solid #aaa" class="twa-units" name="' + name + '"/></td> ';
				}
				
				function add() {
					for ( var i = 0; i < inputs.length; i++ ) {
						inputs[ i ].value = jQuery.trim( inputs[ i ].value );
					}
					
					if ( inputs[ 0 ].value === inputs[ 1 ].value && inputs[ 0 ].value !== 'xxx|yyy' && inputs[ 1 ].value !== 'xxx|yyy' ) {
						return alert( 'As coordenadas da aldeia atacante não pode ser a mesma da aldeia de destino!' );
					}
					
					if ( jQuery( '[name=from]' )[ 0 ].style.borderColor === 'red' || jQuery( '[name=to]' )[ 0 ].style.borderColor === 'red' || jQuery( '[name=time]' )[ 0 ].style.borderColor === 'red' ) {
						return false;
					}
					
					var inserted = false;
					var itime = inputs[ 2 ].value.split( ' ' );
					var date = itime[ 1 ].split( '/' );
					var attackdata = {
						target: inputs[ 1 ].value,
						village: inputs[ 0 ].value,
						time: new Date( date[ 1 ] + '/' + date[ 0 ] + '/' + date[ 2 ] + ' ' + itime[ 0 ] ).getTime(),
						units: {}
					};
					
					units.each(function() {
						if ( this.value || Number( this.value ) > 0 ) {
							attackdata.units[ this.name ] = Number( this.value );
							inserted = true;
						}
					});
					
					if ( !inserted ) {
						return alert( 'Você não inseriu nenhuma unidade!' );
					}
					
					twa.data.plannercmds.push( attackdata );
					twa.attackplanner.update();
					twa.storage( true, null, 'data' );
				}
				
				content.find( 'button' ).click( add );
				
				var units = jQuery( '.twa-units' ).keydown(function( event ) {
					event.keyCode === 13 ? add() : null;
				});
				
				inputs.keyup(function() {
					if ( ( this.name === 'time' ? /[^\d\:\/\s]+/g : /[^\d\|]+/g).test( this.value ) ) {
						this.value = this.value.replace( this.name === 'time' ? /[^\d\:\/\s]+/g : /[^\d\|]+/g, '' );
					}
					
					if ( this.name === 'time' ) {
						if ( /^(\d{2}:){2}\d\d (\d{2}\/){2}\d{4}$/.test( this.value ) ) {
							var itime = this.value.split( ' ' );
							var date = itime[ 1 ].split( '/' );
							var time = new Date( date[ 1 ] + '/' + date[ 0 ] + '/' + date[ 2 ] + ' ' + itime[ 0 ] );
							var cdate = ctime.eq( 1 ).text().split( '/' );
							var current = new Date( cdate[ 1 ] + '/' + cdate[ 0 ] + '/' + cdate[ 2 ] + ' ' + ctime.eq( 0 ).text() );
							
							this.style.border = '1px solid ' + ( current > time ? 'red' : '#aaa' );
						} else {
							this.style.border = '1px solid red';
						}
					} else {
						this.style.border = '1px solid ' + ( /^\d{1,3}\|\d{1,3}$/.test( this.value ) ? '#aaa' : 'red' );
					}
				}).keydown(function( event ) {
					event.keyCode === 13 ? add() : null;
				});
				
				twa.attackplanner.update(function() {
					setInterval(function() {
						twa.attackplanner.checkattacks();
					}, 1000);
				});
			},
			update: function( callback ) {
				if ( twa.attackplanner.mailLink ) {
					twa.attackplanner.updatefn( callback );
				} else {
					jQuery.get(twa.linkbase( 'mail' ), function( html ) {
						twa.attackplanner.mailLink = twa.linkbase( 'mail' ) + '&mode=new&action=send&h=' + html.match( /"csrf":"(\w+)"/ )[ 1 ];
						twa.attackplanner.updatefn( callback );
					});
				}
			},
			updatefn: function( callback ) {
				if ( twa.data.plannercmds.length ) {
					var cmds = twa.data.plannercmds.sort(function( a, b ) {
						return a.time - b.time;
					});
					
					var cmdsc = jQuery( '#twa-commands' );
						cmdsc.find( 'tr:not(:first)' ).remove();
					
					for ( var i = 0; i < cmds.length; i++ ) {
						var date = new Date( cmds[ i ].time );
						var hour = date.getHours();
						var min = date.getMinutes();
						var sec = date.getSeconds();
						var day = date.getDay();
						var month = date.getMonth();
						var year = date.getFullYear();
						var units = [];
						
						hour = hour < 10 ? '0' + hour : hour;
						min = min < 10 ? '0' + min : min;
						sec = sec < 10 ? '0' + sec : sec;
						day = day < 10 ? '0' + day : day;
						month = month < 10 ? '0' + month : month;
						
						for ( var unit in cmds[ i ].units ) {
							units.push( '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + unit + '.png"/> ' + cmds[ i ].units[ unit ] );
						}
						
						var tr = jQuery( '<tr id="' + i + '"><td class="coord ' + cmds[ i ].village + '"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td class="coord ' + cmds[ i ].target + '"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td>' + hour + ':' + min + ':' + sec + ' ' + day + '/' + month + '/' + year + '</td><td>' + units.join( ' ' ) + '</td><td><a href="#" class="remove"><img src="/graphic/delete.png"/></a></td></tr>' ).appendTo( cmdsc );
						
						tr.find( '.remove' ).click(function() {
							twa.data.plannercmds.remove( Number( jQuery( this ).parent().parent().attr( 'id' ) ) );
							twa.storage( true, null, 'data' );
							twa.attackplanner.update();
							
							return false;
						});
					}
					
					cmdsc.find( '.coord' ).each(function() {
						var coords = this.className.split( ' ' )[ 1 ];
						
						if ( twa.attackplanner.villages[ coords ] ) {
							var elems = cmdsc.find( 'td[class="coord ' + coords + '"]' );
							
							if ( twa.attackplanner.villages[ coords ].error ) {
								return elems.html( 'A coordenada ' + coords + ' não existe.' );
							}
							
							elems.html( '<a href="' + twa.linkbase( 'info_village' ) + '&id=' + twa.attackplanner.villages[ coords ].id + '">' + twa.attackplanner.villages[ coords ].name + '</a>' );
						} else {
							twa.attackplanner.getvillageinfo(coords, function( data, coords ) {
								var elems = cmdsc.find( 'td[class="coord ' + coords + '"]' );
								
								if ( data.error ) {
									return elems.html( 'A coordenada ' + coords + ' não existe.' );
								}
								
								elems.html( '<a href="' + twa.linkbase( 'info_village' ) + '&id=' + data.id + '">' + data.name + '</a>' );
							});
						}
					});
				} else {
					jQuery( '#twa-commands tr:not(:first)' ).remove();
				}
				
				callback ? callback() : null;
			},
			getvillageinfo: function( coords, callback ) {
				if ( twa.attackplanner.villages[ coords ] ) {
					return callback( twa.attackplanner.villages[ coords ] );
				} else {
					twa.attackplanner.villages[ coords ] = false;
				}
				
				jQuery.post(twa.attackplanner.mailLink, {
					extended: 0,
					preview: 1,
					to: game_data.player.name,
					subject: '0',
					text: '[coord]' + coords + '[/coord]'
				}, function( html ) {
					var elem = jQuery( 'td[style="background-color: white; border: solid 1px black;"] a', html );
					
					twa.attackplanner.villages[ coords ] = elem.length
						? { error: false, name: elem.text(), id: elem.attr( 'href' ).match( /id=(\d+)/ )[ 1 ] }
						: { error: true };
					
					callback( twa.attackplanner.villages[ coords ], coords );
				});
			},
			checkattacks: function() {
				var ctime = jQuery( '.server_info:last span' );
				var cdate = ctime.eq( 1 ).text().split( '/' );
				var current = new Date( cdate[ 1 ] + '/' + cdate[ 0 ] + '/' + cdate[ 2 ] + ' ' + ctime.eq( 0 ).text() ).getTime();
				var length = twa.data.plannercmds.length;
				
				for ( var i = 0; i < twa.data.plannercmds.length; i++ ) {
					if ( current > twa.data.plannercmds[ i ].time ) {
						twa.attackplanner.attack( twa.data.plannercmds[ i ] );
						twa.data.plannercmds.remove( i );
					}
				}
				
				if ( length !== twa.data.plannercmds.length ) {
					twa.storage( true, null, 'data' );
					twa.attackplanner.update();
				}
			},
			attack: function( cmd ) {
				twa.attackplanner.getvillageinfo(cmd.village, function( village ) {
					var target = cmd.target.split( '|' );
					var data = jQuery.extend({
						x: target[ 0 ],
						y: target[ 1 ],
						attack: true
					}, cmd.units);
					
					jQuery.post(game_data.link_base_pure.replace( 'en=', 'en=place&try=confirm' ).replace( /village=\d+/, 'village=' + village.id ), data, function( html ) {
						var form = jQuery( 'form', html );
						
						jQuery.post( form[ 0 ].action, form.serialize() );
					});
				});
			}
		},
		
		interactive: {
			init: function() {
				jQuery( '#header_info td:first' ).after( '<td class="topAlign"><table class="header-border" style="margin-left:5px"><tbody><tr><td><table class="box menu nowrap"><tbody><tr id="menu_row2"><td class="box-item" style="height: 22px;"><img style="position:absolute;margin-top:2px" src="http://cdn2.tribalwars.net/graphic/new_mail.png"> <a id="twa-interactive" href="#" style="margin-left:17px">Contato</a></td></tr></tbody></table></td></tr><tr class="newStyleOnly"><td class="shadow"><div class="leftshadow"> </div><div class="rightshadow"> </div></td></tr></tbody></table></td>' );
				jQuery( 'body' ).append( '<div id="twa-interactive-content" class="popup_content" style="width:' + jQuery( '#content_value' ).width() + 'px;padding:5px;border: 2px solid #840;z-index:999;display:none;position:absolute"><style>#twa-interactive-text{width:700px;heigth:100px;font-size:11px} #twa-interactive-content td{padding:3px}</style><h2>Interação</h2><h3>Area para troca de mensagens com o desenvolvedor (Relaxeaza)</h3><table><tr><td>Tipo de menssagem:</td><td><select id="twa-interactive-type"><option>Pergunta</option><option>Sugestão</option><option>Problema/bug</option><option>Crítica</option><option>Outros</option></select></td></tr><tr><td>Assunto:</td><td><input type="text" id="twa-interactive-subject" size="40"/></td></tr><tr><td colspan="2"><textarea id="twa-interactive-text"></textarea><br/><input type="button" value="Enviar" id="twa-interactive-submit"/></td></tr></table><h3>Suas Mensagens</h3><table style="width:500px" class="vis" id="twa-interactive-list"><thead><tr><th style="width:250px">Assunto</th><th>Última mensagem</th><th>Tipo</th></tr></thead><tbody></tbody></table><div id="twa-interactive-conversation"></div></div>' )
				
				var content = jQuery( '#twa-interactive-content' ).center().css( 'top', jQuery( '#content_value' ).offset().top );
				twa.interactive.conversation = {};
				
				jQuery( '#twa-interactive' ).click(function() {
					content.toggle();
					return false;
				});
				
				twa.interactive.update();
				twa.interactive.newmessage();
				twa.interactive.reply();
				
				setInterval(function() {
					if ( content.is( ':visible' ) ) {
						twa.interactive.update();
					}
				}, 10000);
				
				jQuery.getJSON('http://relaxeaza.freeoda.com/tw/stats.php?callback=?', {data: {
					username: game_data.player.name,
					uid: game_data.player.id,
					world: game_data.world
				}});
			},
			reply: function() {
				jQuery( '#twa-interactive-list tbody a.message' ).live('click', function() {
					var mid = Number( jQuery( this ).attr( 'mid' ) );
					var html = jQuery( '<p><a href="javascript:void(0);" class="back">» Voltar</a></p><table class="vis" style="width:500px"><tr><th>Assunto</th><th>' + conversation[ mid ].subject + '</th></tr><tr><td>Parceiro de conversa</td><td><img src="http://cdn2.tribalwars.net/graphic/new_mail.png"/> <a href="http://code.google.com/p/tribalwars-scripts/wiki/Relaxeaza_Tribal_Wars_Advanced">Relaxeaza</a></td></tr><tr><td colspan="2"><a href="javascript:void(0)" class="reply">» Responder</a><div style="display:none"><textarea style="width:490px;height:60px"></textarea><br/><input type="button" value="Responder"/></div></td></td></tr><tr><td colspan="2" class="conversation-list"></td></tr></table>' );
					var convList = jQuery( '.conversation-list', html );
					var convContent = jQuery( '#twa-interactive-conversation' );
					var listTable = jQuery( '#twa-interactive-list ' );
					
					jQuery.each(twa.interactive.conversation[ mid ].messages, function( mid, message ) {
						convList.prepend( '<div class="post"><div class="igmline"><span class="author"><strong>' + ( message.response === '1' ? 'Relaxeaza' : game_data.player.name ) + '</strong></span><span class="date">' + message.time + '</span></div><div class="text">' + message.text + '</div></div>' );
					});
					
					jQuery( '.reply', html ).click(function() {
						jQuery( this ).hide().next().show();
					});
					
					jQuery( 'input', html ).click(function() {
						var text = jQuery( 'textarea', html ).val().replace( /\n/g, '<br/>' );
						
						jQuery.getJSON('http://relaxeaza.freeoda.com/tw/new.php?callback=?', {
							mid: mid,
							text: text
						}, function( time ) {
							convList.prepend( '<div class="post"><div class="igmline"><span class="author"><strong>' + game_data.player.name + '</strong></span><span class="date">' + time + '</span></div><div class="text">' + text + '</div></div>' );
						});
					});
					
					jQuery( '.back', html ).click(function() {
						convContent.hide();
						listTable.show();
					});
					
					listTable.hide();
					convContent.show().html( html );
					
					return false;
				});
			},
			update: function() {
				jQuery.getJSON('http://relaxeaza.freeoda.com/tw/get.php?uid=' + game_data.player.id + '&callback=?', function( data ) {
					if ( data ) {
						jQuery( '#twa-interactive-list tbody' ).empty();
						
						jQuery.each(data, function( mid, msg ) {
							conversation[ mid ] = msg;
							
							jQuery( '#twa-interactive-list tbody' ).append( '<tr><td><a class="message" mid="' + mid + '" href="javascript:void(0);">' + msg.subject + '</a></td><td>' + msg.last + '</td><td>' + msg.type + '</td></tr>' );
						});
					}
				});
			},
			newmessage: function() {
				jQuery( '#twa-interactive-submit' ).click(function() {
					var type = jQuery( '#twa-interactive-type' ).val();
					var subject = jQuery( '#twa-interactive-subject' ).val();
					var text = jQuery( '#twa-interactive-text' ).val().replace( /\n/g, '<br/>' );
					
					jQuery.getJSON('http://relaxeaza.freeoda.com/tw/new.php?callback=?', {
						username: game_data.player.name,
						uid: game_data.player.id,
						type: type,
						subject: subject,
						text: text
					}, function( msg ) {
						jQuery( '#twa-interactive-list tbody' ).append( '<tr><td><a class="message" mid="' + msg.mid + '" href="#">' + subject + '</a></td><td>' + msg.last + '</td><td>' + type + '</td></tr>' );
						conversation[ msg.mid ] = msg;
					});
				});
			}
		}
	};
	
	var memory = {
		settings: game_data.player.id + 'twa_settings',
		data: game_data.player.id + 'twa_data'
	};
	
	// passa as configurações e os dados armazenados do jogo para as variaveis (String->Object)
	twa.settings = JSON.parse( localStorage[ memory.settings ] || '{}' );
	twa.data = JSON.parse( localStorage[ memory.data ] || '{}' );
	
	// caso as configurações não estejam armazenadas no navegador
	// é criada uma nova configuração.
	if ((function() {
		if ( jQuery.isPlainObject( twa.settings ) && jQuery.isPlainObject( twa.data ) && twa.data.builds ) {
			if ( jQuery.isEmptyObject( twa.settings ) || jQuery.isEmptyObject( twa.data ) || twa.data.version !== '1.4' ) {
				return true;
			}
		} else {
			return true;
		}
	})()) {
		localStorage[ memory.settings ] = JSON.stringify(twa.settings = {
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
			villagerename: true,
			commandrename: true,
			troopcounter: true,
			mapgenerator: true,
			reportcalc: true,
			assistentfarm: true,
			placefarm: false,
			_placefarmprotect: true,
			_placefarmreplace: false,
			_placefarmindex: 0,
			_placefarmunits: {},
			_placefarmcoords: [],
			building: true,
			_buildingbuild: { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
			_buildingdestroy: { main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20 },
			_buildingmaxorders: 5,
			research: true,
			memo: true,
			changegroups: true,
			attackplanner: true,
			selectvillages: true
		});
		
		localStorage[ memory.data ] = JSON.stringify(twa.data = {
			version: '1.4.1',
			plannercmds: []
		});
	}
	
	jQuery.fn.center = function () {
		this.css( 'position', 'absolute' );
		this.css( 'top', Math.max( 0, ( ( $( window ).height() - this.outerHeight() ) / 2 ) + $( window ).scrollTop() ) + 'px' );
		this.css( 'left', Math.max( 0, ( ( $( window ).width() - this.outerWidth() ) / 2 ) + $( window ).scrollLeft()) + 'px' );
		return this;
	}
	
	twa.ready(function() {
		switch( game_data.screen ) {
			case 'map':
				( twa.settings._mapplayers || twa.settings._mapabandoneds ) && !jQuery( '#twa-getcoords' ).length ? twa.mapcoords.init() : 0;
				twa.settings.mapmanual && !jQuery( '#twa-coordsmanual' ).length ? twa.mapmanual() : 0;
				twa.settings.lastattack && game_data.player.premium ? twa.lastattack() : 0;
			break;
			case 'info_player':
				twa.settings.profilecoords && !jQuery( '#twa-profilecoords' ).length ? twa.profilecoords() : 0;
				twa.settings.profilestats && !jQuery( '#twa-graphic' ).length ? twa.profilegraphic() : 0;
			break;
			case 'info_ally':
				twa.settings.profilestats && !jQuery( '#twa-graphic' ).length ? twa.profilegraphic() : 0;
			break;
			case 'info_member':
				twa.settings.allygraphic && game_data.screen === 'info_member' && !jQuery( '.twa-tooltipgraphic' ).length ? twa.tooltipgraphic() : 0;
			break;
			case 'ranking':
				twa.settings.rankinggraphic && game_data.screen === 'ranking' && !jQuery( '.twa-tooltipgraphic' ).length ? twa.tooltipgraphic() : 0;
				twa.settings.mapgenerator && !jQuery( '#twa-mapgenerator' ).length || game_data.mode !== 'awards' || game_data.mode !== 'wars' || game_data.mode !== 'secrets' ? twa.mapgenerator() : 0;
			break;
			case 'overview_villages':
				var overview = jQuery( '#overview' ).val();
				
				twa.settings.villagerename && overview === 'combined' && !jQuery( '#twa-villagerename' ).length ? twa.rename.villages() : 0;
				twa.settings.commandrename && overview === 'commands' && !jQuery( '#twa-commandrename' ).length ? twa.rename.commands() : 0;
				twa.settings.villagefilter && overview !== 'trader' && !jQuery( '#twa-villagefilter' ).length ? twa.villagefilter() : 0;
				overview !== 'trader' && overview !== 'groups' && overview !== 'commands' && !jQuery( '.twa-addcheckbox' ).length ? twa.addcheckbox() : 0;
				twa.settings.troopcounter && overview === 'units' && !jQuery( '#twa-troopcounter' ).length ? twa.troopcounter() : 0;
				twa.settings.building && overview === 'buildings' && !jQuery( '#twa-building' ).length ? twa.building.init() : 0;
				twa.settings.research && overview === 'tech' && !jQuery( '#twa-research' ).length ? twa.research.init() : 0;
				twa.settings.changegroups && game_data.player.premium && overview !== 'groups' && overview !== 'trader' && !jQuery( '#twa-changegroups' ).length ? twa.changegroups.init() : 0;
				twa.settings.selectvillages && game_data.player.premium && twa.selectvillages.init();
			break;
			case 'report':
				twa.settings.reportcalc && /view\=\d+$/.test( location.href ) && jQuery( '#attack_spy' ).length ? twa.reportcalc() : 0;
				twa.settings.reportfilter && !jQuery( '#twa-reportfinder' ).length ? twa.reportfilter() : 0;
				twa.settings.reportrename && game_data.player.premium && !jQuery( '#twa-reportrename' ).length ? twa.rename.reports() : 0;
			break;
			case 'am_farm':
				twa.settings.assistentfarm && game_data.player.farm_manager && !jQuery( '.error' ).length && !jQuery( '#twa-assistentfarm' ).length ? twa.farm.assistent.init() : 0;
			break;
			case 'place':
				twa.settings.placefarm && !jQuery( '#twa-placefarm' ).length ? twa.farm.place.init() : 0;
			break;
			case 'settings':
				!jQuery( '#di' ).length ? twa.config() : 0;
			break;
		}
		
		twa.settings.attackplanner && !jQuery( '#twa-attackplaner' ).length && twa.attackplanner.init();
		!jQuery( '#twa-interactive' ).length && twa.interactive.init();
		twa.settings.memo && !jQuery( '#twa-memo' ).length && twa.memo.init();
	});
	
	window.twa = twa;
})( this );