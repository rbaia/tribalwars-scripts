/*!
 * Relaxeaza Tribal Wars Advanced v1.4.5
 * Release 27/08/12.
 * relaxeaza.tw@gmail.com
 *
 * v1.1 03/02/12
 * novo: Fun��o para renomear relat�rios.
 * novo: Fun��o para renomear comandos na visualiza��o.
 * alterado: Largura do display de configura��o aumentada para melhor visualiza��o.
 * bugfix: Erros de digita��o na ajuda no display de configura��o.
 * novo: Adicionada checkboxes para poder renomear apenas aldeias selecionadas.
 * novo: Filtro de aldeias na visualiza��o.
 * novo: Contador de tropas em visualiza��es > tropas.
 * novo: Fun��o para calcular recursos exatos em uma aldeia apartir de um relat�rio de espionagem.
 *
 * v1.2 07/02/12
 * novo: Assistente de Farm autom�tico.
 * alterado: Algumas melhoras na performance do script.
 *
 * v1.3 22/02/12
 * novo: Constru��o e demoli��o em massa.
 * novo: Fun��o para cancelar todas as constru��es/demoli��es.
 * novo: Farmador automatico.
 * bugfix: Bug ao mostrar a pontua��o m�nima/m�xima da fun��o de obter coordenadas.
 * novo: Atalho para ataque direto na fun��o de calcular recursos.
 * novo: Imagem indicando que o script est� trabalhando ao renomear aldeias/relat�rios/comandos.
 * novo: Fun��o para selecionar aldeias por r�cio de tropas de ataque e defesa.
 * novo: Pesquisa em Massa.
 * novo: Op��o para cancelar todas as pesquisas.
 *
 * v1.3.1 24/02/12
 * alterado: Assistente de Farm -> Os ataques come�am mais rapido quando o Assistente de Farm � iniciado.
 * novo: Assistente de Farm -> Mostrar� o log dos ataques enquanto s�o enviados.
 * bugfix: Engine -> Erro em algumas fun��es quando usado apartir do Modo de F�rias
 *
 * v1.3.2 24/05/12
 * alterado: Configura��es -> Layout do tooltip de ajuda no display configura��es.
 * novo: Fun��o de lembrete.
 * alterado: Coletor de Coordenadas -> Cores dos identificadores de coletor de coordenadas foram alteradas para melhor visualiza��o.
 * alterado: Coletor de Coordenadas -> Agora as configura��es de pontua��o m�nima e m�xima das fun��es de obter coordenadas no mapa e no perfil de jogadores s�o configuradas na pr�pria p�gina.
 * novo: Alterador de Grupos -> Agora � possivel alterar os grupos das aldeias em qualquer modo de visualiza��o
 * novo: Planeador de Ataques -> Envio de ataques em hor�rios programados.
 * alterado: Assistente de Farm -> Agora o assistent de farm tamb�m usa a op��o C quando dispon�vel.
 *
 * v1.3.3 04/08/12
 * novo: Selecionador -> Fun��o para selecionar aldeias especificas na visualiza��o, como aldeias com tropas de ataque, defesa, etc.
 * novo: Mensagens -> Area para troca de mensagens com o desenvolvedor. (perguntas, sugest�es...)
 *
 * v1.3.4 15/08/12
 * alterado: Mensagens -> Forma para troca de mensagens com o desenvolvedor foi melhorada.
 *
 * v1.4 19/08/12
 * alterado: Planeador de Ataques -> No campo Hor�rio o valor � sempre o �ltimo hor�rio inserido.
 * alterado: Planeador de Ataques -> Ao adicionar as coordenadas da aldeia atacante automaticamente ser� adicionada todas as tropas da aldeia nos campos das unidades.
 * novo: Planeador de Ataques -> Agora � possivel adicionar apoio aos ataques programados.
 * novo: Planeador de Ataques -> Foi adicionado um log de comandos para melhor visualiza��o dos ataques/apoios e ataques com problemas.
 * alterado: Mensagens -> A troca de mensagens deixou de ser "Contato" para "Mensagens".
 * alterado: Mensagens -> Prote��o contra envio de multiplas mensagens (spam).
 * alterado: Coletor de Coordenadas Manual -> Ao clicar em uma aldeia que j� foi selecionada, ela ser� removidada da lista de coordenadas.
 * alterado: Engine -> Os icones das ferramentas que s�o usadas em qualquer p�gina do jogo foram movidas para uma barra independente.
 * alterado: Farmador Autom�tico -> Deixar� de ser executado apenas na Pra�a e o modo de uso ser� parecido com o Planeador de Ataques.
 * alterado: Farmador Autom�tico -> Agora o Farmador Autom�tico pode ser executado de qualquer p�gina do jogo.
 * alterado: Farmador Autom�tico -> O design foi reformulado.
 * v1.4.1 20/08/12
 * novo: Farmador Autom�tico -> Foi adicionado um log de ataques.
 * v1.4.2 21/08/12
 * bugfix: Farmador Autom�tico -> O problema do "N�o h� tropas na aldeia" foi solucionado.
 * bugfix: Farmador Autom�tico -> O problema da op��o "Caso n�o tenha tropas usar o que tiver" foi solucionado.
 * v1.4.3 22/08/12
 * bugfix: Farmador Autom�tico -> Problema na detec��o do tempo em que as tropas em andamento retornariam arrumado.
 * v1.4.4 26/08/12
 * bugfix: Construtor Autom�tico -> Problema que cancelava todas ordens de contru��es foi concertado.
 * novo: Area exclusiva para sugest�es para o script.
 * v1.4.5 27/08/12
 * novo: Visualiza��o Avan�ada -> Adiciona ferramentas premium na p�gina de visualiza��o para jogadores sem conta premium.
 */

