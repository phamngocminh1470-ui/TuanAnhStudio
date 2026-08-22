import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Play, Mic, Square, Volume2, Award, RefreshCw, ChevronRight, ChevronLeft, HelpCircle, BookOpen, Sparkles, Plus, Wand2, Shuffle, AlertTriangle } from 'lucide-react';

const API_BASE = '/api';

// Ngân hàng câu hỏi chấm phát âm Tiếng Anh phân loại theo cấp độ (15 - 20 câu mỗi trình độ)
// Được gán kèm thông số độ khó IRT difficulty (b) từ -2.5 (dễ) đến +3.4 (rất khó)
const SENTENCES_BY_GRADE = {
  "6": [
    { id: 101, text: "Hello, my name is Nam and I am in grade six.", level: "Lớp 6 - U1: Dễ (IRT: -2.5)", difficulty: -2.5 },
    { id: 102, text: "My new school has a large playground and a modern library.", level: "Lớp 6 - U1: Dễ (IRT: -2.3)", difficulty: -2.3 },
    { id: 103, text: "We have English lessons on Mondays and Wednesdays.", level: "Lớp 6 - U1: Dễ (IRT: -2.1)", difficulty: -2.1 },
    { id: 104, text: "My favorite subject is Art because I love drawing pictures.", level: "Lớp 6 - U1: Dễ (IRT: -1.9)", difficulty: -1.9 },
    { id: 105, text: "There are four people in my family: parents, my brother, and me.", level: "Lớp 6 - U2: Dễ (IRT: -1.7)", difficulty: -1.7 },
    { id: 106, text: "We live in a small town house near a quiet river.", level: "Lớp 6 - U2: Dễ (IRT: -1.5)", difficulty: -1.5 },
    { id: 107, text: "I often play football with my classmates after school.", level: "Lớp 6 - U3: TB (IRT: -1.3)", difficulty: -1.3 },
    { id: 108, text: "We should brush our teeth twice a day to keep them healthy.", level: "Lớp 6 - U3: TB (IRT: -1.1)", difficulty: -1.1 },
    { id: 109, text: "My bedroom has a big window, a desk, and a wardrobe.", level: "Lớp 6 - U2: TB (IRT: -0.9)", difficulty: -0.9 },
    { id: 110, text: "Eating healthy food like vegetables helps us stay strong and active.", level: "Lớp 6 - U3: TB (IRT: -0.7)", difficulty: -0.7 },
    { id: 111, text: "My mother is an English teacher and she works very hard.", level: "Lớp 6 - U3: TB (IRT: -0.5)", difficulty: -0.5 },
    { id: 112, text: "Vietnamese children love celebrating Mid-Autumn Festival in autumn.", level: "Lớp 6 - U4: Khó (IRT: -0.3)", difficulty: -0.3 },
    { id: 113, text: "We should put trash in the dustbin to keep our school clean.", level: "Lớp 6 - U4: Khó (IRT: -0.1)", difficulty: -0.1 },
    { id: 114, text: "I usually do my homework and prepare lessons before having dinner.", level: "Lớp 6 - U5: Khó (IRT: 0.1)", difficulty: 0.1 },
    { id: 115, text: "How do you go to school every day, by bicycle or on foot?", level: "Lớp 6 - U5: Rất Khó (IRT: 0.3)", difficulty: 0.3 }
  ],
  "7": [
    { id: 201, text: "My favorite hobby is collecting beautiful paper models.", level: "Lớp 7 - U1: Dễ (IRT: -2.0)", difficulty: -2.0 },
    { id: 202, text: "Doing community service helps us feel more responsible for society.", level: "Lớp 7 - U2: Dễ (IRT: -1.8)", difficulty: -1.8 },
    { id: 203, text: "Eating fresh fruit and vegetables provides you with essential vitamins.", level: "Lớp 7 - U3: Dễ (IRT: -1.6)", difficulty: -1.6 },
    { id: 204, text: "Vietnamese traditional food like Pho is very popular worldwide.", level: "Lớp 7 - U4: Dễ (IRT: -1.4)", difficulty: -1.4 },
    { id: 205, text: "We should avoid drinking too many sweetened carbonated beverages.", level: "Lớp 7 - U3: Dễ (IRT: -1.2)", difficulty: -1.2 },
    { id: 206, text: "Donating warm clothes to homeless children is a meaningful activity.", level: "Lớp 7 - U2: Dễ (IRT: -1.0)", difficulty: -1.0 },
    { id: 207, text: "Littering in public places harms the environment and local scenery.", level: "Lớp 7 - U2: TB (IRT: -0.8)", difficulty: -0.8 },
    { id: 208, text: "We should balance our eating habits and do exercise daily.", level: "Lớp 7 - U3: TB (IRT: -0.6)", difficulty: -0.6 },
    { id: 209, text: "Music and arts make our lives more colorful and interesting.", level: "Lớp 7 - U4: TB (IRT: -0.4)", difficulty: -0.4 },
    { id: 210, text: "My sister spends two hours playing the piano every weekend.", level: "Lớp 7 - U4: TB (IRT: -0.2)", difficulty: -0.2 },
    { id: 211, text: "Volunteers help elderly people with their shopping and house cleaning.", level: "Lớp 7 - U2: TB (IRT: 0.0)", difficulty: 0.0 },
    { id: 212, text: "Staying up late playing video games is bad for your health.", level: "Lớp 7 - U3: Khó (IRT: 0.2)", difficulty: 0.2 },
    { id: 213, text: "Green lifestyle is becoming more popular among young students today.", level: "Lớp 7 - U5: Khó (IRT: 0.4)", difficulty: 0.4 },
    { id: 214, text: "Doing outdoor activities keeps you fit and reduces academic stress.", level: "Lớp 7 - U5: Khó (IRT: 0.6)", difficulty: 0.6 },
    { id: 215, text: "She wants to join the local club to protect wild animals.", level: "Lớp 7 - U5: Rất Khó (IRT: 0.8)", difficulty: 0.8 }
  ],
  "8": [
    { id: 301, text: "Country life is extremely peaceful, simple, and healthy.", level: "Lớp 8 - U1: Dễ (IRT: -1.5)", difficulty: -1.5 },
    { id: 302, text: "People in the highlands are friendly and hospitable to visitors.", level: "Lớp 8 - U2: Dễ (IRT: -1.3)", difficulty: -1.3 },
    { id: 303, text: "We love participating in traditional folk games at local festivals.", level: "Lớp 8 - U3: Dễ (IRT: -1.1)", difficulty: -1.1 },
    { id: 304, text: "Water pollution can cause severe diseases for local communities.", level: "Lớp 8 - U4: Dễ (IRT: -0.9)", difficulty: -0.9 },
    { id: 305, text: "Protecting natural habitats is the best way to save endangered animals.", level: "Lớp 8 - U4: Dễ (IRT: -0.7)", difficulty: -0.7 },
    { id: 306, text: "Online learning platforms provide flexible study schedules for high school students.", level: "Lớp 8 - U5: TB (IRT: -0.5)", difficulty: -0.5 },
    { id: 307, text: "Modern technology has changed our communication habits and lifestyle.", level: "Lớp 8 - U5: TB (IRT: -0.3)", difficulty: -0.3 },
    { id: 308, text: "People in big cities suffer from heavy traffic jams every day.", level: "Lớp 8 - U1: TB (IRT: -0.1)", difficulty: -0.1 },
    { id: 309, text: "Traditional crafts are passed down from generation to generation in families.", level: "Lớp 8 - U2: TB (IRT: 0.1)", difficulty: 0.1 },
    { id: 310, text: "Natural disasters like floods can destroy houses, roads, and crops.", level: "Lớp 8 - U3: TB (IRT: 0.3)", difficulty: 0.3 },
    { id: 311, text: "Ethnic minority groups in Vietnam have their own unique customs.", level: "Lớp 8 - U2: TB (IRT: 0.5)", difficulty: 0.5 },
    { id: 312, text: "Life in a megacity can be stressful due to noise pollution.", level: "Lớp 8 - U1: Khó (IRT: 0.7)", difficulty: 0.7 },
    { id: 313, text: "We should recycle plastic bottles and tin cans to reduce waste.", level: "Lớp 8 - U4: Khó (IRT: 0.9)", difficulty: 0.9 },
    { id: 314, text: "She enjoys reading books about history, space, and computer science.", level: "Lớp 8 - U5: Khó (IRT: 1.1)", difficulty: 1.1 },
    { id: 315, text: "The historic monument attracts millions of international tourists annually.", level: "Lớp 8 - U3: Rất Khó (IRT: 1.3)", difficulty: 1.3 }
  ],
  "9": [
    { id: 401, text: "Learning English helps us communicate with foreign friends easily.", level: "Lớp 9 - U1: Dễ (IRT: -1.0)", difficulty: -1.0 },
    { id: 402, text: "Technology plays an important role in modern classrooms.", level: "Lớp 9 - U2: Dễ (IRT: -0.8)", difficulty: -0.8 },
    { id: 403, text: "We must preserve natural wonders for our future generations.", level: "Lớp 9 - U3: Dễ (IRT: -0.6)", difficulty: -0.6 },
    { id: 404, text: "Eco-tourism encourages local people to protect wild animals.", level: "Lớp 9 - U3: Dễ (IRT: -0.4)", difficulty: -0.4 },
    { id: 405, text: "Air pollution is becoming a critical problem in megacities.", level: "Lớp 9 - U4: TB (IRT: -0.2)", difficulty: -0.2 },
    { id: 406, text: "Developing critical thinking skills is vital for academic success.", level: "Lớp 9 - U5: TB (IRT: 0.0)", difficulty: 0.0 },
    { id: 407, text: "High school students should limit their daily social media usage.", level: "Lớp 9 - U2: TB (IRT: 0.2)", difficulty: 0.2 },
    { id: 408, text: "She wants to study abroad to experience different cultures.", level: "Lớp 9 - U1: TB (IRT: 0.4)", difficulty: 0.4 },
    { id: 409, text: "Public transport is an effective solution to traffic congestion.", level: "Lớp 9 - U4: TB (IRT: 0.6)", difficulty: 0.6 },
    { id: 410, text: "Biodiversity is crucial for maintaining global ecological balance.", level: "Lớp 9 - U3: TB (IRT: 0.8)", difficulty: 0.8 },
    { id: 411, text: "Students should learn how to manage their stress before exams.", level: "Lớp 9 - U5: Khó (IRT: 1.0)", difficulty: 1.0 },
    { id: 412, text: "Renewable energy sources like solar power are sustainable.", level: "Lớp 9 - U4: Khó (IRT: 1.2)", difficulty: 1.2 },
    { id: 413, text: "Career guidance services help high school students make better choices.", level: "Lớp 9 - U5: Khó (IRT: 1.4)", difficulty: 1.4 },
    { id: 414, text: "Preserving historical heritages requires active community cooperation.", level: "Lớp 9 - U3: Khó (IRT: 1.6)", difficulty: 1.6 },
    { id: 415, text: "The rapid growth of cities leads to high demand for housing.", level: "Lớp 9 - U4: Rất Khó (IRT: 1.8)", difficulty: 1.8 }
  ],
  "10": [
    { id: 501, text: "Helping with household chores contributes to family happiness.", level: "Lớp 10 - U1: Dễ (IRT: -0.5)", difficulty: -0.5 },
    { id: 502, text: "Reducing carbon footprint is essential to fight climate change.", level: "Lớp 10 - U2: Dễ (IRT: -0.3)", difficulty: -0.3 },
    { id: 503, text: "Independent teenagers know how to manage pocket money well.", level: "Lớp 10 - U3: Dễ (IRT: -0.1)", difficulty: -0.1 },
    { id: 504, text: "We should balance academic study and entertainment activities.", level: "Lớp 10 - U1: TB (IRT: 0.1)", difficulty: 0.1 },
    { id: 505, text: "Eco-friendly products like reusable bags are highly recommended.", level: "Lớp 10 - U2: TB (IRT: 0.3)", difficulty: 0.3 },
    { id: 506, text: "Cultural diversity is shown through traditional clothing and festivals.", level: "Lớp 10 - U4: TB (IRT: 0.5)", difficulty: 0.5 },
    { id: 507, text: "Gender equality ensures equal opportunities for men and women.", level: "Lớp 10 - U5: TB (IRT: 0.7)", difficulty: 0.7 },
    { id: 508, text: "Organic farming methods avoid using harmful chemical fertilizers.", level: "Lớp 10 - U2: TB (IRT: 0.9)", difficulty: 0.9 },
    { id: 509, text: "Greenhouse gases trap heat and warm the earth's atmosphere.", level: "Lớp 10 - U2: TB (IRT: 1.1)", difficulty: 1.1 },
    { id: 510, text: "Community service projects improve local infrastructure and clean streets.", level: "Lớp 10 - U3: TB (IRT: 1.3)", difficulty: 1.3 },
    { id: 511, text: "Time management skills help you complete academic tasks on time.", level: "Lớp 10 - U1: Khó (IRT: 1.5)", difficulty: 1.5 },
    { id: 512, text: "Sustainable tourism minimizes negative impacts on local nature environments.", level: "Lớp 10 - U2: Khó (IRT: 1.7)", difficulty: 1.7 },
    { id: 513, text: "Participating in youth organizations fosters leadership and communication.", level: "Lớp 10 - U3: Khó (IRT: 1.9)", difficulty: 1.9 },
    { id: 514, text: "Digital literacy is an essential skill for modern young workers.", level: "Lớp 10 - U5: Khó (IRT: 2.1)", difficulty: 2.1 },
    { id: 515, text: "Family support is a strong foundation for children's positive growth.", level: "Lớp 10 - U1: Rất Khó (IRT: 2.3)", difficulty: 2.3 }
  ],
  "11": [
    { id: 601, text: "Generation gap is a common issue in traditional asian families.", level: "Lớp 11 - U1: Dễ (IRT: 0.0)", difficulty: 0.0 },
    { id: 602, text: "Healthy relationships with peers are crucial for teenager mental health.", level: "Lớp 11 - U2: Dễ (IRT: 0.2)", difficulty: 0.2 },
    { id: 603, text: "Volunteer work helps students develop soft skills and empathy.", level: "Lớp 11 - U3: Dễ (IRT: 0.4)", difficulty: 0.4 },
    { id: 604, text: "Energy conservation reduces electricity bills and saves national resources.", level: "Lớp 11 - U4: TB (IRT: 0.6)", difficulty: 0.6 },
    { id: 605, text: "Sustainable development models balance growth and environmental protection.", level: "Lớp 11 - U4: TB (IRT: 0.8)", difficulty: 0.8 },
    { id: 606, text: "Vocational schools offer practical training courses for technical jobs.", level: "Lớp 11 - U5: TB (IRT: 1.0)", difficulty: 1.0 },
    { id: 607, text: "Social media usage has a huge impact on teenager behavior.", level: "Lớp 11 - U2: TB (IRT: 1.2)", difficulty: 1.2 },
    { id: 608, text: "Mental health awareness should be promoted in all public schools.", level: "Lớp 11 - U2: TB (IRT: 1.4)", difficulty: 1.4 },
    { id: 609, text: "ASEAN members cooperate actively in economic and cultural fields.", level: "Lớp 11 - U3: TB (IRT: 1.6)", difficulty: 1.6 },
    { id: 610, text: "Urbanization attracts young people to look for better job opportunities.", level: "Lớp 11 - U4: TB (IRT: 1.8)", difficulty: 1.8 },
    { id: 611, text: "Distance learning has become popular after the global pandemic.", level: "Lớp 11 - U5: Khó (IRT: 2.0)", difficulty: 2.0 },
    { id: 612, text: "Peer pressure can motivate students to perform better in study.", level: "Lớp 11 - U2: Khó (IRT: 2.2)", difficulty: 2.2 },
    { id: 613, text: "Protecting historical sites preserves national identity and attracts tourists.", level: "Lớp 11 - U3: Khó (IRT: 2.4)", difficulty: 2.4 },
    { id: 614, text: "Modern education systems focus on critical thinking and technological innovation.", level: "Lớp 11 - U5: Khó (IRT: 2.6)", difficulty: 2.6 },
    { id: 615, text: "Intercultural communication reduces social prejudices and unnecessary conflicts.", level: "Lớp 11 - U3: Rất Khó (IRT: 2.8)", difficulty: 2.8 }
  ],
  "12": [
    { id: 701, text: "Artificial intelligence is transforming global communication and economy.", level: "Lớp 12 - U1: Dễ (IRT: 0.5)", difficulty: 0.5 },
    { id: 702, text: "Lifelong learning helps seniors adapt to rapid technology changes.", level: "Lớp 12 - U2: Dễ (IRT: 0.7)", difficulty: 0.7 },
    { id: 703, text: "Green lifestyle involves recycling organic wastes and clean energy.", level: "Lớp 12 - U3: Dễ (IRT: 0.9)", difficulty: 0.9 },
    { id: 704, text: "Globalization promotes international trade and global economic integration.", level: "Lớp 12 - U4: TB (IRT: 1.1)", difficulty: 1.1 },
    { id: 705, text: "Robots are replacing human labors in repetitive manufacturing factories.", level: "Lớp 12 - U1: TB (IRT: 1.3)", difficulty: 1.3 },
    { id: 706, text: "Preserving national heritage promotes tourism and local cultural pride.", level: "Lớp 12 - U3: TB (IRT: 1.5)", difficulty: 1.5 },
    { id: 707, text: "Higher education opens up diverse career opportunities for graduates.", level: "Lớp 12 - U2: TB (IRT: 1.7)", difficulty: 1.7 },
    { id: 708, text: "The modern job market demands specialized technical skills and adaptability.", level: "Lớp 12 - U2: TB (IRT: 1.9)", difficulty: 1.9 },
    { id: 709, text: "Macroeconomic policies aim to control high inflation and encourage growth.", level: "Lớp 12 - U4: TB (IRT: 2.1)", difficulty: 2.1 },
    { id: 710, text: "Digital economy creates many new business models and job vacancies.", level: "Lớp 12 - U1: TB (IRT: 2.3)", difficulty: 2.3 },
    { id: 711, text: "Biotechnology plays a vital role in developing modern medical treatments.", level: "Lớp 12 - U5: Khó (IRT: 2.5)", difficulty: 2.5 },
    { id: 712, text: "Global warming threatens coastal cities with rising sea levels annually.", level: "Lớp 12 - U3: Khó (IRT: 2.7)", difficulty: 2.7 },
    { id: 713, text: "Automation increases efficiency but raises severe structural unemployment concerns.", level: "Lớp 12 - U1: Khó (IRT: 2.9)", difficulty: 2.9 },
    { id: 714, text: "International diplomacy resolves military conflicts through peaceful conversations.", level: "Lớp 12 - U4: Khó (IRT: 3.1)", difficulty: 3.1 },
    { id: 715, text: "Space exploration expands our deep knowledge of the vast universe.", level: "Lớp 12 - U5: Rất Khó (IRT: 3.3)", difficulty: 3.3 }
  ],
  "A1": [
    { id: 1001, text: "Hello, my name is Alex and I am happy to meet you.", level: "Trình độ A1 - Cơ bản", difficulty: -2.5 },
    { id: 1002, text: "Where are you from and what is your favorite food?", level: "Trình độ A1 - Giao tiếp", difficulty: -2.4 },
    { id: 1003, text: "I live in a peaceful town with my family.", level: "Trình độ A1 - Đời sống", difficulty: -2.3 },
    { id: 1004, text: "What time do you usually wake up in the morning?", level: "Trình độ A1 - Thói quen", difficulty: -2.2 },
    { id: 1005, text: "My mother is a doctor and my father is a teacher.", level: "Trình độ A1 - Gia đình", difficulty: -2.1 },
    { id: 1006, text: "Can you please tell me how to get to the nearest bus stop?", level: "Trình độ A1 - Hỏi đường", difficulty: -2.0 },
    { id: 1007, text: "I like listening to music when I have free time.", level: "Trình độ A1 - Sở thích", difficulty: -1.9 },
    { id: 1008, text: "How much does this pair of shoes cost?", level: "Trình độ A1 - Mua sắm", difficulty: -1.8 },
    { id: 1009, text: "Today the weather is very nice and warm.", level: "Trình độ A1 - Thời tiết", difficulty: -1.7 },
    { id: 1010, text: "Would you like a cup of hot tea or coffee?", level: "Trình độ A1 - Giao tiếp", difficulty: -1.6 },
    { id: 1011, text: "I have two dogs and a small white cat at home.", level: "Trình độ A1 - Thú cưng", difficulty: -1.5 },
    { id: 1012, text: "My favorite school subject is English because it is useful.", level: "Trình độ A1 - Học tập", difficulty: -1.4 },
    { id: 1013, text: "What are your plans for this coming weekend?", level: "Trình độ A1 - Cuối tuần", difficulty: -1.3 },
    { id: 1014, text: "Excuse me, where is the main library located?", level: "Trình độ A1 - Hỏi đường", difficulty: -1.2 },
    { id: 1015, text: "We should eat fresh fruits to stay healthy.", level: "Trình độ A1 - Sức khỏe", difficulty: -1.1 },
    { id: 1016, text: "She enjoys reading books before going to sleep.", level: "Trình độ A1 - Sở thích", difficulty: -1.0 },
    { id: 1017, text: "Do you enjoy playing sports like football or tennis?", level: "Trình độ A1 - Thể thao", difficulty: -0.9 },
    { id: 1018, text: "I usually go to school by bicycle every morning.", level: "Trình độ A1 - Đi lại", difficulty: -0.8 },
    { id: 1019, text: "Please turn off the lights when you leave the room.", level: "Trình độ A1 - Đời sống", difficulty: -0.7 },
    { id: 1020, text: "Learning new words every day is a great habit.", level: "Trình độ A1 - Học tập", difficulty: -0.6 }
  ],
  "A2": [
    { id: 2001, text: "I am planning to visit my grandparents during the next vacation.", level: "Trình độ A2 - Du lịch", difficulty: -0.5 },
    { id: 2002, text: "Could you please speak a little slower so I can understand better?", level: "Trình độ A2 - Giao tiếp", difficulty: -0.4 },
    { id: 2003, text: "Doing outdoor exercise is good for both your physical and mental health.", level: "Trình độ A2 - Sức khỏe", difficulty: -0.3 },
    { id: 2004, text: "In my opinion, learning English online gives students more flexibility.", level: "Trình độ A2 - Ý kiến", difficulty: -0.2 },
    { id: 2005, text: "Many students enjoy joining social clubs to make new friends.", level: "Trình độ A2 - Trường học", difficulty: -0.1 },
    { id: 2006, text: "Environmental pollution is a serious problem in modern cities.", level: "Trình độ A2 - Môi trường", difficulty: 0.0 },
    { id: 2007, text: "We decided to stay home because it was raining heavily outside.", level: "Trình độ A2 - Giao tiếp", difficulty: 0.1 },
    { id: 2008, text: "Technology has changed the way people communicate with each other.", level: "Trình độ A2 - Công nghệ", difficulty: 0.2 },
    { id: 2009, text: "What is the most memorable experience you have ever had?", level: "Trình độ A2 - Kỷ niệm", difficulty: 0.3 },
    { id: 2010, text: "Recycling plastic waste helps protect marine life and nature.", level: "Trình độ A2 - Môi trường", difficulty: 0.4 },
    { id: 2011, text: "He has been practicing speaking English for over two years.", level: "Trình độ A2 - Học tập", difficulty: 0.5 },
    { id: 2012, text: "Public transport is much cheaper and more convenient than private cars.", level: "Trình độ A2 - Đi lại", difficulty: 0.6 },
    { id: 2013, text: "Volunteering is a great way to support poor people in your city.", level: "Trình độ A2 - Xã hội", difficulty: 0.7 },
    { id: 2014, text: "She hopes to improve her pronunciation skills by using AI software.", level: "Trình độ A2 - Phát âm", difficulty: 0.8 },
    { id: 2015, text: "Eating balanced meals regularly prevents many common diseases.", level: "Trình độ A2 - Sức khỏe", difficulty: 0.9 },
    { id: 2016, text: "Our class is going on a field trip to the national museum next week.", level: "Trình độ A2 - Dã ngoại", difficulty: 0.95 },
    { id: 2017, text: "Learning a new language opens up wonderful opportunities for travel.", level: "Trình độ A2 - Ngoại ngữ", difficulty: 0.98 },
    { id: 2018, text: "They spent the whole afternoon playing board games together at home.", level: "Trình độ A2 - Giải trí", difficulty: 1.0 }
  ],
  "B1": [
    { id: 3001, text: "Developing good critical thinking skills is essential for student success.", level: "Trình độ B1 - Kỹ năng", difficulty: 1.0 },
    { id: 3002, text: "Renewable energy sources like solar and wind power are sustainable solutions.", level: "Trình độ B1 - Môi trường", difficulty: 1.1 },
    { id: 3003, text: "Social media can have both positive and negative impacts on teenagers.", level: "Trình độ B1 - Xã hội", difficulty: 1.2 },
    { id: 3004, text: "Participating in group discussions helps improve confidence and teamwork.", level: "Trình độ B1 - Kỹ năng", difficulty: 1.3 },
    { id: 3005, text: "Cultural diversity makes our global society much richer and more vibrant.", level: "Trình độ B1 - Văn hóa", difficulty: 1.4 },
    { id: 3006, text: "Independent learning encourages students to explore topics deeply.", level: "Trình độ B1 - Giáo dục", difficulty: 1.5 },
    { id: 3007, text: "Managing time effectively reduces academic pressure during examination periods.", level: "Trình độ B1 - Học tập", difficulty: 1.6 },
    { id: 3008, text: "Global warming poses significant threats to coastal cities worldwide.", level: "Trình độ B1 - Khí hậu", difficulty: 1.7 },
    { id: 3009, text: "Career guidance programs help young people choose suitable career paths.", level: "Trình độ B1 - Hướng nghiệp", difficulty: 1.8 },
    { id: 3010, text: "Preserving historical monuments fosters national pride among citizens.", level: "Trình độ B1 - Di sản", difficulty: 1.9 },
    { id: 3011, text: "Online learning platforms provide flexible study schedules for high school students.", level: "Trình độ B1 - Học online", difficulty: 1.92 },
    { id: 3012, text: "Modern technology has transformed our daily communication habits completely.", level: "Trình độ B1 - Công nghệ", difficulty: 1.95 },
    { id: 3013, text: "Building a healthy routine requires discipline and clear daily objectives.", level: "Trình độ B1 - Thói quen", difficulty: 1.98 },
    { id: 3014, text: "Team sports teach students valuable lessons about collaboration and leadership.", level: "Trình độ B1 - Thể thao", difficulty: 2.0 },
    { id: 3015, text: "Understanding different perspectives is crucial for resolving interpersonal conflicts.", level: "Trình độ B1 - Giao tiếp", difficulty: 2.05 }
  ],
  "B2": [
    { id: 4001, text: "Artificial intelligence is revolutionizing communication, healthcare, and finance.", level: "Trình độ B2 - Công nghệ", difficulty: 2.0 },
    { id: 4002, text: "Globalization promotes economic integration but challenges local cultural identities.", level: "Trình độ B2 - Kinh tế", difficulty: 2.1 },
    { id: 4003, text: "Sustainable development models aim to balance growth with environmental protection.", level: "Trình độ B2 - Phát triển", difficulty: 2.2 },
    { id: 4004, text: "Automation increases productivity while introducing new challenges to the job market.", level: "Trình độ B2 - Việc làm", difficulty: 2.3 },
    { id: 4005, text: "Lifelong learning is crucial for professionals adapting to rapid technological shifts.", level: "Trình độ B2 - Học tập", difficulty: 2.4 },
    { id: 4006, text: "Effective intercultural communication minimizes prejudices in international teams.", level: "Trình độ B2 - Giao tiếp", difficulty: 2.5 },
    { id: 4007, text: "Digital transformation enables institutions to deliver seamless remote services.", level: "Trình độ B2 - Chuyển đổi số", difficulty: 2.6 },
    { id: 4008, text: "Promoting mental health awareness in education reduces student burnout.", level: "Trình độ B2 - Tâm lý", difficulty: 2.7 },
    { id: 4009, text: "Macroeconomic stability encourages foreign investments and fosters long-term prosperity.", level: "Trình độ B2 - Tài chính", difficulty: 2.72 },
    { id: 4010, text: "Biotechnology research plays a vital role in discovering innovative medical treatments.", level: "Trình độ B2 - Y học", difficulty: 2.75 },
    { id: 4011, text: "Environmental conservation demands immediate collective efforts from communities globally.", level: "Trình độ B2 - Khí hậu", difficulty: 2.78 },
    { id: 4012, text: "Ethical considerations must guide the rapid implementation of automated decision systems.", level: "Trình độ B2 - Đạo đức AI", difficulty: 2.8 },
    { id: 4013, text: "Space exploration expands our deep understanding of the cosmos and technological boundaries.", level: "Trình độ B2 - Vũ trụ", difficulty: 2.82 },
    { id: 4014, text: "Urbanization drives architectural innovation while putting pressure on municipal infrastructure.", level: "Trình độ B2 - Đô thị", difficulty: 2.85 },
    { id: 4015, text: "Fostering creative problem-solving skills empowers youth to navigate complex future challenges.", level: "Trình độ B2 - Tương lai", difficulty: 2.88 }
  ],
  "C1": [
    { id: 5001, text: "Addressing global climate change requires unprecedented international diplomatic cooperation.", level: "Trình độ C1 - Ngoại giao", difficulty: 2.8 },
    { id: 5002, text: "Generative artificial intelligence models synthesize complex unstructured data efficiently.", level: "Trình độ C1 - Khoa học AI", difficulty: 2.9 },
    { id: 5003, text: "Interdisciplinary research yields innovative breakthroughs for sustainable agriculture.", level: "Trình độ C1 - Nghiên cứu", difficulty: 3.0 },
    { id: 5004, text: "Implementing rigorous macroeconomic policies stabilizes currency fluctuations effectively.", level: "Trình độ C1 - Tài chính", difficulty: 3.1 },
    { id: 5005, text: "Biotechnology advancements offer profound solutions for hereditary medical conditions.", level: "Trình độ C1 - Y học", difficulty: 3.2 },
    { id: 5006, text: "Quantum computing paradigms promise to solve previously intractable computational problems.", level: "Trình độ C1 - Lượng tử", difficulty: 3.22 },
    { id: 5007, text: "Multilateral international agreements establish governance frameworks for planetary ecosystem preservation.", level: "Trình độ C1 - Thỏa thuận", difficulty: 3.24 },
    { id: 5008, text: "Epistemological inquiry into artificial cognitive architectures redefines our understanding of intelligence.", level: "Trình độ C1 - Triết học AI", difficulty: 3.26 },
    { id: 5009, text: "Socioeconomic disparity mitigation requires comprehensive fiscal reforms and educational equity initiatives.", level: "Trình độ C1 - Xã hội", difficulty: 3.28 },
    { id: 5010, text: "Neuroplasticity mechanisms underlie the extraordinary cognitive adaptability demonstrated throughout human adulthood.", level: "Trình độ C1 - Não bộ", difficulty: 3.3 },
    { id: 5011, text: "Sustainable architectural design integrates passive solar engineering and carbon-neutral construction materials.", level: "Trình độ C1 - Kiến trúc", difficulty: 3.32 },
    { id: 5012, text: "Algorithmic transparency in financial markets prevents systemic risk and guarantees equitable trading.", level: "Trình độ C1 - Tài chính", difficulty: 3.34 },
    { id: 5013, text: "Linguistic diversity preservation safeguards irreplaceable cultural heritage and indigenous ecological wisdom.", level: "Trình độ C1 - Ngôn ngữ", difficulty: 3.35 },
    { id: 5014, text: "Autonomous navigational systems leverage sensor fusion and deep neural networks for real-time decision-making.", level: "Trình độ C1 - Tự hành", difficulty: 3.38 },
    { id: 5015, text: "Diplomatic conflict resolution demands nuanced intercultural negotiation and mutual strategic concessions.", level: "Trình độ C1 - Hòa bình", difficulty: 3.4 }
  ]
};

