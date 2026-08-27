# -*- coding: utf-8 -*-
"""
Script tách biệt hoàn toàn giữa Cổng Giáo Viên và Không Gian Học Sinh
1. Tạo / Cập nhật StudentClassroom.jsx cho Học Sinh
2. Cập nhật TeacherPortal.jsx xóa bỏ phần học sinh, chỉ giữ quản lý của giáo viên
3. Tích hợp tab 'Lớp Học & Bài Tập Của Tôi' vào Sidebar và định tuyến trong App.jsx
"""

# Cập nhật App.jsx
with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    app_code = f.read()

# 1. Thêm lazy import StudentClassroom nếu chưa có
if 'const StudentClassroom =' not in app_code:
    app_code = app_code.replace(
        "const TeacherPortal = lazy(() => import('./components/TeacherPortal'));",
        "const TeacherPortal = lazy(() => import('./components/TeacherPortal'));\nconst StudentClassroom = lazy(() => import('./components/StudentClassroom'));"
    )

# 2. Thêm button Lớp Học & Bài Tập Của Tôi vào Sidebar (dưới mục Lộ Trình & Đề Thi)
sidebar_target = """              <button
                onClick={() => setActiveTab('official-exams')}"""

sidebar_replacement = """              <button
                onClick={() => setActiveTab('student-classroom')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'student-classroom'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Lớp Học &amp; Bài Tập Của Tôi</span>
              </button>

              <button
                onClick={() => setActiveTab('official-exams')}"""

if 'activeTab === \'student-classroom\'' not in app_code:
    app_code = app_code.replace(sidebar_target, sidebar_replacement)

# 3. Thêm tab rendering cho student-classroom
tab_target = "{/* TAB OFFICIAL EXAMS REPOSITORY */}"
tab_replacement = """{/* TAB STUDENT CLASSROOM (HỌC SINH VÀO LÀM BÀI) */}
                {activeTab === 'student-classroom' && (
                  <StudentClassroom
                    classes={portalClasses}
                    setClasses={updatePortalClasses}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                )}

                {/* TAB OFFICIAL EXAMS REPOSITORY */}"""

if '{activeTab === \'student-classroom\' && (' not in app_code:
    app_code = app_code.replace(tab_target, tab_replacement)

