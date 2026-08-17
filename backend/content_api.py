import os
import json
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlmodel import Session, select
import google.generativeai as genai

from database import VocabularyTopic, VocabularyWord, IPASound, PronounceSentence, get_session, User
from auth_api import require_current_user, SECRET_KEY, ALGORITHM
from ai_services import clean_api_key

router = APIRouter(tags=["Content Management"])

# ─── PYDANTIC MODELS FOR REQUESTS ───────────────────────────────────────────

class TopicCreateRequest(BaseModel):
    title: str
    slug: Optional[str] = None
    description: str = ""
    image: str = ""
    grade: str = "10"
    is_active: bool = True

class WordCreateRequest(BaseModel):
    topic_id: int
    word: str
    ipa: str = ""
    reading: str = ""
    pos: str = ""
    meaning: str = ""
    example: str = ""
    example_vi: str = ""
    is_active: bool = True

class IPASoundCreateRequest(BaseModel):
    symbol: str
    name: str
    sound_type: str = "vowel"
    example_word: str = ""
    example_phonetic: str = ""
    mouth_guide: str = ""
    is_active: bool = True

class PronounceSentenceCreateRequest(BaseModel):
    text: str
    level_grade: str = "10"
    difficulty: float = 0.0
    is_active: bool = True

class AIGenerateRequest(BaseModel):
    word: str
    grade: str = "10"

# ─── ROLE VERIFICATION UTILITY ──────────────────────────────────────────────

def require_admin_or_teacher(user: User = Depends(require_current_user)):
    if user.role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Quyền truy cập bị từ chối. Chỉ dành cho Giáo viên hoặc Quản trị viên."
        )
    return user

