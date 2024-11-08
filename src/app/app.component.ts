import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { delay } from 'rxjs';

const dir = [
  [-1,0],
  [0,-1],
  [1,0],
  [0,1]
]

const symbols = [
  '#',
  '_',
]

type Point = {
  row: number,
  col: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PathFinder';
  start = 'S';
  startPoint : Point = {
    row: 0,
    col: 0
  };
  endPoint : Point = {
    row: 0,
    col: 0
  };
  end = 'E';
  gridSize = 10;
  grid : string[][] = [];
  seen : boolean[][] = [];
  color : string[][] = [];
  path : Point[] = [];

  symbols : string[] = []
  constructor(){
    this.initColor();
    this.initGrid();
    this.initSeen();
    this.addStartAndEnd();
    this.addGridSymbols();
  }

  //1. Set a start point and exit in the grid
  //2. Store start point in variable x,y
  //3. randomly add walls and paths to the grid
  //4. make sure wall and path is not on the start and exit point
  //5.
  addGridSymbols(){
    for(let row = 0;row < this.gridSize;row++){
      for(let col = 0;col < this.gridSize;col++){
        if(!(row === this.startPoint.row && col === this.startPoint.col || row === this.endPoint.row && col === this.endPoint.col)){
          this.grid[row][col] = this.getSymbol();
        }
      }
    }
  }

  addStartAndEnd(){
   let row = Math.floor(Math.random()*this.gridSize);
   let col = Math.floor(Math.random()*this.gridSize);
   this.grid[row][col] = 'S';
   this.startPoint = { row: row, col: col};
   do{
   row = Math.floor(Math.random()*this.gridSize);
   col = Math.floor(Math.random()*this.gridSize);}
   while(this.startPoint.row === row && this.startPoint.col === col);
   this.grid[row][col] = "E";
   this.endPoint = { row: row, col: col};
  }

  getSymbol(){
    return symbols[Math.floor(Math.random()*2)];
  }

  initSeen(){
    for(let i = 0; i < this.gridSize; i++){
      this.seen.push(new Array(this.gridSize).fill(false));
    }
  }

  initGrid(){
    for(let i = 0; i < this.gridSize; i++){
      this.grid.push(new Array(this.gridSize).fill(''));
    }
  }

  initColor(){
    for(let i  = 0; i < this.gridSize; i++){
      this.color.push(new Array(this.gridSize).fill('gray'));
    }
  }

  findPath(){
    this.move(this.startPoint);
    this.updateGridPath();
  }

  move(curr: Point):boolean{
    //if is out of bounds
    if(curr.row >= this.gridSize || curr.col >= this.gridSize || curr.col < 0 || curr.row < 0){
      return false;
    }
    //if is wall
    if(this.grid[curr.row][curr.col]=== "#"){
      return false;
    }
    //if you've seen it before
    if(this.seen[curr.row][curr.col] === true){
      return false;
    }
    //if it is end
    if(this.grid[curr.row][curr.col] === "E"){
      this.path.push(curr);
      return true;
    }

    this.seen[curr.row][curr.col] = true;
    this.path.push(curr);

    for(let i = 0;i < dir.length; i++){
      const [row,col] = dir[i];
      if(
        this.move({
          row : curr.row + row,
          col : curr.col + col
        })){
          return true;
        }
      }


    this.path.pop();
    return false;
  }

  reload(){
    this.grid = [];
    this.seen = [];
    this.color = [];
    this.path  = [];
    this.symbols = []
    this.initColor();
    this.initGrid();
    this.initSeen();
    this.addStartAndEnd();
    this.addGridSymbols();
  }

  updateGridPath(){
    let i = 0;
    this.changeColor(i);
  }

  changeColor(i: number){
    setTimeout(()=>{
      if(i < this.path.length){
        this.color[this.path[i].row][this.path[i].col] = 'blue';
        i++
        this.changeColor(i);
      }
    },1000);
  }
}

