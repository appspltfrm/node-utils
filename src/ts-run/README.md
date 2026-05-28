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
2. Przeszukuje katalogi nadrzędne — maksymalnie do katalogu pakietu (najbliższy `package.json`).
3. Pozwala na ręczne wskazanie pliku konfiguracji za pomocą parametru `--tsconfig <sciezka>`.

Podczas kompilacji tworzony jest tymczasowy plik `tsconfig.json`, który dziedziczy z odnalezionej konfiguracji projektu, ale nadpisuje parametry `outDir`, `declaration` oraz inne opcje niezbędne do poprawnego uruchomienia skryptu w izolacji.

## Argumenty

- `--tsconfig <sciezka>` — ręczny wybór bazowego `tsconfig.json`.
- `--no-check` — pomija pełne sprawdzanie typów (`noCheck: true`); raportowane są tylko błędy parsera/emitu. Szybsze, ale tracisz semantyczne błędy typów.
- pozostałe argumenty po nazwie pliku są przekazywane do skryptu.

## Wydajność

- `tsr` tworzy katalog tymczasowy `<dir-pliku>/ts-temp-XXXXXX/` na każde uruchomienie i usuwa go po zakończeniu (sukces lub błąd). Brak persistentnego cache, brak incremental — każde uruchomienie kompiluje od zera.
- Skompilowany kod jest uruchamiany przez `node --enable-source-maps`, więc stack trace wskazuje pozycje w plikach źródłowych `.ts`/`.tsx`.
- `--no-check` pomija pełne sprawdzanie typów (`noCheck: true`) — szybszy start, ale tracisz semantyczne błędy typów.
- Sygnały (`SIGINT`/`SIGTERM`/`SIGHUP`) i pre-commit błędy też wywołują sprzątanie temp dira, więc `ts-temp-*` nie wycieka.

## Pliki `.tsx` i JSX

`ts-run` musi wyemitować pliki `.js` (a nie `.jsx`), żeby `node` mógł je uruchomić. Jeśli rozwiązany `tsconfig.json` ma `jsx` ustawione na transformujący tryb (`react`, `react-jsx`, `react-jsxdev`), używamy go bez zmian. W pozostałych przypadkach (gdy `jsx` jest nieustawione, `preserve` lub `react-native`):

- jeżeli `jsxImportSource` jest ustawione w configu — wymuszamy `jsx: "react-jsx"` (automatyczny runtime z tym importem),
- w przeciwnym razie — wymuszamy `jsx: "react"` (tryb classic).

Dodatkowo `ts-run` rozumie niestandardową pragmę `/* @jsxFactory <fn> */` na początku pliku — TypeScript natywnie obsługuje tylko `/** @jsx <fn> */`, ale nasza implementacja zczytuje też tę pierwszą formę i ustawia `jsxFactory` w opcjach kompilatora (przełączając na tryb classic).

## Wymaganie: `ts-patch`

Mapowania `paths` z `tsconfig.json` są przepisywane przez plugin `typescript-transform-paths`. Plugin działa tylko, gdy `typescript` w `node_modules` został spatchowany przez `ts-patch` (workspace-root `package.json` wywołuje `ts-patch install -s` w hooku `prepare`). Jeśli sklonowałeś repo i pominąłeś `pnpm install` (albo wyłączyłeś hooki), plugin po cichu nic nie robi i importy z aliasów rozwiążą się w runtime jako `Cannot find module …`. Rozwiązanie: uruchom `pnpm install` w roocie albo `pnpm exec ts-patch install -s`.
