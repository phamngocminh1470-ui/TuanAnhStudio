"""
================================================================================
KHKT PROJECT - MO PHONG THUAT TOAN DANH GIA THICH UNG IRT VA LAP LAI NGAT QUANG SM-2
Tac gia: Nhom NCKH Hoc sinh THPT
Mo ta: File Python chay mo phong doc lap thuat toan cot loi IRT 3PL va SuperMemo-2 (SM-2)
================================================================================
"""

import sys
import math
import random
from typing import List, Tuple, Optional

# Cau hinh encoding cho Windows Terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from adaptive_learning import IRTEngine, IRTQuestion, SpacedRepetitionEngine


def run_adaptive_simulation():
    print("=" * 80)
    print("  MO PHONG THUAT TOAN DANH GIA THICH UNG IRT (3PL) & SPACED REPETITION (SM-2)")
    print("=" * 80)
    print("Muc tiêu: Danh gia thich ung nang luc noi tieng Anh (Theta) & Len lich on tap toi uu.\n")

    # 1. Khoi tao kho cau hoi thu nghiem (Pool gom 11 cau voi do kho IRT b tu -2.5 den +2.5)
    question_pool = [
        IRTQuestion(item_id="Q101", difficulty=-2.5, discrimination=1.2, guessing=0.2),
        IRTQuestion(item_id="Q102", difficulty=-2.0, discrimination=1.1, guessing=0.2),
        IRTQuestion(item_id="Q103", difficulty=-1.5, discrimination=1.3, guessing=0.2),
        IRTQuestion(item_id="Q104", difficulty=-1.0, discrimination=1.0, guessing=0.2),
        IRTQuestion(item_id="Q105", difficulty=-0.5, discrimination=1.4, guessing=0.2),
        IRTQuestion(item_id="Q106", difficulty=0.0,  discrimination=1.2, guessing=0.2),
        IRTQuestion(item_id="Q107", difficulty=0.5,  discrimination=1.5, guessing=0.2),
        IRTQuestion(item_id="Q108", difficulty=1.0,  discrimination=1.1, guessing=0.2),
        IRTQuestion(item_id="Q109", difficulty=1.5,  discrimination=1.3, guessing=0.2),
        IRTQuestion(item_id="Q110", difficulty=2.0,  discrimination=1.4, guessing=0.2),
        IRTQuestion(item_id="Q111", difficulty=2.5,  discrimination=1.2, guessing=0.2),
    ]

    # 2. Thiet lap trang thai ban dau cua hoc sinh
    current_theta = 0.0  # Nang luc ban dau = 0.0 (Muc Dat A2)
    history = []
    excluded_ids = []
    
    # Trang thai SM-2 ban dau
    current_repetition = 0
    current_ef = 2.5
    current_interval = 1

    print(f"[*] Nang luc ban dau (Theta): {current_theta:.3f} (Muc A2 - Trung binh)")
    print(f"[*] He so de ban dau (Easiness Factor): {current_ef:.2f}")
    print("-" * 80)
    print(f"{'Luot':<5} | {'Ma cau':<8} | {'Do kho (b)':<10} | {'Diem doc':<10} | {'Ket qua':<8} | {'Theta moi':<10} | {'K.Cach on (ngay)':<18} | {'EF moi':<8}")
    print("-" * 80)

    # Gia lap 8 luot tra loi cua hoc sinh
    simulated_scores = [88, 75, 92, 55, 82, 65, 90, 78]

    for step, score in enumerate(simulated_scores, start=1):
        # Buoc A: Chon cau hoi tiep theo co thong tin Fisher lon nhat tai current_theta
        next_question = IRTEngine.select_next_question(current_theta, question_pool, excluded_ids)
        
        if not next_question:
            print("[!] Da hoan thanh toan bo cau hoi trong kho.")
            break

        excluded_ids.append(next_question.item_id)

        # Buoc B: Danh gia ket qua (Diem so >= 70 -> Tra loi Dung = 1, nguoc lai = 0)
        is_correct = 1 if score >= 70 else 0
        result_str = "DUNG (1)" if is_correct == 1 else "SAI (0)"

        # Cap nhat lich su lam bai IRT
        history.append((next_question, is_correct))

        # Buoc C: Uoc luong lai nang luc Theta moi bang thuat toan IRT EAP
        new_theta = IRTEngine.estimate_ability_eap(history)

        # Buoc D: Quy doi diem so phat am sang thang diem chat luong SM-2 (0 - 5)
        if score >= 85:
            quality = 5
        elif score >= 70:
            quality = 4
        elif score >= 55:
            quality = 3
        elif score >= 40:
            quality = 2
        else:
            quality = 1

        # Buoc E: Tinh toan khoang thoi gian lap ngat quang tiep theo theo thuat toan SM-2
        next_interval, new_ef, new_rep = SpacedRepetitionEngine.calculate_next_review(
            quality=quality,
            current_repetition=current_repetition,
            current_ef=current_ef,
            current_interval=current_interval
        )

        # Cap nhat bien cho luot tiep theo
        current_theta = new_theta
        current_ef = new_ef
        current_interval = next_interval
        current_repetition = new_rep

        # In dong ket qua
        print(f"{step:<5} | {next_question.item_id:<8} | {next_question.b:<10.2f} | {score:<10} | {result_str:<8} | {new_theta:<10.3f} | Sau {next_interval:<14} | {new_ef:<8.2f}")

    print("-" * 80)
    print("\n[KET QUA MO PHONG TONG HOP]:")
    print(f" - Nang luc uoc luong cuoi cùng (Theta): {current_theta:.3f}")
    level_classification = "Yeu (A1)" if current_theta < -1.0 else ("Dat (A2)" if current_theta < 0.5 else ("Kha (B1)" if current_theta < 1.8 else "Xuat sac (B2)"))
    print(f" - Phan cap trinh do hoc sinh: {level_classification}")
    print(f" - He so thich ung Easiness Factor (EF): {current_ef:.2f}")
    print(f" - Lich on tap ngat quang toi uu cho lan tiep theo: Sau {current_interval} ngay")
    print("=" * 80)


if __name__ == "__main__":
    run_adaptive_simulation()
