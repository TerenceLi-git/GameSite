//new board
var board = new Array(8);

//holds the pieces for white and black
var bPieces = ["BRook", "BKnight", "BBishop", "BQueen", "BKing", "BBishop", "BKnight", "BRook"];
var wPieces = ["WRook", "WKnight", "WBishop", "WQueen", "WKing", "WBishop", "WKnight", "WRook"];

for (var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
}

var possibleMoves = [];
var move = false;
var oldi, oldj;
var turn = "White";

//new game
function newGame(){
    checkUser();
    alert("Starting a new chess game.");
    resetBoard();
    reload();
    turn = "White";
    updateTurn();
}

async function checkUser(){
    var idVal = sessionStorage.getItem("POSSID");
    if(idVal == null)
    {
        document.getElementById("loggedInHolder").innerHTML = "You are not logged in, this game won't be saved.";
        document.getElementById("LoginButton").innerHTML = "Log in";
    }else{
        document.getElementById("LoginButton").innerHTML = "Log out";
        document.getElementById('LoginButton').setAttribute( "onClick", "logout();" );

        data = {
            id : idVal
        }
        let response = await fetch('/../../getInfo', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
        })
        let text = await response.text();
        let jsonFormat = JSON.parse(text);

        document.getElementById("loggedInHolder").innerHTML = "Hello, " + jsonFormat.firstName + "&nbsp" + jsonFormat.lastName;
    }
}

async function saveGame(){
    var idVal = sessionStorage.getItem("POSSID");
    if(idVal == null)
    {
        alert("Please login to save your game.");
    }else{
        data = {
            id : idVal,
            chessBoard : board,
            turn : turn 
        }
        let response = await fetch('/../../saveChess', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
        })
        let text = await response.text();
        console.log(text);

        alert("Game is saved.");
    }
}

async function loadGame(){
    var idVal = sessionStorage.getItem("POSSID");
    if(idVal == null)
    {
        alert("Please login to load your saved game.");
    }else{
        data = {
            id : idVal,
        }
        let response = await fetch('/../../getChess', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
        })

        let text = await response.text();
        let jsonFormat = JSON.parse(text);

        board = jsonFormat.chessBoard;
        turn = jsonFormat.turn;

        document.getElementById("turnHolder").innerHTML = "Turn: " + jsonFormat.turn;

        console.log(board);
        reload();

        alert("Game has loaded.");
    }
}

function resetBoard(){
    for(var j = 0; j < board.length; j++){
        board[0][j] = bPieces[j];
        board[1][j] = "BPawn";
        board[2][j] = "Empty";
        board[3][j] = "Empty";
        board[4][j] = "Empty";
        board[5][j] = "Empty";
        board[6][j] = "WPawn";
        board[7][j] = wPieces[j];
    }
}

//reloads the board with updated data
function reload(){
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++)
        {
            if(board[i][j] == "WRook"){
                document.getElementById(""+i+j+"").src = "../Images/wR.png";
            }
            if(board[i][j] == "BRook"){
                document.getElementById(""+i+j+"").src = "../Images/bR.png";
            }
            if(board[i][j] == "WKnight"){
                document.getElementById(""+i+j+"").src = "../Images/wN.png";
            }
            if(board[i][j] == "BKnight"){
                document.getElementById(""+i+j+"").src = "../Images/bN.png";
            }
            if(board[i][j] == "WBishop"){
                document.getElementById(""+i+j+"").src = "../Images/wB.png";
            }
            if(board[i][j] == "BBishop"){
                document.getElementById(""+i+j+"").src = "../Images/bB.png";
            }
            if(board[i][j] == "WQueen"){
                document.getElementById(""+i+j+"").src = "../Images/wQ.png";
            }
            if(board[i][j] == "BQueen"){
                document.getElementById(""+i+j+"").src = "../Images/bQ.png";
            }
            if(board[i][j] == "WKing"){
                document.getElementById(""+i+j+"").src = "../Images/wK.png";
            }
            if(board[i][j] == "BKing"){
                document.getElementById(""+i+j+"").src = "../Images/bK.png";
            }
            if(board[i][j] == "WPawn"){
                document.getElementById(""+i+j+"").src = "../Images/wP.png";
            }
            if(board[i][j] == "BPawn"){
                document.getElementById(""+i+j+"").src = "../Images/bP.png";
            }
            if(board[i][j] == "Empty"){
                document.getElementById(""+i+j+"").src = "";
            }
        }
    }
}

