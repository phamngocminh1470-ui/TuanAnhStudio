import React, { useState, useEffect } from 'react';
import { 
  Trophy, RotateCcw, HelpCircle, CheckCircle2, XCircle, Sparkles, 
  HelpCircle as QuestionIcon, Loader2, ArrowRight, ShieldCheck, Play, Award
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// Unicode symbols for chess pieces
const PIECE_SYMBOLS = {
  w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
  b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
};

// Initial board setup
const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Black Major Pieces
  board[0] = [
    { type: 'r', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'q', color: 'b' },
    { type: 'k', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'r', color: 'b' }
  ];
  
  // Black Pawns
  for (let c = 0; c < 8; c++) {
    board[1][c] = { type: 'p', color: 'b' };
  }

  // White Pawns
  for (let c = 0; c < 8; c++) {
    board[6][c] = { type: 'p', color: 'w' };
  }

  // White Major Pieces
  board[7] = [
    { type: 'r', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'k', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'r', color: 'w' }
  ];

  return board;
};

// Helper check path clean (rook, bishop, queen)
const isPathClear = (r1, c1, r2, c2, board) => {
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  let r = r1 + dr;
  let c = c1 + dc;
  while (r !== r2 || c !== c2) {
    if (board[r][c] !== null) return false;
    r += dr;
    c += dc;
  }
  return true;
};

// Simple Chess Rule Validation
const isValidChessMove = (r1, c1, r2, c2, piece, board) => {
  if (r1 === r2 && c1 === c2) return false;
  
  const target = board[r2][c2];
  if (target && target.color === piece.color) return false; // Cannot capture own piece

  const diffR = Math.abs(r2 - r1);
  const diffC = Math.abs(c2 - c1);

  switch (piece.type) {
    case 'p': // Pawn
      if (piece.color === 'w') {
        // Forward moves
        if (c1 === c2 && target === null) {
          if (r1 - r2 === 1) return true;
          if (r1 === 6 && r1 - r2 === 2 && board[5][c1] === null) return true;
        }
        // Diagonal capture
        if (r1 - r2 === 1 && diffC === 1 && target !== null && target.color === 'b') {
          return true;
        }
      } else {
        // Black Pawn
        if (c1 === c2 && target === null) {
          if (r2 - r1 === 1) return true;
          if (r1 === 1 && r2 - r1 === 2 && board[2][c1] === null) return true;
        }
        if (r2 - r1 === 1 && diffC === 1 && target !== null && target.color === 'w') {
          return true;
        }
      }
      return false;

    case 'r': // Rook
      if (r1 === r2 || c1 === c2) {
        return isPathClear(r1, c1, r2, c2, board);
      }
      return false;

    case 'n': // Knight
      return (diffR === 2 && diffC === 1) || (diffR === 1 && diffC === 2);

    case 'b': // Bishop
      if (diffR === diffC) {
        return isPathClear(r1, c1, r2, c2, board);
      }
      return false;

    case 'q': // Queen (Rook + Bishop)
      if (r1 === r2 || c1 === c2 || diffR === diffC) {
        return isPathClear(r1, c1, r2, c2, board);
      }
      return false;

    case 'k': // King
      return diffR <= 1 && diffC <= 1;

    default:
      return false;
  }
};

