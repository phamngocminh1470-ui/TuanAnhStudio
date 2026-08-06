#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Rebalance correct answers in irt_item_bank.json
================================================
Phân bố đáp án hiện tại: A=28, B=18, C=3, D=1 -> quá tập trung ở A, B.
Script này xáo trộn đáp án cho những câu được phép xáo trộn (thứ tự option
không có ý nghĩa ngữ pháp/logic cố định), đảm bảo phân bố gần ~12/13 mỗi đáp án.

Chiến lược:
  - Giữ nguyên câu Sentence Arrangement (ARNG) vì A/B/C/D = các thứ tự sắp xếp cố định.
  - Đối với câu Notice/Leaflet/Cloze/Reading: xáo trộn options, cập nhật correct_answer, option_a/b/c/d.
  - Đảm bảo đáp án đúng vẫn trỏ đến cùng nội dung.
"""

import json, os, random, sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')
BANK_PATH = os.path.join(os.path.dirname(__file__), "irt_item_bank.json")

LETTERS = ['A', 'B', 'C', 'D']

def shuffle_options(q):
    """Xáo trộn 4 options và cập nhật correct_answer, option_a/b/c/d, correct."""
    opts = q['options']  # ["A. text", "B. text", "C. text", "D. text"]
    correct_letter = q['correct_answer']  # 'A', 'B', 'C', 'D'

    # Extract plain texts (strip "A. ", "B. " prefix)
    plain = [opt[3:] if len(opt) > 3 and opt[1:3] == '. ' else opt for opt in opts]

    # Identify the correct text
    correct_idx = LETTERS.index(correct_letter)
    correct_text = plain[correct_idx]

    # Shuffle plain texts
    random.shuffle(plain)

    # Find new correct letter
    new_correct_idx = plain.index(correct_text)
    new_correct_letter = LETTERS[new_correct_idx]

    # Rebuild options with new A/B/C/D prefixes
    new_opts = [f"{LETTERS[i]}. {plain[i]}" for i in range(4)]

    q['options'] = new_opts
    q['correct_answer'] = new_correct_letter
    q['correct'] = new_correct_letter
    q['option_a'] = plain[0]
    q['option_b'] = plain[1]
    q['option_c'] = plain[2]
    q['option_d'] = plain[3]

    return q

def run():
    with open(BANK_PATH, encoding='utf-8') as f:
        data = json.load(f)

    qs = data['questions']
    print(f"Loaded {len(qs)} questions")

    # Current distribution
    before = Counter(q['correct_answer'] for q in qs)
    print(f"BEFORE: {dict(sorted(before.items()))}")

    # Fix: shuffle options for non-Arrangement questions
    # But use a deterministic seed so results are reproducible
    random.seed(42)

    reshuffled = 0
    for q in qs:
        if q['task_type'] != 'Sentence Arrangement':
            shuffle_options(q)
            reshuffled += 1

    after = Counter(q['correct_answer'] for q in qs)
    print(f"AFTER:  {dict(sorted(after.items()))}")
    print(f"Reshuffled: {reshuffled} questions")

    # Save back
    with open(BANK_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Saved to irt_item_bank.json")

    # Verify correctness: make sure correct option is in options list
    with open(BANK_PATH, encoding='utf-8') as f:
        data2 = json.load(f)

    errors = []
    for q in data2['questions']:
        ca = q['correct_answer']
        opts = q['options']
        expected_prefix = f"{ca}."
        match = [o for o in opts if o.strip().startswith(expected_prefix)]
        if len(match) != 1:
            errors.append(f"{q['item_id']}: correct={ca} not found in options: {opts}")

    if errors:
        print("ERRORS after rebalance:")
        for e in errors:
            print(f"  {e}")
    else:
        print("VERIFY PASS: All correct_answer letters match options correctly.")

if __name__ == '__main__':
    run()