//removes all highlighted squares
function removeAllHighlights(){
    var highlight = document.getElementsByClassName("highlight");
    while (highlight.length)
        highlight[0].className = highlight[0].className.replace(/\bhighlight\b/g, "");
    var highlightPiece = document.getElementsByClassName("highlightPiece");
    while (highlightPiece.length)
        highlightPiece[0].className = highlightPiece[0].className.replace(/\highlightPiece\b/g, "");
}

//highlights the piece at i, j and removes all other highlighted pieces
function highlightOnly(i,j){
    //removes all highlighted squares
    removeAllHighlights()
    //gets the square and highlights it
    var pDoc = document.getElementById(""+i+j+"");
    var parentDiv = pDoc.parentElement
    parentDiv.classList.add("highlightPiece");
    move = true;
    oldi = i;
    oldj = j;
}

//highlights the square at i, j
function highlightOne(i,j){
    //gets the square and highlights it
    var pDoc = document.getElementById(""+i+j+"");
    var parentDiv = pDoc.parentElement
    parentDiv.classList.add("highlight");
}

//highlights a piece at i, j
function highlightPiece(i,j){
        //gets the piece and highlights it
        var pDoc = document.getElementById(""+i+j+"");
        var parentDiv = pDoc.parentElement
        parentDiv.classList.add("highlightPiece");
}

//gets called whenever a piece is clicked
function playGame(e){
    i = parseInt(e/10);
    j = e%10;
    var currPiece, pieceClicked;
    if(board[i][j] != "Empty"){
        currPiece = board[i][j];
        if(currPiece.substring(0,1) == "W"){
            pieceClicked = "WhitePiece";
        }else{
            pieceClicked = "BlackPiece";
        }
    }

    if(pieceClicked == "WhitePiece" && turn == "White" || pieceClicked == "BlackPiece" && turn == "Black" || board[i][j] == "Empty" || move == true){
        if(move == true){
            var moveArea = i + "," + j;
            if(possibleMoves.includes(moveArea)){
                if(board[i][j] == "BKing" && turn == "White"){
                    gameOver();
                }
                if(board[i][j] == "WKing" && turn == "Black"){
                    gameOver();
                }
                movePiece(oldi, oldj, i, j);
                move = false;
                pieceClicked = "";
                if(turn == "White"){
                    turn = "Black";
                }else{
                    turn = "White";
                }
                updateTurn();
            }else{
                removeAllHighlights();
                move = false;
            }
        }else{
            if(board[i][j] != "Empty"){
                currPiece = board[i][j];
                highlightOnly(i,j);
                if(currPiece == "BRook" && turn == "Black" || currPiece == "WRook" && turn == "White"){
                    showRookMoves(i, j);
                }
                if(currPiece == "BPawn" && turn == "Black" || currPiece == "WPawn" && turn == "White"){
                    showPawnMoves(i, j);
                }
                if(currPiece == "BKnight" && turn == "Black" || currPiece == "WKnight" && turn == "White"){
                    showKnightMoves(i, j);
                }
                if(currPiece == "BBishop" && turn == "Black" || currPiece == "WBishop" && turn == "White"){
                    showBishopMoves(i, j);
                }
                if(currPiece == "BKing" && turn == "Black" || currPiece == "WKing" && turn == "White"){
                    showKingMoves(i, j);
                }
                if(currPiece == "BQueen" && turn == "Black" || currPiece == "WQueen" && turn == "White"){
                    showQueenMoves(i, j);
                }
            }
        }
    }else{
        console.log("Error: Not your piece.");
    }
}

//updates html and shows whose turn it is
function updateTurn(){
    if(turn == "White"){
        document.getElementById("turnHolder").innerHTML = "Turn: White";
    }else{
        document.getElementById("turnHolder").innerHTML = "Turn: Black";
    }
}

//alert games over and returns to home page
function gameOver(){
    alert("Games over");
    window.location.replace('/../../');
}

