## TWA - Renomeador de Aldeias ##

Com o Renomeador de Aldeias lhe permite renomear aldeias em massa na visualização de aldeias.

**Usuários sem premium:**

Usuários sem premium tem a possibilidade de renomear aldeias em massa e támbem renomear aldeias individuais diretamente na visualização de aldeias.

![http://tribalwars-scripts.googlecode.com/svn/img/renindividual.png](http://tribalwars-scripts.googlecode.com/svn/img/renindividual.png)

**Máscaras:**

Com as máscaras é possivel renomear aldeias "dinamicamente", usando valores da aldeia atual, veja as máscaras que você pode usar:

| **Máscara** | **Descrição** | **Visualização que funciona** |
|:------------|:--------------|:------------------------------|
| `{points}`  | _É substituido pela pontuação da aldeia._ | Produção, Combinado, Sem visualização avançada |
| `{wood}`    | _É substituido pela quantidade de madeira da aldeia._ | Produção, Sem visualização avançada |
| `{stone}`   | _É substituido pela quantidade de argila da aldeia._ | Produção, Sem visualização avançada |
| `{iron}`    | _É substituido pela quantidade de ferro da aldeia._ | Produção, Sem visualização avançada |
| `{storage}` | _É substituido pelo tamanho do armazém da aldeia._ | Produção, Sem visualização avançada |
| `{farmUsed}` | _É substituido pela quantidade de fazenda usada na aldeia._ | Produção, Combinado, Sem visualização avançada |
| `{farmTotal}` | _É substituido pela quantidade total da fazenda na aldeia._ | Produção, Combinado, Sem visualização avançada |
| `{current}` | _É substituido pelo nome atual da aldeia (muito bom para acrescentar algo ao nome)._ | Todas                         |
| `{x}`       | _É substituido pela coordenada x da aldeia._ | Todas                         |
| `{y}`       | _É substituido pela coordenada y da aldeia._ | Todas                         |
| `{random(`**`mín, máx`**`)}` | _É substituido por um numero aleatório - Mais sobre a máscara abaixo._ | Todas                         |
| `{unit(`**`unidade`**`)}` | _É substituido pela quantidade da unidade especificada - Mais sobre a máscara abaixo._ | Combinado                     |


---


**Máscaras com argumentos:**

<font color='green' size='3'><code>{random(</code><b><code>mín, máx</code></b><code>)}</code></font>

**mín:** número mínimo do número aleatório (não é obrigatório).

**máx:** número máximo do número aleatório (não é obrigatório).

Pode-se usar támbem: **`{random}`**, **`{random()}`**.

Não é obrigatório especificar o número máximo e mínimo. Ex: **{random}**, **(random()}**.

---

<font color='green' size='3'><code>{unit(</code><b><code>unidade</code></b><code>)}</code></font>

**unidade:** nome da unidade desejada. Os nomes são é ingles e obrigatório!

  * **spear** - Lanceiro.
  * **sword** - Espadachim.
  * **axe** - Bárbaro.
  * **archer** - Arqueiro.
  * **spy** - Explorador.
  * **light** - Cavalaria leve.
  * **marcher** - Arqueiro a cavalo.
  * **heavy** - Cavalaria pesada.
  * **ram** - Ariete.
  * **catapult** - Catapulta.
  * **knight** - Paladino.
  * **snob** - Nobre.
  * **militia** - Milicia.