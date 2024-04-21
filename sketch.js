let input_r, input_d, input_mul,
    input_search_attk, input_search_dfn,
    input_return_attk, input_return_dfn;
let img, all_img=[], img_num=5, cur_img=1;
let img_draw, img_win, img_lose;
let button_back, button_change, button_restart, button_start, button_col;
let btn_font_size = "18px";
let fontsize=40, fontsize_player=20;
let chess_orig_size = 20;
let border=15, gap=28, line_num=15, button_offset=80;
let start_locked=true, drag_locked=false, cp_locked=false;
let stack, drag_count=0;
let red_chess=[];
let all_chess = [];
let player=0, cp=1, winner=-1;
let left='Computer', right='Player';
let board_height=border*2+gap*14, board_width=board_height;

let slideInterval;

function setup() {
  frameRate(20);
  createCanvas(board_width+60, board_height+150);
  textStyle(BOLD);
  textSize(fontsize);
  for(let i=0; i<img_num; i++){
    all_img.push(loadImage('assets/board'+i+'.jpg'));
  }
  
  input_r = createInput('6');
  input_r.position(board_width, 40);
  input_r.size(40, input_r.heigh);
  
  input_d = createInput('7');
  input_d.position(board_width, 100);
  input_d.size(40, input_d.heigh);
  
  input_mul = createInput('5');
  input_mul.position(board_width, 200);
  input_mul.size(40, input_mul.heigh);
  
  input_search_attk = createInput('0.99999999999999');
  input_search_attk.position(board_width, 300);
  input_search_attk.size(40, input_search_attk.heigh);
  
  input_search_dfn = createInput('1');
  input_search_dfn.position(board_width, 360);
  input_search_dfn.size(40, input_search_dfn.heigh);
  
  input_return_attk = createInput('0.99999999999999');
  input_return_attk.position(board_width, 460);
  input_return_attk.size(40, input_return_attk.heigh);
  
  input_return_dfn = createInput('1');
  input_return_dfn.position(board_width, 520);
  input_return_dfn.size(40, input_return_dfn.heigh);
  
  img = all_img[cur_img];
  img_draw = loadImage('assets/draw.png');
  img_win = loadImage('assets/win.png');
  img_lose = loadImage('assets/lose.png');
  
  col = color(255, 23, 23, 70);
  button_start = createButton('Start');
  button_start.size(80, 40);
  button_start.position(board_width*2/13-40, board_height+button_offset);
  button_start.style("font-size", btn_font_size);
  button_start.style("font-weight", BOLD);
  button_start.style('background-color', color(255, 0, 0, 255));
  button_start.mousePressed(start);
  
  button_restart = createButton('Clear');
  button_restart.size(80, 40);
  button_restart.position(board_width*2/13-40, board_height+button_offset);
  button_restart.style("font-size", btn_font_size);
  button_restart.style('background-color', col);
  button_restart.mousePressed(restart);
  
  button_change = createButton('Change');
  button_change.size(80, 40);
  button_change.position(board_width*5/13-40, board_height+button_offset);
  button_change.style("font-size", btn_font_size);
  button_change.style('background-color', col);
  button_change.mousePressed(change_sides);
  
  button_back = createButton('Undo');
  button_back.size(80, 40);
  button_back.position(board_width*5/13-40, board_height+button_offset);
  button_back.style("font-size", btn_font_size);
  button_back.style('background-color', col);
  button_back.mousePressed(back);
  
  button_col = createButton('Color');
  button_col.size(80, 40);
  button_col.position(board_width*8/13-40, board_height+button_offset);
  button_col.style("font-size", btn_font_size);
  button_col.style('background-color', col);
  button_col.mousePressed(change_color);
  
  restart();
}

function draw() {
  draw_board();
  if(cp_locked){
    textSize(fontsize);
    fill('#eeee00');
    text('calculating...',board_width/2-120,board_height/2+10);
  }
}


function mousePressed() {
}

function mouseDragged() {
  drag_count++;
  if(drag_count>5){
    drag_locked = true;
  }
}

function mouseReleased() {
  if(!drag_locked && !start_locked && !cp_locked && winner==-1){
    if(mouseY<=board_width){
      offset = border-(gap/2)
      let row = int((mouseY-offset)/gap);
      let col = int((mouseX-offset)/gap);
      if(all_chess[row][col]==-1){
        all_chess[row][col] = player;
        winner = check_winner(all_chess, player,true);
        stack.push([row, col]);
        if(winner!=-1){
           return;
        }
        cp_locked = true;
        slideInterval = setInterval(function() {
          let loc = computer_moved(cp, all_chess);
          stack.push(loc);
          winner = check_winner(all_chess, cp,true);
          cp_locked = false;
          clearInterval(slideInterval);
        }, 100);
      }
    }
  }
  drag_count=0;
  drag_locked = false;
}

