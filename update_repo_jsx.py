# -*- coding: utf-8 -*-
import json
import re

with open('frontend/src/data/officialFull40Exams.json', 'r', encoding='utf-8') as f:
    full_sample = json.load(f)[0]

# Read OfficialExamRepository.jsx
with open('frontend/src/components/OfficialExamRepository.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the first exam (thpt-2026-sample) questions with the full 40 questions
sample_js = json.dumps(full_sample, ensure_ascii=False, indent=2)

# Remove the AI generated button in OfficialExamRepository.jsx
clean_content = re.sub(
    r'<button\s+onClick=\{\(\)\s*=>\s*\{\s*const extraQuestions = \[[\s\S]*?\}\s*className="px-4 py-2 rounded-xl bg-indigo-600[\s\S]*?<\/button>',
    '''<a
      href="https://thuvienhoclieu.com/de-thi-minh-hoa-tot-nghiep-thpt-mon-tieng-anh/"
      target="_blank"
      rel="noreferrer"
      className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 transition cursor-pointer"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      <span>Đối Chiếu Đề Gốc thuvienhoclieu.com</span>
    </a>''',
    content
)

# Now replace the first item of COMPREHENSIVE_EXAMS_DATABASE with full_sample
# Find the first { id: 'thpt-2026-sample', ... }
pattern = r'\{\s*id:\s*[\'"]thpt-2026-sample[\'"],[\s\S]*?category:\s*[\'"]thpt[\'"],\s*questions:\s*\[[\s\S]*?\n    \]\s*\}'
replacement = sample_js

new_content = re.sub(pattern, replacement, clean_content, count=1)

with open('frontend/src/components/OfficialExamRepository.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated OfficialExamRepository.jsx with full 40 questions and clean pedagogical solutions!")