export default function PronunciationAssessor({ selectedGrade, keys }) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // THUẬT TOÁN THÍCH ỨNG IRT & SPACED REPETITION (SM-2)
  const [theta, setTheta] = useState(0.0); // Năng lực học tập ước lượng hiện tại
  const [history, setHistory] = useState([]); // Lịch sử làm bài: [{question, response}]
  const [isAdaptive, setIsAdaptive] = useState(true); // Bật/tắt chế độ thích ứng IRT
  const [loadingNext, setLoadingNext] = useState(false); // Trạng thái tải câu tiếp theo
  const [spacedRepetitionInfo, setSpacedRepetitionInfo] = useState(null); // Thông tin ôn tập SM-2

  // Ngân hàng câu hỏi động tải từ backend API & Gemini AI
  const [dynamicSentences, setDynamicSentences] = useState([]);
  const [aiSentences, setAiSentences] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAutoAI, setIsAutoAI] = useState(true); // Bật chế độ tự động sinh câu AI liên tục bằng Gemini
  const [selectedWordInfo, setSelectedWordInfo] = useState(null); // Từ được click để nghe lại & xem hướng dẫn sửa âm

  const playWordSample = (wordText) => {
    if (!wordText) return;
    try {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis?.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Tải danh sách câu hỏi mỗi lớp/trình độ từ backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/content/pronounce/sentences?grade=${selectedGrade}`);
        if (response.data.status === 'success' && response.data.data?.length > 0) {
          const mapped = response.data.data
            .filter(s => s.is_active)
            .map(s => ({
              id: s.id,
              text: s.text,
              level: `Lớp ${s.level_grade} (IRT: ${s.difficulty.toFixed(1)})`,
              difficulty: s.difficulty
            }));
          if (mapped.length > 0) {
            setDynamicSentences(mapped);
            return;
          }
        }
        setDynamicSentences([]);
      } catch (err) {
        console.error("Dùng ngân hàng câu hỏi nội bộ fallback:", err);
        setDynamicSentences([]);
      }
    };
    fetchQuestions();
  }, [selectedGrade]);

  // Sinh câu phát âm ngẫu nhiên mới bằng Gemini AI
  const generateNewAISentences = async (count = 1) => {
    setIsGeneratingAI(true);
    try {
      const generated = [];
      for (let i = 0; i < count; i++) {
        const response = await axios.post(
          `${API_BASE}/pronounce/generate-sentence`,
          { level: selectedGrade },
          { headers: getHeaders() }
        );
        if (response.data?.sentence) {
          generated.push(response.data.sentence);
        }
      }
      if (generated.length > 0) {
        setAiSentences(prev => [...generated, ...prev]);
        setAssessmentResult(null);
      }
    } catch (err) {
      console.error("Lỗi sinh câu AI:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Tự động sinh câu AI khi chuyển trình độ nếu bật Auto AI
  useEffect(() => {
    if (isAutoAI && keys?.gemini) {
      generateNewAISentences(2);
    }
  }, [selectedGrade]);

  // Lọc câu hỏi tương ứng khối lớp / trình độ CEFR - Hợp nhất DB và ngân hàng nội bộ
  const basePool = useMemo(() => {
    const localBank = SENTENCES_BY_GRADE[selectedGrade] || SENTENCES_BY_GRADE["12"] || [];
    const combined = [...dynamicSentences, ...localBank];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      const clean = (item.text || '').trim().toLowerCase();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique : localBank;
  }, [dynamicSentences, selectedGrade]);

  const sentences = useMemo(() => [...aiSentences, ...basePool], [aiSentences, basePool]);
  const currentSentence = sentences[currentSentenceIndex] || sentences[0] || { text: "Welcome to AI English Mentor.", level: "Default" };

  // Reset khi đổi khối lớp
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setAiSentences([]);
    setAssessmentResult(null);
    setTheta(0.0);
    setHistory([]);
    setSpacedRepetitionInfo(null);
  }, [selectedGrade]);

  // Helper lấy headers chứa Azure Key và Gemini Key
  const getHeaders = (isMultipart = false) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (keys?.azure) headers['x-azure-key'] = keys.azure;
    if (keys?.gemini) headers['x-gemini-key'] = keys.gemini;
    return headers;
  };

  // Phát âm câu mẫu chuẩn (TTS)
  const playSample = async () => {
    setIsPlayingSample(true);
    try {
      const response = await axios.post(
        `${API_BASE}/tts`,
        { text: currentSentence.text },
        { 
          responseType: 'blob',
          headers: getHeaders()
        }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingSample(false);
      audio.onerror = () => setIsPlayingSample(false);
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát giọng mẫu:", error);
      setIsPlayingSample(false);
    }
  };

  // Bắt đầu ghi âm giọng đọc (Tối ưu cho cả Mobile Safari/Chrome và Desktop)
  const startRecording = async () => {
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      let options = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          options = { mimeType: 'audio/aac' };
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        sendToAssessment(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      // Gọi start với chu kỳ 250ms để liên tục thu thập chunk trên di động
      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (error) {
      console.error("Lỗi micro:", error);
      setAssessmentResult({
        silenceDetected: true,
        errorNotice: "Không thể truy cập Microphone. Vui lòng cấp quyền Microphone cho trình duyệt trong Cài đặt của điện thoại.",
        words: []
      });
    }
  };

  // Dừng ghi âm và gửi đi chấm điểm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Gửi file ghi âm lên backend chấm điểm
  const sendToAssessment = async (audioBlob) => {
    setIsLoading(true);
    setAssessmentResult(null);

    const refWords = currentSentence.text.split(/\s+/).map(w => w.replace(/[.,!?"']/g, '').trim()).filter(Boolean);

    // Kiểm tra nếu audio quá bé (< 1000 bytes)
    if (!audioBlob || audioBlob.size < 1000) {
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
      setIsLoading(false);
      return;
    }

    let ext = 'webm';
    if (audioBlob.type.includes('mp4')) ext = 'mp4';
    else if (audioBlob.type.includes('aac') || audioBlob.type.includes('m4a')) ext = 'm4a';
    else if (audioBlob.type.includes('wav')) ext = 'wav';
    else if (audioBlob.type.includes('ogg')) ext = 'ogg';

    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${ext}`);
    formData.append('reference_text', currentSentence.text);

    try {
      const response = await axios.post(`${API_BASE}/pronounce-assess`, formData, {
        headers: getHeaders(true)
      });
      
      const nbest = response.data.NBest?.[0];
      const isSilence = response.data.RecognitionStatus === 'InitialSilenceTimeout' || (!nbest || nbest.PronunciationAssessment?.PronunciationScore === 0);

      if (isSilence) {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
        setIsLoading(false);
        return;
      }

      if (nbest) {
        let overallScore = nbest.PronunciationAssessment?.PronunciationScore || 0;
        let accuracy = nbest.PronunciationAssessment?.AccuracyScore || 0;
        let fluency = nbest.PronunciationAssessment?.FluencyScore || 0;
        let completeness = nbest.PronunciationAssessment?.CompletenessScore || 0;
        
        let evaluatedWords = (nbest.Words || []).map(w => {
          const wText = w.Word || w.word || '';
          const acc = w.PronunciationAssessment?.AccuracyScore ?? w.accuracyScore ?? 0;
          const err = w.PronunciationAssessment?.ErrorType ?? (acc >= 70 ? 'None' : 'Mispronunciation');
          return {
            Word: wText,
            word: wText,
            accuracyScore: acc,
            errorType: err
          };
        });

        const isReallySilent = evaluatedWords.length === 0 || evaluatedWords.every(w => w.accuracyScore === 0);

        setAssessmentResult({
          accuracyScore: accuracy,
          fluencyScore: fluency,
          completenessScore: completeness,
          pronunciationScore: overallScore,
          silenceDetected: isReallySilent,
          words: evaluatedWords
        });

        // Cập nhật IRT Năng lực
        const responseVal = overallScore >= 70 ? 1 : 0;
        const newHistoryItem = {
          question: {
            item_id: (currentSentence.id || 1).toString(),
            difficulty: currentSentence.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          },
          response: responseVal
        };
        const updatedHistory = [...history, newHistoryItem];
        setHistory(updatedHistory);

        try {
          const thetaRes = await axios.post(`${API_BASE}/adaptive/update-ability`, {
            history: updatedHistory
          });
          if (thetaRes.data.status === 'success') {
            setTheta(thetaRes.data.new_theta);
          }
        } catch (err) {}

        // Cập nhật SM-2 Spaced Repetition
        let quality = overallScore >= 85 ? 5 : overallScore >= 70 ? 4 : overallScore >= 55 ? 3 : 2;
        const currentRep = spacedRepetitionInfo?.repetition || 0;
        const currentEF = spacedRepetitionInfo?.ef || 2.5;
        const currentInterval = spacedRepetitionInfo?.interval || 1;

        try {
          const sm2Res = await axios.post(`${API_BASE}/spaced-repetition/next-review`, {
            quality: quality,
            current_repetition: currentRep,
            current_ef: currentEF,
            current_interval: currentInterval
          });
          if (sm2Res.data.status === 'success') {
            setSpacedRepetitionInfo({
              interval: sm2Res.data.next_interval_days,
              ef: sm2Res.data.new_ef,
              repetition: sm2Res.data.new_repetition,
              qualityScore: quality
            });
          }
        } catch (err) {}

      } else {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
      }
    } catch (error) {
      console.error("Lỗi chấm phát âm:", error);
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi ngẫu nhiên một câu trong ngân hàng
  const jumpRandomSentence = () => {
    if (sentences.length <= 1) return;
    let nextIdx;
    let tries = 0;
    do {
      nextIdx = Math.floor(Math.random() * sentences.length);
      tries++;
    } while (nextIdx === currentSentenceIndex && tries < 10);
    setCurrentSentenceIndex(nextIdx);
    setAssessmentResult(null);
    setSpacedRepetitionInfo(null);
  };

  // Quay lại câu trước
  const prevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
      setAssessmentResult(null);
      setSpacedRepetitionInfo(null);
    }
  };

  // Chuyển câu tiếp theo
  const nextSentence = async () => {
    setSpacedRepetitionInfo(null);

    // Nếu bật Auto AI, tự động sinh thêm 1 câu AI mới ở background khi tiến gần cuối danh sách
    if (isAutoAI && currentSentenceIndex >= sentences.length - 2) {
      generateNewAISentences(1);
    }

    // Nếu bật chế độ thích ứng IRT
    if (isAdaptive && history.length > 0) {
      setLoadingNext(true);
      try {
        const nextQRes = await axios.post(`${API_BASE}/adaptive/next-question`, {
          theta: theta,
          excluded_ids: history.map(h => h.question.item_id),
          pool: sentences.map(s => ({
            item_id: (s.id || 1).toString(),
            difficulty: s.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          }))
        });

        if (nextQRes.data.status === 'success') {
          const nextQuestionId = parseInt(nextQRes.data.question.item_id);
          const nextIndex = sentences.findIndex(s => s.id === nextQuestionId);
          if (nextIndex !== -1) {
            setCurrentSentenceIndex(nextIndex);
            setAssessmentResult(null);
            setLoadingNext(false);
            return;
          }
        }
      } catch (err) {
        console.error("Lỗi chọn câu hỏi thích ứng:", err);
      } finally {
        setLoadingNext(false);
      }
    }

    // Luồng chuyển câu bình thường tuần tự (xoay vòng)
    setCurrentSentenceIndex(prev => (prev + 1) % sentences.length);
    setAssessmentResult(null);
  };

  // Màu từ phát âm
  const getWordColor = (wordAssessment) => {
    if (!wordAssessment) return 'text-gray-300';
    const errorType = wordAssessment.errorType || wordAssessment.PronunciationAssessment?.ErrorType;
    const score = wordAssessment.accuracyScore ?? wordAssessment.PronunciationAssessment?.AccuracyScore ?? 0;
    
    if (errorType === 'Omission' || score === 0) return 'text-gray-600 line-through';
    if (errorType === 'Mispronunciation' || score < 70) return 'text-red-400 font-bold underline decoration-wavy decoration-red-500';
    return 'text-emerald-400 font-extrabold';
  };

  return (
    <div className="w-full py-2 px-1 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 glass rounded-2xl mb-6 shadow-md border border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white font-outfit tracking-wide">Luyện &amp; Chấm Phát âm AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Luyện phát âm theo <strong className="text-brand-400">Trình độ {selectedGrade}</strong> ({sentences.length} câu sẵn có &amp; Sinh câu ngẫu nhiên không giới hạn bằng Gemini AI)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nút Đổi câu ngẫu nhiên */}
          <button
            onClick={jumpRandomSentence}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Chọn ngẫu nhiên một câu khác trong ngân hàng câu hỏi"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Đổi câu ngẫu nhiên</span>
          </button>

          {/* Nút Tạo 3 câu AI bằng Gemini */}
          <button
            onClick={() => generateNewAISentences(3)}
            disabled={isGeneratingAI}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow glow-btn-brand"
            title="Kích hoạt Gemini AI tạo thêm 3 câu luyện phát âm ngẫu nhiên mới"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Gemini đang tạo câu...' : '+3 Câu Gemini AI'}</span>
          </button>

          {/* Toggle Auto AI Generation */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs" title="Tự động sinh thêm câu phát âm ngẫu nhiên từ Gemini AI khi thực hành">
            <span className="text-gray-300 font-semibold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Auto AI
            </span>
            <button
              onClick={() => setIsAutoAI(!isAutoAI)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAutoAI ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAutoAI ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Chỉ số câu hỏi hiện tại */}
          <div className="text-xs text-gray-300 font-bold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            Câu <span className="text-indigo-400 font-black text-sm">{currentSentenceIndex + 1}</span>/{sentences.length}
            {aiSentences.length > 0 && <span className="text-[10px] text-amber-400 ml-1 font-normal">(+{aiSentences.length} AI)</span>}
          </div>

          {/* Toggle IRT */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-semibold">Thích ứng IRT</span>
            <button
              onClick={() => setIsAdaptive(!isAdaptive)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAdaptive ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAdaptive ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-brand-400 font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 flex items-center gap-1.5 border border-brand-500/20">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>{currentSentence.level}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Câu cần đọc & Nút điều khiển */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md relative overflow-hidden min-h-[220px] flex flex-col justify-between border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
            
            <div className="text-2xl md:text-3xl font-medium leading-relaxed font-outfit text-gray-100 py-2">
              {assessmentResult && !assessmentResult.silenceDetected ? (
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {assessmentResult.words.map((wordObj, i) => (
                    <span key={i} className={getWordColor(wordObj)}>
                      {wordObj.Word || wordObj.word}
                    </span>
                  ))}
                </div>
              ) : (
                currentSentence.text
              )}
            </div>

            {assessmentResult?.silenceDetected && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-fade-in mt-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Chưa phát hiện giọng nói: Micro chưa thu được tiếng của bạn hoặc âm lượng quá nhỏ. Bạn hãy bấm Micro lại và đọc to, rõ ràng câu mẫu nhé!</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={playSample}
                disabled={isPlayingSample || isRecording || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition glow-btn-dark cursor-pointer ${
                  isPlayingSample ? 'text-amber-400 animate-pulse bg-amber-400/5' : ''
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingSample ? 'Đang đọc...' : 'Nghe phát âm chuẩn'}</span>
              </button>

              <div className="text-[11px] text-gray-500 italic">
                {currentSentence.topic ? `Chủ đề: ${currentSentence.topic}` : `Trình độ ${selectedGrade}`}
              </div>
            </div>
          </div>

          {/* Điều khiển ghi âm */}
          <div className="flex items-center justify-center gap-6 p-4">
            <button
              onClick={prevSentence}
              disabled={isRecording || isLoading || currentSentenceIndex === 0}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu trước đó"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shadow-lg shadow-red-500/20 pulse-record glow-btn-danger cursor-pointer"
                title="Dừng ghi âm và nhận diện"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isPlayingSample || isLoading}
                className="w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-800 flex items-center justify-center text-white transition shadow-lg shadow-brand-500/20 glow-btn-brand cursor-pointer"
                title="Bắt đầu nói"
              >
                <Mic className="w-9 h-9" />
              </button>
            )}

            <button
              onClick={jumpRandomSentence}
              disabled={isRecording || isLoading}
              className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition border border-amber-500/20 glow-btn-dark cursor-pointer"
              title="Đổi ngẫu nhiên câu khác"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={nextSentence}
              disabled={isRecording || isLoading || loadingNext}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu tiếp theo"
            >
              <ChevronRight className={`w-6 h-6 ${loadingNext ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Cột phải: Kết quả phân tích từ AI */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md min-h-[350px] flex flex-col justify-between border border-white/5">
            <h3 className="font-bold text-gray-200 text-sm mb-4 border-b border-white/5 pb-3">Phân tích phát âm</h3>
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
                <span className="text-xs text-gray-400">AI đang lắng nghe và phân tích từng âm...</span>
              </div>
            ) : assessmentResult && !assessmentResult.silenceDetected ? (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl md:text-2xl font-black text-white font-outfit">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.8) ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          Phát âm Chuẩn &amp; Rõ Ràng
                        </span>
                      ) : assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.5) ? (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          Khá Tốt • Cần Chỉnh Vài Âm
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-6 h-6 text-rose-400" />
                          Cần Luyện Rõ Âm Đuôi
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold mt-1">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length || 0} / {assessmentResult.words?.length || 0} từ đọc chuẩn xác
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-brand-400" />
                  </div>
                </div>

                {/* Phân tích từ đúng vs từ cần sửa */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span>Phân tích chi tiết từng từ:</span>
                    <span className="text-[10px] text-gray-500 font-normal">Bấm vào từ để nghe riêng</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessmentResult.words?.map((w, idx) => {
                      const wordText = w.Word || w.word;
                      const isGood = (w.accuracyScore || 0) >= 70;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            playWordSample(wordText);
                            setSelectedWordInfo({
                              word: wordText,
                              isGood: isGood
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isGood
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 animate-pulse'
                          }`}
                          title="Bấm để nghe AI phát âm chậm riêng từ này"
                        >
                          <span>{wordText}</span>
                          <span>{isGood ? '✓' : '⚠️'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedWordInfo && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-white font-bold">"{selectedWordInfo.word}":</span>
                        <span className="text-gray-300">
                          {selectedWordInfo.isGood ? 'Đã phát âm chuẩn xác!' : 'Cần bật rõ âm đuôi và nhấn đúng trọng âm.'}
                        </span>
                      </div>
                      <button
                        onClick={() => playWordSample(selectedWordInfo.word)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 cursor-pointer transition"
                      >
                        🔊 Nghe lại
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ chuẩn xác nguyên âm &amp; phụ âm</span>
                      <span className="text-emerald-400 font-bold">
                        {assessmentResult.accuracyScore >= 80 ? 'Rất chuẩn xác' : assessmentResult.accuracyScore >= 60 ? 'Tương đối tốt' : 'Cần chú ý âm đuôi'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(15, assessmentResult.accuracyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ lưu loát &amp; ngắt nghỉ tự nhiên</span>
                      <span className="text-brand-400 font-bold">
                        {assessmentResult.fluencyScore >= 75 ? 'Tự nhiên & Trôi chảy' : 'Khá lưu loát'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.max(20, assessmentResult.fluencyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Mức độ hoàn thành câu</span>
                      <span className="text-indigo-400 font-bold">
                        {assessmentResult.completenessScore >= 80 ? 'Hoàn thành trọn vẹn' : 'Đã đọc hầu hết các từ'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(25, assessmentResult.completenessScore)}%` }}></div>
                    </div>
                  </div>
                </div>

                {spacedRepetitionInfo && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 border border-brand-500/10 space-y-1.5">
                    <div className="text-[11px] text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Chu kỳ ôn tập ngắt quãng (SM-2)</span>
                    </div>
                    <div className="text-xs text-white font-medium">
                      Lịch nhắc nhở luyện lại câu này: <span className="text-emerald-400 font-bold underline">Sau {spacedRepetitionInfo.interval} ngày</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-lg">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-sm font-bold text-white">Sẵn sàng nhận diện phát âm</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Nhấn nút <strong className="text-emerald-400">Micro</strong> và đọc to câu mẫu tiếng Anh. AI sẽ chỉ ra từ nào bạn đọc chuẩn (màu xanh ✓) và từ nào cần sửa lại (màu đỏ ⚠️).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