# Helper to slugify string
def slugify(text: str) -> str:
    text = text.lower().strip()
    vietnamese_map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd'
    }
    for char, repl in vietnamese_map.items():
        text = text.replace(char, repl)
    text = re.sub(r'[^a-z0-9\- ]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# ─── VOCABULARY TOPICS CRUD ──────────────────────────────────────────────────

@router.get("/content/vocab/topics")
async def get_vocab_topics(grade: Optional[str] = None, db: Session = Depends(get_session)):
    query = select(VocabularyTopic)
    if grade:
        query = query.where(VocabularyTopic.grade == grade)
    topics = db.exec(query.order_by(VocabularyTopic.id)).all()
    return {"status": "success", "data": topics}

@router.get("/content/vocab/topics/{topic_id}")
async def get_vocab_topic_detail(topic_id: int, db: Session = Depends(get_session)):
    topic = db.get(VocabularyTopic, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Không tìm thấy chủ đề từ vựng")
    return {"status": "success", "data": topic}

@router.post("/content/vocab/topics")
async def create_vocab_topic(
    request: TopicCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    slug_val = request.slug.strip() if request.slug else slugify(request.title)
    existing = db.exec(select(VocabularyTopic).where(VocabularyTopic.slug == slug_val)).first()
    if existing:
        slug_val = f"{slug_val}-{len(db.exec(select(VocabularyTopic)).all()) + 1}"

    topic = VocabularyTopic(
        title=request.title.strip(),
        slug=slug_val,
        description=request.description.strip(),
        image=request.image.strip(),
        grade=request.grade.strip(),
        is_active=request.is_active
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return {"status": "success", "message": "Đã tạo chủ đề từ vựng mới", "data": topic}

@router.put("/content/vocab/topics/{topic_id}")
async def update_vocab_topic(
    topic_id: int,
    request: TopicCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    topic = db.get(VocabularyTopic, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Không tìm thấy chủ đề từ vựng")
    
    slug_val = request.slug.strip() if request.slug else slugify(request.title)
    topic.title = request.title.strip()
    topic.slug = slug_val
    topic.description = request.description.strip()
    topic.image = request.image.strip()
    topic.grade = request.grade.strip()
    topic.is_active = request.is_active

    db.add(topic)
    db.commit()
    db.refresh(topic)
    return {"status": "success", "message": "Đã cập nhật chủ đề từ vựng", "data": topic}

@router.delete("/content/vocab/topics/{topic_id}")
async def delete_vocab_topic(
    topic_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    topic = db.get(VocabularyTopic, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Không tìm thấy chủ đề từ vựng")
    
    words = db.exec(select(VocabularyWord).where(VocabularyWord.topic_id == topic_id)).all()
    for w in words:
        db.delete(w)
        
    db.delete(topic)
    db.commit()
    return {"status": "success", "message": f"Đã xóa chủ đề từ vựng '{topic.title}' và toàn bộ từ liên quan."}

# ─── VOCABULARY WORDS CRUD ───────────────────────────────────────────────────

@router.get("/content/vocab/words")
async def get_vocab_words(
    topic_id: Optional[int] = None,
    grade: Optional[str] = None,
    db: Session = Depends(get_session)
):
    if topic_id:
        words = db.exec(select(VocabularyWord).where(VocabularyWord.topic_id == topic_id).order_by(VocabularyWord.id)).all()
    elif grade:
        topics = db.exec(select(VocabularyTopic).where(VocabularyTopic.grade == grade)).all()
        topic_ids = [t.id for t in topics]
        if not topic_ids:
            return {"status": "success", "data": []}
        words = db.exec(select(VocabularyWord).where(VocabularyWord.topic_id.in_(topic_ids)).order_by(VocabularyWord.id)).all()
    else:
        words = db.exec(select(VocabularyWord).order_by(VocabularyWord.id)).all()
    
    return {"status": "success", "data": words}

@router.get("/content/vocab/words/{word_id}")
async def get_vocab_word_detail(word_id: int, db: Session = Depends(get_session)):
    word = db.get(VocabularyWord, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng")
    return {"status": "success", "data": word}

@router.post("/content/vocab/words")
async def create_vocab_word(
    request: WordCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    topic = db.get(VocabularyTopic, request.topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Không tìm thấy chủ đề từ vựng đã chọn")

    word = VocabularyWord(
        topic_id=request.topic_id,
        word=request.word.strip(),
        ipa=request.ipa.strip(),
        reading=request.reading.strip(),
        pos=request.pos.strip(),
        meaning=request.meaning.strip(),
        example=request.example.strip(),
        example_vi=request.example_vi.strip(),
        is_active=request.is_active
    )
    db.add(word)
    db.commit()
    db.refresh(word)
    return {"status": "success", "message": "Đã thêm từ vựng mới", "data": word}

@router.put("/content/vocab/words/{word_id}")
async def update_vocab_word(
    word_id: int,
    request: WordCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    word = db.get(VocabularyWord, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng")

    word.topic_id = request.topic_id
    word.word = request.word.strip()
    word.ipa = request.ipa.strip()
    word.reading = request.reading.strip()
    word.pos = request.pos.strip()
    word.meaning = request.meaning.strip()
    word.example = request.example.strip()
    word.example_vi = request.example_vi.strip()
    word.is_active = request.is_active

    db.add(word)
    db.commit()
    db.refresh(word)
    return {"status": "success", "message": "Đã cập nhật từ vựng", "data": word}

@router.delete("/content/vocab/words/{word_id}")
async def delete_vocab_word(
    word_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    word = db.get(VocabularyWord, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng")

    db.delete(word)
    db.commit()
    return {"status": "success", "message": f"Đã xóa từ vựng '{word.word}'."}

# ─── IPA SOUNDS CRUD ─────────────────────────────────────────────────────────

@router.get("/content/ipa/sounds")
async def get_ipa_sounds(db: Session = Depends(get_session)):
    sounds = db.exec(select(IPASound).order_by(IPASound.id)).all()
    return {"status": "success", "data": sounds}

@router.post("/content/ipa/sounds")
async def create_ipa_sound(
    request: IPASoundCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    existing = db.exec(select(IPASound).where(IPASound.symbol == request.symbol.strip())).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Ký hiệu âm IPA '{request.symbol}' đã tồn tại.")

    sound = IPASound(
        symbol=request.symbol.strip(),
        name=request.name.strip(),
        sound_type=request.sound_type.strip(),
        example_word=request.example_word.strip(),
        example_phonetic=request.example_phonetic.strip(),
        mouth_guide=request.mouth_guide.strip(),
        is_active=request.is_active
    )
    db.add(sound)
    db.commit()
    db.refresh(sound)
    return {"status": "success", "message": "Đã thêm âm IPA mới", "data": sound}

@router.put("/content/ipa/sounds/{sound_id}")
async def update_ipa_sound(
    sound_id: int,
    request: IPASoundCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    sound = db.get(IPASound, sound_id)
    if not sound:
        raise HTTPException(status_code=404, detail="Không tìm thấy âm IPA")

    sound.symbol = request.symbol.strip()
    sound.name = request.name.strip()
    sound.sound_type = request.sound_type.strip()
    sound.example_word = request.example_word.strip()
    sound.example_phonetic = request.example_phonetic.strip()
    sound.mouth_guide = request.mouth_guide.strip()
    sound.is_active = request.is_active

    db.add(sound)
    db.commit()
    db.refresh(sound)
    return {"status": "success", "message": "Đã cập nhật âm IPA", "data": sound}

@router.delete("/content/ipa/sounds/{sound_id}")
async def delete_ipa_sound(
    sound_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    sound = db.get(IPASound, sound_id)
    if not sound:
        raise HTTPException(status_code=404, detail="Không tìm thấy âm IPA")

    db.delete(sound)
    db.commit()
    return {"status": "success", "message": f"Đã xóa âm IPA '{sound.symbol}'."}

# ─── PRONUNCIATION SENTENCES CRUD ───────────────────────────────────────────

@router.get("/content/pronounce/sentences")
async def get_pronounce_sentences(grade: Optional[str] = None, db: Session = Depends(get_session)):
    query = select(PronounceSentence)
    if grade:
        query = query.where(PronounceSentence.level_grade == grade)
    sentences = db.exec(query.order_by(PronounceSentence.id)).all()
    return {"status": "success", "data": sentences}

@router.post("/content/pronounce/sentences")
async def create_pronounce_sentence(
    request: PronounceSentenceCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    sentence = PronounceSentence(
        text=request.text.strip(),
        level_grade=request.level_grade.strip(),
        difficulty=request.difficulty,
        is_active=request.is_active
    )
    db.add(sentence)
    db.commit()
    db.refresh(sentence)
    return {"status": "success", "message": "Đã thêm câu luyện phát âm mới", "data": sentence}

@router.put("/content/pronounce/sentences/{sentence_id}")
async def update_pronounce_sentence(
    sentence_id: int,
    request: PronounceSentenceCreateRequest,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    sentence = db.get(PronounceSentence, sentence_id)
    if not sentence:
        raise HTTPException(status_code=404, detail="Không tìm thấy câu phát âm")

    sentence.text = request.text.strip()
    sentence.level_grade = request.level_grade.strip()
    sentence.difficulty = request.difficulty
    sentence.is_active = request.is_active

    db.add(sentence)
    db.commit()
    db.refresh(sentence)
    return {"status": "success", "message": "Đã cập nhật câu phát âm", "data": sentence}

@router.delete("/content/pronounce/sentences/{sentence_id}")
async def delete_pronounce_sentence(
    sentence_id: int,
    db: Session = Depends(get_session),
    current_user: User = Depends(require_admin_or_teacher)
):
    sentence = db.get(PronounceSentence, sentence_id)
    if not sentence:
        raise HTTPException(status_code=404, detail="Không tìm thấy câu phát âm")

    db.delete(sentence)
    db.commit()
    return {"status": "success", "message": "Đã xóa câu phát âm."}

# ─── AI METADATA GENERATOR (GEMINI) ──────────────────────────────────────────

@router.post("/content/ai-generate-word-metadata")
async def ai_generate_word_metadata(
    request: AIGenerateRequest,
    x_gemini_key: Optional[str] = Header(None),
    current_user: User = Depends(require_admin_or_teacher)
):
    word = request.word.strip()
    grade = request.grade.strip()
    
    active_key = clean_api_key(x_gemini_key) or clean_api_key(os.getenv("GEMINI_API_KEY"))
    if not active_key:
        raise HTTPException(
            status_code=400,
            detail="Chưa cấu hình API Key cho Gemini AI. Hãy nhập key trong cài đặt của Web."
        )

    try:
        genai.configure(api_key=active_key)
        
        system_instruction = (
            "You are a lexicographer. Given an English word, you must generate its dictionary details in JSON format. "
            "You MUST respond ONLY with a raw JSON object. Do not wrap it in ```json ... ``` blocks, do not add any markdown, "
            "no leading/trailing whitespace, and no comments. "
            "The JSON object MUST contain the following keys exactly: "
            "'ipa', 'reading', 'pos', 'meaning', 'example', 'example_vi'.\n"
            "- 'ipa': Standard IPA phonetic transcription (e.g. /kəˈlæb.ə.reɪt/)\n"
            "- 'reading': Approximate phonetics written in Vietnamese capital letters separated by hyphens (e.g. 'cơ-LA-bơ-rây-t')\n"
            "- 'pos': Part of speech in Vietnamese (e.g. 'Danh từ (n.)', 'Động từ (v.)', 'Tính từ (adj.)')\n"
            "- 'meaning': Vietnamese definition of the word\n"
            "- 'example': An English example sentence containing the word, written at a vocabulary level appropriate for Grade {grade} students in Vietnam.\n"
            "- 'example_vi': Vietnamese translation of the example sentence."
        ).format(grade=grade)

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )
        
        prompt = f"Word: '{word}' for student grade: {grade}."
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        data = json.loads(text)
        return {"status": "success", "word": word, "metadata": data}
        
    except json.JSONDecodeError as je:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi phân tích cú pháp từ AI: Trả về không đúng định dạng JSON. Chi tiết phản hồi: {response.text[:200]}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi gọi Gemini API để sinh từ vựng: {str(e)}"
        )
