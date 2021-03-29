

function playGame(i){
    console.log("working method");
}

//new board
var board = new Array(8);

for (var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
}

function playGame(e){
    i = parseInt(e/10);
    j = e%10;
    if(board[i][j] != "Empty"){
        highlight(i,j);
    }
}

function highlight(i,j){
    var highlight = document.getElementsByClassName("highlight");
    while (highlight.length)
    highlight[0].className = highlight[0].className.replace(/\bhighlight\b/g, "");

    var pDoc = document.getElementById(""+i+j+"");
    var parentDiv = pDoc.parentElement
    parentDiv.classList.add("highlight");
}

//holds the pieces for white and black
var bPieces = ["BRook", "BKnight", "BBishop", "BQueen", "BKing", "BBishop", "BKnight", "BRook"];
var wPieces = ["WRook", "WKnight", "WBishop", "WQueen", "WKing", "WBishop", "WKnight", "WRook"];

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

function loadGame(){
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
        }
    }
}

function newGame(){
    resetBoard();
    loadGame();
    playGame(32);
}