# 4. Thêm shared state portalClasses vào App component
state_target = "const [keys, setKeys] = useState({ gemini: '', groq: '', azure: '' });"
state_replacement = """const [keys, setKeys] = useState({ gemini: '', groq: '', azure: '' });

  // Dữ liệu lớp học đồng bộ giữa Giáo Viên & Học Sinh
  const [portalClasses, setPortalClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('teacher_portal_classes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { 
        id: 'cls-1', 
        name: 'Lớp 10A1 - Tiếng Anh Lớp 10', 
        code: 'ENG-10A1-26', 
        grade: '10', 
        studentCount: 38, 
        avgScore: 7.8, 
        activeAssignments: 1,
        announcements: [
          { id: 'ann-1', title: 'Nhắc nhở kiểm tra 15 phút', content: 'Thứ 6 tuần này lớp mình sẽ có bài kiểm tra 15 phút trắc nghiệm nhé các em!', date: '2026-08-25' }
        ],
        assignments: [
          { 
            id: 'asg-1', 
            title: 'Bài Kiểm Tra 15 Phút Số 1 - Từ Vựng & Ngữ Pháp', 
            questions: [
              {
                id: 1,
                part: 'Trắc nghiệm THPT',
                question: 'The government is making efforts to ______ the natural habitats of rare wild animals.',
                options: [
                  { key: 'A', text: 'preserve' },
                  { key: 'B', text: 'destroy' },
                  { key: 'C', text: 'pollute' },
                  { key: 'D', text: 'ignore' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A. preserve (bảo tồn).'
              },
              {
                id: 2,
                part: 'Trắc nghiệm THPT',
                question: 'If we continue to use fossil fuels at this rate, we ______ our energy resources soon.',
                options: [
                  { key: 'A', text: 'will exhaust' },
                  { key: 'B', text: 'would exhaust' },
                  { key: 'C', text: 'have exhausted' },
                  { key: 'D', text: 'exhausted' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A (Câu điều kiện loại 1: If + HTĐ, S + will + V).'
              },
              {
                id: 3,
                part: 'Trắc nghiệm THPT',
                question: 'She suggested ______ public transport to reduce air pollution in the metropolitan city.',
                options: [
                  { key: 'A', text: 'using' },
                  { key: 'B', text: 'to use' },
                  { key: 'C', text: 'used' },
                  { key: 'D', text: 'use' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A (suggest + V-ing).'
              }
            ],
            deadline: '2026-09-15', 
            timeLimit: 15,
            submittedCount: 35, 
            totalStudents: 38, 
            status: 'open' 
          }
        ],
        students: [
          { id: 'st-1', name: 'Nguyễn Văn An', email: 'an.nv@thpt.edu.vn', score1: 9.0, score2: 9.5, essayScore: 9.5, avg: 9.3, status: 'completed' }
        ]
      },
      { 
        id: 'cls-2', 
        name: 'Lớp 11A2 - Tiếng Anh Lớp 11', 
        code: 'ENG-11A2-99', 
        grade: '11', 
        studentCount: 42, 
        avgScore: 8.2, 
        activeAssignments: 1,
        announcements: [
          { id: 'ann-3', title: 'Luyện tập đề định kỳ', content: 'Các em vào làm bài kiểm tra giáo viên vừa giao để lấy điểm thường xuyên.', date: '2026-08-26' }
        ],
        assignments: [
          { 
            id: 'asg-2', 
            title: 'Bài Khảo Sát Định Kỳ Lớp 11', 
            questions: [
              {
                id: 1,
                part: 'Trắc nghiệm THPT',
                question: 'Artificial intelligence is ______ changing how teachers deliver knowledge and assess students.',
                options: [
                  { key: 'A', text: 'rapidly' },
                  { key: 'B', text: 'rapid' },
                  { key: 'C', text: 'rapidity' },
                  { key: 'D', text: 'rapider' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A. rapidly (trạng từ bổ nghĩa cho động từ changing).'
              }
            ],
            deadline: '2026-09-18', 
            timeLimit: 45,
            submittedCount: 40, 
            totalStudents: 42, 
            status: 'open' 
          }
        ],
        students: [
          { id: 'st-6', name: 'Đặng Thu Hà', email: 'ha.dt@thpt.edu.vn', score1: 8.8, score2: 9.0, essayScore: 8.5, avg: 8.8, status: 'completed' }
        ]
      }
    ];
  });

  const updatePortalClasses = (newClassesOrUpdater) => {
    setPortalClasses(prev => {
      const nextVal = typeof newClassesOrUpdater === 'function' ? newClassesOrUpdater(prev) : newClassesOrUpdater;
      try {
        localStorage.setItem('teacher_portal_classes', JSON.stringify(nextVal));
      } catch (e) {}
      return nextVal;
    });
  };"""

if 'portalClasses' not in app_code:
    app_code = app_code.replace(state_target, state_replacement)

# 5. Cập nhật thẻ TeacherPortal truyền portalClasses
teacher_tab_target = "{activeTab === 'teacher-portal' && (\n                  <TeacherPortal keys={keys} currentUser={currentUser} />\n                )}"
teacher_tab_replacement = """{activeTab === 'teacher-portal' && (
                  <TeacherPortal 
                    keys={keys} 
                    currentUser={currentUser} 
                    classes={portalClasses} 
                    setClasses={updatePortalClasses}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                )}"""
app_code = app_code.replace(teacher_tab_target, teacher_tab_replacement)

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_code)

print("App.jsx updated with dedicated Student Classroom navigation and shared classes state!")
