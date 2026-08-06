#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Validate irt_item_bank.json — KHKT Quality Gate Script
=======================================================
Kiểm tra toàn diện:
  1. Schema & Required Fields
  2. item_id uniqueness & format
  3. 4 options, valid correct_answer (A/B/C/D), correct == correct_answer
  4. calibration_status must be PROVISIONAL
  5. difficulty_parameter in valid IRT range
  6. explanation non-empty
  7. passage present for reading/fill-in tasks
  8. Spot-check: 5 random questions printed for manual review
"""

import json, random, sys, os

BANK_PATH = os.path.join(os.path.dirname(__file__), "irt_item_bank.json")

REQUIRED_FIELDS = [
    "item_id", "question", "options", "correct_answer", "correct",
    "explanation", "topic", "skill", "cognitive_level", "difficulty_level",
    "calibration_status", "difficulty_parameter", "task_type"
]

PASSAGE_TASK_TYPES = {"Notice Fill-in", "Leaflet Fill-in", "Cloze", "Reading Comprehension"}


def run():
    with open(BANK_PATH, encoding="utf-8") as f:
        data = json.load(f)

    qs = data.get("questions", [])
    errors = []
    warnings = []
    seen_ids = set()
    task_counts = {}
    calib_counts = {}

    for q in qs:
        qid = q.get("item_id", "MISSING_ID")

        # --- Duplicate ID check ---
        if qid in seen_ids:
            errors.append(f"Duplicate item_id: {qid}")
        seen_ids.add(qid)

        # --- Required fields ---
        for field in REQUIRED_FIELDS:
            if field not in q:
                errors.append(f"{qid}: Missing required field [{field}]")

        # --- Correct answer consistency ---
        ca = q.get("correct_answer", "")
        correct = q.get("correct", "")
        if ca != correct:
            errors.append(f"{qid}: correct_answer=[{ca}] != correct=[{correct}]")

        # --- Valid answer letter ---
        if ca not in ("A", "B", "C", "D"):
            errors.append(f"{qid}: Invalid correct_answer=[{ca}] (must be A/B/C/D)")

        # --- Exactly 4 options ---
        opts = q.get("options", [])
        if len(opts) != 4:
            errors.append(f"{qid}: Expected 4 options, got {len(opts)}")
        else:
            # Each option should start with A. B. C. D.
            for i, opt in enumerate(opts):
                expected_prefix = ["A.", "B.", "C.", "D."][i]
                if not str(opt).strip().startswith(expected_prefix):
                    warnings.append(f"{qid}: Option {i+1} doesn't start with '{expected_prefix}': [{opt[:40]}]")

        # --- Only 1 correct answer among options ---
        if opts and ca in ("A", "B", "C", "D"):
            correct_opt_prefix = f"{ca}."
            matching = [o for o in opts if str(o).strip().startswith(correct_opt_prefix)]
            if len(matching) != 1:
                warnings.append(f"{qid}: Could not confirm exactly 1 option matches correct={ca}")

        # --- calibration_status must be PROVISIONAL ---
        cs = q.get("calibration_status", "")
        calib_counts[cs] = calib_counts.get(cs, 0) + 1
        if cs != "PROVISIONAL":
            errors.append(f"{qid}: calibration_status=[{cs}] — must remain PROVISIONAL until real student data")

        # --- difficulty_parameter in IRT range [-3, 3] ---
        dp = q.get("difficulty_parameter")
        if dp is not None:
            try:
                dp_val = float(dp)
                if dp_val < -3.0 or dp_val > 3.0:
                    warnings.append(f"{qid}: difficulty_parameter={dp_val} is outside [-3.0, 3.0]")
            except (TypeError, ValueError):
                errors.append(f"{qid}: difficulty_parameter=[{dp}] is not numeric")

        # --- explanation non-empty ---
        expl = q.get("explanation", "")
        if not expl.strip():
            errors.append(f"{qid}: explanation is empty")
        elif len(expl.strip()) < 20:
            warnings.append(f"{qid}: explanation is very short ({len(expl)} chars)")

        # --- passage required for reading/fill-in tasks ---
        tt = q.get("task_type", "")
        task_counts[tt] = task_counts.get(tt, 0) + 1
        if tt in PASSAGE_TASK_TYPES:
            passage = q.get("passage", "")
            if not passage or not passage.strip():
                errors.append(f"{qid}: task_type=[{tt}] requires a non-empty passage")

        # --- question non-empty ---
        if not q.get("question", "").strip():
            errors.append(f"{qid}: question text is empty")

    # ----------------------------------------------------------------
    # PRINT REPORT
    # ----------------------------------------------------------------
    sep = "=" * 60
    print(sep)
    print("  KHKT ITEM BANK — VALIDATION REPORT")
    print(sep)
    print(f"  File     : {BANK_PATH}")
    print(f"  Schema   : {data.get('schema_version', 'N/A')}")
    print(f"  Total Qs : {len(qs)}")
    print()
    print("  Task Type Distribution:")
    for t, c in sorted(task_counts.items()):
        print(f"    {t:40s}: {c} câu")
    print()
    print("  Calibration Status Distribution:")
    for c, cnt in sorted(calib_counts.items()):
        print(f"    {c:20s}: {cnt} câu")
    print()

    if errors:
        print(f"  [FAIL] {len(errors)} ERROR(S) found:")
        for e in errors:
            print(f"    ✗ {e}")
    else:
        print("  [PASS] No errors found")

    if warnings:
        print(f"\n  {len(warnings)} WARNING(S):")
        for w in warnings:
            print(f"    ⚠ {w}")
    else:
        print("  No warnings")

    # ----------------------------------------------------------------
    # SPOT-CHECK: Print 5 random questions
    # ----------------------------------------------------------------
    print()
    print(sep)
    print("  SPOT-CHECK — 5 câu hỏi ngẫu nhiên")
    print(sep)

    sample_qs = random.sample(qs, min(5, len(qs)))
    for i, q in enumerate(sample_qs, 1):
        print(f"\n  [{i}] {q['item_id']} — {q.get('task_type','?')} | {q.get('cognitive_level','?')} | b={q.get('difficulty_parameter','?')}")
        print(f"      Câu hỏi: {q['question'][:120]}{'...' if len(q['question']) > 120 else ''}")
        print(f"      Đáp án đúng: {q['correct_answer']}")
        print(f"      Options: {[o[:30] for o in q.get('options',[])]}")
        print(f"      Giải thích: {q.get('explanation','')[:100]}...")
        passage = q.get("passage","")
        if passage:
            print(f"      Passage: [OK, {len(passage)} chars]")

    print()
    print(sep)
    if not errors:
        print("  RESULT: ALL VALIDATION CHECKS PASSED — Ready for Pha 2")
    else:
        print(f"  RESULT: {len(errors)} ERROR(S) MUST BE FIXED before Pha 2")
    print(sep)

    return len(errors)


if __name__ == "__main__":
    exit_code = run()
    sys.exit(exit_code)
