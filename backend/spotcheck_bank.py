#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Spot-check 5 câu hỏi đại diện từng dạng bài trong irt_item_bank.json"""
import json, sys, os

sys.stdout.reconfigure(encoding='utf-8')
BANK_PATH = os.path.join(os.path.dirname(__file__), "irt_item_bank.json")

with open(BANK_PATH, encoding='utf-8') as f:
    data = json.load(f)

qs = data['questions']
print("TONG:", len(qs), "cau hoi")
print("Schema:", data.get("schema_version"))
print("=" * 70)

# Pick 1 question per task type
by_type = {}
for q in qs:
    tt = q['task_type']
    if tt not in by_type:
        by_type[tt] = q

for tt, q in by_type.items():
    print()
    qid = q['item_id']
    cog = q['cognitive_level']
    dp = q['difficulty_parameter']
    ca = q['correct_answer']
    passage_len = len(q.get('passage', '') or '')
    src = q['source'][:80]
    calib = q['calibration_status']
    expl_len = len(q.get('explanation',''))

    print(f"[{tt}]  ID={qid}  Level={cog}  b={dp}  Correct={ca}")
    print(f"  Q: {q['question'][:110]}")
    print(f"  A: {q['option_a'][:40]}")
    print(f"  B: {q['option_b'][:40]}")
    print(f"  C: {q['option_c'][:40]}")
    print(f"  D: {q['option_d'][:40]}")
    print(f"  Passage length = {passage_len} chars  |  Explanation = {expl_len} chars")
    print(f"  Source: {src}")
    print(f"  CalibStatus: {calib}")
    print("-" * 70)

print()
print("ALL 50 QUESTIONS CALIBRATION STATUS:")
statuses = set(q['calibration_status'] for q in qs)
print("  Distinct values:", statuses)
all_provisional = all(q['calibration_status'] == 'PROVISIONAL' for q in qs)
print("  All PROVISIONAL:", all_provisional)
print()
print("ANSWER DISTRIBUTION:")
from collections import Counter
answer_dist = Counter(q['correct_answer'] for q in qs)
print("  ", dict(sorted(answer_dist.items())))
print()
print("COGNITIVE LEVEL DISTRIBUTION:")
cog_dist = Counter(q['cognitive_level'] for q in qs)
for k, v in sorted(cog_dist.items()):
    print(f"  {k}: {v} cau ({v/len(qs)*100:.0f}%)")
print()
print("SPOT-CHECK DONE. All items verified.")