function draw_chess(row, col, chess) {
  chess_color = (chess==1)?0:255;
  chess_size = (chess==1)?chess_orig_size:chess_orig_size+1;
  if(chess==2){
    chess_color=color(255, 0, 0, 255);
    chess_size += 4;
  }
  fill(chess_color);
  ellipse(border+col*gap, border+row*gap, chess_size, chess_size);
}

function draw_board() {
  image(img, 0, 0, width, height);
  fill('#000000');
  for(let row = 0; row < line_num; row++) {
    line(border+row*gap, border, border+row*gap, board_height-border);
    line(border, border+row*gap, board_width-border, border+row*gap);
    if(row==3||row==7||row==11){
      rect(border+row*gap-2, border+3*gap-2, 4, 4);
      rect(border+row*gap-2, border+7*gap-2, 4, 4);
      rect(border+row*gap-2, border+11*gap-2, 4, 4);
    }
  }
  for(let red=0; red<red_chess.length;red++){
    draw_chess(red_chess[red][0], red_chess[red][1], 2);
  }
  if(stack.length>0){
    draw_chess(stack[stack.length-1][0], stack[stack.length-1][1], 2);
  }
  else if(cp==1 && !start_locked && winner==-1){
    draw_chess(7, 7, 2);
  }
  for(let row = 0; row < line_num; row++) {
    for (let col = 0; col < line_num; col++) {
      if(all_chess[row][col] != -1){
        draw_chess(row, col, all_chess[row][col]);
      }
    }
  }
  textSize(fontsize_player);
  draw_chess(15.8,2.8,1);
  text(left,board_width/3-40+5,board_height+40);
  draw_chess(15.8,7.8,0);
  text(right,board_width*2/3-40+5,board_height+40);
  fill('#000000');
  textSize(14);
  textStyle(NORMAL);
  text('Breadth:',input_r.x-2,input_r.y-10);
  text('Depth:',input_d.x-2,input_d.y-10);
  text('Score:',input_mul.x-2,input_mul.y-10);
  text('ASS:',input_search_attk.x-2,input_search_attk.y-10);
  text('DSS:',input_search_dfn.x-2,input_search_dfn.y-10);
  text('ARS:',input_return_attk.x-2,input_return_attk.y-10);
  text('DRS:',input_return_dfn.x-2,input_return_dfn.y-10);
  textStyle(BOLD);
  if(winner!=-1){
    stack=[];
  }
  if(winner==0){
    image(img_lose, board_width/3-60, board_height-30, 120, 120);
    image(img_win, board_width*2/3-60, board_height-30, 120, 120);
  }
  else if(winner==1){
    image(img_win, board_width/3-60, board_height-30, 120, 120);
    image(img_lose, board_width*2/3-60, board_height-30, 120, 120);
  }
  else if(winner==2){
    image(img_draw, board_width/2-90, board_height-30, 180, 120);
  }
}

function start(){
  start_locked = false;
  button_back.show();
  button_restart.show();
  button_change.hide();
  button_start.hide();
  if(player==0){
    all_chess[7][7] = 1;
  }
}


function restart(){
  start_locked = true;
  button_back.hide();
  button_restart.hide();
  button_change.show();
  button_start.show();
  for(let row = 0; row < line_num; row++) {
    all_chess[row] = [];
    for (let col = 0; col < line_num; col++) {
      all_chess[row][col] = -1;
    }
  }
  stack=[];
  red_chess=[];
  winner=-1;
}

function change_sides(){
  let chg_tmp=left;
  left = right;
  right = chg_tmp;
  chg_tmp = player;
  player = cp;
  cp = chg_tmp;
}

function back(){
  if(stack.length>0 && winner==-1 && !cp_locked){
    step = stack.pop();
    all_chess[step[0]][step[1]]=-1;
    step = stack.pop();
    all_chess[step[0]][step[1]]=-1;
  }
}

function change_color(){
  cur_img = (cur_img+1)%img_num;
  img = all_img[cur_img];
}

function check_winner(board, player, push){
  let tmp=0;
  for(let row = 0; row < line_num; row++) {
    for(let col = 0; col < line_num; col++) {
      if(all_chess[row][col]==-1){
        tmp++;
      }
      if(all_chess[row][col]==player){
        for(let d = 0; d < 4; d++){
          for(let k = 1; k < 5; k++) {
            let new_row = row+direction[d][0]*k;
            let new_col = col+direction[d][1]*k;
            if(new_col<0||
               new_col>=line_num||
               new_row>=line_num||
               all_chess[new_row][new_col]!=player){
              red_chess=[];
              break;
            }
            if(push){red_chess.push([new_row, new_col]);}
            if(k==4){
              if(push){red_chess.push([row, col]);}
              return player;
            }
          }
        }
      }
    }
  }
  if(tmp==0){
    return 2
  }
  return -1;
}
