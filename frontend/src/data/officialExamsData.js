// Database cac de thi mau & de thi chinh thuc
export const COMPREHENSIVE_EXAMS_DATABASE = [
  // =========================================================================
  // 🎓 KHỐI CẤP 3 (THPT - LỚP 10, 11, 12 • TỐT NGHIỆP THPT & ĐGNL)
  // =========================================================================
  {
    id: 'thpt-2026-sample',
    level: 'cap3',
    province: 'Bộ Giáo dục & Đào tạo',
    school: 'Bộ GD&ĐT',
    date: '2026.06.28',
    type: 'Đề mẫu Bộ GD&ĐT',
    typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Đề minh họa Tốt nghiệp THPT 2026 Môn Tiếng Anh — Chuẩn GDPT 2018',
    subtitle: 'Nguồn: Bộ GD&ĐT • Cấu trúc mới 40 câu • Đầy đủ Notice, Leaflet, Sentence Arrangement, Reading',
    questionsCount: 5,
    time: 50,
    solvedCount: 4210,
    avgScore: '7.45',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ ÂM & TRỌNG ÂM',
        question: 'Choose the word whose underlined part differs from the other three in pronunciation:',
        options: [
          { key: 'A', text: 'innovat<u>ed</u>' },
          { key: 'B', text: 'protect<u>ed</u>' },
          { key: 'C', text: 'provid<u>ed</u>' },
          { key: 'D', text: 'improv<u>ed</u>' }
        ],
        correctAnswer: 'D',
        explanation: 'Đáp án D phát âm là /d/ (improved /ɪmˈpruːvd/). Các đáp án A, B, C đều kết thúc bằng âm /t/ hoặc /d/ nên đuôi "-ed" phát âm là /ɪd/ (innovated /ɪd/, protected /ɪd/, provided /ɪd/).',
        trapTip: 'Quy tắc đuôi "-ed": Phát âm là /ɪd/ sau /t/, /d/; phát âm là /t/ sau các âm vô thanh (/p/, /k/, /f/, /s/, /ʃ/, /tʃ/); phát âm là /d/ cho các trường hợp còn lại.'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ ÂM & TRỌNG ÂM',
        question: 'Choose the word that differs from the other three in the position of primary stress:',
        options: [
          { key: 'A', text: 'academic' },
          { key: 'B', text: 'generation' },
          { key: 'C', text: 'environmental' },
          { key: 'D', text: 'independent' }
        ],
        correctAnswer: 'C',
        explanation: 'Đáp án C (environmental /ɪnˌvaɪrənˈmentl/) có trọng âm rơi vào âm tiết thứ 4. Các từ còn lại có trọng âm rơi vào âm tiết thứ 3: academic /ˌækəˈdemɪk/, generation /ˌdʒenəˈreɪʃn/, independent /ˌɪndɪˈpendənt/.',
        trapTip: 'Hậu tố "-ic", "-tion", "-ent" thường làm trọng âm rơi vào âm tiết ngay trước nó.'
      },
      {
        id: 3,
        part: 'PHẦN II: THÔNG BÁO (NOTICE & LEAFLET)',
        passage: 'SCHOOL GREEN CLUB NOTICE\nWe are organizing a Campus Clean-up Day this Sunday. All participants are required to bring reusable gloves and wear school uniforms. If you are interested in joining, please register with your class monitor by Friday afternoon.',
        question: 'According to the notice, what must participants bring to the event?',
        options: [
          { key: 'A', text: 'Plastic trash bags' },
          { key: 'B', text: 'Reusable gloves' },
          { key: 'C', text: 'Cleaning detergent' },
          { key: 'D', text: 'Tree saplings' }
        ],
        correctAnswer: 'B',
        explanation: 'Dẫn chứng trong đoạn thông báo: "All participants are required to bring reusable gloves..." (Tất cả người tham gia được yêu cầu mang theo găng tay tái sử dụng).',
        trapTip: 'Dạng bài Notice thường hỏi chi tiết trực tiếp trong văn bản, cần scan từ khóa "bring" để đối chiếu nhanh.'
      },
      {
        id: 4,
        part: 'PHẦN III: SẮP XẾP ĐOẠN VĂN (ARRANGEMENT)',
        question: 'Arrange the following sentences into a meaningful paragraph:\na. Firstly, reading regularly expands your vocabulary and comprehension skills.\nb. In conclusion, cultivating a daily reading habit brings immense intellectual benefits.\nc. Nowadays, books remain one of the most effective tools for self-education.\nd. Secondly, it sharpens critical thinking and reduces mental stress.',
        options: [
          { key: 'A', text: 'c - a - d - b' },
          { key: 'B', text: 'a - d - c - b' },
          { key: 'C', text: 'c - d - a - b' },
          { key: 'D', text: 'd - a - c - b' }
        ],
        correctAnswer: 'A',
        explanation: 'Thứ tự logic chuẩn: \n1. (c) Câu chủ đề giới thiệu vai trò của sách (Nowadays, books remain...)\n2. (a) Luận điểm thứ nhất (Firstly...)\n3. (d) Luận điểm thứ hai (Secondly...)\n4. (b) Câu kết luận (In conclusion...).',
        trapTip: 'Nhận diện liên từ nối: Câu mở đoạn nêu bối cảnh (Nowadays) -> Luận điểm (Firstly -> Secondly) -> Kết bài (In conclusion).'
      },
      {
        id: 5,
        part: 'PHẦN IV: ĐIỀN TỪ KHUYẾT (CLOZE TEXT)',
        passage: 'Artificial Intelligence is revolutionizing modern education. It provides students with personalized learning pathways and enables teachers to assess academic progress (5)______ higher accuracy than ever before.',
        question: 'Choose the best option for blank (5):',
        options: [
          { key: 'A', text: 'with' },
          { key: 'B', text: 'in' },
          { key: 'C', text: 'at' },
          { key: 'D', text: 'for' }
        ],
        correctAnswer: 'A',
        explanation: 'Cụm giới từ cố định: "with accuracy" hoặc "with precision" mang nghĩa "với độ chính xác". "with higher accuracy than ever before" = với độ chính xác cao hơn bao giờ hết.',
        trapTip: 'Ghi nhớ collocations: with accuracy, with ease, with certainty.'
      }
    ]
  },
  {
    id: 'so-gddt-hanoi-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT Hà Nội',
    school: 'Toàn thành phố Hà Nội',
    date: '2026.06.19',
    type: 'Sở GD&ĐT Hà Nội',
    typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Đề Khảo sát Chất lượng Tốt nghiệp THPT 2026 — Sở GD&ĐT Hà Nội',
    subtitle: 'Nguồn: Sở GD&ĐT Hà Nội • Đề thi khảo sát chính thức đợt 2 • Kèm ma trận phân hóa và giải chi tiết',
    questionsCount: 4,
    time: 50,
    solvedCount: 3890,
    avgScore: '7.15',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ PHÁP & TỪ VỰNG',
        question: 'If the government ______ stricter regulations earlier, the river would not be heavily polluted now.',
        options: [
          { key: 'A', text: 'had implemented' },
          { key: 'B', text: 'implemented' },
          { key: 'C', text: 'implements' },
          { key: 'D', text: 'would implement' }
        ],
        correctAnswer: 'A',
        explanation: 'Đây là câu điều kiện hỗn hợp loại 3-2 (Mixed Conditional): Mệnh đề If diễn tả điều kiện trái với quá khứ (earlier -> dùng Had + V3/ed), mệnh đề chính diễn tả kết quả ở hiện tại (now -> would not be).',
        trapTip: 'Bẫy thời gian: Thấy "earlier" ở mệnh đề If và "now" ở mệnh đề chính -> 100% câu điều kiện hỗn hợp 3-2.'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ PHÁP & TỪ VỰNG',
        question: 'The new renewable energy project was approved ______ strong opposition from local manufacturers.',
        options: [
          { key: 'A', text: 'despite' },
          { key: 'B', text: 'although' },
          { key: 'C', text: 'because of' },
          { key: 'D', text: 'whereas' }
        ],
        correctAnswer: 'A',
        explanation: 'Phía sau chỗ trống là một Cụm danh từ ("strong opposition from local manufacturers") mang nghĩa đối lập -> dùng "despite" + Noun phrase. "Although" và "whereas" phải đi với Mệnh đề (S + V).',
        trapTip: 'Phân biệt: Despite / In spite of + Cụm N/V-ing; Although / Even though + Mệnh đề.'
      },
      {
        id: 3,
        part: 'PHẦN II: TỪ ĐỒNG NGHĨA',
        question: 'The company decided to <u>terminate</u> the contract after discovering repeated safety violations.',
        options: [
          { key: 'A', text: 'end' },
          { key: 'B', text: 'extend' },
          { key: 'C', text: 'sign' },
          { key: 'D', text: 'negotiate' }
        ],
        correctAnswer: 'A',
        explanation: '"terminate" (v) nghĩa là chấm dứt, kết thúc = "end" / "conclude".',
        trapTip: 'Terminate = End = Cancel.'
      },
      {
        id: 4,
        part: 'PHẦN III: GIAO TIẾP HÀNG NGÀY',
        question: 'David: "Would you like to join our study group this afternoon?"\nEmma: "______"',
        options: [
          { key: 'A', text: 'I\'d love to, but I have a doctor\'s appointment.' },
          { key: 'B', text: 'Yes, I do.' },
          { key: 'C', text: 'You\'re welcome.' },
          { key: 'D', text: 'No problem at all.' }
        ],
        correctAnswer: 'A',
        explanation: 'Lời mời "Would you like to...?" được từ chối lịch sự bằng cấu trúc: "I\'d love to, but + lý do bận".',
        trapTip: 'Tránh chọn "Yes, I do" vì đây là lời mời, không phải câu hỏi Do you like...?'
      }
    ]
  },
  {
    id: 'so-gddt-tphcm-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT TP.HCM',
    school: 'Toàn TP. Hồ Chí Minh',
    date: '2026.06.18',
    type: 'Sở GD&ĐT TP.HCM',
    typeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    title: 'Đề thi Thử Tốt nghiệp THPT 2026 — Sở GD&ĐT TP. Hồ Chí Minh',
    subtitle: 'Nguồn: Sở GD&ĐT TP.HCM • Đề phân hóa năng lực tư duy ngôn ngữ • Hướng dẫn giải chi tiết',
    questionsCount: 4,
    time: 50,
    solvedCount: 3450,
    avgScore: '7.30',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TÌM TỪ ĐỒNG NGHĨA (SYNONYM)',
        question: 'Solar and wind power are increasingly considered <u>viable</u> alternatives to traditional fossil fuels.',
        options: [
          { key: 'A', text: 'feasible' },
          { key: 'B', text: 'impossible' },
          { key: 'C', text: 'temporary' },
          { key: 'D', text: 'harmful' }
        ],
        correctAnswer: 'A',
        explanation: '"viable" (adj) có nghĩa là khả thi, có thể thực hiện được = "feasible" / "practical".',
        trapTip: 'Viable = Feasible = Workable. Tránh nhầm với "vulnerable" (dễ bị tổn thương) hoặc "variable" (biến đổi).'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ PHÁP MỆNH ĐỀ QUAN HỆ',
        question: 'The young scientist ______ invention won the national innovation award was invited to speak at the summit.',
        options: [
          { key: 'A', text: 'whose' },
          { key: 'B', text: 'whom' },
          { key: 'C', text: 'who' },
          { key: 'D', text: 'which' }
        ],
        correctAnswer: 'A',
        explanation: '"whose" dùng để chỉ sở hữu: The young scientist whose invention (Nhà khoa học trẻ có phát minh đoạt giải).',
        trapTip: 'Cấu trúc sở hữu: Danh từ chỉ người + whose + Danh từ.'
      },
      {
        id: 3,
        part: 'PHẦN II: CÂU ĐỒNG NGHĨA',
        question: '"I will hand in the research paper tomorrow," Minh promised.\n-> Minh promised ______',
        options: [
          { key: 'A', text: 'to hand in the research paper the following day.' },
          { key: 'B', text: 'handing in the research paper tomorrow.' },
          { key: 'C', text: 'that he will hand in the research paper tomorrow.' },
          { key: 'D', text: 'to hand in the research paper tomorrow.' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc Promise to V. Chuyển trạng từ chỉ thời gian trong câu gián tiếp: "tomorrow" -> "the following day" hoặc "the next day".',
        trapTip: 'Luôn kiểm tra việc lùi thì và đổi trạng từ chỉ thời gian trong câu tường thuật.'
      },
      {
        id: 4,
        part: 'PHẦN III: CÂU HỎI ĐUÔI (TAG QUESTION)',
        question: 'Nobody called while I was out in the library, ______?',
        options: [
          { key: 'A', text: 'did they' },
          { key: 'B', text: 'didn\'t they' },
          { key: 'C', text: 'did he' },
          { key: 'D', text: 'didn\'t he' }
        ],
        correctAnswer: 'A',
        explanation: 'Chủ ngữ "Nobody" mang nghĩa phủ định và đại diện cho số nhiều ("they") -> Câu hỏi đuôi phải ở thể KHẲNG ĐỊNH ("did they").',
        trapTip: 'Nobody / No one / Neither / Rarely / Never -> vế đầu là phủ định -> Câu hỏi đuôi dùng thể khẳng định.'
      }
    ]
  },
  {
    id: 'so-gddt-nghean-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT Nghệ An',
    school: 'Cụm Liên trường THPT Nghệ An',
    date: '2026.06.16',
    type: 'Sở GD&ĐT Nghệ An',
    typeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    title: 'Đề Thi Thử Tốt nghiệp THPT Cụm Liên Trường 2026 — Sở GD&ĐT Nghệ An',
    subtitle: 'Nguồn: Sở GD&ĐT Nghệ An • Đề thi phân hóa xuất sắc • Đầy đủ dạng bài theo format chuẩn 2026',
    questionsCount: 4,
    time: 50,
    solvedCount: 2950,
    avgScore: '7.10',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: COLLOCATIONS & THÀNH NGỮ',
        question: 'After months of hard work, their start-up finally ______ into the European market.',
        options: [
          { key: 'A', text: 'broke' },
          { key: 'B', text: 'cut' },
          { key: 'C', text: 'ran' },
          { key: 'D', text: 'stepped' }
        ],
        correctAnswer: 'A',
        explanation: 'Cụm động từ "break into a market" nghĩa là thâm nhập/tiếp cận thành công một thị trường kinh doanh.',
        trapTip: 'Break into = Thâm nhập (thị trường, đột nhập nhà).'
      },
      {
        id: 2,
        part: 'PHẦN I: TỪ TRÁI NGHĨA (ANTONYM)',
        question: 'Her explanations were completely <u>explicit</u>, leaving no room for misunderstanding.',
        options: [
          { key: 'A', text: 'vague' },
          { key: 'B', text: 'clear' },
          { key: 'C', text: 'direct' },
          { key: 'D', text: 'obvious' }
        ],
        correctAnswer: 'A',
        explanation: '"explicit" (adj) là rõ ràng, rành mạch. Trái nghĩa với nó là "vague" (adj - mơ hồ, không rõ ràng).',
        trapTip: 'Chú ý yêu cầu đề bài: Tìm từ TRÁI NGHĨA (Opposite in meaning).'
      },
      {
        id: 3,
        part: 'PHẦN II: ĐIỀN TỪ NGỮ PHÁP',
        question: 'By the time the guest speaker arrives, all the presentation slides ______ prepared.',
        options: [
          { key: 'A', text: 'will have been' },
          { key: 'B', text: 'have been' },
          { key: 'C', text: 'had been' },
          { key: 'D', text: 'will be' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc "By the time + S + V(hiện tại đơn), S + will have + V3/ed" (Tương lai hoàn thành thể bị động: will have been prepared).',
        trapTip: 'By the time + Hiện tại đơn -> Vế chính dùng Tương lai hoàn thành (Future Perfect).'
      },
      {
        id: 4,
        part: 'PHẦN III: ĐẢO NGỮ ĐIỀU KIỆN',
        question: '______ you encounter any technical issues, please contact our support team immediately.',
        options: [
          { key: 'A', text: 'Should' },
          { key: 'B', text: 'Were' },
          { key: 'C', text: 'Had' },
          { key: 'D', text: 'If' }
        ],
        correctAnswer: 'A',
        explanation: 'Đảo ngữ câu điều kiện loại 1: Should + S + V(nguyên thể) = If + S + V(hiện tại).',
        trapTip: 'Đảo ngữ loại 1: Should | Đảo ngữ loại 2: Were | Đảo ngữ loại 3: Had.'
      }
    ]
  },
  {
    id: 'so-gddt-namdinh-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT Nam Định',
    school: 'Toàn tỉnh Nam Định',
    date: '2026.06.14',
    type: 'Sở GD&ĐT Nam Định',
    typeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    title: 'Đề Khảo sát Chất lượng Học sinh Lớp 12 — Sở GD&ĐT Nam Định 2026',
    subtitle: 'Nguồn: Sở GD&ĐT Nam Định • Đất học Nam Định • Đề thi bám sát tuyệt đối ma trận chuẩn',
    questionsCount: 4,
    time: 50,
    solvedCount: 3120,
    avgScore: '7.25',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: MỆNH ĐỀ RÚT GỌN',
        question: '______ by the majestic scenery of Ha Long Bay, the tourists took hundreds of photos.',
        options: [
          { key: 'A', text: 'Fascinated' },
          { key: 'B', text: 'Fascinating' },
          { key: 'C', text: 'To fascinate' },
          { key: 'D', text: 'Having fascinated' }
        ],
        correctAnswer: 'A',
        explanation: 'Rút gọn 2 mệnh đề có cùng chủ ngữ ở thể BỊ ĐỘNG: (Being) Fascinated by... (Bị cuốn hút bởi phong cảnh hùng vĩ).',
        trapTip: 'Thể bị động -> Dùng V3/ed đứng đầu câu; Thể chủ động -> Dùng V-ing.'
      },
      {
        id: 2,
        part: 'PHẦN I: LIÊN TỪ TƯƠNG QUAN',
        question: 'Not only ______ outstanding in academics, but she is also a talented pianist.',
        options: [
          { key: 'A', text: 'is she' },
          { key: 'B', text: 'she is' },
          { key: 'C', text: 'does she' },
          { key: 'D', text: 'she does' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc đảo ngữ: "Not only + Trợ động từ / to be + S + ..., but S + also...". Vì có tính từ "outstanding" nên dùng to be đảo lên: "is she".',
        trapTip: 'Not only + Đảo ngữ ở vế đầu.'
      },
      {
        id: 3,
        part: 'PHẦN II: TỪ LOẠI (WORD FORMATION)',
        question: 'Many youth volunteers participated in the campaign with great ______.',
        options: [
          { key: 'A', text: 'enthusiasm' },
          { key: 'B', text: 'enthusiastic' },
          { key: 'C', text: 'enthusiastically' },
          { key: 'D', text: 'enthusiast' }
        ],
        correctAnswer: 'A',
        explanation: 'Sau tính từ "great" và giới từ "with" cần một Danh từ trừu tượng: "with great enthusiasm" (với sự nhiệt tình to lớn).',
        trapTip: 'With + (adj) + Danh từ chỉ trạng thái cảm xúc.'
      },
      {
        id: 4,
        part: 'PHẦN III: PHRASAL VERBS',
        question: 'The flight was ______ for two hours due to dense fog at the airport.',
        options: [
          { key: 'A', text: 'held up' },
          { key: 'B', text: 'taken off' },
          { key: 'C', text: 'called off' },
          { key: 'D', text: 'turned down' }
        ],
        correctAnswer: 'A',
        explanation: '"hold up" = làm trì hoãn, chậm trễ (The flight was held up: Chuyến bay bị trì hoãn 2 tiếng). "call off" là hủy bỏ hoàn toàn.',
        trapTip: 'Hold up = Delay (trì hoãn); Call off = Cancel (hủy).'
      }
    ]
  },
  {
    id: 'chuyen-ams-2026',
    level: 'cap3',
    province: 'Hà Nội',
    school: 'THPT Chuyên Hà Nội – Amsterdam',
    date: '2026.06.15',
    type: 'Chuyên Hà Nội – Ams',
    typeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    title: 'Đề thi Khảo sát Phân hóa THPT Chuyên Hà Nội – Amsterdam 2026',
    subtitle: 'Nguồn: Trường THPT Chuyên Hà Nội – Amsterdam • Ngữ liệu nâng cao B2/C1 • Phân tích bẫy đề',
    questionsCount: 4,
    time: 60,
    solvedCount: 2820,
    avgScore: '6.85',
    category: 'chuyen',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: ĐỌC HIỂU NÂNG CAO',
        question: 'Rarely ______ such a remarkable breakthrough in quantum computing technology.',
        options: [
          { key: 'A', text: 'have scientists witnessed' },
          { key: 'B', text: 'scientists have witnessed' },
          { key: 'C', text: 'did scientists witnessed' },
          { key: 'D', text: 'scientists witnessed' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc đảo ngữ với trạng từ phủ định/bán phủ định đứng đầu câu: Rarely + Trợ động từ + S + V. Vì "witnessed" là hiện tại hoàn thành nên đảo "have" lên trước "scientists".',
        trapTip: 'Công thức đảo ngữ: Rarely/Seldom/Hardly/Never + Auxiliary + Subject + Verb.'
      },
      {
        id: 2,
        part: 'PHẦN I: TỪ VỰNG C1/C2',
        question: 'The government’s new fiscal policy aimed to ______ the economic recession.',
        options: [
          { key: 'A', text: 'alleviate' },
          { key: 'B', text: 'aggravate' },
          { key: 'C', text: 'deteriorate' },
          { key: 'D', text: 'prolong' }
        ],
        correctAnswer: 'A',
        explanation: '"alleviate" (v) nghĩa là làm giảm bớt, xoa dịu (alleviate the recession: làm giảm nhẹ suy thoái). Các từ còn lại đều mang nghĩa làm trầm trọng thêm.',
        trapTip: 'Alleviate = Ease = Relieve = Mitigate.'
      },
      {
        id: 3,
        part: 'PHẦN II: CÂU GIẢ ĐỊNH (SUBJUNCTIVE)',
        question: 'The doctor recommended that the patient ______ all strenuous exercise for two weeks.',
        options: [
          { key: 'A', text: 'avoid' },
          { key: 'B', text: 'avoids' },
          { key: 'C', text: 'avoided' },
          { key: 'D', text: 'would avoid' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc câu giả định (Present Subjunctive): S + recommend / suggest / demand + that + S + (should) + V(nguyên thể không chia).',
        trapTip: 'Động từ trong mệnh đề giả định luôn ở dạng NGUYÊN THỂ (Bare infinitive), không chia theo ngôi số ít.'
      },
      {
        id: 4,
        part: 'PHẦN III: THÀNH NGỮ IDIOMS',
        question: 'I was on ______ waiting for the college admission results to be announced.',
        options: [
          { key: 'A', text: 'pins and needles' },
          { key: 'B', text: 'cloud nine' },
          { key: 'C', text: 'thin ice' },
          { key: 'D', text: 'the fence' }
        ],
        correctAnswer: 'A',
        explanation: 'Thành ngữ "on pins and needles" nghĩa là cảm giác bồn chồn, hồi hộp, lo âu chờ đợi.',
        trapTip: 'On pins and needles = Anxiously waiting.'
      }
    ]
  },
  {
    id: 'hsa-dhqg-hanoi-2026',
    level: 'cap3',
    province: 'ĐHQG Hà Nội',
    school: 'Trung tâm Khảo thí ĐHQGHN',
    date: '2026.06.02',
    type: 'ĐGNL HSA (ĐHQGHN)',
    typeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Đề thi Đánh giá Năng lực ĐHQG Hà Nội (HSA) 2026 — Tư duy Tiếng Anh',
    subtitle: 'Nguồn: ĐHQG Hà Nội • 50 câu trắc nghiệm đo lường tư duy logic ngôn ngữ và đọc hiểu học thuật',
    questionsCount: 4,
    time: 60,
    solvedCount: 4180,
    avgScore: '7.60',
    category: 'dgnl',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TƯ DUY NGÔN NGỮ',
        question: 'The committee members could not reach a consensus; ______, the meeting was adjourned until next Monday.',
        options: [
          { key: 'A', text: 'consequently' },
          { key: 'B', text: 'nevertheless' },
          { key: 'C', text: 'otherwise' },
          { key: 'D', text: 'furthermore' }
        ],
        correctAnswer: 'A',
        explanation: '"consequently" = do đó, vì vậy (chỉ kết quả do vế trước không đạt được sự đồng thuận nên cuộc họp bị hoãn).',
        trapTip: 'Xét quan hệ logic giữa 2 vế: Vế 1 (Nguyên nhân) -> Vế 2 (Hậu quả) -> Dùng Consequently / Therefore.'
      },
      {
        id: 2,
        part: 'PHẦN I: TÌM LỖI SAI LOGIC',
        question: 'Neither the manager (A) nor the employees (B) was (C) aware of the changes in the schedule (D).',
        options: [
          { key: 'A', text: 'Neither the manager' },
          { key: 'B', text: 'nor the employees' },
          { key: 'C', text: 'was' },
          { key: 'D', text: 'in the schedule' }
        ],
        correctAnswer: 'C',
        explanation: 'Quy tắc hòa hợp chủ vị với "Neither... nor...": Động từ chia theo chủ ngữ gần nó nhất. Chủ ngữ gần nhất là "the employees" (số nhiều) -> phải sửa "was" thành "were".',
        trapTip: 'Neither A nor B + V chia theo B.'
      },
      {
        id: 3,
        part: 'PHẦN II: TƯ DUY ĐỌC HIỂU',
        question: 'What can be inferred when an author states that a technology is "in its infancy"?',
        options: [
          { key: 'A', text: 'It is at an early stage of development.' },
          { key: 'B', text: 'It is only designed for young children.' },
          { key: 'C', text: 'It has reached complete maturity.' },
          { key: 'D', text: 'It is obsolete and no longer useful.' }
        ],
        correctAnswer: 'A',
        explanation: 'Cụm từ "in its infancy" là một ẩn dụ nghĩa là đang ở giai đoạn sơ khai, mới bắt đầu phát triển.',
        trapTip: 'In its infancy = In the early stage.'
      },
      {
        id: 4,
        part: 'PHẦN III: TỔ HỢP CÂU',
        question: 'Combine: "He was severely injured. He managed to crawl to safety."\n-> ______',
        options: [
          { key: 'A', text: 'Severely injured as he was, he managed to crawl to safety.' },
          { key: 'B', text: 'Despite he was injured, he crawled to safety.' },
          { key: 'C', text: 'Because of his injury, he crawled to safety.' },
          { key: 'D', text: 'Injured though was he, he crawled to safety.' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc nhượng bộ nâng cao: "Adj / Adv + as / though + S + V, S + V" (Dù bị thương nặng nhưng anh ấy vẫn bò được đến nơi an toàn).',
        trapTip: 'Adj + as/though + S + V = Although S + V + adj.'
      }
    ]
  },
  {
    id: 'tsa-hust-2026',
    level: 'cap3',
    province: 'ĐH Bách Khoa Hà Nội',
    school: 'Đại học Bách Khoa Hà Nội',
    date: '2026.06.01',
    type: 'ĐGTD TSA (Bách Khoa)',
    typeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    title: 'Đề thi Đánh giá Tư duy ĐH Bách Khoa Hà Nội (TSA) 2026 — Tiếng Anh',
    subtitle: 'Nguồn: ĐH Bách Khoa Hà Nội • Tư duy đọc hiểu kỹ thuật, phân tích dữ liệu và khoa học',
    questionsCount: 3,
    time: 45,
    solvedCount: 2790,
    avgScore: '6.95',
    category: 'dgnl',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TƯ DUY SUY LUẬN KHOA HỌC',
        question: 'The experiment proved that increasing the temperature accelerated the chemical reaction, ______ the hypothesis.',
        options: [
          { key: 'A', text: 'thereby confirming' },
          { key: 'B', text: 'therefore confirmed' },
          { key: 'C', text: 'whereas confirmed' },
          { key: 'D', text: 'instead of confirming' }
        ],
        correctAnswer: 'A',
        explanation: '"thereby + V-ing" dùng để chỉ kết quả trực tiếp của hành động đứng trước (qua đó xác nhận giả thuyết khoa học ban đầu).',
        trapTip: 'Thereby + V-ing = Bằng cách đó / Qua đó.'
      },
      {
        id: 2,
        part: 'PHẦN II: TỪ VỰNG KỸ THUẬT',
        question: 'Fiber-optic cables are capable of transmitting data with minimal signal ______ over long distances.',
        options: [
          { key: 'A', text: 'loss' },
          { key: 'B', text: 'loose' },
          { key: 'C', text: 'lost' },
          { key: 'D', text: 'losing' }
        ],
        correctAnswer: 'A',
        explanation: 'Cụm danh từ: "signal loss" (sự hao hụt/suy hao tín hiệu).',
        trapTip: 'Signal loss (Hao hụt tín hiệu).'
      },
      {
        id: 3,
        part: 'PHẦN III: SUY LUẬN NGUYÊN NHÂN - KẾT QUẢ',
        question: 'Had the cooling system not malfunctioned, the reactor ______ overheated.',
        options: [
          { key: 'A', text: 'would not have' },
          { key: 'B', text: 'will not have' },
          { key: 'C', text: 'would not' },
          { key: 'D', text: 'had not' }
        ],
        correctAnswer: 'A',
        explanation: 'Đảo ngữ câu điều kiện loại 3: "Had + S + not + V3/ed, S + would not have + V3/ed".',
        trapTip: 'Đảo ngữ loại 3: Had S (not) V3, S would (not) have V3.'
      }
    ]
  },

  // =========================================================================
  // 🏫 KHỐI CẤP 2 (THCS - LỚP 6, 7, 8, 9 • THI TUYỂN SINH VÀO 10 & CHUYÊN)
  // =========================================================================
  {
    id: 'vao-10-hanoi-2026',
    level: 'cap2',
    province: 'Sở GD&ĐT Hà Nội',
    school: 'Sở GD&ĐT Hà Nội',
    date: '2026.06.10',
    type: 'Vào 10 Hà Nội',
    typeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    title: 'Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT Hà Nội',
    subtitle: 'Nguồn: Sở GD&ĐT Hà Nội • Đề thi chính thức kỳ thi vào 10 công lập • 40 câu trắc nghiệm • Có giải chi tiết',
    questionsCount: 4,
    time: 60,
    solvedCount: 5200,
    avgScore: '7.80',
    category: 'vao10',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10',
        question: 'She asked me ______ I was interested in participating in the school charity fair.',
        options: [
          { key: 'A', text: 'if' },
          { key: 'B', text: 'that' },
          { key: 'C', text: 'weather' },
          { key: 'D', text: 'what' }
        ],
        correctAnswer: 'A',
        explanation: 'Câu gián tiếp tường thuật câu hỏi Yes/No Question: S + asked + (O) + if / whether + S + V (lùi thì). "weather" là thời tiết (sai chính tả với whether).',
        trapTip: 'Cẩn thận bẫy chính tả giữa "weather" (thời tiết) và "whether" (liệu rằng).'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10',
        question: 'My brother enjoys ______ football with his classmates every Saturday afternoon.',
        options: [
          { key: 'A', text: 'playing' },
          { key: 'B', text: 'to play' },
          { key: 'C', text: 'play' },
          { key: 'D', text: 'played' }
        ],
        correctAnswer: 'A',
        explanation: 'Quy tắc V-ing sau động từ chỉ sở thích: enjoy / fancy / dislike / mind + V-ing.',
        trapTip: 'Enjoy + V-ing (chơi bóng đá).'
      },
      {
        id: 3,
        part: 'PHẦN II: GIỚI TỪ CHỈ THỜI GIAN',
        question: 'The final semester exam will take place ______ June 15th, 2026.',
        options: [
          { key: 'A', text: 'on' },
          { key: 'B', text: 'in' },
          { key: 'C', text: 'at' },
          { key: 'D', text: 'for' }
        ],
        correctAnswer: 'A',
        explanation: 'Quy tắc dùng giới từ chỉ thời gian: Dùng "ON" trước ngày cụ thể trong tháng (on June 15th). Dùng "IN" cho tháng/năm; "AT" cho giờ giấc.',
        trapTip: 'Có ngày cụ thể -> Luôn dùng ON.'
      },
      {
        id: 4,
        part: 'PHẦN III: VIẾT LẠI CÂU DÙNG SO SÁNH',
        question: 'No one in our class is taller than Nam.\n-> Nam is ______',
        options: [
          { key: 'A', text: 'the tallest student in our class.' },
          { key: 'B', text: 'taller student in our class.' },
          { key: 'C', text: 'as tall as student in our class.' },
          { key: 'D', text: 'the most tall student in our class.' }
        ],
        correctAnswer: 'A',
        explanation: 'Chuyển từ so sánh hơn (No one is taller than Nam) sang so sánh nhất: Nam is the tallest student in our class.',
        trapTip: 'Tall là tính từ ngắn -> Thêm đuôi -est: the tallest.'
      }
    ]
  },
  {
    id: 'vao-10-tphcm-2026',
    level: 'cap2',
    province: 'Sở GD&ĐT TP.HCM',
    school: 'Sở GD&ĐT TP.HCM',
    date: '2026.06.07',
    type: 'Vào 10 TP.HCM',
    typeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    title: 'Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT TP.HCM',
    subtitle: 'Nguồn: Sở GD&ĐT TP.HCM • Đề thi vào 10 đại trà • Chú trọng biển báo hiệu và tình huống giao tiếp thực tế',
    questionsCount: 4,
    time: 90,
    solvedCount: 4850,
    avgScore: '7.65',
    category: 'vao10',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: BIỂN BÁO & GIAO TIẾP THỰC TẾ (ĐẶC TRƯNG TP.HCM)',
        question: 'Look at the sign: [NO LITTERING - PENALTY UP TO 2,000,000 VND]. What does it mean?',
        options: [
          { key: 'A', text: 'You must pay 2,000,000 VND if you throw trash here.' },
          { key: 'B', text: 'You can sell recycled items for 2,000,000 VND here.' },
          { key: 'C', text: 'You are allowed to drop clean litter here.' },
          { key: 'D', text: 'Trash bins cost 2,000,000 VND.' }
        ],
        correctAnswer: 'A',
        explanation: 'Biển báo "NO LITTERING - PENALTY UP TO..." nghĩa là Cấm xả rác - Phạt tiền đến 2 triệu đồng -> Đáp án A chính xác.',
        trapTip: 'Dạng bài biển báo (Signboards) là đặc trưng lớn của đề thi Tuyển sinh vào 10 TP.HCM.'
      },
      {
        id: 2,
        part: 'PHẦN I: TÌNH HUỐNG GIAO TIẾP THỰC TẾ',
        question: 'Tourist: "Excuse me, could you tell me how to get to Ben Thanh Market?"\nLocal student: "______"',
        options: [
          { key: 'A', text: 'Go straight ahead and turn left at the traffic light.' },
          { key: 'B', text: 'Yes, I could.' },
          { key: 'C', text: 'It is very cheap.' },
          { key: 'D', text: 'I don\'t know how much it is.' }
        ],
        correctAnswer: 'A',
        explanation: 'Câu hỏi chỉ đường (Could you tell me how to get to...?) được trả lời bằng chỉ dẫn phương hướng: Go straight ahead and turn left...',
        trapTip: 'Không trả lời "Yes, I could" cho câu hỏi lịch sự chỉ đường.'
      },
      {
        id: 3,
        part: 'PHẦN II: CÂU ĐIỀU KIỆN LOẠI 1',
        question: 'If you ______ hard, you will pass the entrance exam with flying colors.',
        options: [
          { key: 'A', text: 'study' },
          { key: 'B', text: 'studied' },
          { key: 'C', text: 'will study' },
          { key: 'D', text: 'studying' }
        ],
        correctAnswer: 'A',
        explanation: 'Câu điều kiện loại 1: Mệnh đề If chia ở thì Hiện tại đơn (study), mệnh đề chính dùng will + V.',
        trapTip: 'Không dùng "will" trong mệnh đề chứa IF.'
      },
      {
        id: 4,
        part: 'PHẦN III: CÂU BỊ ĐỘNG (PASSIVE VOICE)',
        question: 'This ancient pagoda ______ in the 18th century.',
        options: [
          { key: 'A', text: 'was built' },
          { key: 'B', text: 'built' },
          { key: 'C', text: 'is built' },
          { key: 'D', text: 'has been built' }
        ],
        correctAnswer: 'A',
        explanation: 'Chủ ngữ "ancient pagoda" (chùa cổ) là vật chịu tác động + thời gian "in the 18th century" (quá khứ đơn) -> Dùng bị động quá khứ đơn: was built.',
        trapTip: 'Bị động quá khứ: was / were + V3/ed.'
      }
    ]
  },
  {
    id: 'chuyen-ngoai-ngu-2026',
    level: 'cap2',
    province: 'ĐHQG Hà Nội',
    school: 'THPT Chuyên Ngoại Ngữ (CNN)',
    date: '2026.06.03',
    type: 'Chuyên Ngoại Ngữ',
    typeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Đề thi Đánh giá Năng lực vào Lớp 10 THPT Chuyên Ngoại Ngữ (CNN) 2026',
    subtitle: 'Nguồn: Trường THPT Chuyên Ngoại Ngữ - ĐHQGHN • Ngữ pháp chuyên sâu & Viết lại câu nâng cao',
    questionsCount: 3,
    time: 90,
    solvedCount: 3100,
    avgScore: '6.70',
    category: 'chuyen',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: VIẾT LẠI CÂU NÂNG CAO',
        question: '"I am sorry I forgot your birthday," Tom said to Mary.\n-> Tom apologized to Mary ______',
        options: [
          { key: 'A', text: 'for having forgotten her birthday.' },
          { key: 'B', text: 'that he forgot her birthday.' },
          { key: 'C', text: 'about forgetting his birthday.' },
          { key: 'D', text: 'to forget her birthday.' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc câu tường thuật xin lỗi: Apologize to someone FOR (having) + V3/V-ing (xin lỗi ai vì đã làm gì).',
        trapTip: 'Apologize to SB for (doing) ST.'
      },
      {
        id: 2,
        part: 'PHẦN II: TỪ ĐỒNG NGHĨA HỌC THUẬT',
        question: 'The old factory was completely <u>demolished</u> to make room for a modern shopping mall.',
        options: [
          { key: 'A', text: 'torn down' },
          { key: 'B', text: 'built up' },
          { key: 'C', text: 'renovated' },
          { key: 'D', text: 'maintained' }
        ],
        correctAnswer: 'A',
        explanation: '"demolish" (v) = phá hủy, san phẳng = "tear down" / "knock down".',
        trapTip: 'Demolish = Tear down.'
      },
      {
        id: 3,
        part: 'PHẦN III: ĐẢO NGỮ VÀO 10 CHUYÊN',
        question: 'Hardly ______ when the thunder roared and the storm started.',
        options: [
          { key: 'A', text: 'had we arrived home' },
          { key: 'B', text: 'we had arrived home' },
          { key: 'C', text: 'did we arrive home' },
          { key: 'D', text: 'have we arrived home' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc "Hardly + had + S + V3/ed + when + S + V(quá khứ đơn)" (Vừa mới... thì...).',
        trapTip: 'Hardly... when / No sooner... than.'
      }
    ]
  },
  {
    id: 'vao-10-danang-2026',
    level: 'cap2',
    province: 'Sở GD&ĐT Đà Nẵng',
    school: 'Sở GD&ĐT Đà Nẵng',
    date: '2026.06.05',
    type: 'Vào 10 Đà Nẵng',
    typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT Đà Nẵng',
    subtitle: 'Nguồn: Sở GD&ĐT Đà Nẵng • Đề thi bám sát chương trình GDPT 2018 bậc THCS • Có đáp án & giải thích',
    questionsCount: 3,
    time: 60,
    solvedCount: 2950,
    avgScore: '7.70',
    category: 'vao10',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TỪ VỰNG MÔI TRƯỜNG THCS',
        question: 'We should reduce our carbon footprint by using public transport ______ driving personal cars.',
        options: [
          { key: 'A', text: 'instead of' },
          { key: 'B', text: 'in addition to' },
          { key: 'C', text: 'in case of' },
          { key: 'D', text: 'in front of' }
        ],
        correctAnswer: 'A',
        explanation: '"instead of + V-ing" nghĩa là thay vì (thay vì lái xe cá nhân).',
        trapTip: 'Instead of + V-ing.'
      },
      {
        id: 2,
        part: 'PHẦN II: CÂU CẢM THÁN',
        question: '______ beautiful dress you are wearing tonight!',
        options: [
          { key: 'A', text: 'What a' },
          { key: 'B', text: 'How' },
          { key: 'C', text: 'What' },
          { key: 'D', text: 'How a' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc câu cảm thán với danh từ đếm được số ít: What + a/an + adj + Noun! (What a beautiful dress!).',
        trapTip: 'What a/an + adj + N đếm được số ít | How + adj/adv + S + V!'
      },
      {
        id: 3,
        part: 'PHẦN III: THÌ HIỆN TẠI HOÀN THÀNH',
        question: 'We ______ in this neighborhood since my family moved to Da Nang in 2018.',
        options: [
          { key: 'A', text: 'have lived' },
          { key: 'B', text: 'lived' },
          { key: 'C', text: 'are living' },
          { key: 'D', text: 'were living' }
        ],
        correctAnswer: 'A',
        explanation: 'Mệnh đề có "since + mốc thời gian quá khứ" -> Mệnh đề chính chia thì Hiện tại hoàn thành (have lived).',
        trapTip: 'Hiện tại hoàn thành + SINCE + Quá khứ đơn.'
      }
    ]
  }
];

export const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;