//combines both Bishops and Rooks Moves 
function showQueenMoves(i,j){
    possibleMoves = [];
    var color = "";
    console.log("Piece Clicked: " + board[i][j]);
    var row, col;
    row = i + 1;
    col = j + 1;
    while(row < 8 && col < 8){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row++;
        col++;
    }
    row = i - 1;
    col = j - 1;
    while(row >= 0 && col >= 0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row--;
        col--;
    }
    row = i - 1;
    col = j + 1;
    while(row >= 0 && col < 8){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row--;
        col++;
    }
    row = i + 1;
    col = j - 1;
    while(row < 8 && col >= 0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row++;
        col--;
    }
    var color = "";
    console.log("Piece Clicked: " + board[i][j]);
    if(board[i][j] == "BQueen"){
        color = "Black";
    }else{
        color = "White";
    }
    //going down colum j
    for(var row = i + 1; row < 8; row++){
        //checks if row is at the end otherwise outofbound error
        if(row < 8){
            //checks if there is a piece in the way.
            if(board[row][j] != "Empty"){
                if((board[row][j].substring(0, 1) == "W" && color == "Black") || (board[row][j].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(row, j);
                    possibleMoves.push(row + "," + j);
                }
                break;
            }else{
                highlightOne(row, j);
                possibleMoves.push(row + "," + j);
            }
        }
    }
    //going up the column j
    for(var row = i - 1; row >= 0; row--){
        if(row >= 0){
            if(board[row][j] != "Empty"){
                if((board[row][j].substring(0, 1) == "W" && color == "Black") || (board[row][j].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(row, j);
                    possibleMoves.push(row + "," + j);
                }
                break;
            }else{
                highlightOne(row, j);
                possibleMoves.push(row + "," + j);
            }
        }
    }

    //going to the right of row i
    for(var col = j + 1; col < 8; col++){
        if(col < 8){
            if(board[i][col] != "Empty"){
                if((board[i][col].substring(0, 1) == "W" && color == "Black") || (board[i][col].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(i, col);
                    possibleMoves.push(i + "," + col);
                }
                break;
            }else{
                highlightOne(i, col);
                possibleMoves.push(i + "," + col);
            }
        }
    }

    //going to the left of row i
    for(var col = j - 1; col >= 0; col--){
        if(col >= 0){
            if(board[i][col] != "Empty"){
                if((board[i][col].substring(0, 1) == "W" && color == "Black") || (board[i][col].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(i, col);
                    possibleMoves.push(i + "," + col);
                }
                break;
            }else{
                highlightOne(i, col);
                possibleMoves.push(i + "," + col);
            }
        }
    }
}

function showKingMoves(i,j){
    possibleMoves = [];
    var color = "";
    console.log("Piece Clicked: " + board[i][j]);
    var row, col;

    row = i;
    col = j;
    
    row++;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    col++;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    row--;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    row--;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    col--;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    col--;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    row++;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }

    row++;
    if(row < 8 && row >= 0 && col < 8 && col >=0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
    }
}

function showBishopMoves(i,j){
    possibleMoves = [];
    var color = "";
    console.log("Piece Clicked: " + board[i][j]);
    var row, col;
    row = i + 1;
    col = j + 1;
    while(row < 8 && col < 8){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row++;
        col++;
    }
    row = i - 1;
    col = j - 1;
    while(row >= 0 && col >= 0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row--;
        col--;
    }
    row = i - 1;
    col = j + 1;
    while(row >= 0 && col < 8){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row--;
        col++;
    }
    row = i + 1;
    col = j - 1;
    while(row < 8 && col >= 0){
        if(board[row][col] != "Empty"){
            if((board[row][col].substring(0, 1) == "W" && turn == "Black") || (board[row][col].substring(0, 1) == "B" && turn == "White")){
                highlightPiece(row, col);
                possibleMoves.push(row + "," + col);
            }
            break;
        }else{
            highlightOne(row, col);
            possibleMoves.push(row + "," + col);
        }
        row++;
        col--;
    }
}

function showKnightMoves(i,j){
    possibleMoves = [];
    var color = "";
    var row, col, leftcol, rightcol, rowAbove, rowBelow;
    console.log("Piece Clicked: " + board[i][j]);
    if(board[i][j] == "BKnight"){
        color = "Black";
    }else{
        color = "White";
    }

    row = i;
    col = j;

    //Checking 
    rowBelow = row + 1;
    leftcol = col - 2;

    if(rowBelow < 8 && leftcol >= 0) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row - 1;
    leftcol = col - 2;

    if(rowBelow >= 0 && leftcol >= 0) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row + 1;
    leftcol = col + 2;

    if(rowBelow < 8 && leftcol < 8) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row - 1;
    leftcol = col + 2;

    if(rowBelow >= 0 && leftcol < 8) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row + 2;
    leftcol = col - 1;

    if(rowBelow < 8 && leftcol >= 0) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row - 2;
    leftcol = col - 1;

    if(rowBelow >= 0 && leftcol >= 0) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row + 2;
    leftcol = col + 1;

    if(rowBelow < 8 && leftcol < 8) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }

    rowBelow = row - 2;
    leftcol = col + 1;

    if(rowBelow >= 0 && leftcol < 8) {
        console.log(board[rowBelow][leftcol]);
        if(board[rowBelow][leftcol] != "Empty"){
            if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                highlightPiece(rowBelow, leftcol);
                possibleMoves.push(rowBelow + "," + leftcol);
            }
        }else{
            highlightOne(rowBelow, leftcol);
            possibleMoves.push(rowBelow + "," + leftcol);
        }
    }
}

function showPawnMoves(i,j){
    possibleMoves = [];
    var color = "";
    var row, col, leftcol, rightcol, rowAbove, rowBelow;
    console.log("Piece Clicked: " + board[i][j]);
    if(board[i][j] == "BPawn"){
        color = "Black";
    }else{
        color = "White";
    }
    //shows all possible moves for white pawn moving up
    if(turn == "White" && color == "White"){
        row = i;
        col = j;
        // console.log("i: " + i + ", j: " + j);
        if(row == 6){
            leftcol = col - 1;
            rightcol = col + 1;
            if(rightcol < 8){
                rowAbove = row - 1;
                if(board[rowAbove][rightcol] != "Empty"){
                    if((board[rowAbove][rightcol].substring(0, 1) == "W" && color == "Black") || (board[rowAbove][rightcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowAbove, rightcol);
                        possibleMoves.push(rowAbove + "," + rightcol);
                    }
                }
            }
            if(leftcol >= 0){
                rowAbove = row - 1;
                if(board[rowAbove][leftcol] != "Empty"){
                    if((board[rowAbove][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowAbove][leftcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowAbove, leftcol);
                        possibleMoves.push(rowAbove + "," + leftcol);
                    }
                }
            }
            rowAbove = row - 1;
            if(board[rowAbove][col] == "Empty"){
                possibleMoves.push(rowAbove + "," + col);
                highlightOne(rowAbove, col);
            }
            rowAbove--;
            if(board[rowAbove][col] == "Empty"){
                possibleMoves.push(rowAbove + "," + col);
                highlightOne(rowAbove, col);
            }
        }else if(row != 0){
            leftcol = col - 1;
            rightcol = col + 1;
            if(rightcol < 8){
                rowAbove = row - 1;
                if(board[rowAbove][rightcol] != "Empty"){
                    if((board[rowAbove][rightcol].substring(0, 1) == "W" && color == "Black") || (board[rowAbove][rightcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowAbove, rightcol);
                        possibleMoves.push(rowAbove + "," + rightcol);
                    }
                }
            }
            if(leftcol >= 0){
                rowAbove = row - 1;
                if(board[rowAbove][leftcol] != "Empty"){
                    if((board[rowAbove][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowAbove][leftcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowAbove, leftcol);
                        possibleMoves.push(rowAbove + "," + leftcol);
                    }
                }
            }
            rowAbove = row - 1;
            if(board[rowAbove][col] == "Empty"){
                possibleMoves.push(rowAbove + "," + col);
                highlightOne(rowAbove, col);
            }
        }
    }

    //shows all possible moves for black pawn moving down
    if(turn == "Black" && color == "Black"){
        row = i;
        col = j;
        // console.log("i: " + i + ", j: " + j);
        if(row == 1){
            leftcol = col - 1;
            rightcol = col + 1;
            if(rightcol < 8){
                rowBelow = row + 1;
                if(board[rowBelow][rightcol] != "Empty"){
                    if((board[rowBelow][rightcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][rightcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowBelow, rightcol);
                        possibleMoves.push(rowBelow + "," + rightcol);
                    }
                }
            }
            if(leftcol >= 0){
                rowBelow = row + 1;
                if(board[rowBelow][leftcol] != "Empty"){
                    if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowBelow, leftcol);
                        possibleMoves.push(rowBelow + "," + leftcol);
                    }
                }
            }
            rowBelow = row + 1;
            if(board[rowBelow][col] == "Empty"){
                possibleMoves.push(rowBelow + "," + col);
                highlightOne(rowBelow, col);
            }
            rowBelow++;
            if(board[rowBelow][col] == "Empty"){
                possibleMoves.push(rowBelow + "," + col);
                highlightOne(rowBelow, col);
            }
        }else if(row != 0){
            leftcol = col - 1;
            rightcol = col + 1;
            if(rightcol < 8){
                rowBelow = row + 1;
                if(board[rowBelow][rightcol] != "Empty"){
                    if((board[rowBelow][rightcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][rightcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowBelow, rightcol);
                        possibleMoves.push(rowBelow + "," + rightcol);
                    }
                }
            }
            if(leftcol >= 0){
                rowBelow = row + 1;
                if(board[rowBelow][leftcol] != "Empty"){
                    if((board[rowBelow][leftcol].substring(0, 1) == "W" && color == "Black") || (board[rowBelow][leftcol].substring(0, 1) == "B" && color == "White")){
                        highlightPiece(rowBelow, leftcol);
                        possibleMoves.push(rowBelow + "," + leftcol);
                    }
                }
            }
            rowBelow = row + 1;
            if(board[rowBelow][col] == "Empty"){
                possibleMoves.push(rowBelow + "," + col);
                highlightOne(rowBelow, col);
            }
        }
    }
}

function showRookMoves(i,j){
    possibleMoves = [];
    var color = "";
    console.log("Piece Clicked: " + board[i][j]);
    if(board[i][j] == "BRook"){
        color = "Black";
    }else{
        color = "White";
    }
    //going down colum j
    for(var row = i + 1; row < 8; row++){
        //checks if row is at the end otherwise outofbound error
        if(row < 8){
            //checks if there is a piece in the way.
            if(board[row][j] != "Empty"){
                if((board[row][j].substring(0, 1) == "W" && color == "Black") || (board[row][j].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(row, j);
                    possibleMoves.push(row + "," + j);
                }
                break;
            }else{
                highlightOne(row, j);
                possibleMoves.push(row + "," + j);
            }
        }
    }
    //going up the column j
    for(var row = i - 1; row >= 0; row--){
        if(row >= 0){
            if(board[row][j] != "Empty"){
                if((board[row][j].substring(0, 1) == "W" && color == "Black") || (board[row][j].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(row, j);
                    possibleMoves.push(row + "," + j);
                }
                break;
            }else{
                highlightOne(row, j);
                possibleMoves.push(row + "," + j);
            }
        }
    }

    //going to the right of row i
    for(var col = j + 1; col < 8; col++){
        if(col < 8){
            if(board[i][col] != "Empty"){
                if((board[i][col].substring(0, 1) == "W" && color == "Black") || (board[i][col].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(i, col);
                    possibleMoves.push(i + "," + col);
                }
                break;
            }else{
                highlightOne(i, col);
                possibleMoves.push(i + "," + col);
            }
        }
    }

    //going to the left of row i
    for(var col = j - 1; col >= 0; col--){
        if(col >= 0){
            if(board[i][col] != "Empty"){
                if((board[i][col].substring(0, 1) == "W" && color == "Black") || (board[i][col].substring(0, 1) == "B" && color == "White")){
                    highlightPiece(i, col);
                    possibleMoves.push(i + "," + col);
                }
                break;
            }else{
                highlightOne(i, col);
                possibleMoves.push(i + "," + col);
            }
        }
    }
}

//moves the piece in the data and then reloads the board for user to see.
function movePiece(oldi, oldj, newi, newj){
    board[newi][newj] = board[oldi][oldj];
    removeAllHighlights();
    board[oldi][oldj] = "Empty";
    reload();
}
