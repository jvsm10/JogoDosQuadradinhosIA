// Inicia 
document.addEventListener("DOMContentLoaded", game);

function game() {

  // Estrutura dos quadrados
  var parentX = document.querySelector(".sliding-puzzle").clientHeight;
  var baseDistance = 34.5;
  var tileMap = {
    1: {
      tileNumber: 1,
      position: 1,
      top: 0,
      left: 0
    },
    2: {
      tileNumber: 2,
      position: 2,
      top: 0,
      left: baseDistance * 1
    },
    3: {
      tileNumber: 3,
      position: 3,
      top: 0,
      left: baseDistance * 2
    },
    4: {
      tileNumber: 4,
      position: 4,
      top: baseDistance,
      left: 0
    },
    5: {
      tileNumber: 5,
      position: 5,
      top: baseDistance,
      left: baseDistance
    },
    6: {
      tileNumber: 6,
      position: 6,
      top: baseDistance,
      left: baseDistance * 2
    },
    7: {
      tileNumber: 7,
      position: 7,
      top: baseDistance * 2,
      left: 0
    },
    8: {
      tileNumber: 8,
      position: 8,
      top: baseDistance * 2,
      left: baseDistance
    },
    empty: {
      position: 9,
      top: baseDistance * 2,
      left: baseDistance * 2
    }
  }

  var tileMapFinal = tileMap;
  var tileMapAux;
  function movementMap(position) {
    if (position == 9) return [6, 8];
    if (position == 8) return [5, 7, 9];
    if (position == 7) return [4, 8];
    if (position == 6) return [3, 5, 9];
    if (position == 5) return [2, 4, 6, 8];
    if (position == 4) return [1, 5, 7];
    if (position == 3) return [2, 6];
    if (position == 2) return [1, 3, 5];
    if (position == 1) return [2, 4];
  }

  document.querySelector('#shuffle').addEventListener('click', shuffle , true);
  document.querySelector('#solve').addEventListener('click', heuristica1 , true);
  document.querySelector('#solve2').addEventListener('click', heuristica2 , true);
  document.querySelector('#solve3').addEventListener('click', heuristica3 , true);
  document.querySelector('#solve1').addEventListener('click', buscaAleatoria , true);
  var tiles = document.querySelectorAll('.tile');
  var delay = -50;
  for(var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', tileClicked ,true );
    var tileId = tiles[i].innerHTML;
    delay += 50;
    setTimeout(setup, delay, tiles[i]);
  }

  function setup(tile) {
    var tileId = tile.innerHTML;
    // tile.style.left = tileMap[tileId].left + '%';
    // tile.style.top = tileMap[tileId].top + '%';
    var xMovement = parentX * (tileMap[tileId].left/100);
    var yMovement = parentX * (tileMap[tileId].top/100);
    var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
    tile.style.webkitTransform = translateString;
    //recolorTile(tile, tileId);
  }

  function tileClicked(event) {
    var tileNumber = event.target.innerHTML;
    moveTile(event.target);

    if (checkSolution()) {
      console.log("Fim");
    }
  }

  // Move o quadrado para o espaço vazio
  function moveTile(tile, recordHistory = true) {
    // Checa se o quadrado pode ser movido
    var tileNumber = tile.innerHTML;
    if (!tileMovable(tileNumber)) {
      console.log("Tile " + tileNumber + " Nao pode ser movido.");
      return;
    }

    // Troca o quadrado com o espaço vazio
    var emptyTop = tileMap.empty.top;
    var emptyLeft = tileMap.empty.left;
    var emptyPosition = tileMap.empty.position;
    tileMap.empty.top = tileMap[tileNumber].top;
    tileMap.empty.left = tileMap[tileNumber].left;
    tileMap.empty.position = tileMap[tileNumber].position;

    // tile.style.top = emptyTop  + '%'; 
    // tile.style.left = emptyLeft  + '%';

    var xMovement = parentX * (emptyLeft/100);
    var yMovement = parentX * (emptyTop/100);
    var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
    tile.style.webkitTransform = translateString;

    tileMap[tileNumber].top = emptyTop;
    tileMap[tileNumber].left = emptyLeft;
    tileMap[tileNumber].position = emptyPosition;

    //recolorTile(tile, tileNumber);
    //console.log(tileMap.empty.position + " "+ emptyPosition);
  }


  // Determina se o quadrado pode ser movido
  function tileMovable(tileNumber) {
    var selectedTile = tileMap[tileNumber];
    var emptyTile = tileMap.empty;
    var movableTiles = movementMap(emptyTile.position);

    if (movableTiles.includes(selectedTile.position)) {
      return true;
    } else {
      return false;
    }



  }

  // Verifica se todos os quadrados estão na posição certa
  function checkSolution() {
    if (tileMap.empty.position !== 9) return false;

    for (var key in tileMap) {
      if ((key != 1) && (key != "empty")) {
        if (tileMap[key].position < tileMap[key-1].position) return false;
      }
    }
    return true;
  }

  // Checa se o quadrado está no local certo
  function recolorTile(tile, tileId) {
    if (tileId == tileMap[tileId].position) {
      tile.classList.remove("error");
    } else {
      tile.classList.add("error");
    }
  }


  // Mistura os quadrados
  shuffleTimeouts = [];
  function shuffle() {
    document.getElementById("moves").innerHTML = "";
    var num = document.getElementById('shufflenum').value;
    var boardTiles = document.querySelectorAll('.tile');
    var shuffleDelay = 200;
    shuffleLoop();

    var shuffleCounter = 0;
    while (shuffleCounter < num-1) {
      shuffleDelay += 200;
      shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
      shuffleCounter++;
    }
    tileMapAux = tileMap;
  }

  var lastShuffled;

  function shuffleLoop() {
    var emptyPosition = tileMap.empty.position;
    var shuffleTiles = movementMap(emptyPosition);
    var tilePosition = shuffleTiles[Math.floor(Math.floor(Math.random()*shuffleTiles.length))];
    var locatedTile;
    for(var i = 1; i <= 8; i++) {
      if (tileMap[i].position == tilePosition) {
        var locatedTileNumber = tileMap[i].tileNumber;
        locatedTile = tiles[locatedTileNumber-1];
      }
    }
    if (lastShuffled != locatedTileNumber) {
      moveTile(locatedTile);
      lastShuffled = locatedTileNumber;
    } else {
      shuffleLoop();
    }

  }


  function clearTimers(timeoutArray) {
    for (var i = 0; i < timeoutArray.length; i++) {
      clearTimeout(timeoutArray[i]);
    }
  }

  // solveTimeouts = []
  // function solve() {
  //   clearTimers(shuffleTimeouts);


  //   repeater = history.length;

  //   for (var i = 0; i < repeater; i++) {
  //     console.log("started");
  //     console.log(tiles[history[repeater-i-1]-1]);
  //     solveTimeouts.push(setTimeout(moveTile, i*500, tiles[history.pop()-1], false));
  //   }
  // }

  //Faz a avaliação para a heuristica de nivel 1
  function he1score(){
    var score=0;
    for(i=1;i<=8;i++){
      if(tileMap[i].position != i)
        score++;
    }
    if(tileMap.empty.position != 9)
        score++;
    return score;
  }

  function he2score(moves){
    var j=1;
    var score;
    var score_final=Number.MAX_VALUE;
    for(var i=1;i<=8;i++){
      if(tileMovable(tileMap[i].tileNumber) && !wasVisited(moves, tileMap[i].tileNumber, tileMap[i].position)){
        aux = tileMap[i].position;
        tileMap[i].position = tileMap.empty.position;
        tileMap.empty.position = aux;
        score = he1score();
        if(score<=score_final)
          score_final = score;
        tileMap.empty.position = tileMap[i].position;
        tileMap[i].position = aux;
        j++;
      } 
    }
    return score_final;
  }

  //Faz a avaliação para a heuristica 3
  function he3score(){
    var score=0;
    var j;
    for(var i=1;i<=8;i++){
      for(j=1;j<=8;j++){
        if(tileMap[j].position == i){
          score+=Math.pow(i-tileMap[j].tileNumber,2);
          break;
        }
      }
      if(j>8){
        score+=Math.pow(i-9,2);
      }
    }
    for(j=1;j<=8;j++){
      if(tileMap[j].position == 9){
        score+=Math.pow(9-j,2);
        break;
      }
    }
    return score;
  }

  function scoreTemplate(){
    var score = {
      1:{
        score:Number.MAX_VALUE,
        pos:0
      },
      2:{
        score:Number.MAX_VALUE,
        pos:0
      },
      3:{
        score:Number.MAX_VALUE,
        pos:0,
      },
      4:{
        score:Number.MAX_VALUE,
        pos:0
      }};
      return score;
  }
  
  //verifica se um movimento já foi efetuado
  function wasVisited(hist,val,pos){
    for(var i=0;i<hist.length;i++){
      //console.log(hist[i].num);
      if(val==hist[i].num && hist[i].atu==pos && hist[i].prox == tileMap.empty.position){
        console.log("teste");
        return true;
      }
    }
    return false;
  }

  function moveIt(moves){
    console.log(tileMap);
    console.log(tileMapAux);
    tileMap = tileMapAux;
    console.log(tileMap);
    for(var i=0;i<moves.length;i++){
      console.log(moves[i]);
      var val = document.getElementById("move_hist").value;
      document.getElementById("move_hist").innerHTML = val + ""+moves[i] + " -> ";
    //setTimeout(moveTile,i*100,tiles[moves[i]-1],false);
    //moveTile(tiles[moves[i]-1],false);
  }
  }

  //faz os movimentos da heuristica de nivel 1
  function heuristica1(){
    clearTimeout
    console.log(tileMap);
    var emptyPosition;
    emptyPosition = tileMap.empty.position;
    var score = scoreTemplate();
    var aux;
    var runner = [];
    var highscore=Number.MAX_VALUE;
    var p=0;
    var move=0;
    var moves = [];
    var hist = {
      num:0,
      atu:0,
      prox:0
    };
    while (p<50) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(moves, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          tileMap.empty.position = aux;
          score[j].score = he1score();
          //console.log(score[j].score+" "+i);
          score[j].pos = tileMap[i].tileNumber;
          tileMap.empty.position = tileMap[i].position;
          tileMap[i].position = aux;
          j++;
        }
        
      }
      
      for(var i=1;i<=4;i++){
        if(score[i].score<=highscore && score[i].pos!=0){
          highscore = score[i].score;
          aux = score[i].pos;
        }
      }
        highscore = Number.MAX_VALUE;
        p++;
        console.log("ssss: "+aux);
        hist.num = tileMap[aux].tileNumber;
        hist.atu = tileMap[aux].position;
        hist.prox = emptyPosition;
        moves.push(hist);
        //console.log(moves);
        move = aux;
        runner.push(aux);
        //setTimeout(moveTile, p*100, tiles[aux-1], false);
        moveTile(tiles[aux-1], false);
         // tileMap.empty.position = tileMap[aux].position;
          //tileMap[aux].position = emptyPosition;
        score = scoreTemplate();
        emptyPosition = tileMap.empty.position;
    }
    console.log(p);
    //moveIt(runner);
    document.getElementById("moves").innerHTML = p;
  }

  function heuristica2(){
    clearTimeout
    console.log(tileMap);
    var emptyPosition;
    emptyPosition = tileMap.empty.position;
    var score = scoreTemplate();
    var aux;
    var highscore=Number.MAX_VALUE;
    var p=0;
    var move=0;
    var moves = [];
    var hist = {
      num:0,
      atu:0,
      prox:0
    };
    while (!checkSolution()) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(moves, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          tileMap.empty.position = aux;
          score[j].score = he2score(moves);
          //console.log(score[j].score);
          score[j].pos = tileMap[i].tileNumber;
          tileMap.empty.position = tileMap[i].position;
          tileMap[i].position = aux;
          j++;
        }
        
      }
      
      for(var i=1;i<=4;i++){
        if(score[i].score<=highscore && score[i].pos!=0){
          highscore = score[i].score;
          aux = score[i].pos;
        }
      }
        highscore = Number.MAX_VALUE;
        p++;
        //console.log("ssss: "+aux);
        hist.num = tileMap[aux].tileNumber;
        hist.atu = tileMap[aux].position;
        hist.prox = emptyPosition;
        moves.push(hist);
        move = aux;
        //setTimeout(moveTile, p*100, tiles[aux-1], false);
        moveTile(tiles[aux-1], false);
        score = scoreTemplate();
        emptyPosition = tileMap.empty.position;
    }
    console.log(p);
    document.getElementById("moves").innerHTML = p;
  }

  //faz os movimentos da heuristica 3
  function heuristica3(){
    var emptyPosition;
    emptyPosition = tileMap.empty.position;
    var score = scoreTemplate();
    var aux;
    var sonscore;
    var highscore=Number.MAX_VALUE;
    var p=0;
    var move=0;
    var moves = [];
    var hist = {
      num:0,
      atu:0,
      prox:0
    };
    while (!checkSolution()) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(moves, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          tileMap.empty.position = aux;
          sonscore = he1score() + he2score(move);//soma a menor do neto de menor pontuação com a pontuação do filho
          score[j].score = sonscore;
          score[j].pos = tileMap[i].tileNumber;
          tileMap.empty.position = tileMap[i].position;
          tileMap[i].position = aux;
          j++;
        }
        
      }
      
      for(var i=1;i<=4;i++){
        if(score[i].score<highscore && score[i].pos!=0){
          highscore = score[i].score;
          aux = score[i].pos;
        }
      }
        //console.log(highscore);
        highscore = Number.MAX_VALUE;
        p++;
        hist.num = tileMap[aux].tileNumber;
        hist.atu = tileMap[aux].position;
        hist.prox = emptyPosition;
        moves.push(hist);
        move = tileMap[aux].tileNumber;
       var locatedTileNumber = tileMap[aux].tileNumber;
        //locatedTile = tiles[locatedTileNumber-1];
        //setTimeout(moveTile, p*500, tiles[locatedTileNumber-1], false);
        moveTile(tiles[locatedTileNumber-1], false);
        score = scoreTemplate();
        emptyPosition = tileMap.empty.position;
        
        //console.log(tileMap);
    }
  }

  
  //faz os movimentos da busca aleatoria
  function buscaAleatoria(){
    clearTimers(shuffleTimeouts);
    var emptyPosition;
    emptyPosition = tileMap.empty.position;
    var score = scoreTemplate();
    var aux;
    var highscore=0;
    var p=0;
    var move=0;
    var moves = [];
    var hist = {
      num:0,
      atu:0,
      prox:0
    };
    while (!checkSolution()) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(moves, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          score[j].score = he1score();
          score[j].pos = tileMap[i].tileNumber;
          tileMap[i].position = aux;
          j++;
        }
        
      } 
       var s = Math.floor(Math.floor(Math.random()*(j)));
       if(s==0)
        s=1;
        aux = score[s].pos;
        p++;
        hist.num = tileMap[aux].tileNumber;
        hist.atu = tileMap[aux].position;
        hist.prox = emptyPosition;
        moves.push(hist);
        move = aux;
       var locatedTileNumber = tileMap[aux].tileNumber;
        //locatedTile = tiles[locatedTileNumber-1];
        //setTimeout(moveTile, p*100, tiles[locatedTileNumber-1], false);
        moveTile(tiles[locatedTileNumber-1], false);
        score = scoreTemplate();
        emptyPosition = tileMap.empty.position;
        //console.log(tileMap.empty.position);
        //console.log(tileMap);
    }
    document.getElementById("moves").innerHTML = p;
    console.log(p);
  }

}