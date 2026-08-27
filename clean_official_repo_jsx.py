# -*- coding: utf-8 -*-

with open('frontend/src/components/OfficialExamRepository.jsx', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Extract from export default function OfficialExamRepository onwards
component_start = old_content.find('export default function OfficialExamRepository')
if component_start == -1:
    print("Could not find component start!")
else:
    component_code = old_content[component_start:]
    
    header_code = """import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Award, Clock, ArrowRight, 
  Search, Filter, BookOpen, Download, ExternalLink, Sparkles, Zap, ChevronRight,
  Eye, Check, X, HelpCircle, ChevronDown, ChevronUp, RotateCcw, AlertCircle, Building2, MapPin
} from 'lucide-react';
import { COMPREHENSIVE_EXAMS_DATABASE } from '../data/officialExamsData';

export { COMPREHENSIVE_EXAMS_DATABASE };
export const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;

"""
    new_jsx = header_code + component_code
    with open('frontend/src/components/OfficialExamRepository.jsx', 'w', encoding='utf-8') as f:
        f.write(new_jsx)
    print("OfficialExamRepository.jsx successfully cleaned and connected to officialExamsData.js!")
