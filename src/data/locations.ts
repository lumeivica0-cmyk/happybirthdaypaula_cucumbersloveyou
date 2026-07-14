import type { GameLocation } from '../types'

export const WORLD_W = 900
export const WORLD_H = 560

export const LOCATIONS: Record<string, GameLocation> = {
  office: {
    id: 'office',
    name: 'Кабінет детективів',
    subtitle: 'Штаб-квартира у Волмур-Голлоу',
    width: WORLD_W,
    height: WORLD_H,
    ambience: 'Тихе потріскування каміна. Десь за вікном шумить туман.',
    obstacles: [
      { x: 40, y: 60, w: 150, h: 250 }, // bookshelf, left wall — decorative only
      { x: 370, y: 380, w: 220, h: 90 }, // desk, front edge faces south (y470)
      { x: 690, y: 80, w: 160, h: 90 }, // armchair — decorative only
    ],
    hotspots: [
      {
        id: 'deskInvitation',
        x: 385,
        y: 400,
        w: 80,
        h: 60,
        label: 'Оглянути запрошення',
        kind: 'evidence',
        targetId: 'invitation',
      },
      {
        id: 'deskCandleNote',
        x: 475,
        y: 400,
        w: 80,
        h: 60,
        label: 'Оглянути записку про свічки',
        kind: 'evidence',
        targetId: 'candleOrder',
      },
      {
        id: 'exitToLibrary',
        x: 40,
        y: 360,
        w: 40,
        h: 100,
        label: 'До бібліотеки',
        kind: 'exit',
        targetId: 'library',
        spawn: { x: 820, y: 420 },
      },
      {
        id: 'exitToWorkshop',
        x: 820,
        y: 360,
        w: 40,
        h: 100,
        label: 'До майстерні годинникаря',
        kind: 'exit',
        targetId: 'clockworkshop',
        spawn: { x: 60, y: 420 },
      },
    ],
  },

  library: {
    id: 'library',
    name: 'Бібліотека',
    subtitle: 'Тисячі книг і жодної випадкової',
    width: WORLD_W,
    height: WORLD_H,
    ambience: 'Пахне старим папером і воском свічок. Полиці тягнуться до стелі.',
    obstacles: [
      { x: 0, y: 40, w: 900, h: 60 }, // top wall of shelves — decorative only
      { x: 370, y: 140, w: 160, h: 90 }, // central cipher shelf, front edge faces south (y230)
      { x: 60, y: 430, w: 150, h: 80 }, // side reading table
    ],
    hotspots: [
      {
        id: 'libraryNoteSpot',
        x: 70,
        y: 405,
        w: 130,
        h: 55,
        label: 'Прочитати нотатку бібліотекаря',
        kind: 'evidence',
        targetId: 'librarianNote',
      },
      {
        id: 'cipherShelf',
        x: 385,
        y: 165,
        w: 130,
        h: 65,
        label: 'Оглянути шафу-шифр',
        kind: 'puzzle',
        targetId: 'libraryCipher',
        hideIfFlag: 'library_solved',
      },
      {
        id: 'passageDoor',
        x: 385,
        y: 165,
        w: 130,
        h: 65,
        label: 'Увійти до потаємного ходу',
        kind: 'exit',
        targetId: 'secretpassage',
        requiresFlag: 'library_solved',
        spawn: { x: 450, y: 480 },
      },
      {
        id: 'exitToOfficeFromLibrary',
        x: 820,
        y: 360,
        w: 40,
        h: 100,
        label: 'Назад до кабінету',
        kind: 'exit',
        targetId: 'office',
        spawn: { x: 60, y: 420 },
      },
    ],
  },

  clockworkshop: {
    id: 'clockworkshop',
    name: 'Майстерня годинникаря',
    subtitle: 'Десятки годинників, жоден не поспішає однаково',
    width: WORLD_W,
    height: WORLD_H,
    ambience: 'Цокання лунає з усіх боків, накладаючись саме на себе.',
    obstacles: [
      { x: 40, y: 40, w: 820, h: 60 }, // wall of clocks — decorative only
      { x: 400, y: 140, w: 120, h: 100 }, // grandfather clock, front edge faces south (y240)
      { x: 80, y: 420, w: 140, h: 70 }, // side table with ledger
      { x: 700, y: 420, w: 140, h: 70 }, // side table with diary
    ],
    hotspots: [
      {
        id: 'ledgerSpot',
        x: 90,
        y: 400,
        w: 120,
        h: 45,
        label: 'Переглянути гросбух',
        kind: 'evidence',
        targetId: 'workshopLedger',
      },
      {
        id: 'diarySpot',
        x: 710,
        y: 400,
        w: 120,
        h: 45,
        label: 'Прочитати сторінку щоденника',
        kind: 'evidence',
        targetId: 'diaryPage',
      },
      {
        id: 'grandfatherClock',
        x: 410,
        y: 170,
        w: 100,
        h: 55,
        label: 'Налаштувати великий годинник',
        kind: 'puzzle',
        targetId: 'clockPuzzle',
        hideIfFlag: 'clock_solved',
      },
      {
        id: 'exitToOfficeFromWorkshop',
        x: 40,
        y: 360,
        w: 40,
        h: 100,
        label: 'Назад до кабінету',
        kind: 'exit',
        targetId: 'office',
        spawn: { x: 780, y: 420 },
      },
    ],
  },

  secretpassage: {
    id: 'secretpassage',
    name: 'Потаємний хід',
    subtitle: 'Там, де закінчуються таємниці',
    width: WORLD_W,
    height: WORLD_H,
    ambience: 'Прохолодне повітря і слабке мерехтіння світла попереду.',
    obstacles: [
      { x: 0, y: 40, w: 900, h: 50 }, // passage entrance wall — decorative only
      { x: 380, y: 340, w: 160, h: 110 }, // wooden chest, front edge faces south (y450)
    ],
    hotspots: [
      {
        id: 'ravenWall',
        x: 140,
        y: 100,
        w: 160,
        h: 70,
        label: 'Оглянути різьблення на стіні',
        kind: 'evidence',
        targetId: 'ravenCount',
      },
      {
        id: 'finalNoteSpot',
        x: 620,
        y: 100,
        w: 160,
        h: 70,
        label: 'Прочитати записку біля скрині',
        kind: 'evidence',
        targetId: 'finalRiddle',
      },
      {
        id: 'chestSpot',
        x: 400,
        y: 380,
        w: 120,
        h: 55,
        label: 'Відкрити скриню',
        kind: 'puzzle',
        targetId: 'chestLock',
        hideIfFlag: 'chest_solved',
      },
      {
        id: 'exitToLibraryFromPassage',
        x: 400,
        y: 500,
        w: 100,
        h: 40,
        label: 'Назад до бібліотеки',
        kind: 'exit',
        targetId: 'library',
        spawn: { x: 450, y: 260 },
      },
    ],
  },
}
