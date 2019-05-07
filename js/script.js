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
  //document.querySelector('#solve2').addEventListener('click', heuristica2 , true);
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
    recolorTile(tile, tileId);
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

    recolorTile(tile, tileNumber);
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
      clearTimeout(timeoutArray[i])
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
      if(tileMap[i].tileNumber == tileMapFinal[i].position)
        score++;
    }
    return score;
  }

  //Faz a avaliação para a heuristica de nivel 3
  function he3score(){
    var score=0;
    for(i=1;i<=8;i++){
        score+=Math.pow(tileMapFinal[i].position-tileMap[i].tileNumber,2);
    }
    return score;
  }

  function scoreTemplate(){
    var score = {
      1:{
        score:0,
        pos:0
      },
      2:{
        score:0,
        pos:0
      },
      3:{
        score:0,
        pos:0,
      },
      4:{
        score:0,
        pos:0
      }};
      return score;
  }
  
  //verifica se um movimento já foi efetuado
  function wasVisited(hist,val,pos){
    for(var i;i<=hist.length;i++){
      if(val==hist[i].num && hist[i].atu==pos && hist[i].prox == tileMap.empty.position)
        return true;
      else return false;
    }
  }

  //faz os movimentos da heuristica de nivel 1
  function heuristica1(){
    console.log(tileMap);
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
    while (p<7) {
      var j=1;
      for(var i=1;i<=8;i++){
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(hist, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          score[j].score = he1score();
          score[j].pos = tileMap[i].tileNumber;
          tileMap[i].position = aux;
          j++;
        }
        
      }
      
      for(var i=1;i<=4;i++){
        if(score[i].score>=highscore){
          highscore = score[i].score;
          aux = score[i].pos;
        }
      }
        highscore = 0;
        p++;
        //console.log(move);
        hist.num = tileMap[aux].tileNumber;
        hist.atu = aux;
        hist.prox = emptyPosition;
        moves.push(hist);
        move = aux;
       var locatedTileNumber = tileMap[aux].tileNumber;
        //locatedTile = tiles[locatedTileNumber-1];
        //setTimeout(moveTile, p*500, tiles[locatedTileNumber-1], false);
        moveTile(tiles[locatedTileNumber-1], false);
        score = scoreTemplate();
        emptyPosition = tileMap.empty.position;
        
        //console.log(tileMap);
    }
    console.log(p);
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
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(hist, tileMap[i].tileNumber, tileMap[i].position)){
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
        hist.atu = aux;
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

  //faz os movimentos da heuristica de nivel 3
  function heuristica3(){
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
        if(tileMovable(tileMap[i].tileNumber) && move != tileMap[i].tileNumber && !wasVisited(hist, tileMap[i].tileNumber, tileMap[i].position)){
          aux = tileMap[i].position;
          tileMap[i].position = emptyPosition;
          score[j].score = he3score();
          score[j].pos = tileMap[i].tileNumber;
          tileMap[i].position = aux;
          j++;
        }
        
      }
      
      for(var i=1;i<=4;i++){
        if(score[i].score<highscore && score[i].score!=0){
          highscore = score[i].score;
          aux = score[i].pos;
        }
      }
        //console.log(highscore);
        highscore = Number.MAX_VALUE;
        p++;
        hist.num = tileMap[aux].tileNumber;
        hist.atu = aux;
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



}