(function () {
	var twa = {
		version: '1.4.5',
		domain: 'http://relaxeaza.orgfree.com/tw/',
		baseTool: function(id, name, img, html, width) {
			$('table.twa-bar').show().find('> tbody > tr').append('<td><table class="header-border"><tbody><tr><td><table class="box menu nowrap"><tbody><tr><td class="box-item" style="height: 22px;">' + (img ? '<img src="' + img + '" style="position:absolute">' : '') + '<a ' + (img ? 'style="margin-left:17px" ' : '') + 'href="#" id="' + id + '">' + name + '</a></td></tr></tbody></table></td></tr><tr class="newStyleOnly"><td class="shadow"><div class="leftshadow"></div><div class="rightshadow"></div></td></tr></tbody></table></td>');

			var width = width ? width : $('#content_value').width();
			var content = $('<div id="' + id + '-content" class="popup_content" style="width:' + width + 'px;padding:5px;border:2px solid #840;z-index:999;display:none;position:absolute">' + html + '</div>').appendTo('body').center().css('top', $('#content_value').offset().top);

			$('#' + id).unbind('click').click(function () {
				content.toggle();
				return false;
			});

			return content;
		},
		storage: function(props, value, data) {
			var name = data ? memory[data] : memory.settings;
			data = data ? 'data' : 'settings';

			if(props === true) {
				localStorage[name] = JSON.stringify(twa[data]);
			} else if(typeof props === 'string') {
				if(value === undefined) {
					return twa[data][props];
				} else {
					twa[data][props] = value;
					localStorage[name] = JSON.stringify(twa[data]);
				}
			} else if($.isPlainObject(props)) {
				localStorage[name] = JSON.stringify($.extend(twa[data], props));
			}

			return true;
		},
		linkbase: function(screen) {
			return game_data.link_base_pure.replace('screen=', 'screen=' + screen);
		},
		ready: function(callback) {
			var inits = 0;
			var completes = 0;

			function ready() {
				if(completes === inits) {
					inits && twa.storage(true, null, 'data');
					callback();
				}
			}

			if(!twa.data.builds && ++inits) {
				function buildNames() {
					twa.data.builds = {};
					$.get(twa.linkbase('main'), function(html) {
						if($('#hide_completed:checked', html).length) {
							return $.post($('#hide_completed', html).attr('onclick').toString().split("'")[1], {
								hide_completed: false
							}, buildNames);
						}
						$('#buildings a:has(img[src*=buildings])', html).each(function () {
							twa.data.builds[$(this).text().trim()] = this.href.match(/\=(\w+)$/)[1];
						});
						ready(++completes);
					});
				}
				buildNames();
			}

			if(!twa.data.world && ++inits) {
				twa.data.world = {};

				$.get('interface.php?func=get_config', function(xml) {
					$('config > *', xml).each(function (i, elem) {
						if(i < 4) {
							twa.data.world[elem.nodeName] = $(elem).text();
						} else {
							$('*', elem).each(function () {
								twa.data.world[this.nodeName] = Number($(this).text());
							});
						}
					});

					ready(++completes);
				});
			}

			if(!twa.data.units && ++inits) {
				twa.data.units = {};

				$.get('interface.php?func=get_unit_info', function(xml) {
					$('config > *', xml).each(function () {
						if(this.nodeName !== 'militia') {
							twa.data.units[this.nodeName] = {
								speed: Math.round(Number($('speed', this).text())) * 60,
								carry: Number($('carry', this).text()),
								pop: Number($('pop', this).text())
							};
						}
					});
					
					ready(++completes);
				});
			}

			ready();
		},
		config: function() {
			console.log('twa.config()');

			$('head').append('<style>' +
			'#di {background:#c1d9ff;border:1px solid #3a5774;font-family:arial;font-size:12px;padding:4px;position:absolute;z-index:99999}' +
			'#di textarea {border:1px solid #999;width:280px;height:80px;font-size:12px}' +
			'#di input[type="text"],#di select {border:1px solid #999;width:70px;margin:0 2px;font-size:12px}' +
			'#di button {border:1px solid #999;margin:3px}' +
			'#di .di {background:#fff;padding:5px}' +
			'#di a {color:blue;font-weight:400;text-decoration:underline}' +
			'#di h1 {background:#e4e4e4;border-bottom:1px solid #c4c4c4;border-top:1px solid #fff;color:#333;font-size:13px;font-weight:700;line-height:20px;margin:0;padding:0 7px}' +
			'#di p,#di label {margin:3px 0;display:block}' +
			'#he {background:#e0edfe;cursor:move;font-size:14px;font-weight:700;padding: 4px 20px 4px 10px}' +
			'#twa-tooltip{display:none;position:absolute;width:300px;padding:4px 4px 3px;background:#000;opacity:0.8;color:#fff;font-size:12px;border:1px solid #000;-moz-border-radius:2px;-webkit-border-radius:2px;border-radius:2px}' +
			'</style>');

			console.log(typeof lang.config.title);
			$('body').append('<div id="di" style="width:400px">' +
			'<div id="twa-tooltip"></div>' +
			'<div id="he">' + lang.config.title.springf(twa.data.version) + '</div>' +
			'<div id="co">' +
			'<h1>' + lang.config.coords + '</h1>' +
			'<div class="di">' +
			'<label tooltip="' + lang.config.tooltip.mapcoords + '">' +
			'<input type="checkbox" name="mapcoords"/> ' + lang.config.mapcoords +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.profilecoords + '">' +
			'<input type="checkbox" name="profilecoords"/> ' + lang.config.profilecoords +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.mapidentify + '">' +
			'<input type="checkbox" name="mapidentify"/> ' + lang.config.mapidentify +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.mapmanual + '">' +
			'<input type="checkbox" name="mapmanual"/> ' + lang.config.mapmanual +
			'</label>' +
			'</div>' +
			'<h1>' + lang.config.graphicstats + '</h1>' +
			'<div class="di">' +
			'<label tooltip="' + lang.config.tooltip.rankinggraphic + '">' +
			'<input type="checkbox" name="rankinggraphic"/> ' + lang.config.rankinggraphic +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.allygraphic + '">' +
			'<input type="checkbox" name="allygraphic"/> ' + lang.config.allygraphic +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.profilestats + '">' +
			'<input type="checkbox" name="profilestats"/> ' + lang.config.profilestats +
			'</label>' +
			'</div>' +
			'<h1>Outras Op��es</h1>' +
			'<div class="di">' +
			'<label tooltip="' + lang.config.tooltip.lastattack + '">' +
			'<input type="checkbox" name="lastattack"/> ' + lang.config.lastattack +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.reportfilter + '">' +
			'<input type="checkbox" name="reportfilter"/> ' + lang.config.reportfilter +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.villagefilter + '">' +
			'<input type="checkbox" name="villagefilter"/> ' + lang.config.villagefilter +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.reportrename + '">' +
			'<input type="checkbox" name="reportrename"/> ' + lang.config.reportrename +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.commandrename + '">' +
			'<input type="checkbox" name="commandrename"/> ' + lang.config.commandrename +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.villagerename + '">' +
			'<input type="checkbox" name="villagerename"/> ' + lang.config.villagerename +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.mapgenerator + '">' +
			'<input type="checkbox" name="mapgenerator"/> ' + lang.config.mapgenerator +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.reportcalc + '">' +
			'<input type="checkbox" name="reportcalc"/> ' + lang.config.reportcalc +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.troopcounter + '">' +
			'<input type="checkbox" name="troopcounter"/> ' + lang.config.troopcounter +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.assistentfarm + '">' +
			'<input type="checkbox" name="assistentfarm"/> ' + lang.config.assistentfarm +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.building + '">' +
			'<input type="checkbox" name="building"/> ' + lang.config.building +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.research + '">' +
			'<input type="checkbox" name="research"/> ' + lang.config.research +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.changegroups + '">' +
			'<input type="checkbox" name="changegroups"/> ' + lang.config.changegroups +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.memo + '">' +
			'<input type="checkbox" name="memo"/> ' + lang.config.memo +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.attackplanner + '">' +
			'<input type="checkbox" name="attackplanner"/> ' + lang.config.attackplanner +
			'</label>' +
			'<label tooltip="' + lang.config.tooltip.selectvillages + '">' +
			'<input type="checkbox" name="selectvillages"/> ' + lang.config.selectvillages +
			'</label>' +
			'<label tooltip="Adiciona op��es premium na p�gina de visualiza��o para usu�rios sem conta premium.">' +
			'<input type="checkbox" name="overview"/> Visualiza��o avan�ada' +
			'</label>' +
			'</div>' +
			'<h1 style="text-align:center"><button id="sa">Salvar</button></h1>' +
			'</div>' +
			'</div>');

			for(var name in twa.settings) {
				if(name[0] !== '_') {
					document.getElementsByName(name)[0][typeof twa.settings[name] === 'boolean' ? 'checked' : 'value'] = twa.settings[name];
				}
			}

			var tooltip = $('#twa-tooltip');

			$('#di [tooltip]').mouseenter(function () {
				tooltip.html($(this).attr('tooltip'));
				var css = $(this).position();
				css.top -= tooltip.height() + 10;
				css.left += 23;
				tooltip.css(css).show();
			}).mouseout(function () {
				tooltip.hide();
			});

			$('#di').draggable({
				handle: '#he'
			}).center();

			$('#sa').click(function () {
				$('#di input').each(function () {
					twa.settings[this.name] = this.type === 'checkbox' ? this.checked : this.value;
				});

				twa.storage(true);

				alert(lang.config.save);
			});
		},
		mapelement: function(o, css) {
			var img = $('#map_village_' + o.vid);
			var pos = o.pos || [0, 0];
			
			/* var elem = $('<div/>').css($.extend(css, {
				top: Number(img.css('top').replace('px', '')) + pos[0],
				left: Number(img.css('left').replace('px', '')) + pos[1],
				zIndex: 10,
				position: 'absolute'
			})).attr('id', o.id); */
			
			var elem = $('<div/>').css($.extend(css, {
				top: Number(img.css('top').replace('px', '')) + pos[0],
				left: Number(img.css('left').replace('px', '')) + pos[1],
				zIndex: 10,
				position: 'absolute'
			}));
			
			o.html && elem.html(o.html);
			o.Class && elem.addClass(o.Class);
			css.borderRadius && elem.attr('style', elem.attr('style') + '-moz-border-radius:' + css.borderRadius + 'px;-webkit-border-radius:' + css.borderRadius + 'px');

			img.parent().prepend(elem);
		},
		mapvillages: function(callback) {
			var village;

			for(var x = 0; x < TWMap.size[1]; x++) {
				for(var y = 0; y < TWMap.size[0]; y++) {
					var coord = TWMap.map.coordByPixel(TWMap.map.pos[0] + (TWMap.tileSize[0] * y), TWMap.map.pos[1] + (TWMap.tileSize[1] * x));

					if(village = TWMap.villages[coord.join('')]) {
						village.player = TWMap.players[village.owner];

						if(typeof village.points === 'string') {
							village.points = Number(village.points.replace('.', ''));
						}

						callback.call(village, coord);
					}
				}
			}
		},
		currentunits: function(html) {
			html = html || document;

			var units = {};

			for(var unit in twa.data.units) {
				units[unit] = Number($('[name=' + unit + ']', html).next().text().match(/\d+/)[0]);
			}

			return units;
		},
		mapcoords: {
			init: function() {
				console.log('twa.mapcoords()');

				$('#map_whole').after('<br/><table class="vis" width="100%" id="twa-getcoords"><tr><th>' + lang.mapcoords.getcoords + ' <a href="#" id="twa-mapcoords-refresh">� ' + lang.mapcoords.update + '</a></th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr><tr><td id="twa-getcoords-options"><label><input type="checkbox" name="_mapplayers"> ' + lang.mapcoords.mapplayers + '</label> ' + lang.mapcoords.min + ': <input name="_mapplayersmin" style="width:35px"> ' + lang.mapcoords.max + ': <input name="_mapplayersmax" style="width:35px"><br/><label><input name="_mapabandoneds" type="checkbox"> ' + lang.mapcoords.mapabandoneds + '</label> ' + lang.mapcoords.min + ': <input name="_mapabandonedsmin" style="width:35px"> ' + lang.mapcoords.max + ': <input name="_mapabandonedsmax" style="width:35px"></td></tr></table>');

				var timeout;

				$('#twa-getcoords-options input').each(function () {
					this[this.type === 'checkbox' ? 'checked' : 'value'] = twa.settings[this.name];
				}).change(function () {
					var elem = this;

					clearTimeout(timeout);

					timeout = setTimeout(function () {
						var value = elem[elem.type === 'checkbox' ? 'checked' : 'value'];

						twa.settings[elem.name] = elem.type === 'checkbox' ? value : Number(value);
						twa.storage(true);
					}, 1000);
				});

				$('#twa-mapcoords-refresh').click(function () {
					return twa.mapcoords._do();
				});

				twa.mapcoords._do();
			},
			_do: function() {
				var get;
				var coords = [];

				$('.twa-identify').remove();

				twa.mapvillages(function (coord) {
					if(this.owner === '0') {
						get = twa.settings._mapabandoneds && this.points > Number(twa.settings._mapabandonedsmin) && this.points < Number(twa.settings._mapabandonedsmax);
					} else {
						get = twa.settings._mapplayers && this.points > Number(twa.settings._mapplayersmin) && this.points < Number(twa.settings._mapplayersmax);
					}

					if(get) {
						coords.push(coord.join('|'));

						if(twa.settings.mapidentify) {
							twa.mapelement({
								id: 'twa-mapcoords' + this.id,
								vid: this.id,
								Class: 'twa-identify',
								pos: [twa.settings.lastattack && game_data.player.premium ? 15 : 25, 38]
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

				$('#twa-getcoords textarea').html(coords.join(' '));

				return false;
			}
		},
		mapmanual: function() {
			console.log('twa.mapmanual()');

			$('#map_whole').after('<br/><table class="vis" width="100%" id="twa-mapmanual"><tr><th>' + lang.mapmanual.getcoords + '</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px"></textarea></td></tr></table>');

			var input = $('#twa-mapmanual textarea');
			var coords = [];
			var village;

			TWMap.map._handleClick = function(event) {
				var coord = this.coordByEvent(event);

				if(village = TWMap.villages[coord.join('')]) {
					coord = coord.join('|');

					if(coords.indexOf(coord) < 0) {
						coords.push(coord);
						input.val(coords.join(' '));

						twa.mapelement({
							id: 'twa-manual' + village.id,
							vid: village.id,
							Class: 'twa-mapmanual',
							pos: [twa.settings.lastattack && game_data.player.premium ? 15 : 25, twa.settings.mapidentify ? 28 : 38]
						}, {
							width: 7,
							height: 7,
							borderRadius: 10,
							background: 'red',
							border: '1px solid #000',
							opacity: 0.7
						});
					} else {
						coords.remove(coords.indexOf(coord));
						input.val(coords.join(' '));
						$('#twa-manual' + village.id).remove();
					}
				}

				return false;
			}
		},
		profilecoords: function() {
			console.log('twa.profilecoords()');

			var points;
			var coords = [];
			var tr = document.getElementById('villages_list').getElementsByTagName('tr');

			for(var i = 1; i < tr.length; i++) {
				if(i + 1 === tr.length && !tr[i].getElementsByTagName('td')[2]) {
					break;
				}

				points = Number(tr[i].getElementsByTagName('td')[2].innerHTML.replace('<span class="grey">.</span>', ''));

				if(points > twa.settings._profilecoordsmin && points < twa.settings._profilecoordsmax) {
					coords.push(tr[i].getElementsByTagName('td')[1].innerHTML);
				}
			}

			$('#villages_list').before('<table class="vis" id="twa-profilecoords" width="100%"><tr><th>' + lang.profilecoords.everycoords + '</th></tr><tr><td><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px">' + coords.join(' ') + '</textarea></td></tr><tr><td><label><input style="width:40px" name="_profilecoordsmin"/> ' + lang.profilecoords.min + '</label><br/><label><input style="width:40px" name="_profilecoordsmax"/> ' + lang.profilecoords.max + '</label></td></tr></table><br/>');

			var timeout;

			$('#twa-profilecoords input').each(function () {
				this.value = twa.settings[this.name];
			}).change(function () {
				var elem = this;

				clearTimeout(timeout);

				timeout = setTimeout(function () {
					twa.settings[elem.name] = Number(elem.value);
					twa.storage(true);
				}, 1000);
			});
		},
		profilegraphic: function() {
			console.log('twa.profilegraphic()');

			var id = location.search.match(/\d+$/)[0];
			var mode = game_data.screen === 'info_player' ? 'player' : 'tribe';
			var url = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/';
			var points = url + 'graph/p_' + mode + '/' + id;
			var oda = url + 'graph/oda_' + mode + '/' + id;
			var odd = url + 'graph/odd_' + mode + '/' + id;
			var html = '<table class="vis" width="100%" id="twa-graphic"><tr><th><a href="' + url + 'history/' + mode + '/' + id + '">' + lang.profilegraphic + ' <img src="http://www.hhs.gov/web/images/exit_disclaimer.png"/></a></th></tr><tr><td style="text-align:center"><p><img src="' + points + '"/></p><img src="' + oda + '"/><p><img src="' + odd + '"/></p></td></tr></table>';
			mode === 'player' ? $('.vis:not([id^=twa]):eq(2)').after('<br/>' + html) : $('#content_value > table tr:first').append('<td valign="top">' + html + '</td>');
		},
		lastattack: function() {
			console.log('twa.lastattack()');
			
			if(!$('#show_popup').is(':checked') || !$('#map_popup_attack').is(':checked')) {
				return false;
			}
			
			$('.twa-lastattack').remove();

			twa.mapvillages(function () {
				$.ajax({
					url: 'game.php?village=' + this.id + '&screen=overview&json=1&source=873',
					dataType: 'json',
					id: this.id,
					success: function(data) {
						if(data[0].attack) {
							var last = data[0].attack.time.split(/\s[A-z]/)[0].split('.');
							last = new Date([last[1], last[0], '20' + last[2]].join(' ')).getTime();

							var now = $('#serverDate').text().split('/');
							now = new Date([now[1], now[0], now[2], $('#serverTime').text()].join(' ')).getTime();

							var time = new Date(now - last).getTime();
							var year = Math.floor(time / 31536E6);
							var day = Math.floor(time / 864E5);
							var hour = Math.floor(time / 36E5);
							var min = Math.floor(time / 6E4);
							var format;
							
							if(year == 1) {
								format = year + ' ' + lang.lastattack.year;
							} else if(year > 1) {
								format = year + ' ' + lang.lastattack.years;
							} else if(day > 1) {
								format = day + lang.lastattack.days + ' ' + (hour % 24) + 'h';
							} else if(hour > 0) {
								min = min % 60;
								min = min < 10 ? '0' + min : min;
								hour = hour < 10 ? '0' + hour : hour;
								format = hour + ':' + min + 'h';
							} else {
								min = min < 10 ? '0' + min : min;
								format = '00:' + min + 'm';
							}
							
							twa.mapelement({
								vid: this.id,
								html: format,
								Class: 'twa-lastattack',
								pos: [25, 2]
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
		mapgenerator: function() {
			console.log('twa.mapgenerator()');

			var base;
			var type = /ally/.test(game_data.mode) ? 't' : 'p';
			var colors = '00ff00 999999 823c0a b40000 f40000 0000f4 880088 f0c800 00a0f4 ff8800 ffff00 e0d3b8 04b45f 04b4ae 81f7f3 be81f7 fa58f4 ff0088 ffffff f7be81'.split(' ');
			var zoom = 120;
			var x = 500;
			var y = 500;

			if(/con/.test(game_data.mode)) {
				base = $('#con_player_ranking_table, #con_ally_ranking_table');
				zoom = 320;

				var con = $('h3').html().match(/\d+/)[0];
				con = con.length === 1 ? '0' + con : con;

				x = con[1] + '50';
				y = con[0] + '50';
			} else if(/kill/.test(game_data.mode)) {
				base = $('#kill_player_ranking_table, #kill_ally_ranking_table').next();
			} else if(game_data.mode === 'awards') {
				base = $('#award_ranking_table');
			} else {
				type === 't' && $('#ally_ranking_table tr:first th:eq(1)').width(150);
				base = $('#player_ranking_table, #ally_ranking_table');
			}

			base.find('tr:not(:first)').each(function (index) {
				$('td:eq(1)', this).prepend('<input class="map-item" type="checkbox" style="margin:0px;margin-right:20px" color="' + colors[index] + '" id="' + $('a', this).attr('href').match(/\d+$/)[0] + '"/>');
			}).eq(-1).after('<tr><td colspan="8"><input type="button" id="twa-mapgenerator" value="' + lang.mapgenerator.generate + '"/> <label><input type="checkbox" id="checkall"/> <strong>' + lang.mapgenerator.selectall + '</strong></label></td></tr>');

			$('#twa-mapgenerator').click(function () {
				var url = 'http://' + game_data.market + '.twstats.com/' + game_data.world + '/index.php?page=map&';

				$('.map-item').each(function (index) {
					index++;

					if($(this).is(':checked')) {
						url += type + 'i' + index + '=' + this.id + '&' + type + 'c' + index + '=' + $(this).attr('color') + '&';
					}
				});

				url += 'zoom=' + zoom + '&centrex=' + x + '&centrey=' + y + '&nocache=1&fill=000000&grid=1&kn=1&bm=1';

				window.open(url);
			});

			$('#checkall').click(function () {
				$('.map-item').attr('checked', this.checked);
			});
		},
		tooltipgraphic: function() {
			console.log('twa.tooltipgraphic()');

			$('#content_value a[href*=info_player], #content_value a[href*=info_ally]').each(function () {
				if(this.href.match(/\d+$/)) {
					var src = 'http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/graph/p_' + (/info_player/.test(this.href) ? 'player' : 'tribe') + '/' + this.href.match(/\d+$/)[0];

					new Image().src = src;
					this.title = '<img src="' + src + '">';

					$(this).tooltip({
						track: true,
						showURL: false
					});
				}
			});

			$('#tooltip').css('max-width', 323).addClass('twa-tooltipgraphic');
		},
		reportfilter: function() {
			console.log('twa.reportfilter()');

			$('#report_list').before('<table class="vis" width="100%"><tr><th>' + lang.reportfilter.search + ' <input type="text" id="twa-reportfinder" style="padding:1px 2px;border:1px solid silver;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/></th></tr></table>');

			$('#twa-reportfinder').keyup(function () {
				var param = this.value.toLowerCase();

				$('#report_list tr:not(:first, :last)').each(function () {
					$(this)[$(this).text().toLowerCase().indexOf(param) < 0 ? 'hide' : 'show']();
				});
			});

			selectAll = function(form, checked) {
				$('#report_list tr:not(:first, :last):visible input[type=checkbox]').attr('checked', checked);
			};
		},
		villagefilter: function() {
			console.log('twa.villagefilter()');

			var villagesExpr = '.overview_table tr:not(:first)';
			var nameExpr = 'span[id^=label_text]';

			switch($('#overview').val()) {
			case 'units':
				villagesExpr = '.overview_table tbody';
				break;
			case 'commands':
			case 'incomings':
				villagesExpr = '.overview_table tr.nowrap';
				nameExpr = 'span[id^=labelText]';
				break;
			}

			$('.overview_table').before('<table class="vis" width="100%"><tr><th>' + lang.villagefilter.search + ' <input type="text" id="twa-villagefilter" style="padding:1px 2px;border:1px solid silver;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/></th></tr></table>');

			$('#twa-villagefilter').keyup(function () {
				var param = this.value.toLowerCase();

				$(villagesExpr).each(function () {
					$(this)[$(nameExpr, this).text().toLowerCase().indexOf(param) < 0 ? 'hide' : 'show']();
				});
			});

			window.selectAll = function(form, checked) {
				$('.overview_table tr.nowrap:visible input[type=checkbox]').attr('checked', checked);
			};
		},
		troopcounter: function() {
			console.log('twa.troopcounter()');

			$('#units_table').after('<table id="twa-troopcounter" class="vis" style="width:100%;margin:0 auto"><thead>' + $('#units_table thead').html() + '</thead><tbody>' + $('#units_table tbody:first').html() + '</tbody></table>');

			var units = {};
			var table = document.getElementById('twa-troopcounter');
			var img = document.getElementById('units_table').getElementsByTagName('tr')[0].getElementsByTagName('img');
			var tbody = document.getElementById('units_table').getElementsByTagName('tbody');
			var mytr = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

			for(var i = 0; i < img.length; i++) {
				units[img[i].src.match(/_(\w+)\.png/)[1]] = [
					[i + 2, 0],
					[i + 1, 0],
					[i + 1, 0],
					[i + 1, 0]
				];
			}

			for(var i = 0; i < tbody.length; i++) {
				var tr = tbody[i].getElementsByTagName('tr');

				for(var j = 0; j < tr.length; j++) {
					for(var name in units) {
						units[name][j][1] += Number(tr[j].getElementsByTagName('td')[units[name][j][0]].innerHTML);
					}
				}
			}

			$('td:first', table).empty().width($('#units_table td:first').width());
			$('th:first', table).html('Contagem de Tropas:');
			$('th:last, td:has(a)', table).remove();

			for(var i = 0; i < mytr.length; i++) {
				for(var name in units) {
					var td = mytr[i].getElementsByTagName('td')[units[name][i][0]];

					td.className = 'unit-item' + (units[name][i][1] == 0 ? ' hidden' : '');
					td.innerHTML = units[name][i][1];
				}
			}
		},
		reportcalc: function() {
			console.log('twa.reportcalc()');

			if(!$('#twa-reportcalc').length) {
				$('table[width=470]').before('<table class="vis" width="470" id="twa-reportcalc"><tbody><tr><th>' + lang.reportcalc.neededunits + '</th></tr><tr><td align="center"><label><input type="checkbox" id="twa-currentvillage"> ' + lang.reportcalc.currentvillage + '</label></td></tr><tr><td align="center" id="twa-units"></td></tr><tr><th>' + lang.reportcalc.unitscalc + ' <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr><tr><td align="center" id="twa-unitscalc" style="font-weight:bold"></td></tr><tr><td align="center" id="twa-attack"><a href="#">� ' + lang.reportcalc.attack + '</a></td></tr></tbody></table>');

				$(document).ajaxStart(function () {
					$('#twa-loader').show();
				}).ajaxStop(function () {
					$('#twa-loader').hide();
				});

				$('#twa-units input').change(function () {
					$('#twa-unitscalc > span, #twa-attack').hide();

					twa.reportcalc();
				});

				var unitscalc = document.getElementById('twa-unitscalc');
				var unitsoptions = document.getElementById('twa-units');

				for(var name in twa.data.units) {
					unitscalc.innerHTML += '<span id="twa-' + name + '"><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <span></span></span> ';
					unitsoptions.innerHTML += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"q><input type="checkbox"' + (name === 'spear' || name === 'archer' || name === 'spy' || name === 'ligth' || name === 'marcher' || name === 'knight' ? ' checked="true"' : '') + ' class="' + name + '"/>';
				}

				$('#twa-unitscalc > span, #twa-attack').hide().last().click(function () {
					$.post(game_data.link_base_pure.replace('en=', 'en=place&try=confirm').replace(/village=\d+/, 'village=' + vid), $.extend({
						x: coords[0],
						y: coords[1],
						attack: true
					}, necessaryUnits), function(html) {
						var error = $('#error', html);

						if(error.text()) {
							return alert(lang.reportcalc.error + ' ' + error.text());
						}

						var form = $('form', html);

						$.post(form[0].action, form.serialize(), function() {
							alert(lang.reportcalc.success);
						});
					});

					return false;
				});
			}

			var discovery = $('#attack_spy tr:first td').text().trim().replace(/\./g, '').split(' ');
			var buildsLvl = $('#attack_spy tr:eq(1) td').text().replace(/\t/g, '').split('\n');
			buildsLvl = buildsLvl.splice(1, buildsLvl.length - 2);
			var builds = {};

			$.each(buildsLvl, function() {
				var build = this.split(/\s\(/);
				var level = build[1].match(/\d+/);

				builds[twa.data.builds[build[0]]] = Number(level);
			});

			var hideSize = builds.hide === 0 ? 0 : Math.round(150 * Math.pow(40 / 3, (builds.hide - 1) / 9));
			var storageSize = (builds.storage === 0 ? 1000 : Math.round(1000 * Math.pow(400, (builds.storage - 1) / 29))) - hideSize;
			var date = $('.nopad table:eq(1) tr:eq(1) td:last').text().split('.');
			date = new Date([date[1], date[0], '20' + date[2]].join(' ')).getTime();
			var now = $('#serverDate').text().split('/');
			now = new Date([now[1], now[0], now[2], $('#serverTime').text()].join(' ')).getTime();
			var time = new Date(now - date).getTime();
			var hour = Math.floor(time / (60 * 60 * 1000));
			var min = Math.floor(time / (1000 * 60)) % 60;
			var attCoords = $('#attack_info_att tr:eq(1) a').text().match(/ \((\d+)\|(\d+)\) \w+ $/);
			var defCoords = $('#attack_info_def tr:eq(1) a').text().match(/ \((\d+)\|(\d+)\) \w+ $/);
			var distance = Math.sqrt(Math.pow(Number(attCoords[1]) - Number(defCoords[1]), 2) + Math.pow(Number(attCoords[2]) - Number(defCoords[2]), 2));
			var necessary2farm = 0;
			var necessaryUnits = {};
			var resLvl = [builds.wood, builds.stone, builds.iron];
			var orderUnits = ['knight', 'light', 'marcher', 'heavy', 'spear', 'axe', 'archer', 'sword'];
			var farthest = 0;

			for(var i = 0; i < orderUnits.length; i++) {
				if(twa.data.units[orderUnits[i]]) {
					var time = twa.data.units[orderUnits[i]].speed * (distance / twa.data.world.unit_speed);
					var hour = Math.floor(time / 3600);
					var min = Math.floor((time - (hour * 3600)) / 60);
					var times = parseFloat(hour + '.' + min);

					if(times > farthest) {
						farthest = times;
					}
				}
			}

			var timeCommand = String(farthest).split('.');

			discovery.map(function (item, i) {
				var prod = resLvl[i] === 0 ? 5 * twa.data.world.speed : Math.round(30 * Math.pow(80, (resLvl[i] - 1) / 29)) * twa.data.world.speed;

				item = Number(item);
				item += (hour * prod) + min * (prod / 60) + (timeCommand[0] * prod) + (timeCommand[1] * (prod / 60));

				if(item > storageSize) {
					item = storageSize;
				}

				necessary2farm += item;
			});

			var attpid = $('#attack_info_att a:first').attr('href').match(/\d+/);
			var attvid = $('#attack_info_att tr:eq(1) a').attr('href').match(/\d+$/);
			var coords = $('#attack_info_def a[href*=info_village]').text().match(/.*\((\d+)\|(\d+)\)\sK\d{1,2}/).slice(1, 3);
			var vid = game_data.village.id;

			if(attpid === game_data.player.id) {
				vid = $('#twa-currentvillage:checked').length ? curvid : attvid;
			}

			$.get(game_data.link_base_pure.replace(/village=\d+/, 'village=' + vid) + 'place', function(html) {
				var units = twa.currentunits(html);

				for(var i = 0; i < orderUnits.length; i++) {
					var unit = orderUnits[i];

					if(twa.data.units[unit] && $('#twa-units .' + unit + ':checked').length) {
						var carry = twa.data.units[unit].carry,
							carryLimit = units[unit] * carry;

						if(units[unit] !== 0) {
							if(carryLimit >= necessary2farm) {
								necessaryUnits[unit] = necessary2farm / carry;
								break;
							} else {
								necessaryUnits[unit] = carryLimit > necessary2farm ? carry / necessary2farm : units[unit];
								necessary2farm -= carryLimit;
							}
						}

						if(!necessaryUnits.spy && $('.twa-units input[value=spy]:checked').length && units.spy > 0) {
							necessaryUnits.spy = units.spy > 4 ? 5 : units.spy;
						}
					}
				}

				for(var unit in necessaryUnits) {
					$('#twa-' + unit).show().find('span').html(necessaryUnits[unit]);
				}

				$('#twa-attack')[$.isEmptyObject(necessaryUnits) ? 'hide' : 'show']();
			});
		},
		addcheckbox: function() {
			console.log('twa.addcheckbox()');

			$('.overview_table tr').each(function(index) {
				if(!index) {
					$(this).prepend('<th></th>');

					return;
				}

				var vid = $('a[href*="village="]:first', this).attr('href').match(/village=(\d+)/)[1];

				$(this).prepend('<td><input type="checkbox" name="village_ids[]" class="addcheckbox" value="' + vid + '"/></td>');
			});
		},
		selectvillages: {
			init: function() {
				console.log('twa.selectvillages()');

				var mode = $('#overview').val() || 'default';
				var modes = twa.selectvillages.modes;
				var ready = false;

				for(var name in modes) {
					if(mode === modes[name][0]) {
						ready = true;
					}
				}

				if(ready) {
					$('.overview_table').before('<table class="vis" width="100%"><tr><th>' + lang.selectvillages.selectvillages + ' <span id="twa-selectvillages"></span></th></tr></table>');
				}

				$('#combined_table tr:first th:has(img[src*="unit/unit"]) img').each(function () {
					twa.selectvillages.tools.unitsorder.push(this.src.match(/unit_(\w+)/)[1]);
				});

				for(var name in modes) {
					if(mode === modes[name][0]) {
						modes[name][1]();
					}
				}
			},
			modes: {
				unitsattack: ['combined', function() {
					var villages = $('#combined_table tr:not(:first)');

					$('<input type="checkbox" id="twa-selectvillages-unitsattack">').change(function () {
						for(var i = 0; i < villages.length; i++) {
							var units = twa.selectvillages.tools.getunits(villages[i]);
							var popatt = twa.selectvillages.tools.getpop('att', units);
							var popdef = twa.selectvillages.tools.getpop('def', units);

							if(popatt > popdef) {
								$('.addcheckbox', villages[i]).attr('checked', this.checked);
							}
						}
					}).add(' <label for="twa-selectvillages-unitsattack">' + lang.selectvillages.unitsattack + '</label>').appendTo('#twa-selectvillages');
				}],
				unitsdefence: ['combined', function() {
					var villages = $('#combined_table tr:not(:first)');

					$('<input type="checkbox" id="twa-selectvillages-unitsdefence">').change(function () {
						for(var i = 0; i < villages.length; i++) {
							var units = twa.selectvillages.tools.getunits(villages[i]);
							var popatt = twa.selectvillages.tools.getpop('att', units);
							var popdef = twa.selectvillages.tools.getpop('def', units);

							if(popatt < popdef) {
								$('.addcheckbox', villages[i]).attr('checked', this.checked);
							}
						}
					}).add(' <label for="twa-selectvillages-unitsdefence">' + lang.selectvillages.unitsdefence + '</label>').appendTo('#twa-selectvillages');
				}],
				unitsnob: ['combined', function() {
					var villages = $('#combined_table tr:not(:first)');

					$('<input type="checkbox" id="twa-selectvillages-unitsnob">').change(function () {
						for(var i = 0; i < villages.length; i++) {
							var units = twa.selectvillages.tools.getunits(villages[i]);

							if(units.snob > 0) {
								$('.addcheckbox', villages[i]).attr('checked', this.checked);
							}
						}
					}).add(' <label for="twa-selectvillages-unitsnob">' + lang.selectvillages.unitsnob + '</label>').appendTo('#twa-selectvillages');
				}]
			},
			tools: {
				getunits: function(village) {
					var elems = $('.unit-item', village);
					var units = {};

					elems = elems.add(elems.next().last());

					for(var i = 0; i < twa.selectvillages.tools.unitsorder.length; i++) {
						units[twa.selectvillages.tools.unitsorder[i]] = Number(elems.eq(i).text());
					}

					return units;
				},
				getpop: function(type, units) {
					var pop = 0;

					switch(type) {
					case 'att':
						for(var i = 0; i < twa.selectvillages.tools.unitsatt.length; i++) {
							var unit = twa.selectvillages.tools.unitsatt[i];

							pop += units[unit] * twa.data.units[unit].pop;
						}
						break;
					case 'def':
						for(var i = 0; i < twa.selectvillages.tools.unitsdef.length; i++) {
							var unit = twa.selectvillages.tools.unitsdef[i];

							pop += units[unit] * twa.data.units[unit].pop;
						}
						break;
					case 'all':
						for(var i in units) {
							pop += units[i] * twa.data.units[units[i]].pop;
						}
						break;
					}

					return pop;
				},
				unitsatt: ['axe', 'light', 'marcher', 'ram', 'catapult', 'knight', 'snob'],
				unitsdef: ['light', 'sword', 'archer', 'heavy'],
				unitsorder: []
			}
		},
		rename: {
			init: function(expr, type, id, l) {
				console.log('twa.rename()');

				var elem = $(expr);

				if(expr !== '.overview_table') {
					elem = elem.parent();
				}

				elem.before('<table class="vis" width="100%"><tr><th>' + lang.rename.rename + ' ' + type + ': <input type="text" id="twa-' + id + '" style="padding:1px 2px;border:1px solid red;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px;height:15px"/> <input type="button" value="' + lang.rename.rename + '"/><label><input type="checkbox" id="twa-onlyselected"/> ' + lang.rename.only + ' ' + type + ' ' + lang.rename.selected + '</label> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr></table>');

				$(document).ajaxStart(function () {
					$('#twa-loader').show();
				}).ajaxStop(function () {
					$('#twa-loader').hide();
				});
			},
			reports: function() {
				twa.rename.init('#report_list', lang.rename.report, 'reportrename', 'o');

				twa.rename._do({
					entry: '#twa-reportrename',
					input: '#report_list tr:not(:first, :last):visible input:not([type=checkbox])',
					inputChecked: '#report_list tr:not(:first, :last):visible:has(input:checked) input:not([type=checkbox])'
				});
			},
			commands: function() {
				twa.rename.init('.overview_table', lang.rename.commands, 'commandrename', 'o');
				$('.overview_table input[type=checkbox]').removeAttr('disabled');

				twa.rename._do({
					entry: '#twa-commandrename',
					input: '.overview_table tr:not(:first, :last):visible input[id^=editInput]',
					inputChecked: '.overview_table tr:not(:first, :last):visible:has(input:checked) input[id^=editInput]'
				});
			},
			villages: function() {
				twa.rename.init('.overview_table', lang.rename.villages, 'villagerename', 'a');

				twa.rename._do({
					entry: '#twa-villagerename',
					input: '.overview_table tr:not(:first):visible input[id^=edit_input]',
					inputChecked: '.overview_table tr:not(:first):visible:has(input:checked) input[id^=edit_input]',
					min: 3,
					max: 32
				});
			},
			_do: function(o) {
				function handle(go) {
					if(!this.val() || this.val().length < (o.min || 1) || this.val().length > (o.max || 255)) {
						return this.css('border', '1px solid red');
					} else {
						this.css('border', '1px solid silver');
					}

					if(!go) {
						return;
					}

					$($('#twa-onlyselected:checked').length ? o.inputChecked : o.input).val(this.val()).next().click();
				}

				$(o.entry).keyup(function (event) {
					handle.call($(this), event.keyCode === 13);
					return false;
				}).keypress(function (event) {
					return event.keyCode !== 13;
				});

				$(o.entry).next().click(function () {
					handle.call($(this).prev(), true);
				});
			}
		},
		assistentfarm: {
			id: 0,
			init: function() {
				console.log('twa.assistentfarm()');

				$('h3:first').append(' <span id="twa-assistentfarm">(' + lang.assistentfarm.auto + ')</span>');
				$('#farm_units').parent().after('<div class="vis" style="overflow:auto;height:100px"><table style="width:100%"><tr id="twa-assistent-log"><th><h4>' + lang.assistentfarm.log + '</h4></th></tr></table></div>');
				twa.assistentfarm.prepare();
			},
			log: function(log, error) {
				$('#twa-assistent-log').after('<tr><td>' + (twa.assistentfarm.id++) + ': <img src="' + (error ? '/graphic/delete_small.png' : '/graphic/command/attack.png') + '"/> ' + log + '</td></tr>');
			},
			prepare: function() {
				var elems = [];
				var index = 0;

				$.get(location.href, function(html) {
					$('#am_widget_Farm table tr[class]', html).each(function () {
						elems.push(this);
					});

					setInterval(function () {
						twa.assistentfarm.attack(elems[index]);

						if(++index === elems.length) {
							index = 0;
						}
					}, 5000);
				});
			},
			attackHandler: {
				sendUnits: function(village, template, name) {
					$.ajax({
						type: 'post',
						url: Accountmanager.send_units_link,
						data: {
							target: village,
							template_id: template
						},
						village: name,
						success: function(complete) {
							complete = JSON.parse(complete);

							if(complete.success) {
								twa.assistentfarm.log(complete.success.replace('\n', ' ') + ' ' + lang.assistentfarm.onvillage + ' ' + this.village);
							} else if(complete.error) {
								twa.assistentfarm.log(complete.error + ' ' + lang.assistentfarm.onvillage + ' ' + this.village, true);
							}
						}
					});
				},
				reportAttack: function(village, report, name) {
					$.ajax({
						type: 'post',
						url: Accountmanager.send_units_link_from_report,
						data: {
							report_id: report
						},
						village: name,
						success: function(complete) {
							complete = JSON.parse(complete);

							if(complete.success) {
								twa.assistentfarm.log(complete.success.replace('\n', ' ') + ' ' + lang.assistentfarm.onvillage + ' ' + this.village);
							} else if(complete.error) {
								twa.assistentfarm.log(complete.error + ' ' + lang.assistentfarm.onvillage + ' ' + this.village, true);
							}
						}
					});
				}
			},
			attack: function(elem) {
				var icon_a = $('.farm_icon_a:not(.farm_icon_disabled)', elem);
				var icon_b = $('.farm_icon_b:not(.farm_icon_disabled)', elem);
				var icon_c = $('.farm_icon_c:not(.farm_icon_disabled)', elem);
				var index = icon_c.length ? 10 : icon_a.length ? 8 : icon_b.length ? 9 : 0;
				var data = $('td:eq(' + index + ') a', elem).attr('onclick').toString().match(/(\d+), (\d+)/);

				twa.assistentfarm.attackHandler[index === 10 ? 'reportAttack' : 'sendUnits'](data[1], data[2], $('td:eq(3) a', elem).html());
			}
		},
		autofarm: {
			init: function() {
				console.log('twa.autofarm()');

				var content = twa.baseTool('twa-autofarm', lang.autofarm.farm, 'http://cdn.tribalwars.com.br/graphic/command/attack.png', '<style>#twa-autofarm-units input{width:30px;text-align:center}#twa-autofarm-content img{margin-left:5px;margin-right:2px}</style><h2>' + lang.autofarm.autofarm + '</h2><span class="twa-autofarm-options"><table width="100%" class="vis"><tr><td id="twa-autofarm-units"></td></tr><tr><td><strong>' + lang.autofarm.coords + '</strong><br/><textarea style="width:584px;height:90px" name="_placefarmcoords">' + twa.settings._placefarmcoords.join(' ') + '</textarea></td></tr><tr><td><label><input type="checkbox" name="_placefarmprotect"/> ' + lang.autofarm.protect + '</label></td></tr><tr><td><label><input type="checkbox" name="_placefarmreplace"/> ' + lang.autofarm.replace + '</label></td></tr><tr><th><input type="button" value="' + lang.autofarm.start + '" id="twa-autofarm-switch"/></th></tr></table><h3>' + lang.autofarm.log + '</h3><div style="overflow:auto;height:150px"><table id="twa-autofarm-log" style="width:100%" class="vis"></table></div>');
				var units = $('#twa-autofarm-units');
				var timeout = false;

				for(var name in twa.data.units) {
					units.append('<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input name="' + name + '" style="width:30px"/>');
				}

				content.find(':input[name]').each(function () {
					if(this.type === 'checkbox') {
						this.checked = twa.settings[this.name];

						$(this).change(function () {
							twa.settings[this.name] = this.checked;
							twa.storage(true);
						});
					} else {
						if(this.type === 'text') {
							this.value = twa.settings._placefarmunits[this.name] || 0;
						} else {
							this.value = twa.settings._placefarmcoords.join(' ');
						}

						$(this).keyup(function () {
							var elem = this;
							this.value = this.value.replace(/[^0-9\|\s]/g, '').replace(/\s+/, ' ');

							clearTimeout(timeout);

							timeout = setTimeout(function () {
								if(elem.type === 'text') {
									twa.settings._placefarmunits[elem.name] = twa.autofarm.data[elem.name] = elem.value;
								} else {
									var coords = elem.value.split(/\s+/);
									var correctCoords = [];

									for(var i = 0; i < coords.length; i++) {
										if(/-?\d{1,3}\|-?\d{1,3}/.test(coords[i])) {
											correctCoords.push(coords[i]);
										}
									}

									twa.settings._placefarmcoords = correctCoords;
									twa.autofarm.next(true);
								}

								twa.storage(true);
							}, 500);
						});
					}
				});

				$('#twa-autofarm-switch').click(function () {
					twa.autofarm.stop = !twa.autofarm.stop;
					this.value = twa.autofarm.stop ? lang.autofarm.start : lang.autofarm.pause;
					!twa.autofarm.stop && twa.autofarm.attack();
				});

				for(var timer in timers) {
					timers[timer].reload = false;
				}

				for(name in twa.data.units) {
					twa.autofarm.data[name] = twa.settings._placefarmunits[name];
				}
				
				if(twa.settings._placefarmindex >= twa.settings._placefarmcoords.length) {
					twa.settings._placnnnefarmindex = 0;
				}

				if(twa.settings._placefarmcoords.length) {
					twa.autofarm.coord = twa.settings._placefarmcoords[twa.settings._placefarmindex].split('|');
				}
			},
			log: function(log, error) {
				$('#twa-autofarm-log').prepend('<tr><td><strong>' + ($('#serverTime').text() + ' ' + $('#serverDate').text()) + ':</strong> <img src="' + (error ? '/graphic/delete_small.png' : '/graphic/command/attack.png') + '"/> ' + log + '</td></tr>');
				return twa.autofarm;
			},
			attack: function(units) {
				if(!twa.autofarm.stop) {
					if(!twa.autofarm.wait) {
						twa.autofarm.data.x = twa.autofarm.coord[0];
						twa.autofarm.data.y = twa.autofarm.coord[1];

						if(units) {
							for(var unit in units) {
								twa.autofarm.data[unit] = units[unit];
							}
						}
						
						$.post(game_data.link_base_pure.replace('en=', 'en=place&try=confirm'), twa.autofarm.data, function(html) {
							var error = $(html).find('#error');

							if(error.text()) {
								var time = twa.autofarm.nextreturn(html);
								var troops = twa.autofarm.currentunits(html);
								
								if(time && !troops) {
									console.log(time);
									twa.autofarm.log( lang.autofarm.returnin.sprintf(time.format()), true );
									
									setTimeout(function () {
										twa.autofarm.attack().wait = false;
									}, time);
									
									twa.autofarm.wait = true;
								} else if(!time && !troops) {
									twa.autofarm.log( lang.autofarm.notroops, true ).wait = true;
								} else if(troops) {
									twa.autofarm.attack(troops);
								}

								return;
							}

							if(twa.settings._placefarmprotect && $(html).find('form a[href*=player]').length) {
								return twa.autofarm.next();
							}

							var form = $(html).find('form');
							
							$.post(form[0].action, form.serialize(), function() {
								twa.autofarm.log( lang.autofarm.success.sprintf(twa.autofarm.coord.join('|'))).next();
							});
						});
					}
				} else {
					var id = setInterval(function () {
						if(!twa.autofarm.stop) {
							twa.autofarm.attack();
							clearInterval(id);
						}
					}, 500);
				}
				
				return twa.autofarm;
			},
			nextreturn: function(html) {
				var line = $('table.vis:last tr:not(:first)', html);
				var returning = line.find('[src*=cancel], [src*=back], [src*=return]');
				var going = line.find('[src*=attack]');
				var time = returning.length ? returning : going.length ? going : false;
				var going = going.length ? 2 : 1;

				if(!time) {
					return false;
				}

				if(time = time.eq(0).parent().parent().find('.timer').text()) {
					time = time.split(':');
					console.log(going);
					return ((time[0] * 3600000) + (time[1] * 60000) + (time[2] * 1000)) * going;
				}
			},
			currentunits: function(html) {
				var troops = {};
				
				if(twa.settings._placefarmreplace) {
					$('.unitsInput', html).each(function () {
						var unit = this.id.split('_')[2];
						var amount = Number($(this).next().text().match(/\d+/)[0]);
						
						if(amount != 0 && twa.settings._placefarmunits[unit] && twa.settings._placefarmunits[unit] > amount) {
							troops[unit] = amount;
						}
					});
				}
				
				return !$.isEmptyObject(troops) ? troops : false;
			},
			next: function(check) {
				if(!check) {
					twa.settings._placefarmindex++;
				}

				if(twa.settings._placefarmindex >= twa.settings._placefarmcoords.length) {
					twa.settings._placefarmindex = 0;
				}

				twa.storage(true);

				if(twa.settings._placefarmcoords.length) {
					twa.autofarm.coord = twa.settings._placefarmcoords[twa.settings._placefarmindex].split('|');
				}

				if(!check) {
					twa.autofarm.attack();
				}
				
				return twa.autofarm;
			},
			stop: true,
			wait: false,
			data: { attack: true },
			coord: []
		},
		building: {
			init: function() {
				console.log('twa.building()');

				$('.overview_table').before('<table class="vis" id="twa-building" width="100%"><tr><th><label><input type="radio" checked name="twa-building" id="twa-building-build"/> ' + lang.building.buildtitle + ' <img src="graphic/questionmark.png" width="13" title="' + lang.building.buildhelp + '"/></label> <a href="#" id="twa-cancel-builds">� ' + lang.building.cancelbuilds + '</a></th></tr><tr><td class="twa-buildings"></td></tr><tr><th><label><input type="radio" name="twa-building" id="twa-building-destroy"/> ' + lang.building.destroytitle + ' <img src="graphic/questionmark.png" width="13" title="' + lang.building.destroyhelp + '"/></label> <a href="#" id="twa-cancel-destroy">� ' + lang.building.canceldestroy + '</a></th></tr><tr><td class="twa-buildings"></td></tr></table><table class="vis" width="100%"><tr><th>' + lang.building.help + '</th></tr></table>');

				$('#twa-building-build, #twa-building-destroy').click(function () {
					if((BuildingOverview._display_type === 1 && this.id === 'twa-building-destroy') || (BuildingOverview._display_type === 0 && this.id === 'twa-building-build')) {
						return;
					}

					BuildingOverview.show_all_upgrade_buildings(this.id === 'twa-building-destroy');
				});

				$('#twa-cancel-builds, #twa-cancel-destroy').unbind('click').click(function () {
					if(confirm(lang.building.confirmcancel.springf(this.id === 'twa-cancel-destroy' ? lang.building.demolitions : lang.building.buildings))) {
						twa.building.cancel(this.id === 'twa-cancel-destroy');
					}

					return false;
				});

				if(BuildingOverview._display_type === false) {
					BuildingOverview.show_all_upgrade_buildings();
				} else if(BuildingOverview._display_type) {
					$('#twa-building-destroy').attr('checked', true);
				}

				for(var i = 0; i < 2; i++) {
					var td = $('.twa-buildings').eq(i);

					for(var build in twa.data.builds) {
						build = twa.data.builds[build];

						td.append('<img src="graphic/buildings/' + build + '.png"/> <input type="text" style="width:25px" name="' + build + '" value="' + twa.settings[i ? '_buildingdestroy' : '_buildingbuild'][build] + '"/> ');
					}
				}

				var timeout;

				$('.twa-buildings').each(function (tableIndex) {
					$('input', this).keyup(function () {
						var index = tableIndex;
						var elem = this;

						clearTimeout(timeout);

						setTimeout(function () {
							twa.settings[index ? '_buildingdestroy' : '_buildingbuild'][elem.name] = elem.value;
							twa.storage(true);
						}, 2000);
					}).keypress(function (event) {
						return event.charCode > 47 && event.charCode < 58 && this.value.length < 3;
					});
				});

				$('#buildings_table tr:first th:has(img[src*=buildings]) a').click(function () {
					return twa.building._do($('img', this)[0].src.match(/\/([a-z]+)\.png/)[1], BuildingOverview._display_type);
				});
			},
			_do: function(build, destroy) {
				var url = $('#upgrade_building_link').val();
				var max = destroy ? 5 : twa.settings._buildingmaxorders;
				var limit = $('.twa-buildings').eq(destroy).find('input[name=' + build + ']').val();

				$('#buildings_table tr:not(:first)').each(function () {
					var vid = this.className.match(/\d+/)[0];
					
					if(BuildingOverview._upgrade_villages[vid].buildings[build]) {
						var curOrders = $('td:last li:has(.build-status-light[style*=' + (destroy ? 'red' : 'green') + ']) img[src*="' + build + '.png"]', this);
						var cur = Number($('.b_' + build + ' a', this).text()) + curOrders.length;
						
						for(var orders = $('#building_order_' + vid + ' img').length / 2; orders < max; orders++) {
							if(destroy ? cur-- > limit : cur++ < limit) {
								$.getJSON(url.replace(/village=\d+/, 'village=' + vid), {
									id: build,
									destroy: destroy,
									force: 1
								}, function(complete) {
									if(complete.success) {
										if(!$('#building_order_' + vid).length) {
											var ul = $('<ul class="building_order" id="building_order_' + vid + '"></ul>');

											BuildingOverview.create_sortable(ul);
											$('#v_' + vid + ' td:last').append(ul);
										}

										$('#building_order_' + vid).html(complete.building_orders);
									}
								});
							}
						}
					}
				});

				return false;
			},
			cancel: function(destroy) {
				$('li:has(.build-status-light[style*=' + (destroy ? 'red' : 'green') + ']) .build-cancel-icon img').click();
			}
		},
		research: {
			init: function() {
				console.log('twa.research()');

				$('.overview_table').before('<table class="vis" width="100%" id="twa-research"><tr><th>' + lang.research.help + ' <a href="#" id="twa-research-cancel">� ' + lang.research.cancel + '</a></th></tr></table>');

				$('#twa-research-cancel').click(function () {
					if(confirm(lang.research.confirmcancel)) {
						twa.research.cancel();
					}

					return false;
				});

				$('#techs_table tr:first a:has(img)').click(function () {
					return twa.research._do(this.href.match(/order=(\w+)/)[1]);
				});
			},
			_do: function(unit) {
				var villages = document.getElementById('techs_table').getElementsByTagName('tr');

				for(var i = 1; i < villages.length; i++) {
					var vid = villages[i].id.split('_')[1];

					if(document.getElementById(vid + '_' + unit)) {
						$.ajax({
							type: 'post',
							url: TechOverview.urls.ajax_research_link.replace(/village=\d+/, 'village=' + vid),
							data: { tech_id: unit },
							dataType: 'json',
							vid: vid,
							success: function(complete) {
								if(complete.success) {
									document.getElementById('village_tech_order_' + this.vid).innerHTML = complete.tech_order;
									TechOverview.change_dot($('#' + this.vid + '_' + unit), this.vid, unit, 'brown');

									if(game_data.village.id == this.vid) {
										$('#wood').html(complete.resources[0]);
										$('#stone').html(complete.resources[1]);
										$('#iron').html(complete.resources[2]);
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
				$('#techs_table div.tech-cancel-icon img').each(function () {
					var data = this.onclick.toString().match(/cancel_research_order\((\d+), (\d+), '(\w+)'\)/);

					$.ajax({
						url: TechOverview.urls.ajax_cancel_tech_order_link.replace(/village=\d+/, 'village=' + data[1]),
						dataType: 'json',
						type: 'post',
						data: {
							tech_order_id: data[2]
						},
						name: data[3],
						vid: data[1],
						success: function(complete) {
							if(complete.success) {
								document.getElementById('village_tech_order_' + this.vid).innerHTML = complete.tech_order;
								TechOverview.restore_dot(this.vid, this.name);
							}
						}
					});
				});
			}
		},
		memo: {
			init: function() {
				console.log('twa.memo()');

				var content = twa.baseTool('twa-memo', lang.memo.memo, 'http://cdn.tribalwars.net/graphic/overview/note.png', '<textarea style="width:400px;height:150px"></textarea><br/><input type="button" value="' + lang.memo.save + '"/> <span id="twa-memo-time" style="font-style:italic;font-size:10px"></span> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px"/>', 410);
				content.find('input').click(function() {
					if(!content.find('img').is(':visible')) {
						twa.memo.edit(content);
					}
				});

				twa.memo.getContent(function(note, time) {
					$('#twa-memo-time').html('�ltima altera��o: ' + (time || 'nunca.'));
					content.find('textarea').val(note);
					content.find('img').hide();
				});
			},
			getElement: function(callback) {
				var elem;

				$.get(twa.linkbase('memo'), function(html) {
					if(twa.data.memoid && $('#' + twa.data.memoid, html).length) {
						elem = $('#' + twa.data.memoid, html);
					} else {
						var lower = 60000;

						$('.memo_container', html).each(function() {
							var textarea = $('textarea', this);

							if(textarea.val().length < lower) {
								lower = textarea.val().length;
								elem = textarea;
							}
						});

						twa.storage('memoid', elem[0].id, 'data');
					}

					callback(elem);
				});
			},
			getContent: function(callback) {
				twa.memo.getElement(function(elem) {
					var match = elem.val().match(/\[twanote\]([^]+)\[\/twanote\-([0-9:\/\s]+)\]/);

					callback.apply(window, match && match[1] ? [match[1], match[2]] : []);
				});
			},
			edit: function(content) {
				content.find('img').show();

				twa.memo.getElement(function(elem) {
					var elemTime = $('.server_info span');
					var time = elemTime[0].innerHTML + ' ' + elemTime[1].innerHTML;

					if(/\[twanote\]([^]+)\[\/twanote\-[0-9:\/\s]+\]/.test(elem.val())) {
						elem.val(elem.val().replace(/\[twanote\]([^]+)\[\/twanote\-[0-9:\/\s]+\]/, '[twanote]' + content.find('textarea').val() + '[/twanote-' + time + ']'));
					} else {
						elem.val(elem.val() + '\n\n[twanote]' + content.find('textarea').val() + '[/twanote-' + time + ']');
					}

					$('#twa-memo-time').html(lang.memo.lastchange.sprintf(time));

					var form = elem.parentsUntil('.memo_script').last();

					$.post(form[0].action, form.serialize(), function() {
						content.find('img').hide();
					});
				});
			}
		},
		changegroups: {
			init: function() {
				console.log('twa.changegroups()');

				$('.overview_table').before('<table class="vis" width="100%" id="twa-changegroups"><tr><th>' + lang.changegroups.changegroups + ' <select id="twa-group" name="selected_group"></select> <input type="submit" value="' + lang.changegroups.add + '" name="add_to_group"/> <input type="submit" value="' + lang.changegroups.remove + '" name="remove_from_group"/> <input type="submit" value="' + lang.changegroups.move + '" name="change_group"/> <img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px;display:none" id="twa-loader"/></th></tr></table>');

				$('#twa-changegroups input').click(function () {
					twa.changegroups.change(this);
				});

				var elemGroups = document.getElementById('twa-group');
				var groups = twa.changegroups.getgroups();

				for(var id in groups) {
					elemGroups.innerHTML += '<option value="' + id + '" name="village_ids[]">' + groups[id] + '</option>';
				}

				$('#combined_table tr.nowrap')
			},
			change: function(button) {
				$('#twa-loader').show();

				var data = $('[name="village_ids[]"], [name=selected_group]').serializeArray();
				data.push({
					name: button.name,
					value: button.value
				});

				console.log(data);

				$.post(twa.linkbase('overview_villages') + '&mode=groups&action=bulk_edit_villages&h=' + game_data.csrf, data, function() {
					$('#twa-loader').hide();
				});
			},
			getgroups: function() {
				var groups = {};

				$('#group_table tr:not(:first, :last) td[id^=show_group] a').each(function () {
					groups[this.href.match(/edit_group=(\d+)/)[1]] = this.innerHTML;
				});

				return groups;
			}
		},
		attackplanner: {
			villages: {},
			init: function() {
				console.log('twa.attackplanner()');

				var content = twa.baseTool('twa-attackplanner', lang.attackplanner.planner, 'http://cdn.tribalwars.com.br/graphic/command/attack.png', '<style>#twa-attackplanner-content td{padding:3px}</style><h2>' + lang.attackplanner.attackplanner + '</h2><h3>' + lang.attackplanner.addcommand + '</h3><table class="vis" width="100%"><tr><th colspan="4">' + lang.attackplanner.attacker + '</th><th colspan="4">' + lang.attackplanner.target + '</th><th colspan="4">' + lang.attackplanner.time + '</th><th colspan="4">' + lang.attackplanner.support + '</th></tr><tr><td colspan="4"><input value="xxx|yyy" style="width:90px;border:1px solid red" name="from"/></td><td colspan="4"><input style="width:90px;border:1px solid red" value="xxx|yyy" name="to"/></td><td colspan="4"><input name="time" value="' + twa.data.attackplanner.lastTime + '" style="width:200px;border:1px solid #aaa"/></td><td><input name="support" type="checkbox"/></td></tr></table><table width="100%" class="vis"><tr><th colspan="12">' + lang.attackplanner.troops + '</th></tr><tr id="twa-units"></tr><tr><td colspan="12"><button name="add">' + lang.attackplanner.addcommand + '</button></td></tr></table><h3>' + lang.attackplanner.commands + '</h3><table class="vis" width="100%" id="twa-commands"><tr><th>' + lang.attackplanner.attacker + '</th><th>' + lang.attackplanner.target + '</th><th>' + lang.attackplanner.time + '</th><th>' + lang.attackplanner.type + '</th><th>' + lang.attackplanner.troops + '</th><th>' + lang.attackplanner.remove + '</th></tr></table><h3>' + lang.attackplanner.commandssended + '</h3><div style="overflow:auto;height:150px"><table id="twa-attackplanner-log" style="width:100%" class="vis"></table></div>');
				var unitsContent = document.getElementById('twa-units');
				var inputs = content.find('input').css({
					fontStyle: 'italic',
					color: '#ccc',
					textAlign: 'center'
				}).focus(function () {
					if(((this.name === 'from' || this.name === 'to') && this.value === 'xxx|yyy') || this.name === 'time' && this.value === 'hh:mm:ss dd/mm/yyyy') {
						this.value = '';
						$(this).css({
							fontStyle: 'normal',
							color: 'black'
						});
					}
				}).blur(function () {
					if(this.value !== '') return;
					this.value = this.name === 'time' ? 'hh:mm:ss dd/mm/yyyy' : 'xxx|yyy';
					$(this).css({
						fontStyle: 'italic',
						color: '#ccc'
					});
				});

				content.find('input[name=time]').css({
					fontStyle: 'normal',
					color: '#000'
				});

				var timeout;

				$('input[name=from]').change(function () {
					clearTimeout(timeout);

					if(this.style.border === '1px solid red') {
						return false;
					}

					var coords = this.value;

					timeout = setTimeout(function () {
						twa.attackplanner.getvillageinfo(coords, function(data, coords) {
							$.get('/game.php?village=' + data.id + '&screen=place', function(html) {
								var units = {};

								$('.unitsInput', html).each(function () {
									var unit = $(this).next().text().match(/\d+/)[0];
									units[unit] = unit;

									$('.twa-units[name=' + this.name + ']').val(unit > 0 ? unit : '');
								});
							});
						});
					}, 500);
				});

				var ctime = $('.server_info:last span');

				for(var name in twa.data.units) {
					unitsContent.innerHTML += '<td><img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> <input style="width:33px;border:1px solid #aaa" class="twa-units" name="' + name + '"/></td> ';
				}

				function add() {
					for(var i = 0; i < inputs.length; i++) {
						inputs[i].value = $.trim(inputs[i].value);
					}

					if(inputs[0].value === inputs[1].value && inputs[0].value !== 'xxx|yyy' && inputs[1].value !== 'xxx|yyy') {
						return alert(lang.attackplanner.errorequal);
					}

					if($('[name=from]')[0].style.borderColor === 'red' || $('[name=to]')[0].style.borderColor === 'red' || $('[name=time]')[0].style.borderColor === 'red') {
						return false;
					}

					twa.data.attackplanner.lastTime = $('[name=time]')[0].value;
					twa.storage(true, null, 'data');

					var inserted = false;
					var itime = inputs[2].value.split(' ');
					var date = itime[1].split('/');
					var attackdata = {
						target: inputs[1].value,
						village: inputs[0].value,
						time: new Date(date[1] + '/' + date[0] + '/' + date[2] + ' ' + itime[0]).getTime(),
						units: {},
						support: $('[name=support]').is(':checked')
					};

					units.each(function () {
						if(this.value || Number(this.value) > 0) {
							attackdata.units[this.name] = Number(this.value);
							inserted = true;
						}
					});

					if(!inserted) {
						return alert(lang.attackplanner.errorunits);
					}

					twa.data.attackplanner.commands.push(attackdata);
					twa.attackplanner.update();
					twa.storage(true, null, 'data');
				}

				content.find('button').click(add);

				var units = $('.twa-units').keydown(function (event) {
					event.keyCode === 13 && add();
				});

				inputs.keyup(function () {
					if((this.name === 'time' ? /[^\d\:\/\s]+/g : /[^\d\|]+/g).test(this.value)) {
						this.value = this.value.replace(this.name === 'time' ? /[^\d\:\/\s]+/g : /[^\d\|]+/g, '');
					}

					if(this.name === 'time') {
						if(/^(\d{2}:){2}\d\d (\d{2}\/){2}\d{4}$/.test(this.value)) {
							var itime = this.value.split(' ');
							var date = itime[1].split('/');
							var time = new Date(date[1] + '/' + date[0] + '/' + date[2] + ' ' + itime[0]);
							var cdate = ctime.eq(1).text().split('/');
							var current = new Date(cdate[1] + '/' + cdate[0] + '/' + cdate[2] + ' ' + ctime.eq(0).text());

							this.style.border = '1px solid ' + (current > time ? 'red' : '#aaa');
						} else {
							this.style.border = '1px solid red';
						}
					} else {
						this.style.border = '1px solid ' + (/^\d{1,3}\|\d{1,3}$/.test(this.value) ? '#aaa' : 'red');
					}
				}).keydown(function (event) {
					event.keyCode === 13 && add();
				});

				twa.attackplanner.update(function () {
					setInterval(function () {
						twa.attackplanner.checkattacks();
					}, 1000);
				});
			},
			update: function(callback) {
				if(twa.attackplanner.mailLink) {
					twa.attackplanner.updatefn(callback);
				} else {
					$.get(twa.linkbase('mail'), function(html) {
						twa.attackplanner.mailLink = twa.linkbase('mail') + '&mode=new&action=send&h=' + html.match(/"csrf":"(\w+)"/)[1];
						twa.attackplanner.updatefn(callback);
					});
				}
			},
			updatefn: function(callback) {
				if(twa.data.attackplanner.commands.length) {
					var cmds = twa.data.attackplanner.commands.sort(function (a, b) {
						return a.time - b.time;
					});

					var cmdsc = $('#twa-commands');
					cmdsc.find('tr:not(:first)').remove();

					for(var i = 0; i < cmds.length; i++) {
						var date = new Date(cmds[i].time);
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

						for(var unit in cmds[i].units) {
							units.push('<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + unit + '.png"/> ' + cmds[i].units[unit]);
						}

						var tr = $('<tr id="' + i + '"><td class="coord ' + cmds[i].village + '"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td class="coord ' + cmds[i].target + '"><img src="http://www.preloaders.net/preloaders/252/preview.gif" style="width:25px" class="load"/></td><td>' + hour + ':' + min + ':' + sec + ' ' + day + '/' + month + '/' + year + '</td><td>' + ( cmds[ i ].support ? lang.attackplanner.support : lang.attackplanner.attack) + '</td><td>' + units.join(' ') + '</td><td><a href="#" class="remove"><img src="/graphic/delete.png"/></a></td></tr>').appendTo(cmdsc);

						tr.find('.remove').click(function () {
							twa.data.attackplanner.commands.remove(Number($(this).parent().parent().attr('id')));
							twa.storage(true, null, 'data');
							twa.attackplanner.update();

							return false;
						});
					}

					cmdsc.find('.coord').each(function () {
						var coords = this.className.split(' ')[1];

						if(twa.attackplanner.villages[coords]) {
							var elems = cmdsc.find('td[class="coord ' + coords + '"]');

							if(twa.attackplanner.villages[coords].error) {
								return elems.html(lang.attackplanner.errorcoords.springf(coords));
							}

							elems.html('<a href="' + twa.linkbase('info_village') + '&id=' + twa.attackplanner.villages[coords].id + '">' + twa.attackplanner.villages[coords].name + '</a>');
						} else {
							twa.attackplanner.getvillageinfo(coords, function(data, coords) {
								var elems = cmdsc.find('td[class="coord ' + coords + '"]');

								if(data.error) {
									return elems.html(lang.attackplanner.errorcoords.springf(coords));
								}

								elems.html('<a href="' + twa.linkbase('info_village') + '&id=' + data.id + '">' + data.name + '</a>');
							});
						}
					});
				} else {
					$('#twa-commands tr:not(:first)').remove();
				}

				callback && callback();
			},
			getvillageinfo: function(coords, callback) {
				if(twa.attackplanner.villages[coords]) {
					return callback(twa.attackplanner.villages[coords]);
				} else {
					twa.attackplanner.villages[coords] = false;
				}

				$.post(twa.attackplanner.mailLink, {
					extended: 0,
					preview: 1,
					to: game_data.player.name,
					subject: '0',
					text: '[coord]' + coords + '[/coord]'
				}, function(html) {
					var elem = $('td[style="background-color: white; border: solid 1px black;"] a', html);

					twa.attackplanner.villages[coords] = elem.length ? {
						error: false,
						name: elem.text(),
						id: elem.attr('href').match(/id=(\d+)/)[1]
					} : {
						error: true
					};
					
					callback(twa.attackplanner.villages[coords], coords);
				});
			},
			checkattacks: function() {
				var ctime = $('.server_info:last span');
				var cdate = ctime.eq(1).text().split('/');
				var current = new Date(cdate[1] + '/' + cdate[0] + '/' + cdate[2] + ' ' + ctime.eq(0).text()).getTime();
				var length = twa.data.attackplanner.commands.length;

				for(var i = 0; i < twa.data.attackplanner.commands.length; i++) {
					if(current > twa.data.attackplanner.commands[i].time) {
						twa.attackplanner.attack(twa.data.attackplanner.commands[i]);
						twa.data.attackplanner.commands.remove(i);
					}
				}

				if(length !== twa.data.attackplanner.commands.length) {
					twa.storage(true, null, 'data');
					twa.attackplanner.update();
				}
			},
			attack: function(cmd) {
				twa.attackplanner.getvillageinfo(cmd.village, function(village) {
					var target = cmd.target.split('|');
					var data = $.extend({
						x: target[0],
						y: target[1]
					}, cmd.units);
					
					data[ cmd.support ? 'support' : 'attack' ] = true;
					
					var village = twa.attackplanner.villages[ cmd.village ].name;
					var target = twa.attackplanner.villages[ cmd.target ].name;
					var units = '';
					
					for ( var name in cmd.units ) {
						units += '<img src="http://cdn.tribalwars.net/graphic/unit/unit_' + name + '.png"/> ' + cmd.units[ name ] + ' ';
					}

					$.post(game_data.link_base_pure.replace('en=', 'en=place&try=confirm').replace(/village=\d+/, 'village=' + village.id), data, function(html) {
						var error = $(html).find('#error');
						var time = '<strong>' + ($('#serverTime').text() + ' ' + $('#serverDate').text()) + ':</strong>';
						
						if(error.text()) {
							return $('#twa-attackplanner-log').after('<tr><td>' + time + ' ' + error.text() + '</td></tr>');
						}
						
						var form = $('form', html);

						$.post(form[0].action, form.serialize(), function() {
							$('#twa-attackplanner-log').after('<tr><td>' + time + ' <img src="/graphic/command/' + (cmd.support ? 'support' : 'attack') + '.png"/> ' + lang.attackplanner.success.springf(cmd.support ? lang.attackplanner.support : lang.attackplanner.attack, cmd.village, cmd.target, units) + '</td></tr>');
						});
					});
				});
			},
			id: 0
		},
		messages: {
			conversation: {},
			lastreply: 0,
			init: function() {
				var content = twa.baseTool('twa-messages', lang.messages.messages, 'http://cdn2.tribalwars.net/graphic/new_mail.png', '<style>#twa-messages-text{width:700px;heigth:100px;font-size:11px} #twa-messages-content td{padding:3px}</style><h2>' + lang.messages.messages + '</h2><h3>' + lang.messages.desc + '</h3><table><tr><td>' + lang.messages.messagetype + '</td><td><select id="twa-messages-type"><option>' + lang.messages.question + '</option><option>' + lang.messages.suggest + '</option><option>' + lang.messages.bug + '</option><option>' + lang.messages.critic + '</option><option>' + lang.messages.other + '</option></select></td></tr><tr><td>' + lang.messages.subject + ':</td><td><input type="text" id="twa-messages-subject" size="40"/></td></tr><tr><td colspan="2"><textarea id="twa-messages-text"></textarea><br/><input type="button" value="' + lang.messages.send + '" id="twa-messages-submit"/></td></tr></table><h3>' + lang.messages.yourmessages + '</h3><table style="width:500px" class="vis" id="twa-messages-list"><thead><tr><th style="width:250px">' + lang.messages.subject + '</th><th>' + lang.messages.lastmessage + '</th><th>' + lang.messages.type + '</th></tr></thead><tbody></tbody></table><div id="twa-messages-conversation"></div>');

				twa.messages.update();
				twa.messages.newmessage();
				twa.messages.reply();

				setInterval(function () {
					if(content.is(':visible')) {
						twa.messages.update();
					}
				}, 10000);
			},
			reply: function() {
				$('#twa-messages-list tbody a.message').live('click', function() {
					var mid = Number($(this).attr('mid'));
					var html = $('<p><a href="javascript:void(0);" class="back">� ' + lang.messages.back + '</a></p><table class="vis" 	style="width:500px"><tr><th>' + lang.messages.subject + '</th><th>' + twa.messages.conversation[mid].subject + '</th></tr><tr><td>' + lang.messages.partner + '</td><td><img src="http://cdn2.tribalwars.net/graphic/new_mail.png"/> <a href="http://code.google.com/p/tribalwars-scripts/wiki/Relaxeaza_Tribal_Wars_Advanced">Relaxeaza</a></td></tr><tr><td colspan="2"><a href="javascript:void(0)" class="reply">� ' + lang.messages.reply + '</a><div style="display:none"><textarea style="width:490px;height:60px"></textarea><br/><input type="button" value="' + lang.messages.reply + '"/></div></td></td></tr><tr><td colspan="2" class="conversation-list"></td></tr></table>');
					var convList = $('.conversation-list', html);
					var convContent = $('#twa-messages-conversation');
					var listTable = $('#twa-messages-list ');

					$.each(twa.messages.conversation[mid].messages, function(mid, message) {
						convList.prepend('<div class="post"><div class="igmline"><span class="author"><strong>' + (message.response === '1' ? 'Relaxeaza' : game_data.player.name) + '</strong></span><span class="date">' + message.time + '</span></div><div class="text">' + message.text + '</div></div>');
					});

					$('.reply', html).click(function () {
						$(this).hide().next().show();
					});

					$('input', html).click(function () {
						if(new Date().getTime() - twa.messages.lastreply < 10000) {
							return alert(lang.messages.errortime);
						}

						var text = $('textarea', html).val().replace(/\n/g, '<br/>');

						if(!text.length) {
							return false;
						}

						twa.messages.lastreply = new Date().getTime();

						$.getJSON(twa.domain + 'new.php?callback=?', {
							mid: mid,
							text: text
						}, function(time) {
							convList.prepend('<div class="post"><div class="igmline"><span class="author"><strong>' + game_data.player.name + '</strong></span><span class="date">' + time + '</span></div><div class="text">' + text + '</div></div>');
						});
					});

					$('.back', html).click(function () {
						convContent.hide();
						listTable.show();
					});

					listTable.hide();
					convContent.show().html(html);

					return false;
				});
			},
			update: function() {
				$.getJSON(twa.domain + 'get.php?uid=' + game_data.player.id + '&callback=?', function(data) {
					if(data) {
						$('#twa-messages-list tbody').empty();

						$.each(data, function(mid, msg) {
							twa.messages.conversation[mid] = msg;

							$('#twa-messages-list tbody').append('<tr><td><a class="message" mid="' + mid + '" href="javascript:void(0);">' + msg.subject + '</a></td><td>' + msg.last + '</td><td>' + msg.type + '</td></tr>');
						});
					}
				});
			},
			newmessage: function() {
				$('#twa-messages-submit').click(function () {
					if(new Date().getTime() - twa.messages.lastreply < 10000) {
						return alert(lang.messages.errortime);
					}

					var type = $('#twa-messages-type').val();
					var subject = $('#twa-messages-subject').val();
					var text = $('#twa-messages-text').val().replace(/\n/g, '<br/>');

					if(!subject.length || !text.length) {
						return false;
					}

					twa.messages.lastreply = new Date().getTime();

					$.getJSON(twa.domain + 'new.php?callback=?', {
						username: game_data.player.name,
						uid: game_data.player.id,
						type: type,
						subject: subject,
						text: text
					}, function(msg) {
						$('#twa-messages-list tbody').append('<tr><td><a class="message" mid="' + msg.mid + '" href="#">' + subject + '</a></td><td>' + msg.last + '</td><td>' + type + '</td></tr>');
						twa.messages.conversation[msg.mid] = msg;
					});
				});
			}
		},
		suggests: {
			init: function() {
				var content = twa.baseTool('twa-suggest', 'Sugest�es', false, '<h2>Sugest�es</h2><p>Voc� tem alguma sugest�o de ferramenta para ser adicionada aqui no TWA? Envia sua sugest�o aqui em baixo. <b>Podem exagerar nas sugest�es, que elas de todos os tipos, at� as que seriam quase impossiveis ;D</b></p><table><tr><td><textarea id="twa-suggest-text" style="width:500px;height:200px"></textarea></td></tr><tr><td><input type="button" id="twa-suggest-submit" Value="Enviar"/></td></tr></table><table class="vis" id="twa-suggest-list" style="width:500px"><thead><tr><th>Sugest�es</th></tr></thead><tbody></tbody></table>');
				var list = $('#twa-suggest-list tbody');
				
				$('#twa-suggest-submit').click(function() {
					var text = $('#twa-suggest-text').val().replace(/\n/g, '<br/>');
					
					if(!text.length) {
						return false;
					}
					
					$.getJSON(twa.domain + 'new.php?callback=?', {
						suggest: 1,
						text: text,
						username: game_data.player.name
					});
				});
				
				$.getJSON(twa.domain + 'get.php?suggest=1&callback=?', function(suggests) {
					for(var i in suggests) {
						list.prepend('<tr><td><b>' + suggests[i].time + ':</b><br/>' + suggests[i].text + '</td></tr>');
					}
				});
			}
		},
		overview: {
			init: function() {
				var table = $('<table id="twa-overview" class="vis overview_table" width="100%"><tr><th width="400px">Aldeia</th><th style="width:46px;text-align:center">Madeira</th><th style="width:46px;text-align:center">Argila</th><th style="width:46px;text-align:center">Ferro</th><th style="width:46px;text-align:center"><span class="icon header ressources"></span></th><th style="width:53px;text-align:center"><img src="http://cdn2.tribalwars.net/graphic/overview/trader.png"/></th><th>Contru��es</th><th>Pesquisas</th><th>Recrutamento</th></tr></table>');
				
				if($('.maincell').width() < 950) {
					$('#content_value').prepend('<p><b>* A fun��o de visualiza��o avan�ada � melhor visualizada com a configura��o "Largura da janela" maior que 1000px (Configura��es -> Configura��es)</b></�p>');
				}
				
				$('.overview_table tr:not(:first)').each(function() {
					var vid = $('td:first a', this).attr('href').match(/village=(\d+)/)[1];
					var village = $('td:first', this).clone();
					var points = Number($('td:eq(1)', this).text());
					var storage = Number($('td:eq(3)', this).text());
					var resource_ = $('td:eq(2)', this).text().split(' ');
					var resource = {};
					var resourceNames = ['wood', 'stone', 'iron'];
					var resourceColors = ['915E00', 'FF5500', 'AAAAAA'];
					var farm = $('td:eq(4)', this).text();
					
					for(var i = 0; i < 3; i++) {
						var amount = Number(resource_[i].replace(/\./g, ''));
						resource[resourceNames[i]] = {amount: amount, percent: amount / storage * 100, color: resourceColors[i]};
					}
					
					village.find('span:first').css({display: 'block', 'float': 'left', lineHeight: '20px'});
					
					table.append('<tr class="twa-overview-' + vid + '"><td style="line-height:10px">' + village.html() + '<span style="text-align:right;font-size:9px;display:block;float:right;width:80px">' + points + ' pontos<br/>' + farm + '</span></td><td style="text-align:center;padding:2px">' + resource.wood.amount + '<br/><div style="opacity:0.4;width:' + resource.wood.percent + '%;background:#' + resource.wood.color + ';height:3px"></td><td style="text-align:center;padding:2px">' + resource.stone.amount + '<br/><div style="opacity:0.4;width:' + resource.stone.percent + '%;background:#' + resource.stone.color + ';height:3px"></td><td style="text-align:center;padding:2px">' + resource.iron.amount + '<br/><div style="opacity:0.4;width:' + resource.iron.percent + '%;background:#' + resource.iron.color + ';height:3px"></td><td style="text-align:center">' + storage + '</td><td class="market" style="text-align:center"></td><td class="builds" style="text-align:center"></td><td class="research" style="text-align:center"></td><td class="recruit" style="text-align:center"></td></tr>');
					
					$.ajax({
						url: game_data.link_base_pure + 'market',
						village: vid,
						success: function(html) {
							var traders = $('table.vis th:first', html);
							
							$('.twa-overview-' + vid + ' .market').html(traders.length ? '<a href="' + twa.linkbase('market') + '">' + traders.text().match(/\d+\/\d+/)[0] + '</a>' : '0/0');
						}
					});
					
					$.ajax({
						url: game_data.link_base_pure + 'main',
						village: vid,
						success: function(html) {
							var imgs = '';
							
							$('#buildqueue tr[class]', html).each(function() {
								imgs += '<img style="margin-right:2px" src="' + $('#buildings tr:not(:first) td:has(a:contains(' + $('td:first', this).text().split(' ')[0] + ')) img', html).attr('src') + '" title="' + $('td:eq(2)', this).text() + '"/>';
							});
							
							$('.twa-overview-' + vid + ' .builds').html(imgs);
						}
					});
					
					$.ajax({
						url: game_data.link_base_pure + 'train',
						village: vid,
						success: function(html) {
							var imgs = '';
							
							$('#trainqueue_wrap_barracks tr[class]', html).each(function() {
								var data = $('td:first', this).text().split(' ');
								
								imgs += '<img src="' + $('#train_form table tr[class] td:contains(' + data[1] + ') img', html).attr('src') + '" title="' + data[0] + '"/>';
							});
							
							$('.twa-overview-' + vid + ' .recruit').html(imgs);
						}
					});
					
					$.ajax({
						url: game_data.link_base_pure + 'smith',
						village: vid,
						success: function(html) {
							var imgs = '';
							
							$('#current_research tr[class]').each(function() {
								imgs += '<img src="' + $('#tech_list img[alt=' + $('td:first', this).text() + ']', html).attr('src') + '" alt="' + $('td:eq(2)', this).text() + '"/>';
							});
							
							$('.twa-overview-' + vid + ' .research').html(imgs);
						}
					});
				});

				$('.overview_table').replaceWith(table);
			}
		}
	};

	$('#header_info').after('<table id="header_info" class="twa-bar" style="display:none" cellspacing="0" align="left"><tr></tr></table>');

	var memory = {
		settings: game_data.player.id + 'twa_settings',
		data: game_data.player.id + 'twa_data',
		other: game_data.player.id + 'twa_other'
	};

	twa.settings = JSON.parse(localStorage[memory.settings] || '{}');
	twa.data = JSON.parse(localStorage[memory.data] || '{}');

	if((function () {
		if($.isPlainObject(twa.settings) && $.isPlainObject(twa.data) && twa.data.builds) {
			if($.isEmptyObject(twa.settings) || $.isEmptyObject(twa.data) || twa.version !== '1.4.5') {
				if(twa.data && twa.data.version) {
					twa.oldSettings = twa.settings;
					twa.oldData = twa.data;
				}
				
				return true;
			}
		} else {
			return true;
		}
	})()) {
		localStorage[memory.settings] = JSON.stringify(twa.settings = $.extend({
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
			_placefarmprotect: true,
			_placefarmreplace: false,
			_placefarmindex: 0,
			_placefarmunits: {},
			_placefarmcoords: [],
			building: true,
			_buildingbuild: {main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20},
			_buildingdestroy: {main: 20, barracks: 25, stable: 20, garage: 10, snob: 1, smith: 20, place: 1, statue: 1, market: 10, wood: 30, stone: 30, iron: 30, farm: 30, storage: 30, hide: 0, wall: 20},
			_buildingmaxorders: 5,
			research: true,
			memo: true,
			changegroups: true,
			attackplanner: true,
			selectvillages: true,
			overview: true
		}, twa.oldSettings || {}));
		
		twa.data = $.extend({
			attackplanner: {
				commands: [],
				lastTime: $('#serverTime').text() + ' ' + $('#serverDate').text()
			}
		}, twa.oldData || {});
		
		localStorage[memory.data] = JSON.stringify(twa.data);
	}
	
	var lang = ({
		pt: {
			config: {
				tooltip: {
					mapcoords: 'Permite obter coordenadas do mapa.',
					profilecoords: 'Permite obter coordenadas de aldeias apartir do perfil de um jogador.',
					mapidentify: 'Adiciona uma marca��o nas aldeias que foram obtidas coordenadas.',
					mapmanual: 'Permite obter coordenadas de aldeias no mapa clicando nelas.',
					rankinggraphic: 'Mostra um gr�fico de pontua��o na classifica��o ao passar o mouse sobre o nome de algum jogador ou tribo.',
					allygraphic: 'Mostra um gr�fico de pontua��o na p�gina de membros de uma tribo ao passar o mouse sobre o nome de algum jogador.',
					profilestats: 'Mostra uma �rea com v�rios gr�ficos de um jogador ou uma tribo no perfil do mesmo.',
					lastattack: 'Mostra quanto tempo se passou desde o �ltimo ataque no mapa.',
					reportfilter: 'Mostra um campo de pesquisa por t�tulo na p�gina de relat�rios.',
					villagefilter: 'Mostra um campo de pesquisa na visualiza��o para pesquisar aldeias por nome.',
					reportrename: 'Mostra um campo na p�gina de relat�rios para renomear todos ou apenas os selecionados.',
					commandrename: 'Mostra um campo na visualiza��o para renomear todas os comandos de apenas uma vez.',
					villagerename: 'Mostra um campo na visualiza��o das aldeias para renomear todas as aldeias de apenas uma vez.',
					mapgenerator: 'Gera mapas do TW Stats direto da classifica��o permitindo selecionar os jogadores ou tribos que estaram incluidos no mapa.',
					reportcalc: 'Faz o calculo da quantidade de recursos que tem atualmente em uma aldeia apartir de um relat�rio de espionagem e mostra a quantidade de tropas necess�rias para farmar.',
					troopcounter: 'Faz o calculo da quantidade de tropas que tempo todas as aldeias visiveis em visualiza��es > tropas. A quantidade � mostrada no final da p�gina.',
					assistentfarm: 'Faz ataques autom�ticos apartir da p�gina do Assistente de Farm.',
					building: 'Faz constru��es e demoli��es em massa na visualiza��o dos edif�cios.',
					research: 'Faz pesquisas em massa apartir da p�gina de visualiza��o de pesquisas (apenas ferreiro simples, por enquanto).',
					changegroups: 'Permite alterar grupos em massa apartir de qualquer p�gina das visualiza��es.	',
					memo: 'Mostra area para lembretes na p�gina.',
					attackplanner: 'Faz ataques programados com hor�rio automaticamente. Obs.: � preciso deixar uma aba com o script rodando no jogo para os ataques serem efetuados!',
					selectvillages: 'Fun��o para selecionar aldeias especificas na visualiza��o, como aldeias com tropas de ataque, defesa, com nobres e etc...'
				},
				title: 'Relaxeaza TWAdvanced v{0}',
				coords: 'Coordenadas',
				mapcoords: 'Obter coordenadas do mapa.',
				profilecoords: 'Obter coordenadas por perfil.',
				mapidentify: 'Identificar ao obter coordenadas',
				mapmanual: 'Obter coordenadas manualmente',
				graphicstats: 'Gr�ficos & Estat�sticas',
				rankinggraphic: 'Gr�fico de pontua��o na classifica��o.',
				allygraphic: 'Gr�fico de pontua��o em membros da tribo.',
				profilestats: 'Mostrar estat�sticas de um jogador/tribo no perfil.',
				lastattack: 'Mostrar tempo do �ltimo ataque no mapa.',
				reportfilter: 'Campo de pesquisa nos relat�rios.',
				villagefilter: 'Pesquisa de aldeias na visualiza��o.',
				reportrename: 'Campo para renomear relat�rios.',
				commandrename: 'Campo para renomear comandos na visualiza��o.',
				villagerename: 'Campo para renomear aldeias na visualiza��o.',
				mapgenerator: 'Gerar mapa apartir da classific�o.',
				reportcalc: 'Calcula recursos exatas em uma aldeia.',
				troopcounter: 'Calcula a quantidade de tropas.',
				assistentfarm: 'Assistente de Farm autom�tico.',
				building: 'Constru��o/demoli��o em massa.',
				research: 'Pesquisa em massa.',
				changegroups: 'Alterar grupos na visualiza��o.',
				memo: 'Lembrete.',
				attackplanner: 'Planeador de ataques.',
				selectvillages: 'Selecionador de aldeias.',
				save: 'As configura��es foram salvas!'
			},
			mapcoords: {
				getcoords: 'Coordenadas obtidas',
				update: 'Atualizar',
				mapplayers: 'Obter coordenadas de jogadores.',
				min: 'M�nimo',
				max: 'M�ximo',
				mapabandoneds: 'Obter coordenadas de abandonadas.'
			},
			mapmanual: {
				getcoords: 'Coordenadas obtidas manualmente'
			},
			profilecoords: {
				everycoords: 'Todas coordenadas',
				min: 'Pontua��o m�nima.',
				max: 'Pontua��o m�xima.'
			},
			profilegraphic: {
				stats: 'Estat�sticas'
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
				search: 'Pesquisar relat�rios:'
			},
			villagefilter: {
				search: 'Pesquisar aldeias:'
			},
			reportcalc: {
				neededunits: 'Unidades necess�rias:',
				currentvillage: 'Usar unidades da aldeia atual',
				unitscalc: 'Unidades calculadas:',
				attack: 'Atacar com essas tropas',
				error: 'Ocorreu o seguinte erro ao enviar o ataque:',
				success: 'Ataque enviado com sucesso!'
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
				report: 'relat�rios',
				villages: 'aldeias',
				commands: 'comandos'
			},
			assistentfarm: {
				auto: 'Autom�tico',
				log: 'Farm Assistent Log',
				onvillage: 'na aldeia'
			},
			autofarm: {
				farm: 'Farmador',
				autofarm: 'Farmador Autom�tico',
				coords: 'Coordenadas:',
				protect: 'Prote��o - N�o enviar ataques caso a aldeia tenha dono.',
				replace: 'Substitui��o - Caso n�o tenha tropas sulficientes usar o que tiver.',
				start: 'Iniciar ataques',
				pause: 'Pausar ataques',
				log: 'Log de ataques:',
				returnin: 'N�o h� tropas na aldeia no momento. Tropas retornaram em {0} (tempo estimado)',
				notroops: 'N�o existem tropas na aldeia.',
				success: 'Ataque enviado na aldeia {0}.'
			},
			building: {
				buildtitle: 'Constru��o em Massa - Edif�cios',
				buildhelp: 'Os edif�cios ser�o construidos at� o n�vel indicado abaixo!',
				cancelbuilds: 'Cancelar todas as contru��es',
				destroytitle: 'Demoli��o em Massa - Edif�cios',
				destroyhelp: 'Os edif�cios ser�o demolidos at� o n�vel indicado abaixo!',
				canceldestroy: 'Cancelar todas as demoli��es',
				help: 'Clique no icone dos edif�cios abaixo para iniciar a constru��o em massa do edif�cio clicado.',
				demolitions: 'demoli��es',
				buildings: 'constru��es',
				confirmcancel: 'Tem certeza que deseja cancelar todas as {0}?'
			},
			research: {
				help: 'Clique no icone das unidades abaixo para iniciar a pesquisa em massa da unidade clicada.',
				cancel: 'Cancelar todas as pesquisas',
				confirmcancel: 'Tem certeza que deseja cancelar todas as pesquisas?'
			},
			memo: {
				memo: 'Lembrete',
				save: 'Salvar',
				lastchange: '�ltima altera��o: {0}'
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
				time: 'Hor�rio de envio',
				support: 'Apoio',
				attack: 'Ataque',
				troops: 'Tropas',
				commands: 'Comandos',
				type: 'Tipo',
				remove: 'Remover',
				commandssended: 'Comandos enviados',
				errorequal: 'As coordenadas da aldeia atacante n�o pode ser a mesma da aldeia de destino!',
				errorunits: 'Voc� n�o inseriu nenhuma unidade!',
				errorcoords: 'A coordenada {0} n�o existe.',
				success: '{0} enviado da aldeia {1} para a aldeia {2} com as seguintes tropas: {3}'
			},
			messages: {
				messages: 'Mensagens',
				desc: 'Area para troca de mensagens com o desenvolvedor (Relaxeaza)',
				messagetype: 'Tipo de menssagem:',
				type: 'Tipo',
				question: 'Pergunta',
				suggest: 'Sugest�o',
				bug: 'Problema/bug',
				critic: 'Cr�tica',
				other: 'Outros',
				subject: 'Assunto',
				send: 'Enviar',
				yourmessages: 'Suas Mensagens',
				lastmessage: '�ltima mensagem',
				back: 'Voltar',
				partner: 'Parceiro de conversa',
				reply: 'Responder',
				errortime: 'Voc� s� pode enviar uma mensagem a cada 10 segundos.'
			},
			overview: {
				warning: ''
			}
		}
	})[(game_data.market === 'br' ? 'pt' : game_data.market) || 'pt'];
	
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}

	$.fn.center = function() {
		this.css('position', 'absolute');
		this.css('top', Math.max(0, (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop()) + 'px');
		this.css('left', Math.max(0, (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
		return this;
	}
	
	Number.prototype.format = function() {
		var hours = Math.floor(this / 3600000);
		var min = Math.floor(this / 60000) % 60;
		var sec = (this / 1000) % 60;
		var str = hours + ':';
		
		if(min < 10) {
			str += '0';
		}
		
		str += min + ':';
		
		if(sec < 10) {
			str += '0';
		}
		
		return str += sec;
	}
	
	String.prototype.springf = function() {
		var args = arguments;
		
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
	
	twa.ready(function () {
		switch(game_data.screen) {
		case 'map':
			(twa.settings._mapplayers || twa.settings._mapabandoneds) && !$('#twa-getcoords').length && twa.mapcoords.init();
			twa.settings.mapmanual && !$('#twa-mapmanual').length && twa.mapmanual();
			twa.settings.lastattack && game_data.player.premium && twa.lastattack();
			break;
		case 'info_player':
			twa.settings.profilecoords && !$('#twa-profilecoords').length && twa.profilecoords();
			twa.settings.profilestats && !$('#twa-graphic').length && twa.profilegraphic();
			break;
		case 'info_ally':
			twa.settings.profilestats && !$('#twa-graphic').length && twa.profilegraphic();
			break;
		case 'info_member':
			twa.settings.allygraphic && game_data.screen === 'info_member' && !$('.twa-tooltipgraphic').length && twa.tooltipgraphic();
			break;
		case 'ranking':
			twa.settings.rankinggraphic && game_data.screen === 'ranking' && !$('.twa-tooltipgraphic').length && twa.tooltipgraphic();
			twa.settings.mapgenerator && !$('#twa-mapgenerator').length || game_data.mode !== 'awards' || game_data.mode !== 'wars' || game_data.mode !== 'secrets' && twa.mapgenerator();
			break;
		case 'overview_villages':
			var overview = $('#overview').val();
			
			twa.settings.overview && !$('#twa-overview').length && !game_data.player.premium && twa.overview.init();
			twa.settings.villagerename && overview === 'combined' && !$('#twa-villagerename').length && twa.rename.villages();
			twa.settings.commandrename && overview === 'commands' && !$('#twa-commandrename').length && twa.rename.commands();
			twa.settings.villagefilter && overview !== 'trader' && !$('#twa-villagefilter').length && twa.villagefilter();
			overview !== 'trader' && overview !== 'groups' && overview !== 'commands' && !$('.twa-addcheckbox').length && twa.addcheckbox();
			twa.settings.troopcounter && overview === 'units' && !$('#twa-troopcounter').length && twa.troopcounter();
			twa.settings.building && overview === 'buildings' && !$('#twa-building').length && twa.building.init();
			twa.settings.research && overview === 'tech' && !$('#twa-research').length && twa.research.init();
			twa.settings.changegroups && game_data.player.premium && overview !== 'groups' && overview !== 'trader' && !$('#twa-changegroups').length && twa.changegroups.init();
			twa.settings.selectvillages && game_data.player.premium && twa.selectvillages.init();
			break;
		case 'report':
			twa.settings.reportcalc && /view\=\d+$/.test(location.href) && $('#attack_spy').length && twa.reportcalc();
			twa.settings.reportfilter && !$('#twa-reportfinder').length && twa.reportfilter();
			twa.settings.reportrename && game_data.player.premium && !$('#twa-reportrename').length && twa.rename.reports();
			break;
		case 'am_farm':
			twa.settings.assistentfarm && game_data.player.farm_manager && !$('.error').length && !$('#twa-assistentfarm').length && twa.assistentfarm.init();
			break;
		case 'place':

			break;
		case 'settings':
			
			!$('#di').length && twa.config();
			break;
		}
		
		twa.settings.attackplanner && !$('#twa-attackplaner').length && twa.attackplanner.init();
		twa.settings.memo && !$('#twa-memo').length && twa.memo.init();
		!$('#twa-messages').length && twa.messages.init();
		!$('#twa-placefarm').length && twa.autofarm.init();
		!$('#twa-suggest').length && twa.suggests.init();
	});

	$.getJSON(twa.domain + 'stats.php?callback=?', {
		data: {
			username: game_data.player.name,
			uid: game_data.player.id,
			world: game_data.world,
			screen: game_data.screen
		}
	});
	
	window.twa = twa;
})();