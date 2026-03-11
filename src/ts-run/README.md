# ts-run

`ts-run` (dostępny jako komenda `tsr`) to alternatywny mechanizm dla `tsx`, który służy do wykonywania plików TypeScript w środowisku Node.js.

## Zasada działania

W odróżnieniu od narzędzi wykonujących kod w locie (jak `tsx` czy `ts-node`), `ts-run` działa w trzech etapach:

1. **Kompilacja**: Wskazany plik `.ts` (lub `.tsx`) jest kompilowany do czystego JavaScriptu przy użyciu systemowego kompilatora `tsc`.
2. **Izolacja**: Plik wynikowy oraz tymczasowe metadane są umieszczane w dedykowanym katalogu tymczasowym, co zapobiega zanieczyszczaniu katalogu źródłowego.
3. **Wykonanie**: Skompilowany plik JS jest uruchamiany bezpośrednio przez `node`. Po zakończeniu działania (lub w przypadku błędu), katalog tymczasowy jest usuwany.

## Zalety

- Wykorzystuje natywny kompilator `tsc`, co gwarantuje 100% zgodność z konfiguracją projektu.
- Pozwala na uruchamianie skryptów TypeScript w trybie ESM (`type: "module"`).
- Nie wymaga skomplikowanej konfiguracji runtime'u Node.js.

## Konfiguracja (tsconfig.json)

`ts-run` automatycznie próbuje odnaleźć odpowiedni plik `tsconfig.json` dla wskazanego pliku wejściowego:
1. Sprawdza katalog, w którym znajduje się plik.
2. Przeszukuje katalogi nadrzędne.
3. Pozwala na ręczne wskazanie pliku konfiguracji za pomocą parametru `--tsconfig <sciezka>`.

Podczas kompilacji tworzony jest tymczasowy plik `tsconfig.json`, który dziedziczy z odnalezionej konfiguracji projektu, ale nadpisuje parametry `outDir` oraz inne opcje niezbędne do poprawnego uruchomienia skryptu w izolacji.
