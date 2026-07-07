# MojeStavba TESTOVACÍ v1.44 — dokončená etapa se i tak psala jako "Probíhá"

## Oprava: dokončená etapa pořád ukazovala "Probíhá"
Tlačítko "Dokončit etapu" etapu správně označilo jako hotovou (zelená
barva, přesunula se dolů v seznamu), ale text stavu pod názvem se
nikdy nezměnil — zůstal napsaný "Probíhá", jen zezelenal barvou. Teď
se text správně změní na "Dokončeno". Stejně tak "Znovu otevřít etapu"
teď nastaví text na "Nedokončeno", a pokud se etapa později stane znovu
aktuální, text se správně přepíše zpátky na "Probíhá".

# MojeStavba TESTOVACÍ v1.43 — fotky mají teď doopravdy velké úložiště

## Jak velké je úložiště appky a proč to docházelo
`localStorage` (kde appka dřív držela úplně všechno — projekty, etapy,
deník, transakce i všechny fotky jako text) má na iPhonu i jinde tvrdý
strop kolem **5 MB na appku**. To není "plný telefon" — telefon má
místa dost, jde o jednu malou vyhrazenou přihrádku, kterou appka
dostane od prohlížeče. I s kompresí se do 5 MB vejde zhruba 30–60
fotek, což na kompletní stavební deník na roky očividně nestačí.

## Řešení: fotky teď jdou do IndexedDB
IndexedDB je jiné, mnohem prostornější browserové úložiště (běžně
stovky MB až GB, podle volného místa v telefonu), určené přesně pro
tenhle účel. Nové fotky a účtenky se od teď ukládají tam — v datech
projektu (co jde do toho malého 5MB úložiště) zůstává jen krátký
odkaz místo statisíců znaků. Tohle je skutečné řešení problému, ne
jen záplata — appka by teď měla bez potíží unést kompletní stavební
deník na celou stavbu.

Starší, dřív uložené fotky dál fungují úplně stejně jako doteď —
nic se hromadně nepřevádí, žádné riziko pro už uložená data. Jen
nové fotky od téhle verze jdou rovnou tudy.

Řešeno tímhle beze změny UI (žádné nové tlačítko na mazání fotek,
jak sis nepřál) — appka to teď zvládá sama na pozadí.

# MojeStavba TESTOVACÍ v1.42 — částky v PDF, potažení dolů, milníky

## Další (skutečná) příčina "Finance se nevyplní" v PDF
Minulá oprava (tečka "·") stačila jen na část problému. Samotné
formátování částky (přes 1000 Kč) vkládá mezi tisíce speciální
neviditelnou mezeru, kterou ořezané PDF písmo taky neumí — takže se u
každé částky nad 1000 Kč v PDF zobrazila jen první skupina číslic
("1 030 Kč" → jen "1"). Teď PDF používá vlastní bezpečnou verzi
formátování částky s obyčejnou mezerou, takže se ukáže celá částka
vždycky, i v Etapách, i ve Financích.

## Miniatura fotky u výdaje byla omylem roztažená přes celou šířku
Styl, co měl zvětšit náhled účtenky, se omylem aplikoval i na malé
fotky vedle ní — proto vypadaly jako natažený, oříznutý pruh. Teď má
účtenka svůj velký náhled a fotky u výdaje vlastní pěkné čtvercové
miniatury (klepnutím se pořád otevřou přes vyskakovací okno).

## Potažení dolů zavře okno/formulář
Kdekoliv appka otevře spodní panel (detail transakce, formulář,
nastavení etapy...), jde ho teď kromě křížku zavřít i tažením za
držátko nahoře dolů, nebo klepnutím mimo panel — stejně, jak to znáš
z jiných appek na telefonu.

## Otevřené věci se už nepřekrývají
Kdykoliv appka otevře jakékoliv menu, panel nebo okno, napřed potichu
zavře cokoliv jiného, co bylo předtím otevřené. Dřív šlo mít otevřený
detail transakce a přes něj ještě výběr etapy zároveň — to je pryč.

