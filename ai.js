let direction = [[0,1],[1,0],[1,1],[1,-1]];
let score;
//let score_p = [1, 5, 25, 125, 625, 3125, 0];
let multiple;
let max = 9999999, min=-9999999;

let tablesize=100000;

let hi = Math.random() * 4294967296;
let lo = Math.random() * 4294967296;

let count=0;
let zobrist = new Uint32Array(line_num*line_num*2*2) 
for (let i=0; i<zobrist.length; i++)
  zobrist[i] = Math.random() * 4294967296;

let table_hi, table_lo, table=[];

function computer_moved(cp, board){
  table_hi = new Uint32Array(tablesize);
  table_lo = new Uint32Array(tablesize);
  table[tablesize-1]=0;
  score = [1,0];
  multiple = input_mul.value();
  for(let i=1;i<6;i++){
    score.splice(i,0,score[i-1]*multiple);
  }
  let range = input_r.value();
  let depth = input_d.value();
  let attk = input_search_attk.value();
  let dfn = input_search_dfn.value();
  let attk_r = input_return_attk.value();
  let dfn_r = input_return_dfn.value();
  let point = minmax(cp, cp, board, depth, range, min, max, attk, dfn, attk_r, dfn_r);
  board[point[1]][point[2]]=cp;
  return [point[1], point[2]]
}


function minmax(cp, player, board, depth, range, alpha, beta, attk, dfn, attk_r, dfn_r){
  let enemy=(player+1)%2;
  let winner=check_winner(board, enemy, false);
  if(winner==enemy){
    return (cp==enemy)?[max+depth-1000]:[min-depth+1000];
  }
  else if(winner==2){
    return [0];
  }
  if(depth==0){
    return [board_score(cp, board, attk_r, dfn_r)];
  }
  let top_nodes=[[min,0,0]];
  for(let row = 0; row < line_num; row++) {
    for (let col = 0; col < line_num; col++) {
      if(board[row][col]==-1){
        let score_tmp = point_score(player, board, row, col, attk, dfn);
        for(let k=0; k<top_nodes.length; k++){
          if(top_nodes[k][0]<score_tmp){
            top_nodes.splice(k,0,[score_tmp,row,col]);
            break;
          }
        }
        top_nodes.splice(range, top_nodes.length-range);
      }
    }
  }
  let sign=(cp==player)?1:-1;
  let best = [sign*min, 0, 0];
  for(let k=0;k<range;k++){
    let row = top_nodes[k][1];
    let col = top_nodes[k][2];
    hi ^= zobrist[row * line_num*4 + col * 4 + player*2];
    lo ^= zobrist[row * line_num*4 + col * 4 + player*2 + 1];
    let i = lo % tablesize;
    if (table_hi[i] != hi || table_lo[i] != lo){
      table_hi[i] = hi; 
      table_lo[i] = lo;
      board[row][col]=player;
      table[i] = minmax(cp, enemy, board, depth-1, range, 
                        alpha, beta, attk, dfn, attk_r, dfn_r)[0];
      board[row][col]=-1;
    }/*
    else{
      print('collision');
    }*/
    hi ^= zobrist[row * line_num*4 + col * 4 + player*2];
    lo ^= zobrist[row * line_num*4 + col * 4 + player*2 + 1];
    if(sign*best[0]<sign*table[i]){
       best=[table[i], row, col]
    }
    if(cp==player){
      alpha = Math.max(alpha, table[i]);
    }
    else{
      beta = Math.min(beta, table[i]);
    }
    if(beta<=alpha){
      break;   
    }
  }
  return best;
}


function point_score(player, board, row, col, attk, dfn){
  let sum_score=0;
  for(let p=0;p<2;p++){
    let sign=(p==player)?(attk*(multiple-1)):dfn;
    let enemy=(p+1)%2;
    for(let dir=0;dir<direction.length;dir++) {
      for(let begin = -4; begin <=0 ; begin++) {
        let begin_row = row+direction[dir][0]*begin;
        let begin_col = col+direction[dir][1]*begin;
        let tmp=0;
        for(let k=0;k<5;k++){
          let new_row = begin_row+direction[dir][0]*k;
          let new_col = begin_col+direction[dir][1]*k;
          if(new_col<0||
             new_row<0||
             new_col>=line_num||
             new_row>=line_num||
             board[new_row][new_col]==enemy){
            tmp=6; 
            break;
          }
          else if(board[new_row][new_col]==p){
            tmp++;
          }
        }
        sum_score+=sign*score[tmp]
      }
    }
  }
  return sum_score;
}


function board_score(player, board, attk, dfn){
  let sum_score=0;
  for(let p=0;p<2;p++){
    let sign=(p==player)?attk:-dfn;
    let enemy=(p+1)%2;
    for(let row = 0; row < line_num; row++) {
      for(let col = 0; col < line_num; col++) {
        for(let dir=0;dir<direction.length;dir++){
          let tmp=0;
          for(let k=0;k<5;k++){
            let new_row = row+direction[dir][0]*k;
            let new_col = col+direction[dir][1]*k;
            if(new_col<0||
               new_col>=line_num||
               new_row>=line_num||
               board[new_row][new_col]==enemy){
              tmp=6; 
              break;
            }
            else if(board[new_row][new_col]==p){
              tmp++;
            }
          }
          sum_score+=sign*score[tmp]
        }
      }
    }
  }
  return sum_score;
}