export default function EnglishChess({ selectedGrade = '10' }) {
  const [board, setBoard] = useState(createInitialBoard());
  const [selectedCell, setSelectedCell] = useState(null); // { r, c }
  const [gameState, setGameState] = useState('play'); // 'play', 'quiz', 'bot_thinking', 'win', 'lose'

  // Quiz States
  const [pendingMove, setPendingMove] = useState(null); // { from: {r, c}, to: {r, c} }
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  // Score stats
  const [score, setScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  // Restart Game
  const handleResetGame = () => {
    setBoard(createInitialBoard());
    setSelectedCell(null);
    setGameState('play');
    setPendingMove(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowAnswerResult(false);
    setScore(0);
    setMoveCount(0);
  };

  // Fetch dynamic IRT question
  const fetchEnglishQuestion = async () => {
    setLoadingQuestion(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowAnswerResult(false);

    try {
      const savedGemini = localStorage.getItem('api_gemini') || '';
      const savedTheta = parseFloat(localStorage.getItem('user_theta')) || 0.406;
      const res = await axios.post(
        `${API_BASE}/adaptive/generate-question`,
        {
          grade: selectedGrade,
          theta: savedTheta
        },
        {
          headers: savedGemini ? { 'X-Gemini-Key': savedGemini } : {}
        }
      );

      if (res.data && res.data.question) {
        setCurrentQuestion(res.data.question);
      }
    } catch (e) {
      console.error('Lỗi khi tải câu hỏi tiếng Anh:', e);
      // Fallback local mockup question
      setCurrentQuestion({
        question: "Select the word that is OPPOSITE in meaning to 'generous':",
        options: ["A. selfish", "B. kind", "C. helpful", "D. smart"],
        correct: "A",
        explanation: "Đối nghĩa với 'generous' (hào phóng) là 'selfish' (ích kỷ)."
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Click handler on board cell
  const handleCellClick = (r, c) => {
    if (gameState !== 'play') return;

    const cell = board[r][c];

    // If already selected, check if making a move
    if (selectedCell) {
      // If clicking own piece again, just change selection
      if (cell && cell.color === 'w') {
        setSelectedCell({ r, c });
        return;
      }

      // Try making a move
      const piece = board[selectedCell.r][selectedCell.c];
      if (isValidChessMove(selectedCell.r, selectedCell.c, r, c, piece, board)) {
        // Legal move selected! Trigger the English question first!
        setPendingMove({ from: { r: selectedCell.r, c: selectedCell.c }, to: { r, c } });
        setGameState('quiz');
        fetchEnglishQuestion();
      } else {
        // Invalid move, clear selection
        setSelectedCell(null);
      }
    } else {
      // Select White piece
      if (cell && cell.color === 'w') {
        setSelectedCell({ r, c });
      }
    }
  };

  // Submit Answer
  const handleAnswerSubmit = (option) => {
    if (showAnswerResult) return;
    setSelectedAnswer(option);
    setShowAnswerResult(true);
  };

  // Continue Move after answering
  const handleContinueMove = () => {
    if (!pendingMove || !currentQuestion) return;

    const isCorrect = selectedAnswer && selectedAnswer.startsWith(currentQuestion.correct);

    if (isCorrect) {
      // Execute Player Move
      const newBoard = board.map(row => [...row]);
      const piece = newBoard[pendingMove.from.r][pendingMove.from.c];
      
      // Check if King captured
      const target = newBoard[pendingMove.to.r][pendingMove.to.c];
      if (target && target.type === 'k') {
        setGameState('win');
        newBoard[pendingMove.to.r][pendingMove.to.c] = piece;
        newBoard[pendingMove.from.r][pendingMove.from.c] = null;
        setBoard(newBoard);
        return;
      }

      newBoard[pendingMove.to.r][pendingMove.to.c] = piece;
      newBoard[pendingMove.from.r][pendingMove.from.c] = null;
      setBoard(newBoard);
      
      // Update statistics
      setScore(prev => prev + 10);
      setMoveCount(prev => prev + 1);

      // AI Counterattack turn
      setGameState('bot_thinking');
      setTimeout(() => {
        makeBotMove(newBoard);
      }, 1000);

    } else {
      // Incorrect answer, move cancelled
      setGameState('play');
      setSelectedCell(null);
      setPendingMove(null);
    }
  };

  // AI Chess Opponent logic (Greedy Capture / Simple AI)
  const makeBotMove = (currentBoard) => {
    const legalMoves = [];

    // 1. Gather all legal moves for Black ('b')
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece && piece.color === 'b') {
          // Check all possible target coordinates
          for (let tr = 0; tr < 8; tr++) {
            for (let tc = 0; tc < 8; tc++) {
              if (isValidChessMove(r, c, tr, tc, piece, currentBoard)) {
                // Assign move weight/score
                const target = currentBoard[tr][tc];
                let weight = 0;
                if (target) {
                  if (target.type === 'p') weight = 10;
                  else if (target.type === 'n' || target.type === 'b') weight = 30;
                  else if (target.type === 'r') weight = 50;
                  else if (target.type === 'q') weight = 90;
                  else if (target.type === 'k') weight = 9999;
                }
                legalMoves.push({
                  from: { r, c },
                  to: { r: tr, c: tc },
                  weight: weight + (7 - r) * 0.1 // Encourages advancing forward
                });
              }
            }
          }
        }
      }
    }

    if (legalMoves.length === 0) {
      setGameState('win');
      return;
    }

    // Sort moves by weight
    legalMoves.sort((a, b) => b.weight - a.weight);

    // Take best move
    const bestMove = legalMoves[0];
    const newBoard = currentBoard.map(row => [...row]);
    const botPiece = newBoard[bestMove.from.r][bestMove.from.c];
    const targetPiece = newBoard[bestMove.to.r][bestMove.to.c];

    if (targetPiece && targetPiece.type === 'k') {
      setGameState('lose');
      newBoard[bestMove.to.r][bestMove.to.c] = botPiece;
      newBoard[bestMove.from.r][bestMove.from.c] = null;
      setBoard(newBoard);
      return;
    }

    newBoard[bestMove.to.r][bestMove.to.c] = botPiece;
    newBoard[bestMove.from.r][bestMove.from.c] = null;
    setBoard(newBoard);

    // Turn back to player
    setGameState('play');
    setSelectedCell(null);
    setPendingMove(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-indigo-400" />
              <span>DỰ ÁN KHKT • AI ENGLISH CHESS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit leading-relaxed">
              Cờ Vua Tiếng Anh Thích Ứng AI
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              Nền tảng edutainment kết hợp chơi cờ vua với AI. Mỗi nước đi của bạn chỉ được chấp nhận khi **giải đúng 1 câu hỏi ngữ pháp/từ vựng** theo cấp độ.
            </p>
          </div>

          <button
            onClick={handleResetGame}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi ván mới</span>
          </button>
        </div>

        {/* Status statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center text-xs">
          <div>
            <span className="text-slate-400 block">Số điểm học tập:</span>
            <strong className="text-indigo-400 text-base font-extrabold">+{score} EXP</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Số nước đi cờ:</span>
            <strong className="text-amber-400 text-base font-extrabold">{moveCount} nước</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Độ khó câu hỏi:</span>
            <strong className="text-emerald-400 text-base font-extrabold">Lớp {selectedGrade}</strong>
          </div>
        </div>
      </div>

      {/* Main Chess Board Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE CHESS BOARD (7 cols) */}
        <div className="md:col-span-7 flex justify-center">
          <div className="p-4 rounded-3xl bg-[#090e22] border border-slate-800 shadow-2xl w-full max-w-[500px]">
            {/* Column labels (a-h) */}
            <div className="grid grid-cols-8 text-center text-[10px] text-slate-500 font-bold mb-1">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(l => <span key={l}>{l}</span>)}
            </div>

            {/* The 8x8 Board */}
            <div className="grid grid-rows-8 gap-0.5 border border-slate-900 rounded-lg overflow-hidden bg-slate-950">
              {board.map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-8 h-[55px] sm:h-[60px]">
                  {row.map((cell, cIdx) => {
                    const isDark = (rIdx + cIdx) % 2 === 1;
                    const isSelected = selectedCell && selectedCell.r === rIdx && selectedCell.c === cIdx;
                    
                    // Highlight legal squares if piece is selected
                    let isHighlighted = false;
                    if (selectedCell) {
                      const selectedPiece = board[selectedCell.r][selectedCell.c];
                      isHighlighted = isValidChessMove(selectedCell.r, selectedCell.c, rIdx, cIdx, selectedPiece, board);
                    }

                    return (
                      <div
                        key={cIdx}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        className={`relative flex items-center justify-center text-3xl font-extrabold cursor-pointer transition select-none ${
                          isSelected 
                            ? 'bg-indigo-600/40 ring-4 ring-indigo-500 z-10' 
                            : isHighlighted 
                              ? 'bg-emerald-500/20 hover:bg-emerald-500/30' 
                              : isDark 
                                ? 'bg-slate-800/80 hover:bg-slate-800' 
                                : 'bg-slate-900 hover:bg-slate-900/80'
                        }`}
                      >
                        {/* Render chess piece symbol */}
                        {cell && (
                          <span className={`transform active:scale-90 transition-transform ${
                            cell.color === 'w' 
                              ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' 
                              : 'text-rose-500'
                          }`}>
                            {PIECE_SYMBOLS[cell.color][cell.type]}
                          </span>
                        )}

                        {/* Dot indicator for moves */}
                        {isHighlighted && !cell && (
                          <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUIZ CONTROL CARD / GAME STATES (5 cols) */}
        <div className="md:col-span-5">
          {/* STATE PLAY: Ready to move */}
          {gameState === 'play' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 text-center">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <h3 className="font-extrabold text-lg text-white">Đến lượt đi của bạn (Trắng)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nhấp chọn quân cờ màu <strong className="text-indigo-400">Xanh Lam</strong> và nhấp vào ô đích sáng màu xanh lá để di chuyển.
              </p>
            </div>
          )}

          {/* STATE BOT THINKING */}
          {gameState === 'bot_thinking' && (
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 text-center">
              <Loader2 className="w-10 h-10 text-rose-500 mx-auto animate-spin" />
              <h3 className="font-extrabold text-lg text-white">Bot AI (Đỏ) đang tính toán nước đi...</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bot đang tìm nước đi cờ đối phó hợp lệ tối ưu.
              </p>
            </div>
          )}

          {/* STATE QUIZ: Question popup */}
          {gameState === 'quiz' && (
            <div className="glass-card rounded-3xl p-6 border border-purple-500/25 space-y-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0c0d1d] to-[#080916]">
              {/* Question Loading */}
              {loadingQuestion ? (
                <div className="py-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                  <span className="text-xs text-slate-400">Đang tải câu hỏi kiểm tra thích ứng...</span>
                </div>
              ) : currentQuestion ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <QuestionIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Thử thách di chuyển quân cờ:</span>
                  </div>

                  <p className="text-slate-100 text-sm font-semibold leading-relaxed">
                    {currentQuestion.question}
                  </p>

                  {/* Answers lists */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, oIdx) => {
                      const letter = opt.charAt(0);
                      const isSelected = selectedAnswer === opt;
                      const isCorrect = letter === currentQuestion.correct;

                      let btnStyle = 'bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-800';
                      if (showAnswerResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={showAnswerResult}
                          onClick={() => handleAnswerSubmit(opt)}
                          className={`w-full p-3 rounded-xl border text-left text-xs leading-relaxed transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showAnswerResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {showAnswerResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation and next action */}
                  {showAnswerResult && (
                    <div className="space-y-4 animate-fade-in">
                      {currentQuestion.explanation && (
                        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/10 text-[11px] text-indigo-200 leading-relaxed font-medium">
                          <strong>Giải thích:</strong> {currentQuestion.explanation}
                        </div>
                      )}

                      <button
                        onClick={handleContinueMove}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          selectedAnswer && selectedAnswer.startsWith(currentQuestion.correct)
                            ? 'glow-btn-brand'
                            : 'glow-btn-amber'
                        }`}
                      >
                        {selectedAnswer && selectedAnswer.startsWith(currentQuestion.correct) ? (
                          <>
                            <span>Chấp nhận nước đi &amp; Bot phản kích</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Hủy nước đi &amp; Đi quân cờ khác</span>
                            <RotateCcw className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* STATE WIN */}
          {gameState === 'win' && (
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 space-y-4 text-center">
              <Award className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-extrabold text-xl text-emerald-300 font-outfit">CHÚC MỪNG - BẠN ĐÃ THẮNG!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bạn đã chiếu tướng/ăn được Vua của Bot AI Đen thành công. Trình độ học tập và tư duy cờ vua tuyệt vời!
              </p>
              <button
                onClick={handleResetGame}
                className="w-full py-3 rounded-xl glow-btn-brand text-white font-extrabold text-xs cursor-pointer shadow-md"
              >
                Chơi ván cờ mới
              </button>
            </div>
          )}

          {/* STATE LOSE */}
          {gameState === 'lose' && (
            <div className="glass-card rounded-3xl p-6 border border-rose-500/30 space-y-4 text-center">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
              <h3 className="font-extrabold text-xl text-rose-400 font-outfit">VÁN CỜ KẾT THÚC - BẠN BỊ THUA</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quân Vua của bạn đã bị Bot AI bắt mất. Hãy thử lại ván cờ khác để ôn tập tốt hơn!
              </p>
              <button
                onClick={handleResetGame}
                className="w-full py-3 rounded-xl glow-btn-amber text-white font-extrabold text-xs cursor-pointer shadow-md"
              >
                Chơi lại ván mới
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
