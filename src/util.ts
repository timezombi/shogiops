import {
  FILE_NAMES,
  RANK_NAMES,
  Color,
  Square,
  Role,
  PocketRole,
  Move,
  isDrop,
  SquareName,
  PromotableRole,
} from './types';

export function defined<A>(v: A | undefined): v is A {
  return v !== undefined;
}

export function opposite(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

export function squareRank(square: Square): number {
  return Math.floor(square / 9);
}

export function squareFile(square: Square): number {
  return square % 9;
}

export function unpromote(role: Role): PocketRole | undefined {
  switch (role) {
    case 'pawn':
    case 'tokin':
      return 'pawn';
    case 'lance':
    case 'promotedLance':
      return 'lance';
    case 'knight':
    case 'promotedKnight':
      return 'knight';
    case 'silver':
    case 'promotedSilver':
      return 'silver';
    case 'gold':
      return 'gold';
    case 'bishop':
    case 'horse':
      return 'bishop';
    case 'rook':
    case 'dragon':
      return 'rook';
    default:
      return;
  }
}

export function promote(role: PromotableRole): Role {
  switch (role) {
    case 'pawn':
      return 'tokin';
    case 'lance':
      return 'promotedLance';
    case 'knight':
      return 'promotedKnight';
    case 'silver':
      return 'promotedSilver';
    case 'bishop':
      return 'horse';
    case 'rook':
      return 'dragon';
  }
}

export function roleToChar(role: Role): string {
  switch (role) {
    case 'pawn':
      return 'p';
    case 'lance':
      return 'l';
    case 'knight':
      return 'n';
    case 'silver':
      return 's';
    case 'gold':
      return 'g';
    case 'bishop':
      return 'b';
    case 'rook':
      return 'r';
    case 'tokin':
      return '+p';
    case 'promotedLance':
      return '+l';
    case 'promotedKnight':
      return '+n';
    case 'promotedSilver':
      return '+s';
    case 'horse':
      return '+b';
    case 'dragon':
      return '+r';
    case 'king':
      return 'k';
  }
}

export function charToRole(
  ch:
    | 'p'
    | 'l'
    | 'n'
    | 's'
    | 'g'
    | 'b'
    | 'r'
    | '+p'
    | '+l'
    | '+n'
    | '+s'
    | '+b'
    | '+r'
    | 'P'
    | 'L'
    | 'N'
    | 'S'
    | 'G'
    | 'B'
    | 'R'
    | '+P'
    | '+L'
    | '+N'
    | '+S'
    | '+B'
    | '+R'
): Role;
export function charToRole(ch: string): Role | undefined;
export function charToRole(ch: string): Role | undefined {
  switch (ch) {
    case 'P':
    case 'p':
      return 'pawn';
    case 'L':
    case 'l':
      return 'lance';
    case 'N':
    case 'n':
      return 'knight';
    case 'S':
    case 's':
      return 'silver';
    case 'G':
    case 'g':
      return 'gold';
    case 'B':
    case 'b':
      return 'bishop';
    case 'R':
    case 'r':
      return 'rook';
    case '+P':
    case '+p':
      return 'tokin';
    case '+L':
    case '+l':
      return 'promotedLance';
    case '+N':
    case '+n':
      return 'promotedKnight';
    case '+S':
    case '+s':
      return 'promotedSilver';
    case '+B':
    case '+b':
      return 'horse';
    case '+R':
    case '+r':
      return 'dragon';
    case 'K':
    case 'k':
      return 'king';
    default:
      return;
  }
}

export function parseSquare(str: SquareName): Square;
export function parseSquare(str: string): Square | undefined;
export function parseSquare(str: string): Square | undefined {
  if (str.length !== 2) return;
  const file = Math.abs(str.charCodeAt(0) - '9'.charCodeAt(0));
  const rank = Math.abs(str.charCodeAt(1) - 'i'.charCodeAt(0));
  if (file < 0 || file >= 9 || rank < 0 || rank >= 9) return;
  return file + 9 * rank;
}

export function makeSquare(square: Square): SquareName {
  return (FILE_NAMES[squareFile(square)] + RANK_NAMES[squareRank(square)]) as SquareName;
}

export function parseUsi(str: string): Move | undefined {
  if (str[1] === '*' && str.length === 4) {
    const role = charToRole(str[0]) as PocketRole;
    const to = parseSquare(str.slice(2));
    if (defined(role) && defined(to)) return { role, to };
  } else if (str.length === 4 || str.length === 5) {
    const from = parseSquare(str.slice(0, 2));
    const to = parseSquare(str.slice(2, 4));
    const promotion = str.length === 5 && str[4] === '+' ? true : false;
    if (defined(from) && defined(to)) return { from, to, promotion };
  }
  return;
}

export function makeUsi(move: Move): string {
  if (isDrop(move)) return `${roleToChar(move.role).toUpperCase()}*${makeSquare(move.to)}`;
  return makeSquare(move.from) + makeSquare(move.to) + (move.promotion ? '+' : '');
}