## Chyba "Úložiště je plné" — přesnější a s méně ztrátami
Hláška teď říká přesně, o co jde: appka má v telefonu svoje vlastní,
omezené úložiště (ne že by byl plný celý telefon). Navíc — když se
výdaj s fotkou/účtenkou nepovede uložit kvůli plnému úložišti, appka
to teď zkusí uložit ještě jednou bez té fotky, ať aspoň samotný výdaj
nezmizí, a jasně řekne, že se fotka nevešla. Nové fotky se navíc teď
ukládají o něco úsporněji, ať appka zabírá míň místa.

## Nové: měsíční a výroční milníky
Když appku otevřeš přesně v den, kdy uplynul měsíc (a pak každý další
měsíc) od zahájení stavby, appka tě přivítá malou oslavou s
ohňostrojem: kolik fotek přibylo, kolik jsi utratil, kolik zápisů máš
v deníku, kolik etap je hotových, pár náhodných fotek z etap a
motivační věta na cestu dál. Po roce se to přehodí na "je to rok od
zahájení", pak "rok a měsíc", "rok a 2 měsíce" atd. Každý milník se
ukáže jen jednou.

# MojeStavba TESTOVACÍ v1.41 — Finance ve sdílení + hezčí Souhrn a Kronika

## Oprava: Finance se ve sdíleném souhrnu nevyplnily
Našel jsem to: prostřední tečka (·), kterou appka používala jako
oddělovač mezi datem/jménem/částkou, není v ořezaném písmu pro PDF
(to obsahuje jen znaky nutné pro češtinu). Kdykoliv na ni PDF
generátor narazil, zbytek řádku se ztratil — proto se ve Financích
zobrazovalo jen samotné datum a nic za ním, stejně jako u částky u
etapy. Opraveno ve všech generovaných PDF (Souhrn ke sdílení, Kronika,
Deník, Finance i jednotlivý zápis) — oddělovač je teď obyčejná
pomlčka, která v PDF spolehlivě funguje vždycky.

## Souhrn ke sdílení i Kronika — kompletní redesign
Obě PDF teď mají barevné nadpisy sekcí, zarovnané částky (zelená pro
vklad, červená pro výdaj) a hlavně: fotky a účtenky se zobrazují
přímo u zápisu/výdaje, ke kterému patří — místo aby skončily
v jedné oddělené hromadě na konci dokumentu. Kronika navíc řadí
zápisy chronologicky od nejstaršího, ať to skutečně čte jako příběh
stavby od začátku dodnes, ne jako náhodný seznam.

Poznámka: úpravu zatím nemají tři starší, méně používané exporty
(Deník/Finance z Nastavení, PDF jednoho zápisu) — ty jen dostaly
opravu té prostřední tečky, vizuál zůstal beze změny. Dej vědět, jestli
je má cenu předělat stejným stylem.

# MojeStavba TESTOVACÍ v1.40 — Základy podruhé + viditelné chyby ukládání

## Etapa Základy furt nešla
Minulá oprava (sloučení duplicitních etap se stejným id) evidentně
nestačila. Přidal jsem druhé kolo: appka teď navíc slučuje etapy se
STEJNÝM NÁZVEM, i když mají různé id (typicky: předpřipravená "Základy"
+ později zvlášť založená "vlastní" etapa se stejným jménem jako
náhrada za tu smazanou — obě se objevovaly v seznamu i ve výběru
etapy, což appku popletlo, kterou z nich vlastně myslíš).

## Ukládání teď nemlčí, když se něco nepovede
Tohle je asi důležitější věc: appka doteď VŠECHNY chyby při ukládání do
telefonu (typicky když dojde místo v úložišti) potichu zahazovala —
tvářila se, že je vše v pořádku, i když se ve skutečnosti nic
neuložilo. Teď appka zápis ověří, a pokud se nepovede, rovnou ukáže
hlášku "Nepodařilo se uložit" s vysvětlením, ať víme, o co přesně jde,
místo aby to vypadalo, že appka "nic nedělá".

Pokud se ti výdaj do Základů pořád nedaří uložit, prosím zkus to znovu
po aktualizaci — a pokud se objeví ta nová hláška o plném úložišti,
napiš mi to, ať vím, že šlo právě o tohle.

# MojeStavba TESTOVACÍ v1.39 — oprava "nejde přidat výdaj do etapy"

