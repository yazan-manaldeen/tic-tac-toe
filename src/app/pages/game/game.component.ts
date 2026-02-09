import {Component} from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {zoomIn, zoomOut} from "@app/animations/zoom";


type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  animations: [zoomIn, zoomOut]
})
export class GameComponent {
  title = 'Game | Tic-Tac-Toe';

  levels: Difficulty[] = ['easy', 'medium', 'hard'];

  soloPlayer: boolean;
  difficulty: Difficulty = 'medium';
  board: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  lighted: boolean[][] = [[false, false, false], [false, false, false], [false, false, false]];

  winner: string = '';
  turn: string = '';
  botTurn: boolean = false;
  xPlayer: number = 0;
  oPlayer: number = 0;

  isChoosing: boolean = false;
  canStart: boolean = false;
  firstPlayer: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    this.startRandomSelection();
    this.activatedRoute.queryParams.subscribe(params => {
      this.soloPlayer = params['game'] === 'solo-player';
    });
  }

  startRandomSelection() {
    if (this.isChoosing) return;
    let speed: number = 0;
    let duration: number = 1050 + Math.floor(Math.random() * 2);
    let elapsed: number = 0;
    this.goTurn(speed, duration, elapsed);
  }

  goTurn(speed: number, duration: number, elapsed: number) {
    setTimeout(() => {
      this.firstPlayer = this.firstPlayer === 'x' ? 'o' : 'x';
      elapsed += speed;
      speed += 10;
      if (elapsed >= duration) {
        this.canStart = true;
        setTimeout(() => {
          this.start();
        }, 1000);
        return;
      }
      this.goTurn(speed, duration, elapsed);
    }, speed);
  }

  start() {
    this.isChoosing = true;
    this.turn = this.firstPlayer;
    if (this.turn === 'o' && this.soloPlayer) this.botMove();
  }

  click(row: number, col: number) {
    if (this.board[row][col] !== '' || this.botTurn || this.winner) return;
    this.board[row][col] = this.turn;
    this.turn = this.turn === 'x' ? 'o' : 'x';
    const result = this.checkGameStatus();
    if (result && result !== 'draw') {
      this.winner = result;
      if (this.winner === 'x') this.xPlayer++;
      if (this.winner === 'o') this.oPlayer++;
    }
    if (this.soloPlayer && !result) {
      this.botMove();
    }
  }

  botMove() {
    this.botTurn = true;
    let move;
    switch (this.difficulty) {
      case 'easy':
        move = this.getRandomMove();
        break;
      case 'medium':
        move = this.getBestMove(2); // عمق محدود
        break;
      case 'hard':
        move = this.getBestMove(9); // أقصى عمق
        break;
    }
    if (move) {
      this.board[move.row][move.col] = 'o';
    }
    this.turn = this.turn === 'x' ? 'o' : 'x';
    this.botTurn = false;
    const result = this.checkGameStatus();
    if (result && result !== 'draw') {
      this.winner = result;
      if (this.winner === 'x') this.xPlayer++;
      if (this.winner === 'o') this.oPlayer++;
    }
  }

  getRandomMove() {
    const emptyCells: { row: number; col: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          emptyCells.push({row: i, col: j});
        }
      }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  getBestMove(maxDepth: number) {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          this.board[i][j] = 'o';
          const score = this.minValue(this.board, 0, -Infinity, Infinity, maxDepth);
          this.board[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = {row: i, col: j};
          }
        }
      }
    }
    return move;
  }

  maxValue(board: string[][], depth: number, alpha: number, beta: number, maxDepth: number): number {
    const evalResult = this.evaluate(depth);
    if (evalResult !== null || depth === maxDepth) {
      return evalResult ?? 0;
    }
    let value = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = 'o';
          value = Math.max(value, this.minValue(board, depth + 1, alpha, beta, maxDepth));
          board[i][j] = '';
          alpha = Math.max(alpha, value);
          if (alpha >= beta) return value;
        }
      }
    }
    return value;
  }

  minValue(board: string[][], depth: number, alpha: number, beta: number, maxDepth: number): number {
    const evalResult = this.evaluate(depth);
    if (evalResult !== null || depth === maxDepth) {
      return evalResult ?? 0;
    }
    let value = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = 'x';
          value = Math.min(value, this.maxValue(board, depth + 1, alpha, beta, maxDepth));
          board[i][j] = '';
          beta = Math.min(beta, value);
          if (beta <= alpha) return value; // pruning
        }
      }
    }
    return value;
  }

  evaluate(depth: number): number | null {
    const result = this.checkGameStatus(false);
    if (result === 'o') return 10 - depth;
    if (result === 'x') return depth - 10;
    if (result === 'draw') return 0;
    return null;
  }

  checkGameStatus(editLighted: boolean = true): string {
    const board = this.board;
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if (editLighted) {
          this.lighted[i][0] = true;
          this.lighted[i][1] = true;
          this.lighted[i][2] = true;
        }
        return board[i][0];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if (editLighted) {
          this.lighted[0][i] = true;
          this.lighted[1][i] = true;
          this.lighted[2][i] = true;
        }
        return board[0][i];
      }
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (editLighted) {
        this.lighted[0][0] = true;
        this.lighted[1][1] = true;
        this.lighted[2][2] = true;
      }
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (editLighted) {
        this.lighted[0][2] = true;
        this.lighted[1][1] = true;
        this.lighted[2][0] = true;
      }
      return board[0][2];
    }
    const isDraw = board.every(row => row.every(cell => cell !== ''));
    if (isDraw) {
      return 'draw';
    }
    return null;
  }

  reset() {
    this.board = [['', '', ''], ['', '', ''], ['', '', '']];
    this.lighted = [[false, false, false], [false, false, false], [false, false, false]];
    this.winner = '';
    this.turn = '';
    this.botTurn = false;
    this.isChoosing = false;
    this.canStart = false;
    this.startRandomSelection();
  }

  back() {
    this.location.back();
  }
}
