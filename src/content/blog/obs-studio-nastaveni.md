---
title: "OBS studio - jak program co nejlépe nastavit pro Forendors livestream"
excerpt: "OBS Studio je nejpoužívanější a velmi oblíbený streamovací program. Pokud jste se rozhodli ho pro váš Forendors livestream používat, připravili jsme pro vás návod na jeho základní nastavení."
date: 2022-01-23
category: tipy
tags: []
draft: false
---

OBS Studio je nejpoužívanější a velmi oblíbený streamovací program. Pokud jste se rozhodli ho pro váš Forendors livestream používat, připravili jsme pro vás návod na jeho základní nastavení.

## Stažení a instalace

1. Stáhněte si [OBS Studio](https://obsproject.com/cs/download) do vašeho zařízení (vyberte si správnou variantu pro váš operační systém)
2. Začněte s instalací:

**MacOS** – otevřete instalační soubor a OBS přetáhněte do složky *Applications*. Program se vám automaticky nainstaluje.

![Instalaci provedete přesunutím OBS do složky Applications (Aplikace)](https://blog.pickey.cz/wp-content/uploads/2022/01/78892F14-E721-4DB6-932A-60807913506A-300x210.jpg)

**Windows** –  tevře se instalační průvodce, který vás provede instalací (stačí klikat na *Next* a na konci tlačítkem *Finish* spustíte program).

![Spusťte instalačního průvodce a pokračujte tlačítkem Next](https://blog.pickey.cz/wp-content/uploads/2022/01/Windows1.jpg)

## Spuštění

Při prvním spuštění se zobrazí *Auto-Configur*ation Wizard, klikněte na zrušit - nastavení je popsáno níže. **Pokud preferujete jiný jazyk**, než je ten, ve kterém se vám program nainstaloval, změníte ho v *Preferences *(*Nastavení) - General (Hlavní) - Language (Jazyk) a zvolíte z nabídky*.

![Jazyk lze změnit v nastavení OBS](https://blog.pickey.cz/wp-content/uploads/2022/01/Screenshot-2022-01-21-at-17.44.11-1024x173.png)

**Přístup OBS Studia k videu a audiu by se měl nastavit během instalace automaticky.** V MacOS si můžete nastavení zkontrolovat přes hlavní nastavení Macu – *System Preferences - Security & Privacy*.

## Základní nastavení (platí pouze pro video)

Pokud budete sdílet pouze audio, tuhle část můžete přeskočit.

Pro video stream je důležité nastavit dva hlavní parametry – *Základní rozlišení *a *Výstupní rozlišení*. Oboje najdete v *Nastavení - Obraz*.

***Základní rozlišení ***= velikost canvasu, neboli plochy, kde se budou zobrazovat jednotlivé zdroje (displej, video atd.). Tohle rozlišení byste si měli nastavit ve stejné velikosti, jako okno, které budete sdílet – např. pokud budete sdílet monitor 2560 x 1440, základní rozlišení v OBS by mělo být nastavené na stejnou velikost. Základní rozlišení by nemělo být menší než výstupní rozlišení, jinak se může stát, že bude obraz rozmazaný.

***Výstupní rozlišení*** = rozlišení streamu, jak se bude přehrávat na webu. Forendors podporuje maximálně 1920 x 1080 (není tedy nutné nastavovat větší rozlišení) a ideální poměr stran je 16 : 9.

![Pro video stream si nastavte základní a výstupní rozlišení](https://blog.pickey.cz/wp-content/uploads/2022/01/Screenshot-2022-01-23-at-08.30.33.png)

## Nastavení sdílení

Nejprve se pojďme podívat, jak OBS Studio po spuštění vypadá a co v jaké části najdete.

![Rozvržení OBS - kde co ovládáte](/images/articles/4-1024x726.png)

**Sdílení audia **- v levém dolním rohu v okně *Zdroje (Sources)* klikněte na znaménko plus a vyberte z možností *Záznam zvukového vstupu (Audio Input Capture)*, nastavíte si parametry, které pro livestream chcete používat (nebo necháte předvyplněné nastavení) a potvrdíte.

![Přidání audio zdroje pro sdílení audia](https://blog.pickey.cz/wp-content/uploads/2022/01/DF82C154-5DBB-42DC-A260-CCCDB985BCF4-237x300.jpg)

**Sdílení kamery **(pokud jste při vytváření příspěvku zvolili tuhle možnost) – postupujete stejně jako u audia, jen vyberete ze seznamu *Zařízení pro záznam obrazu (Video Capture Device).*

![Nastavte si kameru, kterou chcete při livestreamu používat](https://blog.pickey.cz/wp-content/uploads/2022/01/Screenshot-2022-01-21-at-17.54.56-1024x304.png)

**Sdílení obsahu **– jestli chcete během livestreamu sdílet například nějakou prezentaci nebo webovou stránku, zvolte možnost *Záznam okna (Window Capture)* nebo – pokud máte více monitorů – *Záznam obrazovky (Display Capture)*. Potvrďte a jako další krok vyberte okno nebo monitor, které chcete sdílet.

***Tip Forendors: ****Pokud potřebujete sdílet víc dokumentů naráz (například ukázat rozdíl mezi dvěma webovými stránkami), jednoduše přidáte další Záznam okna (Window Capture), zvolíte další okno a v livestreamu se zobrazí obě současně, nebo obě okna umístíte na sdílený monitor.*

![Pod Zdroji si můžete nastavit sdílení i více oken/obrazovek současně](/images/articles/2-1024x726.png)

**Skrýt zdroje **– pokud chcete dočasně zneaktivnit/skrýt některý z obsahu, který vysíláte, jednoduše klikněte na ikonku oka. Jakmile se místo ní zobrazí ikonka přeškrtnutého oka, obsah přestane být pro sledující viditelný. Tímto způsobem můžete dočasně vypnout i kameru (například během pauzy) a naopak sdílet obrazovku s časovým odpočtem či videem pro vyplnění pauzy.

![Zdroje můžete dočasně skrýt kliknutím na ikonku oka](https://blog.pickey.cz/wp-content/uploads/2022/01/Screenshot-2022-01-23-at-09.27.51-300x295.png)

**Překrývání a velikost oken **– pokud sdílíte víc zdroju současně (např. video a prezentaci), můžete si sami nastavit poměr okna tak, jak chcete, aby se sledujícím zobrazovalo. Stačí jen kliknout na některé ze sdílených oken - zobrazí se červený rámeček, který v rohu chytíte myší a posunem zvětšíte/zmenšíte jeho velikost. Pokud se vám okna překrývají a chcete, aby se zadní okno zobrazovalo v popředí, stačí jen posunout požadovaný zdroj v okně *Zdroje *na horní pozici.

![Okno označené červeným rámečkem můžete tahem zvětšit/zmenšit](/images/articles/OBS_screen-1024x726.png)

![Pozici zobrazení zroje jednoduše změníte jeho posunutím na vyšší pozici](https://blog.pickey.cz/wp-content/uploads/2022/01/949F979A-6058-4072-A548-AB6B7A6DFE7C-300x248.jpg)

## Ovládání livestreamu

Zatím jsme si ukázali, jak všechno nastavit předtím, než spustíme samotné vysílání. Teď se pojďme podívat na to, jak livestream ovládat. 

V pravém dolním rohu najdete ovládací panel. Přes ten budete vysílání ovládat.

![Ovládací panel livestreamu v OBS Studiu](https://blog.pickey.cz/wp-content/uploads/2022/01/Screenshot-2022-01-21-at-18.30.37-265x300.png)

Vysílání spustíte tlačítkem *Začít vysílat (Start Streaming)*. Jakmile vysílání spustíte, vysílání se spustí i na Forendors. Pozor – vysílání se spustí i v případě, že v příspěvku bylo naplánované na jiný den/hodinu. Nespouštějte tedy vysílání zbytečně brzy.

Během vysílání se tlačítko Začít vysílat (Start Streaming) změní na Přestat vysílat (Stop streaming). Po stisknutí tohoto tlačítka vysílání pouze pozastavíte, ale neukončíte a můžete ho kdykoli zase obnovit. To i v případě, kdy vám vypadne internetové připojení. Pokud ho stihnete obnovit do 60 vteřin, na Forendors se plynule napojí. Pokud vysílání obnovíte později, sledující budou muset spustit přehrávání manuálně.

Vysílání zavřete přímo na Forendors tlačítkem Zavřít livestream. Pokud OBS Studio ukončíte tlačítkem *Ukončit/Exit*, bude to mít stejný efekt, jako když přestanete vysílat – po opětovném spuštění programu můžete ve vysílání pokračovat.

Věříme, že vám do začátku tenhle článek pomohl zorientovat se v základním nastavení OBS Studia. Pokud máte čas a chuť, můžete se podívat i na další nastavení přímo na [stránce výrobce](https://obsproject.com/cs/help) (pouze v angličtině), kde najdete spoustu dalších tipů, jak posunout váš livestream zase o level výš.

[Tudy se jde zpět na Forendors.](https://pickey.cz/)