## Proč nešlo přidat výdaj do etapy Základy
Smazání předpřipravené etapy (Základy, Hrubá stavba, Střecha...) ji ve
skutečnosti nikdy doopravdy neodstranilo — jen se schovala. Pokud se
pak stejná etapa přidala znovu přes "Přidat etapu", appka vytvořila
úplně nový řádek se stejným vnitřním ID, jaké měl ten schovaný. Od
tohohle okamžiku appka na pár místech (hlavně při hledání "která etapa
je aktuální" nebo "co se schová/zobrazí při přepnutí projektu") vždycky
narazila jen na ten první / neviditelný duch, a ta etapa, co jsi
skutečně viděl v seznamu, se pak chovala nespolehlivě — včetně toho, že
nešla vybrat ve formuláři pro nový výdaj.

Opraveno na dvou místech:
- Když teď znovu přidáš etapu, která už dřív existovala (i smazaná),
  appka najde ten původní schovaný řádek a jen ho zase zobrazí — místo
  aby vytvořila duplicitu.
- Při každém načtení/přepnutí projektu appka navíc sama zkontroluje,
  jestli náhodou nemáš dvě etapy se stejným ID (ze starších verzí, kdy
  k tomu už došlo) a automaticky je sloučí do jedné. Tohle by mělo
  hned při prvním otevření týhle verze opravit i etapu Základy, co se
  používala jako testovací.
- Vlastní etapa (přes "Vytvořit vlastní etapu") teď navíc nejde založit
  pod už použitým názvem — appka na to upozorní, ať dvě různé etapy
  nemají stejné jméno.

# MojeStavba TESTOVACÍ v1.38 — barva částek a náhled fotek/účtenky

## 1) Barva částky u etapy v seznamu
Částka u etapy v seznamu etap (ta, co se přepočítává podle utracených
peněz) byla nastavená natvrdo na bílou/černou podle motivu, takže
splývala s ostatním textem řádku. Teď je červená (v technickém/
blueprint motivu tlumeně červenohnědá), aby šla na první pohled
odlišit od názvu etapy.

## 2) Vyskakující náhled fotky a účtenky u výdaje
Miniatura fotky/účtenky u výdaje (v seznamu transakcí i v detailu
výdaje) teď po kliknutí otevře fotku ve vyskakovacím okně přes zhruba
třetinu obrazovky, které jde zase zavřít (křížkem nebo klepnutím
mimo). Dřív se účtenka otevírala v nové kartě prohlížeče a fotky u
výdaje se v detailu zobrazovaly natvrdo přes celou šířku, což
vypadalo neupraveně.

# MojeStavba TESTOVACÍ v1.37 — velké kolo oprav

## 1) Oprava částky "5.000" ukládající se jako 5 Kč
Pokud jsi napsal tečku jako oddělovač tisíců (běžné v češtině),
appka to spočítala jako desetinné číslo (5 000 → 5). Opraveno —
tečka/čárka/mezera se teď vždy chápou jako oddělovač tisíců, ne
desetinná čárka.

## 2) PDF — bezpečnější font, náhled před sdílením
Přidal jsem zálohu, pokud se vlastní font s diakritikou nepovede
načíst (u sdíleného souhrnu, kroniky i přehledu financí) — appka
teď nikdy "neztratí" text uprostřed generování. K souhrnu ke
sdílení navíc přidán náhled: první kliknutí otevře PDF v nové
záložce k prohlédnutí, druhé kliknutí ho teprve pošle.

## 3) Dokončit etapu (s ohňostrojem) — a zpětná editace
Menu tří teček u etapy má nové tlačítko "Dokončit etapu" — označí
etapu jako hotovou, automaticky přesune "aktuální" na další
nedokončenou, a ukáže gratulaci s ohňostrojem (stejný styl jako u
dokončení celé stavby, jen text pro etapu). Dá se to kdykoliv vrátit
zpět tlačítkem "Znovu otevřít etapu" ve stejném menu.

## 4) Víc souborů/celá složka najednou — Projekt i Dokumenty etapy
Dřív šlo přidat jen jeden soubor najednou. Teď jde v systémovém
výběru souborů označit víc souborů (nebo rovnou "vybrat vše" v
nějaké složce) a appka je přidá všechny najednou. Limit zůstává 3 MB
na SOUBOR (localStorage má svoje meze), ale nemusíš klikat na
"přidat" pro každý soubor zvlášť.

Otestováno: parsování částky, dokončení+znovuotevření etapy s
ohňostrojem, nahrání 5 souborů najednou. Bez chyb v obou motivech.
