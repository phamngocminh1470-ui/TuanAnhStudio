import asyncio
import os
import sys

# Đảm bảo in ra màn hình console Windows không bị lỗi font Unicode
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
from ai_services import chat_with_gemini, text_to_speech

load_dotenv()

async def test():
    print("=== THỬ NGHIỆM KẾT NỐI API ===")
    
    # 1. Test Gemini
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("[WARNING] GEMINI_API_KEY chưa cấu hình.")
    else:
        print("[INFO] Đang kết nối tới Gemini 1.5 Flash...")
        messages = [{"role": "user", "content": "Hello, introduce yourself briefly as an English Mentor."}]
        system_instruction = "You are a friendly AI English Mentor."
        reply = await chat_with_gemini(messages, system_instruction)
        print(f"[SUCCESS] Gemini phản hồi: {reply}")
        
    # 2. Test Text-to-Speech
    print("\n[INFO] Đang test chuyển văn bản thành giọng nói...")
    try:
        sample_text = "Welcome to the AI English Mentor. Let's practice speaking English together."
        audio_data = await text_to_speech(sample_text)
        print(f"[SUCCESS] Đã tạo file giọng nói thành công ({len(audio_data)} bytes).")
        
        # Ghi ra file audio test
        output_path = os.path.join(os.path.dirname(__file__), "test_voice.mp3")
        with open(output_path, "wb") as f:
            f.write(audio_data)
        print(f"[INFO] Đã lưu file âm thanh mẫu để bạn nghe thử tại: {output_path}")
    except Exception as e:
        print(f"[ERROR] Thử nghiệm TTS thất bại: {e}")

if __name__ == "__main__":
    asyncio.run(test())
