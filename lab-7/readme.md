## Canvas, kanwasik. 
#### Projekt dwutygodniowy  
Coś takiego: [Canvas - w kulki a nie w piłkę...](https://wseii-my.sharepoint.com/:v:/g/personal/rbrzegowy_wsei_edu_pl/EYu-Qxy_FudBtBxuxjvob24B_1fwQ7qT1QvPG4RiBatxNQ?e=AgFjS7&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)
### Wersja Nic się nie działo, naprawdę nic się... :
- [x] Narysuj X kulek poruszających się w dowolnym kierunku z losową prędkością
- [x] Jeśli odległość pomiędzy kulkami jest mniejsza niż Y rysuj pomiędzy nimi linię
- [x] Kulki odbijają się od krawędzi strony
1. Dodaj przyciski Start i Reset
1. Zbadaj ile jesteś w stanie wyświetlić kulek (stabilne 60fps) przy założeniu Y = 20% szerokości ekranu  
- [x] X, Y jest definiowane przez użytkownika (pola tekstowe lub np. suwaki - wstępnie uzupełnione)

### Wersja Task Failed Successfully: 
- [x] Kursor myszy odpycha/przyciąga znajdujące się w pobliżu kulki. Siła odpychania/przyciągania jest konfigurowalna.
- [x] Kliknięcie w kulkę powoduje jej usunięcie i utworzenie dwóch nowych w losowych miejscach.

### Wersja Męczy nas piłka:
- [x] Każda kulka ma początkowo losowy rozmiar. Rozmiar kulki określa jej energię. Agarrr:)
- [x] Gdy kulka łączy się z drugą (linia) energia płynie od kulki słabszej do silniejszej (kulki zmieniają rozmiar).   
Siła kulki to X \* Prędkość + Y \* Masa.  
X, Y konfigurowalne przez użytkownika.
- [x] Kulki o rozmiarze mniejszym niż 1 umierają
- [x] W miarę jak kulka rośnie jej prędkość zwalnia (gdy maleje - przyspiesza)

### Przydamisie:
> Rysowanie koła: ctx.arc().  
Rysownie linii: ctx.beginPath(), ctx.moveTo(), ctx.lineTo()     
Wypełnianie/obrysowanie kształtu: ctx.fill(), ctx.stroke()   
Czyszczenie canvas: ctx.clearRect()